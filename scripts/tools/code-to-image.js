/* TULPAR - Code To Image Tool OOP Implementation */
class CodeToImageTool extends BaseTool {
    constructor(config) {
        super(config);
        this.currentBg = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }

    renderUI() {
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const txt = isTr ? {
            settings: 'Görünüm Ayarları',
            lang: 'Kod Dili',
            padding: 'Kenar Boşluğu',
            shadow: 'Gölge Gücü',
            title: 'Pencere Başlığı',
            config: 'Ek Ayarlar',
            nums: 'Satır Numaraları',
            dots: 'Pencere Kontrolleri',
            export: 'PNG Olarak Dışa Aktar 📸',
            bg: 'Arkaplan',
            font: 'Yazı Tipi',
            style: 'Pencere Stili',
            styleNone: 'Yok',
            placeholderCode: 'Kodunuzu buraya yapıştırın...',
            placeholderTitle: 'Adsız-1',
            generating: '📸 Oluşturuluyor...'
        } : {
            settings: 'Visual Settings',
            lang: 'Language',
            padding: 'Padding',
            shadow: 'Shadow Intensity',
            title: 'Window Title',
            config: 'Configuration',
            nums: 'Line Numbers',
            dots: 'Window Controls',
            export: 'Export as PNG 📸',
            bg: 'Background',
            font: 'Font',
            style: 'Window Style',
            styleNone: 'None',
            placeholderCode: 'Paste code here...',
            placeholderTitle: 'Untitled-1',
            generating: '📸 Generating...'
        };

        const themes = [
            { id: 't1', bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
            { id: 't2', bg: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' },
            { id: 't3', bg: 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)' },
            { id: 't4', bg: 'linear-gradient(to right, #ee609c 0%, #b465da 100%)' },
            { id: 't5', bg: '#1e1e1e' }
        ];

        return `
        <div class="tool-content cti-studio" style="max-width: 1400px; margin: 0 auto; padding: 20px;">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css">
            <div class="grid-layout" style="display: grid; grid-template-columns: 280px 1fr; gap: 2rem;">
                
                <!-- Sidebar -->
                <div class="cti-sidebar">
                    <div class="card" style="padding: 1.2rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 14px; margin-bottom: 1rem;">
                        <h4 style="margin-bottom: 1.2rem; color: var(--primary); font-size: 0.85rem;">${txt.settings}</h4>
                        
                        <div class="form-group">
                            <label class="form-label">${txt.lang}</label>
                            <select id="cti-in-lang" class="form-select">
                                <option value="javascript">JavaScript</option>
                                <option value="python">Python</option>
                                <option value="html">HTML/XML</option>
                                <option value="css">CSS</option>
                                <option value="go">Go</option>
                                <option value="rust">Rust</option>
                                <option value="java">Java</option>
                                <option value="sql">SQL</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">${txt.font}</label>
                            <select id="cti-in-font" class="form-select">
                                <option value="'Fira Code', monospace">Fira Code</option>
                                <option value="'JetBrains Mono', monospace">JetBrains Mono</option>
                                <option value="'Source Code Pro', monospace">Source Code Pro</option>
                                <option value="'Hack', monospace">Hack</option>
                                <option value="'Courier New', monospace">Courier New</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label class="form-label">${txt.style}</label>
                            <select id="cti-in-style" class="form-select">
                                <option value="macos">macOS</option>
                                <option value="windows">Windows</option>
                                <option value="none">${txt.styleNone}</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label class="form-label">${txt.bg}</label>
                            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                                ${themes.map(t => `<div class="cti-theme-opt" data-bg="${t.bg}" style="width:24px; height:24px; border-radius:50%; background:${t.bg}; cursor:pointer; border:2px solid transparent;"></div>`).join('')}
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">${txt.padding}: <span id="cti-val-pad">48</span>px</label>
                            <input type="range" id="cti-in-pad" class="form-range" min="16" max="150" value="48">
                        </div>

                        <div class="form-group">
                            <label class="form-label">${txt.shadow}: <span id="cti-val-sha">50</span>%</label>
                            <input type="range" id="cti-in-sha" class="form-range" min="0" max="100" value="50">
                        </div>

                        <div class="form-group">
                            <label class="form-label">${txt.title}</label>
                            <input type="text" id="cti-in-title" class="form-input" placeholder="${txt.placeholderTitle}">
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
                            <label style="display:flex; align-items:center; gap:8px; font-size:0.75rem; cursor:pointer;">
                                <input type="checkbox" id="cti-in-nums"> ${txt.nums}
                            </label>
                            <label style="display:flex; align-items:center; gap:8px; font-size:0.75rem; cursor:pointer;">
                                <input type="checkbox" id="cti-in-dots" checked> ${txt.dots}
                            </label>
                        </div>
                    </div>

                    <div class="card" style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 16px;">
                        <textarea id="cti-in-code" class="form-input" style="height: 200px; font-family: var(--font-mono); font-size: 0.8rem; line-height: 1.5;" placeholder="${txt.placeholderCode}">console.log("Hello Tulpar!");</textarea>
                        <button id="cti-btn-export" class="btn btn-primary" style="width: 100%; height: 3.5rem; margin-top: 1rem; font-weight: 700;">${txt.export}</button>
                    </div>
                </div>

                <!-- Preview Area -->
                <div class="cti-preview-region" style="background: #000; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); padding: 3rem; overflow: auto; display: grid; place-items: center; background-image: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px); background-size: 20px 20px;">
                    <div id="cti-target" style="background: ${this.currentBg}; padding: 48px; border-radius: 4px; min-width: 450px;">
                        <div id="cti-window" style="background: rgba(0,0,0,0.85); border-radius: 10px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 15px 40px rgba(0,0,0,0.5);">
                            <div id="cti-header" style="height: 40px; background: rgba(255,255,255,0.05); display: flex; align-items: center; padding: 0 15px; position: relative;">
                                <div id="cti-dots" style="display: flex; gap: 8px;">
                                    <div style="width:12px; height:12px; border-radius:50%; background:#ff5f56;"></div>
                                    <div style="width:12px; height:12px; border-radius:50%; background:#ffbd2e;"></div>
                                    <div style="width:12px; height:12px; border-radius:50%; background:#27c93f;"></div>
                                </div>
                                <div id="cti-win-title" style="position: absolute; left: 0; right: 0; text-align: center; color: rgba(255,255,255,0.4); font-size: 11px; font-family: sans-serif; pointer-events: none;">${txt.placeholderTitle}</div>
                            </div>
                            <pre style="margin:0;"><code id="cti-code-out" class="hljs" style="background: transparent!important; padding: 1.5rem!important; font-family: var(--font-mono); font-size: 14px; line-height: 1.6;"></code></pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    setupListeners() {
        const inCode = document.getElementById('cti-in-code');
        const inLang = document.getElementById('cti-in-lang');
        const inPad = document.getElementById('cti-in-pad');
        const inSha = document.getElementById('cti-in-sha');
        const inTitle = document.getElementById('cti-in-title');
        const inNums = document.getElementById('cti-in-nums');
        const inDots = document.getElementById('cti-in-dots');

        const winTitle = document.getElementById('cti-win-title');
        const dots = document.getElementById('cti-dots');
        const target = document.getElementById('cti-target');
        const win = document.getElementById('cti-window');
        const codeOut = document.getElementById('cti-code-out');

        const inFont = document.getElementById('cti-in-font');
        const inStyle = document.getElementById('cti-in-style');

        // Helper for localization inside callbacks
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const txtExport = isTr ? 'PNG Olarak Dışa Aktar 📸' : 'Export as PNG 📸';
        const txtGenerating = isTr ? '📸 Oluşturuluyor...' : '📸 Generating...';
        const txtUntitled = isTr ? 'Adsız-1' : 'Untitled-1';


        const update = () => {
            let code = inCode.value || ' ';
            code = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

            codeOut.innerHTML = code;
            codeOut.className = `hljs language-${inLang.value}`;
            codeOut.style.fontFamily = inFont.value;
            delete codeOut.dataset.highlighted;

            if (window.hljs) {
                window.hljs.highlightElement(codeOut);

                if (inNums.checked) {
                    const lines = codeOut.innerHTML.split(/\n/);
                    codeOut.innerHTML = lines.map((l, i) => `<div style="display:flex;"><span style="width:35px; opacity:0.3; text-align:right; margin-right:20px; user-select:none; font-size:12px;">${i + 1}</span><span>${l || ' '}</span></div>`).join('\n');
                }
            }

            // Window Style Logic
            const style = inStyle.value;
            if (style === 'macos') {
                dots.innerHTML = `
                    <div style="width:12px; height:12px; border-radius:50%; background:#ff5f56;"></div>
                    <div style="width:12px; height:12px; border-radius:50%; background:#ffbd2e;"></div>
                    <div style="width:12px; height:12px; border-radius:50%; background:#27c93f;"></div>
                `;
                win.style.borderRadius = "10px";
                document.getElementById('cti-header').style.display = "flex";
            } else if (style === 'windows') {
                dots.innerHTML = `
                   <div style="display:flex; gap:8px; margin-left:auto;">
                        <div style="width:10px; height:10px; border:1px solid rgba(255,255,255,0.4);"></div>
                        <div style="width:10px; height:10px; border:1px solid rgba(255,255,255,0.4);"></div>
                        <div style="width:10px; height:10px; border:1px solid rgba(255,255,255,0.4); transform:rotate(45deg);"></div>
                   </div>
                `;
                win.style.borderRadius = "0px";
                document.getElementById('cti-header').style.display = "flex";
            } else {
                document.getElementById('cti-header').style.display = "none";
                win.style.borderRadius = "4px";
            }
        };

        inCode.oninput = update;
        inLang.onchange = update;
        inNums.onchange = update;
        inFont.onchange = update;
        inStyle.onchange = update;

        inPad.oninput = () => {
            target.style.padding = inPad.value + 'px';
            document.getElementById('cti-val-pad').textContent = inPad.value;
        };

        inSha.oninput = () => {
            win.style.boxShadow = `0 15px 40px rgba(0,0,0,${inSha.value / 100})`;
            document.getElementById('cti-val-sha').textContent = inSha.value;
        };

        inTitle.oninput = () => winTitle.textContent = inTitle.value || txtUntitled;
        inDots.onchange = () => dots.style.visibility = inDots.checked ? 'visible' : 'hidden';

        document.querySelectorAll('.cti-theme-opt').forEach(opt => {
            opt.onclick = () => {
                this.currentBg = opt.dataset.bg;
                target.style.background = this.currentBg;
                document.querySelectorAll('.cti-theme-opt').forEach(x => x.style.borderColor = 'transparent');
                opt.style.borderColor = '#fff';
            };
        });

        document.getElementById('cti-btn-export').onclick = () => {
            if (!window.html2canvas) return;
            const btn = document.getElementById('cti-btn-export');
            btn.disabled = true; btn.textContent = txtGenerating;

            html2canvas(target, {
                scale: 2,
                backgroundColor: null,
                useCORS: true
            }).then(canvas => {
                const a = document.createElement('a');
                a.download = `code_${Date.now()}.png`;
                a.href = canvas.toDataURL('image/png');
                a.click();
            }).finally(() => {
                btn.disabled = false; btn.textContent = txtExport;
            });
        };

        update(); // Initial
    }
}

// Register tool
window.initCodeToImageLogic = CodeToImageTool;
