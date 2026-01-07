/* TULPAR - Base64 Tool OOP Implementation */
class Base64Tool extends BaseTool {
    constructor(config) {
        super(config);
        this.currentFile = null;
    }

    renderUI() {
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const txt = isTr ? {
            input: 'Giriş Metni veya Dosya',
            placeholder: 'Kodlamak istediğiniz metni veya çözmek istediğiniz Base64 dizisini buraya yazın...',
            upload: 'Dosya Yükle',
            encode: 'Kodla',
            decode: 'Çöz',
            output: 'Sonuç',
            copy: 'Kopyala',
            preview: 'Görsel Önizleme'
        } : {
            input: 'Input Text or File',
            placeholder: 'Enter text to encode or Base64 string to decode...',
            upload: 'Upload File',
            encode: 'Encode',
            decode: 'Decode',
            output: 'Result Output',
            copy: 'Copy',
            preview: 'Image Preview'
        };

        return `
        <div class="tool-content" style="max-width: 1000px; margin: 0 auto; padding: 20px;">
            <div class="grid-layout" style="display: grid; grid-template-columns: 1fr; gap: 2rem;">
                <div class="card" style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 12px; box-shadow: var(--shadow-md);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h4 style="margin: 0; color: var(--primary); display: flex; align-items: center; gap: 8px;">⌨️ ${txt.input}</h4>
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <span id="base64-file-name" style="font-size: 0.8rem; color: var(--text-secondary);"></span>
                            <button id="base64-upload-btn" class="btn btn-sm btn-outline">📁 ${txt.upload}</button>
                            <input type="file" id="base64-file-input" style="display:none;">
                        </div>
                    </div>
                    
                    <div id="base64-drop-zone" style="position: relative;">
                         <textarea id="base64-input" class="form-input" style="width: 100%; height: 200px; font-family: var(--font-mono); font-size: 0.95rem; line-height: 1.5;" placeholder="${txt.placeholder}"></textarea>
                         <div id="base64-drop-overlay" style="display: none; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(99, 102, 241, 0.9); border-radius: 8px; align-items: center; justify-content: center; color: white; flex-direction: column; z-index: 10;">
                             <div style="font-size: 2rem;">📂</div>
                             <div style="font-weight: 700; margin-top: 10px;">DROP FILE HERE</div>
                         </div>
                    </div>
                </div>

                <div style="display: flex; gap: 12px; flex-wrap: wrap; justify-content: center;">
                    <button id="base64-encode-btn" class="btn btn-primary" style="min-width: 140px;">🔒 ${txt.encode}</button>
                    <button id="base64-decode-btn" class="btn btn-secondary" style="min-width: 140px;">🔓 ${txt.decode}</button>
                    <button id="base64-encode-url-btn" class="btn btn-outline" style="min-width: 160px; border-color: var(--secondary);">🔗 ${txt.encode} (URL)</button>
                    <button id="base64-decode-url-btn" class="btn btn-outline" style="min-width: 160px; border-color: var(--secondary);">🔗 ${txt.decode} (URL)</button>
                </div>

                <div class="card" style="padding: 1.5rem; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 12px; position: relative; min-height: 250px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h4 id="base64-status" style="margin: 0; color: var(--text-secondary); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px;">${txt.output}</h4>
                        <button id="copy-base64-btn" class="btn btn-sm btn-primary">📋 ${txt.copy}</button>
                    </div>
                    <pre id="base64-output" style="width: 100%; min-height: 150px; background: rgba(0,0,0,0.2); border-radius: 8px; padding: 1rem; font-family: var(--font-mono); font-size: 0.9rem; color: var(--text-primary); white-space: pre-wrap; word-break: break-all; border: 1px solid var(--border-color);"></pre>

                    <div id="base64-preview" style="display: none; margin-top: 1.5rem; text-align: center; border-top: 1px solid var(--border-color); padding-top: 1.5rem;">
                        <h5 style="margin-bottom: 1rem; color: var(--secondary);">${txt.preview}</h5>
                        <div style="background: white; padding: 10px; border-radius: 8px; display: inline-block; max-width: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                            <img id="base64-preview-img" style="max-width: 100%; max-height: 400px; display: block; border-radius: 4px;">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    setupListeners() {
        const input = document.getElementById('base64-input');
        const output = document.getElementById('base64-output');
        const status = document.getElementById('base64-status');
        const preview = document.getElementById('base64-preview');
        const previewImg = document.getElementById('base64-preview-img');
        const fileInput = document.getElementById('base64-file-input');
        const uploadBtn = document.getElementById('base64-upload-btn');
        const fileName = document.getElementById('base64-file-name');

        const encodeBtn = document.getElementById('base64-encode-btn');
        const decodeBtn = document.getElementById('base64-decode-btn');
        const encodeUrlBtn = document.getElementById('base64-encode-url-btn');
        const decodeUrlBtn = document.getElementById('base64-decode-url-btn');
        const copyBtn = document.getElementById('copy-base64-btn');

        const setActiveButton = (activeBtn) => {
            [encodeBtn, decodeBtn, encodeUrlBtn, decodeUrlBtn].forEach(btn => {
                if (btn === activeBtn) {
                    btn.classList.replace('btn-secondary', 'btn-primary');
                    btn.classList.replace('btn-outline', 'btn-primary');
                } else {
                    btn.classList.remove('btn-primary');
                    if (!btn.classList.contains('btn-outline')) btn.classList.add('btn-secondary');
                }
            });
        };

        const dropZone = document.getElementById('base64-drop-zone');
        const dropOverlay = document.getElementById('base64-drop-overlay');

        if (uploadBtn) uploadBtn.onclick = () => fileInput.click();

        // Drag & Drop
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => dropOverlay.style.display = 'flex', false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => dropOverlay.style.display = 'none', false);
        });

        dropZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files.length) handleFiles(files[0]);
        }, false);

        const handleFiles = (file) => {
            this.currentFile = file;
            fileName.textContent = file.name;
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (file.type.startsWith('text/')) {
                    input.value = ev.target.result;
                    this.showNotification(this.t('Text loaded'), 'success');
                } else {
                    input.value = `[Binary File Loaded: ${file.name}]`;
                    output.textContent = ev.target.result.split(',')[1];
                    if (file.type.startsWith('image/')) {
                        previewImg.src = ev.target.result;
                        preview.style.display = 'block';
                    }
                    this.showNotification(this.t('File encoded effectively'), 'success');
                }
            };
            file.type.startsWith('text/') ? reader.readAsText(file) : reader.readAsDataURL(file);
        };

        if (fileInput) {
            fileInput.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                handleFiles(file);
            };
        }

        encodeBtn.onclick = () => {
            setActiveButton(encodeBtn);
            const val = input.value.trim();
            if (!val || val.startsWith('[Binary')) return;
            try {
                output.textContent = btoa(unescape(encodeURIComponent(val)));
                status.style.color = 'var(--success)';
            } catch (e) { this.showNotification('Encoding failed', 'error'); }
        };

        decodeBtn.onclick = () => {
            setActiveButton(decodeBtn);
            const val = input.value.trim();
            if (!val) return;
            try {
                const decoded = decodeURIComponent(escape(atob(val)));
                output.textContent = decoded;
                if (val.startsWith('data:image/')) {
                    previewImg.src = val;
                    preview.style.display = 'block';
                }
            } catch (e) { this.showNotification('Invalid Base64', 'error'); }
        };

        encodeUrlBtn.onclick = () => {
            setActiveButton(encodeUrlBtn);
            const val = input.value.trim();
            if (!val) return;
            output.textContent = btoa(unescape(encodeURIComponent(val))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
        };

        decodeUrlBtn.onclick = () => {
            setActiveButton(decodeUrlBtn);
            const val = input.value.trim();
            if (!val) return;
            let base64 = val.replace(/-/g, '+').replace(/_/g, '/');
            while (base64.length % 4) base64 += '=';
            try { output.textContent = decodeURIComponent(escape(atob(base64))); } catch (e) { }
        };

        copyBtn.onclick = () => this.copyToClipboard(output.textContent);
    }
}

// Register tool
window.initBase64ToolLogic = Base64Tool;
