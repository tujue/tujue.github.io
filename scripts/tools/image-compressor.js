/* TULPAR - Image Compressor Tool OOP Implementation */
class ImageCompressorTool extends BaseTool {
  constructor(config) {
    super(config);
    this.selectedFile = null;
    this.compressedData = null;
  }

  renderUI() {
    const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
    const txt = isTr ? {
      title: 'Akıllı Görsel Sıkıştırıcı',
      drop: 'Görseli bırakın veya seçmek için tıklayın',
      quality: 'Sıkıştırma Oranı',
      format: 'Çıktı Formatı',
      formatOptions: { same: 'Orijinal ile aynı', jpeg: 'JPEG', png: 'PNG', webp: 'WebP' },
      resize: {
        mode: 'Boyutlandırma Modu',
        none: 'Boyutlandırma Yok (Orijinal)',
        scale: 'Orçekle (%)',
        fixed: 'Sabit Boyutlar',
        width: 'Genişlik (px)',
        height: 'Yükseklik (px)',
        lock: 'En/Boy Oranını Kilitle',
        scaleLabel: 'Ölçek'
      },
      compress: 'Şimdi Sıkıştır ✨',
      processing: '⏳ İşleniyor...',
      stats: { orig: 'Orijinal', comp: 'Sıkıştırılmış', save: 'Tasarruf' },
      download: 'İndir & Kaydet 💾',
      preview: 'Önizleme',
      previewPlaceholder: 'Önizleme burada görünecek',
      success: 'Sıkıştırma tamamlandı!'
    } : {
      title: 'Smart Image Compressor',
      drop: 'Drop image or click to browse',
      quality: 'Compression Quality',
      format: 'Output Format',
      formatOptions: { same: 'Same as original', jpeg: 'JPEG', png: 'PNG', webp: 'WebP' },
      resize: {
        mode: 'Resize Mode',
        none: 'No Resize (Original)',
        scale: 'Scale (%)',
        fixed: 'Fixed Dimensions',
        width: 'Width (px)',
        height: 'Height (px)',
        lock: 'Lock Aspect Ratio',
        scaleLabel: 'Scale'
      },
      compress: 'Compress Now ✨',
      processing: '⏳ Processing...',
      stats: { orig: 'Original', comp: 'Compressed', save: 'Saving' },
      download: 'Download & Save 💾',
      preview: 'Preview',
      previewPlaceholder: 'Preview will appear here',
      success: 'Compression complete!'
    };

    return `
        <div class="tool-content compressor-studio" style="max-width: 1100px; margin: 0 auto; padding: 20px;">
            <div class="grid-layout" style="display: grid; grid-template-columns: 350px 1fr; gap: 2.5rem;">
                
                <!-- Settings -->
                <div class="comp-settings">
                    <div class="card" style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 16px;">
                        <h4 style="margin-bottom: 1.5rem; color: var(--primary); text-transform: uppercase; font-size: 0.85rem;">${txt.title}</h4>
                        
                        <div id="comp-drop" class="dropzone" style="height: 120px; border: 2px dashed var(--border-color); border-radius: 12px; display: flex; flex-direction: column; justify-content: center; align-items: center; cursor: pointer; background: rgba(0,0,0,0.1); margin-bottom: 1.5rem;">
                            <span id="comp-drop-txt" style="font-size: 0.8rem; opacity: 0.6; text-align: center;">${txt.drop}</span>
                            <input type="file" id="comp-in-file" hidden accept="image/*">
                        </div>

                        <div class="form-group">
                            <label class="form-label">${txt.quality}: <span id="comp-val-q" style="color: var(--primary); font-weight: 700;">80</span>%</label>
                            <input type="range" id="comp-in-q" class="form-range" min="1" max="100" value="80">
                        </div>

                        <div class="form-group">
                            <label class="form-label">${txt.format}</label>
                            <select id="comp-in-fmt" class="form-select">
                                <option value="">${txt.formatOptions.same}</option>
                                <option value="image/jpeg">${txt.formatOptions.jpeg}</option>
                                <option value="image/png">${txt.formatOptions.png}</option>
                                <option value="image/webp">${txt.formatOptions.webp}</option>
                            </select>
                        </div>
                        
                        <div class="form-group" style="margin-top: 15px;">
                            <label class="form-label">${txt.resize.mode}</label>
                            <select id="comp-rs-mode" class="form-select">
                                <option value="none">${txt.resize.none}</option>
                                <option value="scale">${txt.resize.scale}</option>
                                <option value="fixed">${txt.resize.fixed}</option>
                            </select>
                        </div>
                        
                        <div id="comp-rs-opt-scale" style="display:none; margin-top: 10px;">
                             <label class="form-label">${txt.resize.scaleLabel}: <span id="comp-val-scale">100</span>%</label>
                             <input type="range" id="comp-in-scale" class="form-range" min="10" max="200" step="10" value="100">
                        </div>

                        <div id="comp-rs-opt-fixed" style="display:none; margin-top: 10px;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                                <div>
                                    <label class="form-label" style="font-size:0.75rem;">${txt.resize.width}</label>
                                    <input type="number" id="comp-in-w" class="form-input" placeholder="Auto">
                                </div>
                                <div>
                                    <label class="form-label" style="font-size:0.75rem;">${txt.resize.height}</label>
                                    <input type="number" id="comp-in-h" class="form-input" placeholder="Auto">
                                </div>
                            </div>
                            <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; margin-top: 8px; font-size: 0.85rem;">
                                <input type="checkbox" id="comp-lock-ratio" checked>
                                <span>🔒 ${txt.resize.lock}</span>
                            </label>
                        </div>

                        <button id="comp-btn-run" class="btn btn-primary" style="width: 100%; height: 3.5rem; font-weight: 700; margin-top: 1rem;" disabled>${txt.compress}</button>
                    </div>
                </div>

                <!-- Preview & Stats -->
                <div class="comp-results">
                    <div class="card" style="padding: 1.5rem; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 16px; min-height: 500px; display: flex; flex-direction: column;">
                        <div id="comp-stats-grid" style="display: none; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 1.5rem;">
                            <div class="stat-card" style="background: var(--surface); padding: 10px; border-radius: 8px; text-align: center;">
                                <div style="font-size: 0.7rem; opacity: 0.5;">${txt.stats.orig}</div>
                                <div id="st-orig" style="font-weight: 700; font-size: 0.9rem;">-</div>
                            </div>
                            <div class="stat-card" style="background: var(--surface); padding: 10px; border-radius: 8px; text-align: center;">
                                <div style="font-size: 0.7rem; opacity: 0.5;">${txt.stats.comp}</div>
                                <div id="st-comp" style="font-weight: 700; font-size: 0.9rem;">-</div>
                            </div>
                            <div class="stat-card" style="background: var(--surface); padding: 10px; border-radius: 8px; text-align: center;">
                                <div style="font-size: 0.7rem; opacity: 0.5;">${txt.stats.save}</div>
                                <div id="st-save" style="font-weight: 700; font-size: 0.9rem; color: var(--success);">-</div>
                            </div>
                        </div>

                        <div id="comp-preview-cont" style="flex: 1; position: relative; border-radius: 12px; overflow: hidden; background: rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center;">
                            <div style="opacity: 0.2; font-size: 0.85rem;">${txt.previewPlaceholder}</div>
                            <img id="comp-preview-img" style="max-width: 100%; max-height: 450px; display: none; object-fit: contain;">
                        </div>

                        <button id="comp-btn-dl" class="btn btn-success" style="width: 100%; height: 3.5rem; margin-top: 1.5rem; display: none;">${txt.download}</button>
                    </div>
                </div>
            </div>
        </div>
        `;
  }

