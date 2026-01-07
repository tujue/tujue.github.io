/* TULPAR - Text Tools Tool OOP Implementation */
class TextTools extends BaseTool {
    constructor(config) {
        super(config);
    }

    renderUI() {
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const txt = isTr ? {
            title: 'Metin Araçları',
            modes: { format: 'Biçimlendirme', findreplace: 'Bul & Değiştir', grammar: 'Dilbilgisi', readability: 'Okunabilirlik' },
            input: 'Giriş Metni',
            placeholder: 'Metninizi buraya yapıştırın...',
            process: 'İşle ⚡',
            copy: 'Kopyala',
            results: 'Sonuçlar',
            labels: { action: 'İşlem', type: 'Dönüştürme Türü', find: 'Bul', replace: 'Değiştir', regex: 'Düzenli İfade (Regex)', case: 'Büyük/Küçük Harf Duyarlı' },
            actions: {
                upper: 'BÜYÜK HARF', lower: 'küçük harf', title: 'Başlık Düzeni (Title Case)', reverse: 'Ters Çevir',
                trim: 'Satırları Kırp', clean: 'Gereksiz Boşlukları Temizle', slug: 'Slug (URL Dostu)'
            },
            converters: {
                htmlEnc: 'HTML Kodla (Encode)', htmlDec: 'HTML Çöz (Decode)',
                urlEnc: 'URL Kodla', urlDec: 'URL Çöz',
                morseEnc: 'Metin -> Mors', morseDec: 'Mors -> Metin',
                binEnc: 'Metin -> İkili (Binary)', binDec: 'İkili -> Metin'
            },
            stats: {
                flesch: 'FLESCH PUANI', level: 'SEVİYE', words: 'KELİME / KARAKTER',
                sent: 'CÜMLE', read: 'OKUMA SÜRESİ', speak: 'KONUŞMA SÜRESİ'
            }
        } : {
            title: 'Text Analysis Tools',
            modes: { format: 'Formatting', convert: 'Converter', findreplace: 'Find & Replace', grammar: 'Grammar Check', readability: 'Readability' },
            input: 'Input Text',
            placeholder: 'Paste your text here...',
            process: 'Process ⚡',
            copy: 'Copy Result',
            results: 'Results',
            labels: { action: 'Action', type: 'Type', find: 'Find', replace: 'Replace', regex: 'Regex', case: 'Case Sensitive' },
            actions: {
                upper: 'UPPERCASE', lower: 'lowercase', title: 'Title Case', reverse: 'Reverse',
                trim: 'Trim Lines', clean: 'Cleanup Spaces', slug: 'Slugify (URL Friendly)'
            },
            converters: {
                htmlEnc: 'HTML Encode', htmlDec: 'HTML Decode',
                urlEnc: 'URL Encode', urlDec: 'URL Decode',
                morseEnc: 'Text to Morse', morseDec: 'Morse to Text',
                binEnc: 'Text to Binary', binDec: 'Binary to Text'
            },
            stats: {
                flesch: 'FLESCH SCORE', level: 'LEVEL', words: 'WORDS / CHARS',
                sent: 'SENTENCES', read: 'READING TIME', speak: 'SPEAKING TIME'
            }
        };

        return `
        <div class="tool-content" style="max-width: 1000px; margin: 0 auto; padding: 20px;">
            <div class="grid-layout" style="display: grid; grid-template-columns: 280px 1fr; gap: 2rem;">
                <!-- Sidebar Control -->
                <div class="sidebar">
                    <div class="card" style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 12px; position: sticky; top: 20px;">
                        <div class="form-group">
                            <label class="form-label">${txt.modes.format}</label>
                            <select id="text-mode" class="form-select">
                                ${Object.entries(txt.modes).map(([id, name]) => `<option value="${id}">${name}</option>`).join('')}
                            </select>
                        </div>

                        <!-- Panel: Format -->
                        <div id="pnl-format" class="text-panel">
                            <div class="form-group">
                                <label class="form-label">${txt.labels.action}</label>
                                <select id="fmt-action" class="form-select">
                                    <option value="uppercase">${txt.actions.upper}</option>
                                    <option value="lowercase">${txt.actions.lower}</option>
                                    <option value="titlecase">${txt.actions.title}</option>
                                    <option value="reverse">${txt.actions.reverse}</option>
                                    <option value="trim">${txt.actions.trim}</option>
                                    <option value="remove-extra-spaces">${txt.actions.clean}</option>
                                    <option value="slugify">${txt.actions.slug}</option>
                                </select>
                            </div>
                        </div>

                        <!-- Panel: Convert -->
                        <div id="pnl-convert" class="text-panel" style="display: none;">
                            <div class="form-group">
                                <label class="form-label">${txt.labels.type}</label>
                                <select id="conv-action" class="form-select">
                                    <option value="html-enc">${txt.converters.htmlEnc}</option>
                                    <option value="html-dec">${txt.converters.htmlDec}</option>
                                    <option value="url-enc">${txt.converters.urlEnc}</option>
                                    <option value="url-dec">${txt.converters.urlDec}</option>
                                    <option value="morse-enc">${txt.converters.morseEnc}</option>
                                    <option value="morse-dec">${txt.converters.morseDec}</option>
                                    <option value="bin-enc">${txt.converters.binEnc}</option>
                                    <option value="bin-dec">${txt.converters.binDec}</option>
                                </select>
                            </div>
                        </div>

                        <!-- Panel: Find & Replace -->
                        <div id="pnl-fr" class="text-panel" style="display: none;">
                            <div class="form-group">
                                <label class="form-label">${txt.labels.find}</label>
                                <input type="text" id="fr-find" class="form-input" placeholder="...">
                            </div>
                            <div class="form-group">
                                <label class="form-label">${txt.labels.replace}</label>
                                <input type="text" id="fr-replace" class="form-input" placeholder="...">
                            </div>
                            <div style="display: flex; gap: 10px;">
                                <label style="font-size: 0.8rem; opacity: 0.7;"><input type="checkbox" id="fr-regex"> ${txt.labels.regex}</label>
                                <label style="font-size: 0.8rem; opacity: 0.7;"><input type="checkbox" id="fr-case"> ${txt.labels.case}</label>
                            </div>
                        </div>

                        <button id="text-btn-process" class="btn btn-primary" style="width: 100%; height: 3.5rem; margin-top: 1.5rem; font-weight: 700;">${txt.process}</button>
                    </div>
                </div>

                <!-- Main Region -->
                <div class="main-region">
                    <div class="card" style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 12px; margin-bottom: 2rem;">
                        <label class="form-label">${txt.input}</label>
                        <textarea id="text-input" class="form-input" style="height: 250px; font-family: var(--font-mono);" placeholder="${txt.placeholder}"></textarea>
                    </div>

                    <div id="text-res-card" class="card" style="display: none; padding: 1.5rem; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 12px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                            <h4 style="margin: 0; color: var(--text-secondary); font-size: 0.85rem; text-transform: uppercase;">${txt.results}</h4>
                            <button id="text-copy-btn" class="btn btn-sm btn-primary">📋 ${txt.copy}</button>
                        </div>
                        <div id="text-res-content">
                            <pre id="text-out-pre" style="white-space: pre-wrap; font-family: var(--font-mono); font-size: 0.95rem; color: var(--primary);"></pre>
                            <div id="text-stats-grid" style="display: none; grid-template-columns: repeat(2, 1fr); gap: 1rem;"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    setupListeners() {
        const mode = document.getElementById('text-mode');
        const input = document.getElementById('text-input');
        const outPre = document.getElementById('text-out-pre');
        const resCard = document.getElementById('text-res-card');
        const statsGrid = document.getElementById('text-stats-grid');

        const panels = {
            format: document.getElementById('pnl-format'),
            convert: document.getElementById('pnl-convert'),
            findreplace: document.getElementById('pnl-fr')
        };

        mode.onchange = () => {
            Object.values(panels).forEach(p => { if (p) p.style.display = 'none'; });
            if (panels[mode.value]) panels[mode.value].style.display = 'block';
        };

        const process = () => {
            const val = input.value.trim();
            if (!val) return;
            const m = mode.value;

            resCard.style.display = 'block';
            outPre.style.display = 'block';
            statsGrid.style.display = 'none';

            if (m === 'format') {
                const action = document.getElementById('fmt-action').value;
                if (action === 'slugify') {
                    outPre.textContent = val.toString().toLowerCase().trim()
                        .replace(/\s+/g, '-')           // Replace spaces with -
                        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
                        .replace(/\-\-+/g, '-');        // Replace multiple - with single -
                } else {
                    outPre.textContent = window.DevTools.advancedTextTools.formatText(val, action);
                }
            } else if (m === 'convert') {
                const action = document.getElementById('conv-action').value;
                switch (action) {
                    case 'html-enc':
                        outPre.textContent = val.replace(/[\u00A0-\u9999<>\&]/g, function (i) {
                            return '&#' + i.charCodeAt(0) + ';';
                        });
                        break;
                    case 'html-dec':
                        const doc = new DOMParser().parseFromString(val, "text/html");
                        outPre.textContent = doc.documentElement.textContent;
                        break;
                    case 'url-enc': outPre.textContent = encodeURIComponent(val); break;
                    case 'url-dec': outPre.textContent = decodeURIComponent(val); break;
                    case 'bin-enc': outPre.textContent = val.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' '); break;
                    case 'bin-dec': outPre.textContent = val.split(' ').map(b => String.fromCharCode(parseInt(b, 2))).join(''); break;
                    case 'morse-enc':
                        const morseCode = { 'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.' };
                        outPre.textContent = val.toUpperCase().split('').map(c => morseCode[c] || c).join(' ');
                        break;
                    case 'morse-dec':
                        const revMorse = { '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E', '..-.': 'F', '--.': 'G', '....': 'H', '..': 'I', '.---': 'J', '-.-': 'K', '.-..': 'L', '--': 'M', '-.': 'N', '---': 'O', '.--.': 'P', '--.-': 'Q', '.-.': 'R', '...': 'S', '-': 'T', '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X', '-.--': 'Y', '--..': 'Z', '-----': '0', '.----': '1', '..---': '2', '...--': '3', '....-': '4', '.....': '5', '-....': '6', '--...': '7', '---..': '8', '----.': '9' };
                        outPre.textContent = val.split(' ').map(c => revMorse[c] || c).join('');
                        break;
                }
            } else if (m === 'findreplace') {
                const f = document.getElementById('fr-find').value;
                const r = document.getElementById('fr-replace').value;
                const reg = document.getElementById('fr-regex').checked;
                const cs = document.getElementById('fr-case').checked;
                outPre.textContent = window.DevTools.advancedTextTools.findReplace(val, f, r, reg, cs ? 'g' : 'gi');
            } else if (m === 'grammar') {
                outPre.textContent = window.DevTools.advancedTextTools.checkGrammar(val);
            } else if (m === 'readability') {
                const res = window.DevTools.textAnalyzer.analyze(val);
                if (res.success) {
                    outPre.style.display = 'none';
                    statsGrid.style.display = 'grid';
                    statsGrid.innerHTML = `
                        <div class="card" style="padding:1rem; text-align:center;">
                            <div style="font-size:0.75rem; opacity:0.5;">${txt.stats.flesch}</div>
                            <div style="font-size:1.8rem; font-weight:700; color:var(--primary);">${res.stats.fleschScore}</div>
                        </div>
                        <div class="card" style="padding:1rem; text-align:center;">
                            <div style="font-size:0.75rem; opacity:0.5;">${txt.stats.level}</div>
                            <div style="font-size:1.1rem; font-weight:700;">${res.stats.readability}</div>
                        </div>
                        <div class="card" style="padding:1rem; text-align:center;">
                            <div style="font-size:0.75rem; opacity:0.5;">${txt.stats.words}</div>
                            <div style="font-size:1.2rem; font-weight:700;">${res.stats.words} / ${res.stats.chars}</div>
                        </div>
                        <div class="card" style="padding:1rem; text-align:center;">
                            <div style="font-size:0.75rem; opacity:0.5;">${txt.stats.sent}</div>
                            <div style="font-size:1.2rem; font-weight:700;">${res.stats.sentences}</div>
                        </div>
                        <div class="card" style="padding:1rem; text-align:center;">
                            <div style="font-size:0.75rem; opacity:0.5;">${txt.stats.read}</div>
                            <div style="font-size:1.2rem; font-weight:700;">${res.stats.readingTime}</div>
                        </div>
                        <div class="card" style="padding:1rem; text-align:center;">
                            <div style="font-size:0.75rem; opacity:0.5;">${txt.stats.speak}</div>
                            <div style="font-size:1.2rem; font-weight:700;">${res.stats.speakingTime}</div>
                        </div>
                    `;
                }
            }
        };

        document.getElementById('text-btn-process').onclick = process;
        document.getElementById('text-copy-btn').onclick = () => this.copyToClipboard(outPre.textContent);
    }
}

// Register tool
window.initTextToolsLogic = TextTools;
