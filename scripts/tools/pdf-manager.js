/* TULPAR - PDF Manager Tool OOP Implementation */
class PDFManagerTool extends BaseTool {
  constructor(config) {
    super(config);
    this.mergeFiles = [];
    this.currentQuickFile = null;
  }

  renderUI() {
    const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
    const txt = isTr ? {
      merge: 'Birleştirme & Organizasyon',
      drop: 'PDF Dosyalarını Sürükleyin veya Ekleyin',
      waiting: 'Dosya Listesi Boş',
      construct: 'Final PDF Dosyasını Oluştur 🛠️',
      quick: 'Hızlı İşlemler',
      upload: 'Dosya Üzerinde İşlem Yap',
      rotate: '90° Çevir 🔄',
      extract: 'Seçili Sayfaları Ayır ✂️',
      clear: 'Temizle',
      placeholder: 'Örn: 1-3, 5'
    } : {
      merge: 'Merge & Organization',
      drop: 'Drop PDF Files or Click to Add',
      waiting: 'No Files Added Yet',
      construct: 'Construct Final PDF 🛠️',
      quick: 'Quick Actions',
      upload: 'Upload PDF for Tools',
      rotate: 'Rotate 90° CW 🔄',
      extract: 'Extract Selected Pages ✂️',
      clear: 'Clear List',
      placeholder: 'e.g. 1-3, 5'
    };

    return `
        <div class="tool-content pdf-studio" style="max-width: 1100px; margin: 0 auto; padding: 20px;">
            <div class="grid-layout" style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 2.5rem;">
                
                <!-- Merge Section -->
                <div class="pdf-merge-side">
                    <div class="card" style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 16px; margin-bottom: 2rem;">
                        <h4 style="margin-bottom: 1.5rem; color: var(--primary);">${txt.merge}</h4>
                        
                        <div id="pdf-drop" class="dropzone" style="height: 120px; border: 2px dashed var(--border-color); border-radius: 12px; display: flex; flex-direction: column; justify-content: center; align-items: center; cursor: pointer; background: rgba(0,0,0,0.1); margin-bottom: 1rem;">
                            <span style="opacity: 0.6; font-size: 0.9rem;">📂 ${txt.drop}</span>
                            <input type="file" id="pdf-in-merge" hidden accept="application/pdf" multiple>
                        </div>

                        <div id="pdf-list-cont" style="border: 1px solid var(--border-color); border-radius: 12px; min-height: 150px; max-height: 250px; overflow-y: auto; background: rgba(0,0,0,0.1);">
                            <div style="padding: 3rem; text-align: center; opacity: 0.3; font-size: 0.9rem;">${txt.waiting}</div>
                        </div>

                        <button id="pdf-btn-merge" class="btn btn-primary" style="width: 100%; height: 3.5rem; font-weight: 700; margin-top: 1.5rem;" disabled>${txt.construct}</button>
                    </div>

                    <div class="card" style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 16px;">
                         <h4 style="margin-bottom: 1.5rem; color: var(--secondary);">🖼️ Images to PDF</h4>
                         <div style="display: flex; gap: 10px; align-items: center;">
                            <input type="file" id="pdf-in-imgs" class="form-input" accept="image/jpeg, image/png" multiple>
                            <button id="pdf-btn-img" class="btn btn-secondary">Convert</button>
                         </div>
                    </div>
                </div>

                <!-- Quick Actions Section -->
                <div class="pdf-quick-side">
                    <div class="card" style="padding: 1.5rem; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 16px; height: 100%;">
                        <h4 style="margin-bottom: 1.5rem; color: var(--text-secondary); font-size: 0.85rem; text-transform: uppercase;">${txt.quick}</h4>
                        
                        <div class="form-group">
                            <label class="form-label">${txt.upload}</label>
                            <input type="file" id="pdf-in-quick" class="form-input" accept="application/pdf">
                        </div>

                        <div id="pdf-quick-panel" style="display: none; margin-top: 2rem; padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 12px;">
                            <div style="font-size: 0.85rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between;">
                                <span style="opacity: 0.6;">Total Pages:</span>
                                <strong id="pdf-pages-count">0</strong>
                            </div>

                            <div style="display: grid; gap: 10px;">
                                <button id="pdf-btn-rotate" class="btn btn-secondary" style="height: 3rem;">${txt.rotate}</button>
                                
                                <div style="margin-top: 1rem; border-top: 1px solid var(--border-color); pt: 1rem;">
                                    <label class="form-label" style="font-size: 0.75rem; margin-top: 10px;">${txt.extract}</label>
                                    <div style="display: flex; gap: 8px;">
                                        <input type="text" id="pdf-range-input" class="form-input" style="height: 3rem;" placeholder="${txt.placeholder}">
                                        <button id="pdf-btn-extract" class="btn btn-primary" style="height: 3rem; min-width: 60px;">✂️</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
  }

  setupListeners() {
    // Selectors
    const drop = document.getElementById('pdf-drop');
    const inMerge = document.getElementById('pdf-in-merge');
    const btnMerge = document.getElementById('pdf-btn-merge');
    const inQuick = document.getElementById('pdf-in-quick');
    const quickPanel = document.getElementById('pdf-quick-panel');
    const pagesCount = document.getElementById('pdf-pages-count');

    // Merge Logic
    drop.onclick = () => inMerge.click();
    inMerge.onchange = (e) => {
      for (let f of e.target.files) this.mergeFiles.push(f);
      this._updateList();
    };

    btnMerge.onclick = async () => {
      if (typeof PDFLib === 'undefined') {
        this.showNotification('PDFLib library not loaded.', 'error');
        return;
      }
      if (this.mergeFiles.length === 0) return;
      btnMerge.disabled = true;
      btnMerge.textContent = 'Processing...';
      try {
        const blob = await this.mergePDFs(this.mergeFiles);
        this._download(blob, 'combined.pdf');
        this.showNotification('PDFs merged successfully!', 'success');
      } catch (err) {
        this.showNotification(err.message, 'error');
      } finally {
        btnMerge.disabled = false;
        btnMerge.innerHTML = 'Construct Final PDF 🛠️';
      }
    };

    // Images to PDF
    document.getElementById('pdf-btn-img').onclick = async () => {
      if (typeof PDFLib === 'undefined') {
        this.showNotification('PDFLib library not loaded.', 'error');
        return;
      }
      const fileInput = document.getElementById('pdf-in-imgs');
      if (!fileInput.files.length) return;
      const btn = document.getElementById('pdf-btn-img');
      btn.disabled = true;
      btn.textContent = '...';
      try {
        const blob = await this.imagesToPdf(fileInput.files);
        this._download(blob, 'images.pdf');
      } catch (err) { this.showNotification(err.message, 'error'); }
      finally { btn.disabled = false; btn.textContent = 'Convert'; }
    };

    // Quick Actions Logic
    inQuick.onchange = async (e) => {
      if (typeof PDFLib === 'undefined') {
        this.showNotification('PDFLib library not loaded.', 'error');
        return;
      }
      const file = e.target.files[0];
      if (!file) return;
      this.currentQuickFile = file;
      try {
        const arrayBuffer = await file.arrayBuffer();
        const doc = await PDFLib.PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        pagesCount.textContent = doc.getPageCount();
        quickPanel.style.display = 'block';
      } catch (err) {
        this.showNotification('Invalid PDF', 'error');
      }
    };

    document.getElementById('pdf-btn-rotate').onclick = async () => {
      if (!this.currentQuickFile) return;
      try {
        const blob = await this.rotatePDF(this.currentQuickFile, 90);
        this._download(blob, 'rotated.pdf');
      } catch (err) { this.showNotification(err.message, 'error'); }
    };

    document.getElementById('pdf-btn-extract').onclick = async () => {
      const range = document.getElementById('pdf-range-input').value;
      if (!this.currentQuickFile || !range) return;
      try {
        const blob = await this.extractPages(this.currentQuickFile, range);
        this._download(blob, 'extracted.pdf');
      } catch (err) { this.showNotification(err.message, 'error'); }
    };
  }

  _updateList() {
    const listCont = document.getElementById('pdf-list-cont');
    const btnMerge = document.getElementById('pdf-btn-merge');

    if (this.mergeFiles.length === 0) {
      listCont.innerHTML = `<div style="padding: 3rem; text-align: center; opacity: 0.3; font-size: 0.9rem;">No Files Added Yet</div>`;
      btnMerge.disabled = true;
      return;
    }
    btnMerge.disabled = false;
    listCont.innerHTML = this.mergeFiles.map((f, i) => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 0.85rem;">
                    <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 250px;">${f.name}</span>
                    <div style="display: flex; gap: 6px;">
                        <button class="btn btn-sm btn-outline pdf-move" data-idx="${i}" data-dir="-1" style="padding: 2px 8px;">↑</button>
                        <button class="btn btn-sm btn-outline pdf-move" data-idx="${i}" data-dir="1" style="padding: 2px 8px;">↓</button>
                        <button class="btn btn-sm pdf-del" data-idx="${i}" style="color: var(--danger); border: none; background: transparent;">✕</button>
                    </div>
                </div>
            `).join('');

