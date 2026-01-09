/* TULPAR - Professional CSS Generator Tool */
class CSSStudioProTool extends BaseTool {
    constructor(config) {
        super(config);
        this.currentMode = 'shadow';
    }

    renderUI() {
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const txt = isTr ? {
            title: 'Profesyonel CSS Tasarım Stüdyosu',
            modes: {
                shadow: 'Gölge', grad: 'Gradyan', glass: 'Cam', border: 'Kenarlık',
                neu: 'Neumorphism', text: 'Metin Gölgesi', flex: 'Flexbox', filter: 'Filtreler',
                trans: 'Dönüşüm', grid: 'CSS Grid', anim: 'Animasyon', clip: 'Clip-path'
            },
            preview: 'Canlı Önizleme',
            copy: 'CSS Kodu Kopyala 📋',
            presets: 'Hazır Şablonlar'
        } : {
            title: 'Professional CSS Design Studio',
            modes: {
                shadow: 'Shadow', grad: 'Gradient', glass: 'Glass', border: 'Border',
                neu: 'Neumorphism', text: 'Text Shadow', flex: 'Flexbox', filter: 'Filters',
                trans: 'Transform', grid: 'CSS Grid', anim: 'Animation', clip: 'Clip-path'
            },
            preview: 'Live Preview',
            copy: 'Copy CSS Code 📋',
            presets: 'Quick Presets'
        };

        return `
    <div class="tool-content css-studio-pro" style="max-width: 1400px; margin: 0 auto; padding: 20px;">
      <div style="display: grid; grid-template-columns: 380px 1fr; gap: 2.5rem; align-items: start;">
        
        <!-- Sidebar Controls -->
        <div style="position: sticky; top: 20px;">
          <div class="card" style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 20px; max-height: 90vh; overflow-y: auto;">
            <h4 style="margin-bottom: 1.5rem; color: var(--primary); text-transform: uppercase; font-size: 0.85rem;">${txt.title}</h4>
            
            <!-- Mode Tabs -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-bottom: 2rem;">
              ${Object.entries(txt.modes).map(([m, label]) => `
                <button id="css-tab-${m}" class="btn btn-sm ${m === 'shadow' ? 'btn-primary' : 'btn-outline'}" style="font-size: 0.75rem; padding: 8px 4px;">${label}</button>
              `).join('')}
            </div>

            <!-- Controls Container -->
            <div id="css-controls-container">
              ${this._renderAllControls()}
            </div>

            <button id="css-btn-copy" class="btn btn-primary" style="width: 100%; margin-top: 1.5rem; font-weight: 700;">${txt.copy}</button>
          </div>
        </div>

        <!-- Preview Area -->
        <div>
          <div class="card" style="padding: 3rem; background: #e2e8f0; border-radius: 24px; min-height: 550px; display: flex; align-items: center; justify-content: center; background-image: conic-gradient(#cbd5e1 0.25turn, #e2e8f0 0.25turn 0.5turn, #cbd5e1 0.5turn 0.75turn, #e2e8f0 0.75turn); background-size: 40px 40px; position: relative; overflow: hidden;">
            <div id="css-target" style="width: 320px; height: 320px; background: white; border-radius: 20px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); display: flex; align-items: center; justify-content: center; padding: 20px; text-align: center;">
              <span style="font-weight: 700; color: rgba(0,0,0,0.4); text-transform: uppercase; letter-spacing: 2px;">CSS Preview</span>
            </div>
          </div>
          
          <!-- Code Snippet -->
          <div class="card" style="margin-top: 2rem; padding: 1.5rem; background: #1e1e2e; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px;">
            <pre id="css-snippet" style="margin: 0; color: #a5b4fc; font-family: var(--font-mono); font-size: 0.9rem; white-space: pre-wrap; line-height: 1.6;"></pre>
          </div>
        </div>
      </div>
    </div>
    `;
    }

