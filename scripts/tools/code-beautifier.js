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

            let res;
            try {
                switch (lang) {
                    case 'json': res = window.DevTools.codeBeautifier.beautifyJSON(code); break;
                    case 'javascript': res = window.DevTools.codeBeautifier.beautifyJS(code); break;
                    case 'typescript': res = window.DevTools.codeBeautifier.beautifyTypeScript(code); break;
                    case 'html': res = window.DevTools.codeBeautifier.beautifyHTML(code); break;
                    case 'css': res = window.DevTools.codeBeautifier.beautifyCSS(code); break;
                    case 'sql': res = window.DevTools.codeBeautifier.beautifySQL(code); break;
                    case 'python': res = window.DevTools.codeBeautifier.beautifyPython(code); break;
                    case 'xml': res = window.DevTools.codeBeautifier.beautifyXML(code); break;
                    case 'php': res = window.DevTools.codeBeautifier.beautifyPHP(code); break;
                    default: res = { success: false, message: 'Unsupported' };
                }

                if (res.success) {
                    output.textContent = res.result;
                    status.textContent = res.message;
                    status.style.color = 'var(--success)';
                } else {
                    this.showNotification(res.message, 'error');
                }
            } catch (e) {
                this.showNotification(e.message, 'error');
            }
        };

        beautifyBtn.onclick = beautify;
        document.getElementById('beautify-copy-btn').onclick = () => this.copyToClipboard(output.textContent);
    }
}

// Register tool
window.initCodeBeautifierLogic = CodeBeautifierTool;
