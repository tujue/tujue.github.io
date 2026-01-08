/* TULPAR - SVG Optimizer Tool OOP Implementation */
class SVGOptimizerTool extends BaseTool {
    constructor(config) {
        super(config);
    }

    renderUI() {
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const txt = isTr ? {
            title: 'Vektör Optimizasyon Stüdyosu',
            raw: 'Hammade (SVG Kodu)',
            opt: 'Optimize Edilmiş Kod',
            run: 'Suyu Sıkılmış SVG Üret ⚡',
            prec: 'Hassasiyet:',
            view: 'Canlı Önizleme',
            copy: 'Sonucu Kopyala',
            stats: { orig: 'Orijinal', opt: 'Optimize', save: 'Kazanç' },
            previewPlaceholder: 'Önizleme alanı'
        } : {
            title: 'Vector Optimization Studio',
            raw: 'Raw SVG Payload',
            opt: 'Optimized Code',
            run: 'Generate Clean SVG ⚡',
            prec: 'Float Precision:',
            view: 'Live Preview',
            copy: 'Copy Result',
            stats: { orig: 'Original', opt: 'Optimized', save: 'Savings' },
            previewPlaceholder: 'Preview area'
        };

        return `
        <div class="tool-content svg-studio" style="max-width: 1200px; margin: 0 auto; padding: 20px;">
            <div class="grid-layout" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem;">
                
                <!-- Input Side -->
                <div class="svg-input-side">
                    <div class="card" style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 20px;">
                        <h4 style="font-size: 0.75rem; text-transform: uppercase; color: var(--primary); margin-bottom: 1.2rem;">${txt.raw}</h4>
                        <textarea id="svg-in-raw" class="form-input" style="height: 350px; font-family: var(--font-mono); font-size: 0.85rem;" placeholder="<svg ...>...</svg>"></textarea>
                        
                        <div class="form-group" style="margin-top: 1.5rem;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                <label class="form-label">${txt.prec}</label>
                                <span id="svg-v-prec" style="font-weight: 700; color: var(--primary);">2</span>
                            </div>
                            <input type="range" id="svg-in-prec" min="0" max="8" value="2" class="form-range">
                        </div>

                        <button id="svg-btn-run" class="btn btn-primary" style="width: 100%; height: 3.5rem; font-weight: 700; margin-top: 1rem;">${txt.run}</button>
                    </div>
                </div>

                <!-- Output Side -->
                <div class="svg-output-side">
                    <div class="card" style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 20px; height: 100%; display: flex; flex-direction: column;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.2rem;">
                             <h4 style="font-size: 0.75rem; text-transform: uppercase; color: #10b981;">${txt.opt}</h4>
                             <button id="svg-btn-copy" class="btn btn-sm btn-outline">${txt.copy}</button>
                        </div>
                        <textarea id="svg-out-opt" class="form-input" style="flex: 1; min-height: 200px; font-family: var(--font-mono); font-size: 0.85rem; background: rgba(0,0,0,0.1); border: none;" readonly></textarea>
                        
                        <div id="svg-stats-bar" style="display: none; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-top: 1rem; padding: 10px; background: rgba(16, 185, 129, 0.1); border-radius: 8px;">
                             <div style="text-align: center;">
                                <div style="font-size: 0.7rem; opacity: 0.6;">${txt.stats.orig}</div>
                                <div id="svg-st-orig" style="font-weight: 700; font-size: 0.85rem;">-</div>
                             </div>
                             <div style="text-align: center;">
                                <div style="font-size: 0.7rem; opacity: 0.6;">${txt.stats.opt}</div>
                                <div id="svg-st-opt" style="font-weight: 700; font-size: 0.85rem;">-</div>
                             </div>
                             <div style="text-align: center;">
                                <div style="font-size: 0.7rem; opacity: 0.6;">${txt.stats.save}</div>
                                <div id="svg-st-save" style="font-weight: 800; font-size: 0.85rem; color: #10b981;">-</div>
                             </div>
                        </div>

                        <div style="margin-top: 2rem;">
                            <h4 style="font-size: 0.75rem; text-transform: uppercase; margin-bottom: 1rem; opacity: 0.5;">${txt.view}</h4>
                            <div id="svg-out-prev" style="height: 200px; background: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; overflow: hidden; background-image: radial-gradient(#ddd 1px, transparent 1px); background-size: 15px 15px;">
                                <span style="opacity: 0.2;">${txt.previewPlaceholder}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    setupListeners() {
        const inTxt = document.getElementById('svg-in-raw');
        const outTxt = document.getElementById('svg-out-opt');
        const prev = document.getElementById('svg-out-prev');
        const precIn = document.getElementById('svg-in-prec');
        const precVal = document.getElementById('svg-v-prec');
        const btnRun = document.getElementById('svg-btn-run');
        const btnCopy = document.getElementById('svg-btn-copy');

        precIn.oninput = () => precVal.textContent = precIn.value;

        btnRun.onclick = () => {
            const raw = inTxt.value.trim();
            if (!raw) return;
            const opt = this.optimize(raw, parseInt(precIn.value));
            outTxt.value = opt;
            prev.innerHTML = opt;

            // Stats
            const origSize = new Blob([raw]).size;
            const optSize = new Blob([opt]).size;
            const savings = ((origSize - optSize) / origSize * 100).toFixed(1);

            document.getElementById('svg-stats-bar').style.display = 'grid';
            document.getElementById('svg-st-orig').textContent = (origSize / 1024).toFixed(2) + ' KB';
            document.getElementById('svg-st-opt').textContent = (optSize / 1024).toFixed(2) + ' KB';
            document.getElementById('svg-st-save').textContent = savings + '%';

            // Auto size SVG to fit preview
            const svgEl = prev.querySelector('svg');
            if (svgEl) {
                svgEl.style.maxWidth = '100%';
                svgEl.style.maxHeight = '100%';
                svgEl.style.width = 'auto';
                svgEl.style.height = 'auto';
            }
        };

        btnCopy.onclick = () => this.copyToClipboard(outTxt.value);
    }

    // INTERNAL LOGIC (Formerly in DevTools.svgTools)

    optimize(svg, precision) {
        let result = svg;

        // 1. Remove comments
        result = result.replace(/<!--[\s\S]*?-->/g, "");

        // 2. Remove XML declaration
        result = result.replace(/<\?xml.*?>/gi, "");

        // 3. Remove doctype
        result = result.replace(/<!DOCTYPE.*?>/gi, "");

        // 4. Collapse whitespace
        result = result.replace(/\s+/g, " ");
        result = result.replace(/>\s+</g, "><");

        // 5. Round numbers using regex callback
        // Matches integers or decimals.
        // We look for sequences of digits/dots that are likely coordinate values in attributes like 'd', 'points', 'x', 'y', 'width', 'height'
        // This is a naive regex approach but works for mostly all numbers in SVG
        result = result.replace(/(\d*\.?\d+)/g, (match) => {
            const num = parseFloat(match);
            if (isNaN(num)) return match;
            // Use simple rounding
            const p = Math.pow(10, precision);
            return (Math.round(num * p) / p).toString();
        });

        // 6. Trim
        return result.trim();
    }
}

// Register tool
window.initSvgOptimizerLogic = SVGOptimizerTool;
