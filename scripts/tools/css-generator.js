/* TULPAR - CSS Studio Tool OOP Implementation */
class CSSStudioTool extends BaseTool {
  constructor(config) {
    super(config);
    this.currentMode = 'shadow';
  }

  renderUI() {
    const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
    const txt = isTr ? {
      title: 'Profesyonel CSS Tasarım Stüdyosu',
      modes: { shadow: 'Gölge', grad: 'Gradyan', glass: 'Cam (Glass)', border: 'Kenarlık & Radius', neu: 'Neumorphism', text: 'Metin Gölgesi', flex: 'Flexbox', filter: 'Filtreler', trans: 'Dönüşüm (Transform)' },
      preview: 'Canlı Önizleme',
      copy: 'CSS Kodu Kopyala',
      params: {
        x: 'X Ekseni', y: 'Y Ekseni', blur: 'Bulanıklık', spread: 'Yayılma', color: 'Renk', opacity: 'Opaklık', inset: 'İç Gölge',
        angle: 'Açı', type: 'Tip', c1: 'Renk 1', c2: 'Renk 2', c3: 'Renk 3', stop: 'Konum', use3: '3. Rengi Kullan',
        tl: 'Sol Üst', tr: 'Sağ Üst', bl: 'Sol Alt', br: 'Sağ Alt', width: 'Kalınlık', style: 'Stil',
        size: 'Boyut', dist: 'Mesafe', int: 'Yoğunluk', shape: 'Şekil',
        dir: 'Yön', just: 'Yatay Hizala', align: 'Dikey Hizala', wrap: 'Satır Kaydır', gap: 'Boşluk',
        bright: 'Parlaklık', cont: 'Kontrast', gray: 'Siyah Beyaz', sepia: 'Sepya', hue: 'Renk Tonu',
        rot: 'Döndür (Deg)', scale: 'Ölçek (Scale)', skewX: 'Eğme X', skewY: 'Eğme Y', trX: 'Kaydır X', trY: 'Kaydır Y'
      }
    } : {
      title: 'Professional CSS Design Studio',
      modes: { shadow: 'Shadow', grad: 'Gradient', glass: 'Glass', border: 'Border & Radius', neu: 'Neumorphism', text: 'Text Shadow', flex: 'Flexbox', filter: 'Filters', trans: 'Transform' },
      preview: 'Live Preview',
      copy: 'Copy CSS Snippet',
      params: {
        x: 'Offset X', y: 'Offset Y', blur: 'Blur', spread: 'Spread', color: 'Color', opacity: 'Opacity', inset: 'Inset',
        angle: 'Angle', type: 'Type', c1: 'Color 1', c2: 'Color 2', c3: 'Color 3', stop: 'Stop', use3: 'Use 3rd Color',
        tl: 'Top Left', tr: 'Top Right', bl: 'Bottom Left', br: 'Bottom Right', width: 'Width', style: 'Style',
        size: 'Size', dist: 'Distance', int: 'Intensity', shape: 'Shape',
        dir: 'Direction', just: 'Justify Content', align: 'Align Items', wrap: 'Flex Wrap', gap: 'Gap',
        bright: 'Brightness', cont: 'Contrast', gray: 'Grayscale', sepia: 'Sepia', hue: 'Hue Rotate',
        rot: 'Rotate', scale: 'Scale', skewX: 'Skew X', skewY: 'Skew Y', trX: 'Translate X', trY: 'Translate Y'
      }
    };

    return `
        <div class="tool-content css-studio" style="max-width: 1300px; margin: 0 auto; padding: 20px;">
            <div class="grid-layout" style="display: grid; grid-template-columns: 380px 1fr; gap: 2.5rem;">
                
                <!-- Controls Sidebar -->
                <div class="css-sidebar">
                    <div class="card" style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 20px; position: sticky; top: 20px; max-height: 90vh; overflow-y: auto;">
                        <h4 style="margin-bottom: 1.5rem; color: var(--primary); text-transform: uppercase; font-size: 0.85rem;">${txt.title}</h4>
                        
                        <div class="btn-group" style="width: 100%; margin-bottom: 2rem; flex-wrap: wrap; gap: 5px;">
                            <button id="css-tab-shadow" class="btn btn-sm btn-primary" style="flex:1; min-width: 80px;">${txt.modes.shadow}</button>
                            <button id="css-tab-grad" class="btn btn-sm btn-outline" style="flex:1; min-width: 80px;">${txt.modes.grad}</button>
                            <button id="css-tab-border" class="btn btn-sm btn-outline" style="flex:1; min-width: 80px;">${txt.modes.border}</button>
                            <button id="css-tab-trans" class="btn btn-sm btn-outline" style="flex:1; min-width: 80px;">${txt.modes.trans}</button>
                            <button id="css-tab-glass" class="btn btn-sm btn-outline" style="flex:1; min-width: 80px;">${txt.modes.glass}</button>
                            <button id="css-tab-neu" class="btn btn-sm btn-outline" style="flex:1; min-width: 80px;">${txt.modes.neu}</button>
                            <button id="css-tab-text" class="btn btn-sm btn-outline" style="flex:1; min-width: 80px;">${txt.modes.text}</button>
                            <button id="css-tab-flex" class="btn btn-sm btn-outline" style="flex:1; min-width: 80px;">${txt.modes.flex}</button>
                            <button id="css-tab-filter" class="btn btn-sm btn-outline" style="flex:1; min-width: 80px;">${txt.modes.filter}</button>
                        </div>

                        <!-- Shadow Controls -->
                        <div id="css-cont-shadow" class="css-mode-cont">
                            <div class="form-group"><label class="form-label">${txt.params.x}: <span id="v-bs-x">0</span>px</label><input type="range" id="css-bs-x" min="-50" max="50" value="0"></div>
                            <div class="form-group"><label class="form-label">${txt.params.y}: <span id="v-bs-y">4</span>px</label><input type="range" id="css-bs-y" min="-50" max="50" value="4"></div>
                            <div class="form-group"><label class="form-label">${txt.params.blur}: <span id="v-bs-b">10</span>px</label><input type="range" id="css-bs-b" min="0" max="100" value="10"></div>
                            <div class="form-group"><label class="form-label">${txt.params.spread}: <span id="v-bs-s">0</span>px</label><input type="range" id="css-bs-s" min="-50" max="50" value="0"></div>
                            <div class="form-group"><label class="form-label">${txt.params.color}</label><input type="color" id="css-bs-c" value="#000000" class="form-control" style="height:40px; padding:0;"></div>
                            <div class="form-group"><label class="form-label">${txt.params.opacity}: <span id="v-bs-o">0.5</span></label><input type="range" id="css-bs-o" min="0" max="1" step="0.01" value="0.5"></div>
                            <label class="checkbox-container"><input type="checkbox" id="css-bs-i"><span class="checkmark"></span><span>${txt.params.inset}</span></label>
                        </div>

                        <!-- Gradient Controls -->
                        <div id="css-cont-grad" class="css-mode-cont" style="display: none;">
                            <div class="form-group"><label class="form-label">${txt.params.type}</label><select id="css-gr-t" class="form-select"><option value="linear">Linear</option><option value="radial">Radial</option></select></div>
                            <div class="form-group" id="css-gr-ang-grp"><label class="form-label">${txt.params.angle}: <span id="v-gr-a">135</span>deg</label><input type="range" id="css-gr-a" min="0" max="360" value="135"></div>
                            
                            <hr style="opacity:0.1; margin: 15px 0;">
                            
                            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                                <div class="form-group"><label class="form-label">${txt.params.c1}</label><input type="color" id="css-gr-c1" value="#6366f1" class="form-control" style="height:40px; padding:0;"></div>
                                <div class="form-group"><label class="form-label">${txt.params.stop} (%)</label><input type="number" id="css-gr-s1" value="0" class="form-input"></div>
                            </div>
                            
                             <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                                <div class="form-group"><label class="form-label">${txt.params.c2}</label><input type="color" id="css-gr-c2" value="#a855f7" class="form-control" style="height:40px; padding:0;"></div>
                                <div class="form-group"><label class="form-label">${txt.params.stop} (%)</label><input type="number" id="css-gr-s2" value="100" class="form-input"></div>
                            </div>

                            <div style="margin-top:10px; padding:10px; background:rgba(0,0,0,0.05); border-radius:8px;">
                                <label class="checkbox-container" style="margin-bottom:10px;"><input type="checkbox" id="css-gr-use3"><span class="checkmark"></span><span>${txt.params.use3}</span></label>
                                <div id="css-gr-grp3" style="display:none; grid-template-columns:1fr 1fr; gap:10px;">
                                    <div class="form-group"><label class="form-label">${txt.params.c3}</label><input type="color" id="css-gr-c3" value="#ec4899" class="form-control" style="height:40px; padding:0;"></div>
                                    <div class="form-group"><label class="form-label">${txt.params.stop} (%)</label><input type="number" id="css-gr-s3" value="50" class="form-input"></div>
                                </div>
                            </div>
                        </div>

                        <!-- Border & Radius Controls -->
                        <div id="css-cont-border" class="css-mode-cont" style="display: none;">
                            <h5 style="font-size:0.8rem; margin-bottom:10px; opacity:0.7;">Border Radius</h5>
                            <div class="grid-2">
                                <div class="form-group"><label class="form-label">${txt.params.tl}</label><input type="range" id="css-br-tl" min="0" max="150" value="30"></div>
                                <div class="form-group"><label class="form-label">${txt.params.tr}</label><input type="range" id="css-br-tr" min="0" max="150" value="30"></div>
                            </div>
                            <div class="grid-2">
                                <div class="form-group"><label class="form-label">${txt.params.bl}</label><input type="range" id="css-br-bl" min="0" max="150" value="30"></div>
                                <div class="form-group"><label class="form-label">${txt.params.br}</label><input type="range" id="css-br-br" min="0" max="150" value="30"></div>
                            </div>
                            
                            <hr style="opacity:0.1; margin: 15px 0;">
                            <h5 style="font-size:0.8rem; margin-bottom:10px; opacity:0.7;">Border Properties</h5>
                            
                            <div class="form-group"><label class="form-label">${txt.params.width}: <span id="v-bd-w">0</span>px</label><input type="range" id="css-bd-w" min="0" max="20" value="0"></div>
                            <div class="form-group"><label class="form-label">${txt.params.style}</label><select id="css-bd-s" class="form-select"><option value="solid">Solid</option><option value="dashed">Dashed</option><option value="dotted">Dotted</option><option value="double">Double</option></select></div>
                            <div class="form-group"><label class="form-label">${txt.params.color}</label><input type="color" id="css-bd-c" value="#333333" class="form-control" style="height:40px; padding:0;"></div>
                        </div>

                        <!-- Transform Controls -->
                        <div id="css-cont-trans" class="css-mode-cont" style="display: none;">
                            <div class="form-group"><label class="form-label">${txt.params.rot}</label><input type="range" id="css-tf-rot" min="0" max="360" value="0"></div>
                            <div class="form-group"><label class="form-label">${txt.params.scale}: <span id="v-tf-sc">1</span></label><input type="range" id="css-tf-sc" min="0.1" max="2" step="0.1" value="1"></div>
                            <div class="grid-2">
                                <div class="form-group"><label class="form-label">${txt.params.skewX}</label><input type="range" id="css-tf-sx" min="-50" max="50" value="0"></div>
                                <div class="form-group"><label class="form-label">${txt.params.skewY}</label><input type="range" id="css-tf-sy" min="-50" max="50" value="0"></div>
                            </div>
                            <div class="grid-2">
                                <div class="form-group"><label class="form-label">${txt.params.trX}</label><input type="range" id="css-tf-tx" min="-100" max="100" value="0"></div>
                                <div class="form-group"><label class="form-label">${txt.params.trY}</label><input type="range" id="css-tf-ty" min="-100" max="100" value="0"></div>
                            </div>
                        </div>

                        <!-- Glassmorphism Controls -->
                        <div id="css-cont-glass" class="css-mode-cont" style="display: none;">
                            <div class="form-group"><label class="form-label">${txt.params.opacity}: <span id="v-gl-o">0.2</span></label><input type="range" id="css-gl-o" min="0.05" max="0.6" step="0.01" value="0.2"></div>
                            <div class="form-group"><label class="form-label">${txt.params.blur}: <span id="v-gl-b">15</span>px</label><input type="range" id="css-gl-b" min="0" max="40" value="15"></div>
                        </div>

                        <!-- Neumorphism Controls -->
                        <div id="css-cont-neu" class="css-mode-cont" style="display: none;">
                            <div class="form-group"><label class="form-label">Bg Color</label><input type="color" id="css-neu-c" value="#e0e5ec" class="form-control" style="height:40px; padding:0;"></div>
                            <div class="form-group"><label class="form-label">${txt.params.size}</label><input type="range" id="css-neu-s" min="5" max="50" value="20"></div>
                            <div class="form-group"><label class="form-label">Radius</label><input type="range" id="css-neu-r" min="0" max="100" value="50"></div>
                            <div class="form-group"><label class="form-label">${txt.params.dist}</label><input type="range" id="css-neu-d" min="5" max="50" value="20"></div>
                            <div class="form-group"><label class="form-label">${txt.params.int}</label><input type="range" id="css-neu-i" min="0.01" max="0.6" step="0.01" value="0.15"></div>
                            <div class="form-group"><label class="form-label">${txt.params.shape}</label><select id="css-neu-sh" class="form-select"><option value="flat">Flat</option><option value="concave">Concave</option><option value="convex">Convex</option><option value="pressed">Pressed</option></select></div>
                        </div>

                        <!-- Text Shadow Controls -->
                        <div id="css-cont-text" class="css-mode-cont" style="display: none;">
                            <div class="form-group"><label class="form-label">${txt.params.x}</label><input type="range" id="css-ts-x" min="-20" max="20" value="2"></div>
                            <div class="form-group"><label class="form-label">${txt.params.y}</label><input type="range" id="css-ts-y" min="-20" max="20" value="2"></div>
                            <div class="form-group"><label class="form-label">${txt.params.blur}</label><input type="range" id="css-ts-b" min="0" max="20" value="4"></div>
                            <div class="form-group"><label class="form-label">${txt.params.color}</label><input type="color" id="css-ts-c" value="#000000" class="form-control" style="height:40px; padding:0;"></div>
                        </div>

                         <!-- Flexbox Controls -->
                        <div id="css-cont-flex" class="css-mode-cont" style="display: none;">
                            <div class="form-group"><label class="form-label">${txt.params.dir}</label><select id="css-fx-dir" class="form-select"><option value="row">Row</option><option value="column">Column</option><option value="row-reverse">Row Reverse</option><option value="column-reverse">Column Reverse</option></select></div>
                            <div class="form-group"><label class="form-label">${txt.params.just}</label><select id="css-fx-just" class="form-select"><option value="flex-start">Start</option><option value="center">Center</option><option value="flex-end">End</option><option value="space-between">Space Between</option><option value="space-around">Space Around</option><option value="space-evenly">Space Evenly</option></select></div>
                            <div class="form-group"><label class="form-label">${txt.params.align}</label><select id="css-fx-align" class="form-select"><option value="stretch">Stretch</option><option value="flex-start">Start</option><option value="center">Center</option><option value="flex-end">End</option><option value="baseline">Baseline</option></select></div>
                            <div class="form-group"><label class="form-label">${txt.params.wrap}</label><select id="css-fx-wrap" class="form-select"><option value="nowrap">No Wrap</option><option value="wrap">Wrap</option></select></div>
                            <div class="form-group"><label class="form-label">${txt.params.gap}: <span id="v-fx-gap">10</span>px</label><input type="range" id="css-fx-gap" min="0" max="50" value="10"></div>
                        </div>

                        <!-- Filter Controls -->
                        <div id="css-cont-filter" class="css-mode-cont" style="display: none;">
                            <div class="form-group"><label class="form-label">${txt.params.blur}</label><input type="range" id="css-fl-bl" min="0" max="20" value="0"></div>
                            <div class="form-group"><label class="form-label">${txt.params.bright}</label><input type="range" id="css-fl-br" min="0" max="200" value="100"></div>
                            <div class="form-group"><label class="form-label">${txt.params.cont}</label><input type="range" id="css-fl-cn" min="0" max="200" value="100"></div>
                            <div class="form-group"><label class="form-label">${txt.params.gray}</label><input type="range" id="css-fl-gr" min="0" max="100" value="0"></div>
                            <div class="form-group"><label class="form-label">${txt.params.sepia}</label><input type="range" id="css-fl-sp" min="0" max="100" value="0"></div>
                            <div class="form-group"><label class="form-label">${txt.params.hue}</label><input type="range" id="css-fl-hu" min="0" max="360" value="0"></div>
                        </div>

                        <button id="css-btn-copy" class="btn btn-primary" style="width: 100%; margin-top: 1.5rem; font-weight: 700;">${txt.copy}</button>
                    </div>
                </div>

                <!-- Preview Main -->
                <div class="css-preview-area">
                    <div class="card" style="padding: 2rem; background: #e2e8f0; border-radius: 24px; min-height: 500px; display: flex; align-items: center; justify-content: center; background-image: conic-gradient(#cbd5e1 0.25turn, #e2e8f0 0.25turn 0.5turn, #cbd5e1 0.5turn 0.75turn, #e2e8f0 0.75turn); background-size: 40px 40px; position:relative; overflow: hidden;">
                        <div id="css-target" style="width: 280px; height: 280px; background: white; border-radius: 20px; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); display: flex; align-items: center; justify-content: center; padding: 20px; text-align: center;">
                            <span style="font-weight: 700; color: rgba(0,0,0,0.4); text-transform: uppercase; letter-spacing: 2px;">CSS Preview</span>
                        </div>
                    </div>
                    <div class="card" style="margin-top: 1.5rem; padding: 1.2rem; background: #1e1e2e; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px;">
                        <pre id="css-snippet" style="margin: 0; color: #a5b4fc; font-family: var(--font-mono); font-size: 0.9rem; white-space: pre-wrap;"></pre>
                    </div>
                </div>
            </div>
        </div>
        `;
  }

