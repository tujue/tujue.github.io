/* TULPAR - Advanced AI Prompt Wizard - Optimized UI */
class PromptWizardTool extends BaseTool {
  constructor(config) {
    super(config);
    this.state = {
      platform: 'midjourney',
      subject: '',
      style: '',
      mood: '',
      lighting: '',
      camera: '',
      quality: '',
      colors: '',
      composition: '',
      negative: '',
      params: {
        ar: '16:9',
        stylize: '100',
        chaos: '0',
        quality: '1',
        seed: '',
        version: '6.1'
      }
    };
  }

  renderUI() {
    const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
    const txt = isTr ? {
      title: 'Profesyonel AI Prompt Mühendisliği',
      platform: 'Platform',
      concept: 'Ana Konsept',
      conceptPh: 'Örn: Uzayda yüzen kristal ağaç, siberpunk ninja kedi...',
      enhance: 'AI İyileştir',
      template: 'Hızlı Şablonlar',
      modifiers: 'Düzenleyiciler',
      tabStyle: 'Stil & Atmosfer',
      tabLight: 'Işık & Kamera',
      tabQuality: 'Kalite & Detay',
      negative: 'Negatif İstem',
      negativePh: 'İstenmeyen: blur, distorted...',
      params: 'Parametreler',
      result: 'ÜRETİLEN PROMPT',
      copy: 'Kopyala',
      clear: 'Temizle'
    } : {
      title: 'Professional AI Prompt Engineering',
      platform: 'Platform',
      concept: 'Core Concept',
      conceptPh: 'e.g., Crystal tree floating in space, cyberpunk ninja cat...',
      enhance: 'AI Enhance',
      template: 'Quick Templates',
      modifiers: 'Modifiers',
      tabStyle: 'Style & Mood',
      tabLight: 'Light & Camera',
      tabQuality: 'Quality & Detail',
      negative: 'Negative Prompt',
      negativePh: 'Unwanted: blur, distorted...',
      params: 'Parameters',
      result: 'GENERATED PROMPT',
      copy: 'Copy',
      clear: 'Clear'
    };

    const platforms = [
      { id: 'midjourney', name: 'Midjourney', icon: '🎨' },
      { id: 'dalle', name: 'DALL-E', icon: '🖼️' },
      { id: 'stable', name: 'Stable Diff', icon: '🌈' },
      { id: 'chatgpt', name: 'ChatGPT', icon: '💬' },
      { id: 'claude', name: 'Claude', icon: '🧠' },
      { id: 'gemini', name: 'Gemini', icon: '✨' }
    ];

    const templates = isTr ? [
      { name: '📷 Portre', prompt: 'Professional portrait photography, studio lighting' },
      { name: '🏞️ Manzara', prompt: 'Epic landscape vista, dramatic sky' },
      { name: '📦 Ürün', prompt: 'Commercial product photography, clean background' },
      { name: '🏛️ Mimari', prompt: 'Modern architectural visualization' },
      { name: '🧙 Fantastik', prompt: 'Fantasy digital art, magical atmosphere' },
      { name: '🚀 Sci-Fi', prompt: 'Futuristic sci-fi scene, neon lights' }
    ] : [
      { name: '📷 Portrait', prompt: 'Professional portrait photography, studio lighting' },
      { name: '🏞️ Landscape', prompt: 'Epic landscape vista, dramatic sky' },
      { name: '📦 Product', prompt: 'Commercial product photography, clean background' },
      { name: '🏛️ Architecture', prompt: 'Modern architectural visualization' },
      { name: '🧙 Fantasy', prompt: 'Fantasy digital art, magical atmosphere' },
      { name: '🚀 Sci-Fi', prompt: 'Futuristic sci-fi scene, neon lights' }
    ];

    const categories = {
      style: {
        title: isTr ? 'Sanat Stili' : 'Art Style',
        items: isTr ?
          ['Fotogerçekçi', 'Sinematik', 'Yağlı Boya', 'Sulu Boya', 'Anime', '3D Render', 'Siberpunk', 'Steampunk', 'Minimalist', 'Soyut'] :
          ['Photorealistic', 'Cinematic', 'Oil Painting', 'Watercolor', 'Anime', '3D Render', 'Cyberpunk', 'Steampunk', 'Minimalist', 'Abstract']
      },
      mood: {
        title: isTr ? 'Atmosfer' : 'Mood',
        items: isTr ?
          ['Dramatik', 'Huzurlu', 'Gizemli', 'Enerjik', 'Melankolik', 'Masalsı', 'Karanlık', 'Parlak'] :
          ['Dramatic', 'Peaceful', 'Mysterious', 'Energetic', 'Melancholic', 'Whimsical', 'Dark', 'Bright']
      },
      lighting: {
        title: isTr ? 'Işıklandırma' : 'Lighting',
        items: isTr ?
          ['Altın Saat', 'Hacimsel', 'Stüdyo', 'Neon', 'Doğal', 'Kenar Işığı', 'Arkadan Aydınlatmalı', 'Yumuşak'] :
          ['Golden Hour', 'Volumetric', 'Studio', 'Neon', 'Natural', 'Rim Light', 'Backlit', 'Soft']
      },
      camera: {
        title: isTr ? 'Kamera' : 'Camera',
        items: isTr ?
          ['Geniş Açı', 'Telefoto', 'Makro', 'Drone', 'Alçak Açı', 'Yüksek Açı', 'Göz Seviyesi', 'Kuş Bakışı'] :
          ['Wide Angle', 'Telephoto', 'Macro', 'Drone', 'Low Angle', 'High Angle', 'Eye Level', 'Bird\'s Eye']
      },
      quality: {
        title: isTr ? 'Kalite' : 'Quality',
        items: isTr ?
          ['8K', 'Ultra Detaylı', 'Başyapıt', 'Ödüllü', 'Hiperrealistik', 'Keskin Odak'] :
          ['8K', 'Ultra Detailed', 'Masterpiece', 'Award Winning', 'Hyperrealistic', 'Sharp Focus']
      },
      colors: {
        title: isTr ? 'Renkler' : 'Colors',
        items: isTr ?
          ['Canlı', 'Soluk', 'Monokrom', 'Sıcak', 'Soğuk', 'Pastel', 'Neon', 'Toprak Tonları'] :
          ['Vibrant', 'Muted', 'Monochrome', 'Warm', 'Cool', 'Pastel', 'Neon', 'Earth Tones']
      },
      composition: {
        title: isTr ? 'Kompozisyon' : 'Composition',
        items: isTr ?
          ['Üçler Kuralı', 'Ortalanmış', 'Simetrik', 'Altın Oran', 'Yönlendirici Çizgiler'] :
          ['Rule of Thirds', 'Centered', 'Symmetrical', 'Golden Ratio', 'Leading Lines']
      }
    };

    return `
        <div class="tool-content prompt-studio" style="max-width: 100%; padding: 20px;">
            
            <!-- Top Control Bar -->
            <div class="card" style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 20px; margin-bottom: 1.5rem;">
                <div style="display: grid; grid-template-columns: 1fr auto auto; gap: 1.5rem; align-items: end;">
                    
                    <!-- Main Concept (Left - Takes most space) -->
                    <div>
                        <label class="form-label" style="margin-bottom: 0.5rem; font-size: 0.75rem;">${txt.concept}</label>
                        <textarea id="pw-subject" class="form-input" style="height: 150px; font-size: 1rem; resize: vertical;" placeholder="${txt.conceptPh}"></textarea>
                    </div>

                    <!-- Platform Selection (Middle) -->
                    <div style="min-width: 400px;">
                        <label class="form-label" style="margin-bottom: 0.5rem; font-size: 0.75rem;">${txt.platform}</label>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
                            ${platforms.map(p => `
                                <div class="pw-platform ${p.id === 'midjourney' ? 'active' : ''}" data-platform="${p.id}" style="padding: 10px 8px;">
                                    <span style="font-size: 1.2rem;">${p.icon}</span>
                                    <span style="font-size: 0.65rem; margin-top: 2px;">${p.name}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Actions (Right) -->
                    <div style="display: flex; flex-direction: column; gap: 8px; min-width: 140px;">
                        <button id="pw-enhance" class="btn btn-secondary" style="height: 42px; font-size: 0.85rem; font-weight: 700;">${txt.enhance} 🪄</button>
                        <button id="pw-copy" class="btn btn-primary" style="height: 42px; font-size: 0.85rem; font-weight: 700;">${txt.copy} 📋</button>
                    </div>
                </div>

                <!-- Templates Row -->
                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.05);">
                    <label class="form-label" style="margin-bottom: 0.5rem; font-size: 0.7rem; opacity: 0.6;">${txt.template}</label>
                    <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px;">
                        ${templates.map(t => `<div class="pw-template" data-prompt="${t.prompt}">${t.name}</div>`).join('')}
                    </div>
                </div>
            </div>

