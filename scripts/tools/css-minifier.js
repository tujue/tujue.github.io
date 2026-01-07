/* TULPAR - CSS Minifier & Optimizer Tool */
class CssMinifierTool extends BaseTool {
    constructor(config) {
        super(config);
    }

    renderUI() {
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const txt = isTr ? {
            title: 'CSS Küçültücü',
            input: 'CSS Kodunuzu Buraya Yapıştırın',
            output: 'Küçültülmüş CSS Çıktısı',
            minify: 'Küçült (Minify)',
            beautify: 'Güzelleştir (Beautify)',
            copy: 'Kopyala',
            clear: 'Temizle',
            stats: 'İstatistikler'
        } : {
            title: 'CSS Minifier',
            input: 'Paste Your CSS Here',
            output: 'Minified CSS Output',
            minify: 'Minify CSS',
            beautify: 'Beautify CSS',
            copy: 'Copy',
            clear: 'Clear',
            stats: 'Statistics'
        };

        return `
        <div class="tool-content css-minifier-tool" style="max-width: 1000px; margin: 0 auto;">
            <div class="grid-layout" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                
                <!-- Input Section -->
                <div class="input-section">
                    <label class="form-label d-flex justify-content-between">
                        ${txt.input}
                        <span class="badge bg-secondary" id="css-in-size">0 B</span>
                    </label>
                    <textarea id="css-input" class="form-control code-editor" style="height: 400px; font-family: monospace; font-size: 14px; white-space: pre;" placeholder="body { color: black; }..."></textarea>
                    
                    <div class="action-buttons" style="margin-top: 1rem; display: flex; gap: 10px;">
                        <button id="btn-minify" class="btn btn-primary flex-grow-1">📉 ${txt.minify}</button>
                        <button id="btn-beautify" class="btn btn-info flex-grow-1">✨ ${txt.beautify}</button>
                        <button id="btn-clear" class="btn btn-danger">🗑️</button>
                    </div>
                </div>

                <!-- Output Section -->
                <div class="output-section">
                    <label class="form-label d-flex justify-content-between">
                        ${txt.output}
                        <div>
                            <span class="badge bg-success" id="css-out-size">0 B</span>
                            <span class="badge bg-primary" id="css-savings" style="display:none">0% Saved</span>
                        </div>
                    </label>
                    <textarea id="css-output" class="form-control code-editor" style="height: 400px; font-family: monospace; font-size: 14px; color: var(--success);" readonly></textarea>
                    
                    <button id="btn-copy" class="btn btn-success" style="width: 100%; margin-top: 1rem;">📋 ${txt.copy}</button>
                </div>

            </div>
        </div>
        `;
    }

    setupListeners() {
        // Elements
        const input = document.getElementById('css-input');
        const output = document.getElementById('css-output');
        const btnMinify = document.getElementById('btn-minify');
        const btnBeautify = document.getElementById('btn-beautify');
        const btnCopy = document.getElementById('btn-copy');
        const btnClear = document.getElementById('btn-clear');

        // Listeners
        btnMinify.onclick = () => {
            const css = input.value;
            if (!css.trim()) return;
            const minified = this.minifyCSS(css);
            output.value = minified;
            this.updateStats(css, minified);
        };

        btnBeautify.onclick = () => {
            const css = input.value || output.value;
            if (!css.trim()) return;
            const beautified = this.beautifyCSS(css);
            output.value = beautified; // Put result in output too
            // Optional: Also update input
            // input.value = beautified;
            this.updateStats(css, beautified);
        };

        btnCopy.onclick = () => {
            if (!output.value) return;
            navigator.clipboard.writeText(output.value);
            const originalText = btnCopy.innerHTML;
            btnCopy.innerHTML = '✅ Copied!';
            setTimeout(() => btnCopy.innerHTML = originalText, 1500);
        };

        btnClear.onclick = () => {
            input.value = '';
            output.value = '';
            this.updateStats('', '');
        };

        input.oninput = () => {
            this.updateSizeDisplay(input.value, document.getElementById('css-in-size'));
        };
    }

    minifyCSS(css) {
        return css
            .replace(/\/\*[\s\S]*?\*\//g, "") // Remove comments
            .replace(/\s+/g, " ") // Collapse whitespace
            .replace(/\s?([:;{},])\s?/g, "$1") // Remove mix whitespace
            .replace(/;}/g, "}") // Remove last semicolon
            .trim();
    }

    beautifyCSS(css) {
        // Simple regex based beautifier
        // 1. Minify first to clean up
        const minified = this.minifyCSS(css);
        // 2. Add newlines and indentation
        return minified
            .replace(/{/g, " {\n  ")
            .replace(/;/g, ";\n  ")
            .replace(/}/g, "\n}\n")
            .replace(/\n\s*}/g, "\n}")
            .replace(/,\s*/g, ", ");
    }

    updateStats(original, processed) {
        this.updateSizeDisplay(original, document.getElementById('css-in-size'));
        this.updateSizeDisplay(processed, document.getElementById('css-out-size'));

        const savings = document.getElementById('css-savings');
        if (original.length > 0 && processed.length < original.length) {
            const percent = ((original.length - processed.length) / original.length * 100).toFixed(1);
            savings.textContent = `-${percent}%`;
            savings.style.display = 'inline-block';
        } else {
            savings.style.display = 'none';
        }
    }

    updateSizeDisplay(text, element) {
        const bytes = new Blob([text]).size;
        let size = bytes + ' B';
        if (bytes > 1024) size = (bytes / 1024).toFixed(2) + ' KB';
        element.textContent = size;
    }
}

// Register tool
window.initCssMinifierLogic = CssMinifierTool;
