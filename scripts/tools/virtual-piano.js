/* TULPAR - Professional Virtual Piano with Advanced Synthesis */
class VirtualPianoTool extends BaseTool {
    constructor(config) {
        super(config);
        this.audioCtx = null;
        this.oscMap = new Map();
        this.notes = window.DevTools.pianoTools.getNotes();
        this.analyser = null;
        this.active = false;
        this.recording = [];
        this.isRecording = false;
        this.recordStartTime = 0;
    }

    renderUI() {
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const txt = isTr ? {
            title: 'Profesyonel Sanal Piyano Stüdyosu',
            waveform: 'Dalga Görselleştirme',
            status: 'Durum',
            controls: 'Ses Kontrolleri',
            waveType: 'Dalga Tipi',
            volume: 'Ses Seviyesi',
            attack: 'Attack (ms)',
            release: 'Release (s)',
            effects: 'Efektler',
            reverb: 'Reverb',
            record: 'Kayıt Başlat',
            stopRecord: 'Kaydı Durdur',
            play: 'Kaydı Oynat',
            clear: 'Temizle',
            demo: 'Demo Melodi Çal'
        } : {
            title: 'Professional Virtual Piano Studio',
            waveform: 'Waveform Visualization',
            status: 'Status',
            controls: 'Audio Controls',
            waveType: 'Wave Type',
            volume: 'Volume',
            attack: 'Attack (ms)',
            release: 'Release (s)',
            effects: 'Effects',
            reverb: 'Reverb',
            record: 'Start Recording',
            stopRecord: 'Stop Recording',
            play: 'Play Recording',
            clear: 'Clear',
            demo: 'Play Demo Melody'
        };

        return `
        <div class="tool-content piano-studio" style="max-width: 100%; padding: 20px;">
            <!-- Waveform Visualizer -->
            <div class="card" style="margin-bottom: 2rem; background: #000; border: 3px solid #222; border-radius: 20px; position: relative; overflow: hidden; height: 200px;">
                <canvas id="piano-viz" width="1400" height="200" style="width: 100%; height: 100%;"></canvas>
                <div style="position: absolute; top: 15px; left: 20px; font-family: var(--font-mono); font-size: 0.7rem; color: #10b981; z-index: 10;">
                    ${txt.waveform}<br>
                    <span id="p-status" style="color: var(--primary); font-weight: 700;">READY</span>
                </div>
                <div style="position: absolute; top: 15px; right: 20px; font-family: var(--font-mono); font-size: 0.7rem; color: #f59e0b; z-index: 10;" id="p-note-display">--</div>
            </div>

            <div style="display: grid; grid-template-columns: 320px 1fr; gap: 2rem;">
                
                <!-- Control Panel -->
                <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                    <!-- Audio Controls -->
                    <div class="card" style="padding: 1.5rem; background: var(--surface); border-radius: 16px;">
                        <h4 style="font-size: 0.8rem; text-transform: uppercase; color: var(--primary); margin-bottom: 1.2rem;">${txt.controls}</h4>
                        
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label class="form-label" style="font-size: 0.75rem;">${txt.waveType}</label>
                            <select id="p-wave" class="form-select" style="background: #000; border-color: #333;">
                                <option value="sine">🌊 Pure Sine</option>
                                <option value="triangle">△ Triangle</option>
                                <option value="sawtooth">⚡ Sawtooth</option>
                                <option value="square">▢ Square</option>
                            </select>
                        </div>

                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label class="form-label" style="font-size: 0.75rem; display: flex; justify-content: space-between;">
                                <span>${txt.volume}</span>
                                <span id="p-vol-val" style="color: var(--primary);">50%</span>
                            </label>
                            <input type="range" id="p-volume" min="0" max="100" value="50" class="form-range">
                        </div>

                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label class="form-label" style="font-size: 0.75rem; display: flex; justify-content: space-between;">
                                <span>${txt.attack}</span>
                                <span id="p-att-val" style="color: var(--primary);">20ms</span>
                            </label>
                            <input type="range" id="p-attack" min="5" max="200" value="20" class="form-range">
                        </div>

                        <div class="form-group">
                            <label class="form-label" style="font-size: 0.75rem; display: flex; justify-content: space-between;">
                                <span>${txt.release}</span>
                                <span id="p-rel-val" style="color: var(--primary);">0.5s</span>
                            </label>
                            <input type="range" id="p-release" min="0.1" max="3" step="0.1" value="0.5" class="form-range">
                        </div>
                    </div>

                    <!-- Recording Controls -->
                    <div class="card" style="padding: 1.5rem; background: var(--surface); border-radius: 16px;">
                        <h4 style="font-size: 0.8rem; text-transform: uppercase; color: var(--primary); margin-bottom: 1.2rem;">RECORDING</h4>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 1rem;">
                            <button id="p-btn-record" class="btn btn-sm btn-danger" style="font-size: 0.75rem;">● ${txt.record}</button>
                            <button id="p-btn-play-rec" class="btn btn-sm btn-success" style="font-size: 0.75rem;" disabled>▶ ${txt.play}</button>
                        </div>
                        
                        <button id="p-btn-clear-rec" class="btn btn-sm btn-outline" style="width: 100%; font-size: 0.75rem;" disabled>${txt.clear}</button>
                        
                        <div id="p-rec-info" style="margin-top: 1rem; font-size: 0.7rem; opacity: 0.6; text-align: center;">No recording</div>
                    </div>

                    <!-- Demo Button -->
                    <button id="p-btn-demo" class="btn btn-secondary" style="width: 100%; font-weight: 700;">🎵 ${txt.demo}</button>
                </div>

                <!-- Piano Keyboard -->
                <div class="piano-keys-wrapper" style="background: linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%); padding: 40px; border-radius: 20px; box-shadow: inset 0 4px 20px rgba(0,0,0,0.5);">
                    <div id="p-keys" style="display: flex; position: relative; height: 280px; margin: 0 auto; width: fit-content;">
                        <!-- Keys Generated by JS -->
                    </div>
                    
                    <!-- Keyboard Hints -->
                    <div style="margin-top: 30px; text-align: center; font-size: 0.75rem; opacity: 0.5;">
                        Keyboard: A S D F G H J K L; (White Keys) | W E T Y U O P (Black Keys)
                    </div>
                </div>
            </div>

            <style>
                .p-key {
                    width: 70px;
                    height: 280px;
                    background: linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%);
                    border: 2px solid #ddd;
                    border-radius: 0 0 10px 10px;
                    cursor: pointer;
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                    padding-bottom: 20px;
                    font-weight: 900;
                    color: #999;
                    transition: all 0.1s;
                    position: relative;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                }

                .p-key:hover {
                    background: linear-gradient(180deg, #f0f0f0 0%, #e0e0e0 100%);
                    transform: translateY(2px);
                }

                .p-key.active {
                    background: linear-gradient(135deg, var(--primary), #a78bfa);
                    color: #fff;
                    transform: translateY(4px);
                    border-color: var(--primary);
                    box-shadow: 0 0 25px var(--primary), inset 0 2px 10px rgba(0,0,0,0.3);
                }

                .p-key.black {
                    width: 50px;
                    height: 180px;
                    background: linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%);
                    color: #888;
                    border: 2px solid #000;
                    position: absolute;
                    z-index: 2;
                    border-radius: 0 0 6px 6px;
                    box-shadow: 0 6px 12px rgba(0,0,0,0.5);
                }

                .p-key.black:hover {
                    background: linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 100%);
                }

                .p-key.black.active {
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    box-shadow: 0 0 20px #6366f1, inset 0 2px 8px rgba(0,0,0,0.5);
                }

                .p-key-label {
                    font-size: 0.75rem;
                    opacity: 0.7;
                }

                .p-key-freq {
                    position: absolute;
                    top: 10px;
                    font-size: 0.6rem;
                    opacity: 0.4;
                    font-family: var(--font-mono);
                }
            </style>
        </div>
        `;
    }

