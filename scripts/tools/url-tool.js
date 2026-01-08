/* TULPAR - URL Tool OOP Implementation */
class URLTool extends BaseTool {
    constructor(config) {
        super(config);
    }

    renderUI() {
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const txt = isTr ? {
            inputLabel: 'Giriş Metni / URL / Sorgu Dizisi',
            placeholder: 'Metin, tam URL veya sorgu dizesi girin...',
            actions: {
                encComp: 'Bileşeni Kodla', decComp: 'Bileşeni Çöz',
                encFull: 'Tam URL Kodla', decFull: 'Tam URL Çöz',
                parseUrl: 'URL Ayrıştır', parseQuery: 'Sorgu Ayrıştır'
            },
            output: 'Sonuç',
            details: 'URL Analizi',
            copy: 'Kopyala',
            tip: '<strong>İpucu:</strong> \'Bileşeni Kodla\' özel karakterleri (/ ? &) de kodlar. \'Tam URL\' ise URL yapısını bozmadan sadece güvenli olmayan karakterleri kodlar.'
        } : {
            inputLabel: 'Input Text / URL / Query String',
            placeholder: 'Enter text, full URL, or query string...',
            actions: {
                encComp: 'Encode Comp', decComp: 'Decode Comp',
                encFull: 'Encode URL', decFull: 'Decode URL',
                parseUrl: 'Parse URL', parseQuery: 'Parse Query'
            },
            output: 'Result Output',
            details: 'URL Breakdown',
            copy: 'Copy Result',
            tip: '<strong>Tip:</strong> \'Component Encode\' escapes special chars (like /, ?, &). \'Full URL\' keeps them safe. Safe chars (a-z, ., -) are never encoded.'
        };

        return `
        <div class="tool-content" style="max-width: 1000px; margin: 0 auto; padding: 20px;">
            <div class="card" style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 12px; margin-bottom: 2rem;">
                <div class="form-group">
                    <label class="form-label">${txt.inputLabel}</label>
                    <textarea id="url-input" class="form-input" style="height: 120px; font-family: var(--font-mono);" placeholder="${txt.placeholder}"></textarea>
                </div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 1rem;">
                    <button class="btn btn-secondary btn-sm url-action" data-action="encode">${txt.actions.encComp}</button>
                    <button class="btn btn-secondary btn-sm url-action" data-action="decode">${txt.actions.decComp}</button>
                    <button class="btn btn-secondary btn-sm url-action" data-action="parseURL">${txt.actions.parseUrl}</button>
                    <button class="btn btn-outline btn-sm url-action" data-action="encodeURL">${txt.actions.encFull}</button>
                    <button class="btn btn-outline btn-sm url-action" data-action="decodeURL">${txt.actions.decFull}</button>
                    <button class="btn btn-outline btn-sm url-action" data-action="parseQueryString">${txt.actions.parseQuery}</button>
                </div>
                <div style="margin-top: 15px; font-size: 0.8rem; color: var(--text-secondary); background: rgba(var(--primary-rgb), 0.05); padding: 10px; border-radius: 6px; border-left: 3px solid var(--primary);">
                    <i class="fas fa-info-circle"></i> ${txt.tip}
                </div>
            </div>

            <div class="grid-layout" style="display: grid; grid-template-columns: 1fr; gap: 2rem;">
                <div class="card" style="padding: 1.5rem; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h4 id="url-status" style="margin: 0; color: var(--text-secondary); font-size: 0.85rem; text-transform: uppercase;">${txt.output}</h4>
                        <button id="url-copy-btn" class="btn btn-sm btn-primary">📋 ${txt.copy}</button>
                    </div>
                    <pre id="url-output" style="min-height: 100px; background: rgba(0,0,0,0.2); border-radius: 8px; padding: 1.2rem; font-family: var(--font-mono); font-size: 0.95rem; color: var(--primary); white-space: pre-wrap; word-break: break-all; border: 1px solid var(--border-color);"></pre>
                </div>

                <div id="url-details-panel" class="card" style="display: none; padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 12px;">
                    <h4 style="margin-bottom: 1.2rem; color: var(--secondary);">${txt.details}</h4>
                    <div id="url-details-content"></div>
                </div>
            </div>
        </div>
        `;
    }

