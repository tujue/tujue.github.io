/* TULPAR - Professional Virtual Piano with Advanced Synthesis */
class VirtualPianoTool extends BaseTool {
    constructor(config) {
        super(config);
        this.audioCtx = null;
        this.oscMap = new Map();
        this.notes = this._getNotes(); // Local notes generation
        this.analyser = null;
        this.active = false;
        this.recording = [];
        this.isRecording = false;
        this.recordStartTime = 0;
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.recordedAudioBlob = null;
        this.demoTimeouts = [];
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
            download: 'İndir (MIDI)',
            downloadAudio: 'Sesi İndir',
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
            download: 'Download (MIDI)',
            downloadAudio: 'Download Audio',
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
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 1rem;">
                            <button id="p-btn-download-rec" class="btn btn-sm btn-primary" style="font-size: 0.75rem;" disabled>💾 ${txt.download}</button>
                            <button id="p-btn-download-audio" class="btn btn-sm btn-success" style="font-size: 0.75rem;" disabled>🎵 ${txt.downloadAudio}</button>
                        </div>
                        
                        <button id="p-btn-clear-rec" class="btn btn-sm btn-outline" style="width: 100%; font-size: 0.75rem; margin-bottom: 1rem;" disabled>${txt.clear}</button>
                        
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
        document.getElementById('p-btn-download-rec').onclick = () => this._downloadRecording();
        document.getElementById('p-btn-download-audio').onclick = () => this._downloadAudio();
        document.getElementById('p-btn-clear-rec').onclick = () => this._clearRecording();

        // Demo
        document.getElementById('p-btn-demo').onclick = () => this._playDemo();

        this.active = true;
        this._drawViz();
    }

    // INTERNAL LOGIC (Formerly in DevTools.pianoTools)

    _getNotes() {
        return [
            { note: 'C4', freq: 261.63, key: 'A', black: false },
            { note: 'C#4', freq: 277.18, key: 'W', black: true },
            { note: 'D4', freq: 293.66, key: 'S', black: false },
            { note: 'D#4', freq: 311.13, key: 'E', black: true },
            { note: 'E4', freq: 329.63, key: 'D', black: false },
            { note: 'F4', freq: 349.23, key: 'F', black: false },
            { note: 'F#4', freq: 369.99, key: 'T', black: true },
            { note: 'G4', freq: 392.00, key: 'G', black: false },
            { note: 'G#4', freq: 415.30, key: 'Y', black: true },
            { note: 'A4', freq: 440.00, key: 'H', black: false },
            { note: 'A#4', freq: 466.16, key: 'U', black: true },
            { note: 'B4', freq: 493.88, key: 'J', black: false },
            { note: 'C5', freq: 523.25, key: 'K', black: false },
            { note: 'C#5', freq: 554.37, key: 'O', black: true },
            { note: 'D5', freq: 587.33, key: 'L', black: false },
            { note: 'D#5', freq: 622.25, key: 'P', black: true },
            { note: 'E5', freq: 659.25, key: ';', black: false }
        ];
    }

    _initAudio() {
        if (this.audioCtx) return;
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 2048;

        // Create a destination for recording
        this.recordDest = this.audioCtx.createMediaStreamDestination();
        this.analyser.connect(this.audioCtx.destination);
        this.analyser.connect(this.recordDest);
    }

