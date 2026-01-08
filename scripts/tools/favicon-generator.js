/* TULPAR - Favicon Generator Tool OOP Implementation */
class FaviconGeneratorTool extends BaseTool {
    constructor(config) {
        super(config);
        this.currentMethod = 'image';
        this.results = {};
        this.selectedFile = null;
    }

    renderUI() {
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const txt = isTr ? {
            title: 'Favicon Oluşturucu',
            methods: { image: '🖼️ Görselden', emoji: '😀 Emojiden' },
            drop: 'Görseli bırakın veya seçin',
            emojiPlace: 'Emoji girin...',
            bg: 'Arkaplan Rengi',
            generate: 'Favicon Paketi Oluştur ✨',
            downloadAll: 'Hepsini İndir (ZIP) 📦',
            preview: 'Önizleme',
            placeholder: 'Oluşturulan simgeler burada görünecek',
            generating: '⏳ Oluşturuluyor...',
            errorNoImg: 'Önce bir görsel seçin',
            errorLib: 'JSZip kütüphanesi yüklenemedi. Lütfen bekleyin...',
            success: 'Favicon paketi hazır!'
        } : {
            title: 'Favicon Generator',
            methods: { image: '🖼️ From Image', emoji: '😀 From Emoji' },
            drop: 'Drop image or click here',
            emojiPlace: 'Enter emoji...',
            bg: 'Background Color',
            generate: 'Generate Favicon Pack ✨',
            downloadAll: 'Download All (ZIP) 📦',
            preview: 'Preview',
            placeholder: 'Generated icons will appear here',
            generating: '⏳ Generating...',
            errorNoImg: 'Select an image first',
            errorLib: 'JSZip not loaded. Please wait...',
            success: 'Favicon pack ready!'
        };

        return `
        <div class="tool-content favicon-studio" style="max-width: 1100px; margin: 0 auto; padding: 20px;">
            <div class="grid-layout" style="display: grid; grid-template-columns: 350px 1fr; gap: 2.5rem;">
                
                <!-- Settings Panel -->
                <div class="fav-settings">
                    <div class="card" style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 16px;">
                        <h4 style="margin-bottom: 1.5rem; color: var(--primary);">${txt.title}</h4>
                        
                        <div class="btn-group" style="margin-bottom: 1.5rem;">
                            <button id="fav-method-img" class="btn btn-primary btn-sm" style="flex:1;">${txt.methods.image}</button>
                            <button id="fav-method-emo" class="btn btn-outline btn-sm" style="flex:1;">${txt.methods.emoji}</button>
                        </div>

                        <div id="fav-panel-img">
                            <div id="fav-drop" class="dropzone" style="height: 150px; border: 2px dashed var(--border-color); border-radius: 12px; display: flex; flex-direction: column; justify-content: center; align-items: center; cursor: pointer; background: rgba(0,0,0,0.1);">
                                <span id="fav-drop-text" style="font-size: 0.85rem; opacity: 0.6; text-align: center; padding: 10px;">${txt.drop}</span>
                                <input type="file" id="fav-in-file" hidden accept="image/*">
                            </div>
                        </div>

                        <div id="fav-panel-emo" style="display: none;">
                            <input type="text" id="fav-in-emo" class="form-input" style="font-size: 2.5rem; text-align: center; height: 100px;" placeholder="🚀" maxlength="2">
                            <div id="fav-emo-list" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 5px; margin-top: 15px; height: 150px; overflow-y: auto; padding: 5px; border: 1px solid var(--border-color); border-radius: 8px;"></div>
                        </div>

                        <div class="form-group" style="margin-top: 1.5rem;">
                            <label class="form-label">${txt.bg}</label>
                            <div style="display: flex; gap: 8px;">
                                <input type="color" id="fav-bg-color" value="#ffffff" style="width: 50px; height: 40px; border: none; padding: 0; background: none; cursor: pointer;">
                                <input type="text" id="fav-bg-hex" class="form-input" value="#FFFFFF" style="text-align: center; font-family: var(--font-mono);">
                            </div>
                        </div>

                        <button id="fav-btn-gen" class="btn btn-primary" style="width: 100%; height: 3.5rem; font-weight: 700; margin-top: 1.5rem;">${txt.generate}</button>
                    </div>
                </div>

                <!-- Preview Grid -->
                <div class="fav-preview">
                    <div class="card" style="padding: 1.5rem; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 16px; min-height: 500px; display: flex; flex-direction: column;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                            <h4 style="margin: 0; font-size: 0.85rem; text-transform: uppercase; color: var(--text-secondary);">${txt.preview}</h4>
                            <button id="fav-btn-zip" class="btn btn-sm btn-success" style="display: none;">${txt.downloadAll}</button>
                        </div>
                        <div id="fav-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 1rem;">
                            <div style="grid-column: 1/-1; padding: 5rem; text-align: center; opacity: 0.2; font-size: 0.9rem;">
                                ${txt.placeholder}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    setupListeners() {
        const methodImg = document.getElementById('fav-method-img');
        const methodEmo = document.getElementById('fav-method-emo');
        const panelImg = document.getElementById('fav-panel-img');
        const panelEmo = document.getElementById('fav-panel-emo');

        const drop = document.getElementById('fav-drop');
        const inFile = document.getElementById('fav-in-file');
        const inEmo = document.getElementById('fav-in-emo');
        const emoGrid = document.getElementById('fav-emo-list');

        const bgColor = document.getElementById('fav-bg-color');
        const bgHex = document.getElementById('fav-bg-hex');
        const btnGen = document.getElementById('fav-btn-gen');
        const btnZip = document.getElementById('fav-btn-zip');
        const grid = document.getElementById('fav-grid');

        // Helper for localization
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const txtGen = isTr ? '⏳ Oluşturuluyor...' : '⏳ Generating...';
        const txtErrImg = isTr ? 'Önce bir görsel seçin' : 'Select an image first';
        const txtErrLib = isTr ? 'JSZip kütüphanesi yüklenemedi. Lütfen bekleyin...' : 'JSZip not loaded. Please wait...';
        const txtBtnOriginal = isTr ? 'Favicon Paketi Oluştur ✨' : 'Generate Favicon Pack ✨';

        // Method Switch
        methodImg.onclick = () => {
            this.currentMethod = 'image';
            panelImg.style.display = 'block';
            panelEmo.style.display = 'none';
            methodImg.classList.replace('btn-outline', 'btn-primary');
            methodEmo.classList.replace('btn-primary', 'btn-outline');
        };
        methodEmo.onclick = () => {
            this.currentMethod = 'emoji';
            panelImg.style.display = 'none';
            panelEmo.style.display = 'block';
            methodEmo.classList.replace('btn-outline', 'btn-primary');
            methodImg.classList.replace('btn-primary', 'btn-outline');

            if (emoGrid.innerHTML === '') {
                const emojis = ['🚀', '🛠️', '⚙️', '💎', '🔥', '✨', '📦', '💻', '📱', '🎨', '⚡', '🌈', '🌍', '❤️', '✅', '❌', '🍕', '☕', '🧠', '💼'];
                emojis.forEach(e => {
                    const b = document.createElement('button');
                    b.className = 'btn btn-sm btn-outline';
                    b.style.fontSize = '1.2rem';
                    b.textContent = e;
                    b.onclick = () => inEmo.value = e;
                    emoGrid.appendChild(b);
                });
            }
        };

        drop.onclick = () => inFile.click();
        inFile.onchange = (e) => {
            this.selectedFile = e.target.files[0];
            if (this.selectedFile) document.getElementById('fav-drop-text').textContent = `📄 ${this.selectedFile.name}`;
        };

        bgColor.oninput = () => bgHex.value = bgColor.value.toUpperCase();
        bgHex.oninput = () => { if (/^#[0-9A-F]{6}$/i.test(bgHex.value)) bgColor.value = bgHex.value; };

        btnGen.onclick = async () => {
            btnGen.disabled = true;
            btnGen.textContent = txtGen;
            try {
                if (this.currentMethod === 'image') {
                    if (!this.selectedFile) throw new Error(txtErrImg);
                    this.results = await this.generateFromImage(this.selectedFile, bgColor.value);
                } else {
                    const emo = inEmo.value || '🚀';
                    this.results = await this.generateFromEmoji(emo, bgColor.value);
                }
                this._renderGrid();
                btnZip.style.display = 'block';
            } catch (err) { this.showNotification(err.message, 'error'); }
            finally { btnGen.disabled = false; btnGen.textContent = txtBtnOriginal; }
        };

        btnZip.onclick = async () => {
            if (typeof JSZip === 'undefined') {
                this.showNotification(txtErrLib, 'warning');
                return;
            }
            btnZip.disabled = true;
            try {
                const zip = new JSZip();
                Object.entries(this.results).forEach(([size, url]) => {
                    const data = url.split(',')[1];
                    zip.file(`favicon-${size}x${size}.png`, data, { base64: true });
                });
                const blob = await zip.generateAsync({ type: 'blob' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = 'favicons.zip'; a.click();
            } catch (err) { this.showNotification(err.message, 'error'); }
            finally { btnZip.disabled = false; }
        };
    }

    _renderGrid() {
        const grid = document.getElementById('fav-grid');
        grid.innerHTML = Object.entries(this.results).map(([size, url]) => `
            <div class="card" style="text-align: center; padding: 1rem; background: rgba(0,0,0,0.2);">
                <div style="background: white; padding: 5px; display: inline-block; border-radius: 4px; margin-bottom: 8px;">
                    <img src="${url}" style="width: 48px; height: 48px; display: block; image-rendering: pixelated;">
                </div>
                <div style="font-size: 0.75rem; opacity: 0.6; margin-bottom: 8px;">${size}x${size}</div>
                <button class="btn btn-sm btn-outline" onclick="window.activeToolInstance.downloadSingleFav('${size}', '${url}')" style="width: 100%; font-size: 0.7rem;">PNG</button>
            </div>
        `).join('');
    }

    downloadSingleFav(s, u) {
        const a = document.createElement('a'); a.download = `favicon-${s}.png`; a.href = u; a.click();
    }

    // INTERNAL LOGIC (Formerly in DevTools.faviconGenerator)

    generateFromImage(file, bgColor) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const sizes = [16, 32, 48, 64, 128, 192, 512];
                    const results = {};

                    sizes.forEach(size => {
                        const canvas = document.createElement('canvas');
                        canvas.width = size;
                        canvas.height = size;
                        const ctx = canvas.getContext('2d');

                        // Fill background if needed (for transparency handling if desired, or forcing bg)
                        // Assuming simple draw for now, bgColor logic can be complex for image respecting alpha
                        // If user wants specific BG, we fill it.
                        if (bgColor && bgColor !== '#FFFFFF' && bgColor !== '#ffffff') {
                            ctx.fillStyle = bgColor;
                            ctx.fillRect(0, 0, size, size);
                        }

                        ctx.drawImage(img, 0, 0, size, size);
                        results[size] = canvas.toDataURL('image/png');
                    });
                    resolve(results);
                };
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    generateFromEmoji(emoji, bgColor) {
        return new Promise((resolve) => {
            const sizes = [16, 32, 48, 64, 128, 192, 512];
            const results = {};

            sizes.forEach(size => {
                const canvas = document.createElement('canvas');
                canvas.width = size;
                canvas.height = size;
                const ctx = canvas.getContext('2d');

                // Background
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, size, size);

                // Emoji
                ctx.font = `${size * 0.8}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(emoji, size / 2, size / 2 + size * 0.05); // slight offset for vertical centering

                results[size] = canvas.toDataURL('image/png');
            });
            resolve(results);
        });
    }
}

// Register tool
window.initFaviconGeneratorLogic = FaviconGeneratorTool;