  setupListeners() {
    const tabs = {
      shadow: document.getElementById('css-tab-shadow'),
      grad: document.getElementById('css-tab-grad'),
      glass: document.getElementById('css-tab-glass'),
      border: document.getElementById('css-tab-border'),
      neu: document.getElementById('css-tab-neu'),
      text: document.getElementById('css-tab-text'),
      flex: document.getElementById('css-tab-flex'),
      filter: document.getElementById('css-tab-filter'),
      trans: document.getElementById('css-tab-trans')
    };
    const conts = {
      shadow: document.getElementById('css-cont-shadow'),
      grad: document.getElementById('css-cont-grad'),
      glass: document.getElementById('css-cont-glass'),
      border: document.getElementById('css-cont-border'),
      neu: document.getElementById('css-cont-neu'),
      text: document.getElementById('css-cont-text'),
      flex: document.getElementById('css-cont-flex'),
      filter: document.getElementById('css-cont-filter'),
      trans: document.getElementById('css-cont-trans')
    };
    const snippet = document.getElementById('css-snippet');

    const switchMode = (mode) => {
      this.currentMode = mode;
      Object.keys(tabs).forEach(k => {
        tabs[k].classList.replace('btn-primary', 'btn-outline');
        conts[k].style.display = 'none';
      });
      tabs[mode].classList.replace('btn-outline', 'btn-primary');
      conts[mode].style.display = 'block';
      this.update();
    };

    Object.keys(tabs).forEach(k => tabs[k].onclick = () => switchMode(k));

    this._allInputs().forEach(id => {
      const el = document.getElementById(id);
      if (el) el.oninput = () => this.update();
    });

    // Checkbox listener
    document.getElementById('css-bs-i').onchange = () => this.update();
    const use3 = document.getElementById('css-gr-use3');
    use3.onchange = () => {
      document.getElementById('css-gr-grp3').style.display = use3.checked ? 'grid' : 'none';
      this.update();
    };

    document.getElementById('css-btn-copy').onclick = () => this.copyToClipboard(snippet.textContent);
    this.update();
  }