            <!-- Main Content Area -->
            <div style="display: grid; grid-template-columns: 1fr 450px; gap: 1.5rem;">
                
                <!-- Left: Modifiers with Tabs -->
                <div class="card" style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 20px;">
                    <h5 style="font-size: 0.75rem; margin-bottom: 1rem; opacity: 0.6; text-transform: uppercase;">${txt.modifiers}</h5>
                    
                    <!-- Tab Navigation -->
                    <div style="display: flex; gap: 8px; margin-bottom: 1rem; border-bottom: 2px solid rgba(255,255,255,0.05); padding-bottom: 8px;">
                        <button class="pw-mod-tab active" data-tab="style">${txt.tabStyle}</button>
                        <button class="pw-mod-tab" data-tab="light">${txt.tabLight}</button>
                        <button class="pw-mod-tab" data-tab="quality">${txt.tabQuality}</button>
                    </div>

                    <!-- Tab Content 1: Style & Mood -->
                    <div class="pw-tab-content active" data-content="style">
                        <div class="pw-mod-group">
                            <label class="pw-mod-label">${categories.style.title}</label>
                            <div class="pw-grid-compact">
                                ${categories.style.items.map(i => `<div class="pw-chip" data-key="style" data-val="${i}">${i}</div>`).join('')}
                            </div>
                        </div>
                        <div class="pw-mod-group">
                            <label class="pw-mod-label">${categories.mood.title}</label>
                            <div class="pw-grid-compact">
                                ${categories.mood.items.map(i => `<div class="pw-chip" data-key="mood" data-val="${i}">${i}</div>`).join('')}
                            </div>
                        </div>
                        <div class="pw-mod-group">
                            <label class="pw-mod-label">${categories.colors.title}</label>
                            <div class="pw-grid-compact">
                                ${categories.colors.items.map(i => `<div class="pw-chip" data-key="colors" data-val="${i}">${i}</div>`).join('')}
                            </div>
                        </div>
                    </div>

