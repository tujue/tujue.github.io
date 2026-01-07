/* TULPAR - JWT Debugger Tool OOP Implementation */
class JWTDebuggerTool extends BaseTool {
  constructor(config) {
    super(config);
  }

  renderUI() {
    const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
    const txt = isTr ? {
      title: 'JWT Analiz Laboratuvarı',
      label: 'Kodlanmış Token (Encoded)',
      place: 'eyJhbGciOiJIUzI1Ni...',
      decode: 'Tokeni Çöz ✨',
      header: 'Başlık (Header)',
      payload: 'Veri (Payload)',
      verify: 'İmza (Signature)',
      info: 'Token Bilgileri',
      samples: 'Örneklerle Dene'
    } : {
      title: 'JWT Debugger Laboratory',
      label: 'Encoded Token',
      place: 'eyJhbGciOiJIUzI1Ni...',
      decode: 'Decode Token ✨',
      header: 'Header',
      payload: 'Payload',
      verify: 'Signature',
      info: 'Token Context',
      samples: 'Load Samples'
    };

    return `
        <div class="tool-content jwt-studio" style="max-width: 1200px; margin: 0 auto; padding: 20px;">
            <div class="grid-layout" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem;">
                
                <!-- Left: Input -->
                <div class="jwt-input-side">
                    <div class="card" style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 20px;">
                        <h4 style="margin-bottom: 1.5rem; color: var(--primary); text-transform: uppercase; font-size: 0.85rem;">${txt.title}</h4>
                        
                        <div class="form-group">
                            <label class="form-label">${txt.label}</label>
                            <textarea id="jwt-in" class="form-input" style="height: 350px; font-family: var(--font-mono); font-size: 0.8rem; border: none; background: rgba(0,0,0,0.1); border-radius: 12px; padding: 1rem; color: #fb7185;" placeholder="${txt.place}"></textarea>
                        </div>

                        <div style="display: flex; gap: 10px; margin-top: 1.5rem;">
                            <button id="jwt-btn-s1" class="btn btn-sm btn-outline" style="flex: 1; font-size: 0.7rem;">Valid Sample</button>
                            <button id="jwt-btn-s2" class="btn btn-sm btn-outline" style="flex: 1; font-size: 0.7rem;">Expired Sample</button>
                        </div>
                    </div>
                </div>

                <!-- Right: Output -->
                <div class="jwt-output-side">
                    <div class="card" style="padding: 1.5rem; background: #1a1b2e; border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; min-height: 520px; display: flex; flex-direction: column; gap: 1.5rem;">
                        
                        <div>
                            <h5 style="color: #6366f1; font-size: 0.7rem; text-transform: uppercase; margin-bottom: 0.75rem;">${txt.header}</h5>
                            <pre id="jwt-out-h" style="margin: 0; padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 8px; font-family: var(--font-mono); font-size: 0.85rem; color: #a5b4fc;"></pre>
                        </div>

                        <div>
                            <h5 style="color: #10b981; font-size: 0.7rem; text-transform: uppercase; margin-bottom: 0.75rem;">${txt.payload}</h5>
                            <pre id="jwt-out-p" style="margin: 0; padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 8px; font-family: var(--font-mono); font-size: 0.85rem; color: #34d399;"></pre>
                        </div>

                        <div id="jwt-info-box" style="padding: 1rem; border-radius: 12px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);">
                            <div style="font-size: 0.75rem; opacity: 0.5; margin-bottom: 5px;">${txt.info}</div>
                            <div id="jwt-info-txt" style="font-size: 0.85rem; font-weight: 600;"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
  }

  setupListeners() {
    const input = document.getElementById('jwt-in');
    const outH = document.getElementById('jwt-out-h');
    const outP = document.getElementById('jwt-out-p');
    const infoTxt = document.getElementById('jwt-info-txt');

    const decode = () => {
      const token = input.value.trim();
      if (!token) return;

      const result = window.DevTools.jwtTools.decode(token);
      if (!result.success) {
        outH.textContent = '// Invalid Token';
        outP.textContent = result.message;
        infoTxt.innerHTML = `<span style="color: #ef4444;">❌ Request failed</span>`;
        return;
      }

      outH.textContent = JSON.stringify(result.header, null, 2);
      outP.textContent = JSON.stringify(result.payload, null, 2);

      let html = `<div>Alg: <span style="color: var(--primary)">${result.header.alg || 'none'}</span></div>`;
      if (result.payload.exp) {
        const date = new Date(result.payload.exp * 1000).toLocaleString();
        html += `<div>Exp: ${date} ${result.isExpired ? '<span style="color: #ef4444;">(EXPIRED)</span>' : '<span style="color: #10b981;">(VALID)</span>'}</div>`;
      }
      infoTxt.innerHTML = html;
    };

    input.oninput = decode;

    const samples = window.DevTools.jwtTools.getSampleTokens();
    document.getElementById('jwt-btn-s1').onclick = () => { input.value = samples.valid.token; decode(); };
    document.getElementById('jwt-btn-s2').onclick = () => { input.value = samples.expired.token; decode(); };
  }
}

// Register tool
window.initJwtDebuggerLogic = JWTDebuggerTool;
