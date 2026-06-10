/**
 * knowledge-deps.js
 *
 * Analyzes logical (evolutionary) coupling between lib/ files using git history.
 * Computes the three standard association-rule mining metrics — support,
 * confidence, and lift — following the methodology of Gall et al. and
 * D'Ambros, Lanza, Lungu (Evolution Radar, TSE 2009).
 *
 * Usage (from the node git repo root):
 *   node knowledge-deps.js [--since 2024-01-01] [--ref v25.9.0] [--max-files 16]
 *
 * Options:
 *   --since YYYY-MM-DD   Lower-bound commit date (default: 2024-01-01).
 *   --ref REF            Upper-bound git ref (default: v25.9.0). The analysis walks
 *                        history backwards from this ref, so it does not depend on
 *                        the user's current HEAD.
 *   --max-files N        Ignore commits touching more than N lib/ files (default: 16).
 *                        Pass a very large number to effectively disable filtering.
 *
 * The default --max-files 16 was chosen from this repository's commit-size
 * distribution: a natural gap separates commits touching <=16 lib/ files
 * (focused development) from a small tail of outliers touching 23-93 files
 * (linting passes, copyright updates and other mechanical bulk changes).
 * Filtering large commits is standard practice in the logical-coupling
 * literature; see Oliva & Gerosa (2015), Zimmermann et al. (ROSE, ICSE 2004 /
 * TSE 2005). The literature also warns that aggressive filtering risks
 * discarding genuine refactorings, hence the conservative threshold.
 *
 * Metrics (per pair {A, B} given N analyzed commits):
 *   - support(A, B)       = co-changes(A, B) / N
 *   - confidence(A -> B)  = co-changes(A, B) / changes(A)   (directional)
 *   - confidence(B -> A)  = co-changes(A, B) / changes(B)
 *   - lift(A, B)          = support(A, B) / (support(A) * support(B))
 *                           > 1: co-changes more than chance predicts
 *                           = 1: independence
 *                           < 1: actively avoid co-changing
 *
 * References:
 * [1] Agrawal, R., Imieliński, T., Swami, A. "Mining association rules between sets 
 * of items in large databases", ACM SIGMOD 1993. (Foundations of Support/Confidence).
 * [2] Gall, H., Hajek, K., Jazayeri, M. "Detection of logical coupling based on 
 * product release history", ICSM 1998. (Origin of Logical Coupling).
 * [3] Zimmermann, T., Weisgerber, P., Diehl, S., Zeller, A. "Mining Version Histories 
 * to Guide Software Changes", IEEE TSE 31(6):429-445, 2005.
 * [4] D'Ambros, M., Lanza, M., Lungu, M. "Visualizing Co-Change Information with 
 * the Evolution Radar", IEEE TSE 35(5):720-735, 2009.
 * [5] Oliva, G., Gerosa, M. "Change Coupling Between Software Artifacts: Learning 
 * from Past Changes", The Art and Science of Analyzing Software Data, 2015.
 *
 * Outputs:
 *   - Console: ranked tables
 *   - knowledge-deps-data.json: full data for compare-deps.js
 */

const { execSync } = require('child_process');
const fs = require('fs');

// ---------- Parse CLI args ----------
const args = process.argv.slice(2);

function getStringArg(name, defaultVal) {
  const idx = args.indexOf(name);
  if (idx !== -1 && args[idx + 1]) return args[idx + 1];
  return defaultVal;
}

function getIntArg(name, defaultVal) {
  const idx = args.indexOf(name);
  if (idx !== -1 && args[idx + 1]) return parseInt(args[idx + 1], 10);
  return defaultVal;
}

const SINCE = getStringArg('--since', '2024-01-01');
const REF = getStringArg('--ref', 'v25.9.0');
const MAX_FILES = getIntArg('--max-files', 16);

// ---------- Extract git history ----------
let gitOutput;
try {
  const cmd = `git log ${REF} --name-only --pretty=format:"COMMIT:%H" --since="${SINCE}" -- lib/`;
  gitOutput = execSync(cmd, { encoding: 'utf8', maxBuffer: 100 * 1024 * 1024 });
} catch (err) {
  console.error('Error running git log. Make sure:');
  console.error(`  - You are inside a clone of the Node.js repository.`);
  console.error(`  - The ref "${REF}" exists locally (you may need: git fetch --tags).`);
  console.error('');
  console.error('Example bootstrap:');
  console.error('  git clone https://github.com/nodejs/node.git');
  console.error('  cd node');
  console.error('  node knowledge-deps.js');
  process.exit(1);
}