  setupListeners() {
    const drop = document.getElementById('comp-drop');
    const inFile = document.getElementById('comp-in-file');
    const btnRun = document.getElementById('comp-btn-run');
    const btnDl = document.getElementById('comp-btn-dl');
    const inQ = document.getElementById('comp-in-q');
    const preview = document.getElementById('comp-preview-img');

    // Resize controls
    const rsMode = document.getElementById('comp-rs-mode');
    const rsOptScale = document.getElementById('comp-rs-opt-scale');
    const rsOptFixed = document.getElementById('comp-rs-opt-fixed');
    const inScale = document.getElementById('comp-in-scale');
    const valScale = document.getElementById('comp-val-scale');
    const inW = document.getElementById('comp-in-w');
    const inH = document.getElementById('comp-in-h');
    const lockRatio = document.getElementById('comp-lock-ratio');

    let originalAspectRatio = 1;

    // Helper for localization
    const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
    const msgProcessing = isTr ? '⏳ İşleniyor...' : '⏳ Processing...';
    const msgSuccess = isTr ? 'Sıkıştırma tamamlandı!' : 'Compression complete!';
    const msgInitial = isTr ? 'Şimdi Sıkıştır ✨' : 'Compress Now ✨';

    rsMode.onchange = () => {
      rsOptScale.style.display = rsMode.value === 'scale' ? 'block' : 'none';
      rsOptFixed.style.display = rsMode.value === 'fixed' ? 'block' : 'none';
    };

    inScale.oninput = () => valScale.textContent = inScale.value;

    // Aspect ratio lock logic
    inW.oninput = () => {
      if (lockRatio.checked && inW.value && originalAspectRatio) {
        inH.value = Math.round(parseInt(inW.value) / originalAspectRatio);
      }
    };

    inH.oninput = () => {
      if (lockRatio.checked && inH.value && originalAspectRatio) {
        inW.value = Math.round(parseInt(inH.value) * originalAspectRatio);
      }
    };

    drop.onclick = () => inFile.click();
    inFile.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        this.selectedFile = file;
        document.getElementById('comp-drop-txt').textContent = `📄 ${file.name}`;
        btnRun.disabled = false;

        const reader = new FileReader();
        reader.onload = (re) => {
          const img = new Image();
          img.onload = () => {
            // Store original aspect ratio
            originalAspectRatio = img.width / img.height;
            preview.src = re.target.result;
            preview.style.display = 'block';
            preview.parentElement.querySelector('div').style.display = 'none';
          };
          img.src = re.target.result;
        };
        reader.readAsDataURL(file);
      }
    };

    inQ.oninput = () => document.getElementById('comp-val-q').textContent = inQ.value;

    btnRun.onclick = async () => {
      if (!this.selectedFile) return;
      btnRun.disabled = true;
      btnRun.textContent = msgProcessing;

      try {
        const format = document.getElementById('comp-in-fmt').value || null;

        // Collect Resize Params
        let resize = null;
        if (rsMode.value === 'scale') {
          resize = { scale: parseInt(inScale.value) / 100 };
        } else if (rsMode.value === 'fixed') {
          const w = document.getElementById('comp-in-w').value;
          const h = document.getElementById('comp-in-h').value;
          // Valid logic: at least one dim set
          if (w || h) resize = { width: w, height: h };
        }

        const result = await window.DevTools.imageCompressor.compress(this.selectedFile, parseInt(inQ.value), format, resize);
        this.compressedData = result;

        // Update Stats
        document.getElementById('comp-stats-grid').style.display = 'grid';
        document.getElementById('st-orig').textContent = (result.originalSize / 1024).toFixed(1) + ' KB';

        let compTxt = (result.compressedSize / 1024).toFixed(1) + ' KB';
        if (result.width && result.height) compTxt += ` (${result.width}x${result.height})`;

        document.getElementById('st-comp').textContent = compTxt;
        document.getElementById('st-save').textContent = result.reduction + '%';

        preview.src = result.dataUrl;
        btnDl.style.display = 'block';
        this.showNotification(msgSuccess, 'success');
      } catch (err) { this.showNotification(err.message, 'error'); }
      finally { btnRun.disabled = false; btnRun.textContent = msgInitial; }
    };

    btnDl.onclick = () => {
      if (!this.compressedData) return;
      const a = document.createElement('a');
      a.download = `compressed_${this.selectedFile.name}`;
      a.href = URL.createObjectURL(this.compressedData.blob);
      a.click();
    };
  }
}

// Register tool
window.initImageCompressorLogic = ImageCompressorTool;
