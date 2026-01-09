/* TULPAR - Metadata Tool OOP Implementation using PiexifJS */
class MetadataViewerTool extends BaseTool {
  constructor(config) {
    super(config);
    this.currentDataUrl = null;
    this.currentFile = null;
    this.piexif = null;
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
                            <div class="form-group"><label class="form-label">${txt.date}</label><input type="text" id="ed-date" class="form-input" placeholder="YYYY:MM:DD HH:MM:SS"></div>
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

  async setupListeners() {
    // Load piexifjs
    if (typeof piexif === 'undefined') {
      try {
        await this._loadScript('https://unpkg.com/piexifjs@1.0.6/piexif.js');
        this.piexif = window.piexif;
      } catch (e) {
        console.error("Failed to load piexifjs", e);
        document.getElementById('meta-output').innerHTML = '<div style="color:red;padding:2rem;">Error: Could not load metadata library (piexifjs). Please check your connection.</div>';
        return;
      }
    } else {
      this.piexif = window.piexif;
    }

    const dropzone = document.getElementById('meta-dropzone');
    const fileIn = document.getElementById('meta-file');
    const mapBtn = document.getElementById('meta-btn-map');
    const output = document.getElementById('meta-output');

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
        const newUrl = this._updateExif();
        this._download(newUrl, `edited_${this.currentFile.name}`);
      } catch (err) {
        this.showNotification(err.message, 'error');
        console.error(err);
      }
      finally { btn.disabled = false; btn.textContent = '💾 Save & Download'; }
    };

    document.getElementById('meta-btn-strip').onclick = async () => {
      if (!this.currentDataUrl) return;
      const btn = document.getElementById('meta-btn-strip');
      btn.disabled = true;
      try {
        const cleanUrl = this.piexif.remove(this.currentDataUrl);
        this._download(cleanUrl, `stripped_${this.currentFile.name}`);
      } catch (err) { this.showNotification(err.message, 'error'); }
      finally { btn.disabled = false; }
    };