                    <!-- Tab Content 2: Light & Camera -->
                    <div class="pw-tab-content" data-content="light">
                        <div class="pw-mod-group">
                            <label class="pw-mod-label">${categories.lighting.title}</label>
                            <div class="pw-grid-compact">
                                ${categories.lighting.items.map(i => `<div class="pw-chip" data-key="lighting" data-val="${i}">${i}</div>`).join('')}
                            </div>
                        </div>
                        <div class="pw-mod-group">
                            <label class="pw-mod-label">${categories.camera.title}</label>
                            <div class="pw-grid-compact">
                                ${categories.camera.items.map(i => `<div class="pw-chip" data-key="camera" data-val="${i}">${i}</div>`).join('')}
                            </div>
                        </div>
                        <div class="pw-mod-group">
                            <label class="pw-mod-label">${categories.composition.title}</label>
                            <div class="pw-grid-compact">
                                ${categories.composition.items.map(i => `<div class="pw-chip" data-key="composition" data-val="${i}">${i}</div>`).join('')}
                            </div>
                        </div>
                    </div>

                    <!-- Tab Content 3: Quality -->
                    <div class="pw-tab-content" data-content="quality">
                        <div class="pw-mod-group">
                            <label class="pw-mod-label">${categories.quality.title}</label>
                            <div class="pw-grid-compact">
                                ${categories.quality.items.map(i => `<div class="pw-chip" data-key="quality" data-val="${i}">${i}</div>`).join('')}
                            </div>
                        </div>
                        <div class="pw-mod-group">
                            <label class="pw-mod-label">${txt.negative}</label>
                            <textarea id="pw-negative" class="form-input" style="height: 60px; font-size: 0.85rem; resize: none;" placeholder="${txt.negativePh}"></textarea>
                        </div>
                    </div>
                </div>

