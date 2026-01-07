/* TULPAR - Hash Generator Tool OOP Implementation */
class HashGeneratorTool extends BaseTool {
  constructor(config) {
    super(config);
    this.currentMode = 'text';
    this.currentFile = null;
  }

  renderUI() {
    const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
    const txt = isTr ? {
      modes: { text: '📝 Metin', file: '📁 Dosya', hmac: '🔐 HMAC' },
      config: 'Yapılandırma',
      inputText: 'Giriş Metni',
      placeholder: 'Hashlenecek metni girin...',
      chooseFile: 'Dosya Seç',
      msg: 'Mesaj',
      key: 'Gizli Anahtar',
      generate: 'Oluştur ⚡',
      results: 'Hash Sonuçları',
      copy: 'Kopyala',
      compareHash: '🔍 Hash Karşılaştır'
    } : {
      modes: { text: '📝 Text', file: '📁 File', hmac: '🔐 HMAC' },
      config: 'Configuration',
      inputText: 'Input Text',
      placeholder: 'Enter text to hash...',
      chooseFile: 'Choose File',
      msg: 'Message',
      key: 'Secret Key',
      generate: 'Generate ⚡',
      results: 'Hash Results',
      copy: 'Copy',
      compareHash: '🔍 Compare Hash'
    };

    const hashTypes = ['SHA-256', 'SHA-512', 'SHA-1', 'SHA-384'];

    return `
        <div class="tool-content" style="max-width: 1000px; margin: 0 auto; padding: 20px;">
            <div class="grid-layout" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                <!-- Control Region -->
                <div class="card" style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 12px;">
                    <h4 style="margin-bottom: 1.5rem; color: var(--primary);">${txt.config}</h4>
                    
                    <div class="btn-group mb-4" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
                        ${Object.entries(txt.modes).map(([m, label]) => `
                            <button id="hash-mode-${m}" class="btn btn-secondary btn-sm">${label}</button>
                        `).join('')}
                    </div>

                    <div id="hash-text-panel">
                        <div class="form-group">
                            <label class="form-label">${txt.inputText}</label>
                            <textarea id="hash-text-input" class="form-input" style="height: 120px;" placeholder="${txt.placeholder}"></textarea>
                        </div>
                    </div>

                    <div id="hash-file-panel" style="display: none;">
                        <div class="form-group">
                            <label class="form-label">${txt.chooseFile}</label>
                            <div id="hash-file-drop" style="border: 2px dashed var(--border-color); padding: 2rem; text-align: center; border-radius: 12px; cursor: pointer; background: rgba(0,0,0,0.1);">
                                <div style="font-size: 2rem; margin-bottom: 10px;">📄</div>
                                <div id="hash-file-name" style="font-size: 0.9rem; opacity: 0.7;">Click or drag file</div>
                                <input type="file" id="hash-file-input" style="display: none;">
                            </div>
                        </div>
                    </div>

                    <div id="hash-hmac-panel" style="display: none;">
                        <div class="form-group">
                            <label class="form-label">${txt.msg}</label>
                            <textarea id="hash-hmac-msg" class="form-input" style="height: 80px;"></textarea>
                        </div>
                        <div class="form-group">
                            <label class="form-label">${txt.key}</label>
                            <input type="text" id="hash-hmac-key" class="form-input" placeholder="Secret key...">
                        </div>
                    </div>

                    <button id="hash-gen-btn" class="btn btn-primary" style="width: 100%; height: 3.5rem; font-weight: 700; margin-top: 1rem;">${txt.generate}</button>
                </div>

                <!-- Results Region -->
                <div class="results-region">
                    <div class="card" style="padding: 1.5rem; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 12px; height: 100%;">
                        <h4 style="margin-bottom: 1.5rem; color: var(--text-secondary); font-size: 0.85rem; text-transform: uppercase;">${txt.results}</h4>
                        <div style="display: grid; gap: 1rem;">
                            ${['MD5', 'SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'].map(type => `
                                <div class="hash-item" style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px; border: 1px solid var(--border-color);">
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                        <span style="font-size: 0.75rem; font-weight: 700; color: var(--primary);">${type}</span>
                                        <button class="btn btn-sm btn-outline hash-copy-btn" data-target="hash-val-${type.toLowerCase()}" style="font-size: 0.7rem; padding: 2px 8px;">${txt.copy}</button>
                                    </div>
                                    <div id="hash-val-${type.toLowerCase()}" style="font-family: var(--font-mono); font-size: 0.85rem; word-break: break-all; color: var(--text-primary); opacity: 0.9;">-</div>
                                </div>
                            `).join('')}
                            <div class="hash-item" style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px; border: 1px solid var(--border-color);">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                    <span style="font-size: 0.75rem; font-weight: 700; color: var(--secondary);">Base64</span>
                                    <button class="btn btn-sm btn-outline hash-copy-btn" data-target="hash-val-base64" style="font-size: 0.7rem; padding: 2px 8px;">${txt.copy}</button>
                                </div>
                                <div id="hash-val-base64" style="font-family: var(--font-mono); font-size: 0.85rem; word-break: break-all; color: var(--text-primary); opacity: 0.9;">-</div>
                            </div>
                        </div>

                        <div style="margin-top: 2rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
                            <label class="form-label" style="display: flex; justify-content: space-between;">
                                <span>${txt.compareHash}</span>
                                <span id="hash-compare-status"></span>
                            </label>
                            <input type="text" id="hash-compare-input" class="form-input" placeholder="Paste verification hash here..." style="font-family: var(--font-mono);">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
  }

  setupListeners() {
    const panels = {
      text: document.getElementById('hash-text-panel'),
      file: document.getElementById('hash-file-panel'),
      hmac: document.getElementById('hash-hmac-panel')
    };

    const modeBtn = (m) => document.getElementById(`hash-mode-${m}`);

    const setMode = (mode) => {
      this.currentMode = mode;
      Object.entries(panels).forEach(([m, p]) => {
        p.style.display = m === mode ? 'block' : 'none';
        const btn = modeBtn(m);
        if (m === mode) btn.classList.replace('btn-secondary', 'btn-primary');
        else btn.classList.replace('btn-primary', 'btn-secondary');
      });
    };

    ['text', 'file', 'hmac'].forEach(m => modeBtn(m).onclick = () => setMode(m));

    // File handling
    const fileDrop = document.getElementById('hash-file-drop');
    const fileInput = document.getElementById('hash-file-input');
    const fileName = document.getElementById('hash-file-name');

    fileDrop.onclick = () => fileInput.click();
    fileInput.onchange = (e) => {
      if (e.target.files[0]) {
        this.currentFile = e.target.files[0];
        fileName.textContent = `${this.currentFile.name} (${(this.currentFile.size / 1024).toFixed(1)} KB)`;
        this.generate();
      }
    };

    document.getElementById('hash-gen-btn').onclick = () => this.generate();

    document.querySelectorAll('.hash-copy-btn').forEach(btn => {
      btn.onclick = () => this.copyToClipboard(document.getElementById(btn.dataset.target).textContent);
    });

    // Real-time for text
    document.getElementById('hash-text-input').oninput = () => {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => this.generate(), 500);
    };

    setMode('text');
  }

  async generate() {
    const hashTypes = ['MD5', 'SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];
    const updateUI = (results, base64) => {
      Object.entries(results).forEach(([type, val]) => {
        const el = document.getElementById(`hash-val-${type.toLowerCase()}`);
        if (el) el.textContent = val;
      });
      const b64El = document.getElementById('hash-val-base64');
      if (b64El) b64El.textContent = base64 || '-';
    };

    // Show loading state
    hashTypes.forEach(type => {
      const el = document.getElementById(`hash-val-${type.toLowerCase()}`);
      if (el) el.textContent = '⏳ Calculating...';
    });

    const compareInput = document.getElementById('hash-compare-input');

    // Auto-compare logic
    const checkMatch = () => {
      const needle = compareInput.value.trim().toLowerCase();
      const status = document.getElementById('hash-compare-status');

      if (!needle) {
        status.textContent = '';
        status.className = '';
        // Reset colors
        hashTypes.forEach(t => document.getElementById(`hash-val-${t.toLowerCase()}`).style.color = 'var(--text-primary)');
        return;
      }

      let matchFound = false;
      hashTypes.forEach(type => {
        const el = document.getElementById(`hash-val-${type.toLowerCase()}`);
        const val = el.textContent.trim().toLowerCase();

        if (val === needle) {
          matchFound = true;
          el.style.color = '#10b981'; // Success Green
          el.style.fontWeight = 'bold';
          status.innerHTML = `<span style="color:#10b981; font-weight:bold;">✅ MATCH FOUND (${type})</span>`;
        } else {
          el.style.color = 'var(--text-primary)';
        }
      });

      if (!matchFound) {
        status.innerHTML = `<span style="color:#ef4444; font-weight:bold;">❌ NO MATCH</span>`;
      }
    };

    compareInput.oninput = checkMatch;

    try {
      if (this.currentMode === 'text') {
        const text = document.getElementById('hash-text-input').value;
        if (!text) { updateUI({}, '-'); return; } // Clear if empty
        const results = {};
        for (let type of hashTypes) {
          if (type === 'MD5') results[type] = this._md5(text);
          else results[type] = await this._hashString(text, type);
        }
        updateUI(results, btoa(text));
        checkMatch(); // Re-check after generation
      } else if (this.currentMode === 'file') {
        if (!this.currentFile) { this.showNotification('Please select a file', 'warning'); return; }
        const results = {};
        for (let type of hashTypes) {
          if (type === 'MD5') results[type] = 'MD5 (JS) not efficient for large files';
          else results[type] = await this._hashFile(this.currentFile, type);
        }
        updateUI(results, "Base64 skipped for file");
        checkMatch(); // Re-check after generation
      } else if (this.currentMode === 'hmac') {
        const msg = document.getElementById('hash-hmac-msg').value;
        const key = document.getElementById('hash-hmac-key').value;
        if (!msg || !key) return;
        const result = await this._hmac(msg, key, 'SHA-256');
        // Clear others
        hashTypes.forEach(t => {
          const el = document.getElementById(`hash-val-${t.toLowerCase()}`);
          if (el) el.textContent = 'N/A';
        });
        // Set only SHA-256 for now as demo
        document.getElementById('hash-val-sha-256').textContent = result;
        checkMatch();
      }
    } catch (e) {
      console.error("Hash Gen Error:", e);
      this.showNotification('Error generating hash: ' + e.message, 'error');
      hashTypes.forEach(type => {
        const el = document.getElementById(`hash-val-${type.toLowerCase()}`);
        if (el) el.textContent = 'Error';
      });
    }
  }

  async _hashString(str, algo) {
    const buf = await crypto.subtle.digest(algo, new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async _hashFile(file, algo) {
    const buf = await file.arrayBuffer();
    const hashBuf = await crypto.subtle.digest(algo, buf);
    return Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async _hmac(message, key, algo) {
    const enc = new TextEncoder();
    const keyBuf = enc.encode(key);
    const msgBuf = enc.encode(message);
    const cryptoKey = await crypto.subtle.importKey("raw", keyBuf, { name: "HMAC", hash: algo }, false, ["sign"]);
    const sig = await crypto.subtle.sign("HMAC", cryptoKey, msgBuf);
    return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Simple MD5 implementation for text (non-file)
  _md5(string) {
    function RotateLeft(lValue, iShiftBits) { return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits)); }
    function AddUnsigned(lX, lY) {
      var lX4, lY4, lX8, lY8, lResult;
      lX8 = (lX & 0x80000000); lY8 = (lY & 0x80000000);
      lX4 = (lX & 0x40000000); lY4 = (lY & 0x40000000);
      lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
      if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
      if (lX4 | lY4) { if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8); else return (lResult ^ 0x40000000 ^ lX8 ^ lY8); }
      else return (lResult ^ lX8 ^ lY8);
    }
    function F(x, y, z) { return (x & y) | ((~x) & z); }
    function G(x, y, z) { return (x & z) | (y & (~z)); }
    function H(x, y, z) { return (x ^ y ^ z); }
    function I(x, y, z) { return (y ^ (x | (~z))); }
    function FF(a, b, c, d, x, s, ac) { a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac)); return AddUnsigned(RotateLeft(a, s), b); };
    function GG(a, b, c, d, x, s, ac) { a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac)); return AddUnsigned(RotateLeft(a, s), b); };
    function HH(a, b, c, d, x, s, ac) { a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac)); return AddUnsigned(RotateLeft(a, s), b); };
    function II(a, b, c, d, x, s, ac) { a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac)); return AddUnsigned(RotateLeft(a, s), b); };
    function ConvertToWordArray(string) {
      var lWordCount;
      var lMessageLength = string.length;
      var lNumberOfWords_temp1 = lMessageLength + 8;
      var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
      var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
      var lWordArray = Array(lNumberOfWords - 1);
      var lBytePosition = 0;
      var lByteCount = 0;
      while (lByteCount < lMessageLength) {
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
        lByteCount++;
      }
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
      lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
      lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
      return lWordArray;
    };
    function WordToHex(lValue) {
      var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
      for (lCount = 0; lCount <= 3; lCount++) {
        lByte = (lValue >>> (lCount * 8)) & 255;
        WordToHexValue_temp = "0" + lByte.toString(16);
        WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
      }
      return WordToHexValue;
    };
    var x = ConvertToWordArray(string);
    var k, AA, BB, CC, DD, a, b, c, d;
    var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
    var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
    var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
    var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
    for (k = 0; k < x.length; k += 16) {
      AA = a; BB = b; CC = c; DD = d;
      a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
      d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
      c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
      b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
      a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
      d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
      c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
      b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
      a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
      d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
      c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
      b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
      a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
      d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
      c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
      b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
      a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
      d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
      c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
      b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
      a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
      d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
      c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
      b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
      a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
      d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
      c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
      b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
      a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
      d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
      c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
      b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
      a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
      d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
      c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
      b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
      a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
      d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
      c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
      b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
      a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
      d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
      c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
      b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
      a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
      d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
      c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
      b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
      a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
      d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
      c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
      b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
      a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
      d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
      c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
      b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
      a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
      d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
      c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
      b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
      a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
      d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
      c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
      b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
      a = AddUnsigned(a, AA); b = AddUnsigned(b, BB); c = AddUnsigned(c, CC); d = AddUnsigned(d, DD);
    }
    return (WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d)).toLowerCase();
  }
}

// Register tool
window.initHashGeneratorLogic = HashGeneratorTool;
