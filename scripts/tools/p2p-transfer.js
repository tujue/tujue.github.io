/* TULPAR - P2P File Transfer Tool OOP Implementation */
class P2PTransferTool extends BaseTool {
    constructor(config) {
        super(config);
        this.peer = null;
        this.conn = null;
    }

    renderUI() {
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const txt = isTr ? {
            title: 'Hızlı P2P Dosya Transferi',
            subtitle: 'Sunucu olmadan, doğrudan tarayıcıdan tarayıcıya güvenli paylaşım.',
            myId: 'Sizin Bağlantı Kimliğiniz',
            remoteId: 'Bağlanılacak Kimlik',
            connect: 'Bağlantı Kur ⚡',
            instruction: 'Bağlantı için bu ID\'yi partnerinize gönderin.',
            share: 'Dosya Paylaş',
            drop: 'Dosyaları sürükleyin veya seçin',
            activity: 'Transfer Aktivitesi',
            online: 'Çevrimiçi',
            offline: 'Çevrimdışı'
        } : {
            title: 'Rapid P2P File Transfer',
            subtitle: 'Direct browser-to-browser secure sharing without servers.',
            myId: 'Your Connection ID',
            remoteId: 'Partner Connection ID',
            connect: 'Establish Connection ⚡',
            instruction: 'Share this ID with your partner to connect.',
            share: 'Share Files',
            drop: 'Drop files here or click to select',
            activity: 'Transfer Activity',
            online: 'Online',
            offline: 'Offline'
        };

        return `
        <div class="tool-content p2p-studio" style="max-width: 1000px; margin: 0 auto; padding: 20px;">
            <div id="p2p-setup" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                
                <!-- ID Panel -->
                <div class="card" style="padding: 2rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 20px; text-align: center;">
                    <div id="p2p-status" style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 20px; font-size: 0.7rem; font-weight: 700; margin-bottom: 1.5rem; background: rgba(0,0,0,0.2); color: #94a3b8;">
                        <span style="width:8px; height:8px; border-radius:50%; background:#94a3b8;"></span> ${txt.offline}
                    </div>
                    <h4 style="margin-bottom: 0.5rem;">${txt.myId}</h4>
                    <div id="p2p-id-val" style="font-family: var(--font-mono); font-size: 1.5rem; color: var(--primary); background: rgba(0,0,0,0.1); padding: 1rem; border-radius: 12px; margin-bottom: 1.5rem; letter-spacing: 2px;">...</div>
                    <canvas id="p2p-qr-out" style="background: white; padding: 12px; border-radius: 12px; margin: 0 auto; display: block; box-shadow: 0 10px 30px rgba(0,0,0,0.2);"></canvas>
                    <p style="font-size: 0.8rem; opacity: 0.6; margin-top: 1.5rem;">${txt.instruction}</p>
                </div>

                <!-- Connect Panel -->
                <div class="card" style="padding: 2rem; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 20px; display: flex; flex-direction: column; justify-content: center;">
                    <h3 style="margin-bottom: 1rem; color: var(--primary);">${txt.title}</h3>
                    <p style="margin-bottom: 2rem; font-size: 0.9rem; opacity: 0.7;">${txt.subtitle}</p>
                    
                    <div class="form-group">
                        <label class="form-label">${txt.remoteId}</label>
                        <input type="text" id="p2p-remote-in" class="form-input" style="height: 4rem; text-align: center; font-size: 1.2rem; font-family: var(--font-mono);" placeholder="Partner ID...">
                    </div>
                    <button id="p2p-btn-conn" class="btn btn-primary" style="width: 100%; height: 4rem; font-weight: 700; font-size: 1.1rem; margin-top: 1.5rem;">${txt.connect}</button>
                </div>
            </div>

            <div id="p2p-active" style="display: none; flex-direction: column; gap: 1.5rem;">
                <!-- Transfer Panel -->
                <div class="card" style="padding: 2rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 20px;">
                    <h4 style="margin-bottom: 1.5rem;">${txt.share}</h4>
                    <div id="p2p-drop" class="dropzone" style="height: 180px; border: 2px dashed var(--border-color); border-radius: 16px; display: flex; flex-direction: column; justify-content: center; align-items: center; cursor: pointer; background: rgba(0,0,0,0.1); transition: all 0.3s ease;">
                        <div style="font-size: 3rem; margin-bottom: 10px;">📦</div>
                        <p style="opacity: 0.6;">${txt.drop}</p>
                        <input type="file" id="p2p-in-file" hidden multiple>
                    </div>
                </div>

                <!-- Log Panel -->
                <div class="card" style="padding: 1.5rem; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 20px; flex: 1; display: flex; flex-direction: column; min-height: 300px;">
                    <h5 style="margin-bottom: 1rem; font-size: 0.8rem; text-transform: uppercase; opacity: 0.5;">${txt.activity}</h5>
                    <div id="p2p-msgs" style="flex: 1; overflow-y: auto; max-height: 400px; padding-right: 10px; font-family: var(--font-mono); font-size: 0.85rem;"></div>
                </div>
            </div>
        </div>
        `;
    }

