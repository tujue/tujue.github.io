/* TULPAR - Background Remover Tool OOP Implementation */
class BGRemoverTool extends BaseTool {
    constructor(config) {
        super(config);
        this.ctx = null;
        this.canvas = null;
        this.img = null;
        this.mode = 'magic'; // magic, brush, keep, lasso
        this.undoStack = [];
        this.targetColor = null;
        this.clickPos = { x: 0, y: 0 };
        this.selStart = { x: 0, y: 0 };
        this.selection = null; // for rect keep
        this.lassoPath = []; // for lasso keep [{x,y}, ...]
        this.isSelecting = false;
        this.isLassoing = false;
    }

    renderUI() {
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const txt = isTr ? {
            title: 'Gelişmiş Arkaplan Silici',
            upload: 'Görsel Seç veya Sürükle',
            mode: 'Silme Modu',
            magic: 'Sihirli Değnek (Renk)',
            brush: 'Manuel Silgi',
            keep: 'Kare Seçim Koru',
            lasso: 'Serbest Çizim Koru (Lasso)',
            apply: 'Arkaplanı Temizle ✨',
            reset: 'Sıfırla',
            download: 'PNG Olarak İndir 💾',
            keepHint: 'Resim üzerinde korumak istediğiniz alanı fare ile seçin.',
            lassoHint: 'Farenin sol tuşuna basılı tutarak objenin etrafını çizin. Çizim bittiğinde iç kısım korunacak, dış kısım silinecektir.'
        } : {
            title: 'Advanced BG Remover',
            upload: 'Upload or Drag Image',
            mode: 'Removal Mode',
            magic: 'Magic Wand (Color)',
            brush: 'Manual Eraser',
            keep: 'Rect Keep',
            lasso: 'Lasso Keep (Freehand)',
            apply: 'Process Removal ✨',
            reset: 'Reset',
            download: 'Download PNG 💾',
            keepHint: 'Select the area you want to KEEP using the rectangle tool.',
            lassoHint: 'Click and drag to draw a freehand loop around the object you want to keep. Everything outside will be removed.'
        };

        return `
        <div class="tool-content bg-remover-studio" style="max-width: 1400px; margin: 0 auto; padding: 20px;">
            <div class="grid-layout" style="display: grid; grid-template-columns: 340px 1fr; gap: 2.5rem;">
                
                <!-- Sidebar: Controls -->
                <div class="bgr-sidebar">
                    <div id="bgr-drop" class="card" style="padding: 2rem; border: 2px dashed var(--primary); border-radius: 24px; text-align: center; cursor: pointer; transition: 0.3s; background: rgba(99, 102, 241, 0.05); margin-bottom: 2rem;">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">🖼️</div>
                        <h5 style="font-size: 0.9rem;">${txt.upload}</h5>
                        <input type="file" id="bgr-file" hidden accept="image/*">
                    </div>

                    <div class="card" style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 20px;">
                        <h4 style="font-size: 0.8rem; text-transform: uppercase; color: var(--primary); margin-bottom: 1.5rem;">${txt.mode}</h4>
                        
                        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 2rem;">
                            <button id="bgr-mode-magic" class="btn btn-sm btn-primary" style="width: 100%;">${txt.magic}</button>
                            <button id="bgr-mode-brush" class="btn btn-sm btn-outline" style="width: 100%;">${txt.brush}</button>
                            <div style="display:flex; gap:10px;">
                                <button id="bgr-mode-keep" class="btn btn-sm btn-outline" style="flex:1;">🔲 ${txt.keep}</button>
                                <button id="bgr-mode-lasso" class="btn btn-sm btn-outline" style="flex:1;">➰ ${txt.lasso}</button>
                            </div>
                        </div>

                        <div id="bgr-magic-opts">
                            <div class="form-group">
                                <label class="form-label">${isTr ? 'Tolerans' : 'Tolerance'} (<span id="bgr-v-tol">30</span>)</label>
                                <input type="range" id="bgr-in-tol" min="0" max="150" value="30" class="form-range">
                            </div>
                            <div id="bgr-color-box" style="padding: 12px; background: rgba(0,0,0,0.2); border-radius: 12px; display: flex; align-items: center; gap: 10px; margin-top: 10px;">
                                <div id="bgr-c-preview" style="width: 24px; height: 24px; border-radius: 50%; border: 1px solid #fff;"></div>
                                <span style="font-size: 0.75rem; opacity: 0.6;">${isTr ? 'Renk seçmek için görsele tıkla' : 'Click image to pick color'}</span>
                            </div>
                        </div>

                        <div id="bgr-brush-opts" style="display: none;">
                            <div class="form-group">
                                <label class="form-label">${isTr ? 'Silgi Boyutu' : 'Brush Size'} (<span id="bgr-v-size">30</span>px)</label>
                                <input type="range" id="bgr-in-size" min="10" max="200" value="30" class="form-range">
                            </div>
                        </div>

                        <div id="bgr-keep-opts" style="display: none;">
                            <p style="font-size: 0.85rem; color: #666; line-height: 1.4;">${txt.keepHint}</p>
                        </div>
                        
                        <div id="bgr-lasso-opts" style="display: none;">
                            <p style="font-size: 0.85rem; color: #666; line-height: 1.4;">${txt.lassoHint}</p>
                        </div>

                        <button id="bgr-btn-apply" class="btn btn-primary" style="width: 100%; height: 3.5rem; font-weight: 700; margin-top: 2rem;">${txt.apply}</button>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 1rem;">
                            <button id="bgr-btn-undo" class="btn btn-sm btn-outline">↩ Undo</button>
                            <button id="bgr-btn-res" class="btn btn-sm btn-outline">${txt.reset}</button>
                        </div>
                    </div>

                    <button id="bgr-btn-dl" class="btn btn-success" style="width: 100%; margin-top: 1.5rem; display: none;">${txt.download}</button>
                </div>

                <!-- Main Display: Canvas -->
                <div class="bgr-main" style="position: relative;">
                    <div class="card" style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 24px; min-height: 600px; display: flex; align-items: center; justify-content: center; background: linear-gradient(45deg, #e2e8f0 25%, transparent 25%, transparent 75%, #e2e8f0 75%, #e2e8f0), linear-gradient(45deg, #e2e8f0 25%, transparent 25%, transparent 75%, #e2e8f0 75%, #e2e8f0); background-size: 20px 20px; background-position: 0 0, 10px 10px; overflow: hidden;">
                        
                        <div id="bgr-can-wrap" style="position: relative; display: inline-block;">
                            <canvas id="bgr-canvas" style="max-width: 100%; max-height: 700px; cursor: crosshair; display: none; box-shadow: 0 20px 50px rgba(0,0,0,0.4);"></canvas>
                            <!-- Rect Selection Box -->
                            <div id="bgr-sel-box" style="position: absolute; border: 2px dashed #ef4444; background: rgba(239, 68, 68, 0.1); display: none; pointer-events: none; z-index: 10;"></div>
                        </div>

                        <div id="bgr-placeholder" style="text-align: center; opacity: 0.3;">
                            <h3>Upload an image to start removing backgrounds</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    setupListeners() {
        this.canvas = document.getElementById('bgr-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.selBox = document.getElementById('bgr-sel-box');

        const drop = document.getElementById('bgr-drop');
        const file = document.getElementById('bgr-file');
        const tolIn = document.getElementById('bgr-in-tol');
        const tolVal = document.getElementById('bgr-v-tol');
        const sizeIn = document.getElementById('bgr-in-size');
        const sizeVal = document.getElementById('bgr-v-size');

        const btnMagic = document.getElementById('bgr-mode-magic');
        const btnBrush = document.getElementById('bgr-mode-brush');
        const btnKeep = document.getElementById('bgr-mode-keep');
        const btnLasso = document.getElementById('bgr-mode-lasso');

        const btnApply = document.getElementById('bgr-btn-apply');
        const btnRes = document.getElementById('bgr-btn-res');
        const btnUndo = document.getElementById('bgr-btn-undo');
        const btnDl = document.getElementById('bgr-btn-dl');

        drop.onclick = () => file.click();
        file.onchange = (e) => this._handleFile(e.target.files[0]);

        tolIn.oninput = () => tolVal.textContent = tolIn.value;
        sizeIn.oninput = () => sizeVal.textContent = sizeIn.value;

        const setMode = (m) => {
            this.mode = m;
            this.selection = null;
            this.lassoPath = [];
            this.selBox.style.display = 'none';

            // Clean buttons
            [btnMagic, btnBrush, btnKeep, btnLasso].forEach(b => b.classList.replace('btn-primary', 'btn-outline'));

            // Clean panels
            ['bgr-magic-opts', 'bgr-brush-opts', 'bgr-keep-opts', 'bgr-lasso-opts'].forEach(id => document.getElementById(id).style.display = 'none');

            // Activate
            if (m === 'magic') {
                btnMagic.classList.replace('btn-outline', 'btn-primary');
                document.getElementById('bgr-magic-opts').style.display = 'block';
            } else if (m === 'brush') {
                btnBrush.classList.replace('btn-outline', 'btn-primary');
                document.getElementById('bgr-brush-opts').style.display = 'block';
            } else if (m === 'keep') {
                btnKeep.classList.replace('btn-outline', 'btn-primary');
                document.getElementById('bgr-keep-opts').style.display = 'block';
            } else if (m === 'lasso') {
                btnLasso.classList.replace('btn-outline', 'btn-primary');
                document.getElementById('bgr-lasso-opts').style.display = 'block';
            }
        };

        btnMagic.onclick = () => setMode('magic');
        btnBrush.onclick = () => setMode('brush');
        btnKeep.onclick = () => setMode('keep');
        btnLasso.onclick = () => setMode('lasso');

        btnApply.onclick = async () => {
            if (this.mode === 'keep') {
                if (!this.selection) { alert('Please select an area first.'); return; }
                this._saveUndo();
                const temp = document.createElement('canvas');
                temp.width = this.canvas.width;
                temp.height = this.canvas.height;
                const tx = temp.getContext('2d');
                const { x, y, w, h } = this.selection;
                tx.drawImage(this.canvas, x, y, w, h, x, y, w, h);
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.drawImage(temp, 0, 0);
                this.selection = null;
                this.selBox.style.display = 'none';
                btnDl.style.display = 'block';
            }
            else if (this.mode === 'lasso') {
                if (this.lassoPath.length < 3) { alert('Please draw a loop first.'); return; }

                // Restore clean state before cropping (visual line removal)
                if (this.undoStack.length > 0) {
                    const cleanState = this.undoStack.pop();
                    this.ctx.putImageData(cleanState, 0, 0);
                    this._saveUndo(); // Save it as pre-crop state
                }

                // Create mask
                const temp = document.createElement('canvas');
                temp.width = this.canvas.width;
                temp.height = this.canvas.height;
                const tx = temp.getContext('2d');

                tx.beginPath();
                tx.moveTo(this.lassoPath[0].x, this.lassoPath[0].y);
                this.lassoPath.forEach(p => tx.lineTo(p.x, p.y));
                tx.closePath();
                tx.clip();

                // Draw Original Image masked by path
                tx.drawImage(this.canvas, 0, 0);

                // Replace
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.drawImage(temp, 0, 0);

                this.lassoPath = [];
                btnDl.style.display = 'block';
            }
            else if (this.mode === 'magic') {
                if (btnApply.textContent.includes('...')) return;

                if (!this.targetColor) {
                    alert('Please click on the image to pick a color to remove.');
                    return;
                }

                const originalText = btnApply.textContent;
                btnApply.textContent = '⏳ Processing...';
                btnApply.style.opacity = '0.7';

                // Allow UI to update
                setTimeout(() => {
                    this._saveUndo();
                    this._magicErase({
                        tolerance: parseInt(tolIn.value),
                        targetColor: this.targetColor,
                        startX: this.clickPos.x,
                        startY: this.clickPos.y
                    });

                    btnApply.textContent = originalText;
                    btnApply.style.opacity = '1';
                    btnDl.style.display = 'block';
                }, 50);
            }
        };

        btnUndo.onclick = () => {
            if (this.undoStack.length) {
                const prev = this.undoStack.pop();
                this.ctx.putImageData(prev, 0, 0);
            }
        };

        btnRes.onclick = () => {
            if (this.img) {
                this.canvas.width = this.img.width;
                this.canvas.height = this.img.height;
                this.ctx.drawImage(this.img, 0, 0);
                this.selection = null;
                this.lassoPath = [];
                this.selBox.style.display = 'none';
            }
        };

        btnDl.onclick = () => {
            const link = document.createElement('a');
            link.download = 'no-bg.png';
            link.href = this.canvas.toDataURL();
            link.click();
        };

        // Mouse Events
        const getPos = (e) => {
            const r = this.canvas.getBoundingClientRect();
            const sx = this.canvas.width / r.width;
            const sy = this.canvas.height / r.height;
            return {
                x: Math.floor((e.clientX - r.left) * sx), // Canvas Coord
                y: Math.floor((e.clientY - r.top) * sy),  // Canvas Coord
                cx: e.clientX - r.left, // CSS Coord
                cy: e.clientY - r.top
            };
        };

        this.canvas.onmousedown = (e) => {
            const p = getPos(e);
            this.clickPos = { x: p.x, y: p.y };

            if (this.mode === 'keep') {
                this.isSelecting = true;
                this.selStart = { x: p.cx, y: p.cy, cx: p.x, cy: p.y };
                this.selBox.style.display = 'block';
                this.selBox.style.left = p.cx + 'px';
                this.selBox.style.top = p.cy + 'px';
                this.selBox.style.width = '0px';
                this.selBox.style.height = '0px';
                return;
            }
            if (this.mode === 'lasso') {
                this.isLassoing = true;
                this._saveUndo(); // Save CLEAN image
                this.lassoPath = [{ x: p.x, y: p.y }];
                this.ctx.beginPath();
                this.ctx.moveTo(p.x, p.y);
                this.ctx.strokeStyle = '#ef4444';
                this.ctx.lineWidth = 3;
                this.ctx.lineCap = 'round';
                return;
            }

            if (this.mode === 'magic') {
                const px = this.ctx.getImageData(p.x, p.y, 1, 1).data;
                this.targetColor = { r: px[0], g: px[1], b: px[2] };
                document.getElementById('bgr-c-preview').style.backgroundColor = `rgb(${px[0]},${px[1]},${px[2]})`;
            } else if (this.mode === 'brush') {
                this._saveUndo();
                this.isDrawing = true;
                this._erase(p.x, p.y);
            }
        };

        window.addEventListener('mousemove', (e) => {
            if (this.mode === 'keep' && this.isSelecting) {
                const r = this.canvas.getBoundingClientRect();
                const currCx = e.clientX - r.left;
                const currCy = e.clientY - r.top;
                const w = currCx - this.selStart.x;
                const h = currCy - this.selStart.y;
                this.selBox.style.width = Math.abs(w) + 'px';
                this.selBox.style.height = Math.abs(h) + 'px';
                this.selBox.style.left = (w < 0 ? currCx : this.selStart.x) + 'px';
                this.selBox.style.top = (h < 0 ? currCy : this.selStart.y) + 'px';
            }
        });

        this.canvas.onmousemove = (e) => {
            if (this.mode === 'brush' && this.isDrawing) {
                const p = getPos(e);
                this._erase(p.x, p.y);
            }
            if (this.mode === 'lasso' && this.isLassoing) {
                const p = getPos(e);
                this.lassoPath.push({ x: p.x, y: p.y });
                this.ctx.lineTo(p.x, p.y);
                this.ctx.stroke();
            }
        };

        window.addEventListener('mouseup', (e) => {
            if (this.mode === 'keep' && this.isSelecting) {
                this.isSelecting = false;
                const r = this.canvas.getBoundingClientRect();
                const sx = this.canvas.width / r.width;
                const sy = this.canvas.height / r.height;
                const b = this.selBox.getBoundingClientRect();
                this.selection = {
                    x: (b.left - r.left) * sx,
                    y: (b.top - r.top) * sy,
                    w: b.width * sx,
                    h: b.height * sy
                };
            }
            if (this.mode === 'lasso' && this.isLassoing) {
                this.isLassoing = false;
                this.ctx.closePath();
                this.ctx.stroke();
            }
            if (this.mode === 'brush') this.isDrawing = false;
        });
    }

    _handleFile(f) {
        if (!f) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            this.img = new Image();
            this.img.onload = () => {
                this.canvas.width = this.img.width;
                this.canvas.height = this.img.height;
                this.ctx.drawImage(this.img, 0, 0);
                this.canvas.style.display = 'block';
                document.getElementById('bgr-placeholder').style.display = 'none';
                document.getElementById('bgr-btn-dl').style.display = 'block';
                this.undoStack = [];
            };
            this.img.src = e.target.result;
        };
        reader.readAsDataURL(f);
    }

    _saveUndo() {
        this.undoStack.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));
        if (this.undoStack.length > 10) this.undoStack.shift();
    }

    _erase(x, y) {
        const size = parseInt(document.getElementById('bgr-in-size').value);
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.beginPath();
        this.ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }

    // INTERNAL LOGIC: Flood Fill Eraser (Magic Wand)
    _magicErase(options) {
        const { tolerance, targetColor, startX, startY } = options;
        const width = this.canvas.width;
        const height = this.canvas.height;
        const imgData = this.ctx.getImageData(0, 0, width, height);
        const data = imgData.data;

        // Simple Color Distance
        const colorMatch = (idx) => {
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            return Math.abs(r - targetColor.r) <= tolerance &&
                Math.abs(g - targetColor.g) <= tolerance &&
                Math.abs(b - targetColor.b) <= tolerance;
        };

        const stack = [[startX, startY]];
        const seen = new Uint8Array(width * height);

        const getIdx = (x, y) => (y * width + x) * 4;

        // BFS Flood Fill
        while (stack.length) {
            const [cx, cy] = stack.pop();
            const idx = getIdx(cx, cy);
            const seenIdx = cy * width + cx;

            if (cx < 0 || cx >= width || cy < 0 || cy >= height || seen[seenIdx]) continue;

            if (colorMatch(idx)) {
                // Erase pixel (set alpha to 0)
                data[idx + 3] = 0;
                seen[seenIdx] = 1;

                stack.push([cx + 1, cy]);
                stack.push([cx - 1, cy]);
                stack.push([cx, cy + 1]);
                stack.push([cx, cy - 1]);
            }
        }

        this.ctx.putImageData(imgData, 0, 0);
    }
}

window.initBgRemoverLogic = BGRemoverTool;
