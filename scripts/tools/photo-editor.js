/* TULPAR - Photo Editor Tool OOP Implementation */
class PhotoEditorTool extends BaseTool {
    constructor(config) {
        super(config);
        this.originalImage = null;
        this.currentRotation = 0;
        this.flipH = 1;
        this.flipV = 1;
        this.ctx = null;
        this.canvas = null;
        this.originalImage = null;
        this.currentRotation = 0;
        this.flipH = 1;
        this.flipV = 1;
        this.ctx = null;
        this.canvas = null;

        // Text Layer State
        this.textState = {
            text: '',
            x: 0,
            y: 0,
            size: 60,
            color: '#ffffff',
            isDragging: false
        };
    }

    renderUI() {
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const txt = isTr ? {
            title: 'Modern Fotoğraf Editörü',
            upload: 'Fotoğraf Yükle 📸',
            download: 'İndir & Kaydet 💾',
            filters: 'Gelişmiş Filtreler',
            transform: 'Dönüştür',
            presets: 'Hazır Filtreler',
            text: 'Metin Katmanı',
            reset: 'Sıfırla',
            placeholder: 'Düzenlemeye başlamak için bir fotoğraf yükleyin',
            tips: { rotL: 'Sola Döndür', rotR: 'Sağa Döndür', flH: 'Yatay Çevir', flV: 'Dikey Çevir' },
            presetNames: { cin: 'Sinematik 🎬', vin: 'Vintage 🎞️', neon: 'Neon ⚡', bnw: 'Siyah Beyaz 🌑', warm: 'Sıcak ☀️' }
        } : {
            title: 'Advanced Photo Editor',
            upload: 'Upload Photo 📸',
            download: 'Download & Save 💾',
            filters: 'Advanced Filters',
            transform: 'Transform',
            presets: 'Creative Presets',
            text: 'Text Overlay',
            reset: 'Reset All',
            placeholder: 'Upload a photo to start editing',
            tips: { rotL: 'Rotate L', rotR: 'Rotate R', flH: 'Flip H', flV: 'Flip V' },
            presetNames: { cin: 'Cinematic 🎬', vin: 'Vintage 🎞️', neon: 'Neon ⚡', bnw: 'B&W 🌑', warm: 'Warm ☀️' }
        };

        const filterControls = [
            { id: 'bright', name: isTr ? 'Parlaklık' : 'Brightness', min: 0, max: 200, def: 100, unit: '%' },
            { id: 'contrast', name: isTr ? 'Kontrast' : 'Contrast', min: 0, max: 200, def: 100, unit: '%' },
            { id: 'saturate', name: isTr ? 'Doygunluk' : 'Saturation', min: 0, max: 200, def: 100, unit: '%' },
            { id: 'blur', name: isTr ? 'Bulanıklık' : 'Blur', min: 0, max: 15, def: 0, unit: 'px' },
            { id: 'sepia', name: isTr ? 'Sepya' : 'Sepia', min: 0, max: 100, def: 0, unit: '%' },
            { id: 'gray', name: isTr ? 'Siyah Beyaz' : 'Grayscale', min: 0, max: 100, def: 0, unit: '%' }
        ];

        return `
        <div class="tool-content pe-studio" style="max-width: 1250px; margin: 0 auto; padding: 20px;">
            <div class="grid-layout" style="display: grid; grid-template-columns: 320px 1fr; gap: 2.5rem;">
                
                <!-- Filters Sidebar -->
                <div class="pe-sidebar">
                    <div class="card" style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 16px; max-height: 85vh; overflow-y: auto;">
                        <h4 style="margin-bottom: 1.5rem; color: var(--primary); text-transform: uppercase; font-size: 0.8rem; display: flex; justify-content: space-between;">
                            ${txt.filters}
                            <span id="pe-reset" style="cursor: pointer; opacity: 0.5; font-size: 0.7rem; text-decoration: underline;">${txt.reset}</span>
                        </h4>

                        <div id="pe-filters-list">
                            ${filterControls.map(f => `
                                <div class="form-group" style="margin-bottom: 1.25rem;">
                                    <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 6px; opacity: 0.8;">
                                        <span>${f.name}</span>
                                        <span id="pe-val-${f.id}" style="color: var(--primary); font-weight: 700;">${f.def}${f.unit}</span>
                                    </div>
                                    <input type="range" id="pe-in-${f.id}" class="form-range" min="${f.min}" max="${f.max}" value="${f.def}">
                                </div>
                            `).join('')}
                        </div>

                        <hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.5rem 0;">

                        <h4 style="margin-bottom: 1rem; color: var(--primary); text-transform: uppercase; font-size: 0.8rem;">${txt.transform}</h4>
                        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 1.5rem;">
                            <button id="pe-rot-l" class="btn btn-sm btn-outline" title="${txt.tips.rotL}">↩️</button>
                            <button id="pe-rot-r" class="btn btn-sm btn-outline" title="${txt.tips.rotR}">↪️</button>
                            <button id="pe-fl-h" class="btn btn-sm btn-outline" title="${txt.tips.flH}">↔️</button>
                            <button id="pe-fl-v" class="btn btn-sm btn-outline" title="${txt.tips.flV}">↕️</button>
                        </div>

                        <h4 style="margin-bottom: 1rem; color: var(--primary); text-transform: uppercase; font-size: 0.8rem;">${txt.text}</h4>
                        <div class="form-group">
                            <input type="text" id="pe-text-in" class="form-input" style="font-size: 0.85rem;" placeholder="Overlay text...">
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
                            <input type="color" id="pe-text-col" value="#ffffff" style="width:100%; height:32px; border:none; background:none; cursor:pointer;">
                            <input type="number" id="pe-text-sz" class="form-input" value="60" style="height:32px;">
                        </div>
                        
                        <p style="font-size: 0.7rem; opacity: 0.5; margin-top: 5px;">* ${isTr ? 'Metni taşımak için üzerine tıklayıp sürükleyin' : 'Drag text on canvas to move'}</p>

                        <div style="margin-top: 2rem; position: sticky; bottom: 0; background: var(--surface); padding-top: 1rem; border-top: 1px solid var(--border-color);">
                            <button id="pe-btn-dl" class="btn btn-primary" style="width: 100%; height: 3.5rem; font-weight: 700;">${txt.download}</button>
                        </div>
                    </div>
                </div>

                <!-- Editor Canvas Area -->
                <div class="pe-main">
                    <div class="card" style="padding: 1rem; background: #000; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; min-height: 600px; display: flex; align-items: center; justify-content: center; overflow: auto; background-image: radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 24px 24px; position: relative;">
                        <div id="pe-ph" style="text-align: center; padding: 4rem;">
                            <div style="font-size: 4rem; margin-bottom: 1.5rem; opacity: 0.2;">🖼️</div>
                            <p style="opacity: 0.4; margin-bottom: 1.5rem;">${txt.placeholder}</p>
                            <button id="pe-btn-up" class="btn btn-primary">${txt.upload}</button>
                            <input type="file" id="pe-in-up" hidden accept="image/*">
                        </div>
                        <canvas id="pe-canvas" style="max-width: 100%; max-height: 80vh; border-radius: 4px; display: none; box-shadow: 0 30px 60px rgba(0,0,0,0.8);"></canvas>
                    </div>

                    <div class="card" style="margin-top: 1.5rem; padding: 1rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 12px; display: flex; gap: 10px; overflow-x: auto; white-space: nowrap;">
                        <span style="font-size: 0.75rem; color: var(--primary); font-weight: 700; text-transform: uppercase; margin-right: 10px; display: flex; align-items: center;">${txt.presets}:</span>
                        <button class="btn btn-sm btn-outline pe-preset" data-preset="cinematic">${txt.presetNames.cin}</button>
                        <button class="btn btn-sm btn-outline pe-preset" data-preset="vintage">${txt.presetNames.vin}</button>
                        <button class="btn btn-sm btn-outline pe-preset" data-preset="neon">${txt.presetNames.neon}</button>
                        <button class="btn btn-sm btn-outline pe-preset" data-preset="bnw">${txt.presetNames.bnw}</button>
                        <button class="btn btn-sm btn-outline pe-preset" data-preset="warm">${txt.presetNames.warm}</button>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    setupListeners() {
        this.canvas = document.getElementById('pe-canvas');
        this.ctx = this.canvas.getContext('2d');
        const inUp = document.getElementById('pe-in-up');
        const btnUp = document.getElementById('pe-btn-up');
        const btnDl = document.getElementById('pe-btn-dl');
        const ph = document.getElementById('pe-ph');

        btnUp.onclick = () => inUp.click();
        inUp.onchange = (e) => this._handleUpload(e.target.files[0]);

        // Filter events
        ['bright', 'contrast', 'saturate', 'blur', 'sepia', 'gray'].forEach(id => {
            const input = document.getElementById(`pe-in-${id}`);
            input.oninput = () => {
                const unit = id === 'blur' ? 'px' : '%';
                document.getElementById(`pe-val-${id}`).textContent = input.value + unit;
                this._apply();
            };
        });

        document.getElementById('pe-reset').onclick = () => {
            this._resetFilters();
            this._apply();
        };

        // Transform events
        document.getElementById('pe-rot-l').onclick = () => { this.currentRotation -= 90; this._apply(); };
        document.getElementById('pe-rot-r').onclick = () => { this.currentRotation += 90; this._apply(); };
        document.getElementById('pe-fl-h').onclick = () => { this.flipH *= -1; this._apply(); };
        document.getElementById('pe-fl-v').onclick = () => { this.flipV *= -1; this._apply(); };

        // Text events
        const textIn = document.getElementById('pe-text-in');
        const textCol = document.getElementById('pe-text-col');
        const textSz = document.getElementById('pe-text-sz');

        textIn.oninput = (e) => { this.textState.text = e.target.value; this._apply(); };
        textCol.oninput = (e) => { this.textState.color = e.target.value; this._apply(); };
        textSz.oninput = (e) => { this.textState.size = parseInt(e.target.value); this._apply(); };

        // Canvas Mouse Events for Dragging
        const handleStart = (e) => {
            if (!this.textState.text) return;
            const rect = this.canvas.getBoundingClientRect();
            // Scale coords because canvas display size might differ from pixel size
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            const x = ((e.clientX || e.touches[0].clientX) - rect.left) * scaleX;
            const y = ((e.clientY || e.touches[0].clientY) - rect.top) * scaleY;

            // Simple hit test (approximate)
            if (Math.abs(x - this.textState.x) < 200 && Math.abs(y - this.textState.y) < 100) {
                this.textState.isDragging = true;
                this.canvas.style.cursor = 'grabbing';
            }
        };

        const handleMove = (e) => {
            if (!this.textState.isDragging) return;
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            const x = ((e.clientX || e.touches[0].clientX) - rect.left) * scaleX;
            const y = ((e.clientY || e.touches[0].clientY) - rect.top) * scaleY;

            this.textState.x = x;
            this.textState.y = y;
            this._apply();
        };

        const handleEnd = () => {
            this.textState.isDragging = false;
            this.canvas.style.cursor = 'default';
        };

        const handleWheel = (e) => {
            if (!this.textState.text) return;
            e.preventDefault();
            const delta = Math.sign(e.deltaY) * -1;
            let newSize = this.textState.size + (delta * 5);
            if (newSize < 10) newSize = 10;
            if (newSize > 300) newSize = 300;
            this.textState.size = newSize;
            const input = document.getElementById('pe-text-sz');
            if (input) input.value = newSize;
            this._apply();
        };
        this.canvas.addEventListener('wheel', handleWheel, { passive: false });

        this.canvas.onmousedown = handleStart;
        this.canvas.ontouchstart = handleStart;

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('touchmove', handleMove);

        window.addEventListener('mouseup', handleEnd);
        window.addEventListener('touchend', handleEnd);

        // Preset events
        document.querySelectorAll('.pe-preset').forEach(btn => {
            btn.onclick = () => {
                this._resetFilters();
                const p = btn.dataset.preset;
                const set = (id, v) => {
                    const el = document.getElementById(`pe-in-${id}`);
                    el.value = v;
                    const unit = id === 'blur' ? 'px' : '%';
                    document.getElementById(`pe-val-${id}`).textContent = v + unit;
                };

                if (p === 'cinematic') { set('contrast', 130); set('saturate', 80); set('sepia', 20); }
                else if (p === 'vintage') { set('sepia', 60); set('contrast', 80); set('bright', 90); }
                else if (p === 'neon') { set('saturate', 180); set('contrast', 120); set('bright', 110); }
                else if (p === 'bnw') { set('gray', 100); set('contrast', 110); }
                else if (p === 'warm') { set('sepia', 30); set('bright', 105); set('saturate', 120); }

                this._apply();
            };
        });

        btnDl.onclick = () => {
            if (!this.originalImage) return;
            const a = document.createElement('a');
            a.download = `photo_edit_${Date.now()}.png`;
            a.href = this.canvas.toDataURL('image/png');
            a.click();
        };
    }

    _handleUpload(file) {
        if (!file || !file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (re) => {
            const img = new Image();
            img.onload = () => {
                this.originalImage = img;
                this.canvas.width = img.width;
                this.canvas.height = img.height;
                this.canvas.style.display = 'block';
                document.getElementById('pe-ph').style.display = 'none';

                // Init text pos center
                this.textState.x = img.width / 2;
                this.textState.y = img.height / 2;

                this._resetFilters();
                this._apply();
            };
            img.src = re.target.result;
        };
        reader.readAsDataURL(file);
    }

    _apply() {
        if (!this.originalImage) return;

        // Calculate rotation-based dimensions
        const angle = Math.abs(this.currentRotation % 360);
        const isVertical = angle === 90 || angle === 270;

        // Resize canvas to fit the rotated image
        if (isVertical) {
            this.canvas.width = this.originalImage.height;
            this.canvas.height = this.originalImage.width;
        } else {
            this.canvas.width = this.originalImage.width;
            this.canvas.height = this.originalImage.height;
        }

        // Get filter values
        const b = (id) => document.getElementById(`pe-in-${id}`).value;

        this.ctx.save();

        // Apply Filters
        this.ctx.filter = `brightness(${b('bright')}%) contrast(${b('contrast')}%) saturate(${b('saturate')}%) blur(${b('blur')}px) sepia(${b('sepia')}%) grayscale(${b('gray')}%)`;

        // Clear and center
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.rotate((this.currentRotation * Math.PI) / 180);
        this.ctx.scale(this.flipH, this.flipV);

        // Fix blur edge bleeding: Scale up slightly based on blur amount
        const blurAmount = parseInt(b('blur'));
        if (blurAmount > 0) {
            const scaleFactor = 1 + (blurAmount * 0.02); // 10px blur -> 1.2x scale
            this.ctx.scale(scaleFactor, scaleFactor);
        }

        // Draw image centered (Always use original dimensions for offset)
        this.ctx.drawImage(this.originalImage, -this.originalImage.width / 2, -this.originalImage.height / 2);

        this.ctx.restore();

        // Layer Text
        if (this.textState.text) {
            this.ctx.save(); // Save state for text
            this.ctx.filter = 'none';
            this.ctx.font = `bold ${this.textState.size}px Inter, Arial`;
            this.ctx.fillStyle = this.textState.color;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.shadowColor = 'rgba(0,0,0,0.5)';
            this.ctx.shadowBlur = 10;

            // Text position is relative to canvas (0,0 is top-left)
            // No rotation applied to text layer itself in this simple implementation
            // But if users want text to rotate WITH image, it needs complex matrix math.
            // For now, we keep text on top of the final canvas view.

            this.ctx.fillText(this.textState.text, this.textState.x, this.textState.y);

            // Draw border if dragging
            if (this.textState.isDragging) {
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                this.ctx.lineWidth = 2;
                this.ctx.strokeText(this.textState.text, this.textState.x, this.textState.y);
            }
            this.ctx.restore();
        }
    }

    _resetFilters() {
        ['bright', 'contrast', 'saturate'].forEach(id => {
            document.getElementById(`pe-in-${id}`).value = 100;
            document.getElementById(`pe-val-${id}`).textContent = '100%';
        });
        ['blur', 'sepia', 'gray'].forEach(id => {
            document.getElementById(`pe-in-${id}`).value = 0;
            const unit = id === 'blur' ? 'px' : '%';
            document.getElementById(`pe-val-${id}`).textContent = '0' + unit;
        });
    }
}

// Register tool
window.initPhotoEditorLogic = PhotoEditorTool;
