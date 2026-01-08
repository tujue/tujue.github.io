/* TULPAR - Cron Builder Tool OOP Implementation */
class CronBuilderTool extends BaseTool {
  constructor(config) {
    super(config);
  }

  renderUI() {
    const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
    const txt = isTr ? {
      title: 'Profesyonel Cron Oluşturucu',
      presets: 'Hızlı Şablonlar',
      expr: 'Cron İfadesi',
      desc: 'Anlamlı Açıklama',
      next: 'Gelecek Çalışma Zamanları',
      copy: 'İfadeyi Kopyala',
      choose: 'Bir şablon seçin...',
      tabVis: 'Görsel Mod',
      tabExp: 'Gelişmiş Mod',
      labels: { min: 'Dakika', hour: 'Saat', dom: 'Ayın Günü', mon: 'Ay', dow: 'Haftanın Günü' },
      opts: {
        min: { any: 'Her Dakika (*)', five: 'Her 5 dk. (*/5)', fifteen: 'Her 15 dk. (*/15)', zero: 'Saat Başlarında (0)', thirty: 'Buçuklarda (30)' },
        hour: { any: 'Her Saat (*)', zero: 'Gece Yarısı (0)', eight: 'Sabah Mesai (8)', noon: 'Öğle (12)', six: 'Akşam (18)' },
        dom: { any: 'Her Gün (*)', one: 'Ayın 1. Günü', fifteen: 'Ayın Ortası (15)' },
        mon: { any: 'Her Ay (*)', jan: 'Ocak (1)', jun: 'Haziran (6)', dec: 'Aralık (12)' },
        dow: { any: 'Her Gün (*)', mon: 'Pazartesi (1)', fri: 'Cuma (5)', sun: 'Pazar (0)' }
      }
    } : {
      title: 'Professional Cron Builder',
      presets: 'Smart Presets',
      expr: 'Cron Expression',
      desc: 'Human Readable Description',
      next: 'Next Scheduled Runs',
      copy: 'Copy Expression',
      choose: 'Select a preset...',
      tabVis: 'Visual Mode',
      tabExp: 'Expression Mode',
      labels: { min: 'Minutes', hour: 'Hours', dom: 'Day of Month', mon: 'Month', dow: 'Day of Week' },
      opts: {
        min: { any: 'Every Minute (*)', five: 'Every 5 mins (*/5)', fifteen: 'Every 15 mins (*/15)', zero: 'At min 0', thirty: 'At min 30' },
        hour: { any: 'Every Hour (*)', zero: 'Midnight (0)', eight: '8 AM', noon: 'Noon (12)', six: '6 PM' },
        dom: { any: 'Every Day (*)', one: '1st of Month', fifteen: '15th of Month' },
        mon: { any: 'Every Month (*)', jan: 'January', jun: 'June', dec: 'December' },
        dow: { any: 'Every Day (*)', mon: 'Monday', fri: 'Friday', sun: 'Sunday' }
      }
    };

    const presets = [
      { v: '* * * * *', n: isTr ? 'Her dakika' : 'Every minute' },
      { v: '*/5 * * * *', n: isTr ? 'Her 5 dakikada bir' : 'Every 5 minutes' },
      { v: '0 * * * *', n: isTr ? 'Her saat başı' : 'Every hour' },
      { v: '0 0 * * *', n: isTr ? 'Her gün gece yarısı' : 'Daily at midnight' },
      { v: '0 0 * * 0', n: isTr ? 'Pazar günleri gece yarısı' : 'Weekly (Sunday)' },
      { v: '0 0 1 * *', n: isTr ? 'Her ayın başında' : 'Monthly (1st day)' }
    ];

    return `
        <div class="tool-content cron-studio" style="max-width: 900px; margin: 0 auto; padding: 20px;">
            <div class="grid-layout" style="display: grid; grid-template-columns: 320px 1fr; gap: 2.5rem;">
                
                <!-- Left: Presets & Input -->
                <div class="cron-sidebar">
                    <div class="card" style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 20px;">
                        <h4 style="margin-bottom: 1.5rem; color: var(--primary); text-transform: uppercase; font-size: 0.85rem;">${txt.title}</h4>
                        
                        <div class="btn-group" style="width: 100%; margin-bottom: 1.5rem;">
                             <button id="cron-tab-vis" class="btn btn-sm btn-primary" style="flex:1;">${txt.tabVis}</button>
                             <button id="cron-tab-exp" class="btn btn-sm btn-outline" style="flex:1;">${txt.tabExp}</button>
                        </div>

                        <!-- Visual Mode -->
                        <div id="cron-pnl-vis">
                            <div class="form-group"><label class="form-label">${txt.labels.min}</label><select id="cron-v-min" class="form-select"><option value="*">${txt.opts.min.any}</option><option value="*/5">${txt.opts.min.five}</option><option value="*/15">${txt.opts.min.fifteen}</option><option value="0">${txt.opts.min.zero}</option><option value="30">${txt.opts.min.thirty}</option></select></div>
                            <div class="form-group"><label class="form-label">${txt.labels.hour}</label><select id="cron-v-hour" class="form-select"><option value="*">${txt.opts.hour.any}</option><option value="0">${txt.opts.hour.zero}</option><option value="8">${txt.opts.hour.eight}</option><option value="12">${txt.opts.hour.noon}</option><option value="18">${txt.opts.hour.six}</option></select></div>
                            <div class="form-group"><label class="form-label">${txt.labels.dom}</label><select id="cron-v-dom" class="form-select"><option value="*">${txt.opts.dom.any}</option><option value="1">${txt.opts.dom.one}</option><option value="15">${txt.opts.dom.fifteen}</option></select></div>
                            <div class="form-group"><label class="form-label">${txt.labels.mon}</label><select id="cron-v-mon" class="form-select"><option value="*">${txt.opts.mon.any}</option><option value="1">${txt.opts.mon.jan}</option><option value="6">${txt.opts.mon.jun}</option><option value="12">${txt.opts.mon.dec}</option></select></div>
                            <div class="form-group"><label class="form-label">${txt.labels.dow}</label><select id="cron-v-dow" class="form-select"><option value="*">${txt.opts.dow.any}</option><option value="1">${txt.opts.dow.mon}</option><option value="5">${txt.opts.dow.fri}</option><option value="0">${txt.opts.dow.sun}</option></select></div>
                        </div>

                        <!-- Expression Mode -->
                        <div id="cron-pnl-exp" style="display: none;">
                            <div class="form-group">
                                <label class="form-label">${txt.presets}</label>
                                <select id="cron-in-pre" class="form-select">
                                    <option value="">${txt.choose}</option>
                                    ${presets.map(p => `<option value="${p.v}">${p.n}</option>`).join('')}
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">${txt.expr}</label>
                                <input type="text" id="cron-in-exp" class="form-input" value="*/5 * * * *" style="font-family: var(--font-mono); font-size: 1.2rem; letter-spacing: 2px; text-align: center; color: var(--primary); font-weight: 700;">
                            </div>
                        </div>
                        
                        <!-- Combined Result Display for Visual Mode -->
                        <div id="cron-res-disp" style="margin-top: 1rem; padding: 10px; background: rgba(0,0,0,0.2); border-radius: 8px; text-align: center; font-family: var(--font-mono); font-size: 1.1rem; color: var(--primary); font-weight: 700;">
                           */5 * * * *
                        </div>

                        <button id="cron-btn-copy" class="btn btn-primary" style="width: 100%; margin-top: 1rem; font-weight: 700;">${txt.copy}</button>
                    </div>
                </div>

                <!-- Right: Analysis -->
                <div class="cron-main">
                    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                        <div class="card" style="padding: 1.5rem; background: var(--bg-primary); border-left: 4px solid var(--primary); border-radius: 12px;">
                            <h5 style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 10px;">${txt.desc}</h5>
                            <div id="cron-out-desc" style="font-size: 1.25rem; font-weight: 600;"></div>
                        </div>

                        <div class="card" style="padding: 1.5rem; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 16px;">
                            <h5 style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 1.5rem;">${txt.next}</h5>
                            <div id="cron-out-runs" style="display: flex; flex-direction: column; gap: 10px;"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
  }

  setupListeners() {
    const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
    const inPre = document.getElementById('cron-in-pre');
    const inExp = document.getElementById('cron-in-exp');
    const outDesc = document.getElementById('cron-out-desc');
    const outRuns = document.getElementById('cron-out-runs');
    const btnCopy = document.getElementById('cron-btn-copy');
    const resDisp = document.getElementById('cron-res-disp');

    const tabVis = document.getElementById('cron-tab-vis');
    const tabExp = document.getElementById('cron-tab-exp');
    const pnlVis = document.getElementById('cron-pnl-vis');
    const pnlExp = document.getElementById('cron-pnl-exp');

    // Visual Inputs
    const vMin = document.getElementById('cron-v-min');
    const vHour = document.getElementById('cron-v-hour');
    const vDom = document.getElementById('cron-v-dom');
    const vMon = document.getElementById('cron-v-mon');
    const vDow = document.getElementById('cron-v-dow');

    let isVisual = true;

    tabVis.onclick = () => {
      isVisual = true;
      tabVis.classList.replace('btn-outline', 'btn-primary');
      tabExp.classList.replace('btn-primary', 'btn-outline');
      pnlVis.style.display = 'block';
      pnlExp.style.display = 'none';
      resDisp.style.display = 'block';
      processVisual();
    };

    tabExp.onclick = () => {
      isVisual = false;
      tabExp.classList.replace('btn-outline', 'btn-primary');
      tabVis.classList.replace('btn-primary', 'btn-outline');
      pnlExp.style.display = 'block';
      pnlVis.style.display = 'none';
      resDisp.style.display = 'none';
      update(inExp.value.trim());
    };

    const processVisual = () => {
      const val = `${vMin.value} ${vHour.value} ${vDom.value} ${vMon.value} ${vDow.value}`;
      resDisp.textContent = val;
      update(val);
    };

    const translateDesc = (desc) => {
      if (desc.startsWith('Runs at')) {
        if (desc.includes('invalid')) return 'Geçersiz İfade';
        return desc.replace('Runs at', 'Çalışma zamanı:').replace('past', 'geçe saat');
      }
      return desc;
    };

    const update = (val) => {
      if (!val) return;

      const res = this._parseCron(val);
      if (res.success) {
        outDesc.textContent = isTr ? translateDesc(res.description) : res.description;
        outDesc.parentElement.style.borderLeftColor = 'var(--primary)';

        const runs = this._getNextRuns(val);
        outRuns.innerHTML = runs.map(r => `
                    <div style="display: flex; align-items: center; gap: 12px; padding: 10px; background: rgba(0,0,0,0.15); border-radius: 8px; font-family: var(--font-mono); font-size: 0.9rem;">
                        <span style="color: var(--primary);">●</span>
                        <span>${r}</span>
                    </div>
                `).join('');
      } else {
        outDesc.textContent = isTr ? 'Geçersiz Cron İfadesi' : res.message;
        outDesc.parentElement.style.borderLeftColor = '#ef4444';
        outRuns.innerHTML = '<div style="opacity: 0.5;">' + (isTr ? 'Hesaplanamıyor' : 'Cannot calculate') + '</div>';
      }
    };

    inPre.onchange = () => { if (inPre.value) { inExp.value = inPre.value; update(inExp.value); } };
    inExp.oninput = () => update(inExp.value);

    [vMin, vHour, vDom, vMon, vDow].forEach(el => el.onchange = processVisual);

    btnCopy.onclick = () => {
      this.copyToClipboard(isVisual ? resDisp.textContent : inExp.value);
      const original = btnCopy.textContent;
      btnCopy.textContent = isTr ? 'Kopyalandı!' : 'Copied!';
      setTimeout(() => btnCopy.textContent = original, 1000);
    };

    // Initial
    processVisual();
  }

  // INTERNAL LOGIC (Formerly in DevTools.cronTools)

  _parseCron(expr) {
    const parts = expr.trim().split(/\s+/);
    if (parts.length < 5) return { success: false, message: "Invalid Format" };
    // Simplified logic for description
    return { success: true, description: `Runs at ${parts[1]} past ${parts[0]}...` };
  }

  _getNextRuns(expr, count = 5) {
    const runs = [];
    let now = new Date();
    for (let i = 0; i < count; i++) {
      now = new Date(now.getTime() + 5 * 60 * 1000); // Mocking future runs
      runs.push(now.toLocaleString());
    }
    return runs;
  }
}

window.initCronBuilderLogic = CronBuilderTool;
