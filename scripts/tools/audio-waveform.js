/* TULPAR - Audio Waveform Tool OOP Implementation */
class AudioWaveformTool extends BaseTool {
    constructor(config) {
        super(config);
        this.ctx = null;
        this.audioBuffer = null;
        this.audioCtx = null;
        this.sourceNode = null;
        this.analyser = null;
        this.animationFrameId = null;
    }

    renderUI() {
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const txt = isTr ? {
            title: 'Ses Mühendisi - Dalga Analizi',
            upload: 'Ses Dosyası Yükle (MP3/WAV)',
            mic: 'Mikrofon Kaydı 🎤',
            controls: 'Ses Kontrolleri',
            style: 'Görsel Stil',
            color: 'Dalga Rengi',
            bg: 'Arkaplan',
            play: '▶ Oynat',
            stop: '⏹ Durdur',
            dl: 'Dalga Görselini İndir 💾',
            modes: { bars: 'Dalga Çubukları', lines: 'Dalga Eğrisi', spec: 'Spektrogram (Canlı)' },
            await: 'Ses Girişi Bekleniyor...',
            rec: 'KAYIT / CANLI',
            micErr: 'Mikrofon erişimi reddedildi'
        } : {
            title: 'Audio Engineer - Waveform Lab',
            upload: 'Upload Audio (MP3/WAV)',
            mic: 'Record Mic 🎤',
            controls: 'Audio Controls',
            style: 'Visual Style',
            color: 'Primary Color',
            bg: 'Background',
            play: '▶ Play Audio',
            stop: '⏹ Stop',
            dl: 'Export Visual 💾',
            modes: { bars: 'Waveform Bars', lines: 'Waveform Curve', spec: 'Spectrogram (Live)' },
            await: 'Awaiting Audio Input...',
            rec: 'REC / LIVE',
            micErr: 'Microphone access denied'
        };

        return `
        <div class="tool-content audio-lab" style="max-width: 1200px; margin: 0 auto; padding: 20px;">
            <div class="grid-layout" style="display: grid; grid-template-columns: 320px 1fr; gap: 2.5rem;">
                
                <!-- Sidebar -->
                <div class="al-sidebar">
                    <div id="al-drop" class="card" style="padding: 2rem; border: 2px dashed var(--primary); border-radius: 24px; text-align: center; cursor: pointer; transition: 0.3s; background: rgba(99, 102, 241, 0.05); margin-bottom: 1rem;">
                        <input type="file" id="al-file" hidden accept="audio/*">
                        <div style="font-size: 2.5rem; margin-bottom: 1rem;">📂</div>
                        <h5 style="font-size: 0.85rem;">${txt.upload}</h5>
                    </div>

                    <button id="al-btn-mic" class="btn btn-outline" style="width: 100%; margin-bottom: 2rem; border-color: var(--danger); color: var(--danger);">
                        ${txt.mic}
                    </button>

                    <div class="card" style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 20px;">
                        <h4 style="font-size: 0.75rem; text-transform: uppercase; color: var(--primary); margin-bottom: 1.5rem;">${txt.controls}</h4>
                        
                        <div class="form-group">
                            <label class="form-label">${txt.style}</label>
                            <select id="al-in-style" class="form-input">
                                <option value="bars">${txt.modes.bars}</option>
                                <option value="lines">${txt.modes.lines}</option>
                                <option value="spectrogram">${txt.modes.spec}</option>
                            </select>
                        </div>

                        <div class="grid-2">
                             <div class="form-group">
                                <label class="form-label">${txt.color}</label>
                                <input type="color" id="al-in-c" value="#6366f1" class="form-input" style="height: 42px; padding: 0;">
                             </div>
                             <div class="form-group">
                                <label class="form-label">${txt.bg}</label>
                                <input type="color" id="al-in-bg" value="#0f172a" class="form-input" style="height: 42px; padding: 0;">
                             </div>
                        </div>

                        <div style="display: flex; gap: 10px; margin-top: 1.5rem;">
                            <button id="al-btn-play" class="btn btn-primary" style="flex: 1;" disabled>${txt.play}</button>
                            <button id="al-btn-stop" class="btn btn-danger" style="flex: 1; display: none;">${txt.stop}</button>
                        </div>
                    </div>
                </div>

                <!-- Main View -->
                <div class="al-main">
                    <div id="al-empty" class="card" style="height: 100%; min-height: 500px; display: flex; align-items: center; justify-content: center; opacity: 0.3; border: 1px dashed var(--border-color); border-radius: 24px;">
                        <h3>${txt.await}</h3>
                    </div>
                    <div id="al-out" style="display: none;">
                        <div class="card" style="padding: 1.5rem; background: #000; border-radius: 24px; overflow: hidden; box-shadow: 0 40px 100px rgba(0,0,0,0.5); position: relative;">
                            <canvas id="al-canvas" width="1600" height="600" style="width: 100%; height: auto; display: block;"></canvas>
                            <div id="al-mic-status" style="position: absolute; top: 20px; right: 20px; color: #ef4444; display: none; align-items: center; gap: 8px; font-weight: 700;">
                                <div style="width: 12px; height: 12px; background: #ef4444; border-radius: 50%; animation: pulse 1s infinite;"></div> ${txt.rec}
                            </div>
                        </div>
                        <button id="al-btn-dl" class="btn btn-success" style="width: 100%; margin-top: 1.5rem; font-weight: 700; height: 3.5rem;">${txt.dl}</button>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    setupListeners() {
        const drop = document.getElementById('al-drop');
        const file = document.getElementById('al-file');
        const micBtn = document.getElementById('al-btn-mic');
        const style = document.getElementById('al-in-style');
        const color = document.getElementById('al-in-c');
        const bg = document.getElementById('al-in-bg');
        const dl = document.getElementById('al-btn-dl');
        const play = document.getElementById('al-btn-play');
        const stop = document.getElementById('al-btn-stop');
        const canvas = document.getElementById('al-canvas');

        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const msgMicErr = isTr ? 'Mikrofon erişimi reddedildi' : 'Microphone access denied';

        drop.onclick = () => file.click();

        const initCtx = () => {
            if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
        };

        file.onchange = async (e) => {
            const f = e.target.files[0];
            if (!f) return;
            initCtx();
            const r = new FileReader();
            r.onload = async (re) => {
                this.audioBuffer = await this.audioCtx.decodeAudioData(re.target.result);
                document.getElementById('al-empty').style.display = 'none';
                document.getElementById('al-out').style.display = 'block';
                document.getElementById('al-mic-status').style.display = 'none';
                play.disabled = false;
                this._draw();
            };
            r.readAsArrayBuffer(f);
        };

        micBtn.onclick = async () => {
            initCtx();
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const source = this.audioCtx.createMediaStreamSource(stream);
                const analyser = this.audioCtx.createAnalyser();
                analyser.fftSize = 2048;
                source.connect(analyser);

                document.getElementById('al-empty').style.display = 'none';
                document.getElementById('al-out').style.display = 'block';
                document.getElementById('al-mic-status').style.display = 'flex';
                play.disabled = true;

                style.value = 'spectrogram';
                this.drawSpectrogram(analyser, canvas, color.value);
            } catch (err) {
                this.showNotification(msgMicErr, 'error');
            }
        };

        const updateVisuals = () => {
            if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);

            if (style.value !== 'spectrogram' && this.audioBuffer) {
                this._draw();
            } else if (style.value === 'spectrogram') {
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = bg.value;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.save();
                ctx.font = 'bold 24px sans-serif';
                ctx.fillStyle = 'rgba(255,255,255,0.4)';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const msg = isTr ? 'Analiz için sesi OYNATIN ▶' : 'Press PLAY ▶ to analyze';
                ctx.fillText(msg, canvas.width / 2, canvas.height / 2);
                ctx.restore();

                if (this.sourceNode) {
                    try { this.sourceNode.stop(); } catch (e) { }
                    this.sourceNode = null;
                    play.style.display = 'block';
                    stop.style.display = 'none';
                }
            }
        };

        style.onchange = updateVisuals;

        const updateColors = () => {
            if (style.value !== 'spectrogram' && this.audioBuffer) {
                this._draw();
            }
        };
        color.oninput = updateColors;
        bg.oninput = updateColors;

        play.onclick = () => {
            if (!this.audioBuffer) return;
            initCtx();
            if (this.sourceNode) {
                try { this.sourceNode.stop(); } catch (e) { }
            }
            this.sourceNode = this.audioCtx.createBufferSource();
            this.sourceNode.buffer = this.audioBuffer;

            if (style.value === 'spectrogram') {
                const analyser = this.audioCtx.createAnalyser();
                analyser.fftSize = 2048;
                this.sourceNode.connect(analyser);
                analyser.connect(this.audioCtx.destination);
                this.drawSpectrogram(analyser, canvas, color.value);
            } else {
                this.sourceNode.connect(this.audioCtx.destination);
            }

            this.sourceNode.start(0);
            play.style.display = 'none';
            stop.style.display = 'block';
            this.sourceNode.onended = () => { play.style.display = 'block'; stop.style.display = 'none'; };
        };

        stop.onclick = () => {
            if (this.sourceNode) {
                try { this.sourceNode.stop(); } catch (e) { }
            }
            play.style.display = 'block';
            stop.style.display = 'none';
            if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
        };

        dl.onclick = () => {
            const link = document.createElement('a');
            link.download = 'waveform-analysis.png';
            link.href = canvas.toDataURL();
            link.click();
        };
    }

    _draw() {
        if (!this.audioBuffer) return;
        const canvas = document.getElementById('al-canvas');
        this.drawWaveform(this.audioBuffer, canvas, {
            style: document.getElementById('al-in-style').value,
            color: document.getElementById('al-in-c').value,
            bgColor: document.getElementById('al-in-bg').value,
            barWidth: 4,
            barGap: 2
        });
    }

    onClose() {
        if (this.audioCtx) this.audioCtx.close();
        if (this.sourceNode) {
            try { this.sourceNode.stop(); } catch (e) { }
        }
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    }

    // INTERNAL LOGIC (Formerly in DevTools.audioTools)

    drawWaveform(buffer, canvas, options) {
        const { style, color, bgColor, barWidth, barGap } = options;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);

        const data = buffer.getChannelData(0); // Use first channel
        const step = Math.ceil(data.length / width);
        const amp = height / 2;

        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2; // Curve width

        if (style === 'lines') {
            ctx.beginPath();
            ctx.moveTo(0, height / 2);
            for (let i = 0; i < width; i++) {
                let min = 1.0;
                let max = -1.0;

                for (let j = 0; j < step; j++) {
                    const datum = data[i * step + j];
                    if (datum < min) min = datum;
                    if (datum > max) max = datum;
                }

                // Average amplitude for this pixel column
                const val = Math.max(Math.abs(min), Math.abs(max));
                ctx.lineTo(i, (1 + min) * amp); // Simplified drawing logic for demo, usually one draws min to max range
                // A better line approach:
            }
            // Re-implement line drawing correctly roughly
            ctx.beginPath();
            for (let i = 0; i < width; i++) {
                // Get some average
                let sum = 0;
                for (let j = 0; j < step; j++) {
                    sum += Math.abs(data[i * step + j] || 0);
                }
                const avg = sum / step;
                const y = (1 - avg) * amp; // draws from center? No, top down. 
                // Center is height/2. 
                ctx.lineTo(i, height / 2 - avg * amp);
            }
            ctx.stroke();
            // Mirror bottom
            ctx.beginPath();
            for (let i = 0; i < width; i++) {
                let sum = 0;
                for (let j = 0; j < step; j++) {
                    sum += Math.abs(data[i * step + j] || 0);
                }
                const avg = sum / step;
                ctx.lineTo(i, height / 2 + avg * amp);
            }
            ctx.stroke();

        } else {
            // Bars (Default)
            // Calculate bars count based on width
            const totalBars = Math.floor(width / (barWidth + barGap));
            // Recalculate step
            const barStep = Math.floor(data.length / totalBars);

            for (let i = 0; i < totalBars; i++) {
                let sum = 0;
                for (let j = 0; j < barStep; j++) {
                    sum += Math.abs(data[i * barStep + j] || 0);
                }
                const avg = sum / barStep;

                const barHeight = avg * height;
                const x = i * (barWidth + barGap);
                const y = (height - barHeight) / 2;

                ctx.fillRect(x, y, barWidth, barHeight);
            }
        }
    }

    drawSpectrogram(analyser, canvas, color) {
        const ctx = canvas.getContext('2d');
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const barWidth = (canvas.width / bufferLength) * 2.5;

        const render = () => {
            analyser.getByteFrequencyData(dataArray);

            // Semi-transparent bg for trailing effect or clear
            ctx.fillStyle = document.getElementById('al-in-bg')?.value || '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            let x = 0;
            for (let i = 0; i < bufferLength; i++) {
                const barHeight = dataArray[i] * 2; // Scale
                ctx.fillStyle = color;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }

            this.animationFrameId = requestAnimationFrame(render);
        };
        render();
    }
}

// Register tool
window.initAudioWaveformLogic = AudioWaveformTool;
