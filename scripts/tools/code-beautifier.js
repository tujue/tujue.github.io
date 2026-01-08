/* TULPAR - Code Beautifier Tool OOP Implementation */
class CodeBeautifierTool extends BaseTool {
    constructor(config) {
        super(config);
    }

    renderUI() {
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const txt = isTr ? {
            lang: 'Programlama Dili',
            beautify: 'Kodu Güzelleştir ✨',
            placeholder: 'Kodunu buraya yapıştır...',
            output: 'Güzelleştirilmiş Kod',
            copy: 'Kopyala'
        } : {
            lang: 'Programming Language',
            beautify: 'Beautify Code ✨',
            placeholder: 'Paste your code here...',
            output: 'Beautified Result',
            copy: 'Copy Result'
        };

        const langs = [
            { id: 'json', name: 'JSON' },
            { id: 'javascript', name: 'JavaScript' },
            { id: 'typescript', name: 'TypeScript' },
            { id: 'html', name: 'HTML' },
            { id: 'css', name: 'CSS' },
            { id: 'sql', name: 'SQL' },
            { id: 'python', name: 'Python' },
            { id: 'xml', name: 'XML' },
            { id: 'php', name: 'PHP' }
        ];

        return `
        <div class="tool-content" style="max-width: 1000px; margin: 0 auto; padding: 20px;">
            <div class="card" style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 12px; margin-bottom: 2rem;">
                <div style="display: flex; gap: 1rem; align-items: flex-end; margin-bottom: 1.5rem;">
                    <div class="form-group" style="flex: 1; margin: 0;">
                        <label class="form-label">${txt.lang}</label>
                        <select id="beautify-lang" class="form-select">
                            ${langs.map(l => `<option value="${l.id}">${l.name}</option>`).join('')}
                        </select>
                    </div>
                    <button id="beautify-btn" class="btn btn-primary" style="height: 48px; min-width: 180px;">${txt.beautify}</button>
                </div>
                
                <div class="form-group">
                    <textarea id="beautify-input" class="form-input" style="height: 300px; font-family: var(--font-mono); font-size: 0.95rem; background: rgba(0,0,0,0.1);" placeholder="${txt.placeholder}"></textarea>
                </div>
            </div>

            <div class="card" style="padding: 1.5rem; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h4 id="beautify-status" style="margin: 0; color: var(--text-secondary); font-size: 0.85rem; text-transform: uppercase;">${txt.output}</h4>
                    <button id="beautify-copy-btn" class="btn btn-sm btn-primary">📋 ${txt.copy}</button>
                </div>
                <pre id="beautify-output" style="min-height: 200px; background: rgba(0,0,0,0.2); border-radius: 8px; padding: 1.5rem; font-family: var(--font-mono); font-size: 0.95rem; color: #a5d6ff; white-space: pre-wrap; word-break: break-all; border: 1px solid var(--border-color);"></pre>
            </div>
        </div>
        `;
    }

    setupListeners() {
        const langSelect = document.getElementById('beautify-lang');
        const input = document.getElementById('beautify-input');
        const output = document.getElementById('beautify-output');
        const status = document.getElementById('beautify-status');
        const beautifyBtn = document.getElementById('beautify-btn');

        const beautify = () => {
            const lang = langSelect.value;
            const code = input.value;
            if (!code.trim()) return;

            let result = '';
            let message = 'Beautified!';

            try {
                if (lang === 'json') {
                    result = this.beautifyJSON(code);
                } else if (lang === 'xml' || lang === 'html') {
                    result = this.beautifyXML(code);
                } else if (lang === 'sql') {
                    result = this.beautifySQL(code);
                } else {
                    // Generic fallback for JS/TS/CSS/PHP/Python if no library found
                    // Try to use js_beautify if available
                    if (window.js_beautify) {
                        if (lang === 'css') result = window.js_beautify.css(code);
                        else if (lang === 'html') result = window.js_beautify.html(code);
                        else result = window.js_beautify(code);
                    } else {
                        // Very simple indentation fallback
                        result = this.simpleIndent(code);
                        message = 'Formatted (Basic)';
                    }
                }

                output.textContent = result;
                status.textContent = message;
                status.style.color = 'var(--success)';
            } catch (e) {
                this.showNotification(e.message, 'error');
                status.textContent = 'Error';
                status.style.color = 'var(--danger)';
            }
        };

        beautifyBtn.onclick = beautify;
        document.getElementById('beautify-copy-btn').onclick = () => this.copyToClipboard(output.textContent);
    }

    // INTERNAL LOGIC (Formerly in DevTools)

    beautifyJSON(code) {
        try {
            const parsed = JSON.parse(code);
            return JSON.stringify(parsed, null, 2);
        } catch (e) {
            throw new Error('Invalid JSON: ' + e.message);
        }
    }

    beautifyXML(xml) {
        let formatted = '';
        let indent = '';
        const tab = '  ';

        xml.split(/>\s*</).forEach(node => {
            if (node.match(/^\/\w/)) indent = indent.substring(tab.length); // decrease indent
            formatted += indent + '<' + node + '>\r\n';
            if (node.match(/^<?\w[^>]*[^\/]$/) && !node.startsWith("?")) indent += tab; // increase indent
        });

        return formatted.substring(1, formatted.length - 3);
    }

    beautifySQL(sql) {
        // Basic SQL Formatter
        const keywords = ["SELECT", "FROM", "WHERE", "AND", "OR", "ORDER BY", "GROUP BY", "JAVING", "LIMIT", "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM", "JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN"];
        let formatted = sql;
        keywords.forEach(kw => {
            const regex = new RegExp(`\\b${kw}\\b`, 'gi');
            formatted = formatted.replace(regex, `\n${kw}`);
        });
        return formatted.trim();
    }

    simpleIndent(code) {
        // Fallback structural indenter for C-like syntaxes (JS, CSS, PHP)
        let res = '';
        let indent = 0;
        const lines = code.split('\n');

        // If single line code, try to split by semi-colons or braces
        let tokens = code;
        if (lines.length < 2) {
            tokens = code.replace(/{/g, '{\n').replace(/}/g, '\n}').replace(/;/g, ';\n');
        }

        tokens.split('\n').forEach(line => {
            line = line.trim();
            if (!line) return;

            if (line.includes('}')) indent--;
            if (indent < 0) indent = 0;

            res += '  '.repeat(indent) + line + '\n';

            if (line.includes('{')) indent++;
        });
        return res;
    }
}

// Register tool
window.initCodeBeautifierLogic = CodeBeautifierTool;