    _renderAllControls() {
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';

        return `
      <!-- Shadow Controls -->
      <div id="css-cont-shadow" class="css-mode-cont">
        <div class="form-group"><label class="form-label">X: <span id="v-bs-x">0</span>px</label><input type="range" id="css-bs-x" min="-50" max="50" value="0"></div>
        <div class="form-group"><label class="form-label">Y: <span id="v-bs-y">4</span>px</label><input type="range" id="css-bs-y" min="-50" max="50" value="4"></div>
        <div class="form-group"><label class="form-label">Blur: <span id="v-bs-b">10</span>px</label><input type="range" id="css-bs-b" min="0" max="100" value="10"></div>
        <div class="form-group"><label class="form-label">Spread: <span id="v-bs-s">0</span>px</label><input type="range" id="css-bs-s" min="-50" max="50" value="0"></div>
        <div class="form-group"><label class="form-label">Color</label><input type="color" id="css-bs-c" value="#000000" style="width:100%; height:40px;"></div>
        <div class="form-group"><label class="form-label">Opacity: <span id="v-bs-o">0.5</span></label><input type="range" id="css-bs-o" min="0" max="1" step="0.01" value="0.5"></div>
        <label><input type="checkbox" id="css-bs-i"> Inset</label>
      </div>

      <!-- Grid Layout Controls -->
      <div id="css-cont-grid" class="css-mode-cont" style="display:none;">
        <div class="form-group"><label class="form-label">Columns: <span id="v-gr-cols">3</span></label><input type="range" id="css-gr-cols" min="1" max="8" value="3"></div>
        <div class="form-group"><label class="form-label">Rows: <span id="v-gr-rows">auto</span></label><select id="css-gr-rows" class="form-select"><option value="auto">Auto</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select></div>
        <div class="form-group"><label class="form-label">Gap: <span id="v-gr-gap">20</span>px</label><input type="range" id="css-gr-gap" min="0" max="50" value="20"></div>
        <div class="form-group"><label class="form-label">Template</label><select id="css-gr-tpl" class="form-select"><option value="auto">Auto-fit</option><option value="fixed">Fixed</option><option value="custom">Custom</option></select></div>
      </div>

      <!-- Animation Controls -->
      <div id="css-cont-anim" class="css-mode-cont" style="display:none;">
        <div class="form-group"><label class="form-label">Preset</label><select id="css-an-preset" class="form-select"><option value="bounce">Bounce</option><option value="pulse">Pulse</option><option value="shake">Shake</option><option value="rotate">Rotate</option><option value="fade">Fade</option></select></div>
        <div class="form-group"><label class="form-label">Duration: <span id="v-an-dur">1</span>s</label><input type="range" id="css-an-dur" min="0.1" max="5" step="0.1" value="1"></div>
        <div class="form-group"><label class="form-label">Timing</label><select id="css-an-timing" class="form-select"><option value="ease">Ease</option><option value="linear">Linear</option><option value="ease-in">Ease In</option><option value="ease-out">Ease Out</option><option value="ease-in-out">Ease In-Out</option></select></div>
        <div class="form-group"><label class="form-label">Iteration</label><select id="css-an-iter" class="form-select"><option value="infinite">Infinite</option><option value="1">1</option><option value="2">2</option><option value="3">3</option></select></div>
      </div>

      <!-- Clip-path Controls -->
      <div id="css-cont-clip" class="css-mode-cont" style="display:none;">
        <div class="form-group"><label class="form-label">Shape</label><select id="css-cp-shape" class="form-select"><option value="circle">Circle</option><option value="ellipse">Ellipse</option><option value="polygon">Polygon (Triangle)</option><option value="hexagon">Hexagon</option><option value="star">Star</option></select></div>
        <div class="form-group"><label class="form-label">Size: <span id="v-cp-size">50</span>%</label><input type="range" id="css-cp-size" min="10" max="100" value="50"></div>
      </div>

      <!-- Gradient (Existing) -->
      <div id="css-cont-grad" class="css-mode-cont" style="display:none;">
        <div class="form-group"><label class="form-label">Type</label><select id="css-gr-t" class="form-select"><option value="linear">Linear</option><option value="radial">Radial</option></select></div>
        <div class="form-group" id="css-gr-ang-grp"><label class="form-label">Angle: <span id="v-gr-a">135</span>deg</label><input type="range" id="css-gr-a" min="0" max="360" value="135"></div>
        <div class="form-group"><label class="form-label">Color 1</label><input type="color" id="css-gr-c1" value="#6366f1" style="width:100%; height:40px;"></div>
        <div class="form-group"><label class="form-label">Color 2</label><input type="color" id="css-gr-c2" value="#a855f7" style="width:100%; height:40px;"></div>
      </div>
    `;
    }