                <!-- Right: Result & Parameters -->
                <div>
                    <!-- Result Box -->
                    <div class="card" style="padding: 1.5rem; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border: 2px solid var(--primary); border-radius: 20px; margin-bottom: 1rem;">
                        <h5 style="color: var(--primary); font-size: 0.7rem; margin-bottom: 1rem; text-align: center; letter-spacing: 1px;">${txt.result}</h5>
                        <div id="pw-output" style="min-height: 200px; max-height: 300px; overflow-y: auto; padding: 1.2rem; background: rgba(0,0,0,0.4); border-radius: 12px; font-family: var(--font-mono); font-size: 0.8rem; line-height: 1.7; color: #a5b4fc; word-break: break-word;">
                            <span style="opacity: 0.3;">Your prompt will appear here...</span>
                        </div>
                    </div>

                    <!-- Parameters (for image AI) -->
                    <div id="pw-params-panel" class="card" style="padding: 1.2rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 16px;">
                        <h5 style="font-size: 0.65rem; margin-bottom: 0.8rem; opacity: 0.6; text-transform: uppercase;">${txt.params}</h5>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                            <div class="form-group">
                                <label class="form-label" style="font-size: 0.65rem;">Aspect Ratio</label>
                                <select id="pw-ar" class="form-select" style="font-size: 0.8rem; height: 36px;">
                                    <option value="1:1">1:1</option>
                                    <option value="16:9" selected>16:9</option>
                                    <option value="9:16">9:16</option>
                                    <option value="4:3">4:3</option>
                                    <option value="3:2">3:2</option>
                                    <option value="21:9">21:9</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label class="form-label" style="font-size: 0.65rem;">Seed</label>
                                <input type="number" id="pw-seed" class="form-input" placeholder="Random" style="font-size: 0.8rem; height: 36px;">
                            </div>
                        </div>

                        <div class="form-group" style="margin-top: 12px;">
                            <label class="form-label" style="font-size: 0.65rem;">Stylize: <span id="pw-s-val">100</span></label>
                            <input type="range" id="pw-stylize" min="0" max="1000" value="100" step="50" class="form-range">
                        </div>

                        <div class="form-group" style="margin-top: 12px;">
                            <label class="form-label" style="font-size: 0.65rem;">Chaos: <span id="pw-c-val">0</span></label>
                            <input type="range" id="pw-chaos" min="0" max="100" value="0" step="10" class="form-range">
                        </div>
                    </div>
                </div>
            </div>
            
            <style>
                .pw-platform { 
                    display: flex; 
                    flex-direction: column; 
                    align-items: center; 
                    justify-content: center;
                    background: rgba(255,255,255,0.03); 
                    border: 2px solid rgba(255,255,255,0.05); 
                    border-radius: 10px; 
                    cursor: pointer; 
                    transition: all 0.2s;
                }
                .pw-platform:hover { 
                    background: rgba(255,255,255,0.08); 
                    transform: scale(1.02);
                }
                .pw-platform.active { 
                    background: linear-gradient(135deg, var(--primary) 0%, #6366f1 100%); 
                    border-color: var(--primary); 
                    box-shadow: 0 2px 10px rgba(99, 102, 241, 0.3);
                }
                
                .pw-template {
                    padding: 6px 10px;
                    background: rgba(16, 185, 129, 0.08);
                    border: 1px solid rgba(16, 185, 129, 0.15);
                    border-radius: 8px;
                    font-size: 0.7rem;
                    text-align: center;
                    cursor: pointer;
                    transition: 0.2s;
                    font-weight: 600;
                }
                .pw-template:hover {
                    background: rgba(16, 185, 129, 0.2);
                    transform: scale(1.02);
                }

                .pw-mod-tab {
                    background: transparent;
                    border: none;
                    color: #666;
                    font-size: 0.75rem;
                    padding: 8px 16px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: 0.2s;
                }
                .pw-mod-tab:hover { color: #999; }
                .pw-mod-tab.active { 
                    background: var(--primary); 
                    color: white; 
                }

                .pw-tab-content { display: none; }
                .pw-tab-content.active { display: block; }

                .pw-mod-group { 
                    margin-bottom: 1.2rem; 
                    padding-bottom: 1.2rem; 
                    border-bottom: 1px solid rgba(255,255,255,0.03);
                }
                .pw-mod-group:last-child { border-bottom: none; margin-bottom: 0; }

                .pw-mod-label {
                    display: block;
                    font-size: 0.7rem;
                    margin-bottom: 0.6rem;
                    opacity: 0.5;
                    font-weight: 600;
                }
                
                .pw-grid-compact { 
                    display: grid; 
                    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr)); 
                    gap: 6px;
                }
                
