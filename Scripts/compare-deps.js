#!/usr/bin/env node
/**
 * compare-deps.js
 *
 * Cross-references structural code dependencies from dependency-cruiser
 * against coupling from git co-change, using the association-rule mining 
 * metrics computed by knowledge-deps.js.
 *
 * Usage:
 *   node compare-deps.js [structural-dependencies.json] [knowledge-deps-data.json]
 */

const fs = require('fs');

const dcPath = process.argv[2] || 'structural-dependencies.json';
const kdPath = process.argv[3] || 'knowledge-deps-data.json';

for (const p of [dcPath, kdPath]) {
  if (!fs.existsSync(p)) {
    console.error(`Missing: ${p}`);
    process.exit(1);
  }
}

// ============================================================
// Load dependency-cruiser data (same logic as analyze-deps.js)
// ============================================================
const dcData = JSON.parse(fs.readFileSync(dcPath, 'utf8'));
const modules = dcData.modules;

const realFilesIndex = new Set();
modules.forEach(mod => {
  if (mod.source.startsWith('lib/')) realFilesIndex.add(mod.source);
});

function normalizeInternalPath(t) {
  if (realFilesIndex.has(t)) return t;
  const jsPath = `lib/${t}.js`;
  if (realFilesIndex.has(jsPath)) return jsPath;
  const directPath = `lib/${t}`;
  if (realFilesIndex.has(directPath)) return directPath;
  return `lib/${t}.js`;
}

const codePairs = new Set();
const fanInMap = {};        // target -> Set of sources
const dependentsMap = {};   // target -> Set of files that import it (same as fanInMap)

modules.forEach(mod => {
  if (!mod.source.startsWith('lib/')) return;
  if (!fanInMap[mod.source]) fanInMap[mod.source] = new Set();

  mod.dependencies.forEach(dep => {
    const raw = dep.resolved || dep.module;
    if (dep.coreModule === true) return;
    const target = normalizeInternalPath(raw);

    if (!fanInMap[target]) fanInMap[target] = new Set();
    fanInMap[target].add(mod.source);

    const pair = [mod.source, target].sort();
    codePairs.add(`${pair[0]}|||${pair[1]}`);
  });
});

console.log(`Code dependency graph: ${realFilesIndex.size} files, ${codePairs.size} unique pairs`);

// ============================================================
// Load knowledge-deps data
// ============================================================
const kdData = JSON.parse(fs.readFileSync(kdPath, 'utf8'));

if (!kdData.pairs) {
  console.error('knowledge-deps-data.json is missing the "pairs" field.');
  console.error('Re-run knowledge-deps.js with the updated version.');
  process.exit(1);
}

// Quick lookup: "A|||B" -> pair object with metrics
const pairsByKey = {};
for (const p of kdData.pairs) {
  pairsByKey[`${p.a}|||${p.b}`] = p;
}

console.log(`Logical coupling graph: ${kdData.pairs.length} pairs from ${kdData.numCommitsAnalyzed} commits`);

// ============================================================
// ANALYSIS 1: Strong logical coupling without code dependency
//   = candidates for information leakage
// ============================================================
const MIN_COCHANGES = 3;
const MIN_LIFT = 2;  // co-change at least twice what chance would predict

console.log('\n' + '='.repeat(140));
console.log('  ANALYSIS 1: STRONG LOGICAL COUPLING WITHOUT CODE DEPENDENCY');
console.log(`  (Pairs with lift >= ${MIN_LIFT} and co-changes >= ${MIN_COCHANGES}, no direct require())`);
console.log('  Candidates for information leakage: implicit coupling not visible in the import graph.');
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

const inconsistencies = [];
for (const p of kdData.pairs) {
  if (p.coChanges < MIN_COCHANGES) continue;
  if (p.lift < MIN_LIFT) continue;
  if (!realFilesIndex.has(p.a) || !realFilesIndex.has(p.b)) continue;
  const key = [p.a, p.b].sort().join('|||');
  if (codePairs.has(key)) continue;
  inconsistencies.push(p);
}
inconsistencies.sort((x, y) => y.lift - x.lift);

for (const p of inconsistencies.slice(0, 30)) {
  console.log(
    '  ' + p.lift.toFixed(1).padStart(6) +
    '  ' + String(p.coChanges).padStart(6) +
    '  ' + p.confAtoB.toFixed(3).padStart(8) +
    '  ' + p.confBtoA.toFixed(3).padStart(8) +
    '  ' + p.a.padEnd(45) +
    '  ' + p.b.padEnd(45)
  );
}
console.log(`\n  Total information-leakage candidates: ${inconsistencies.length}`);