// ---------- Parse commits ----------
const commits = [];
let currentFiles = [];

for (const line of gitOutput.trim().split('\n')) {
  if (line.startsWith('COMMIT:')) {
    if (currentFiles.length > 0) commits.push(currentFiles);
    currentFiles = [];
  } else {
    const trimmed = line.trim();
    if (trimmed.startsWith('lib/') && (trimmed.endsWith('.js') || trimmed.endsWith('.mjs'))) {
      currentFiles.push(trimmed);
    }
  }
}
if (currentFiles.length > 0) commits.push(currentFiles);

// ---------- Filter large commits ----------
const filteredCommits = commits.filter(c => c.length <= MAX_FILES);
const skipped = commits.length - filteredCommits.length;
const N = filteredCommits.length;

console.log(`Analysis scope: commits since ${SINCE}, ending at ${REF}`);
console.log(`Total commits touching lib/: ${commits.length}`);
console.log(`Filtered out ${skipped} commits with > ${MAX_FILES} lib/ files`);
console.log(`Analyzing ${N} commits\n`);

// ---------- Count file changes and co-changes ----------
const cochange = {};
const fileChanges = {};

for (const files of filteredCommits) {
  const unique = [...new Set(files)].sort();
  for (const f of unique) {
    fileChanges[f] = (fileChanges[f] || 0) + 1;
  }
  for (let i = 0; i < unique.length; i++) {
    for (let j = i + 1; j < unique.length; j++) {
      const key = `${unique[i]}|||${unique[j]}`;
      cochange[key] = (cochange[key] || 0) + 1;
    }
  }
}

// ---------- Compute association-rule metrics ----------
const pairs = [];

for (const [key, count] of Object.entries(cochange)) {
  const [a, b] = key.split('|||');
  const changesA = fileChanges[a];
  const changesB = fileChanges[b];

  const support = count / N;
  const confAtoB = count / changesA;
  const confBtoA = count / changesB;
  const lift = (count * N) / (changesA * changesB);

  pairs.push({
    a, b,
    coChanges: count,
    changesA,
    changesB,
    support,
    confAtoB,
    confBtoA,
    maxConf: Math.max(confAtoB, confBtoA),
    lift,
  });
}

// ---------- Top pairs by raw co-change count ----------
console.log('='.repeat(140));
console.log('  TOP 20 PAIRS BY RAW CO-CHANGE COUNT');
console.log('='.repeat(140));
console.log(
  '  ' + 'Co-ch'.padStart(6) +
  '  ' + 'Sup%'.padStart(6) +
  '  ' + 'C(A->B)'.padStart(8) +
  '  ' + 'C(B->A)'.padStart(8) +
  '  ' + 'Lift'.padStart(6) +
  '  ' + 'File A'.padEnd(45) +
  '  ' + 'File B'.padEnd(45)
);
console.log('-'.repeat(140));

const byCoChanges = [...pairs].sort((x, y) => y.coChanges - x.coChanges);
for (const p of byCoChanges.slice(0, 20)) {
  console.log(
    '  ' + String(p.coChanges).padStart(6) +
    '  ' + (p.support * 100).toFixed(2).padStart(6) +
    '  ' + p.confAtoB.toFixed(3).padStart(8) +
    '  ' + p.confBtoA.toFixed(3).padStart(8) +
    '  ' + p.lift.toFixed(1).padStart(6) +
    '  ' + p.a.padEnd(45) +
    '  ' + p.b.padEnd(45)
  );
}

// ---------- Top rules by confidence ----------
const MIN_COCHANGES = 3;
console.log('\n' + '='.repeat(140));
console.log(`  TOP 20 RULES BY CONFIDENCE (filtering pairs with < ${MIN_COCHANGES} co-changes)`);
console.log('  Confidence(A -> B): "given that A was changed, how often was B also changed?"');
console.log('='.repeat(140));
console.log(
  '  ' + 'Conf'.padStart(6) +
  '  ' + 'Co-ch'.padStart(6) +
  '  ' + 'Ch(A)'.padStart(6) +
  '  ' + 'Lift'.padStart(6) +
  '  ' + 'Source A'.padEnd(45) +
  '  ' + 'Target B'.padEnd(45)
);
console.log('-'.repeat(140));