    setupListeners() {
        const modes = ['shadow', 'grad', 'grid', 'anim', 'clip'];

        // Tab switching
        modes.forEach(mode => {
            const btn = document.getElementById(`css-tab-${mode}`);
            if (btn) {
                btn.onclick = () => {
                    this.currentMode = mode;
                    // Update button styles
                    modes.forEach(m => {
                        const b = document.getElementById(`css-tab-${m}`);
                        if (b) {
                            b.classList.remove('btn-primary');
                            b.classList.add('btn-outline');
                        }
                    });
                    btn.classList.remove('btn-outline');
                    btn.classList.add('btn-primary');

                    // Show/hide controls
                    modes.forEach(m => {
                        const cont = document.getElementById(`css-cont-${m}`);
                        if (cont) cont.style.display = m === mode ? 'block' : 'none';
                    });

                    this.update();
                };
            }
        });

        // Input listeners
        this._getAllInputs().forEach(id => {
            const el = document.getElementById(id);
            if (el) el.oninput = () => this.update();
        });

        document.getElementById('css-btn-copy').onclick = () => {
            this.copyToClipboard(document.getElementById('css-snippet').textContent);
        };

        this.update();
    }

    update() {
        const target = document.getElementById('css-target');
        const snippet = document.getElementById('css-snippet');
        let css = '';

        // Reset
        target.style.cssText = 'width: 320px; height: 320px; transition: all 0.3s; display: flex; align-items: center; justify-content: center; background: white; border-radius: 20px;';
        target.innerHTML = '<span style="font-weight: 700; color: rgba(0,0,0,0.4); text-transform: uppercase;">Preview</span>';

        if (this.currentMode === 'shadow') {
            const x = this.val('css-bs-x'), y = this.val('css-bs-y'), b = this.val('css-bs-b');
            const s = this.val('css-bs-s'), c = this.val('css-bs-c'), o = this.val('css-bs-o');
            const i = document.getElementById('css-bs-i').checked;

            this.updateDisplay('v-bs-x', x); this.updateDisplay('v-bs-y', y);
            this.updateDisplay('v-bs-b', b); this.updateDisplay('v-bs-s', s);
            this.updateDisplay('v-bs-o', o);

            css = `box-shadow: ${i ? 'inset ' : ''}${x}px ${y}px ${b}px ${s}px ${c}${o < 1 ? this.hexToRgba(c, o) : ''};`;
            target.style.boxShadow = css.split(':')[1];
        }
        else if (this.currentMode === 'grid') {
            const cols = this.val('css-gr-cols'), gap = this.val('css-gr-gap');
            const rows = this.val('css-gr-rows'), tpl = this.val('css-gr-tpl');

            this.updateDisplay('v-gr-cols', cols);
            this.updateDisplay('v-gr-gap', gap);

            let templateCols = tpl === 'auto' ? `repeat(${cols}, 1fr)` : `repeat(${cols}, minmax(100px, 1fr))`;
            css = `display: grid;\ngrid-template-columns: ${templateCols};\ngrid-gap: ${gap}px;`;
            if (rows !== 'auto') css += `\ngrid-template-rows: repeat(${rows}, 1fr);`;

            target.style.cssText = `width: 100%; height: 100%; padding: 20px; background: #f8fafc; border-radius: 20px; ${css}`;
            target.innerHTML = '';
            for (let i = 1; i <= 6; i++) {
                const item = document.createElement('div');
                item.textContent = i;
                item.style.cssText = 'background: #6366f1; color: white; padding: 20px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 700;';
                target.appendChild(item);
            }
        }
        else if (this.currentMode === 'anim') {
            const preset = this.val('css-an-preset'), dur = this.val('css-an-dur');
            const timing = this.val('css-an-timing'), iter = this.val('css-an-iter');

            this.updateDisplay('v-an-dur', dur);

            const animations = {
                bounce: '@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }',
                pulse: '@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }',
                shake: '@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }',
                rotate: '@keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }',
                fade: '@keyframes fade { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }'
            };

            css = `${animations[preset]}\n\nanimation: ${preset} ${dur}s ${timing} ${iter};`;
            target.style.animation = `${preset} ${dur}s ${timing} ${iter}`;

            // Inject keyframe
            let style = document.getElementById('css-anim-keyframe');
            if (!style) {
                style = document.createElement('style');
                style.id = 'css-anim-keyframe';
                document.head.appendChild(style);
            }
            style.textContent = animations[preset];
        }
        else if (this.currentMode === 'clip') {
            const shape = this.val('css-cp-shape'), size = this.val('css-cp-size');
            this.updateDisplay('v-cp-size', size);

            const clips = {
                circle: `circle(${size}% at 50% 50%)`,
                ellipse: `ellipse(${size}% 40% at 50% 50%)`,
                polygon: `polygon(50% 0%, 0% 100%, 100% 100%)`,
                hexagon: `polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)`,
                star: `polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)`
            };

            css = `clip-path: ${clips[shape]};`;
            target.style.clipPath = clips[shape];
            target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            target.innerHTML = '';
        }
        else if (this.currentMode === 'grad') {
            const t = this.val('css-gr-t'), a = this.val('css-gr-a');
            const c1 = this.val('css-gr-c1'), c2 = this.val('css-gr-c2');

            this.updateDisplay('v-gr-a', a);
            document.getElementById('css-gr-ang-grp').style.display = t === 'radial' ? 'none' : 'block';

            css = `background: ${t === 'radial' ? `radial-gradient(circle, ${c1}, ${c2})` : `linear-gradient(${a}deg, ${c1}, ${c2})`};`;
            target.style.background = css.split(':')[1];
        }

        snippet.textContent = css;
    }

    val(id) {
        return document.getElementById(id)?.value || '';
    }

    updateDisplay(id, val) {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    }

    hexToRgba(hex, alpha) {
        let r = 0, g = 0, b = 0;
        if (hex.length === 4) { r = "0x" + hex[1] + hex[1]; g = "0x" + hex[2] + hex[2]; b = "0x" + hex[3] + hex[3]; }
        else if (hex.length === 7) { r = "0x" + hex[1] + hex[2]; g = "0x" + hex[3] + hex[4]; b = "0x" + hex[5] + hex[6]; }
        return ` rgba(${+r}, ${+g}, ${+b}, ${alpha})`;
    }

    _getAllInputs() {
        return [
            'css-bs-x', 'css-bs-y', 'css-bs-b', 'css-bs-s', 'css-bs-c', 'css-bs-o',
            'css-gr-cols', 'css-gr-rows', 'css-gr-gap', 'css-gr-tpl',
            'css-an-preset', 'css-an-dur', 'css-an-timing', 'css-an-iter',
            'css-cp-shape', 'css-cp-size',
            'css-gr-t', 'css-gr-a', 'css-gr-c1', 'css-gr-c2'
        ];
    }
}

// Register tool
window.initCssGeneratorLogic = CSSStudioProTool;
