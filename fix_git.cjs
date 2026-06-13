const { execSync } = require('child_process');
const fs = require('fs');

function getCleanFile(path) {
    return execSync(`git show 02c023c^:${path}`, { encoding: 'utf8' });
}

// 1. app.js
let app = getCleanFile('src/js/app.js');
app = app.replace("const APP_VERSION = '13.1.28';", "const APP_VERSION = '13.1.31';");
// Fix the eslint error that was fixed in 02c023c
app = app.replace(
    "        const estudio = QumranData.ESTUDIOS[index];",
    "        // eslint-disable-next-line security/detect-object-injection\n        const estudio = QumranData.ESTUDIOS[index];"
);
// Remove unused vars that were removed in 02c023c
app = app.replace("let newWorker;\n\n", "");
app = app.replace("const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches;\n", "");
app = app.replace(".then(function (reg) {", ".then(function () {");
fs.writeFileSync('src/js/app.js', app);

// 2. package.json
let pkg = getCleanFile('package.json');
pkg = pkg.replace('"version": "13.1.28"', '"version": "13.1.31"');
fs.writeFileSync('package.json', pkg);

// 3. manifest.json
let manifest = getCleanFile('public/manifest.json');
manifest = manifest.replace('"version": "13.1.28"', '"version": "13.1.31"');
fs.writeFileSync('public/manifest.json', manifest);

// 4. sw.js
let sw = getCleanFile('public/sw.js');
sw = sw.replace('v13.1.28', 'v13.1.31');
sw = sw.replace('GUARDIÃ\x83Â\x81N', 'GUARDIÁN'); // Fix if any original mojibake existed
fs.writeFileSync('public/sw.js', sw);

// 5. CHANGELOG.md
let cl = getCleanFile('CHANGELOG.md');
fs.writeFileSync('CHANGELOG.md', cl);

console.log('Restored clean files with 13.1.31 bump and lint fixes applied.');
