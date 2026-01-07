/* TULPAR - Password Generator Tool OOP Implementation */
class PasswordGeneratorTool extends BaseTool {
    constructor(config) {
        super(config);
        this.currentMode = 'random';
    }

    renderUI() {
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const txt = isTr ? {
            modes: { random: '🔐 Rastgele', memorable: '💭 Hatırlanabilir', passphrase: '📝 Parola', pin: '🔢 PIN' },
            config: 'Yapılandırma',
            length: 'Uzunluk',
            options: 'Seçenekler',
            upper: 'Büyük Harf', lower: 'Küçük Harf', numbers: 'Rakam', symbols: 'Sembol', exclude: 'Benzerleri Çıkar (0/O, 1/l)',
            wordCount: 'Kelime Sayısı', separator: 'Ayırıcı', batch: 'Çoklu Üretim',
            generate: 'Oluştur ✨', result: 'Sonuçlar', copy: 'Kopyala'
        } : {
            modes: { random: '🔐 Random', memorable: '💭 Memorable', passphrase: '📝 Passphrase', pin: '🔢 PIN' },
            config: 'Configuration',
            length: 'Length',
            options: 'Options',
            upper: 'Uppercase', lower: 'Lowercase', numbers: 'Numbers', symbols: 'Symbols', exclude: 'Exclude Similar (0/O, 1/l)',
            wordCount: 'Word Count', separator: 'Separator', batch: 'Batch Generation',
            generate: 'Generate ✨', result: 'Generated Result', copy: 'Copy All'
        };

        return `
        <div class="tool-content" style="max-width: 1000px; margin: 0 auto; padding: 20px;">
            <div class="grid-layout" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                <!-- Control Panel -->
                <div class="card" style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 12px;">
                    <h4 style="margin-bottom: 1.5rem; color: var(--primary);">${txt.config}</h4>
                    
                    <div class="btn-group mb-4" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                        ${Object.entries(txt.modes).map(([m, label]) => `
                            <button id="pwd-mode-${m}" class="btn btn-secondary btn-sm" style="font-size: 0.85rem;">${label}</button>
                        `).join('')}
                    </div>

                    <!-- Mode Specific Sections -->
                    <div id="pwd-random-options">
                        <div class="form-group">
                            <label class="form-label">${txt.length}: <strong id="pwd-length-display">16</strong></label>
                            <input type="range" id="pwd-length" min="4" max="64" value="16" style="width: 100%;">
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 1rem;">
                            <label class="check-container"><input type="checkbox" id="pwd-uppercase" checked> ${txt.upper}</label>
                            <label class="check-container"><input type="checkbox" id="pwd-lowercase" checked> ${txt.lower}</label>
                            <label class="check-container"><input type="checkbox" id="pwd-numbers" checked> ${txt.numbers}</label>
                            <label class="check-container"><input type="checkbox" id="pwd-symbols" checked> ${txt.symbols}</label>
                            <label class="check-container" style="grid-column: span 2;"><input type="checkbox" id="pwd-exclude-similar"> ${txt.exclude}</label>
                        </div>
                    </div>

                    <div id="pwd-memorable-options" style="display:none">
                        <div class="form-group">
                            <label class="form-label">${txt.wordCount}: <strong id="pwd-memorable-count-display">3</strong></label>
                            <input type="range" id="pwd-memorable-count" min="2" max="10" value="3" style="width: 100%;">
                        </div>
                    </div>

                    <div id="pwd-passphrase-options" style="display:none">
                        <div class="form-group">
                            <label class="form-label">${txt.wordCount}: <strong id="pwd-passphrase-count-display">4</strong></label>
                            <input type="range" id="pwd-passphrase-count" min="3" max="12" value="4" style="width: 100%;">
                        </div>
                        <div class="form-group">
                            <label class="form-label">${txt.separator}</label>
                            <select id="pwd-passphrase-separator" class="form-select">
                                <option value="-">-</option><option value="_">_</option><option value=".">.</option><option value=" ">Space</option>
                            </select>
                        </div>
                    </div>

                    <div id="pwd-pin-options" style="display:none">
                        <div class="form-group">
                            <label class="form-label">${txt.length}: <strong id="pwd-pin-length-display">4</strong></label>
                            <input type="range" id="pwd-pin-length" min="4" max="12" value="4" style="width: 100%;">
                        </div>
                    </div>

                    <hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.5rem 0;">

                    <div class="form-group">
                        <label class="form-label">${txt.batch}: <strong id="pwd-batch-display">1</strong></label>
                        <input type="range" id="pwd-batch-count" min="1" max="50" value="1" style="width: 100%;">
                    </div>

                    <button id="pwd-generate-btn" class="btn btn-primary" style="width: 100%; height: 3.5rem; font-weight: 700; font-size: 1.1rem; margin-top: 1rem;">${txt.generate}</button>
                </div>

                <!-- Result Display -->
                <div class="preview-region">
                    <div class="card" style="padding: 1.5rem; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 12px; height: 100%; display: flex; flex-direction: column;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                            <h4 style="margin: 0; color: var(--text-secondary); font-size: 0.85rem; text-transform: uppercase;">${txt.result}</h4>
                            <button id="copy-pwd-btn" class="btn btn-sm btn-primary">📋 ${txt.copy}</button>
                        </div>

                        <div id="pwd-output-container" style="flex: 1; background: rgba(0,0,0,0.2); border-radius: 8px; padding: 1.5rem; font-family: var(--font-mono); font-size: 1.2rem; overflow-y: auto; text-align: center;">
                            <div id="pwd-output" style="color: var(--primary); font-weight: 700; word-break: break-all;">-</div>
                        </div>

                        <!-- Strength Meter -->
                        <div style="margin-top: 2rem;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.85rem;">
                                <span id="pwd-strength-badge" style="padding: 2px 8px; border-radius: 4px; background: var(--surface);">${isTr ? 'Bekleyin...' : 'Wait...'}</span>
                                <span id="pwd-strength-details"></span>
                            </div>
                            <div style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;">
                                <div id="pwd-strength-fill" style="height: 100%; width: 0%; background: var(--danger); transition: 0.4s;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <style>
            .check-container { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; cursor: pointer; color: var(--text-secondary); }
            input[type="range"] { accent-color: var(--primary); }
        </style>
        `;
    }