  update() {
    const target = document.getElementById('css-target');
    const snippet = document.getElementById('css-snippet');
    const gen = window.DevTools.cssGenerator;
    let css = '';

    // Reset basics
    target.style.cssText = 'width: 280px; height: 280px; transition: all 0.2s; display: flex; align-items: center; justify-content: center; background: white; border-radius: 20px;';
    target.textContent = '';

    // Reset parent background
    target.parentElement.style.background = '#e2e8f0';
    target.parentElement.style.backgroundImage = 'conic-gradient(#cbd5e1 0.25turn, #e2e8f0 0.25turn 0.5turn, #cbd5e1 0.5turn 0.75turn, #e2e8f0 0.75turn)';

    if (this.currentMode === 'shadow') {
      const x = document.getElementById('css-bs-x').value;
      const y = document.getElementById('css-bs-y').value;
      const b = document.getElementById('css-bs-b').value;
      const s = document.getElementById('css-bs-s').value;
      const c = document.getElementById('css-bs-c').value;
      const o = document.getElementById('css-bs-o').value;
      const i = document.getElementById('css-bs-i').checked;

      document.getElementById('v-bs-x').textContent = x;
      document.getElementById('v-bs-y').textContent = y;
      document.getElementById('v-bs-b').textContent = b;
      document.getElementById('v-bs-s').textContent = s;
      document.getElementById('v-bs-o').textContent = o;

      css = gen.boxShadow(x, y, b, s, c, o, i);
      target.style.boxShadow = css.split(':')[1].replace(';', '');
    } else if (this.currentMode === 'grad') {
      const t = document.getElementById('css-gr-t').value;
      const a = document.getElementById('css-gr-a').value;
      const c1 = document.getElementById('css-gr-c1').value;
      const s1 = document.getElementById('css-gr-s1').value;
      const c2 = document.getElementById('css-gr-c2').value;
      const s2 = document.getElementById('css-gr-s2').value;

      const use3 = document.getElementById('css-gr-use3').checked;

      const colors = [{ col: c1, stop: s1 }, { col: c2, stop: s2 }];
      if (use3) {
        const c3 = document.getElementById('css-gr-c3').value;
        const s3 = document.getElementById('css-gr-s3').value;
        colors.push({ col: c3, stop: s3 });
        // Sort by stop
        colors.sort((a, b) => a.stop - b.stop);
      }

      document.getElementById('css-gr-ang-grp').style.display = t === 'radial' ? 'none' : 'block';
      document.getElementById('v-gr-a').textContent = a;

      css = gen.gradientComplex(t, a, colors);
      target.style.cssText += css;
    } else if (this.currentMode === 'glass') {
      const o = document.getElementById('css-gl-o').value;
      const b = document.getElementById('css-gl-b').value;
      document.getElementById('v-gl-o').textContent = o;
      document.getElementById('v-gl-b').textContent = b;

      css = gen.glassmorphism(o, b);
      target.style.cssText = `width: 280px; height: 280px; display: flex; align-items: center; justify-content: center; ${css}`;
      target.innerHTML = '<span style="color:white; font-weight:700;">Glass Effect</span>';
      target.parentElement.style.background = 'url(assets/images/placeholder.jpg) center/cover';
      target.parentElement.style.backgroundImage = 'radial-gradient(circle at 50% 50%, #6366f1, #a855f7)';
    } else if (this.currentMode === 'border') {
      const tl = document.getElementById('css-br-tl').value;
      const tr = document.getElementById('css-br-tr').value;
      const bl = document.getElementById('css-br-bl').value;
      const br = document.getElementById('css-br-br').value;

      const bw = document.getElementById('css-bd-w').value;
      const bs = document.getElementById('css-bd-s').value;
      const bc = document.getElementById('css-bd-c').value;

      document.getElementById('v-bd-w').textContent = bw;

      const borderCSS = gen.border(bw, bs, bc);
      const radiusCSS = gen.borderRadius(tl, tr, br, bl);

      css = `${borderCSS}\n${radiusCSS}`;

      target.style.background = '#6366f1';
      target.style.borderRadius = `${tl}px ${tr}px ${br}px ${bl}px`;
      target.style.border = `${bw}px ${bs} ${bc}`;
    } else if (this.currentMode === 'neu') {
      const col = document.getElementById('css-neu-c').value;
      const size = document.getElementById('css-neu-s').value;
      const rad = document.getElementById('css-neu-r').value;
      const dist = document.getElementById('css-neu-d').value;
      const int = document.getElementById('css-neu-i').value;
      const shape = document.getElementById('css-neu-sh').value;

      css = gen.neumorphism(col, size, rad, dist, int, shape);
      target.style.cssText = `width: 280px; height: 280px; display: flex; align-items: center; justify-content: center; ${css}`;
      target.parentElement.style.background = col;
      target.parentElement.style.backgroundImage = 'none';
    } else if (this.currentMode === 'text') {
      const x = document.getElementById('css-ts-x').value;
      const y = document.getElementById('css-ts-y').value;
      const b = document.getElementById('css-ts-b').value;
      const c = document.getElementById('css-ts-c').value;

      css = gen.textShadow(x, y, b, c);
      target.style.textShadow = `${x}px ${y}px ${b}px ${c}`;
      target.style.background = 'transparent';
      target.style.color = '#333';
      target.style.fontSize = '3rem';
      target.textContent = 'Text';
    } else if (this.currentMode === 'flex') {
      const dir = document.getElementById('css-fx-dir').value;
      const just = document.getElementById('css-fx-just').value;
      const align = document.getElementById('css-fx-align').value;
      const wrap = document.getElementById('css-fx-wrap').value;
      const gap = document.getElementById('css-fx-gap').value;

      document.getElementById('v-fx-gap').textContent = gap;

      css = gen.flexbox(dir, just, align, wrap, gap);

      target.style.cssText = `width: 100%; height: 100%; padding: 20px; border-radius:20px; background:#f8fafc; overflow:hidden; ${css}`;

      for (let i = 1; i <= 5; i++) {
        const item = document.createElement('div');
        item.textContent = i;
        item.style.cssText = 'width: 60px; height: 60px; background: #6366f1; color: white; display:flex; align-items:center; justify-content:center; border-radius:12px; font-weight:700; flex-shrink: 0;';
        if (i % 2 === 0) item.style.background = '#a855f7';
        target.appendChild(item);
      }
    } else if (this.currentMode === 'filter') {
      const bl = document.getElementById('css-fl-bl').value;
      const br = document.getElementById('css-fl-br').value;
      const cn = document.getElementById('css-fl-cn').value;
      const gr = document.getElementById('css-fl-gr').value;
      const sp = document.getElementById('css-fl-sp').value;
      const hu = document.getElementById('css-fl-hu').value;

      css = gen.filter(bl, br, cn, gr, sp, hu);

      target.style.background = 'linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)';
      target.style.filter = `blur(${bl}px) brightness(${br}%) contrast(${cn}%) grayscale(${gr}%) sepia(${sp}%) hue-rotate(${hu}deg)`;
      target.innerHTML = '<span style="background:white; padding:5px 10px; border-radius:4px;">Filter Effect</span>';
    } else if (this.currentMode === 'trans') {
      const rot = document.getElementById('css-tf-rot').value;
      const sc = document.getElementById('css-tf-sc').value;
      const sx = document.getElementById('css-tf-sx').value;
      const sy = document.getElementById('css-tf-sy').value;
      const tx = document.getElementById('css-tf-tx').value;
      const ty = document.getElementById('css-tf-ty').value;

      document.getElementById('v-tf-sc').textContent = sc;

      css = gen.transform(rot, sc, sx, sy, tx, ty);

      target.style.background = '#6366f1';
      target.style.transform = `rotate(${rot}deg) scale(${sc}) skew(${sx}deg, ${sy}deg) translate(${tx}px, ${ty}px)`;
      target.innerHTML = '<span style="color:white; font-weight:700;">Transform</span>';
    }

    if (this.currentMode !== 'flex' && this.currentMode !== 'glass' && this.currentMode !== 'text' && this.currentMode !== 'filter' && this.currentMode !== 'trans' && !target.innerHTML) {
      target.innerHTML = '<span style="font-weight: 700; color: rgba(0,0,0,0.4); text-transform: uppercase;">Preview</span>';
    }

    snippet.textContent = css;
  }