    document.getElementById('meta-btn-copy').onclick = () => this.copyToClipboard(output.innerText);
  }

  async _handleFile(file) {
    this.currentFile = file;
    const output = document.getElementById('meta-output');
    const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
    output.innerHTML = `<div style="padding: 4rem; text-align: center;">🔍 ${isTr ? 'Görsel taranıyor...' : 'Scanning Image...'}</div>`;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.currentDataUrl = e.target.result;
      document.getElementById('meta-preview').src = this.currentDataUrl;
      document.getElementById('meta-preview').style.display = 'block';
      document.getElementById('meta-prompt').style.display = 'none';
      document.getElementById('meta-edit-panel').style.display = 'block';

      const img = new Image();
      img.onload = () => {
        const basicInfo = {
          width: img.width,
          height: img.height,
          name: file.name,
          size: (file.size / 1024).toFixed(2) + ' KB',
          type: file.type
        };

        try {
          // Read Exif
          const exifObj = this.piexif.load(this.currentDataUrl);
          this._renderResults(exifObj, basicInfo);
        } catch (err) {
          // Fallback if piexif fails (e.g. for PNGs)
          this._renderResults({}, basicInfo);
        }
      };
      img.src = this.currentDataUrl;
    };
    reader.readAsDataURL(file);
  }

  _renderResults(exifData, basicInfo) {
    const output = document.getElementById('meta-output');
    const mapBtn = document.getElementById('meta-btn-map');

    // Tag Name Mappings (Common EXIF tags)
    const tagNames = {
      '271': 'Make', '272': 'Model', '274': 'Orientation', '282': 'XResolution', '283': 'YResolution',
      '296': 'ResolutionUnit', '305': 'Software', '306': 'DateTime', '315': 'Artist',
      '33432': 'Copyright', '33434': 'ExposureTime', '33437': 'FNumber', '34850': 'ExposureProgram',
      '34855': 'ISOSpeedRatings', '36867': 'DateTimeOriginal', '36868': 'DateTimeDigitized',
      '37377': 'ShutterSpeedValue', '37378': 'ApertureValue', '37380': 'ExposureBias',
      '37383': 'MeteringMode', '37385': 'Flash', '37386': 'FocalLength', '37510': 'UserComment',
      '40961': 'ColorSpace', '40962': 'PixelXDimension', '40963': 'PixelYDimension',
      '41486': 'FocalPlaneXResolution', '41487': 'FocalPlaneYResolution', '41495': 'SensingMethod',
      '256': 'ImageWidth', '257': 'ImageLength',
      '1': 'GPSLatitudeRef', '2': 'GPSLatitude', '3': 'GPSLongitudeRef', '4': 'GPSLongitude',
      '5': 'GPSAltitudeRef', '6': 'GPSAltitude', '7': 'GPSTimeStamp', '29': 'GPSDateStamp'
    };

    const groups = {
      '0th': exifData['0th'] || {},
      'Exif': exifData['Exif'] || {},
      'GPS': exifData['GPS'] || {},
      '1st': exifData['1st'] || {}
    };

    let gpsLat = null;
    let gpsLng = null;

    // Parse GPS
    if (groups.GPS && groups.GPS[this.piexif.GPSIFD.GPSLatitude] && groups.GPS[this.piexif.GPSIFD.GPSLongitude]) {
      const toDecimal = (gpsArr, ref) => {
        if (!gpsArr || gpsArr.length < 3) return 0;
        const d = gpsArr[0][0] / gpsArr[0][1];
        const m = gpsArr[1][0] / gpsArr[1][1];
        const s = gpsArr[2][0] / gpsArr[2][1];
        let res = d + m / 60 + s / 3600;
        if (ref === 'S' || ref === 'W') res = -res;
        return res;
      };

      gpsLat = toDecimal(groups.GPS[this.piexif.GPSIFD.GPSLatitude], groups.GPS[this.piexif.GPSIFD.GPSLatitudeRef]);
      gpsLng = toDecimal(groups.GPS[this.piexif.GPSIFD.GPSLongitude], groups.GPS[this.piexif.GPSIFD.GPSLongitudeRef]);
    }

    let html = '';

    // Show Basic Info always
    if (basicInfo) {
      html += `
      <div style="margin-bottom:1.5rem; padding-bottom:1rem; border-bottom:1px solid rgba(255,255,255,0.1);">
        <h5 style="color:var(--primary); margin-bottom:0.5rem; font-size:0.8rem;">📦 FILE ASSETS Info</h5>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; font-size:0.7rem;">
          <div style="opacity:0.6;">Name: <span style="color:var(--text-primary);">${basicInfo.name}</span></div>
          <div style="opacity:0.6;">Size: <span style="color:var(--text-primary);">${basicInfo.size}</span></div>
          <div style="opacity:0.6;">Resolution: <span style="color:var(--text-primary);">${basicInfo.width} x ${basicInfo.height} px</span></div>
          <div style="opacity:0.6;">Type: <span style="color:var(--text-primary);">${basicInfo.type}</span></div>
        </div>
      </div>`;
    }

    if (gpsLat != null) {
      mapBtn.style.display = 'block';
      mapBtn.onclick = () => window.open(`https://www.google.com/maps?q=${gpsLat},${gpsLng}`, '_blank');
      html += `<div class="card" style="padding:1rem; background:rgba(66,133,244,0.1); border:1px solid #4285f4; margin-bottom:1rem; border-radius:8px;">📍 GPS Found: ${gpsLat.toFixed(6)}, ${gpsLng.toFixed(6)}</div>`;

      document.getElementById('ed-lat').value = gpsLat.toFixed(6);
      document.getElementById('ed-lng').value = gpsLng.toFixed(6);
    } else {
      mapBtn.style.display = 'none';
      const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
      html += `<div style="padding:0.5rem; font-size:0.75rem; opacity:0.5; margin-bottom:1rem;">${isTr ? 'ℹ️ GPS verisi bulunamadı' : 'ℹ️ No GPS meta found'}</div>`;
    }

    // Populate common fields
    const zeroth = exifData['0th'] || {};
    const exif = exifData['Exif'] || {};

    if (zeroth[this.piexif.ImageIFD.Make]) document.getElementById('ed-make').value = zeroth[this.piexif.ImageIFD.Make];
    if (zeroth[this.piexif.ImageIFD.Model]) document.getElementById('ed-model').value = zeroth[this.piexif.ImageIFD.Model];
    if (zeroth[this.piexif.ImageIFD.Artist]) document.getElementById('ed-artist').value = zeroth[this.piexif.ImageIFD.Artist];
    if (exif[this.piexif.ExifIFD.DateTimeOriginal]) document.getElementById('ed-date').value = exif[this.piexif.ExifIFD.DateTimeOriginal];

    // Format value for display
    const formatValue = (val) => {
      if (val === null || val === undefined) return 'N/A';
      if (typeof val === 'string') return val;
      if (typeof val === 'number') return val.toString();
      if (Array.isArray(val)) {
        if (val.length === 0) return '[]';
        // Handle rational: [num, den]
        if (val.length === 2 && typeof val[0] === 'number' && typeof val[1] === 'number') {
          return val[1] === 1 ? val[0].toString() : (val[0] / val[1]).toFixed(4);
        }
        // Handle rational array: [[num, den], ...]
        if (Array.isArray(val[0]) && val[0].length === 2) {
          return val.map(v => (v[0] / v[1]).toFixed(2)).join(', ');
        }
        return JSON.stringify(val);
      }
      return String(val);
    };

    // Show metadata table
    html += `<table style="width:100%; font-size:0.75rem; border-collapse:collapse;">`;

    let totalTags = 0;
    for (let groupName in exifData) {
      if (groupName === 'thumbnail' || groupName === '0th' || groupName === 'Exif' || groupName === 'GPS' || groupName === '1st' || groupName === 'Interop') {
        const group = exifData[groupName];
        if (!group || typeof group !== 'object') continue;

        for (let tagId in group) {
          const tagName = tagNames[tagId] || `Tag-${tagId}`;
          const value = formatValue(group[tagId]);

          html += `<tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
            <td style="padding:8px; color:var(--primary); font-weight:700; white-space:nowrap;">${groupName}</td>
            <td style="padding:8px; color:#888; font-size:0.7rem;">${tagName}</td>
            <td style="padding:8px; word-break:break-all; color:var(--text-primary);">${value}</td>
          </tr>`;
          totalTags++;
        }
      }
    }

    if (totalTags === 0) {
      const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
      html += `<tr><td colspan="3" style="padding:2rem; text-align:center;">
        <div style="opacity:0.5; margin-bottom:1rem;">
          ${isTr ? '⚠️ Bu resimde detaylı EXIF metadata bulunamadı' : '⚠️ No detailed EXIF metadata found in this image'}
        </div>
        <div style="font-size:0.7rem; opacity:0.4; line-height:1.5;">
          ${isTr ? 'Not: Genel bilgiler yukarıda gösterilmiştir. Screenshot\'lar genellikle detaylı metadata içermez.' : 'Note: General info is shown above. Screenshots often don\'t contain detailed metadata.'}
        </div>
      </td></tr>`;
    }

    html += `</table>`;
    output.innerHTML = html;
  }
}



