/* TULPAR - ASCII Art Tool (Full Viewport Fluid Layout) */
window.initAsciiArtLogic = function () {
    console.log('🚀 Loading ASCII Art Tool (Fluid v6)');

    const workspaceBody = document.getElementById('workspace-body');
    if (!workspaceBody) return;

    class AsciiArtLogic {
        constructor() {
            this.id = 'ascii-art';
            this.currentMode = 'image';
            this.srcImage = null;
            this.zoomLevel = 1.0;
        }

        render(container) {
            container.innerHTML = this.renderUI();
            this.setupListeners();
            // Initial resize logic
            window.addEventListener('resize', () => this.fitContent());
        }

        renderUI() {
            const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
            const txt = isTr ? {
                title: 'Dosya / Metin',
                imgMode: 'Görsel Yükle',
                txtMode: 'Metin Gir',
                drop: 'Dosya Seç',
                res: 'Çözünürlük',
                contrast: 'Kontrast',
                invert: 'Ters Renk',
                color: 'Renkli',
                copy: 'Kopyala',
                placeholder: 'Metin...'
            } : {
                title: 'Input',
                imgMode: 'Image',
                txtMode: 'Text',
                drop: 'Select File',
                res: 'Resolution',
                contrast: 'Contrast',
                invert: 'Invert',
                color: 'Color',
                copy: 'Copy',
                placeholder: 'Text...'
            };

            // Full Height Flex Layout
            // calc(100vh - 200px) accounts for header/footer margins of the main app
            return `
            <div style="height: calc(100vh - 140px); min-height: 500px; display: flex; flex-direction: column; overflow: hidden;">
                
                <div style="display: flex; gap: 20px; flex: 1; overflow: hidden;">
                    <!-- SIDEBAR (Fixed Width, Scrollable) -->
                    <div style="width: 300px; flex-shrink: 0; display: flex; flex-direction: column; gap: 1rem; overflow-y: auto; padding: 5px; padding-right: 15px;">
                        
                        <div class="card" style="padding: 1rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 12px;">
                            <div class="btn-group" style="width: 100%; margin-bottom: 1rem;">
                                <button id="asc-tab-img" class="btn btn-sm btn-primary" style="flex:1;">${txt.imgMode}</button>
                                <button id="asc-tab-txt" class="btn btn-sm btn-outline" style="flex:1;">${txt.txtMode}</button>
                            </div>

                            <div id="asc-img-ctrl">
                                <div id="asc-drop" class="dropzone" style="height: 80px; border: 2px dashed var(--border-color); border-radius: 8px; display: flex; flex-direction: column; justify-content: center; align-items: center; cursor: pointer; background: rgba(0,0,0,0.2);">
                                    <span id="asc-drop-txt" style="font-size: 0.75rem; opacity: 0.8; text-align: center; padding: 5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 250px;">${txt.drop}</span>
                                    <input type="file" id="asc-in-file" hidden accept="image/*">
                                </div>
                            </div>

                            <div id="asc-txt-ctrl" style="display: none;">
                                <textarea id="asc-in-text" class="form-input" style="height: 80px; font-size: 0.85rem; resize: vertical;" placeholder="${txt.placeholder}"></textarea>
                            </div>
                        </div>

                        <div class="card" style="padding: 1rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 12px;">
                            <div class="form-group" style="margin-bottom: 10px;">
                                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                                    <label class="form-label" style="margin:0;">${txt.res}</label>
                                    <span id="asc-val-w" style="font-size:0.8rem; color:var(--primary);">150</span>
                                </div>
                                <input type="range" id="asc-in-w" class="form-range" min="50" max="600" value="150" step="10">
                            </div>

                            <div class="form-group" style="margin-bottom: 10px;">
                                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                                    <label class="form-label" style="margin:0;">${txt.contrast}</label>
                                    <span style="font-size:0.8rem; opacity:0.7;">+/-</span>
                                </div>
                                <input type="range" id="asc-in-ct" class="form-range" min="0.5" max="3" step="0.1" value="1.2">
                            </div>

                            <div style="display: flex; gap: 15px; margin-bottom: 1rem;">
                                <label class="checkbox-container"><input type="checkbox" id="asc-in-inv"><span class="checkmark"></span><span style="font-size: 0.85rem;">${txt.invert}</span></label>
                                <label class="checkbox-container"><input type="checkbox" id="asc-in-clr"><span class="checkmark"></span><span style="font-size: 0.85rem;">${txt.color}</span></label>
                            </div>
                            
                            <button id="asc-btn-copy" class="btn btn-primary" style="width: 100%; font-weight: 700;">${txt.copy}</button>
                        </div>
                    </div>

                    <!-- PREVIEW AREA (Fluid, Auto-Scale) -->
                    <div id="asc-preview-container" style="flex: 1; background: black; border-radius: 12px; border: 1px solid #333; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                        <!-- The ASCII content -->
                        <div id="asc-wrapper" style="transform-origin: center center; transition: transform 0.2s cubic-bezier(0.1, 0.7, 1.0, 0.1);">
                             <pre id="asc-out" style="margin: 0; font-family: 'Courier New', monospace; line-height: 0.6; color: #00ff00; font-weight: bold; white-space: pre; font-size: 10px;"></pre>
                        </div>

                        <!-- Zoom GUI -->
                         <div style="position: absolute; bottom: 15px; right: 15px; background: rgba(0,0,0,0.6); padding: 5px 10px; border-radius: 20px; display: flex; gap: 10px; align-items: center; backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.1);">
                            <button id="asc-zoom-out" style="background:none; border:none; color:white; cursor:pointer; font-size:1.2rem; line-height:1;">−</button>
                            <span id="asc-zoom-val" style="color:white; font-size:0.8rem; font-family:monospace; min-width:40px; text-align:center;">FIT</span>
                            <button id="asc-zoom-in" style="background:none; border:none; color:white; cursor:pointer; font-size:1.2rem; line-height:1;">+</button>
                        </div>
                    </div>

                </div>
            </div>
            `;
        }

        setupListeners() {
            const tabImg = document.getElementById('asc-tab-img');
            const tabTxt = document.getElementById('asc-tab-txt');
            const imgCtrl = document.getElementById('asc-img-ctrl');
            const txtCtrl = document.getElementById('asc-txt-ctrl');
            const inFile = document.getElementById('asc-in-file');
            const inText = document.getElementById('asc-in-text');
            const inW = document.getElementById('asc-in-w');

            const updateTab = (mode) => {
                this.currentMode = mode;
                if (mode === 'image') {
                    imgCtrl.style.display = 'block';
                    txtCtrl.style.display = 'none';
                    if (tabImg) tabImg.classList.replace('btn-outline', 'btn-primary');
                    if (tabTxt) tabTxt.classList.replace('btn-primary', 'btn-outline');
                    this.renderPreview();
                } else {
                    imgCtrl.style.display = 'none';
                    txtCtrl.style.display = 'block';
                    if (tabTxt) tabTxt.classList.replace('btn-outline', 'btn-primary');
                    if (tabImg) tabImg.classList.replace('btn-primary', 'btn-outline');
                    this._renderTextWrapper();
                }
            };

            if (tabImg) tabImg.onclick = () => updateTab('image');
            if (tabTxt) tabTxt.onclick = () => updateTab('text');
            const drop = document.getElementById('asc-drop');
            if (drop) drop.onclick = () => inFile.click();

            if (inFile) inFile.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (re) => {
                        const img = new Image();
                        img.onload = () => {
                            this.srcImage = img;
                            const txt = document.getElementById('asc-drop-txt');
                            if (txt) txt.textContent = file.name;
                            this.renderPreview();
                        };
                        img.src = re.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            };

            if (inText) inText.oninput = () => this._renderTextWrapper();

            const redraw = () => {
                if (document.getElementById('asc-val-w')) document.getElementById('asc-val-w').textContent = inW.value;
                if (this.currentMode === 'image') this.renderPreview();
                else this._renderTextWrapper();
            };

            ['asc-in-w', 'asc-in-ct', 'asc-in-inv', 'asc-in-clr'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.oninput = redraw;
            });

            document.getElementById('asc-btn-copy').onclick = () => {
                this.copyToClipboard(document.getElementById('asc-out').textContent);
            };

            // ZOOM CONTROLS
            document.getElementById('asc-zoom-in').onclick = () => {
                this.zoomLevel += 0.1;
                this.applyZoom();
            };
            document.getElementById('asc-zoom-out').onclick = () => {
                this.zoomLevel = Math.max(0.1, this.zoomLevel - 0.1);
                this.applyZoom();
            };
        }

        renderPreview() {
            if (this.currentMode !== 'image' || !this.srcImage) return;
            this._process(this.srcImage);
        }

        _renderTextWrapper() {
            const textVal = document.getElementById('asc-in-text').value;
            if (!textVal) return;

            const wVal = parseInt(document.getElementById('asc-in-w').value);

            // Text Mode: Dynamically adjust wrap width based on user resolution
            // to ensure readability.
            const targetColsPerLetter = 12; // Higher is more readable
            const lettersPerLine = Math.max(5, Math.floor(wVal / targetColsPerLetter));

            const fontSize = 80;
            const charWidth = fontSize * 0.6;
            const canvasWidth = lettersPerLine * charWidth;
            const lineHeight = fontSize * 1.1; // Tighter lines

            const c = document.createElement('canvas');
            const ctx = c.getContext('2d');
            ctx.font = `bold ${fontSize}px sans-serif`;

            const paragraphs = textVal.split('\n');
            let finalLines = [];

            paragraphs.forEach(p => {
                const words = p.split(' ');
                let currentLine = words[0] || '';

                for (let i = 1; i < words.length; i++) {
                    const w = ctx.measureText(currentLine + ' ' + words[i]).width;
                    if (w < canvasWidth - 20) currentLine += ' ' + words[i];
                    else {
                        finalLines.push(currentLine);
                        currentLine = words[i];
                    }
                }

                if (ctx.measureText(currentLine).width > canvasWidth - 20) {
                    let temp = '';
                    for (let char of currentLine) {
                        if (ctx.measureText(temp + char).width < canvasWidth - 20) temp += char;
                        else {
                            finalLines.push(temp);
                            temp = char;
                        }
                    }
                    if (temp) finalLines.push(temp);
                } else {
                    if (currentLine) finalLines.push(currentLine);
                }
            });
            if (finalLines.length === 0) return;

            // Extra padding
            const h = Math.max(100, finalLines.length * lineHeight + 80);
            c.width = canvasWidth;
            c.height = h;

            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvasWidth, h);
            ctx.fillStyle = '#000000';
            ctx.font = `bold ${fontSize}px sans-serif`;
            ctx.textBaseline = 'top';

            // Draw centered
            finalLines.forEach((line, i) => {
                ctx.fillText(line, 10, 40 + i * lineHeight);
            });

            this._process(c);
        }

        _process(source) {
            const wVal = document.getElementById('asc-in-w').value;
            const w = parseInt(wVal);
            const ctVal = document.getElementById('asc-in-ct').value;
            const contrast = parseFloat(ctVal);
            const inverted = document.getElementById('asc-in-inv').checked;
            const color = document.getElementById('asc-in-clr').checked;
            const out = document.getElementById('asc-out');

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            const aspect = source.height / source.width;
            const h = Math.floor(w * aspect * 0.55);

            canvas.width = w;
            canvas.height = h;

            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, w, h);
            ctx.drawImage(source, 0, 0, w, h);

            // Image Processing
            const imageData = ctx.getImageData(0, 0, w, h);
            const data = imageData.data;
            let output = '';
            const chars = inverted ? '@%#*+=-:. ' : ' .:-=+*#%@';

            for (let y = 0; y < h; y++) {
                let line = '';
                for (let x = 0; x < w; x++) {
                    const offset = (y * w + x) * 4;
                    const r = data[offset];
                    const g = data[offset + 1];
                    const b = data[offset + 2];

                    let brightness = (0.299 * r + 0.587 * g + 0.114 * b);
                    brightness = ((brightness - 128) * contrast) + 128;
                    if (brightness < 0) brightness = 0;
                    if (brightness > 255) brightness = 255;

                    const charIndex = Math.floor((brightness / 255) * (chars.length - 1));
                    const char = chars[charIndex] || chars[chars.length - 1];

                    if (color) line += `<span style="color: rgb(${r},${g},${b})">${char}</span>`;
                    else line += char;
                }
                output += line + '\n';
            }

            if (out) {
                if (color) out.innerHTML = output;
                else out.textContent = output;

                // RESET ZOOM TO FIT
                this.fitContent();
            }
        }

        fitContent() {
            const container = document.getElementById('asc-preview-container');
            const wrapper = document.getElementById('asc-wrapper');
            const out = document.getElementById('asc-out');
            if (!container || !wrapper || !out) return;

            // Reset transform to measure true size
            wrapper.style.transform = 'scale(1)';

            const contW = container.clientWidth - 40;
            const contH = container.clientHeight - 40;
            const contentW = out.scrollWidth;
            const contentH = out.scrollHeight;

            if (contentW === 0 || contentH === 0) return;

            // Calculate Scale to Fit Both
            const scaleX = contW / contentW;
            const scaleY = contH / contentH;
            let scale = Math.min(scaleX, scaleY);

            // Limit max scale to 1 (don't zoom in pixelated) or maybe 1.5
            if (scale > 2) scale = 2; // Allow some zoom in for small arts

            this.zoomLevel = scale;
            this.applyZoom(true);
        }

        applyZoom(isAuto = false) {
            const wrapper = document.getElementById('asc-wrapper');
            const label = document.getElementById('asc-zoom-val');
            if (!wrapper) return;

            wrapper.style.transform = `scale(${this.zoomLevel})`;
            if (label) label.textContent = isAuto ? 'FIT' : Math.round(this.zoomLevel * 100) + '%';
        }

        async copyToClipboard(text) {
            try {
                await navigator.clipboard.writeText(text);
                if (window.showNotification) window.showNotification('Panoya kopyalandı', 'success');
                else alert('Kopyalandı!');
            } catch (e) { alert('Panoya kopyalama başarısız'); }
        }
    }

    const instance = new AsciiArtLogic();
    instance.render(workspaceBody);
};