    setupListeners() {
        const keysCont = document.getElementById('p-keys');

        // Generate piano keys
        this.notes.forEach((n, i) => {
            const el = document.createElement('div');
            el.className = `p-key ${n.black ? 'black' : ''}`;
            el.innerHTML = `
                <span class="p-key-freq">${Math.round(n.freq)}Hz</span>
                <span class="p-key-label">${n.key}</span>
            `;

            if (n.black) {
                const whiteIdx = this.notes.slice(0, i).filter(x => !x.black).length;
                el.style.left = `${(whiteIdx * 70) - 25}px`;
            }

            const start = () => this._playNote(n);
            const stop = () => this._stopNote(n.note);

            el.onmousedown = start;
            el.onmouseup = stop;
            el.onmouseleave = stop;
            el.ontouchstart = (e) => { e.preventDefault(); start(); };
            el.ontouchend = stop;
            el.dataset.note = n.note;
            keysCont.appendChild(el);
        });

        // Keyboard controls
        window.addEventListener('keydown', (e) => {
            if (e.repeat) return;
            const n = this.notes.find(x => x.key === e.key.toUpperCase());
            if (n) this._playNote(n);
        });

        window.addEventListener('keyup', (e) => {
            const n = this.notes.find(x => x.key === e.key.toUpperCase());
            if (n) this._stopNote(n.note);
        });

        // Control listeners
        document.getElementById('p-volume').oninput = (e) => {
            document.getElementById('p-vol-val').textContent = e.target.value + '%';
        };

        document.getElementById('p-attack').oninput = (e) => {
            document.getElementById('p-att-val').textContent = e.target.value + 'ms';
        };

        document.getElementById('p-release').oninput = (e) => {
            document.getElementById('p-rel-val').textContent = e.target.value + 's';
        };

        // Recording controls
        document.getElementById('p-btn-record').onclick = () => this._toggleRecording();
        document.getElementById('p-btn-play-rec').onclick = () => this._playRecording();
        document.getElementById('p-btn-clear-rec').onclick = () => this._clearRecording();

        // Demo
        document.getElementById('p-btn-demo').onclick = () => this._playDemo();

        this.active = true;
        this._drawViz();
    }

