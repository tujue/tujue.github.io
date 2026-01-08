/* TULPAR - OCR Tool OOP Implementation */
class OCRTool extends BaseTool {
  constructor(config) {
    super(config);
    this.selectedFile = null;
  }

  renderUI() {
    const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
    const txt = isTr ? {
      title: 'Görselden Metin Okuma (OCR)',
      drop: 'Görseli sürükleyin veya seçmek için tıklayın',
      lang: 'Hangi Dilde Taranacak?',
      extract: 'Metni Çıkar ✨',
      status: 'AI Motoru Hazırlanıyor...',
      result: 'Çıkarılan İçerik',
      copy: 'Kopyala',
      clear: 'Temizle',
      placeholder: 'Tanınan metin burada görünecek...'
    } : {
      title: 'Optical Character Recognition (OCR)',
      drop: 'Drop image or click to select',
      lang: 'Target Language',
      extract: 'Extract Text ✨',
      status: 'Initializing AI Engine...',
      result: 'Extracted Content',
      copy: 'Copy Text',
      clear: 'Clear',
      placeholder: 'Recognized text will appear here...'
    };

    return `
        <div class="tool-content ocr-studio" style="max-width: 1000px; margin: 0 auto; padding: 20px;">
            <div class="grid-layout" style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 2.5rem;">
                
                <!-- Input Section -->
                <div class="ocr-input-side">
                    <div class="card" style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 16px;">
                        <h4 style="margin-bottom: 1.5rem; color: var(--primary);">${txt.title}</h4>
                        
                        <div id="ocr-dropzone" class="dropzone" style="height: 220px; border: 2px dashed var(--border-color); border-radius: 12px; display: flex; flex-direction: column; justify-content: center; align-items: center; cursor: pointer; background: rgba(0,0,0,0.1); overflow: hidden; position: relative; transition: all 0.3s ease;">
                            <div id="ocr-prompt" style="text-align: center; opacity: 0.6;">
                                <div style="font-size: 3rem; margin-bottom: 0.5rem;">📄</div>
                                <p style="font-size: 0.85rem;">${txt.drop}</p>
                            </div>
                            <div id="ocr-preview" style="position: absolute; inset:0; background-size: contain; background-repeat: no-repeat; background-position: center; display: none;"></div>
                            <input type="file" id="ocr-file" hidden accept="image/*">
                        </div>

                        <div class="form-group" style="margin-top: 1.5rem;">
                            <label class="form-label">${txt.lang}</label>
                            <select id="ocr-lang" class="form-select">
                                <option value="eng">English</option>
                                <option value="tur">Türkçe</option>
                                <option value="deu">Deutsch</option>
                                <option value="fra">Français</option>
                                <option value="spa">Español</option>
                            </select>
                        </div>

                        <button id="ocr-btn-start" class="btn btn-primary" style="width: 100%; height: 3.5rem; font-weight: 700; margin-top: 1rem;" disabled>${txt.extract}</button>
                    </div>

                    <div id="ocr-progress-container" style="display: none; margin-top: 1.5rem; background: var(--surface); padding: 1.2rem; border-radius: 12px; border: 1px solid var(--border-color);">
                        <div class="progress-bar-bg" style="height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
                            <div id="ocr-bar" style="height: 100%; width: 0%; background: var(--success); transition: width 0.3s;"></div>
                        </div>
                        <div id="ocr-status-msg" style="margin-top: 10px; font-size: 0.8rem; font-weight: 500; opacity: 0.8;">${txt.status}</div>
                    </div>
                </div>

                <!-- Result Section -->
                <div class="ocr-result-side">
                    <div class="card" style="padding: 1.5rem; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 16px; height: 100%; display: flex; flex-direction: column;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                            <h4 style="margin: 0; font-size: 0.85rem; text-transform: uppercase; color: var(--text-secondary);">${txt.result}</h4>
                            <div style="display: flex; gap: 8px;">
                                <button id="ocr-btn-clear" class="btn btn-sm btn-outline" style="color: var(--danger); border-color: rgba(239, 68, 68, 0.3);">${txt.clear}</button>
                                <button id="ocr-btn-copy" class="btn btn-sm btn-primary">📋 ${txt.copy}</button>
                            </div>
                        </div>
                        <textarea id="ocr-output" class="form-input" style="flex: 1; min-height: 450px; font-family: var(--font-mono); font-size: 0.95rem; line-height: 1.6; padding: 1rem; border: none; background: rgba(0,0,0,0.1);" placeholder="${txt.placeholder}"></textarea>
                    </div>
                </div>
            </div>
        </div>
        `;
  }

  setupListeners() {
    const dropzone = document.getElementById('ocr-dropzone');
    const fileInput = document.getElementById('ocr-file');
    const preview = document.getElementById('ocr-preview');
    const prompt = document.getElementById('ocr-prompt');
    const startBtn = document.getElementById('ocr-btn-start');
    const output = document.getElementById('ocr-output');
    const progressCont = document.getElementById('ocr-progress-container');
    const progressBar = document.getElementById('ocr-bar');
    const statusMsg = document.getElementById('ocr-status-msg');

    dropzone.onclick = () => fileInput.click();

    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith('image/')) {
        this.selectedFile = file;
        const reader = new FileReader();
        reader.onload = (re) => {
          preview.style.backgroundImage = `url(${re.target.result})`;
          preview.style.display = 'block';
          prompt.style.display = 'none';
          startBtn.disabled = false;
        };
        reader.readAsDataURL(file);
      }
    };

    startBtn.onclick = async () => {
      if (!this.selectedFile) return;
      startBtn.disabled = true;
      progressCont.style.display = 'block';
      output.value = '';

      try {
        const lang = document.getElementById('ocr-lang').value;
        const text = await this.recognize(this.selectedFile, lang, (progress, status) => {
          const pct = Math.round(progress * 100);
          progressBar.style.width = pct + '%';
          statusMsg.textContent = `${status.charAt(0).toUpperCase() + status.slice(1)}... ${pct}%`;
        });
        output.value = text;
        this.showNotification('OCR Scan Complete!', 'success');
      } catch (err) {
        this.showNotification(err.message, 'error');
      } finally {
        startBtn.disabled = false;
      }
    };

    document.getElementById('ocr-btn-clear').onclick = () => {
      this.selectedFile = null;
      preview.style.display = 'none';
      prompt.style.display = 'block';
      output.value = '';
      startBtn.disabled = true;
      progressCont.style.display = 'none';
      fileInput.value = '';
    };

    document.getElementById('ocr-btn-copy').onclick = () => this.copyToClipboard(output.value);
  }

  // INTERNAL LOGIC (Formerly in DevTools.ocrTools)

  async recognize(file, lang, progressCallback) {
    if (!window.Tesseract) {
      progressCallback(0, 'loading core (Tesseract.js)...');
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
        script.onload = resolve;
        script.onerror = () => reject(new Error('Failed to load Tesseract.js'));
        document.head.appendChild(script);
      });
    }

    progressCallback(0.1, 'processing image...');

    const { data: { text } } = await window.Tesseract.recognize(
      file,
      lang,
      {
        logger: m => {
          if (m.status === 'recognizing text') {
            progressCallback(m.progress, m.status);
          } else {
            // Other statuses
            progressCallback(0.5, m.status);
          }
        }
      }
    );

    return text;
  }
}

// Register tool
window.initOcrToolLogic = OCRTool;
