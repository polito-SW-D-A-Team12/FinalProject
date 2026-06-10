const fs = require('fs');

// 1. Load the raw JSON data
const rawData = fs.readFileSync('structural-dependencies.json', 'utf8');
const data = JSON.parse(rawData);
const modules = data.modules;

// 2. Build a lookup index of every genuine physical file in the system
const realFilesIndex = new Set();
modules.forEach(mod => {
  if (mod.source.startsWith('lib/')) {
    realFilesIndex.add(mod.source);
  }
});

// 3. Helper: convert a shortcut string (like 'internal/errors') to its physical file path
function normalizeInternalPath(targetString) {
  if (realFilesIndex.has(targetString)) return targetString;

  const guessedJsPath = `lib/${targetString}.js`;
  if (realFilesIndex.has(guessedJsPath)) return guessedJsPath;

  const guessedDirectPath = `lib/${targetString}`;
  if (realFilesIndex.has(guessedDirectPath)) return guessedDirectPath;

  return `lib/${targetString}.js`;
}

const fanOutMap = {};
const internalFanInMap = {};
const externalFanInMap = {};

// 4. Process the Architecture Graph
modules.forEach(mod => {
  // Enforce the system boundary
  if (!mod.source.startsWith('lib/')) return;

  fanOutMap[mod.source] = mod.dependencies.length;
  if (!internalFanInMap[mod.source]) internalFanInMap[mod.source] = 0;

  mod.dependencies.forEach(dep => {
    const rawTargetName = dep.resolved || dep.module;

    if (dep.coreModule === true) {
      externalFanInMap[rawTargetName] = (externalFanInMap[rawTargetName] || 0) + 1;
    } else {
      const cleanPhysicalPath = normalizeInternalPath(rawTargetName);
      internalFanInMap[cleanPhysicalPath] = (internalFanInMap[cleanPhysicalPath] || 0) + 1;
    }
  });
});

// 5. Helpers
const getTop = (map, limit = 5, ascending = false) => {
  const arr = Object.entries(map).map(([file, count]) => ({ file, count }));
  arr.sort((a, b) => ascending ? a.count - b.count : b.count - a.count);
  return arr.slice(0, limit);
};

// Compute Instability I = FanOut / (FanIn + FanOut) for a given file
// Returns null if file has neither fan-in nor fan-out (avoid division by zero)
function instability(file) {
  const fanOut = fanOutMap[file] || 0;
  const fanIn = internalFanInMap[file] || 0;
  if (fanIn + fanOut === 0) return null;
  return fanOut / (fanIn + fanOut);
}

// Format Instability as a fixed decimal or "—" if undefined
const fmtI = (val) => val === null ? '  —  ' : val.toFixed(2);

// 6. Print the metrics
console.log("\n=============================================");
console.log("   STRUCTURAL METRICS FOR DESIGN REPORT");
console.log("=============================================\n");

console.log("--- TOP 5 HIGHEST FAN-OUT (with Fan-In and Instability) ---");
console.log("File                                                          Fan-out  Fan-in    I");
getTop(fanOutMap).forEach((m, i) => {
  const fanIn = internalFanInMap[m.file] || 0;
  const I = instability(m.file);
  console.log(
    `${(i + 1) + '. ' + m.file}`.padEnd(62) +
    String(m.count).padStart(6) + '  ' +
    String(fanIn).padStart(6) + '  ' +
    fmtI(I).padStart(5)
  );
});

console.log("\n--- TOP 5 HIGHEST INTERNAL FAN-IN (with Fan-Out and Instability) ---");
console.log("File                                                          Fan-in   Fan-out   I");
getTop(internalFanInMap).forEach((m, i) => {
  const fanOut = fanOutMap[m.file] || 0;
  const I = instability(m.file);
  console.log(
    `${(i + 1) + '. ' + m.file}`.padEnd(62) +
    String(m.count).padStart(6) + '  ' +
    String(fanOut).padStart(6) + '  ' +
    fmtI(I).padStart(5)
  );
});

console.log("\n--- TOP 5 HEAVIEST NATIVE DEPENDENCIES (Core Module Fan-In) ---");
getTop(externalFanInMap).forEach((m, i) => console.log(`${i + 1}. ${m.file} (${m.count} dependents)`));

console.log("\n--- LEAST FAN-OUT (Isolated Nodes; with Fan-In) ---");
console.log("File                                                          Fan-out  Fan-in    I");
getTop(fanOutMap, 6, true).forEach((m) => {
  const fanIn = internalFanInMap[m.file] || 0;
  const I = instability(m.file);
  console.log(
    `- ${m.file}`.padEnd(62) +
    String(m.count).padStart(6) + '  ' +
    String(fanIn).padStart(6) + '  ' +
    fmtI(I).padStart(5)
  );
});
