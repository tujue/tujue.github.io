/* TULPAR - Color Palette Tool OOP Implementation */
class ColorPaletteTool extends BaseTool {
    constructor(config) {
        super(config);
    }

    renderUI() {
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const txt = isTr ? {
            settings: 'Palet Ayarları',
            baseColor: 'Temel Renk',
            harmony: 'Uyum Tipi',
            copyAll: 'CSS Olarak Kopyala',
            results: 'Oluşturulan Palet',
            modes: {
                mono: 'Tek Renkli', comp: 'Zıt (Tamamlayıcı)', triad: 'Üçlü',
                analog: 'Bitişik (Analog)', shades: 'Gölgeler', tints: 'Tonlar'
            }
        } : {
            settings: 'Palette Settings',
            baseColor: 'Base Color',
            harmony: 'Harmony Type',
            copyAll: 'Copy as CSS',
            results: 'Generated Palette',
            modes: {
                mono: 'Monochromatic', comp: 'Complementary', triad: 'Triadic',
                analog: 'Analogous', shades: 'Shades', tints: 'Tints'
            }
        };

        return `
        <div class="tool-content" style="max-width: 1100px; margin: 0 auto; padding: 20px;">
            <div class="grid-layout" style="display: grid; grid-template-columns: 320px 1fr; gap: 2rem;">
                <!-- Control Panel -->
                <div class="sidebar">
                    <div class="card" style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 12px;">
                        <h4 style="margin-bottom: 1.5rem; color: var(--primary);">${txt.settings}</h4>
                        
                        <div class="form-group">
                            <label class="form-label">${txt.baseColor}</label>
                            <div style="display: flex; gap: 10px; align-items: center;">
                                <input type="color" id="pal-base" value="#3b82f6" style="width: 60px; height: 50px; border: none; padding: 0; background: none; cursor: pointer;">
                                <input type="text" id="pal-hex" class="form-input" value="#3B82F6" style="text-align: center; font-family: var(--font-mono); font-weight: 700;">
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">${txt.harmony}</label>
                            <select id="pal-type" class="form-select">
                                <option value="monochromatic">${txt.modes.mono}</option>
                                <option value="complementary">${txt.modes.comp}</option>
                                <option value="triadic">${txt.modes.triad}</option>
                                <option value="analogous">${txt.modes.analog}</option>
                                <option value="shades">${txt.modes.shades}</option>
                                <option value="tints">${txt.modes.tints}</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Export Format</label>
                            <select id="pal-fmt" class="form-select">
                                <option value="css">CSS Variables</option>
                                <option value="scss">SCSS Variables</option>
                                <option value="json">JSON</option>
                                <option value="tailwind">Tailwind Config</option>
                            </select>
                        </div>

                        <button id="pal-copy-all" class="btn btn-outline" style="width: 100%; margin-top: 1rem;">📋 ${txt.copyAll}</button>
                    </div>
                </div>

                <!-- Palette Display -->
                <div class="main-region">
                    <div class="card" style="padding: 1.5rem; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 16px;">
                        <h4 style="margin-bottom: 1.5rem; color: var(--text-secondary); font-size: 0.85rem; text-transform: uppercase;">${txt.results}</h4>
                        <div id="pal-output" style="display: grid; gap: 12px;"></div>
                        <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color);">
                            <label style="font-size:0.75rem; opacity:0.6; text-transform:uppercase;">Export Code</label>
                            <pre id="pal-export-code" style="margin-top:10px; background:rgba(0,0,0,0.2); padding:1rem; border-radius:8px; font-family:var(--font-mono); font-size:0.8rem; color:#a5d6ff; max-height:200px; overflow-y:auto;"></pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    setupListeners() {
        const base = document.getElementById('pal-base');
        const hex = document.getElementById('pal-hex');
        const type = document.getElementById('pal-type');
        const output = document.getElementById('pal-output');

        const validHex = /^#[0-9A-F]{6}$/i;

        const updateHex = () => {
            hex.value = base.value.toUpperCase();
            this.generate();
        };

        const updateBase = () => {
            let val = hex.value;
            if (!val.startsWith('#')) val = '#' + val;
            if (validHex.test(val)) {
                base.value = val;
                this.generate();
            }
        };

        base.oninput = updateHex;
        hex.oninput = updateBase;
        type.onchange = () => this.generate();
        document.getElementById('pal-fmt').onchange = () => this.generate(); // Update on format change

        document.getElementById('pal-copy-all').onclick = () => {
            const code = document.getElementById('pal-export-code').textContent;
            this.copyToClipboard(code);
        };

        this.generate(); // Initial
    }

    generate() {
        const base = document.getElementById('pal-base').value;
        const mode = document.getElementById('pal-type').value;
        const hsl = this._hexToHsl(base);
        let palette = [base];

        switch (mode) {
            case 'monochromatic':
                [15, 30, -15, -30].forEach(d => palette.push(this._hslToHex(hsl.h, hsl.s, Math.max(0, Math.min(100, hsl.l + d)))));
                break;
            case 'complementary':
                palette.push(this._hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l));
                palette.push(this._hslToHex((hsl.h + 150) % 360, hsl.s, hsl.l));
                palette.push(this._hslToHex((hsl.h + 210) % 360, hsl.s, hsl.l));
                break;
            case 'triadic':
                palette.push(this._hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l));
                palette.push(this._hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l));
                break;
            case 'analogous':
                [-30, -15, 15, 30].forEach(d => palette.push(this._hslToHex((hsl.h + d + 360) % 360, hsl.s, hsl.l)));
                break;
            case 'shades':
                [10, 20, 30, 40].forEach(d => palette.push(this._hslToHex(hsl.h, hsl.s, Math.max(0, hsl.l - d))));
                break;
            case 'tints':
                [10, 20, 30, 40].forEach(d => palette.push(this._hslToHex(hsl.h, hsl.s, Math.min(100, hsl.l + d))));
                break;
        }

        this._renderPalette(palette);

        const fmt = document.getElementById('pal-fmt').value;
        const code = this._generateExportCode(palette, fmt);
        document.getElementById('pal-export-code').textContent = code;
    }

    _generateExportCode(colors, format) {
        if (format === 'css') {
            return ':root {\n' + colors.map((c, i) => `  --color-${i + 1}: ${c};`).join('\n') + '\n}';
        } else if (format === 'scss') {
            return colors.map((c, i) => `$color-${i + 1}: ${c};`).join('\n');
        } else if (format === 'json') {
            return JSON.stringify(colors, null, 2);
        } else if (format === 'tailwind') {
            const config = {
                theme: {
                    extend: {
                        colors: {
                            custom: colors.reduce((acc, c, i) => ({ ...acc, [i === 0 ? 'base' : (i * 100)]: c }), {})
                        }
                    }
                }
            };
            return `// tailwind.config.js\nmodule.exports = ${JSON.stringify(config, null, 2)}`;
        }
        return '';
    }

    _renderPalette(colors) {
        const out = document.getElementById('pal-output');
        out.innerHTML = colors.map((c, i) => {
            const isDark = this._isDark(c);
            return `
                <div class="swatch" style="background: ${c}; color: ${isDark ? '#fff' : '#000'}; padding: 1.5rem; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 1px solid rgba(0,0,0,0.1);">
                    <div>
                        <div class="pal-hex-val" style="font-family: var(--font-mono); font-weight: 800; font-size: 1.2rem;">${c.toUpperCase()}</div>
                        <div style="font-size: 0.75rem; opacity: 0.7;">Color ${i + 1}</div>
                    </div>
                    <button class="btn btn-sm btn-outline" style="border-color: currentColor; color: inherit;" onclick="window.DevTools.copyToClipboard('${c}', this)">Copy</button>
                </div>
            `;
        }).join('');
    }

    _hexToHsl(hex) {
        let r = parseInt(hex.slice(1, 3), 16) / 255;
        let g = parseInt(hex.slice(3, 5), 16) / 255;
        let b = parseInt(hex.slice(5, 7), 16) / 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max === min) h = s = 0;
        else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return { h: h * 360, s: s * 100, l: l * 100 };
    }

    _hslToHex(h, s, l) {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }

    _isDark(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return (r * 0.299 + g * 0.587 + b * 0.114) < 128;
    }
}

// Register tool
window.initColorPaletteLogic = ColorPaletteTool;
