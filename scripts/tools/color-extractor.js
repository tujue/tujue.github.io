/* TULPAR - Image Studio Tool OOP Implementation */
class ImageStudioTool extends BaseTool {
    constructor(config) {
        super(config);
        this.currentImage = null;
        this.filters = { brightness: 100, contrast: 100, grayscale: 0, blur: 0, sepia: 0, hueRotate: 0, saturate: 100, invert: 0, opacity: 100 };
        this.transform = { rotate: 0, flipH: 1, flipV: 1 };
    }

    renderUI() {
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const txt = isTr ? {
            title: 'Görsel İşleme Stüdyosu',
            drop: 'Görseli bırakın veya yükleyin',
            tabs: { analyze: 'Analiz', edit: 'Düzenle', export: 'Dışa Aktar' },
            palette: 'Renk Paleti',
            rotate: 'Döndür',
            flip: 'Çevir',
            quality: 'Kalite',
            format: 'Dosya Formatı',
            width: 'Maks Genişlik',
            download: 'Görseli Kaydet 💾',
            downloadPalette: 'Paleti İndir (.txt) 🎨',
            reset: 'Sıfırla'
        } : {
            title: 'Image Intelligence Studio',
            drop: 'Drop image or click to browse',
            tabs: { analyze: 'Analyze', edit: 'Enhance', export: 'Export' },
            palette: 'Color Palette',
            rotate: 'Rotate',
            flip: 'Flip',
            quality: 'Visual Quality',
            format: 'Output Format',
            width: 'Max Width',
            download: 'Save Image 💾',
            downloadPalette: 'Save Palette (.txt) 🎨',
            reset: 'Reset'
        };

        const filterControls = [
            { id: 'brightness', n: isTr ? 'Parlaklık' : 'Brightness', m: 0, x: 200, d: 100 },
            { id: 'contrast', n: isTr ? 'Kontrast' : 'Contrast', m: 0, x: 200, d: 100 },
            { id: 'saturate', n: isTr ? 'Doygunluk' : 'Saturate', m: 0, x: 200, d: 100 },
            { id: 'blur', n: isTr ? 'Bulanıklık' : 'Blur', m: 0, x: 20, d: 0 },
            { id: 'sepia', n: isTr ? 'Sepya' : 'Sepia', m: 0, x: 100, d: 0 },
            { id: 'grayscale', n: isTr ? 'Siyah Beyaz' : 'Grayscale', m: 0, x: 100, d: 0 }
        ];

        return `
        <div class="tool-content istudio" style="max-width: 1250px; margin: 0 auto; padding: 20px;">
            <div class="grid-layout" style="display: grid; grid-template-columns: 340px 1fr; gap: 2.5rem;">
                
                <!-- Sidebar -->
                <div class="is-sidebar">
                    <div class="card" style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 20px; position: sticky; top: 20px;">
                        <h4 style="margin-bottom: 1.5rem; color: var(--primary); text-transform: uppercase; font-size: 0.85rem;">${txt.title}</h4>
                        
                        <div class="btn-group" style="width: 100%; margin-bottom: 2rem;">
                            <button id="is-tab-ana" class="btn btn-sm btn-primary" style="flex:1;">${txt.tabs.analyze}</button>
                            <button id="is-tab-ed" class="btn btn-sm btn-outline" style="flex:1;">${txt.tabs.edit}</button>
                            <button id="is-tab-ex" class="btn btn-sm btn-outline" style="flex:1;">${txt.tabs.export}</button>
                        </div>

                        <!-- Analyze Content -->
                        <div id="is-cont-ana">
                            <h5 style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 1rem;">${txt.palette}</h5>
                            <div id="is-palette-grid" style="display: grid; grid-template-columns: 1fr; gap: 8px;">
                                <div style="padding: 2rem; text-align: center; opacity: 0.5; font-size: 0.8rem;">Upload an image to extract colors</div>
                            </div>
                            <button id="is-btn-dl-pal" class="btn btn-primary" style="width: 100%; margin-top: 1.5rem; display: none;">${txt.downloadPalette}</button>
                        </div>

                        <!-- Edit Content -->
                        <div id="is-cont-ed" style="display: none;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 1.5rem;">
                                <button id="is-rot-l" class="btn btn-sm btn-outline">↩️ ${txt.rotate}</button>
                                <button id="is-rot-r" class="btn btn-sm btn-outline">↪️ ${txt.rotate}</button>
                                <button id="is-flip-h" class="btn btn-sm btn-outline">↔️ ${txt.flip}</button>
                                <button id="is-flip-v" class="btn btn-sm btn-outline">↕️ ${txt.flip}</button>
                            </div>
                            ${filterControls.map(f => `
                                <div class="form-group" style="margin-bottom: 12px;">
                                    <div style="display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 4px;">
                                        <span>${f.n}</span>
                                        <span id="is-val-${f.id}" style="color: var(--primary); font-weight: 700;">${f.d}</span>
                                    </div>
                                    <input type="range" id="is-in-${f.id}" class="form-range" min="${f.m}" max="${f.x}" value="${f.d}" data-filter="${f.id}">
                                </div>
                            `).join('')}
                        </div>

                        <!-- Export Content -->
                        <div id="is-cont-ex" style="display: none;">
                            <div class="form-group">
                                <label class="form-label">${txt.format}</label>
                                <select id="is-in-fmt" class="form-select">
                                    <option value="image/webp">WebP (${isTr ? 'Optimize' : 'Optimized'})</option>
                                    <option value="image/png">PNG (${isTr ? 'Kayıpsız' : 'Lossless'})</option>
                                    <option value="image/jpeg">JPEG (${isTr ? 'Sıkıştırılmış' : 'Compressed'})</option>
                                    <option value="base64">Base64 String</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">${txt.quality}</label>
                                <input type="range" id="is-in-q" min="1" max="100" value="90">
                            </div>
                            <div class="form-group">
                                <label class="form-label">${txt.width}</label>
                                <input type="number" id="is-in-w" class="form-input" placeholder="Keep original">
                            </div>
                        </div>

                        <button id="is-btn-dl" class="btn btn-primary" style="width: 100%; margin-top: 1.5rem; display: none;">${txt.download}</button>
                    </div>
                </div>

                <!-- Preview Canvas Area -->
                <div class="is-preview">
                    <div class="card" style="padding: 1rem; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 20px; min-height: 600px; display: flex; align-items: center; justify-content: center; position: relative;">
                         <div id="is-drop" style="text-align: center; cursor: pointer; padding: 4rem; width: 100%;">
                            <div style="font-size: 4rem; margin-bottom: 1.5rem; opacity: 0.2;">📸</div>
                            <p style="opacity: 0.5;">${txt.drop}</p>
                            <input type="file" id="is-in-file" hidden accept="image/*">
                         </div>
                         <img id="is-preview-img" style="max-width: 100%; max-height: 80vh; display: none; border-radius: 8px; box-shadow: 0 20px 50px rgba(0,0,0,0.3);">
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    setupListeners() {
        const drop = document.getElementById('is-drop');
        const inFile = document.getElementById('is-in-file');
        const preview = document.getElementById('is-preview-img');
        const tabBtns = { ana: document.getElementById('is-tab-ana'), ed: document.getElementById('is-tab-ed'), ex: document.getElementById('is-tab-ex') };
        const conts = { ana: document.getElementById('is-cont-ana'), ed: document.getElementById('is-cont-ed'), ex: document.getElementById('is-cont-ex') };
        const btnDl = document.getElementById('is-btn-dl');
        const btnPal = document.getElementById('is-btn-dl-pal');

        const switchTab = (tab) => {
            Object.keys(tabBtns).forEach(k => {
                tabBtns[k].classList.replace('btn-primary', 'btn-outline');
                conts[k].style.display = 'none';
            });
            tabBtns[tab].classList.replace('btn-outline', 'btn-primary');
            conts[tab].style.display = 'block';

            // Button Visibility Logic based on Active Tab
            if (this.currentImage) {
                if (tab === 'ana') {
                    btnDl.style.display = 'none';
                    btnPal.style.display = 'block';
                } else {
                    btnDl.style.display = 'block';
                    btnPal.style.display = 'none';
                }
            }
        };

        tabBtns.ana.onclick = () => switchTab('ana');
        tabBtns.ed.onclick = () => switchTab('ed');
        tabBtns.ex.onclick = () => switchTab('ex');

        drop.onclick = () => inFile.click();
        inFile.onchange = (e) => this._handleImage(e.target.files[0]);

        // Filter events
        document.querySelectorAll('[data-filter]').forEach(input => {
            input.oninput = () => {
                this.filters[input.dataset.filter] = input.value;
                document.getElementById(`is-val-${input.dataset.filter}`).textContent = input.value;
                this._applyPreview();
            };
        });

        // Transform events
        document.getElementById('is-rot-l').onclick = () => { this.transform.rotate -= 90; this._applyPreview(); };
        document.getElementById('is-rot-r').onclick = () => { this.transform.rotate += 90; this._applyPreview(); };
        document.getElementById('is-flip-h').onclick = () => { this.transform.flipH *= -1; this._applyPreview(); };
        document.getElementById('is-flip-v').onclick = () => { this.transform.flipV *= -1; this._applyPreview(); };

        // Save Palette Button Logic
        btnPal.onclick = () => {
            if (!this.currentPalette || this.currentPalette.length === 0) return;

            let content = "TULPAR COLOR PALETTE EXPORT\n---------------------------\n\n";
            this.currentPalette.forEach((c, i) => {
                content += `Color #${i + 1}: ${c.hex}\n`;
            });

            const blob = new Blob([content], { type: 'text/plain' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'palette_' + Date.now() + '.txt';
            a.click();
        };

        btnDl.onclick = async () => {
            if (!this.currentImage) return;
            const ops = {
                filters: this.filters,
                transform: this.transform,
                targetWidth: parseInt(document.getElementById('is-in-w').value) || null,
                format: document.getElementById('is-in-fmt').value,
                quality: parseInt(document.getElementById('is-in-q').value)
            };
            const result = await window.DevTools.colorExtractor.processImage(this.currentImage, ops);
            if (ops.format === 'base64') {
                this.copyToClipboard(result.result);
            } else {
                const a = document.createElement('a');
                a.href = result.url;
                a.download = result.download;
                a.click();
            }
        };
    }

    _handleImage(file) {
        if (!file || !file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (re) => {
            const img = new Image();
            img.onload = () => {
                this.currentImage = img;
                const preview = document.getElementById('is-preview-img');
                preview.src = re.target.result;
                preview.style.display = 'block';
                document.getElementById('is-drop').style.display = 'none';

                // Show Correct Button
                const isAna = document.getElementById('is-tab-ana').classList.contains('btn-primary');
                document.getElementById('is-btn-dl-pal').style.display = isAna ? 'block' : 'none';
                document.getElementById('is-btn-dl').style.display = isAna ? 'none' : 'block';

                // Extract Palette
                this._extractPalette();
            };
            img.src = re.target.result;
        };
        reader.readAsDataURL(file);
    }

    _extractPalette() {
        const palette = window.DevTools.colorExtractor.extractPalette(this.currentImage);
        this.currentPalette = palette;
        const grid = document.getElementById('is-palette-grid');
        grid.innerHTML = palette.map(c => `
            <div style="display: flex; align-items: center; gap: 10px; background: rgba(0,0,0,0.1); padding: 8px; border-radius: 8px; border: 1px solid var(--border-color);">
                <div style="width: 32px; height: 32px; background: ${c.hex}; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1);"></div>
                <div style="flex: 1; font-family: var(--font-mono); font-size: 0.8rem; font-weight: 700;">${c.hex}</div>
                <button class="btn btn-sm btn-outline" style="font-size: 0.6rem; padding: 4px 8px;" onclick="window.DevTools.copyToClipboard('${c.hex}', this)">Copy</button>
            </div>
        `).join('');
    }

    _applyPreview() {
        const preview = document.getElementById('is-preview-img');
        if (!preview) return;
        const f = this.filters;
        preview.style.filter = `brightness(${f.brightness}%) contrast(${f.contrast}%) saturate(${f.saturate}%) grayscale(${f.grayscale}%) blur(${f.blur}px) sepia(${f.sepia}%)`;
        preview.style.transform = `rotate(${this.transform.rotate}deg) scale(${this.transform.flipH}, ${this.transform.flipV})`;
    }
}

// Register tool
window.initColorExtractorLogic = ImageStudioTool;
