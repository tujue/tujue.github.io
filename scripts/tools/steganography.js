/* TULPAR - Steganography Tool OOP Implementation */
class SteganographyTool extends BaseTool {
    constructor(config) {
        super(config);
        this.selectedFile = null;
        this.extractFile = null;
    }

    renderUI() {
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const txt = isTr ? {
            title: 'Görsel Şifreleme (Steganografi)',
            hide: 'Mesaj Gizle',
            extract: 'Mesaj Çöz',
            drop: 'Resim Seç (PNG önerilir)',
            msg: 'Gizli İleti',
            go: 'Şifrele & İndir ✨',
            res: 'Çözülen Mesaj',
            dropEnc: 'Şifreli Görseli Buraya Bırak',
            btnDec: 'ŞİFREYİ ÇÖZ',
            weaving: 'İşleniyor...',
            noMsg: 'Bu dosyada gizli mesaj bulunamadı.',
            success: 'Başarılı! Şifreli görsel indirildi.'
        } : {
            title: 'Stego-Vault Laboratory',
            hide: 'Conceal Message',
            extract: 'Reveal Secret',
            drop: 'Select Host Image (PNG)',
            msg: 'Secret Cipher',
            go: 'Encrypt & Export ✨',
            res: 'Extracted Ciphertext',
            dropEnc: 'Drop Encrypted PNG',
            btnDec: 'RUN DECRYPTOR',
            weaving: 'Weaving...',
            noMsg: 'No hidden message found in this file.',
            success: 'Success! Encrypted PNG downloaded.'
        };

        return `
        <div class="tool-content stego-studio" style="max-width: 1200px; margin: 0 auto; padding: 20px;">
            <div class="grid-layout" style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem;">
                
                <!-- concealment Side -->
                <div class="st-conceal">
                    <div class="card" style="padding: 2rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 24px;">
                        <h4 style="margin-bottom: 2rem; color: var(--primary); text-transform: uppercase; font-size: 0.8rem; letter-spacing: 1px;">${txt.hide}</h4>
                        
                        <div id="st-drop-host" class="drop-zone" style="height: 200px; border: 2px dashed var(--primary); border-radius: 16px; display: flex; align-items: center; justify-content: center; background: rgba(99, 102, 241, 0.05); cursor: pointer; position: relative; overflow: hidden; margin-bottom: 1.5rem;">
                            <input type="file" id="st-file-host" hidden accept="image/*">
                            <span id="st-host-txt">${txt.drop}</span>
                            <img id="st-host-prev" style="display: none; width: 100%; height: 100%; object-fit: contain;">
                        </div>

                        <div class="form-group">
                            <label class="form-label">${txt.msg}</label>
                            <textarea id="st-in-msg" class="form-input" style="height: 120px; font-family: var(--font-mono); font-size: 0.9rem;" placeholder="Your secret message..."></textarea>
                        </div>

                        <button id="st-btn-enc" class="btn btn-primary" style="width: 100%; height: 3.5rem; font-weight: 700; margin-top: 1rem;">${txt.go}</button>
                    </div>
                </div>

                <!-- Revelation Side -->
                <div class="st-reveal">
                    <div class="card" style="padding: 2rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 24px;">
                        <h4 style="margin-bottom: 2rem; color: #10b981; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 1px;">${txt.extract}</h4>
                        
                        <div id="st-drop-enc" class="drop-zone" style="height: 120px; border: 2px dashed #10b981; border-radius: 16px; display: flex; align-items: center; justify-content: center; background: rgba(16, 185, 129, 0.05); cursor: pointer; margin-bottom: 1.5rem;">
                            <input type="file" id="st-file-enc" hidden accept="image/png">
                            <span id="st-enc-txt">${txt.dropEnc}</span>
                        </div>

                        <div class="form-group">
                            <label class="form-label">${txt.res}</label>
                            <div id="st-out-res" style="height: 200px; background: rgba(0,0,0,0.3); border-radius: 12px; padding: 1.5rem; font-family: var(--font-mono); color: #10b981; overflow-y: auto; word-break: break-all;">
                                <span style="opacity: 0.3;">...</span>
                            </div>
                        </div>

                        <button id="st-btn-dec" class="btn btn-success" style="width: 100%; height: 3.5rem; font-weight: 700; margin-top: 1rem;">${txt.btnDec}</button>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    setupListeners() {
        const hostDrop = document.getElementById('st-drop-host');
        const hostFile = document.getElementById('st-file-host');
        const hostPrev = document.getElementById('st-host-prev');
        const hostTxt = document.getElementById('st-host-txt');
        const msgIn = document.getElementById('st-in-msg');
        const btnEnc = document.getElementById('st-btn-enc');

        const encDrop = document.getElementById('st-drop-enc');
        const encFile = document.getElementById('st-file-enc');
        const encTxt = document.getElementById('st-enc-txt');
        const outRes = document.getElementById('st-out-res');
        const btnDec = document.getElementById('st-btn-dec');

        hostDrop.onclick = () => hostFile.click();
        hostFile.onchange = (e) => {
            this.selectedFile = e.target.files[0];
            if (this.selectedFile) {
                hostTxt.style.display = 'none';
                hostPrev.style.display = 'block';
                hostPrev.src = URL.createObjectURL(this.selectedFile);
            }
        };

        btnEnc.onclick = async () => {
            // Access txt again hack or store it? Since txt is local to renderUI, we can't access it here.
            // We need to re-derive 'isTr' or make txt a class property.
            // Simplest: Check language here again.
            const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
            const curTxt = isTr ? { weaving: 'İşleniyor...', go: 'Şifrele & İndir ✨', success: 'Başarılı! Şifreli görsel indirildi.' }
                : { weaving: 'Weaving...', go: 'Encrypt & Export ✨', success: 'Success! Encrypted PNG downloaded.' };

            if (!this.selectedFile || !msgIn.value) return this.showNotification('Host image and message required', 'error');
            btnEnc.disabled = true;
            btnEnc.textContent = curTxt.weaving;
            try {
                const url = await window.DevTools.steganographyTools.encode(this.selectedFile, msgIn.value);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'vault_' + Date.now() + '.png';
                a.click();
                this.showNotification(curTxt.success, 'success');
            } catch (err) {
                this.showNotification(err.message, 'error');
            } finally {
                btnEnc.disabled = false;
                btnEnc.textContent = curTxt.go;
            }
        };

        encDrop.onclick = () => encFile.click();
        encFile.onchange = (e) => {
            this.extractFile = e.target.files[0];
            if (this.extractFile) encTxt.textContent = "📄 " + this.extractFile.name;
        };

        btnDec.onclick = async () => {
            const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
            const curTxt = isTr ? { noMsg: 'Bu dosyada gizli mesaj bulunamadı.' } : { noMsg: 'No hidden message found in this file.' };

            if (!this.extractFile) return this.showNotification('Please select a vault file', 'error');
            btnDec.disabled = true;
            try {
                const msg = await window.DevTools.steganographyTools.decode(this.extractFile);
                outRes.textContent = msg || curTxt.noMsg;
            } catch (err) {
                this.showNotification('Decryption failed', 'error');
            } finally {
                btnDec.disabled = false;
            }
        };
    }
}

// Register tool
window.initSteganographyLogic = SteganographyTool;
