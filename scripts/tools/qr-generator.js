/* TULPAR - QR Generator Tool OOP Implementation */
class QRGeneratorTool extends BaseTool {
    constructor(config) {
        super(config);
        this.selectedLogo = null;
    }

    renderUI() {
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const txt = isTr ? {
            config: 'Yapılandırma',
            type: 'İçerik Türü',
            text: 'Metin veya URL',
            wifi: 'WiFi Ağı',
            vcard: 'Kişi Kartı (vCard)',
            design: 'Tasarım',
            fg: 'Ön Plan',
            bg: 'Arka Plan',
            logoTitle: 'Logo Ekle',
            logoHint: 'Logoyu buraya sürükleyin',
            logoLoaded: 'Logo Yüklendi',
            generate: 'QR Kod Oluştur',
            generating: '⏳ Oluşturuluyor...',
            preview: 'QR Kod Önizleme',
            download: 'Görseli İndir (PNG)',
            placeholder: 'Önizleme burada görünecek...',
            v_first: 'Ad', v_last: 'Soyad', v_phone: 'Telefon', v_email: 'E-posta',
            wifiProps: { ssid: 'SSID', pass: 'Şifre', type: 'Tür', hidden: 'Gizli Ağ', none: 'Yok' },
            libLoading: '⚠️ QR kütüphanesi yükleniyor...',
            success: 'QR Kod oluşturuldu!',
            errorSSID: 'SSID gerekli'
        } : {
            config: 'Configuration',
            type: 'Content Type',
            text: 'Text or URL',
            wifi: 'WiFi Network',
            vcard: 'Contact (vCard)',
            design: 'Design & Style',
            fg: 'Foreground',
            bg: 'Background',
            logoTitle: 'Add Logo',
            logoHint: 'Drag logo here or click',
            logoLoaded: 'Logo Loaded',
            generate: 'Generate QR Code',
            generating: '⏳ Generating...',
            preview: 'QR Code Preview',
            download: 'Download QR (PNG)',
            placeholder: 'Preview will appear here...',
            v_first: 'First Name', v_last: 'Last Name', v_phone: 'Phone', v_email: 'Email',
            wifiProps: { ssid: 'SSID', pass: 'Password', type: 'Type', hidden: 'Hidden Network', none: 'None' },
            libLoading: '⚠️ QR library loading...',
            success: 'QR Code generated!',
            errorSSID: 'SSID required'
        };

        return `
        <div class="tool-content" style="max-width: 1000px; margin: 0 auto; padding: 20px;">
            <div class="grid-layout" style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 2.5rem;">
                <!-- Configuration Sidebar -->
                <div class="config-region">
                    <div class="card" style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 12px; margin-bottom: 1.5rem;">
                        <h4 style="margin-bottom: 1.2rem; color: var(--primary); display: flex; align-items: center; gap: 8px;">⚙️ ${txt.config}</h4>
                        
                        <div class="form-group">
                            <label class="form-label">${txt.type}</label>
                            <select id="qr-type" class="form-select">
                                <option value="text">${txt.text}</option>
                                <option value="wifi">${txt.wifi}</option>
                                <option value="vcard">${txt.vcard}</option>
                            </select>
                        </div>

                        <!-- Dynamic Options -->
                        <div id="qr-text-options" class="qr-sub-options">
                            <div class="form-group">
                                <textarea id="qr-text" class="form-input" style="height: 120px;" placeholder="https://example.com"></textarea>
                            </div>
                        </div>

                        <div id="qr-wifi-options" class="qr-sub-options" style="display: none;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                                <div class="form-group"><label class="form-label">${txt.wifiProps.ssid}</label><input type="text" id="qr-wifi-ssid" class="form-input"></div>
                                <div class="form-group"><label class="form-label">${txt.wifiProps.type}</label><select id="qr-wifi-type" class="form-select"><option value="WPA">WPA/WPA2</option><option value="WEP">WEP</option><option value="nopass">${txt.wifiProps.none}</option></select></div>
                            </div>
                            <div class="form-group"><label class="form-label">${txt.wifiProps.pass}</label><input type="password" id="qr-wifi-pass" class="form-input"></div>
                            <label style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem;"><input type="checkbox" id="qr-wifi-hidden"> ${txt.wifiProps.hidden}</label>
                        </div>

                        <div id="qr-vcard-options" class="qr-sub-options" style="display: none; grid-template-columns: 1fr 1fr; gap: 10px;">
                            <div class="form-group"><label class="form-label">${txt.v_first}</label><input type="text" id="qr-vcard-first" class="form-input"></div>
                            <div class="form-group"><label class="form-label">${txt.v_last}</label><input type="text" id="qr-vcard-last" class="form-input"></div>
                            <div class="form-group" style="grid-column: span 2;"><label class="form-label">${txt.v_phone}</label><input type="text" id="qr-vcard-phone" class="form-input"></div>
                            <div class="form-group" style="grid-column: span 2;"><label class="form-label">${txt.v_email}</label><input type="text" id="qr-vcard-email" class="form-input"></div>
                        </div>
                    </div>

                    <div class="card" style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 12px;">
                        <h4 style="margin-bottom: 1.2rem; color: var(--secondary); display: flex; align-items: center; gap: 8px;">🎨 ${txt.design}</h4>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
                            <div class="form-group">
                                <label class="form-label">${txt.fg}</label>
                                <input type="color" id="qr-fg" value="#000000" style="width: 100%; height: 40px; cursor: pointer; border: none; background: transparent;">
                            </div>
                            <div class="form-group">
                                <label class="form-label">${txt.bg}</label>
                                <input type="color" id="qr-bg" value="#ffffff" style="width: 100%; height: 40px; cursor: pointer; border: none; background: transparent;">
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">${txt.logoTitle}</label>
                            <div id="qr-logo-drop" style="border: 2px dashed var(--border-color); padding: 1.5rem; text-align: center; border-radius: 8px; cursor: pointer; transition: 0.3s; background: rgba(0,0,0,0.1);">
                                <div style="font-size: 2rem; margin-bottom: 8px;">🖼️</div>
                                <div style="font-size: 0.8rem; opacity: 0.6;">${txt.logoHint}</div>
                                <input type="file" id="qr-logo-input" style="display: none;" accept="image/*">
                            </div>
                            <div id="qr-logo-preview" style="display: none; align-items: center; gap: 12px; margin-top: 10px; padding: 10px; background: var(--bg-primary); border-radius: 8px;">
                                <img src="" style="width: 40px; height: 40px; object-fit: contain; border-radius: 4px; background: white;">
                                <span style="font-size: 0.85rem; flex: 1;">${txt.logoLoaded}</span>
                                <button id="qr-logo-clear" class="btn btn-sm btn-outline" style="border-radius: 50%; width: 24px; height: 24px; padding: 0;">✕</button>
                            </div>
                        </div>

                        <button id="qr-generate-btn" class="btn btn-primary" style="width: 100%; margin-top: 1.5rem; font-weight: 600; font-size: 1.1rem; height: 3.5rem;">✨ ${txt.generate}</button>
                    </div>
                </div>

                <!-- Preview Region -->
                <div class="preview-region" style="display: flex; flex-direction: column; align-items: center;">
                    <h4 style="align-self: flex-start; margin-bottom: 1.2rem; opacity: 0.6; font-size: 0.85rem; text-transform: uppercase;">${txt.preview}</h4>
                    <div id="qr-result-container" style="background: white; padding: 2rem; border-radius: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.3); border: 8px solid #eee; display: flex; align-items: center; justify-content: center; min-width: 320px; min-height: 320px; position: relative; transition: 0.3s;">
                        <div id="qr-placeholder" style="color: #999; font-size: 0.9rem;">${txt.placeholder}</div>
                        <img id="qr-image" style="display: none; max-width: 100%; height: auto;">
                    </div>
                    
                    <a id="qr-download" href="#" download="tulpar-qr.png" class="btn btn-secondary" style="display: none; margin-top: 2rem; width: 100%; align-items: center; justify-content: center; gap: 10px;">
                        💾 ${txt.download}
                    </a>
                </div>
            </div>
        </div>
        `;
    }

