/* TULPAR - Gamepad Tester - Single Column Responsive Layout */
class GamepadTesterTool extends BaseTool {
    constructor(config) {
        super(config);
        this.gamepadIndex = null;
        this.animationLoop = null;
        this.prevButtons = [];
        this.points = { left: [], right: [] };
        this.ctx = { left: null, right: null };
        this._onConnected = this._onConnected.bind(this);
        this._onDisconnected = this._onDisconnected.bind(this);
    }

    renderUI() {
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const txt = isTr ? {
            wait: 'Oyun kumandası bekleniyor... Herhangi bir tuşa basınız.',
            rumble: 'Titreşim Testi',
            clear: 'Temizle'
        } : {
            wait: 'Waiting for controller... Press any button.',
            rumble: 'Haptic Test',
            clear: 'Clear'
        };

        return `
        <div class="tool-content gptester" style="max-width: 1200px; margin: 0 auto; padding: 20px;">
            <!-- Status -->
            <div id="gp-status-bar" class="card" style="padding: 1.2rem; text-align: center; border: 2px dashed var(--border-color); border-radius: 16px; margin-bottom: 1.5rem; font-weight: 700; opacity: 0.6; font-size: 0.9rem;">
                ${txt.wait}
            </div>

            <!-- Controller Visual -->
            <div class="card" style="background: var(--surface); padding: 2.5rem 1.5rem; border-radius: 20px; border: 1px solid var(--border-color); margin-bottom: 1.5rem; overflow-x: auto;">
                <div style="min-width: 700px; margin: 0 auto; position: relative; display: flex; justify-content: center;">
                    <!-- Main Controller Body -->
                    <div style="position: relative; width: 700px; height: 350px; background: rgba(0,0,0,0.15); border-radius: 120px; border: 3px solid rgba(255,255,255,0.08);">
                        
                        <!-- Triggers Top -->
                        <div style="position: absolute; top: -10px; left: 120px; display: flex; gap: 12px;">
                            <div id="gp-b-4" class="gp-bar">L1</div>
                            <div id="gp-b-6" class="gp-bar" style="height: 55px;">L2</div>
                        </div>
                        <div style="position: absolute; top: -10px; right: 120px; display: flex; flex-direction: row-reverse; gap: 12px;">
                            <div id="gp-b-5" class="gp-bar">R1</div>
                            <div id="gp-b-7" class="gp-bar" style="height: 55px;">R2</div>
                        </div>

                        <!-- D-Pad (Left) -->
                        <div style="position: absolute; left: 100px; top: 120px; display: grid; grid-template-columns: repeat(3, 35px); gap: 10px;">
                            <div></div>
                            <div id="gp-b-12" class="gp-node dpad">⬆️</div>
                            <div></div>
                            <div id="gp-b-14" class="gp-node dpad">⬅️</div>
                            <div></div>
                            <div id="gp-b-15" class="gp-node dpad">➡️</div>
                            <div></div>
                            <div id="gp-b-13" class="gp-node dpad">⬇️</div>
                        </div>
                        
                        <!-- Face Buttons (Right - ABXY) -->
                        <div style="position: absolute; right: 100px; top: 115px; display: grid; grid-template-columns: repeat(3, 45px); gap: 12px;">
                            <div></div>
                            <div id="gp-b-3" class="gp-node btn">Y</div>
                            <div></div>
                            <div id="gp-b-2" class="gp-node btn">X</div>
                            <div></div>
                            <div id="gp-b-1" class="gp-node btn">B</div>
                            <div></div>
                            <div id="gp-b-0" class="gp-node btn">A</div>
                        </div>

                        <!-- Analog Sticks with Click Detection -->
                        <div style="position: absolute; left: 180px; bottom: 85px;">
                            <div style="width: 85px; height: 85px; background: #000; border-radius: 50%; border: 3px solid #333; position: relative;">
                                <div id="gp-s-left" class="gp-stick-hub"></div>
                                <div id="gp-b-10" class="gp-stick-label">L3</div>
                            </div>
                        </div>
                        <div style="position: absolute; right: 180px; bottom: 85px;">
                            <div style="width: 85px; height: 85px; background: #000; border-radius: 50%; border: 3px solid #333; position: relative;">
                                <div id="gp-s-right" class="gp-stick-hub"></div>
                                <div id="gp-b-11" class="gp-stick-label">R3</div>
                            </div>
                        </div>

                        <!-- Center Buttons -->
                        <div style="position: absolute; left: 50%; top: 130px; transform: translateX(-50%); display: flex; gap: 20px; align-items: center;">
                            <div id="gp-b-8" class="gp-node center-btn">◀◀</div>
                            <div id="gp-b-16" class="gp-node home-btn">⌂</div>
                            <div id="gp-b-9" class="gp-node center-btn">▶▶</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Analytics Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
                <!-- Left Stick Analysis -->
                <div class="card" style="padding: 1.5rem; background: var(--surface); border-radius: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h5 style="font-size: 0.8rem; text-transform: uppercase; font-weight: 700; color: var(--primary);">LEFT STICK (L3)</h5>
                        <button id="gp-clr-l" class="btn btn-sm btn-outline" style="font-size: 0.65rem; padding: 5px 12px;">${txt.clear}</button>
                    </div>
                    <canvas id="gp-cvs-l" width="240" height="240" style="width: 100%; max-width: 240px; height: auto; aspect-ratio: 1; background: #000; border-radius: 50%; border: 3px solid #222; margin: 0 auto; display: block;"></canvas>
                    <div style="margin-top: 12px; display: flex; justify-content: space-between; font-size: 0.75rem;">
                        <span id="gp-val-l" style="font-family: var(--font-mono); color: var(--primary);">0.000, 0.000</span>
                        <span style="color: #ef4444;">Error: <span id="gp-err-l">0.0%</span></span>
                    </div>
                </div>

                <!-- Right Stick Analysis -->
                <div class="card" style="padding: 1.5rem; background: var(--surface); border-radius: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h5 style="font-size: 0.8rem; text-transform: uppercase; font-weight: 700; color: #10b981;">RIGHT STICK (R3)</h5>
                        <button id="gp-clr-r" class="btn btn-sm btn-outline" style="font-size: 0.65rem; padding: 5px 12px;">${txt.clear}</button>
                    </div>
                    <canvas id="gp-cvs-r" width="240" height="240" style="width: 100%; max-width: 240px; height: auto; aspect-ratio: 1; background: #000; border-radius: 50%; border: 3px solid #222; margin: 0 auto; display: block;"></canvas>
                    <div style="margin-top: 12px; display: flex; justify-content: space-between; font-size: 0.75rem;">
                        <span id="gp-val-r" style="font-family: var(--font-mono); color: #10b981;">0.000, 0.000</span>
                        <span style="color: #ef4444;">Error: <span id="gp-err-r">0.0%</span></span>
                    </div>
                </div>

                <!-- Rumble Test -->
                <div class="card" style="padding: 1.5rem; background: var(--surface); border-radius: 16px; display: flex; align-items: center; justify-content: center;">
                    <button id="gp-btn-rumble" class="btn btn-primary" style="width: 100%; height: 80px; font-weight: 700; font-size: 1rem;">📳 ${txt.rumble}</button>
                </div>
            </div>
            
            <style>
                .gp-node { 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    border: 2px solid rgba(255,255,255,0.25); 
                    border-radius: 10px; 
                    font-size: 0.7rem; 
                    color: #666; 
                    transition: all 0.12s; 
                    background: rgba(0,0,0,0.25); 
                }
                .gp-node.pressed, .gp-node.active { 
                    background: var(--primary); 
                    color: white; 
                    border-color: white; 
                    box-shadow: 0 0 15px var(--primary); 
                    transform: scale(0.95);
                }
                .gp-node.btn { 
                    border-radius: 50%; 
                    width: 45px; 
                    height: 45px; 
                    font-size: 0.9rem; 
                    font-weight: 700; 
                }
                .gp-node.dpad { 
                    width: 35px; 
                    height: 35px; 
                    font-size: 1.1rem; 
                }
                .gp-node.center-btn {
                    width: 50px;
                    height: 22px;
                    font-size: 0.55rem;
                    border-radius: 6px;
                }
                .gp-node.home-btn {
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    background: var(--primary);
                    color: white;
                    font-size: 1.2rem;
                }
                .gp-bar { 
                    width: 55px; 
                    height: 16px; 
                    background: rgba(0,0,0,0.35); 
                    border: 2px solid rgba(255,255,255,0.25); 
                    border-radius: 6px; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    font-size: 0.6rem; 
                    color: #555;
                    transition: 0.12s;
                }
                .gp-bar.active { 
                    background: var(--primary); 
                    color: white; 
                    border-color: white; 
                }
                .gp-stick-hub { 
                    position: absolute; 
                    top: 50%; 
                    left: 50%; 
                    width: 50px; 
                    height: 50px; 
                    background: linear-gradient(135deg, #444, #222); 
                    border: 3px solid #111; 
                    border-radius: 50%; 
                    transform: translate(-50%, -50%); 
                    transition: all 0.15s;
                    box-shadow: inset 0 2px 5px rgba(0,0,0,0.5);
                }
                .gp-stick-hub.pressed {
                    border-color: var(--primary);
                    box-shadow: 0 0 15px var(--primary), inset 0 2px 5px rgba(0,0,0,0.5);
                    transform: translate(-50%, -50%) scale(0.95);
                }
                .gp-stick-label {
                    position: absolute;
                    bottom: 5px;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: 0.6rem;
                    color: #555;
                    font-weight: 700;
                    pointer-events: none;
                    transition: color 0.15s;
                }
                .gp-stick-label.pressed {
                    color: var(--primary);
                }
            </style>
        </div>
        `;
    }

