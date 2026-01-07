/* TULPAR - Timestamp Converter Tool OOP Implementation */
class TimestampConverterTool extends BaseTool {
  constructor(config) {
    super(config);
  }

  renderUI() {
    const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
    const txt = isTr ? {
      unixToDate: 'Zaman Damgası → Tarih',
      dateToUnix: 'Tarih → Zaman Damgası',
      now: 'Şimdi',
      today: 'Bugün Başı',
      tsLabel: 'Unix Zaman Damgası',
      dateLabel: 'Yerel Tarih/Saat',
      resIso: 'ISO 8601',
      resLocal: 'Yerel Zaman',
      resRel: 'Göreceli',
      copy: 'Kopyala'
    } : {
      unixToDate: 'Timestamp → Date',
      dateToUnix: 'Date → Timestamp',
      now: 'Now',
      today: 'Start of Day',
      tsLabel: 'Unix Timestamp',
      dateLabel: 'Local Date & Time',
      resIso: 'ISO 8601',
      resLocal: 'Local Time',
      resRel: 'Relative',
      copy: 'Copy'
    };

    return `
        <div class="tool-content" style="max-width: 900px; margin: 0 auto; padding: 20px;">
            <div class="grid-layout" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                
                <!-- Left: Timestamp to Date -->
                <div class="card" style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 12px;">
                    <h4 style="margin-bottom: 1.5rem; color: var(--primary);">${txt.unixToDate}</h4>
                    
                    <div style="display: flex; gap: 8px; margin-bottom: 1rem;">
                        <button id="ts-now" class="btn btn-secondary btn-sm" style="flex: 1;">${txt.now}</button>
                        <button id="ts-today" class="btn btn-secondary btn-sm" style="flex: 1;">${txt.today}</button>
                    </div>

                    <div class="form-group">
                        <label class="form-label">${txt.tsLabel}</label>
                        <input type="number" id="ts-val" class="form-input" style="font-size: 1.2rem; font-weight: 700;">
                    </div>

                    <div style="background: var(--bg-primary); padding: 1.2rem; border-radius: 8px; margin-top: 1.5rem; border: 1px solid var(--border-color);">
                        <div style="margin-bottom: 12px;">
                            <span style="font-size: 0.75rem; opacity: 0.5; text-transform: uppercase;">${txt.resIso}</span>
                            <div id="ts-res-iso" style="font-family: var(--font-mono); font-size: 0.95rem;">-</div>
                        </div>
                        <div style="margin-bottom: 12px;">
                            <span style="font-size: 0.75rem; opacity: 0.5; text-transform: uppercase;">${txt.resLocal}</span>
                            <div id="ts-res-local" style="font-family: var(--font-mono); font-size: 0.95rem;">-</div>
                        </div>
                        <div>
                            <span style="font-size: 0.75rem; opacity: 0.5; text-transform: uppercase;">${txt.resRel}</span>
                            <div id="ts-res-rel" style="color: var(--secondary); font-weight: 600;">-</div>
                        </div>
                    </div>
                </div>

                <!-- Right: Date to Timestamp -->
                <div class="card" style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 12px;">
                    <h4 style="margin-bottom: 1.5rem; color: var(--secondary);">${txt.dateToUnix}</h4>
                    
                    <div class="form-group">
                        <label class="form-label">${txt.dateLabel}</label>
                        <input type="datetime-local" id="date-val" class="form-input" style="height: 48px;">
                    </div>

                    <div style="background: var(--bg-primary); padding: 1.5rem; border-radius: 8px; margin-top: 1.5rem; border: 1px solid var(--border-color); text-align: center;">
                        <div style="font-size: 0.8rem; opacity: 0.6; margin-bottom: 8px;">UNIX TIMESTAMP</div>
                        <div id="date-res-ts" style="font-size: 2.2rem; font-weight: 800; font-family: var(--font-mono); color: var(--primary); word-break: break-all;">0</div>
                        <button id="copy-ts-btn" class="btn btn-primary btn-sm" style="margin-top: 1.2rem; width: 100%;">📋 ${txt.copy}</button>
                    </div>
                </div>

            </div>
        </div>
        `;
  }

  setupListeners() {
    const tsVal = document.getElementById('ts-val');
    const dateVal = document.getElementById('date-val');
    const resIso = document.getElementById('ts-res-iso');
    const resLocal = document.getElementById('ts-res-local');
    const resRel = document.getElementById('ts-res-rel');
    const dateResTs = document.getElementById('date-res-ts');

    const updateFromTs = () => {
      let val = parseInt(tsVal.value);
      if (isNaN(val)) return;

      // Auto detect millis (approx check: if > 30000000000 it is likely ms, unless far future)
      // Standard UNIX timestamp (seconds) for 2026 is ~1.7 billion (10 digits).
      // Milliseconds for 2026 is ~1.7 trillion (13 digits).
      // Cutoff: 10000000000 (11 digits, year 2286). 
      let isMs = false;
      if (Math.abs(val) > 10000000000) {
        isMs = true;
      }

      const d = new Date(isMs ? val : val * 1000);
      resIso.textContent = d.toISOString();
      resLocal.textContent = d.toLocaleString() + (isMs ? ' (Detected Milliseconds)' : ' (Detected Seconds)');
      resRel.textContent = this._getRelativeTime(d.getTime());
    };

    const updateFromDate = () => {
      const d = new Date(dateVal.value);
      if (isNaN(d.getTime())) return;
      dateResTs.textContent = Math.floor(d.getTime() / 1000);
    };

    tsVal.oninput = updateFromTs;
    dateVal.oninput = updateFromDate;

    document.getElementById('ts-now').onclick = () => {
      tsVal.value = Math.floor(Date.now() / 1000);
      updateFromTs();
    };

    document.getElementById('ts-today').onclick = () => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      tsVal.value = Math.floor(d.getTime() / 1000);
      updateFromTs();
    };

    document.getElementById('copy-ts-btn').onclick = () => this.copyToClipboard(dateResTs.textContent);

    // Init
    tsVal.value = Math.floor(Date.now() / 1000);
    updateFromTs();

    // Init date to now (local)
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    dateVal.value = new Date(now - offset).toISOString().slice(0, 16);
    updateFromDate();
  }

  _getRelativeTime(timestamp) {
    const rtf = new Intl.RelativeTimeFormat(window.i18n?.getCurrentLanguage() || 'en', { numeric: 'auto' });
    const elapsed = (timestamp - Date.now()) / 1000;

    const units = [
      { unit: 'year', seconds: 31536000 },
      { unit: 'month', seconds: 2592000 },
      { unit: 'day', seconds: 86400 },
      { unit: 'hour', seconds: 3600 },
      { unit: 'minute', seconds: 60 },
      { unit: 'second', seconds: 1 }
    ];

    for (const { unit, seconds } of units) {
      if (Math.abs(elapsed) >= seconds || unit === 'second') {
        return rtf.format(Math.round(elapsed / seconds), unit);
      }
    }
  }
}

// Register tool
window.initTimestampConverterLogic = TimestampConverterTool;