const rules = [];
for (const p of pairs) {
  if (p.coChanges < MIN_COCHANGES) continue;
  rules.push({
    source: p.a, target: p.b,
    confidence: p.confAtoB,
    coChanges: p.coChanges, changesSource: p.changesA, lift: p.lift,
  });
  rules.push({
    source: p.b, target: p.a,
    confidence: p.confBtoA,
    coChanges: p.coChanges, changesSource: p.changesB, lift: p.lift,
  });
}
rules.sort((x, y) => y.confidence - x.confidence);

for (const r of rules.slice(0, 20)) {
  console.log(
    '  ' + r.confidence.toFixed(3).padStart(6) +
    '  ' + String(r.coChanges).padStart(6) +
    '  ' + String(r.changesSource).padStart(6) +
    '  ' + r.lift.toFixed(1).padStart(6) +
    '  ' + r.source.padEnd(45) +
    '  ' + r.target.padEnd(45)
  );
}

// ---------- Top pairs by lift ----------
console.log('\n' + '='.repeat(140));
console.log(`  TOP 20 PAIRS BY LIFT (filtering pairs with < ${MIN_COCHANGES} co-changes)`);
console.log('  Lift > 1 means the pair co-changes more often than chance predicts.');
console.log('='.repeat(140));
console.log(
  '  ' + 'Lift'.padStart(6) +
  '  ' + 'Co-ch'.padStart(6) +
  '  ' + 'C(A->B)'.padStart(8) +
  '  ' + 'C(B->A)'.padStart(8) +
  '  ' + 'File A'.padEnd(45) +
  '  ' + 'File B'.padEnd(45)
);
console.log('-'.repeat(140));

const byLift = pairs
  .filter(p => p.coChanges >= MIN_COCHANGES)
  .sort((x, y) => y.lift - x.lift);

for (const p of byLift.slice(0, 20)) {
  console.log(
    '  ' + p.lift.toFixed(1).padStart(6) +
    '  ' + String(p.coChanges).padStart(6) +
    '  ' + p.confAtoB.toFixed(3).padStart(8) +
    '  ' + p.confBtoA.toFixed(3).padStart(8) +
    '  ' + p.a.padEnd(45) +
    '  ' + p.b.padEnd(45)
  );
}

// ---------- Most frequently changed files ----------
console.log('\n' + '='.repeat(80));
console.log('  TOP 20 MOST FREQUENTLY CHANGED FILES');
console.log('='.repeat(80));
const sortedFiles = Object.entries(fileChanges).sort((a, b) => b[1] - a[1]);
for (const [f, count] of sortedFiles.slice(0, 20)) {
  console.log(`  ${String(count).padStart(4)} changes (${((count / N) * 100).toFixed(1).padStart(4)}% of commits)  ${f}`);
}

// ---------- Summary ----------
const allCo = pairs.map(p => p.coChanges);
console.log('\n' + '='.repeat(80));
console.log('  SUMMARY');
console.log('='.repeat(80));
console.log(`  Analyzed commits: ${N}`);
console.log(`  Distinct files touched: ${Object.keys(fileChanges).length}`);
console.log(`  Distinct co-change pairs: ${pairs.length}`);
console.log(`  Pairs with >= ${MIN_COCHANGES} co-changes: ${pairs.filter(p => p.coChanges >= MIN_COCHANGES).length}`);
console.log(`  Max co-change count: ${allCo.length > 0 ? Math.max(...allCo) : 0}`);
console.log(`  Max lift: ${pairs.length > 0 ? Math.max(...pairs.map(p => p.lift)).toFixed(1) : 'n/a'}`);

// ---------- Save JSON ----------
const cochangePairs = {};
for (const p of pairs) {
  cochangePairs[`${p.a}|||${p.b}`] = p.coChanges;
}

const output = {
  cochangePairs,
  fileChanges,
  pairs,
  scope: { since: SINCE, ref: REF, maxFiles: MAX_FILES },
  numCommitsTotal: commits.length,
  numCommitsAnalyzed: N,
  numCommitsFiltered: skipped,
};

fs.writeFileSync('knowledge-deps-data.json', JSON.stringify(output, null, 2));
console.log('\nData saved to knowledge-deps-data.json');