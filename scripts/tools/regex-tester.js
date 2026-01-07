/* TULPAR - Regex Tester Tool OOP Implementation */
class RegexTesterTool extends BaseTool {
    constructor(config) {
        super(config);
    }

    renderUI() {
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const txt = isTr ? {
            pattern: 'Düzenli İfade (Regex)',
            flags: 'Bayraklar',
            testText: 'Test Edilecek Metin',
            replace: 'Değiştirme Metni',
            testBtn: 'Eşleşmeleri Bul',
            codeBtn: 'Kod Oluştur',
            output: 'Eşleşme Sonuçları',
            patterns: 'Hazır Desenler'
        } : {
            pattern: 'Regular Expression',
            flags: 'Flags',
            testText: 'Test String',
            replace: 'Replacement String',
            testBtn: 'Find Matches',
            codeBtn: 'Generate Code',
            output: 'Regex Matching Results',
            patterns: 'Quick Patterns'
        };

        const commonPatterns = [
            { id: 'email', name: '📧 Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
            { id: 'url', name: '🔗 URL', pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b' },
            { id: 'date', name: '📅 Date (YYYY-MM-DD)', pattern: '\\d{4}-\\d{2}-\\d{2}' },
            { id: 'phone', name: '📱 Phone (General)', pattern: '\\+?[0-9\\s\\-\\(\\)]{7,20}' },
            { id: 'ip', name: '🌐 IPv4', pattern: '\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b' },
            { id: 'hex', name: '🎨 Hex Color', pattern: '#[0-9A-Fa-f]{6}' },
            { id: 'password', name: '🔒 Strong Password', pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$' },
            { id: 'slug', name: '🐌 URL Slug', pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' },
            { id: 'html', name: '💻 HTML Tag', pattern: '<[^>]+>' }
        ];

        return `
        <div class="tool-content" style="max-width: 1200px; margin: 0 auto; padding: 20px;">
            <div class="grid-layout" style="display: grid; grid-template-columns: 1fr 320px; gap: 2rem;">
                <!-- Main Region -->
                <div class="main-region">
                    <div class="card" style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 12px; margin-bottom: 1.5rem;">
                        <div style="display: grid; grid-template-columns: 1fr 120px; gap: 1rem; margin-bottom: 1.5rem;">
                            <div class="form-group">
                                <label class="form-label" style="color: var(--primary);">${txt.pattern}</label>
                                <div style="display: flex; align-items: center; background: rgba(0,0,0,0.1); border-radius: 8px; border: 1px solid var(--border-color); padding: 0 1rem;">
                                    <span style="opacity: 0.5; font-family: monospace; font-size: 1.2rem;">/</span>
                                    <input type="text" id="regex-pattern" class="form-input" style="border: none; background: transparent; font-family: var(--font-mono);" placeholder="[a-zA-Z0-9]+">
                                    <span style="opacity: 0.5; font-family: monospace; font-size: 1.2rem;">/</span>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">${txt.flags}</label>
                                <input type="text" id="regex-flags" class="form-input" value="gm" style="text-align: center; font-family: var(--font-mono);">
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">${txt.testText}</label>
                            <textarea id="regex-text" class="form-input" style="height: 250px; font-family: var(--font-mono);" placeholder="Paste text here..."></textarea>
                        </div>

                        <div style="display: flex; gap: 10px; margin-top: 1.5rem;">
                            <button id="regex-test-btn" class="btn btn-primary" style="flex: 2;">⚡ ${txt.testBtn}</button>
                            <button id="regex-code-btn" class="btn btn-outline" style="flex: 1;">💻 ${txt.codeBtn}</button>
                        </div>
                    </div>

                    <div class="card" style="padding: 1.5rem; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 12px;">
                        <h4 id="regex-status" style="margin-bottom: 1rem; opacity: 0.7; font-size: 0.8rem; text-transform: uppercase;">${txt.output}</h4>
                        <pre id="regex-output" style="min-height: 150px; font-family: var(--font-mono); font-size: 0.9rem; white-space: pre-wrap; word-break: break-all; color: var(--text-primary);"></pre>
                    </div>
                </div>

                <!-- Sidebar -->
                <div class="sidebar-region">
                    <div class="card" style="padding: 1.2rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 12px;">
                        <h4 style="margin-bottom: 1rem; font-size: 0.9rem;">${txt.patterns}</h4>
                        <div style="display: grid; gap: 8px;">
                            ${commonPatterns.map(p => `
                                <button data-pattern="${p.pattern}" class="btn btn-sm btn-outline regex-preset-btn" style="text-align: left; justify-content: flex-start;">${p.name}</button>
                            `).join('')}
                        </div>

                        <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
                            <label class="form-label">${txt.replace}</label>
                            <input type="text" id="regex-replacement" class="form-input" placeholder="...">
                            <button id="regex-replace-btn" class="btn btn-secondary" style="width: 100%; margin-top: 1rem;">🔄 Replace</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    setupListeners() {
        const pattern = document.getElementById('regex-pattern');
        const flags = document.getElementById('regex-flags');
        const textArea = document.getElementById('regex-text');
        const output = document.getElementById('regex-output');
        const status = document.getElementById('regex-status');

        const testRegex = () => {
            const p = pattern.value;
            const f = flags.value;
            const t = textArea.value;
            if (!p) return;
            try {
                const regex = new RegExp(p, f);
                const matches = t.match(regex);
                if (matches) {
                    output.textContent = matches.map((m, i) => `[${i + 1}] ${m}`).join('\n');
                    status.textContent = `${matches.length} matches found`;
                    status.style.color = 'var(--success)';
                } else {
                    output.textContent = 'No matches found';
                    status.textContent = '0 matches';
                    status.style.color = 'var(--warning)';
                }
            } catch (e) {
                output.textContent = 'Invalid regex: ' + e.message;
                status.textContent = 'Error';
                status.style.color = 'var(--danger)';
            }
        };

        document.getElementById('regex-test-btn').onclick = testRegex;
        document.querySelectorAll('.regex-preset-btn').forEach(btn => {
            btn.onclick = () => {
                pattern.value = btn.dataset.pattern;
                testRegex();
            };
        });

        document.getElementById('regex-replace-btn').onclick = () => {
            const p = pattern.value;
            const f = flags.value;
            const t = textArea.value;
            const r = document.getElementById('regex-replacement').value;
            try {
                const regex = new RegExp(p, f);
                output.textContent = t.replace(regex, r);
            } catch (e) { }
        };
    }
}

// Register tool
window.initRegexTesterLogic = RegexTesterTool;