    setupListeners() {
        const qrType = document.getElementById('qr-type');
        const textOptions = document.getElementById('qr-text-options');
        const wifiOptions = document.getElementById('qr-wifi-options');
        const vcardOptions = document.getElementById('qr-vcard-options');
        const fgInput = document.getElementById('qr-fg');
        const bgInput = document.getElementById('qr-bg');
        const logoDrop = document.getElementById('qr-logo-drop');
        const logoInput = document.getElementById('qr-logo-input');
        const logoPreview = document.getElementById('qr-logo-preview');
        const logoClear = document.getElementById('qr-logo-clear');
        const qrImage = document.getElementById('qr-image');
        const qrPlaceholder = document.getElementById('qr-placeholder');
        const qrDownload = document.getElementById('qr-download');
        const generateBtn = document.getElementById('qr-generate-btn');

        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const txtGenerating = isTr ? '⏳ Oluşturuluyor...' : '⏳ Generating...';
        const txtLibLoading = isTr ? '⚠️ QR kütüphanesi yükleniyor...' : '⚠️ QR library loading...';
        const txtSuccess = isTr ? 'QR Kod oluşturuldu!' : 'QR Code generated!';
        const txtErrorSSID = isTr ? 'SSID gerekli' : 'SSID required';

        qrType.onchange = () => {
            [textOptions, wifiOptions, vcardOptions].forEach(opt => opt.style.display = 'none');
            if (qrType.value === 'text') textOptions.style.display = 'block';
            else if (qrType.value === 'wifi') wifiOptions.style.display = 'block';
            else if (qrType.value === 'vcard') vcardOptions.style.display = 'grid';
        };

        const handleLogo = (file) => {
            this.selectedLogo = file;
            const reader = new FileReader();
            reader.onload = (e) => {
                logoPreview.style.display = 'flex';
                logoPreview.querySelector('img').src = e.target.result;
                logoDrop.style.display = 'none';
            };
            reader.readAsDataURL(file);
        };

        logoDrop.onclick = () => logoInput.click();
        logoInput.onchange = (e) => e.target.files[0] && handleLogo(e.target.files[0]);

        logoDrop.ondragover = (e) => { e.preventDefault(); logoDrop.style.borderColor = 'var(--primary)'; };
        logoDrop.ondragleave = () => logoDrop.style.borderColor = 'var(--border-color)';
        logoDrop.ondrop = (e) => {
            e.preventDefault();
            logoDrop.style.borderColor = 'var(--border-color)';
            if (e.dataTransfer.files[0]) handleLogo(e.dataTransfer.files[0]);
        };

        logoClear.onclick = (e) => {
            e.stopPropagation();
            this.selectedLogo = null;
            logoInput.value = '';
            logoPreview.style.display = 'none';
            logoDrop.style.display = 'block';
        };

        const generateQR = async () => {
            if (typeof window.QRious === 'undefined') {
                qrPlaceholder.textContent = txtLibLoading;
                qrPlaceholder.style.color = '#f59e0b';
                return;
            }

            const type = qrType.value;
            const options = {
                size: 1000,
                foreground: fgInput.value,
                background: bgInput.value,
                logo: this.selectedLogo
            };

            generateBtn.disabled = true;
            const originalText = generateBtn.innerHTML;
            generateBtn.innerHTML = txtGenerating;

            try {
                let result;
                if (type === 'text') {
                    const txt = document.getElementById('qr-text').value.trim();
                    if (!txt) {
                        qrPlaceholder.style.display = 'block';
                        qrImage.style.display = 'none';
                        qrDownload.style.display = 'none';
                        return;
                    }
                    result = await this.generate(txt, options);
                } else if (type === 'wifi') {
                    const ssid = document.getElementById('qr-wifi-ssid').value;
                    if (!ssid) throw new Error(txtErrorSSID);
                    result = await this.generateWiFi(
                        ssid,
                        document.getElementById('qr-wifi-pass').value,
                        document.getElementById('qr-wifi-type').value,
                        document.getElementById('qr-wifi-hidden').checked,
                        options
                    );
                } else if (type === 'vcard') {
                    result = await this.generateVCard({
                        firstName: document.getElementById('qr-vcard-first').value,
                        lastName: document.getElementById('qr-vcard-last').value,
                        phone: document.getElementById('qr-vcard-phone').value,
                        email: document.getElementById('qr-vcard-email').value
                    }, options);
                }

                if (result?.success) {
                    qrImage.src = result.url;
                    qrImage.style.display = 'block';
                    qrPlaceholder.style.display = 'none';
                    qrDownload.href = result.url;
                    qrDownload.style.display = 'flex';
                    this.showNotification(txtSuccess, 'success');
                }
            } catch (e) {
                this.showNotification(e.message, 'error');
                qrPlaceholder.style.display = 'block';
                qrImage.style.display = 'none';
                qrDownload.style.display = 'none';
            } finally {
                generateBtn.disabled = false;
                generateBtn.innerHTML = originalText;
            }
        };

        qrPlaceholder.setAttribute('data-original-text', qrPlaceholder.textContent);
        generateBtn.onclick = generateQR;
    }

