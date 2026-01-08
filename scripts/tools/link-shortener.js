/* TULPAR - Link Shortener Tool OOP Implementation */
class LinkShortenerTool extends BaseTool {
    constructor(config) {
        super(config);
        this.STORAGE_KEY = 'tulpar_short_links';
    }

    renderUI() {
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const txt = isTr ? {
            title: 'Akıllı Bağlantı Kısaltıcı',
            long: 'Uzun Bağlantı (URL)',
            alias: 'Özel İsim (Opsiyonel)',
            token: 'Bitly API Anahtarı',
            gen: 'Bağlantıyı Kısalt 🔗',
            history: 'Geçmiş Kayıtlar',
            copy: 'Kopyala',
            qr: 'QR Kodunu Göster'
        } : {
            title: 'Smart link Shortener',
            long: 'Destination URL',
            alias: 'Custom Alias (Optional)',
            token: 'Bitly API Token',
            gen: 'Shorten Link 🔗',
            history: 'Recent History',
            copy: 'Copy',
            qr: 'Show QR Code'
        };

        return `
        <div class="tool-content shortener-studio" style="max-width: 1000px; margin: 0 auto; padding: 20px;">
            <div class="grid-layout" style="display: grid; grid-template-columns: 1fr 380px; gap: 2.5rem;">
                
                <!-- Main Form -->
                <div class="ls-form-side">
                    <div class="card" style="padding: 2.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 24px;">
                        <h4 style="margin-bottom: 2rem; color: var(--primary); text-transform: uppercase; font-size: 0.85rem; letter-spacing: 1px;">${txt.title}</h4>
                        
                        <div class="form-group">
                            <label class="form-label">${txt.long}</label>
                            <input type="url" id="ls-in-url" class="form-input" placeholder="https://very-long-url.com/some/path/index.html" style="font-size: 1rem; padding: 1rem;">
                        </div>

                        <div class="grid-2" style="margin-top: 1.5rem;">
                             <div class="form-group">
                                <label class="form-label">${txt.alias}</label>
                                <input type="text" id="ls-in-alias" class="form-input" placeholder="my-name">
                             </div>
                             <div class="form-group">
                                <label class="form-label">${txt.token}</label>
                                <input type="password" id="ls-in-token" class="form-input" placeholder="••••••••">
                             </div>
                        </div>

                        <button id="ls-btn-run" class="btn btn-primary" style="width: 100%; height: 3.5rem; font-weight: 700; margin-top: 2rem; font-size: 1.1rem;">${txt.gen}</button>

                        <div id="ls-res-card" style="display: none; margin-top: 2.5rem; padding: 2rem; background: rgba(99, 102, 241, 0.05); border: 1px dashed var(--primary); border-radius: 16px; text-align: center;">
                            <h5 style="font-size: 0.75rem; opacity: 0.5; margin-bottom: 1rem;">YOUR SHORT LINK</h5>
                            <div style="display: flex; gap: 15px; justify-content: center; align-items: center;">
                                <a id="ls-out-link" href="#" target="_blank" style="font-size: 2rem; font-weight: 900; color: var(--primary); text-decoration: none;"></a>
                                <button id="ls-btn-copy" class="btn btn-sm btn-primary">${txt.copy}</button>
                            </div>
                            <div id="ls-qr-wrap" style="margin-top: 2rem; display: none;">
                                <canvas id="ls-qr-cvs" style="margin: 0 auto; border-radius: 12px; background: white; padding: 10px;"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- History Side -->
                <div class="ls-history-side">
                    <div class="card" style="padding: 1.5rem; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 20px; height: 100%; display: flex; flex-direction: column;">
                        <h4 style="font-size: 0.8rem; text-transform: uppercase; margin-bottom: 1.5rem; opacity: 0.6;">${txt.history}</h4>
                        <div id="ls-history-list" style="flex: 1; overflow-y: auto;"></div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    setupListeners() {
        const urlIn = document.getElementById('ls-in-url');
        const aliasIn = document.getElementById('ls-in-alias');
        const tokenIn = document.getElementById('ls-in-token');
        const btnRun = document.getElementById('ls-btn-run');
        const resCard = document.getElementById('ls-res-card');
        const outLink = document.getElementById('ls-out-link');
        const histIn = document.getElementById('ls-history-list');

        const renderHistory = () => {
            const links = this._getHistory();
            histIn.innerHTML = links.map(l => `
                <div style="padding: 1rem; background: var(--surface); border-radius: 12px; margin-bottom: 12px; border: 1px solid rgba(255,255,255,0.05);">
                    <div style="font-weight: 700; color: var(--primary); margin-bottom: 4px; font-size: 0.95rem;">${l.shortUrl}</div>
                    <div style="font-size: 0.75rem; opacity: 0.4; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${l.originalUrl}</div>
                    <div style="margin-top: 10px; display: flex; gap: 8px;">
                        <button class="btn btn-sm btn-outline ls-hist-copy" style="font-size: 0.6rem;" data-url="${l.shortUrl}">Copy</button>
                        <button class="btn btn-sm btn-outline ls-hist-del" style="font-size: 0.6rem; color: #ef4444;" data-id="${l.id}">Del</button>
                    </div>
                </div>
            `).join('');

            // Add events to history buttons
            histIn.querySelectorAll('.ls-hist-copy').forEach(btn => {
                btn.onclick = () => this.copyToClipboard(btn.dataset.url);
            });
            histIn.querySelectorAll('.ls-hist-del').forEach(btn => {
                btn.onclick = () => {
                    this._deleteFromHistory(btn.dataset.id);
                    renderHistory();
                };
            });
        };

        btnRun.onclick = async () => {
            const url = urlIn.value.trim();
            if (!url) return;

            btnRun.disabled = true;
            btnRun.textContent = '⏳ ...';

            try {
                const res = await this._shorten(url, aliasIn.value, tokenIn.value);
                resCard.style.display = 'block';
                outLink.textContent = res.shortUrl;
                outLink.href = res.shortUrl;

                // QR Code
                if (typeof QRious !== 'undefined') {
                    document.getElementById('ls-qr-wrap').style.display = 'block';
                    new QRious({ element: document.getElementById('ls-qr-cvs'), value: res.shortUrl, size: 180 });
                }

                this._saveToHistory(res.shortUrl, url);
                renderHistory();
                this.showNotification('Link Shortened!', 'success');
            } catch (err) {
                this.showNotification(err.message, 'error');
            } finally {
                btnRun.disabled = false;
                const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
                btnRun.textContent = isTr ? 'Bağlantıyı Kısalt 🔗' : 'Shorten Link 🔗';
            }
        };

        document.getElementById('ls-btn-copy').onclick = () => this.copyToClipboard(outLink.textContent);

        renderHistory();
    }

    _getHistory() {
        try {
            return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
        } catch (e) {
            return [];
        }
    }

    _saveToHistory(shortUrl, originalUrl) {
        const history = this._getHistory();
        history.unshift({
            id: Date.now().toString(),
            shortUrl,
            originalUrl,
            date: new Date().toISOString()
        });
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history.slice(0, 50)));
    }

    _deleteFromHistory(id) {
        const history = this._getHistory().filter(l => l.id !== id);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
    }

    async _shorten(url, alias, token) {
        if (!url.startsWith('http')) url = 'https://' + url;

        // 1. Bitly Strategy (If token provided)
        if (token) {
            try {
                const response = await fetch('https://api-ssl.bitly.com/v4/shorten', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ long_url: url })
                });
                if (response.ok) {
                    const data = await response.json();
                    return { shortUrl: data.link };
                } else {
                    const err = await response.json();
                    throw new Error(err.message || 'Bitly API Error');
                }
            } catch (e) {
                throw new Error('Bitly Error: ' + e.message);
            }
        }

        // 2. TinyURL Strategy (Public API via proxy if needed, or direct)
        // TinyURL v1 is simple GET but might have CORS issues.
        // We'll use a public anonymous shortener or a fallback.
        try {
            // Using TinyURL simple API (GET)
            // Note: TinyURL doesn't always allow CORS. We might need a proxy.
            const tinyUrl = `https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}${alias ? `&alias=${encodeURIComponent(alias)}` : ''}`;

            // Try direct first
            try {
                const res = await fetch(tinyUrl);
                if (res.ok) {
                    const short = await res.text();
                    return { shortUrl: short };
                }
            } catch (corsErr) {
                // Try via AllOrigins proxy
                const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(tinyUrl)}`;
                const res = await fetch(proxyUrl);
                if (res.ok) {
                    const data = await res.json();
                    return { shortUrl: data.contents };
                }
            }
            throw new Error('Fallback shortening failed');
        } catch (e) {
            // Ultimate fallback: Is.gd or similar
            try {
                const isGdUrl = `https://is.gd/create.php?format=json&url=${encodeURIComponent(url)}${alias ? `&shorturl=${encodeURIComponent(alias)}` : ''}`;
                const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(isGdUrl)}`;
                const res = await fetch(proxyUrl);
                if (res.ok) {
                    const data = await res.json();
                    const jsonData = JSON.parse(data.contents);
                    if (jsonData.shorturl) return { shortUrl: jsonData.shorturl };
                    if (jsonData.errormessage) throw new Error(jsonData.errormessage);
                }
            } catch (e2) {
                throw new Error('Link shortening service unavailable. Try using the Bitly token.');
            }
        }
    }
}

// Register tool
window.initLinkShortenerLogic = LinkShortenerTool;