    setupListeners() {
        this.ctx.left = document.getElementById('gp-cvs-l').getContext('2d');
        this.ctx.right = document.getElementById('gp-cvs-r').getContext('2d');

        window.addEventListener("gamepadconnected", this._onConnected);
        window.addEventListener("gamepaddisconnected", this._onDisconnected);

        document.getElementById('gp-clr-l').onclick = () => { this.points.left = []; this._clearCvs('left'); };
        document.getElementById('gp-clr-r').onclick = () => { this.points.right = []; this._clearCvs('right'); };
        document.getElementById('gp-btn-rumble').onclick = () => this._testRumble();

        const gps = navigator.getGamepads();
        for (const gp of gps) if (gp) { this._onConnected({ gamepad: gp }); break; }
    }

    _onConnected(e) {
        this.gamepadIndex = e.gamepad.index;
        const bar = document.getElementById('gp-status-bar');
        if (bar) {
            bar.textContent = `🎮 ${e.gamepad.id}`;
            bar.style.opacity = '1';
            bar.style.borderColor = 'var(--primary)';
            bar.style.color = 'var(--primary)';
        }
        if (!this.animationLoop) this._loop();
    }

    _onDisconnected(e) {
        if (this.gamepadIndex === e.gamepad.index) {
            this.gamepadIndex = null;
            const bar = document.getElementById('gp-status-bar');
            if (bar) {
                const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
                bar.textContent = isTr ? 'Kumanda bağlantısı kesildi' : 'Controller Disconnected';
                bar.style.opacity = '0.6';
                bar.style.borderColor = 'var(--border-color)';
                bar.style.color = '';
            }
        }
    }