    _playNote(n) {
        if (!this.active) return;
        this._initAudio();
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
        this._stopNote(n.note);

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        const waveEl = document.getElementById('p-wave');
        if (!waveEl) return;
        osc.type = waveEl.value;
        osc.frequency.setValueAtTime(n.freq, this.audioCtx.currentTime);

        const volEl = document.getElementById('p-volume');
        const attEl = document.getElementById('p-attack');
        if (!volEl || !attEl) return;

        const volume = parseFloat(volEl.value) / 100;
        const attack = parseFloat(attEl.value) / 1000;

        gain.gain.setValueAtTime(0, this.audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(volume * 0.3, this.audioCtx.currentTime + attack);

        osc.connect(gain);
        gain.connect(this.analyser);
        osc.start();

        this.oscMap.set(n.note, { osc, gain });

        const el = document.querySelector(`[data-note="${n.note}"]`);
        if (el) el.classList.add('active');

        const noteDisp = document.getElementById('p-note-display');
        const statusDisp = document.getElementById('p-status');
        if (noteDisp) noteDisp.textContent = `${n.note} - ${Math.round(n.freq)}Hz`;
        if (statusDisp) statusDisp.textContent = 'PLAYING';

        // Record if recording
        if (this.isRecording) {
            const timestamp = Date.now() - this.recordStartTime;
            this.recording.push({ note: n.note, timestamp, type: 'start' });
        }
    }

    _stopNote(noteName) {
        if (this.oscMap.has(noteName)) {
            const { osc, gain } = this.oscMap.get(noteName);
            const relEl = document.getElementById('p-release');
            if (!relEl) return;
            const release = parseFloat(relEl.value);

            gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + release);
            setTimeout(() => {
                osc.stop();
                osc.disconnect();
            }, release * 1000);

            this.oscMap.delete(noteName);

            const el = document.querySelector(`[data-note="${noteName}"]`);
            if (el) el.classList.remove('active');

            if (this.oscMap.size === 0) {
                const statusDisp = document.getElementById('p-status');
                const noteDisp = document.getElementById('p-note-display');
                if (statusDisp) statusDisp.textContent = 'READY';
                if (noteDisp) noteDisp.textContent = '--';
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
            // Start recording
            this._initAudio();
            this.recording = [];
            this.audioChunks = [];
            this.recordStartTime = Date.now();
            this.isRecording = true;

            // Start audio recording
            try {
                this.mediaRecorder = new MediaRecorder(this.recordDest.stream);
                this.mediaRecorder.ondataavailable = (e) => {
                    if (e.data.size > 0) this.audioChunks.push(e.data);
                };
                this.mediaRecorder.onstop = () => {
                    this.recordedAudioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
                    document.getElementById('p-btn-download-audio').disabled = false;
                };
                this.mediaRecorder.start();
            } catch (err) {
                console.error('MediaRecorder error:', err);
            }

            btn.textContent = isTr ? '⏹ Durdur' : '⏹ Stop';
            btn.classList.replace('btn-danger', 'btn-warning');
            document.getElementById('p-rec-info').textContent = 'Recording...';
        } else {
            // Stop recording
            this.isRecording = false;

            if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
                this.mediaRecorder.stop();
            }

            btn.textContent = isTr ? '● Kayıt Başlat' : '● Start Recording';
            btn.classList.replace('btn-warning', 'btn-danger');
            document.getElementById('p-btn-play-rec').disabled = false;
            document.getElementById('p-btn-download-rec').disabled = false;
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

    _downloadRecording() {
        if (this.recording.length === 0) return;

        // Create JSON representation
        const data = {
            recording: this.recording,
            notes: this.notes.map(n => ({ note: n.note, freq: n.freq })),
            timestamp: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `piano-recording-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    _downloadAudio() {
        if (!this.recordedAudioBlob) return;

        const url = URL.createObjectURL(this.recordedAudioBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `piano-performance-${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
    }

    _clearRecording() {
        this.recording = [];
        this.audioChunks = [];
        this.recordedAudioBlob = null;
        document.getElementById('p-btn-play-rec').disabled = true;
        document.getElementById('p-btn-download-rec').disabled = true;
        document.getElementById('p-btn-download-audio').disabled = true;
        document.getElementById('p-btn-clear-rec').disabled = true;
        document.getElementById('p-rec-info').textContent = 'No recording';
    }

    _playDemo() {
        const melodies = [
            // Twinkle Twinkle Little Star
            [
                { note: 'C4', delay: 0, duration: 400 },
                { note: 'C4', delay: 500, duration: 400 },
                { note: 'G4', delay: 1000, duration: 400 },
                { note: 'G4', delay: 1500, duration: 400 },
                { note: 'A4', delay: 2000, duration: 400 },
                { note: 'A4', delay: 2500, duration: 400 },
                { note: 'G4', delay: 3000, duration: 800 },
                { note: 'F4', delay: 4000, duration: 400 },
                { note: 'F4', delay: 4500, duration: 400 },
                { note: 'E4', delay: 5000, duration: 400 },
                { note: 'E4', delay: 5500, duration: 400 },
                { note: 'D4', delay: 6000, duration: 400 },
                { note: 'D4', delay: 6500, duration: 400 },
                { note: 'C4', delay: 7000, duration: 800 }
            ],
            // Happy Birthday
            [
                { note: 'C4', delay: 0, duration: 300 },
                { note: 'C4', delay: 400, duration: 200 },
                { note: 'D4', delay: 700, duration: 500 },
                { note: 'C4', delay: 1300, duration: 500 },
                { note: 'F4', delay: 1900, duration: 500 },
                { note: 'E4', delay: 2500, duration: 900 },
                { note: 'C4', delay: 3500, duration: 300 },
                { note: 'C4', delay: 3900, duration: 200 },
                { note: 'D4', delay: 4200, duration: 500 },
                { note: 'C4', delay: 4800, duration: 500 },
                { note: 'G4', delay: 5400, duration: 500 },
                { note: 'F4', delay: 6000, duration: 900 }
            ],
            // Für Elise (intro)
            [
                { note: 'E5', delay: 0, duration: 250 },
                { note: 'D#5', delay: 300, duration: 250 },
                { note: 'E5', delay: 600, duration: 250 },
                { note: 'D#5', delay: 900, duration: 250 },
                { note: 'E5', delay: 1200, duration: 250 },
                { note: 'B4', delay: 1500, duration: 250 },
                { note: 'D5', delay: 1800, duration: 250 },
                { note: 'C5', delay: 2100, duration: 250 },
                { note: 'A4', delay: 2400, duration: 500 }
            ],
            // Jingle Bells (intro)
            [
                { note: 'E4', delay: 0, duration: 300 },
                { note: 'E4', delay: 400, duration: 300 },
                { note: 'E4', delay: 800, duration: 600 },
                { note: 'E4', delay: 1500, duration: 300 },
                { note: 'E4', delay: 1900, duration: 300 },
                { note: 'E4', delay: 2300, duration: 600 },
                { note: 'E4', delay: 3000, duration: 300 },
                { note: 'G4', delay: 3400, duration: 300 },
                { note: 'C4', delay: 3800, duration: 300 },
                { note: 'D4', delay: 4200, duration: 300 },
                { note: 'E4', delay: 4600, duration: 900 }
            ]
        ];

        // Stop existing demo if any
        this._stopDemo();

        // Pick a random melody
        const melody = melodies[Math.floor(Math.random() * melodies.length)];

        melody.forEach(m => {
            const timeoutId = setTimeout(() => {
                if (!this.active) return;
                const n = this.notes.find(x => x.note === m.note);
                if (n) {
                    this._playNote(n);
                    const stopTimeoutId = setTimeout(() => {
                        if (this.active) this._stopNote(n.note);
                    }, m.duration);
                    this.demoTimeouts.push(stopTimeoutId);
                }
            }, m.delay);
            this.demoTimeouts.push(timeoutId);
        });
    }

    _stopDemo() {
        // Clear all scheduled melody timeouts
        this.demoTimeouts.forEach(t => clearTimeout(t));
        this.demoTimeouts = [];

        // Stop all currently playing oscillators
        [...this.oscMap.keys()].forEach(noteName => this._stopNote(noteName));
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
        this._stopDemo();
        if (this.audioCtx) {
            this.audioCtx.close();
            this.audioCtx = null;
        }
    }
}

window.initVirtualPianoLogic = VirtualPianoTool;