  _allInputs() {
    return [
      'css-bs-x', 'css-bs-y', 'css-bs-b', 'css-bs-s', 'css-bs-c', 'css-bs-o', 'css-bs-i',
      'css-gr-t', 'css-gr-a', 'css-gr-c1', 'css-gr-c2', 'css-gr-c3', 'css-gr-s1', 'css-gr-s2', 'css-gr-s3',
      'css-gl-o', 'css-gl-b',
      'css-br-tl', 'css-br-tr', 'css-br-bl', 'css-br-br', 'css-bd-w', 'css-bd-s', 'css-bd-c',
      'css-neu-c', 'css-neu-s', 'css-neu-r', 'css-neu-d', 'css-neu-i', 'css-neu-sh',
      'css-ts-x', 'css-ts-y', 'css-ts-b', 'css-ts-c',
      'css-fx-dir', 'css-fx-just', 'css-fx-align', 'css-fx-wrap', 'css-fx-gap',
      'css-fl-bl', 'css-fl-br', 'css-fl-cn', 'css-fl-gr', 'css-fl-sp', 'css-fl-hu',
      'css-tf-rot', 'css-tf-sc', 'css-tf-sx', 'css-tf-sy', 'css-tf-tx', 'css-tf-ty'
    ];
  }
}

// Register tool
window.initCssGeneratorLogic = CSSStudioTool;
