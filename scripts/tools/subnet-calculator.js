/* TULPAR - Network / Subnet Calculator Tool OOP Implementation */
class SubnetCalculatorTool extends BaseTool {
    constructor(config) {
        super(config);
    }

    renderUI() {
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const txt = isTr ? {
            title: 'Profesyonel Ağ Analizörü',
            lab: 'Network Laboratuvarı',
            place: 'Örn: 192.168.1.1/24',
            calc: 'Ağı Hesapla 🔍',
            net: 'Ağ Adresi',
            broad: 'Broadcast Adresi',
            mask: 'Alt Ağ Maskesi',
            hosts: 'Toplam Kullanılabilir Host'
        } : {
            title: 'Professional Subnet Analyzer',
            lab: 'Network Laboratory',
            place: 'e.g., 10.0.0.1/16',
            calc: 'Analyze Network 🔍',
            net: 'Network Address',
            broad: 'Broadcast Address',
            mask: 'Subnet Mask',
            hosts: 'Total Usable Hosts'
        };

        return `
        <div class="tool-content subnet-studio" style="max-width: 1000px; margin: 0 auto; padding: 20px;">
            <div class="card" style="padding: 2.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 24px; margin-bottom: 2rem;">
                <h4 style="margin-bottom: 2rem; color: var(--primary); text-transform: uppercase; font-size: 0.8rem; letter-spacing: 1px;">${txt.lab}</h4>
                
                <div style="display: flex; gap: 15px;">
                    <input type="text" id="sub-in-cidr" class="form-input" style="flex: 1; font-size: 1.2rem; height: 3.5rem; font-family: var(--font-mono);" placeholder="${txt.place}">
                    <button id="sub-btn-run" class="btn btn-primary" style="padding: 0 2rem; font-weight: 700;">${txt.calc}</button>
                </div>
            </div>

            <div id="sub-res" style="display: none;">
                <div class="grid-layout" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 20px;">
                    <div class="card" style="padding: 1.5rem; text-align: center; border: 1px solid rgba(255,255,255,0.05);">
                        <div style="font-size: 0.7rem; opacity: 0.5; text-transform: uppercase; margin-bottom: 10px;">${txt.net}</div>
                        <div id="sub-out-net" style="font-size: 1.25rem; font-weight: 700; font-family: var(--font-mono); color: var(--primary);"></div>
                    </div>
                    <div class="card" style="padding: 1.5rem; text-align: center; border: 1px solid rgba(255,255,255,0.05);">
                        <div style="font-size: 0.7rem; opacity: 0.5; text-transform: uppercase; margin-bottom: 10px;">${txt.broad}</div>
                        <div id="sub-out-broad" style="font-size: 1.25rem; font-weight: 700; font-family: var(--font-mono); color: #ef4444;"></div>
                    </div>
                    <div class="card" style="padding: 1.5rem; text-align: center; border: 1px solid rgba(255,255,255,0.05);">
                        <div style="font-size: 0.7rem; opacity: 0.5; text-transform: uppercase; margin-bottom: 10px;">${txt.mask}</div>
                        <div id="sub-out-mask" style="font-size: 1.25rem; font-weight: 700; font-family: var(--font-mono); color: #10b981;"></div>
                    </div>
                </div>

                <div class="card" style="padding: 2rem; background: rgba(99, 102, 241, 0.05); border: 1px dashed var(--primary); text-align: center; border-radius: 20px;">
                    <div style="font-size: 0.8rem; text-transform: uppercase; opacity: 0.6; margin-bottom: 15px;">Range & Hosts</div>
                    <div style="display: flex; align-items: center; justify-content: center; gap: 40px;">
                         <div style="text-align: left;">
                            <div style="font-size: 0.65rem; opacity: 0.4;">FIRST HOST</div>
                            <div id="sub-out-first" style="font-size: 1.1rem; font-weight: 700; font-family: var(--font-mono);"></div>
                         </div>
                         <div style="font-size: 2rem; opacity: 0.2;">→</div>
                         <div style="text-align: right;">
                            <div style="font-size: 0.65rem; opacity: 0.4;">LAST HOST</div>
                            <div id="sub-out-last" style="font-size: 1.1rem; font-weight: 700; font-family: var(--font-mono);"></div>
                         </div>
                    </div>
                    
                    <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.05);">
                        <div style="font-size: 0.65rem; opacity: 0.4;">${txt.hosts.toUpperCase()}</div>
                        <div id="sub-out-total" style="font-size: 3rem; font-weight: 900; color: var(--primary);"></div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    setupListeners() {
        const btn = document.getElementById('sub-btn-run');
        const input = document.getElementById('sub-in-cidr');
        const resDiv = document.getElementById('sub-res');

        btn.onclick = () => {
            const val = input.value.trim();
            if (!val) return;

            try {
                const res = this._calculateSubnet(val);
                if (!res.success) throw new Error(res.message);

                document.getElementById('sub-out-net').textContent = res.network;
                document.getElementById('sub-out-broad').textContent = res.broadcast;
                document.getElementById('sub-out-mask').textContent = res.netmask; // Dotted decimal
                document.getElementById('sub-out-first').textContent = res.firstIP;
                document.getElementById('sub-out-last').textContent = res.lastIP;
                document.getElementById('sub-out-total').textContent = res.total.toLocaleString();

                resDiv.style.display = 'block';
                this.showNotification('Calculation complete!', 'success');
            } catch (err) {
                this.showNotification(err.message || 'Invalid CIDR format!', 'error');
            }
        };

        input.onkeypress = (e) => { if (e.key === 'Enter') btn.click(); };
    }

    // INTERNAL LOGIC (Formerly in DevTools.networkTools)

    _calculateSubnet(cidr) {
        try {
            const parts = cidr.split('/');
            const ipArr = parts[0];
            const maskStr = parts[1];

            if (!ipArr || !maskStr) throw new Error("Invalid CIDR format");

            const mask = parseInt(maskStr);
            if (isNaN(mask) || mask < 0 || mask > 32) throw new Error("Invalid Mask (0-32)");

            const ipParts = ipArr.split('.').map(Number);
            if (ipParts.length !== 4 || ipParts.some(n => isNaN(n) || n < 0 || n > 255)) throw new Error("Invalid IP Address");

            // Convert IP to 32-bit number
            const ipNum = (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];

            // Create mask as 32-bit number
            // Fix for mask === 0: (~0 << 32) is undefined in JS usually, it should be 0.
            const maskNum = mask === 0 ? 0 : (~0 << (32 - mask));

            const netNum = ipNum & maskNum;
            const broadNum = netNum | (~maskNum);

            const toIP = (n) => [(n >>> 24) & 0xFF, (n >>> 16) & 0xFF, (n >>> 8) & 0xFF, n & 0xFF].join('.');

            return {
                success: true,
                network: toIP(netNum),
                broadcast: toIP(broadNum),
                netmask: toIP(maskNum),
                firstIP: toIP(netNum + 1),
                lastIP: toIP(broadNum - 1),
                total: Math.max(0, Math.pow(2, 32 - mask) - 2),
                mask: mask
            };
        } catch (e) {
            return { success: false, message: e.message };
        }
    }
}

// Register tool
window.initSubnetCalculatorLogic = SubnetCalculatorTool;