    _loop() {
        if (this.gamepadIndex === null) return;
        const gp = navigator.getGamepads()[this.gamepadIndex];
        if (!gp || !document.getElementById('gp-status-bar')) return;

        // Standard Gamepad Mapping (Xbox/PlayStation compatible)
        gp.buttons.forEach((b, i) => {
            const el = document.getElementById(`gp-b-${i}`);
            if (el) {
                if (b.pressed) {
                    el.classList.add(i < 8 ? 'active' : 'pressed');
                } else {
                    el.classList.remove('active', 'pressed');
                }
            }
            this.prevButtons[i] = b.pressed;
        });

        // L3/R3 Stick Click Detection (Button 10 & 11)
        const leftHub = document.getElementById('gp-s-left');
        const rightHub = document.getElementById('gp-s-right');
        const leftLabel = document.querySelector('#gp-b-10');
        const rightLabel = document.querySelector('#gp-b-11');

        if (gp.buttons[10] && gp.buttons[10].pressed) {
            leftHub?.classList.add('pressed');
            leftLabel?.classList.add('pressed');
        } else {
            leftHub?.classList.remove('pressed');
            leftLabel?.classList.remove('pressed');
        }

        if (gp.buttons[11] && gp.buttons[11].pressed) {
            rightHub?.classList.add('pressed');
            rightLabel?.classList.add('pressed');
        } else {
            rightHub?.classList.remove('pressed');
            rightLabel?.classList.remove('pressed');
        }

        this._updateStick(gp.axes[0] || 0, gp.axes[1] || 0, 'left');
        this._updateStick(gp.axes[2] || 0, gp.axes[3] || 0, 'right');

        this.animationLoop = requestAnimationFrame(() => this._loop());
    }