    setupListeners() {
        if (typeof Peer === 'undefined') {
            this.showNotification('PeerJS loading...', 'info');
            return;
        }

        const setup = document.getElementById('p2p-setup');
        const active = document.getElementById('p2p-active');
        const idVal = document.getElementById('p2p-id-val');
        const status = document.getElementById('p2p-status');
        const qrCanvas = document.getElementById('p2p-qr-out');
        const btnConn = document.getElementById('p2p-btn-conn');
        const remoteIn = document.getElementById('p2p-remote-in');

        const drop = document.getElementById('p2p-drop');
        const inFile = document.getElementById('p2p-in-file');
        const msgs = document.getElementById('p2p-msgs');

        this.peer = new Peer(null, { debug: 1 });

        this.peer.on('open', (id) => {
            idVal.textContent = id;
            status.innerHTML = `<span style="width:8px; height:8px; border-radius:50%; background:#10b981;"></span> Online`;
            status.style.color = '#10b981';

            if (window.QRious) {
                new QRious({ element: qrCanvas, value: id, size: 200, level: 'H' });
            }
        });

        this.peer.on('connection', (c) => this._handleConnection(c));

        this.peer.on('error', (err) => {
            this.showNotification(`Peer Error: ${err.type}`, 'error');
            status.innerHTML = `<span style="width:8px; height:8px; border-radius:50%; background:#ef4444;"></span> Error`;
            status.style.color = '#ef4444';
        });

        btnConn.onclick = () => {
            const rid = remoteIn.value.trim();
            if (!rid) return;
            const c = this.peer.connect(rid);
            btnConn.textContent = 'Connecting...';
            c.on('open', () => this._handleConnection(c));
            c.on('error', (e) => {
                this.showNotification('Connection failed', 'error');
                btnConn.textContent = 'Establish Connection ⚡';
            });
        };

        drop.onclick = () => inFile.click();
        inFile.onchange = (e) => {
            if (!this.conn) return;
            Array.from(e.target.files).forEach(file => {
                this._log(`📤 Sending: ${file.name}`, 'sent');
                this.conn.send({ file: file, name: file.name, type: file.type });
            });
        };
    }

    _handleConnection(c) {
        this.conn = c;
        document.getElementById('p2p-setup').style.display = 'none';
        document.getElementById('p2p-active').style.display = 'flex';
        this._log(`⚡ Connection Established: ${c.peer}`, 'system');

        this.conn.on('data', (data) => {
            if (data.file && data.name) {
                this._log(`📥 Received: ${data.name}`, 'recv');
                const blob = new Blob([data.file], { type: data.type });
                const url = URL.createObjectURL(blob);

                const card = document.createElement('div');
                card.style.cssText = 'background: rgba(16, 185, 129, 0.1); padding: 12px; border-radius: 8px; margin: 10px 0; border: 1px solid rgba(16, 185, 129, 0.2);';
                card.innerHTML = `
                    <div style="font-weight: 700; font-size: 0.8rem; margin-bottom: 5px;">File Received</div>
                    <div style="font-family: var(--font-mono); font-size: 0.75rem; margin-bottom: 10px;">${data.name}</div>
                    <a href="${url}" download="${data.name}" class="btn btn-sm btn-primary" style="text-decoration: none;">Download 💾</a>
                `;
                document.getElementById('p2p-msgs').appendChild(card);
            }
        });

        this.conn.on('close', () => {
            this._log('❌ Peer Disconnected', 'system');
            this.conn = null;
        });
    }

    _log(msg, type) {
        const div = document.createElement('div');
        div.style.cssText = 'margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.05);';
        const colors = { sent: '#60a5fa', recv: '#4ade80', system: '#94a3b8' };
        div.innerHTML = `<span style="color: ${colors[type] || '#fff'};">[${type.toUpperCase()}]</span> ${msg}`;
        const container = document.getElementById('p2p-msgs');
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    }
}

// Register tool
window.initP2PLogic = P2PTransferTool;