    // INTERNAL LOGIC (Formerly in DevTools)

    async generate(text, options = {}) {
        return new Promise((resolve) => {
            const qr = new window.QRious({
                value: text,
                size: options.size || 500,
                level: 'H', // High error correction
                foreground: options.foreground || '#000000',
                background: options.background || '#ffffff'
            });

            const qrDataUrl = qr.toDataURL();

            // If no logo, return early
            if (!options.logo) {
                resolve({ success: true, url: qrDataUrl });
                return;
            }

            // Combine Logo
            this._addLogoToQR(qrDataUrl, options.logo, resolve);
        });
    }

    async generateWiFi(ssid, password, type, hidden, options) {
        // WIFI:T:WPA;S:mynetwork;P:mypass;;
        let wifiStr = `WIFI:S:${ssid};`;
        if (type !== 'nopass') {
            wifiStr += `T:${type};P:${password};`;
        } else {
            wifiStr += `T:nopass;`;
        }
        if (hidden) wifiStr += `H:true;`;
        wifiStr += `;`;

        return this.generate(wifiStr, options);
    }

    async generateVCard(info, options) {
        const vcard = `BEGIN:VCARD
VERSION:3.0
N:${info.lastName};${info.firstName}
FN:${info.firstName} ${info.lastName}
TEL:${info.phone}
EMAIL:${info.email}
END:VCARD`;

        return this.generate(vcard, options);
    }

    _addLogoToQR(qrDataUrl, logoFile, callback) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const qrImg = new Image();
        const logoImg = new Image();

        qrImg.onload = () => {
            canvas.width = qrImg.width;
            canvas.height = qrImg.height;
            ctx.drawImage(qrImg, 0, 0);

            const reader = new FileReader();
            reader.onload = (e) => {
                logoImg.onload = () => {
                    // Logo size: 20% of QR
                    const logoSize = canvas.width * 0.2;
                    const logoX = (canvas.width - logoSize) / 2;
                    const logoY = (canvas.height - logoSize) / 2;

                    // Draw white background for logo
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10);

                    ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
                    callback({ success: true, url: canvas.toDataURL('image/png') });
                };
                logoImg.src = e.target.result;
            };
            reader.readAsDataURL(logoFile);
        };
        qrImg.src = qrDataUrl;
    }
}

// Register tool
window.initQRLogic = QRGeneratorTool;
