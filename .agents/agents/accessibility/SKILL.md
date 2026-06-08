# Accessibility Specialist — Skill Pack

## ⚠️ Regla operativa
Nunca aceptes más de **5 cambios** o **2 archivos** por tarea. Si la solicitud excede, pide dividirla.

## Workflow para correcciones rápidas (Node.js)

Usa **Node.js** (`node -e`) para modificar archivos, NO PowerShell. Esto evita problemas de escaping.

### Template: skip-link en index.html
```bash
node -e "$=require('fs'); let h=$.readFileSync('index.html','utf8'); h=h.replace('<body>','<body>\n<a href=\"#main-content\" class=\"skip-link\">Saltar al contenido principal</a>'); h=h.replace('<main class=\"app-frame\">','<main class=\"app-frame\" id=\"main-content\">'); $.writeFileSync('index.html',h,'utf8'); console.log('skip-link OK');"
```

### Template: span → button close-modal
```bash
node -e "$=require('fs'); let h=$.readFileSync('index.html','utf8'); h=h.replace('span id=\"btn-close-','button id=\"btn-close-').replace('span id=\"btn-close-','button id=\"btn-close-'); h=h.replace('close-modal\">&times;</span>','close-modal\">&times;</button>').replace('close-modal">&times;</span>','close-modal">&times;</button>').replace('close-modal">&times;</span>','close-modal">&times;</button>'); $.writeFileSync('index.html',h,'utf8');"
```
(Usar replace con targeting más preciso en práctica)

### Template: tabindex + role en cards
```bash
node -e "$=require('fs'); let h=$.readFileSync('index.html','utf8'); h=h.replace('article id=\"btn-podcast-con\" class=\"card clickable card-podcast\">','article id=\"btn-podcast-con\" class=\"card clickable card-podcast\" tabindex=\"0\" role=\"button\">'); h=h.replace('article id=\"btn-institute-con\" class=\"card clickable card-institute\">','article id=\"btn-institute-con\" class=\"card clickable card-institute\" tabindex=\"0\" role=\"button\">'); h=h.replace('article id=\"card-telegram\" class=\"card clickable card-telegram\">','article id=\"card-telegram\" class=\"card clickable card-telegram\" tabindex=\"0\" role=\"button\">'); $.writeFileSync('index.html',h,'utf8'); console.log('cards OK');"
```

### Template: ARIA live regions
```bash
node -e "$=require('fs'); let h=$.readFileSync('index.html','utf8'); h=h.replace('div id=\"alert-container\" class=\"watcher-alert\">','div id=\"alert-container\" class=\"watcher-alert\" role=\"alert\" aria-live=\"polite\">'); h=h.replace('div id=\"update-toast\" class=\"update-toast\">','div id=\"update-toast\" class=\"update-toast\" role=\"status\" aria-live=\"polite\">'); $.writeFileSync('index.html',h,'utf8'); console.log('aria live OK');"
```

### Template: focus-visible en CSS
```bash
node -e "$=require('fs'); let c=$.readFileSync('src/css/styles.css','utf8'); c+='\n\n/* --- FOCUS VISIBLE (WCAG 2.4.7) --- */\n:focus-visible {\n    outline: 2px solid var(--gold);\n    outline-offset: 2px;\n}\n'; $.writeFileSync('src/css/styles.css',c,'utf8'); console.log('focus-visible OK');"
```

### Template: Escape key + keydown en app.js
```bash
node -e "$=require('fs'); let a=$.readFileSync('src/js/app.js','utf8'); const code='\n        // Cierre de modales con tecla Escape\n        document.addEventListener(\"keydown\", (e) => {\n            if (e.key === \"Escape\") {\n                document.getElementById(\"modal-fiesta\").style.display = \"none\";\n                document.getElementById(\"modal-lectura\").style.display = \"none\";\n                document.getElementById(\"modal-privacy\").style.display = \"none\";\n            }\n        });\n\n        // Soporte de teclado para cards clickeables\n        [\"btn-podcast-con\", \"btn-institute-con\", \"card-telegram\"].forEach((id) => {\n            const el = document.getElementById(id);\n            if (el) {\n                el.addEventListener(\"keydown\", (e) => {\n                    if (e.key === \"Enter\" || e.key === \" \") {\n                        e.preventDefault();\n                        el.click();\n                    }\n                });\n            }\n        });\n    },'; const i=a.indexOf('    },'); const j=a.indexOf('\n    nav:',i); const t=a.lastIndexOf('    },',j); a=a.substring(0,t)+code+a.substring(t+6); $.writeFileSync('src/js/app.js',a,'utf8'); console.log('keyboard handlers OK');"
```

## Workflow para cambios individuales

Cuando se te delegue UNA tarea específica:
1. Lee el archivo (`fs.readFileSync`)
2. Aplica el cambio
3. Escribe y verifica con `npm test`

## Límites de seguridad
- **Por tarea:** máximo 5 cambios atómicos
- **Por archivo:** máximo 2 archivos simultáneos
- **Verificación:** siempre correr `npm test` al final
- **Si un cambio falla:** reporta el error y no sigas con los siguientes