    listCont.querySelectorAll('.pdf-move').forEach(b => {
      b.onclick = () => {
        const idx = parseInt(b.dataset.idx);
        const dir = parseInt(b.dataset.dir);
        const target = idx + dir;
        if (target >= 0 && target < this.mergeFiles.length) {
          [this.mergeFiles[idx], this.mergeFiles[target]] = [this.mergeFiles[target], this.mergeFiles[idx]];
          this._updateList();
        }
      };
    });

    listCont.querySelectorAll('.pdf-del').forEach(b => {
      b.onclick = () => {
        this.mergeFiles.splice(parseInt(b.dataset.idx), 1);
        this._updateList();
      };
    });
  }

  _download(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // INTERNAL LOGIC (Formerly in DevTools.pdfTools)

  async mergePDFs(files) {
    const mergedPdf = await PDFLib.PDFDocument.create();
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFLib.PDFDocument.load(arrayBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
    const pdfBytes = await mergedPdf.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
  }

  async imagesToPdf(files) {
    const pdfDoc = await PDFLib.PDFDocument.create();
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      let image;
      if (file.type === 'image/jpeg') {
        image = await pdfDoc.embedJpg(arrayBuffer);
      } else if (file.type === 'image/png') {
        image = await pdfDoc.embedPng(arrayBuffer);
      } else {
        continue;
      }
      const page = pdfDoc.addPage([image.width, image.height]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      });
    }
    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
  }

  async rotatePDF(file, angle) {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    pages.forEach(page => {
      const rotation = page.getRotation();
      page.setRotation(PDFLib.degrees(rotation.angle + angle));
    });
    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
  }

  async extractPages(file, rangeStr) {
    // Parse range string "1-3, 5" -> [0, 1, 2, 4]
    const parts = rangeStr.split(',').map(p => p.trim());
    const indices = [];

    parts.forEach(p => {
      if (p.includes('-')) {
        const [start, end] = p.split('-').map(n => parseInt(n));
        for (let i = start; i <= end; i++) indices.push(i - 1);
      } else {
        indices.push(parseInt(p) - 1);
      }
    });

    const arrayBuffer = await file.arrayBuffer();
    const srcDoc = await PDFLib.PDFDocument.load(arrayBuffer);
    const newDoc = await PDFLib.PDFDocument.create();

    // Filter valid indices
    const pageCount = srcDoc.getPageCount();
    const validIndices = indices.filter(i => i >= 0 && i < pageCount);

    if (validIndices.length === 0) throw new Error("No valid pages selected");

    const copiedPages = await newDoc.copyPages(srcDoc, validIndices);
    copiedPages.forEach(page => newDoc.addPage(page));

    const pdfBytes = await newDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
  }
};

window.initPdfManagerLogic = PDFManagerTool;
