/* TULPAR - Web Scraper Tool OOP Implementation */
class WebScraperTool extends BaseTool {
    constructor(config) {
        super(config);
        this.data = null;
    }

    renderUI() {
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const txt = isTr ? {
            title: 'Veri Madenciliği Laboratuvarı',
            lab: 'Otonom Veri Çıkarıcı',
            place: 'Hedef URL (https://...)',
            run: 'Süreci Başlat 🚀',
            stats: 'Çıkarılan Varlıklar',
            export: 'Veriyi Dışa Aktar (JSON)',
            mining: '🔄 Veri Madenciliği Başladı...',
            conn: 'DURUM: PROXY BAĞLANTISI',
            comp: 'DURUM: ANALİZ TAMAMLANDI',
            err: 'DURUM: HATA - '
        } : {
            title: 'Data Mining Laboratory',
            lab: 'Autonomous Data Extractor',
            place: 'Target URL (https://...)',
            run: 'Execute Scraper 🚀',
            stats: 'Extracted Assets',
            export: 'Export Data (JSON)',
            mining: '🔄 Mining Data...',
            conn: 'STATUS: CONNECTING_TO_PROXY',
            comp: 'STATUS: ANALYSIS_COMPLETE',
            err: 'STATUS: ERROR - '
        };

        return `
        <div class="tool-content scraper-studio" style="max-width: 1200px; margin: 0 auto; padding: 20px;">
            <div class="card" style="padding: 2.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 24px; margin-bottom: 2rem;">
                <h4 style="margin-bottom: 2rem; color: var(--primary); text-transform: uppercase; font-size: 0.8rem; letter-spacing: 1px;">${txt.lab}</h4>
                <div style="display: flex; gap: 15px;">
                    <input type="url" id="ws-in-url" class="form-input" style="flex: 1; height: 3.5rem; font-size: 1.1rem;" placeholder="${txt.place}">
                    <button id="ws-btn-run" class="btn btn-primary" style="padding: 0 2rem; font-weight: 700;">${txt.run}</button>
                </div>
                <div id="ws-status" style="margin-top: 1rem; font-size: 0.75rem; opacity: 0.5;">STATUS: IDLE</div>
            </div>

            <div id="ws-results" style="display: none;">
                <div class="grid-layout" style="display: grid; grid-template-columns: 1fr 350px; gap: 2rem;">
                    
                    <!-- Content View -->
                    <div class="ws-main">
                        <div class="card" style="padding: 0; background: #000; border-radius: 24px; overflow: hidden; height: 600px; display: flex; flex-direction: column;">
                            <div style="display: flex; gap: 5px; background: #111; padding: 10px; border-bottom: 1px solid #222;">
                                <button class="ws-tab active" data-t="links">LINKS</button>
                                <button class="ws-tab" data-t="images">IMAGES</button>
                                <button class="ws-tab" data-t="meta">METADATA</button>
                            </div>
                            <div id="ws-cont" style="flex: 1; overflow-y: auto; padding: 2rem; font-family: var(--font-mono); font-size: 0.85rem; color: #d1d5db;">
                                <!-- Content -->
                            </div>
                        </div>
                    </div>

                    <!-- Stats Sidebar -->
                    <div class="ws-sidebar">
                        <div class="card" style="padding: 2rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 24px; height: 100%; display: flex; flex-direction: column;">
                            <h4 style="font-size: 0.75rem; text-transform: uppercase; color: var(--primary); margin-bottom: 2rem;">${txt.stats}</h4>
                            
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 2rem;">
                                <div style="background: rgba(var(--primary-rgb), 0.1); padding: 15px; border-radius: 12px; text-align: center;">
                                    <div id="ws-stat-l" style="font-size: 1.5rem; font-weight: 900; color: var(--primary);">0</div>
                                    <div style="font-size: 0.6rem; opacity: 0.5;">LINKS</div>
                                </div>
                                <div style="background: rgba(16, 185, 129, 0.1); padding: 15px; border-radius: 12px; text-align: center;">
                                    <div id="ws-stat-i" style="font-size: 1.5rem; font-weight: 900; color: #10b981;">0</div>
                                    <div style="font-size: 0.6rem; opacity: 0.5;">IMAGES</div>
                                </div>
                            </div>

                            <div style="flex: 1;">
                                <h5 style="font-size: 0.65rem; opacity: 0.4; margin-bottom: 10px;">TITLES DETECTED</h5>
                                <div id="ws-stat-h" style="font-size: 0.8rem; line-height: 1.6;"></div>
                            </div>

                            <button id="ws-btn-exp" class="btn btn-outline" style="width: 100%; margin-top: 2rem; font-weight: 700;">${txt.export}</button>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                .ws-tab { background: transparent; border: none; color: #666; font-size: 0.7rem; padding: 8px 15px; border-radius: 6px; cursor: pointer; font-weight: 700; transition: 0.2s; }
                .ws-tab.active { background: var(--primary); color: #fff; }
                .ws-row { padding: 12px 0; border-bottom: 1px solid #222; overflow: hidden; text-overflow: ellipsis; }
                .ws-row a { color: var(--primary); text-decoration: none; }
                .ws-row a:hover { text-decoration: underline; }
            </style>
        </div>
        `;
    }