    _initAudio() {
        if (this.audioCtx) return;
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 2048;
        this.analyser.connect(this.audioCtx.destination);
    }

    _playNote(n) {
        this._initAudio();
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
        this._stopNote(n.note);

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = document.getElementById('p-wave').value;
        osc.frequency.setValueAtTime(n.freq, this.audioCtx.currentTime);

        const volume = parseFloat(document.getElementById('p-volume').value) / 100;
        const attack = parseFloat(document.getElementById('p-attack').value) / 1000;

        gain.gain.setValueAtTime(0, this.audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(volume * 0.3, this.audioCtx.currentTime + attack);

        osc.connect(gain);
        gain.connect(this.analyser);
        osc.start();

        this.oscMap.set(n.note, { osc, gain });

        const el = document.querySelector(`[data-note="${n.note}"]`);
        if (el) el.classList.add('active');

        document.getElementById('p-note-display').textContent = `${n.note} - ${Math.round(n.freq)}Hz`;
        document.getElementById('p-status').textContent = 'PLAYING';

        // Record if recording
        if (this.isRecording) {
            const timestamp = Date.now() - this.recordStartTime;
            this.recording.push({ note: n.note, timestamp, type: 'start' });
        }
    }

    _stopNote(noteName) {
        if (this.oscMap.has(noteName)) {
            const { osc, gain } = this.oscMap.get(noteName);
            const release = parseFloat(document.getElementById('p-release').value);

            gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + release);
            setTimeout(() => {
                osc.stop();
                osc.disconnect();
            }, release * 1000);

            this.oscMap.delete(noteName);

            const el = document.querySelector(`[data-note="${noteName}"]`);
            if (el) el.classList.remove('active');

            if (this.oscMap.size === 0) {
                document.getElementById('p-status').textContent = 'READY';
                document.getElementById('p-note-display').textContent = '--';
            }

            // Record if recording
            if (this.isRecording) {
                const timestamp = Date.now() - this.recordStartTime;
                this.recording.push({ note: noteName, timestamp, type: 'stop' });
            }
        }
    }