    setupListeners() {
        const modeBtn = (m) => document.getElementById(`pwd-mode-${m}`);
        const optsDiv = (m) => document.getElementById(`pwd-m-${m}-options`); // Wait, IDs differ

        // Manual mapping for sections
        const sections = {
            random: document.getElementById('pwd-random-options'),
            memorable: document.getElementById('pwd-memorable-options'),
            passphrase: document.getElementById('pwd-passphrase-options'),
            pin: document.getElementById('pwd-pin-options')
        };

        const setMode = (mode) => {
            this.currentMode = mode;
            Object.keys(sections).forEach(m => {
                sections[m].style.display = m === mode ? 'block' : 'none';
                const btn = modeBtn(m);
                if (m === mode) btn.classList.replace('btn-secondary', 'btn-primary');
                else btn.classList.replace('btn-primary', 'btn-secondary');
            });
            this.generate();
        };

        ['random', 'memorable', 'passphrase', 'pin'].forEach(m => modeBtn(m).onclick = () => setMode(m));

        // Range displays
        // Range displays - Explicit mapping to avoid complexity errors
        const rangeMap = [
            { input: 'pwd-length', display: 'pwd-length-display' },
            { input: 'pwd-memorable-count', display: 'pwd-memorable-count-display' },
            { input: 'pwd-passphrase-count', display: 'pwd-passphrase-count-display' },
            { input: 'pwd-pin-length', display: 'pwd-pin-length-display' },
            { input: 'pwd-batch-count', display: 'pwd-batch-display' }
        ];

        rangeMap.forEach(map => {
            const el = document.getElementById(map.input);
            const displayEl = document.getElementById(map.display);
            if (el && displayEl) {
                el.oninput = (e) => {
                    displayEl.textContent = e.target.value;
                    this.generate();
                };
            }
        });

        document.getElementById('pwd-generate-btn').onclick = () => this.generate();
        document.getElementById('copy-pwd-btn').onclick = (e) => this.copyToClipboard(document.getElementById('pwd-output').textContent);

        setMode('random');
    }

    generate() {
        const batch = parseInt(document.getElementById('pwd-batch-count').value);
        const output = document.getElementById('pwd-output');
        const badge = document.getElementById('pwd-strength-badge');
        const fill = document.getElementById('pwd-strength-fill');
        const details = document.getElementById('pwd-strength-details');

        const getOpts = () => {
            if (this.currentMode === 'random') return {
                length: parseInt(document.getElementById('pwd-length').value),
                uppercase: document.getElementById('pwd-uppercase').checked,
                lowercase: document.getElementById('pwd-lowercase').checked,
                numbers: document.getElementById('pwd-numbers').checked,
                symbols: document.getElementById('pwd-symbols').checked,
                excludeSimilar: document.getElementById('pwd-exclude-similar').checked
            };
            if (this.currentMode === 'memorable') return { wordCount: parseInt(document.getElementById('pwd-memorable-count').value) };
            if (this.currentMode === 'passphrase') return {
                wordCount: parseInt(document.getElementById('pwd-passphrase-count').value),
                separator: document.getElementById('pwd-passphrase-separator').value
            };
            if (this.currentMode === 'pin') return { length: parseInt(document.getElementById('pwd-pin-length').value) };
        };

        if (batch === 1) {
            const res = window.DevTools.passwordGenerator.generateFromMode(this.currentMode, getOpts());
            if (res.success) {
                output.textContent = res.password;
                this.updateStrength(res.score, res.strength);
            }
        } else {
            const res = window.DevTools.passwordGenerator.generateBatch(batch, this.currentMode, getOpts());
            if (res.success) {
                output.innerHTML = res.passwords.map(p => `<div>${p}</div>`).join('');
                const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
                const pwdTxt = isTr ? 'parola' : 'passwords';
                badge.textContent = `${batch} ${pwdTxt}`;
                fill.style.width = '100%';
                fill.style.background = 'var(--primary)';
                details.textContent = '';
            }
        }
    }

    updateStrength(score, strength) {
        const badge = document.getElementById('pwd-strength-badge');
        const fill = document.getElementById('pwd-strength-fill');
        const details = document.getElementById('pwd-strength-details');
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';

        let displayStrength = strength;
        if (isTr) {
            const map = {
                'Very Weak': 'Çok Zayıf',
                'Weak': 'Zayıf',
                'Medium': 'Orta',
                'Good': 'İyi',
                'Strong': 'Güçlü',
                'Very Strong': 'Çok Güçlü'
            };
            displayStrength = map[strength] || strength;
        }

        badge.textContent = displayStrength;
        fill.style.width = `${(score / 10) * 100}%`;
        let color = '#ef4444';
        if (score >= 8) color = '#22c55e';
        else if (score >= 5) color = '#3b82f6';
        else if (score >= 3) color = '#f59e0b';
        fill.style.background = color;
        badge.style.color = color;
        details.textContent = `${score}/10`;
    }
}

// Register tool
window.initPasswordGeneratorLogic = PasswordGeneratorTool;