    setupListeners() {
        const btn = document.getElementById('ws-btn-run');
        const url = document.getElementById('ws-in-url');
        const res = document.getElementById('ws-results');
        const status = document.getElementById('ws-status');
        const cont = document.getElementById('ws-cont');

        btn.onclick = async () => {
            if (!url.value) return;

            // Re-check language for dynamic strings inside async
            const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
            const curTxt = isTr ? { mining: '🔄 Veri Madenciliği Başladı...', conn: 'DURUM: PROXY BAĞLANTISI', comp: 'DURUM: ANALİZ TAMAMLANDI', err: 'DURUM: HATA - ' }
                : { mining: '🔄 Mining Data...', conn: 'STATUS: CONNECTING_TO_PROXY', comp: 'STATUS: ANALYSIS_COMPLETE', err: 'STATUS: ERROR - ' };

            btn.disabled = true;
            btn.textContent = curTxt.mining;
            status.textContent = curTxt.conn;

            try {
                let html = '';
                // Try AllOrigins first
                try {
                    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url.value)}`;
                    const response = await fetch(proxyUrl);
                    if (!response.ok) throw new Error('Primary proxy failed');
                    const jsonData = await response.json();
                    html = jsonData.contents;
                } catch (e) {
                    // Fallback to Corsproxy.io
                    console.warn("Primary proxy failed, trying fallback...", e);
                    status.textContent = "STATUS: SWITCHING TO FALLBACK PROXY...";
                    const fallbackUrl = `https://corsproxy.io/?${encodeURIComponent(url.value)}`;
                    const response = await fetch(fallbackUrl);
                    if (!response.ok) throw new Error('All proxies failed. Please check URL or try again later.');
                    html = await response.text();
                }

                if (!html) throw new Error('No content retrieved');

                this.data = this.analyze(html, url.value);

                res.style.display = 'block';
                document.getElementById('ws-stat-l').textContent = this.data.links.length;
                document.getElementById('ws-stat-i').textContent = this.data.images.length;

                // Safe check for headings
                const h1 = this.data.headings && this.data.headings.h1 ? this.data.headings.h1 : [];
                const h2 = this.data.headings && this.data.headings.h2 ? this.data.headings.h2 : [];

                document.getElementById('ws-stat-h').innerHTML = h1.map(h => `<div style="color:var(--primary); margin-bottom:5px;">H1: ${h}</div>`).join('') +
                    h2.map(h => `<div style="color:#10b981;">H2: ${h}</div>`).join('');

                this._renderTab('links');
                status.textContent = curTxt.comp;
            } catch (err) {
                status.textContent = curTxt.err + err.message;
                this.showNotification(err.message, 'error');
            } finally {
                btn.disabled = false;
                btn.textContent = isTr ? 'Süreci Başlat 🚀' : 'Execute Scraper 🚀';
            }
        };

        document.querySelectorAll('.ws-tab').forEach(t => {
            t.onclick = () => {
                document.querySelectorAll('.ws-tab').forEach(x => x.classList.remove('active'));
                t.classList.add('active');
                this._renderTab(t.dataset.t);
            };
        });

        document.getElementById('ws-btn-exp').onclick = () => {
            const blob = new Blob([JSON.stringify(this.data, null, 2)], { type: 'application/json' });
            const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
            a.download = 'scrap_result.json'; a.click();
        };
    }

    _renderTab(t) {
        if (!this.data) return;
        const cont = document.getElementById('ws-cont');
        let content = '';

        if (t === 'links') {
            if (this.data.links.length === 0) content = '<div class="ws-row">No links found.</div>';
            else content = this.data.links.map(l => `<div class="ws-row"><a href="${l.href}" target="_blank">${l.text || '[LINK]'}</a><br><small style="opacity:0.4;">${l.href}</small></div>`).join('');
        } else if (t === 'images') {
            if (this.data.images.length === 0) content = '<div class="ws-row">No images found.</div>';
            else content = this.data.images.map(i => `<div class="ws-row" style="display:flex; gap:10px; align-items:center;"><img src="${i.src}" style="width:40px; height:40px; border-radius:4px; object-fit:cover;"><small style="opacity:0.4;">${i.src}</small></div>`).join('');
        } else if (t === 'meta') {
            if (this.data.meta.length === 0) content = '<div class="ws-row">No metadata found.</div>';
            else content = this.data.meta.map(m => `<div class="ws-row"><strong>${m.name}:</strong> ${m.content}</div>`).join('');
        }
        cont.innerHTML = content;
    }

    // INTERNAL LOGIC (Formerly in DevTools.scraperTools)

    analyze(html, baseUrl) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Helper to resolve relative URLs
        const resolveUrl = (currentUrl) => {
            try {
                return new URL(currentUrl, baseUrl).href;
            } catch (e) { return currentUrl; }
        };

        const result = {
            links: [],
            images: [],
            meta: [],
            headings: { h1: [], h2: [] }
        };

        // Links
        doc.querySelectorAll('a').forEach(a => {
            const href = a.getAttribute('href');
            if (href) {
                result.links.push({
                    text: a.textContent.trim().substring(0, 100),
                    href: resolveUrl(href)
                });
            }
        });

        // Images
        doc.querySelectorAll('img').forEach(img => {
            const src = img.getAttribute('src');
            if (src) {
                result.images.push({
                    src: resolveUrl(src),
                    alt: img.getAttribute('alt') || ''
                });
            }
        });

        // Meta tags
        doc.querySelectorAll('meta').forEach(meta => {
            const name = meta.getAttribute('name') || meta.getAttribute('property');
            const content = meta.getAttribute('content');
            if (name && content) {
                result.meta.push({ name, content });
            }
        });

        // Headings
        doc.querySelectorAll('h1').forEach(h => result.headings.h1.push(h.textContent.trim()));
        doc.querySelectorAll('h2').forEach(h => result.headings.h2.push(h.textContent.trim()));

        return result;
    }
}

// Register tool
window.initWebScraperLogic = WebScraperTool;
