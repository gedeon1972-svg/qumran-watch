const fs = require('fs');
const path = require('path');

const replacements = {
    'cargÃƒÂ³': 'cargó',
    'CÃƒÂ NTICO': 'CÁNTICO',
    'DÃƒÂ A': 'DÍA',
    'ÃƒÂ¢Ã‚Â Ã‚Â³': '⏳',
    'Ã¢â‚¬â€ ': '—',
    'JÃ¡yt': 'Jáyt',
    'ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ': '-',
    'ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ': '-',
    'ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ': '-'
};

function walk(dir, list = []) {
    fs.readdirSync(dir).forEach(f => {
        let p = path.join(dir, f);
        if (fs.statSync(p).isDirectory()) {
            if (f !== '.git' && f !== 'node_modules' && f !== 'dist' && f !== 'coverage') walk(p, list);
        } else if (/\.(js|json|md|html|css)$/.test(f)) {
            if (f !== 'fix_global_encoding.cjs') list.push(p);
        }
    });
    return list;
}

const files = walk('.');
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;
    
    const sortedKeys = Object.keys(replacements).sort((a, b) => b.length - a.length);
    
    sortedKeys.forEach(key => {
        content = content.split(key).join(replacements[key]);
    });
    
    if (content !== originalContent) {
        fs.writeFileSync(file, content);
        console.log(`Fixed encoding in: ${file}`);
    }
});
console.log('Global mojibake replacement pass 3 complete.');
