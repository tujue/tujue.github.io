/* TULPAR - Metadata Tool OOP Implementation */
class MetadataViewerTool extends BaseTool {
  constructor(config) {
    super(config);
    this.currentDataUrl = null;
    this.currentFile = null;
  }

  renderUI() {
    const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
    const txt = isTr ? {
      title: 'Görsel Metadata (EXIF) Merkezi',
      drop: 'Görseli bırakın veya seçmek için tıklayın',
      rec: '(JPEG/JPG önerilir)',
      edit: 'Alanları Düzenle',
      save: '💾 Kaydet & İndir',
      strip: '🧹 Tüm Verileri Temizle',
      results: 'Canlı Metadata Akışı',
      viewMap: '📍 Haritada Gör',
      copy: 'Veriyi Kopyala',
      waiting: 'Görsel taranıyor...',
      error: 'Hata:',
      noGps: 'ℹ️ GPS verisi bulunamadı',
      artist: 'Sanatçı',
      make: 'Marka',
      model: 'Model',
      date: 'Tarih',
      lat: 'Enlem',
      lng: 'Boylam',
      alt: 'Rakım'
    } : {
      title: 'Image Metadata (EXIF) Hub',
      drop: 'Drop image or click to browse',
      rec: '(JPEG/JPG recommended)',
      edit: 'Edit Information',
      save: '💾 Save & Download',
      strip: '🧹 Privacy Strip (All)',
      results: 'Live Metadata Stream',
      viewMap: '📍 View on Map',
      copy: 'Copy Data',
      waiting: 'Awaiting image stream...',
      error: 'Error:',
      noGps: 'ℹ️ No GPS meta found',
      artist: 'Artist',
      make: 'Make',
      model: 'Model',
      date: 'Date',
      lat: 'Lat',
      lng: 'Lng',
      alt: 'Alt'
    };

    return `
        <div class="tool-content meta-studio" style="max-width: 1200px; margin: 0 auto; padding: 20px;">
            <div class="grid-layout" style="display: grid; grid-template-columns: 1.25fr 1fr; gap: 2.5rem; align-items: start;">
                
                <!-- Left: Control & Edit Panel -->
                <div class="meta-control-side">
                    <div class="card" style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 16px; margin-bottom: 1.5rem;">
                        <div id="meta-dropzone" class="dropzone" style="height: 180px; border: 2px dashed var(--border-color); border-radius: 12px; display: flex; flex-direction: column; justify-content: center; align-items: center; cursor: pointer; background: rgba(0,0,0,0.1); overflow: hidden; position: relative;">
                            <div id="meta-prompt" style="text-align: center; opacity: 0.6;">
                                <div style="font-size: 2.5rem; margin-bottom: 8px;">📸</div>
                                <p style="font-size: 0.85rem;">${txt.drop}</p>
                                <p style="font-size: 0.7rem;">${txt.rec}</p>
                            </div>
                            <img id="meta-preview" style="position: absolute; inset:0; max-height: 100%; max-width: 100%; margin: auto; display: none; object-fit: contain;">
                            <input type="file" id="meta-file" hidden accept="image/jpeg,image/jpg,image/png">
                        </div>
                    </div>

                    <div id="meta-edit-panel" class="card" style="display: none; padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 16px;">
                        <h4 style="margin-bottom: 1.5rem; color: var(--primary);">${txt.edit}</h4>
                        <div class="grid-2" style="gap: 15px;">
                            <div class="form-group"><label class="form-label">${txt.artist}</label><input type="text" id="ed-artist" class="form-input" placeholder="Owner Name"></div>
                            <div class="form-group"><label class="form-label">${txt.date}</label><input type="datetime-local" id="ed-date" class="form-input"></div>
                        </div>
                        <div class="grid-2" style="gap: 15px; margin-top: 10px;">
                            <div class="form-group"><label class="form-label">${txt.make}</label><input type="text" id="ed-make" class="form-input" placeholder="Camera Maker"></div>
                            <div class="form-group"><label class="form-label">${txt.model}</label><input type="text" id="ed-model" class="form-input" placeholder="Device Model"></div>
                        </div>
                        <div class="grid-3" style="gap: 10px; margin-top: 10px; display: grid; grid-template-columns: 1fr 1fr 1fr;">
                            <div class="form-group"><label class="form-label">${txt.lat}</label><input type="number" id="ed-lat" class="form-input" step="0.000001"></div>
                            <div class="form-group"><label class="form-label">${txt.lng}</label><input type="number" id="ed-lng" class="form-input" step="0.000001"></div>
                            <div class="form-group"><label class="form-label">${txt.alt}</label><input type="number" id="ed-alt" class="form-input"></div>
                        </div>
                        
                        <button id="meta-btn-save" class="btn btn-primary" style="width: 100%; height: 3.5rem; margin-top: 1.5rem; font-weight: 700;">${txt.save}</button>
                        <button id="meta-btn-strip" class="btn btn-outline" style="width: 100%; margin-top: 1rem; color: var(--danger); border-color: rgba(239, 68, 68, 0.3);">${txt.strip}</button>
                    </div>
                </div>

                <!-- Right: Data Stream -->
                <div class="meta-stream-side">
                    <div class="card" style="padding: 1.5rem; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 16px; min-height: 600px; display: flex; flex-direction: column;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                            <h4 style="margin: 0; font-size: 0.85rem; text-transform: uppercase; color: var(--text-secondary);">${txt.results}</h4>
                            <div style="display: flex; gap: 8px;">
                                <button id="meta-btn-map" class="btn btn-sm" style="display: none; background: #4285f4; border: none; color: white;">${txt.viewMap}</button>
                                <button id="meta-btn-copy" class="btn btn-sm btn-outline">📋 ${txt.copy}</button>
                            </div>
                        </div>
                        <div id="meta-output" style="flex: 1; min-height: 480px; overflow-y: auto; background: rgba(0,0,0,0.1); border-radius: 8px; padding: 1.5rem; font-family: var(--font-mono); font-size: 0.8rem; line-height: 1.6;">
                            <div style="padding: 4rem; text-align: center; opacity: 0.3;">Awaiting image stream...</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
  }

  setupListeners() {
    const dropzone = document.getElementById('meta-dropzone');
    const fileIn = document.getElementById('meta-file');
    const preview = document.getElementById('meta-preview');
    const prompt = document.getElementById('meta-prompt');
    const editPanel = document.getElementById('meta-edit-panel');
    const output = document.getElementById('meta-output');
    const mapBtn = document.getElementById('meta-btn-map');

    dropzone.onclick = () => fileIn.click();

    fileIn.onchange = (e) => {
      const file = e.target.files[0];
      if (file) this._handleFile(file);
    };

    document.getElementById('meta-btn-save').onclick = async () => {
      if (!this.currentDataUrl) return;
      const btn = document.getElementById('meta-btn-save');
      btn.disabled = true;
      btn.textContent = '🛰️ Encoding...';
      try {
        const edits = {
          artist: document.getElementById('ed-artist').value,
          make: document.getElementById('ed-make').value,
          model: document.getElementById('ed-model').value,
          latitude: document.getElementById('ed-lat').value,
          longitude: document.getElementById('ed-lng').value,
          altitude: document.getElementById('ed-alt').value,
          // DateTime format fix might be needed depending on lib
        };
        const newUrl = await window.DevTools.metadataTools.update(this.currentDataUrl, edits);
        this._download(newUrl, `edited_${this.currentFile.name}`);
      } catch (err) { this.showNotification(err.message, 'error'); }
      finally { btn.disabled = false; btn.textContent = '💾 Save & Download'; }
    };

    document.getElementById('meta-btn-strip').onclick = async () => {
      if (!this.currentFile) return;
      const btn = document.getElementById('meta-btn-strip');
      btn.disabled = true;
      try {
        const cleanUrl = await window.DevTools.metadataTools.strip(this.currentFile);
        this._download(cleanUrl, `stripped_${this.currentFile.name}`);
      } catch (err) { this.showNotification(err.message, 'error'); }
      finally { btn.disabled = false; }
    };

    document.getElementById('meta-btn-copy').onclick = () => this.copyToClipboard(output.innerText);
  }

  async _handleFile(file) {
    this.currentFile = file;
    const output = document.getElementById('meta-output');
    // We need to access txt. waiting ... but txt is inside renderUI, unavailable here.
    // Hack: use data attribute or just hardcode tr/en check here too?
    // Better: Helper method for translation or pass txt to construct?
    // Let's do simple check.
    const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
    output.innerHTML = `<div style="padding: 4rem; text-align: center;">🔍 ${isTr ? 'Görsel taranıyor...' : 'Scanning Image...'}</div>`;

    const reader = new FileReader();
    reader.onload = async (e) => {
      this.currentDataUrl = e.target.result;
      document.getElementById('meta-preview').src = this.currentDataUrl;
      document.getElementById('meta-preview').style.display = 'block';
      document.getElementById('meta-prompt').style.display = 'none';
      document.getElementById('meta-edit-panel').style.display = 'block';

      try {
        const results = await window.DevTools.metadataTools.read(file);
        this._renderResults(results);
      } catch (err) {
        output.innerHTML = `<div style="color:var(--danger); padding:2rem;">Error: ${err.message}</div>`;
      }
    };
    reader.readAsDataURL(file);
  }

  _renderResults(data) {
    const output = document.getElementById('meta-output');
    const mapBtn = document.getElementById('meta-btn-map');

    let html = '';
    if (data.gps) {
      mapBtn.style.display = 'block';
      mapBtn.onclick = () => window.open(`https://www.google.com/maps?q=${data.gps.lat},${data.gps.lng}`, '_blank');
      html += `<div class="card" style="padding:1rem; background:rgba(66,133,244,0.1); border:1px solid #4285f4; margin-bottom:1rem; border-radius:8px;">📍 GPS Found: ${data.gps.lat}, ${data.gps.lng}</div>`;

      document.getElementById('ed-lat').value = parseFloat(data.gps.lat).toFixed(6);
      document.getElementById('ed-lng').value = parseFloat(data.gps.lng).toFixed(6);
    } else {
      mapBtn.style.display = 'none';
      const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
      html += `<div style="padding:0.5rem; font-size:0.75rem; opacity:0.5; margin-bottom:1rem;">${isTr ? 'ℹ️ GPS verisi bulunamadı' : 'ℹ️ No GPS meta found'}</div>`;
    }

    html += `<table style="width:100%; font-size:0.75rem; border-collapse:collapse;">`;
    Object.entries(data.flat).forEach(([k, v]) => {
      html += `<tr style="border-bottom:1px solid rgba(255,255,255,0.05);"><td style="padding:6px; color:var(--primary); font-weight:700;">${k}</td><td style="padding:6px; word-break:break-all;">${v}</td></tr>`;
    });
    html += `</table>`;
    output.innerHTML = html;

    // Populate fields
    const g = data.groups;
    if (g.exif) {
      if (g.exif.Artist) document.getElementById('ed-artist').value = g.exif.Artist.description;
      if (g.exif.Make) document.getElementById('ed-make').value = g.exif.Make.description;
      if (g.exif.Model) document.getElementById('ed-model').value = g.exif.Model.description;
      // Date parsing could be complex, omitting for now or using simple desc
    }
  }

  _download(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  }
}

// Register tool
window.initMetadataToolLogic = MetadataViewerTool;