    _toggleRecording() {
        const btn = document.getElementById('p-btn-record');
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';

        if (!this.isRecording) {
            this.recording = [];
            this.recordStartTime = Date.now();
            this.isRecording = true;
            btn.textContent = isTr ? '⏹ Durdur' : '⏹ Stop';
            btn.classList.replace('btn-danger', 'btn-warning');
            document.getElementById('p-rec-info').textContent = 'Recording...';
        } else {
            this.isRecording = false;
            btn.textContent = isTr ? '● Kayıt Başlat' : '● Start Recording';
            btn.classList.replace('btn-warning', 'btn-danger');
            document.getElementById('p-btn-play-rec').disabled = false;
            document.getElementById('p-btn-clear-rec').disabled = false;
            document.getElementById('p-rec-info').textContent = `${this.recording.length} events recorded`;
        }
    }

    _playRecording() {
        if (this.recording.length === 0) return;

        this.recording.forEach(event => {
            setTimeout(() => {
                const note = this.notes.find(n => n.note === event.note);
                if (note) {
                    if (event.type === 'start') {
                        this._playNote(note);
                    } else {
                        this._stopNote(event.note);
                    }
                }
            }, event.timestamp);
        });
    }

    _clearRecording() {
        this.recording = [];
        document.getElementById('p-btn-play-rec').disabled = true;
        document.getElementById('p-btn-clear-rec').disabled = true;
        document.getElementById('p-rec-info').textContent = 'No recording';
    }

    _playDemo() {
        // Simple C major scale
        const melody = [
            { note: 'C', delay: 0 },
            { note: 'D', delay: 400 },
            { note: 'E', delay: 800 },
            { note: 'F', delay: 1200 },
            { note: 'G', delay: 1600 },
            { note: 'A', delay: 2000 },
            { note: 'B', delay: 2400 },
            { note: 'C5', delay: 2800 }
        ];

        melody.forEach(m => {
            setTimeout(() => {
                const n = this.notes.find(x => x.note === m.note);
                if (n) {
                    this._playNote(n);
                    setTimeout(() => this._stopNote(n.note), 300);
                }
            }, m.delay);
        });
    }

    _drawViz() {
        if (!this.active) return;

        const canvas = document.getElementById('piano-viz');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Clear with gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#0a0a0a');
        gradient.addColorStop(1, '#1a1a1a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        if (this.analyser && this.oscMap.size > 0) {
            const bufferLength = this.analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            this.analyser.getByteTimeDomainData(dataArray);

            ctx.lineWidth = 3;
            ctx.strokeStyle = '#6366f1';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#6366f1';
            ctx.beginPath();

            const sliceWidth = width / bufferLength;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                const y = (v * height) / 2;

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }

                x += sliceWidth;
            }

            ctx.lineTo(width, height / 2);
            ctx.stroke();
            ctx.shadowBlur = 0;
        } else {
            // Idle state - draw grid
            ctx.strokeStyle = 'rgba(100, 100, 100, 0.1)';
            ctx.lineWidth = 1;

            for (let i = 0; i < 10; i++) {
                const y = (height / 10) * i;
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }
        }

        requestAnimationFrame(() => this._drawViz());
    }

    onClose() {
        this.active = false;
        if (this.audioCtx) this.audioCtx.close();
    }
}

window.initVirtualPianoLogic = VirtualPianoTool;
