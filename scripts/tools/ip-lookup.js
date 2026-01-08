/* TULPAR - IP Lookup Tool OOP Implementation */
class IPLookupTool extends BaseTool {
    constructor(config) {
        super(config);
    }

    renderUI() {
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const txt = isTr ? {
            placeholder: 'IP adresi girin (örn. 8.8.8.8)',
            getMine: 'Benim IP\'mi Bul',
            lookup: 'Sorgula',
            info: 'IP Bilgileri',
            map: 'Lokasyon Haritası',
            labels: {
                ip: 'IP Adresi',
                country: 'Ülke',
                city: 'Şehir',
                region: 'Bölge',
                timezone: 'Zaman Dilimi',
                isp: 'İnternet Sağlayıcı',
                asn: 'ASN',
                coordinates: 'Koordinatlar'
            }
        } : {
            placeholder: 'Enter IP address (e.g. 8.8.8.8)',
            getMine: 'Get My IP',
            lookup: 'Lookup',
            info: 'IP Information',
            map: 'Location Map',
            labels: {
                ip: 'IP Address',
                country: 'Country',
                city: 'City',
                region: 'Region',
                timezone: 'Timezone',
                isp: 'ISP',
                asn: 'ASN',
                coordinates: 'Coordinates'
            }
        };

        return `
        <div class="tool-content" style="max-width: 900px; margin: 0 auto; padding: 20px;">
            <div class="card" style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 12px; margin-bottom: 2rem;">
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <input type="text" id="ip-input" class="form-input" style="flex: 1; min-width: 250px;" placeholder="${txt.placeholder}">
                    <button id="ip-lookup-btn" class="btn btn-primary" style="padding: 0 1.5rem;">🔍 ${txt.lookup}</button>
                    <button id="ip-get-mine-btn" class="btn btn-secondary" style="padding: 0 1.5rem;">📍 ${txt.getMine}</button>
                </div>
                <div id="ip-status" style="margin-top: 10px; font-size: 0.85rem; height: 1.2rem;"></div>
            </div>

            <div id="ip-results" style="display: none;">
                <div class="grid-layout" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: start;">
                    <div class="card" style="padding: 1.5rem; background: var(--bg-primary);">
                        <h4 style="margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">${txt.info}</h4>
                        <div style="display: grid; gap: 12px;">
                            ${Object.entries(txt.labels).map(([id, label]) => `
                                <div style="display: grid; grid-template-columns: 120px 1fr; gap: 1rem; font-size: 0.95rem; padding: 6px 0; border-bottom: 1px dashed rgba(255,255,255,0.1);">
                                    <span style="color: var(--text-secondary); font-weight: 500;">${label}</span>
                                    <strong id="ip-${id}" style="text-align: left; word-break: break-word; color: var(--text-primary);">-</strong>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div id="ip-map-container" class="card" style="padding: 1rem; background: var(--surface); border: 1px solid var(--border-color); overflow: hidden;">
                        <h4 style="margin-bottom: 1rem;">${txt.map}</h4>
                        <div style="aspect-ratio: 16/9; border-radius: 8px; overflow: hidden; background: #eee;">
                            <iframe id="ip-map" width="100%" height="100%" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    setupListeners() {
        const input = document.getElementById('ip-input');
        const status = document.getElementById('ip-status');
        const resultsArea = document.getElementById('ip-results');
        const mapIframe = document.getElementById('ip-map');
        const getMineBtn = document.getElementById('ip-get-mine-btn');
        const lookupBtn = document.getElementById('ip-lookup-btn');

        const updateStatus = (msg, type = 'info') => {
            status.textContent = msg;
            status.style.color = type === 'success' ? 'var(--success)' : (type === 'error' ? 'var(--danger)' : 'var(--text-secondary)');
        };

        const displayIP = (data) => {
            const fields = {
                'ip-ip': data.ip,
                'ip-country': `${data.country_name || data.country} (${data.country_code || data.countryCode})`,
                'ip-city': data.city,
                'ip-region': data.region,
                'ip-timezone': data.timezone,
                'ip-isp': data.org || data.isp,
                'ip-asn': data.asn,
                'ip-coordinates': `${(data.latitude || 0).toFixed(4)}, ${(data.longitude || 0).toFixed(4)}`
            };

            Object.entries(fields).forEach(([id, val]) => {
                const el = document.getElementById(id);
                if (el) el.textContent = val || '-';
            });

            if (data.latitude && data.longitude && mapIframe) {
                mapIframe.src = this.getMapEmbed(data.latitude, data.longitude);
                document.getElementById('ip-map-container').style.display = 'block';
            }
            resultsArea.style.display = 'block';
        };

        getMineBtn.onclick = async () => {
            updateStatus('📍 Detecting your IP...', 'info');
            const result = await this.getCurrentIP();
            if (result.success) {
                input.value = result.ip || (result.data ? result.data.ip : '');
                input.disabled = false;
                displayIP(result.data);
                updateStatus('✓ Local IP info retrieved', 'success');
            } else {
                updateStatus(result.message || 'Error detecting IP', 'error');
            }
        };

        lookupBtn.onclick = async () => {
            const ip = input.value.trim();
            if (!ip || !this.validateIP(ip)) {
                updateStatus('✗ Invalid IP format', 'error');
                return;
            }
            updateStatus('🔍 Searching...', 'info');
            const result = await this.getIPInfo(ip);
            if (result.success) {
                displayIP(result.data);
                updateStatus('✓ Success', 'success');
            } else { updateStatus(result.message, 'error'); }
        };

        input.onkeydown = (e) => {
            if (e.key === 'Enter') {
                lookupBtn.click();
            }
        };
    }

    // INTERNAL LOGIC (Formerly in DevTools)

    validateIP(ip) {
        if (!ip) return false;
        // Simple IPv4 regex or IPv6 check
        const ipv4 = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return ipv4.test(ip) || ip.includes(':'); // Very basic
    }

    async getCurrentIP() {
        try {
            const resp = await fetch('https://ipapi.co/json/');
            if (!resp.ok) throw new Error('API Error');
            const data = await resp.json();
            return {
                success: true,
                ip: data.ip,
                data: data
            };
        } catch (e) {
            return { success: false, message: 'Failed to detect IP. Adblocker might be blocking it.' };
        }
    }

    async getIPInfo(ip) {
        try {
            const resp = await fetch(`https://ipapi.co/${ip}/json/`);
            if (!resp.ok) throw new Error('API Error');
            const data = await resp.json();
            if (data.error) return { success: false, message: data.reason || 'IP Not Found' };
            return {
                success: true,
                data: data
            };
        } catch (e) {
            return { success: false, message: 'Failed to fetch IP info.' };
        }
    }

    getMapEmbed(lat, lng) {
        // Using OpenStreetMap Embed via iframe
        // Bounding box calculation for zoom
        const delta = 0.05;
        const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`;
        return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
    }
}

// Register tool
window.initIpLookupLogic = IPLookupTool;