    setupListeners() {
        const input = document.getElementById('url-input');
        const output = document.getElementById('url-output');
        const status = document.getElementById('url-status');
        const detailsPanel = document.getElementById('url-details-panel');
        const showNotification = window.showNotification || ((msg) => alert(msg));

        const handleAction = (action) => {
            const val = input.value.trim();
            if (!val) { showNotification('Please enter input', 'error'); return; }

            let res;
            if (action === 'parseQueryString') {
                try {
                    const u = new URL(val);
                    res = this.parseURL(val); // Extract params from full URL
                } catch (e) {
                    let q = val;
                    if (q.startsWith('?')) q = q.substring(1);
                    res = this.parseQueryString(q);
                }
            } else if (typeof this[action] === 'function') {
                res = this[action](val);
            } else {
                return; // Unknown action
            }

            if (res.success) {
                if (action === 'parseURL' || (action === 'parseQueryString' && res.data && res.data.params)) {
                    if (action === 'parseURL') this._renderBreakdown(res.data);
                    else if (res.data) {
                        this._renderBreakdown({ protocol: '-', hostname: '-', pathname: '-', params: res.data || res.result }); // Fix structure
                    }
                    output.textContent = JSON.stringify(res.data || res.result, null, 2);
                } else {
                    detailsPanel.style.display = 'none';
                    output.textContent = res.result;
                }
                status.textContent = res.message;
                status.style.color = 'var(--success)';
            } else {
                output.textContent = '';
                detailsPanel.style.display = 'none';
                showNotification(res.message, 'error');
            }
        };

        document.querySelectorAll('.url-action').forEach(btn => {
            btn.onclick = () => handleAction(btn.dataset.action);
        });

        document.getElementById('url-copy-btn').onclick = () => this.copyToClipboard(output.textContent);
    }

    _renderBreakdown(data) {
        const panel = document.getElementById('url-details-panel');
        const content = document.getElementById('url-details-content');
        const params = data.params || data; // Handle direct params object

        let html = `
            <div style="display: grid; grid-template-columns: 100px 1fr; gap: 10px; font-size: 0.9rem;">
                <span style="opacity: 0.5;">Protocol:</span><strong style="color: var(--primary);">${data.protocol || '-'}</strong>
                <span style="opacity: 0.5;">Hostname:</span><strong>${data.hostname || '-'}</strong>
                <span style="opacity: 0.5;">Path:</span><strong style="color: var(--secondary);">${data.pathname || '-'}</strong>
            </div>
        `;

        if (Object.keys(params).length > 0) {
            html += `<div style="margin-top: 1.5rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
                <div style="font-size: 0.8rem; opacity: 0.5; margin-bottom: 8px;">QUERY PARAMETERS</div>
                <div style="display: grid; gap: 8px;">
                    ${Object.entries(params).map(([k, v]) => `
                        <div style="background: rgba(var(--primary-rgb), 0.1); padding: 8px; border-radius: 6px; font-family: var(--font-mono); font-size: 0.85rem;">
                            <span style="color: var(--primary); font-weight: 700;">${k}</span> = <span>${v}</span>
                        </div>
                    `).join('')}
                </div>
            </div>`;
        }

        content.innerHTML = html;
        panel.style.display = 'block';
    }

    // INTERNAL LOGIC (Formerly in DevTools)

    encode(val) {
        return { success: true, result: encodeURIComponent(val), message: 'Encoded Component' };
    }

    decode(val) {
        try {
            return { success: true, result: decodeURIComponent(val), message: 'Decoded Component' };
        } catch (e) {
            return { success: false, message: 'Invalid URI Component' };
        }
    }

    encodeURL(val) {
        return { success: true, result: encodeURI(val), message: 'Encoded Full URL' };
    }

    decodeURL(val) {
        try {
            return { success: true, result: decodeURI(val), message: 'Decoded Full URL' };
        } catch (e) {
            return { success: false, message: 'Invalid URI' };
        }
    }

    parseURL(val) {
        try {
            const url = new URL(val);
            const params = {};
            url.searchParams.forEach((v, k) => params[k] = v);
            return {
                success: true,
                message: 'URL Parsed Successfully',
                data: {
                    protocol: url.protocol,
                    hostname: url.hostname,
                    pathname: url.pathname,
                    params: params
                }
            };
        } catch (e) {
            return { success: false, message: 'Invalid URL format' };
        }
    }

    parseQueryString(val) {
        try {
            const params = {};
            const search = val.startsWith('?') ? val.slice(1) : val;
            const pairs = search.split('&');
            for (const pair of pairs) {
                if (pair) {
                    const [key, value] = pair.split('=');
                    params[decodeURIComponent(key)] = decodeURIComponent(value || '');
                }
            }
            return { success: true, message: 'Query String Parsed', result: params }; // result is used for fake object mismatch
        } catch (e) {
            return { success: false, message: 'Error parsing query string' };
        }
    }
}

// Register tool
window.initUrlToolLogic = URLTool;