    _updateStick(x, y, side) {
        const hub = document.getElementById(`gp-s-${side}`);
        if (hub) hub.style.transform = `translate(calc(-50% + ${x * 25}px), calc(-50% + ${y * 25}px))`;

        const val = document.getElementById(`gp-val-${side}`);
        if (val) val.textContent = `${x.toFixed(3)}, ${y.toFixed(3)}`;

        const ctx = this.ctx[side];
        if (ctx) {
            const cx = (x + 1) * 120;
            const cy = (y + 1) * 120;
            ctx.fillStyle = 'rgba(99, 102, 241, 0.6)';
            ctx.fillRect(cx - 1.5, cy - 1.5, 3, 3);
        }

        const dist = Math.sqrt(x * x + y * y);
        if (dist > 0.8) {
            this.points[side].push(Math.abs(1 - dist));
            if (this.points[side].length > 400) this.points[side].shift();
            const err = document.getElementById(`gp-err-${side}`);
            if (err) {
                const avg = this.points[side].reduce((a, b) => a + b, 0) / this.points[side].length;
                err.textContent = (avg * 100).toFixed(1) + '%';
            }
        }
    }

    _clearCvs(side) {
        const ctx = this.ctx[side];
        ctx.clearRect(0, 0, 240, 240);
        document.getElementById(`gp-err-${side}`).textContent = '0.0%';
    }

    _testRumble() {
        if (this.gamepadIndex === null) return this.showNotification('No gamepad connected', 'error');
        const gp = navigator.getGamepads()[this.gamepadIndex];
        if (gp && gp.vibrationActuator) {
            gp.vibrationActuator.playEffect("dual-rumble", {
                startDelay: 0,
                duration: 1000,
                weakMagnitude: 1.0,
                strongMagnitude: 1.0
            });
        } else {
            this.showNotification('Haptic feedback not supported', 'warning');
        }
    }

    onClose() {
        window.removeEventListener("gamepadconnected", this._onConnected);
        window.removeEventListener("gamepaddisconnected", this._onDisconnected);
        if (this.animationLoop) cancelAnimationFrame(this.animationLoop);
    }
}

window.initGamepadTesterLogic = GamepadTesterTool;
