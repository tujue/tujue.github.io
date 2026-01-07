/* TULPAR - Social Image Studio OOP Implementation */
class SocialImageStudioTool extends BaseTool {
    constructor(config) {
        super(config);
        this.cropper = null;
        this.currentRatio = NaN;
    }

    renderUI() {
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const txt = isTr ? {
            title: 'Sosyal Medya Görsel Aracı',
            drop: 'Görseli bırakın veya seçmek için tıklayın',
            rotate: 'Döndür 🔄',
            download: 'Kırp ve İndir 💾',
            presets: 'Hazır Boyutlar',
            format: 'Dosya Formatı',
            quality: 'Görsel Kalitesi',
            formats: { png: 'PNG (Kayıpsız)', jpeg: 'JPEG (Sıkıştırılmış)', webp: 'WEBP (Modern)' },
            ratioNames: { post: '1:1 Gönderi', portrait: '4:5 Portre', story: '9:16 Hikaye', land: '16:9 Yatay', link: '1.91:1 Bağlantı', free: 'Serbest' }
        } : {
            title: 'Social Image Designer',
            drop: 'Drop image or click to upload',
            rotate: 'Rotate 90° 🔄',
            download: 'Crop & Download 💾',
            presets: 'Ratio Presets',
            format: 'Export Format',
            quality: 'Visual Quality',
            formats: { png: 'PNG (Lossless)', jpeg: 'JPEG (Compressed)', webp: 'WEBP (Modern)' },
            ratioNames: { post: '1:1 Post', portrait: '4:5 Portrait', story: '9:16 Story', land: '16:9 Landscape', link: '1.91:1 Link', free: 'Free' }
        };

        const presets = [
            { name: txt.ratioNames.post, ratio: 1 },
            { name: txt.ratioNames.portrait, ratio: 4 / 5 },
            { name: txt.ratioNames.story, ratio: 9 / 16 },
            { name: txt.ratioNames.land, ratio: 16 / 9 },
            { name: txt.ratioNames.link, ratio: 1.91 },
            { name: txt.ratioNames.free, ratio: NaN }
        ];

        return `
        <div class="tool-content sis-studio" style="max-width: 1200px; margin: 0 auto; padding: 20px;">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.1/cropper.min.css">
            <div class="grid-layout" style="display: grid; grid-template-columns: 1fr 320px; gap: 2.5rem;">
                
                <!-- Main Editor -->
                <div class="sis-main">
                    <div class="card" style="padding: 1rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 16px; min-height: 550px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; background-image: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px); background-size: 20px 20px;">
                        <div id="sis-dropzone" class="dropzone" style="height: 100%; width: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; cursor: pointer; transition: 0.3s;">
                            <div style="font-size: 4rem; margin-bottom: 20px; opacity: 0.3;">📸</div>
                            <h3 style="opacity: 0.5;">${txt.drop}</h3>
                            <input type="file" id="sis-in-file" hidden accept="image/*">
                        </div>
                        <div id="sis-crop-cont" style="display: none; width: 100%; height: 100%;">
                            <img id="sis-img-out" style="max-width: 100%; max-height: 550px; display: block;">
                        </div>
                    </div>
                </div>

                <!-- Controls Sidebar -->
                <div class="sis-sidebar">
                    <div class="card" style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 16px;">
                        <h4 style="margin-bottom: 1.5rem; color: var(--primary); text-transform: uppercase; font-size: 0.85rem;">${txt.presets}</h4>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 2rem;">
                            ${presets.map(p => `
                                <button class="btn btn-sm btn-outline sis-ratio-btn" data-ratio="${p.ratio}" style="font-size: 0.75rem;">${p.name}</button>
                            `).join('')}
                        </div>

                        <div class="form-group">
                            <label class="form-label">${txt.format}</label>
                            <select id="sis-in-format" class="form-select">
                                <option value="image/png">${txt.formats.png}</option>
                                <option value="image/jpeg">${txt.formats.jpeg}</option>
                                <option value="image/webp">${txt.formats.webp}</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label class="form-label">${txt.quality} (<span id="sis-val-qual">95</span>%)</label>
                            <input type="range" id="sis-in-qual" class="form-range" min="0.1" max="1.0" step="0.05" value="0.95">
                        </div>

                        <button id="sis-btn-rotate" class="btn btn-secondary" style="width: 100%; margin-top: 1rem;">${txt.rotate}</button>
                        <button id="sis-btn-dl" class="btn btn-primary" style="width: 100%; height: 3.5rem; font-weight: 700; margin-top: 1rem;" disabled>${txt.download}</button>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    setupListeners() {
        const drop = document.getElementById('sis-dropzone');
        const inFile = document.getElementById('sis-in-file');
        const imgOut = document.getElementById('sis-img-out');
        const cropCont = document.getElementById('sis-crop-cont');
        const btnDl = document.getElementById('sis-btn-dl');
        const btnRot = document.getElementById('sis-btn-rotate');

        drop.onclick = () => inFile.click();

        inFile.onchange = (e) => {
            const file = e.target.files[0];
            if (file) this._handleImage(file);
        };

        document.querySelectorAll('.sis-ratio-btn').forEach(btn => {
            btn.onclick = () => {
                const ratio = parseFloat(btn.dataset.ratio);
                this.currentRatio = ratio;
                document.querySelectorAll('.sis-ratio-btn').forEach(b => b.classList.replace('btn-primary', 'btn-outline'));
                btn.classList.replace('btn-outline', 'btn-primary');
                if (this.cropper) this.cropper.setAspectRatio(ratio);
            };
        });

        btnRot.onclick = () => { if (this.cropper) this.cropper.rotate(90); };

        btnDl.onclick = () => {
            if (!this.cropper) return;
            const format = document.getElementById('sis-in-format').value;
            const qual = parseFloat(document.getElementById('sis-in-qual').value);

            const canvas = this.cropper.getCroppedCanvas({
                imageSmoothingQuality: 'high',
                fillColor: format === 'image/jpeg' ? '#fff' : 'transparent'
            });

            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.download = `social_export_${Date.now()}.${format.split('/')[1]}`;
                a.href = url;
                a.click();
            }, format, qual);
        };

        document.getElementById('sis-in-qual').oninput = (e) => {
            document.getElementById('sis-val-qual').textContent = Math.round(e.target.value * 100);
        };
    }

    _handleImage(file) {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (re) => {
            const imgOut = document.getElementById('sis-img-out');
            imgOut.src = re.target.result;

            document.getElementById('sis-dropzone').style.display = 'none';
            document.getElementById('sis-crop-cont').style.display = 'block';
            document.getElementById('sis-btn-dl').disabled = false;

            if (this.cropper) this.cropper.destroy();

            this.cropper = new Cropper(imgOut, {
                aspectRatio: this.currentRatio,
                viewMode: 1,
                dragMode: 'move',
                autoCropArea: 0.9,
                background: false
            });
        };
        reader.readAsDataURL(file);
    }
}

// Register tool
window.initImageToolsLogic = SocialImageStudioTool;
