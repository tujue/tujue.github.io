/* TULPAR - Professional Color Palette Studio */
class ColorPaletteProTool extends BaseTool {
    constructor(config) {
        super(config);
        this.locked = new Set();
        this.currentPalette = [];
    }

    renderUI() {
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const txt = isTr ? {
            title: 'Profesyonel Renk Paleti Stüdyosu',
            base: 'Ana Renk',
            generate: 'Üret',
            random: 'Rastgele Palet',
            export: 'Dışa Aktar',
            harmony: 'Uyum',
            checker: 'WCAG Kontrast Kontrolü',
            copyCode: 'Kodu Kopyala',
            modes: {
                mono: 'Tek Ton', comp: 'Tamamlayıcı', split: 'Bölünmüş', triad: 'Üçlü',
                tetrad: 'Dörtlü', analog: 'Bitişik', shades: 'Gölgeler'
            }
        } : {
            title: 'Professional Color Palette Studio',
            base: 'Base Color',
            generate: 'Generate',
            random: 'Random Palette',
            export: 'Export',
            harmony: 'Harmony',
            checker: 'WCAG Contrast Checker',
            copyCode: 'Copy Code',
            modes: {
                mono: 'Monochromatic', comp: 'Complementary', split: 'Split-Comp', triad: 'Triadic',
                tetrad: 'Tetradic', analog: 'Analogous', shades: 'Shades'
            }
        };

        return `
        <div class="tool-content color-pal-pro" style="max-width: 1300px; margin: 0 auto; padding: 20px;">
            <div style="display: grid; grid-template-columns: 340px 1fr; gap: 2.5rem; align-items: start;">
                
                <!-- Sidebar -->
                <div style="position: sticky; top: 20px;">
                    <div class="card" style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 20px;">
                        <h4 style="margin-bottom: 1.5rem; color: var(--primary); font-size: 0.85rem; text-transform: uppercase;">${txt.title}</h4>
                        
                        <!-- Base Color -->
                        <div class="form-group">
                            <label class="form-label">${txt.base}</label>
                            <div style="display: flex; gap: 10px;">
                                <input type="color" id="cp-base" value="#6366f1" style="width: 70px; height: 50px; border-radius: 8px; border: 2px solid var(--border-color); cursor: pointer;">
                                <input type="text" id="cp-hex" class="form-input" value="#6366F1" style="flex: 1; text-align: center; font-family: var(--font-mono); font-weight: 700;">
                            </div>
                        </div>

                        <!-- Harmony Mode -->
                        <div class="form-group">
                            <label class="form-label">${txt.harmony}</label>
                            <select id="cp-mode" class="form-select">
                                ${Object.entries(txt.modes).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}
                            </select>
                        </div>

                        <!-- Palette Count -->
                        <div class="form-group">
                            <label class="form-label">Colors: <span id="v-cp-count">5</span></label>
                            <input type="range" id="cp-count" min="3" max="10" value="5" style="width: 100%;">
                        </div>

                        <button id="cp-gen" class="btn btn-primary" style="width: 100%; margin-bottom: 10px;">${txt.generate} ✨</button>
                        <button id="cp-random" class="btn btn-outline" style="width: 100%;">${txt.random} 🎲</button>

                        <hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.5rem 0;">

                        <!-- Export Format -->
                        <div class="form-group">
                            <label class="form-label">${txt.export}</label>
                            <select id="cp-fmt" class="form-select">
                                <option value="css">CSS Variables</option>
                                <option value="scss">SCSS</option>
                                <option value="json">JSON</option>
                                <option value="tailwind">Tailwind</option>
                                <option value="swift">Swift</option>
                            </select>
                        </div>

                        <button id="cp-copy" class="btn btn-secondary" style="width: 100%;">📋 ${txt.copyCode}</button>
                    </div>
                </div>

                <!-- Main Area -->
                <div>
                    <!-- Color Palette Grid -->
                    <div id="cp-palette" style="display: grid; gap: 12px; margin-bottom: 2rem;"></div>

                    <!-- Gradient Preview -->
                    <div id="cp-gradient" style="height: 100px; border-radius: 16px; margin-bottom: 2rem; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"></div>

                    <!-- WCAG Contrast Checker -->
                    <div class="card" style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 16px; margin-bottom: 2rem;">
                        <h5 style="margin-bottom: 1rem; font-size: 0.85rem; text-transform: uppercase; opacity: 0.7;">${txt.checker}</h5>
                        <div id="cp-contrast"></div>
                    </div>

                    <!-- Export Code -->
                    <div class="card" style="padding: 1.5rem; background: #1e1e2e; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px;">
                        <pre id="cp-code" style="margin: 0; color: #a5b4fc; font-family: var(--font-mono); font-size: 0.85rem; white-space: pre-wrap; line-height: 1.6;"></pre>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    setupListeners() {
        const base = document.getElementById('cp-base');
        const hex = document.getElementById('cp-hex');
        const mode = document.getElementById('cp-mode');
        const count = document.getElementById('cp-count');

        base.oninput = () => {
            hex.value = base.value.toUpperCase();
            this.generate();
        };

        hex.oninput = () => {
            const val = hex.value.startsWith('#') ? hex.value : '#' + hex.value;
            if (/^#[0-9A-F]{6}$/i.test(val)) {
                base.value = val;
                this.generate();
            }
        };

        mode.onchange = () => this.generate();

        count.oninput = () => {
            document.getElementById('v-cp-count').textContent = count.value;
            this.generate();
        };

        document.getElementById('cp-gen').onclick = () => this.generate();
        document.getElementById('cp-random').onclick = () => this.randomPalette();
        document.getElementById('cp-copy').onclick = () => this.copyToClipboard(document.getElementById('cp-code').textContent);
        document.getElementById('cp-fmt').onchange = () => this.updateExport();

        this.generate();
    }

    generate() {
        const base = document.getElementById('cp-base').value;
        const mode = document.getElementById('cp-mode').value;
        const count = parseInt(document.getElementById('cp-count').value);

        const hsl = this.hexToHsl(base);
        let palette = [];

        switch (mode) {
            case 'mono':
                for (let i = 0; i < count; i++) {
                    const l = 20 + (60 / (count - 1)) * i;
                    palette.push(this.hslToHex(hsl.h, hsl.s, l));
                }
                break;
            case 'comp':
                palette = [base, this.hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l)];
                while (palette.length < count) {
                    const h = (hsl.h + (120 * palette.length)) % 360;
                    palette.push(this.hslToHex(h, hsl.s, hsl.l));
                }
                break;
            case 'split':
                palette = [
                    base,
                    this.hslToHex((hsl.h + 150) % 360, hsl.s, hsl.l),
                    this.hslToHex((hsl.h + 210) % 360, hsl.s, hsl.l)
                ];
                while (palette.length < count) palette.push(this.hslToHex(Math.random() * 360, hsl.s, hsl.l));
                break;
            case 'triad':
                palette = [base, this.hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l), this.hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l)];
                while (palette.length < count) palette.push(this.hslToHex((hsl.h + 60 * palette.length) % 360, hsl.s, hsl.l));
                break;
            case 'tetrad':
                palette = [
                    base,
                    this.hslToHex((hsl.h + 90) % 360, hsl.s, hsl.l),
                    this.hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
                    this.hslToHex((hsl.h + 270) % 360, hsl.s, hsl.l)
                ];
                while (palette.length < count) palette.push(this.hslToHex((hsl.h + 45 * palette.length) % 360, hsl.s, hsl.l));
                break;
            case 'analog':
                const step = 30;
                for (let i = 0; i < count; i++) {
                    const h = (hsl.h + (i - Math.floor(count / 2)) * step + 360) % 360;
                    palette.push(this.hslToHex(h, hsl.s, hsl.l));
                }
                break;
            case 'shades':
                for (let i = 0; i < count; i++) {
                    const l = 80 - (60 / (count - 1)) * i;
                    palette.push(this.hslToHex(hsl.h, hsl.s, l));
                }
                break;
        }

        this.currentPalette = palette.slice(0, count);
        this.renderPalette();
        this.updateGradient();
        this.updateContrast();
        this.updateExport();
    }

    randomPalette() {
        const randomHex = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        document.getElementById('cp-base').value = randomHex();
        document.getElementById('cp-hex').value = randomHex().toUpperCase();
        this.generate();
    }

    renderPalette() {
        const container = document.getElementById('cp-palette');
        container.innerHTML = this.currentPalette.map((color, i) => {
            const isDark = this.isDark(color);
            const rgb = this.hexToRgb(color);
            const hsl = this.hexToHsl(color);

            return `
                <div style="background: ${color}; color: ${isDark ? '#fff' : '#000'}; padding: 2rem 1.5rem; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border: 2px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}; position: relative; overflow: hidden; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                        <div>
                            <div style="font-family: var(--font-mono); font-weight: 800; font-size: 1.3rem; margin-bottom: 4px;">${color.toUpperCase()}</div>
                            <div style="font-size: 0.75rem; opacity: 0.7; font-family: var(--font-mono);">RGB(${rgb.r}, ${rgb.g}, ${rgb.b})</div>
                            <div style="font-size: 0.75rem; opacity: 0.7; font-family: var(--font-mono);">HSL(${Math.round(hsl.h)}°, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)</div>
                        </div>
                        <button onclick="window.activeToolInstance.copyToClipboard('${color}')" class="btn btn-sm" style="background: ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}; border: none; color: inherit; padding: 6px 12px; font-size: 0.7rem;">Copy</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateGradient() {
        const grad = document.getElementById('cp-gradient');
        const gradient = `linear-gradient(90deg, ${this.currentPalette.join(', ')})`;
        grad.style.background = gradient;
    }

    updateContrast() {
        const container = document.getElementById('cp-contrast');
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';

        if (this.currentPalette.length < 2) {
            container.innerHTML = `<p style="opacity:0.5; font-size:0.85rem;">${isTr ? 'En az 2 renk gerekli' : 'Need at least 2 colors'}</p>`;
            return;
        }

        const getBadge = (ratio) => {
            if (ratio >= 7) return '<span style="background:#22c55e; color:white; padding:2px 6px; border-radius:4px; font-size:0.7rem;font-weight:700;">AAA</span>';
            if (ratio >= 4.5) return '<span style="background:#3b82f6; color:white; padding:2px 6px; border-radius:4px; font-size:0.7rem;font-weight:700;">AA</span>';
            return '<span style="background:#ef4444; color:white; padding:2px 6px; border-radius:4px; font-size:0.7rem;font-weight:700;">FAIL</span>';
        };

        const c1 = this.currentPalette[0];
        const c2 = this.currentPalette[1];
        const ratio = this.getContrastRatio(c1, c2).toFixed(2);

        container.innerHTML = `
            <div style="display: flex; gap: 15px; align-items: center;">
                <div style="width: 40px; height: 40px; background: ${c1}; border-radius: 8px; border: 2px solid rgba(255,255,255,0.2);"></div>
                <span style="font-weight: 700;">vs</span>
                <div style="width: 40px; height: 40px; background: ${c2}; border-radius: 8px; border: 2px solid rgba(255,255,255,0.2);"></div>
                <div style="flex:1; font-family: var(--font-mono);">${isTr ? 'Oran' : 'Ratio'}: <strong>${ratio}:1</strong></div>
                ${getBadge(ratio)}
            </div>
        `;
    }

    updateExport() {
        const fmt = document.getElementById('cp-fmt').value;
        const code = document.getElementById('cp-code');
        let output = '';

        switch (fmt) {
            case 'css':
                output = ':root {\n' + this.currentPalette.map((c, i) => `  --color-${i + 1}: ${c};`).join('\n') + '\n}';
                break;
            case 'scss':
                output = this.currentPalette.map((c, i) => `$color-${i + 1}: ${c};`).join('\n');
                break;
            case 'json':
                output = JSON.stringify(this.currentPalette, null, 2);
                break;
            case 'tailwind':
                output = `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n        custom: {\n${this.currentPalette.map((c, i) => `          ${(i + 1) * 100}: '${c}',`).join('\n')}\n        }\n      }\n    }\n  }\n}`;
                break;
            case 'swift':
                output = this.currentPalette.map((c, i) => {
                    const rgb = this.hexToRgb(c);
                    return `let color${i + 1} = UIColor(red: ${(rgb.r / 255).toFixed(3)}, green: ${(rgb.g / 255).toFixed(3)}, blue: ${(rgb.b / 255).toFixed(3)}, alpha: 1.0)`;
                }).join('\n');
                break;
        }

        code.textContent = output;
    }

    hexToRgb(hex) {
        return {
            r: parseInt(hex.slice(1, 3), 16),
            g: parseInt(hex.slice(3, 5), 16),
            b: parseInt(hex.slice(5, 7), 16)
        };
    }

    hexToHsl(hex) {
        let { r, g, b } = this.hexToRgb(hex);
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
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

    hslToHex(h, s, l) {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }

    isDark(hex) {
        const { r, g, b } = this.hexToRgb(hex);
        return (r * 0.299 + g * 0.587 + b * 0.114) < 128;
    }

    getLuminance(hex) {
        const { r, g, b } = this.hexToRgb(hex);
        const [rs, gs, bs] = [r, g, b].map(c => {
            c /= 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }

    getContrastRatio(hex1, hex2) {
        const l1 = this.getLuminance(hex1);
        const l2 = this.getLuminance(hex2);
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        return (lighter + 0.05) / (darker + 0.05);
    }
}

// Register tool
window.initColorPaletteLogic = ColorPaletteProTool;