                .pw-chip { 
                    padding: 6px 8px; 
                    background: rgba(255,255,255,0.03); 
                    border: 1px solid rgba(255,255,255,0.08); 
                    border-radius: 6px; 
                    font-size: 0.65rem; 
                    text-align: center; 
                    cursor: pointer; 
                    transition: all 0.15s;
                    font-weight: 500;
                }
                .pw-chip:hover { 
                    background: rgba(255,255,255,0.1); 
                }
                .pw-chip.selected { 
                    background: var(--primary); 
                    color: white; 
                    border-color: var(--primary); 
                    font-weight: 700;
                    box-shadow: 0 2px 6px rgba(99, 102, 241, 0.3);
                }
                
                .form-range {
                    width: 100%;
                    height: 4px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 5px;
                    outline: none;
                }
                .form-range::-webkit-slider-thumb {
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    background: var(--primary);
                    cursor: pointer;
                }
            </style>
        </div>
        `;
  }

  setupListeners() {
    const subject = document.getElementById('pw-subject');
    const negative = document.getElementById('pw-negative');
    const output = document.getElementById('pw-output');
    const enhanceBtn = document.getElementById('pw-enhance');
    const copyBtn = document.getElementById('pw-copy');
    const paramsPanel = document.getElementById('pw-params-panel');

    const arSelect = document.getElementById('pw-ar');
    const stylizeSlider = document.getElementById('pw-stylize');
    const chaosSlider = document.getElementById('pw-chaos');
    const seedInput = document.getElementById('pw-seed');
    const stylizeVal = document.getElementById('pw-s-val');
    const chaosVal = document.getElementById('pw-c-val');

    const updatePrompt = () => {
      const parts = [];

      if (subject.value.trim()) {
        parts.push(subject.value.trim());
      }

      const isImageAI = ['midjourney', 'dalle', 'stable'].includes(this.state.platform);

      if (isImageAI) {
        if (this.state.style) parts.push(`${this.state.style} style`);
        if (this.state.mood) parts.push(`${this.state.mood.toLowerCase()} mood`);
        if (this.state.lighting) parts.push(`${this.state.lighting.toLowerCase()} lighting`);
        if (this.state.camera) parts.push(`${this.state.camera.toLowerCase()} shot`);
        if (this.state.composition) parts.push(`${this.state.composition.toLowerCase()} composition`);
        if (this.state.colors) parts.push(`${this.state.colors.toLowerCase()} colors`);
        if (this.state.quality) parts.push(this.state.quality.toLowerCase());
      }

      let prompt = parts.filter(p => p).join(', ');

      if (this.state.platform === 'midjourney') {
        const params = [];
        params.push(`--ar ${this.state.params.ar}`);
        params.push(`--stylize ${this.state.params.stylize}`);
        if (parseInt(this.state.params.chaos) > 0) params.push(`--chaos ${this.state.params.chaos}`);
        if (this.state.params.seed) params.push(`--seed ${this.state.params.seed}`);
        params.push(`--v ${this.state.params.version}`);

        if (negative.value.trim()) {
          prompt += ` --no ${negative.value.trim()}`;
        }

        prompt += ' ' + params.join(' ');

      } else if (this.state.platform === 'stable') {
        if (prompt) prompt += '\nNegative prompt: ' + (negative.value.trim() || 'low quality, blurry, distorted');
        prompt += `\nSteps: 30, Sampler: DPM++ 2M, CFG scale: 7`;

      } else if (this.state.platform === 'dalle') {
        prompt = `I NEED to test how the tool works with extremely simple prompts. DO NOT add any detail, just use it AS-IS:\n${prompt}`;
        if (negative.value.trim()) {
          prompt += `\n\nAvoid: ${negative.value.trim()}`;
        }

      } else if (['chatgpt', 'claude', 'gemini'].includes(this.state.platform)) {
        if (this.state.style) prompt = `You are an expert in ${this.state.style.toLowerCase()}. ${prompt}`;
        if (this.state.mood) prompt += `\n\nTone: ${this.state.mood}`;
        if (this.state.quality) prompt += `\n\nQuality Requirements: ${this.state.quality}`;
      }

      output.innerHTML = prompt || '<span style="opacity: 0.3;">Start by entering your concept...</span>';
      paramsPanel.style.display = isImageAI ? 'block' : 'none';
    };

    // Platform switching
    document.querySelectorAll('.pw-platform').forEach(p => {
      p.onclick = () => {
        document.querySelectorAll('.pw-platform').forEach(x => x.classList.remove('active'));
        p.classList.add('active');
        this.state.platform = p.dataset.platform;
        updatePrompt();
      };
    });

    // Tab switching
    document.querySelectorAll('.pw-mod-tab').forEach(tab => {
      tab.onclick = () => {
        document.querySelectorAll('.pw-mod-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const targetTab = tab.dataset.tab;
        document.querySelectorAll('.pw-tab-content').forEach(c => c.classList.remove('active'));
        document.querySelector(`[data-content="${targetTab}"]`).classList.add('active');
      };
    });

    // Templates
    document.querySelectorAll('.pw-template').forEach(t => {
      t.onclick = () => {
        subject.value = t.dataset.prompt;
        updatePrompt();
      };
    });

    // Chips
    document.querySelectorAll('.pw-chip').forEach(chip => {
      chip.onclick = () => {
        const key = chip.dataset.key;
        const val = chip.dataset.val;
        const wasSelected = chip.classList.contains('selected');

        document.querySelectorAll(`[data-key="${key}"]`).forEach(c => c.classList.remove('selected'));

        if (!wasSelected) {
          chip.classList.add('selected');
          this.state[key] = val;
        } else {
          this.state[key] = '';
        }

        updatePrompt();
      };
    });

    // Parameters
    arSelect.onchange = () => { this.state.params.ar = arSelect.value; updatePrompt(); };
    stylizeSlider.oninput = () => {
      this.state.params.stylize = stylizeSlider.value;
      stylizeVal.textContent = stylizeSlider.value;
      updatePrompt();
    };
    chaosSlider.oninput = () => {
      this.state.params.chaos = chaosSlider.value;
      chaosVal.textContent = chaosSlider.value;
      updatePrompt();
    };
    seedInput.oninput = () => { this.state.params.seed = seedInput.value; updatePrompt(); };

    subject.oninput = updatePrompt;
    negative.oninput = updatePrompt;

    // Enhance
    enhanceBtn.onclick = async () => {
      if (!subject.value.trim()) {
        this.showNotification('Please enter a concept first', 'error');
        return;
      }

      enhanceBtn.disabled = true;
      const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
      enhanceBtn.textContent = '🔄 ' + (isTr ? 'İyileştiriliyor...' : 'Enhancing...');

      try {
        const enhanced = await window.DevTools.promptTools.enhance(subject.value, this.state.platform);
        subject.value = enhanced;
        updatePrompt();
        this.showNotification(isTr ? 'Başarılı!' : 'Enhanced!', 'success');
      } catch (err) {
        this.showNotification(err.message, 'error');
      } finally {
        enhanceBtn.disabled = false;
        enhanceBtn.textContent = (isTr ? 'AI İyileştir' : 'AI Enhance') + ' 🪄';
      }
    };

    // Copy
    copyBtn.onclick = () => {
      const text = output.textContent;
      if (text && !text.includes('...')) {
        this.copyToClipboard(text);
      } else {
        this.showNotification('No prompt to copy', 'error');
      }
    };

    updatePrompt();
  }
}

window.initPromptWizardLogic = PromptWizardTool;