// ============================================================
// ANALYSIS 2: Strong logical coupling alongside code dependency
// ============================================================
console.log('\n' + '='.repeat(140));
console.log('  ANALYSIS 2: STRONG LOGICAL COUPLING ALONGSIDE A CODE DEPENDENCY');
console.log(`  (Pairs with lift >= ${MIN_LIFT} and co-changes >= ${MIN_COCHANGES}, AND a direct require())`);
console.log('  These pairs validate the structural design: import-coupled files do co-change.');
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

const consistent = [];
for (const p of kdData.pairs) {
  if (p.coChanges < MIN_COCHANGES) continue;
  if (p.lift < MIN_LIFT) continue;
  if (!realFilesIndex.has(p.a) || !realFilesIndex.has(p.b)) continue;
  const key = [p.a, p.b].sort().join('|||');
  if (!codePairs.has(key)) continue;
  consistent.push(p);
}
consistent.sort((x, y) => y.lift - x.lift);

for (const p of consistent.slice(0, 20)) {
  console.log(
    '  ' + p.lift.toFixed(1).padStart(6) +
    '  ' + String(p.coChanges).padStart(6) +
    '  ' + p.confAtoB.toFixed(3).padStart(8) +
    '  ' + p.confBtoA.toFixed(3).padStart(8) +
    '  ' + p.a.padEnd(45) +
    '  ' + p.b.padEnd(45)
  );
}
console.log(`\n  Total consistent pairs (lift >= ${MIN_LIFT}, has code dep): ${consistent.length}`);

// ============================================================
// ANALYSIS 3: For each high-fan-in module M, look at how often
// changing M co-occurs with changes in its dependents.
// We use confidence(M -> X) directionally — this is exactly the
// "given M changed, did X also change?" question.
// ============================================================
console.log('\n' + '='.repeat(140));
console.log('  ANALYSIS 3: DO HIGH-FAN-IN MODULES FORCE CHANGES IN THEIR DEPENDENTS?');
console.log('  For each high-fan-in module M, we compute average confidence(M -> X) across all dependents X.');
console.log('  Interpretation: low avg = changing M rarely ripples (good information hiding).');
console.log('                  high avg = changing M frequently ripples (leaky abstraction).');
console.log('='.repeat(140));
console.log(
  '  ' + 'Module'.padEnd(50) +
  '  ' + 'Fan-in'.padStart(7) +
  '  ' + 'Changes(M)'.padStart(11) +
  '  ' + 'Deps co-ch'.padStart(11) +
  '  ' + 'Avg C(M->X)'.padStart(13) +
  '  ' + 'Max C(M->X)'.padStart(13)
);
console.log('-'.repeat(140));

// Pre-index confidence(source -> target) lookups
function getConfidence(source, target) {
  const sorted = [source, target].sort();
  const p = pairsByKey[`${sorted[0]}|||${sorted[1]}`];
  if (!p) return 0;
  // Pair is stored alphabetically; confAtoB corresponds to source=a, target=b
  return (sorted[0] === source) ? p.confAtoB : p.confBtoA;
}

const topFanIn = Object.entries(fanInMap)
  .map(([target, sources]) => ({ target, fanIn: sources.size }))
  .sort((a, b) => b.fanIn - a.fanIn)
  .slice(0, 15);

for (const { target, fanIn } of topFanIn) {
  const changes = kdData.fileChanges[target] || 0;
  if (changes === 0) {
    console.log(
      '  ' + target.padEnd(50) +
      '  ' + String(fanIn).padStart(7) +
      '  ' + String(0).padStart(11) +
      '  ' + '0'.padStart(11) +
      '  ' + 'n/a'.padStart(13) +
      '  ' + 'n/a'.padStart(13)
    );
    continue;
  }

  // For each dependent X of target, compute confidence(target -> X)
  let totalConf = 0, maxConf = 0, dependentsWithCoChange = 0;
  for (const dep of fanInMap[target]) {
    const c = getConfidence(target, dep);
    if (c > 0) dependentsWithCoChange++;
    totalConf += c;
    if (c > maxConf) maxConf = c;
  }
  const avgConf = fanIn > 0 ? totalConf / fanIn : 0;

  console.log(
    '  ' + target.padEnd(50) +
    '  ' + String(fanIn).padStart(7) +
    '  ' + String(changes).padStart(11) +
    '  ' + String(dependentsWithCoChange).padStart(11) +
    '  ' + avgConf.toFixed(3).padStart(13) +
    '  ' + maxConf.toFixed(3).padStart(13)
  );
}

console.log('\nDone.');