_updateExif() {
  // Create new exif obj
  const exifObj = this.piexif.load(this.currentDataUrl);
  const zeroth = exifObj['0th'] || {};
  const exif = exifObj['Exif'] || {};
  const gps = exifObj['GPS'] || {};

  // Get values
  const artist = document.getElementById('ed-artist').value;
  const make = document.getElementById('ed-make').value;
  const model = document.getElementById('ed-model').value;
  const date = document.getElementById('ed-date').value;

  if (artist) zeroth[this.piexif.ImageIFD.Artist] = artist;
  if (make) zeroth[this.piexif.ImageIFD.Make] = make;
  if (model) zeroth[this.piexif.ImageIFD.Model] = model;
  if (date) zeroth[this.piexif.ImageIFD.DateTime] = date;
  if (date) exif[this.piexif.ExifIFD.DateTimeOriginal] = date;

  // Update GPS (Simplified)
  // Converting Decimal to DMS is required for Exif
  const toDMS = (deg) => {
    const d = Math.floor(Math.abs(deg));
    const m = Math.floor((Math.abs(deg) - d) * 60);
    const s = Math.round(((Math.abs(deg) - d) * 60 - m) * 60 * 100);
    return [[d, 1], [m, 1], [s, 100]]; // rational
  };

  const lat = parseFloat(document.getElementById('ed-lat').value);
  const lng = parseFloat(document.getElementById('ed-lng').value);

  if (!isNaN(lat) && !isNaN(lng)) {
    gps[this.piexif.GPSIFD.GPSLatitudeRef] = lat < 0 ? 'S' : 'N';
    gps[this.piexif.GPSIFD.GPSLatitude] = toDMS(lat);
    gps[this.piexif.GPSIFD.GPSLongitudeRef] = lng < 0 ? 'W' : 'E';
    gps[this.piexif.GPSIFD.GPSLongitude] = toDMS(lng);
  }

  exifObj['0th'] = zeroth;
  exifObj['Exif'] = exif;
  exifObj['GPS'] = gps;

  const exifStr = this.piexif.dump(exifObj);
  const newUrl = this.piexif.insert(exifStr, this.currentDataUrl);
  return newUrl;
}

_download(url, filename) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
}

_loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}
}

// Register tool
window.initMetadataToolLogic = MetadataViewerTool;
