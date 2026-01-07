/* TULPAR - Htpasswd Generator Tool OOP Implementation */
class HtpasswdGeneratorTool extends BaseTool {
  constructor(config) {
    super(config);
  }

  renderUI() {
    const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
    const txt = isTr ? {
      title: 'Apache Htpasswd Oluşturucu',
      user: 'Kullanıcı Adı',
      pass: 'Şifre',
      method: 'Şifreleme Algoritması',
      generate: '🔐 htpasswd Oluştur',
      copy: 'Kopyala',
      placeholder: 'admin',
      resultPlace: 'Oluşturmak için butona basın...'
    } : {
      title: 'Apache Htpasswd Generator',
      user: 'Username',
      pass: 'Password',
      method: 'Hash Algorithm',
      generate: '🔐 Generate htpasswd',
      copy: 'Copy Result',
      placeholder: 'admin',
      resultPlace: 'Click generate to create entry...'
    };

    return `
        <div class="tool-content htpasswd-studio" style="max-width: 650px; margin: 0 auto; padding: 20px;">
            <div class="card" style="padding: 2rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 20px;">
                <h4 style="margin-bottom: 2rem; color: var(--primary); text-transform: uppercase; font-size: 0.85rem; text-align: center; letter-spacing: 1px;">${txt.title}</h4>
                
                <div class="form-group">
                    <label class="form-label">${txt.user}</label>
                    <input type="text" id="ht-user" class="form-input" placeholder="${txt.placeholder}" value="admin">
                </div>

                <div class="form-group">
                    <label class="form-label">${txt.pass}</label>
                    <div style="position: relative;">
                        <input type="password" id="ht-pass" class="form-input" placeholder="••••••••">
                        <button id="ht-toggle-pass" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; opacity: 0.5;">👁️</button>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">${txt.method}</label>
                    <select id="ht-method" class="form-select">
                        <option value="bcrypt">Bcrypt (Modern, Secure)</option>
                        <option value="sha1">SHA-1 (Legacy Apache/Nginx)</option>
                        <option value="md5">MD5 (Apache Specific)</option>
                        <option value="crypt">Plaintext/Crypt (Not secure)</option>
                    </select>
                </div>

                <button id="ht-btn-run" class="btn btn-primary" style="width: 100%; height: 3.5rem; font-weight: 700; margin-top: 1rem;">${txt.generate}</button>

                <div style="margin-top: 2rem; position: relative;">
                    <div id="ht-out" style="padding: 1.5rem; background: rgba(0,0,0,0.2); border: 1px dashed var(--border-color); border-radius: 12px; font-family: var(--font-mono); font-size: 0.95rem; min-height: 80px; display: flex; align-items: center; word-break: break-all; color: var(--primary);">${txt.resultPlace}</div>
                    <button id="ht-btn-copy" class="btn btn-sm btn-outline" style="position: absolute; top: -10px; right: 0; font-size: 0.7rem;">${txt.copy}</button>
                </div>
            </div>
        </div>
        `;
  }

  setupListeners() {
    const userIn = document.getElementById('ht-user');
    const passIn = document.getElementById('ht-pass');
    const methodIn = document.getElementById('ht-method');
    const btnRun = document.getElementById('ht-btn-run');
    const btnCopy = document.getElementById('ht-btn-copy');
    const btnToggle = document.getElementById('ht-toggle-pass');
    const out = document.getElementById('ht-out');

    btnToggle.onclick = () => {
      const hidden = passIn.type === 'password';
      passIn.type = hidden ? 'text' : 'password';
      btnToggle.textContent = hidden ? '🙈' : '👁️';
    };

    btnRun.onclick = async () => {
      const user = userIn.value.trim();
      const pass = passIn.value;

      if (!user || !pass) {
        this.showNotification('Username and password are required', 'error');
        return;
      }

      btnRun.disabled = true;
      btnRun.textContent = '⏳ Processing...';

      try {
        const result = await window.DevTools.htpasswdTools.generate(user, pass, methodIn.value);
        out.textContent = result;
        this.showNotification('Hash generated successfully!', 'success');
      } catch (err) {
        this.showNotification(err.message, 'error');
      } finally {
        btnRun.disabled = false;
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        btnRun.textContent = isTr ? '🔐 htpasswd Oluştur' : '🔐 Generate htpasswd';
      }
    };

    btnCopy.onclick = () => {
      if (out.textContent.includes('...')) return;
      this.copyToClipboard(out.textContent);
    };
  }
}

// Register tool
window.initHtpasswdGeneratorLogic = HtpasswdGeneratorTool;
