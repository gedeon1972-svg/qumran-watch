const fs = require('fs');
const path = require('path');

const EXTENSIONS = new Set(['.js', '.cjs', '.mjs', '.md', '.html', '.css', '.json', '.yml', '.yaml', '.txt']);
const SKIP_DIRS = new Set(['node_modules', 'dist', 'coverage', '.git', '.opencode']);

const MOJIBAKE_PATTERNS = [
  /Ã¡/g,   // á
  /Ã©/g,   // é
  /Ã­/g,   // í
  /Ã³/g,   // ó
  /Ãº/g,   // ú
  /Ã±/g,   // ñ
  /â€"/g,  // "
  /â€™/g,  // '
  /â€œ/g,  // "
  /Ã»/g,   // û
  /Â¿/g,   // ¿
  /Â¡/g,   // ¡
  /Ã¼/g,   // ü
  /Ã¤/g,   // ä
  /Ã¶/g,   // ö
  /Ã§/g,   // ç
];

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) out.push(...walk(full));
    } else if (EXTENSIONS.has(path.extname(entry.name))) {
      out.push(full);
    }
  }
  return out;
}

let errors = 0;
const files = walk('.').filter(f => !f.endsWith('scripts' + path.sep + 'check-encoding.cjs'));

for (const f of files) {
  const buf = fs.readFileSync(f);
  const hasBom = buf.length >= 3 && buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF;
  if (hasBom) {
    console.log(`\u274c BOM UTF-8 en: ${f}`);
    errors++;
    continue;
  }
  const content = buf.toString('utf8');
  for (const re of MOJIBAKE_PATTERNS) {
    re.lastIndex = 0;
    const m = content.match(re);
    if (m) {
      console.log(`\u274c Mojibake (${m[0]}) en: ${f}`);
      errors++;
      break;
    }
  }
}

if (errors) {
  console.log(`\n\u274c ${errors} archivo(s) con problemas de encoding.`);
  process.exit(1);
} else {
  console.log(`\u2705 Encoding OK en ${files.length} archivos (sin BOM ni mojibake).`);
}
