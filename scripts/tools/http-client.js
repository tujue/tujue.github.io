/* TULPAR - API Client Tool OOP Implementation */
class HttpClientTool extends BaseTool {
    constructor(config) {
        super(config);
        this.history = [];
    }

    renderUI() {
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const txt = isTr ? {
            title: 'Modern API Test İstasyonu',
            send: 'İstek Gönder 🚀',
            req: 'İstek Yapısı',
            res: 'Yanıt Verisi',
            tabs: { body: 'Gövde (JSON)', headers: 'Başlıklar', params: 'Parametreler' },
            stats: { status: 'Durum', time: 'Süre' },
            copy: 'Kopyala',
            clear: 'Temizle'
        } : {
            title: 'Modern API Test Station',
            send: 'Send Request 🚀',
            req: 'Request Context',
            res: 'Response Data',
            tabs: { body: 'Payload (JSON)', headers: 'Headers', params: 'Params' },
            stats: { status: 'Status', time: 'Time' },
            copy: 'Copy Response',
            clear: 'Clear All'
        };

        return `
        <div class="tool-content apiclient" style="height: calc(100vh - 160px); display: flex; flex-direction: column; overflow: hidden;">
            
            <!-- URL Header -->
            <div class="card" style="margin-bottom: 1.5rem; padding: 1rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 16px;">
                <div style="display: flex; gap: 10px;">
                    <select id="api-method" class="form-select" style="width: 120px; font-weight: 700; background: var(--bg-primary);">
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                        <option value="PATCH">PATCH</option>
                    </select>
                    <input type="text" id="api-url" class="form-input" style="flex: 1;" placeholder="https://api.example.com/v1/resource" value="https://jsonplaceholder.typicode.com/todos/1">
                    <button id="api-btn-run" class="btn btn-primary" style="padding: 0 30px; font-weight: 700;">${txt.send}</button>
                </div>
            </div>

            <div style="flex: 1; display: grid; grid-template-columns: 400px 1fr; gap: 1.5rem; overflow: hidden;">
                
                <!-- Request Config -->
                <div class="card" style="display: flex; flex-direction: column; overflow: hidden; background: var(--surface); border: 1px solid var(--border-color); border-radius: 16px;">
                    <div style="padding: 0.75rem 1rem; border-bottom: 1px solid var(--border-color); display: flex; gap: 12px; background: rgba(0,0,0,0.1);">
                        <button id="api-tab-body" class="btn btn-sm btn-primary" style="font-size: 0.7rem;">${txt.tabs.body}</button>
                        <button id="api-tab-head" class="btn btn-sm btn-outline" style="font-size: 0.7rem;">${txt.tabs.headers}</button>
                    </div>
                    <div style="flex: 1; overflow: hidden;">
                        <textarea id="api-in-body" class="form-input" style="height: 100%; border: none; font-family: var(--font-mono); font-size: 0.85rem; padding: 1.5rem; resize: none; background: transparent;" placeholder='{\n  "id": 1,\n  "title": "Hello World"\n}'></textarea>
                        <div id="api-in-head-cont" style="display:none; padding: 1.5rem;">
                            <textarea id="api-in-head" class="form-input" style="height: 100px; font-family: var(--font-mono); font-size: 0.8rem;" placeholder="Content-Type: application/json&#10;Authorization: Bearer ..."></textarea>
                        </div>
                    </div>
                </div>

                <!-- Response Area -->
                <div class="card" style="display: flex; flex-direction: column; background: #1a1b2e; border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; overflow: hidden;">
                    <div style="padding: 0.75rem 1.5rem; background: rgba(255,255,255,0.03); border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; gap: 20px; align-items: center;">
                            <span style="font-size: 0.75rem; color: #6366f1; font-weight: 700; text-transform: uppercase;">${txt.res}</span>
                            <div id="api-res-status-badge" style="display: none; padding: 2px 10px; border-radius: 4px; font-size: 0.7rem; font-weight: 700;"></div>
                            <span id="api-res-time" style="font-size: 0.7rem; opacity: 0.5;"></span>
                        </div>
                        <div style="display: flex; gap: 8px;">
                            <button id="api-btn-copy" class="btn btn-sm btn-outline" style="color: #ccc; border-color: #444; font-size: 0.65rem;">${txt.copy}</button>
                            <button id="api-btn-clr" class="btn btn-sm btn-outline" style="color: #ccc; border-color: #444; font-size: 0.65rem;">${txt.clear}</button>
                        </div>
                    </div>
                    <div style="flex: 1; position: relative; overflow: hidden;">
                        <pre id="api-out-pre" style="margin: 0; padding: 1.5rem; height: 100%; overflow: auto; font-family: var(--font-mono); font-size: 0.85rem; color: #a5b4fc;"></pre>
                        <div id="api-empty-state" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; opacity: 0.2;">
                            <div style="font-size: 3rem;">📡</div>
                            <p>${isTr ? 'Yanıt bekleniyor...' : 'Waiting for request...'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    setupListeners() {
        const btnRun = document.getElementById('api-btn-run');
        const urlIn = document.getElementById('api-url');
        const methodIn = document.getElementById('api-method');
        const bodyIn = document.getElementById('api-in-body');
        const headIn = document.getElementById('api-in-head');

        const outPre = document.getElementById('api-out-pre');
        const badge = document.getElementById('api-res-status-badge');
        const timeVal = document.getElementById('api-res-time');
        const empty = document.getElementById('api-empty-state');

        const tabBody = document.getElementById('api-tab-body');
        const tabHead = document.getElementById('api-tab-head');
        const contHead = document.getElementById('api-in-head-cont');

        tabBody.onclick = () => { tabBody.classList.replace('btn-outline', 'btn-primary'); tabHead.classList.replace('btn-primary', 'btn-outline'); bodyIn.style.display = 'block'; contHead.style.display = 'none'; };
        tabHead.onclick = () => { tabHead.classList.replace('btn-outline', 'btn-primary'); tabBody.classList.replace('btn-primary', 'btn-outline'); bodyIn.style.display = 'none'; contHead.style.display = 'block'; };

        btnRun.onclick = async () => {
            const url = urlIn.value.trim();
            if (!url) { this.showNotification('Please enter a URL', 'error'); return; }

            btnRun.disabled = true;
            btnRun.innerHTML = '⏳ ...';
            empty.style.display = 'none';
            outPre.textContent = 'Sending request...';

            const method = methodIn.value;
            const headers = {};
            const headVal = headIn.value.trim();
            if (headVal) {
                headVal.split('\n').forEach(line => {
                    const parts = line.split(':');
                    if (parts.length >= 2) {
                        const k = parts.shift().trim();
                        const v = parts.join(':').trim();
                        if (k && v) headers[k] = v;
                    }
                });
            }

            const options = { method, headers };
            if (['POST', 'PUT', 'PATCH'].includes(method)) {
                let bodyContent = bodyIn.value.trim();
                try {
                    // Try to minify JSON if valid
                    if (bodyContent) bodyContent = JSON.stringify(JSON.parse(bodyContent));
                } catch (e) {
                    // If invalid JSON, send as is (maybe plain text) or warn?
                    // Let's assume user knows what they are doing, but default content-type is json
                }

                options.body = bodyContent;
                if (!headers['Content-Type']) options.headers['Content-Type'] = 'application/json';
            }

            const start = performance.now();
            try {
                const res = await fetch(url, options);
                const end = performance.now();
                const totalTime = Math.round(end - start);

                badge.style.display = 'inline-block';
                badge.textContent = `${res.status} ${res.statusText}`;
                badge.style.background = res.ok ? '#10b981' : '#ef4444';
                badge.style.color = 'white';
                timeVal.textContent = `${totalTime}ms`;

                const contentType = res.headers.get("content-type");
                const text = await res.text();

                if (contentType && contentType.includes("application/json")) {
                    try {
                        const json = JSON.parse(text);
                        outPre.textContent = JSON.stringify(json, null, 2);
                        outPre.style.color = '#10b981';
                    } catch (e) {
                        outPre.textContent = text;
                        outPre.style.color = '#a5b4fc';
                    }
                } else {
                    outPre.textContent = text;
                    outPre.style.color = '#a5b4fc';
                }

            } catch (err) {
                badge.style.display = 'inline-block';
                badge.textContent = 'NETWORK ERROR';
                badge.style.background = '#ef4444';
                outPre.textContent = `Failed to fetch: ${err.message}\n\nPossible causes:\n1. CORS restrictions (API must allow your origin)\n2. Network connectivity\n3. Invalid URL`;
                outPre.style.color = '#ef4444';
            } finally {
                btnRun.disabled = false;
                btnRun.textContent = window.i18n.getCurrentLanguage() === 'tr' ? 'İstek Gönder 🚀' : 'Send Request 🚀';
            }
        };

        document.getElementById('api-btn-copy').onclick = () => this.copyToClipboard(outPre.textContent);
        document.getElementById('api-btn-clr').onclick = () => { outPre.textContent = ''; badge.style.display = 'none'; timeVal.textContent = ''; empty.style.display = 'flex'; };
    }
}

// Register tool
window.initHttpClientLogic = HttpClientTool;
