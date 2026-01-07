/* TULPAR - Professional OG Image Studio v2.2 - Mouse Resize */
class OGImageStudioTool extends BaseTool {
    constructor(config) {
        super(config);
        this.canvas = null;
        this.ctx = null;
        this.state = {
            width: 1200,
            height: 630,
            bgType: 'gradient',
            bgColor: '#0f172a',
            gradient: { from: '#667eea', to: '#764ba2', angle: 135 },
            layers: [],
            selectedLayer: null,
            filter: { blur: 0, brightness: 100, contrast: 100, saturation: 100 }
        };
        this.isDragging = false;
        this.isResizing = false;
        this.resizeHandle = null; // 'se', 'sw', 'ne', 'nw' (corners)
        this.dragOffset = { x: 0, y: 0 };
        this.initialSize = { width: 0, height: 0 };
        this.layerIdCounter = 0;
    }

    renderUI() {
        const isTr = document.documentElement.lang === 'tr';
        return `
            <style>
                .og-studio-container {
                    display: grid;
                    grid-template-columns: 280px 1fr 340px;
                    gap: 24px;
                    height: calc(100vh - 200px);
                    max-height: 800px;
                    font-family: 'Inter', sans-serif;
                }

                /* LEFT SIDEBAR - Templates & Tools */
                .og-sidebar-left {
                    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
                    border-radius: 16px;
                    padding: 20px;
                    overflow-y: auto;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .og-sidebar-left::-webkit-scrollbar,
                .og-layers-list::-webkit-scrollbar,
                .og-props-scroll::-webkit-scrollbar {
                    width: 6px;
                }

                .og-sidebar-left::-webkit-scrollbar-track,
                .og-layers-list::-webkit-scrollbar-track,
                .og-props-scroll::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 3px;
                }

                .og-sidebar-left::-webkit-scrollbar-thumb,
                .og-layers-list::-webkit-scrollbar-thumb,
                .og-props-scroll::-webkit-scrollbar-thumb {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 3px;
                }

                .og-section {
                    margin-bottom: 24px;
                }

                .og-section-title {
                    font-size: 13px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    color: #94a3b8;
                    margin-bottom: 12px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .og-template-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 10px;
                }

                .og-template-card {
                    aspect-ratio: 1200/630;
                    border-radius: 8px;
                    cursor: pointer;
                    border: 2px solid rgba(255, 255, 255, 0.1);
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }

                .og-template-card:hover {
                    border-color: #667eea;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
                }

                .og-template-name {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: rgba(0, 0, 0, 0.7);
                    padding: 4px 8px;
                    font-size: 10px;
                    text-align: center;
                    color: white;
                    font-weight: 500;
                }

                .og-btn-group {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 8px;
                }

                .og-btn {
                    padding: 10px 14px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    color: white;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                }

                .og-btn:hover {
                    background: rgba(102, 126, 234, 0.2);
                    border-color: #667eea;
                    transform: translateY(-1px);
                }

                /* CENTER - Canvas Area */
                .og-canvas-area {
                    background: rgba(0, 0, 0, 0.3);
                    border-radius: 16px;
                    padding: 30px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    position: relative;
                }

                .og-canvas-wrapper {
                    position: relative;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                    border-radius: 12px;
                    overflow: hidden;
                }

                #og-canvas {
                    display: block;
                    max-width: 100%;
                    height: auto;
                    border: 2px solid rgba(255, 255, 255, 0.1);
                    cursor: move;
                }

                .og-canvas-info {
                    position: absolute;
                    top: 12px;
                    left: 12px;
                    background: rgba(0, 0, 0, 0.7);
                    padding: 8px 14px;
                    border-radius: 8px;
                    font-size: 11px;
                    color: #94a3b8;
                    backdrop-filter: blur(10px);
                }

                .og-export-bar {
                    margin-top: 20px;
                    display: flex;
                    gap: 12px;
                    align-items: center;
                }

                .og-export-btn {
                    padding: 12px 24px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: none;
                    border-radius: 10px;
                    color: white;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 13px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .og-export-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
                }

                .og-format-select {
                    padding: 10px 14px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    color: white;
                    font-size: 12px;
                    cursor: pointer;
                }

                /* RIGHT SIDEBAR - Fixed Scroll */
                .og-sidebar-right {
                    background: linear-gradient(135deg, rgba(118, 75, 162, 0.1) 0%, rgba(102, 126, 234, 0.1) 100%);
                    border-radius: 16px;
                    padding: 20px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    overflow: hidden; /* Prevent parent scroll */
                }

                /* Layers Panel - Scrollable */
                .og-layers-panel {
                    flex: 0 0 auto;
                    max-height: 45%;
                    display: flex;
                    flex-direction: column;
                }

                .og-layers-list {
                    overflow-y: auto;
                    overflow-x: hidden;
                    padding-right: 8px;
                }

                .og-layer-item {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    padding: 12px;
                    margin-bottom: 8px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .og-layer-item:hover {
                    background: rgba(255, 255, 255, 0.08);
                    border-color: #667eea;
                }

                .og-layer-item.active {
                    background: rgba(102, 126, 234, 0.2);
                    border-color: #667eea;
                }

                .og-layer-icon {
                    width: 32px;
                    height: 32px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                }

                .og-layer-info {
                    flex: 1;
                    min-width: 0;
                }

                .og-layer-name {
                    font-size: 12px;
                    font-weight: 500;
                    color: white;
                    margin-bottom: 2px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .og-layer-type {
                    font-size: 10px;
                    color: #94a3b8;
                }

                .og-layer-btn {
                    width: 28px;
                    height: 28px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 6px;
                    color: white;
                    cursor: pointer;
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }

                .og-layer-btn:hover {
                    background: rgba(239, 68, 68, 0.2);
                    border-color: #ef4444;
                }

                /* Properties Panel - Scrollable */
                .og-props-panel {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    min-height: 0;
                }

                .og-props-scroll {
                    overflow-y: auto;
                    overflow-x: hidden;
                    padding-right: 8px;
                }

                .og-prop-group {
                    margin-bottom: 16px;
                }

                .og-prop-label {
                    font-size: 11px;
                    color: #94a3b8;
                    margin-bottom: 6px;
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .og-prop-value {
                    color: #667eea;
                    font-weight: 600;
                }

                .og-input {
                    width: 100%;
                    padding: 10px 12px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    color: white;
                    font-size: 13px;
                    transition: all 0.3s ease;
                }

                .og-input:focus {
                    outline: none;
                    border-color: #667eea;
                    background: rgba(255, 255, 255, 0.08);
                }

                .og-slider {
                    width: 100%;
                    height: 6px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 3px;
                    outline: none;
                    -webkit-appearance: none;
                }

                .og-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 16px;
                    height: 16px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
                }

                .og-gradient-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 8px;
                }

                .og-gradient-preset {
                    aspect-ratio: 1;
                    border-radius: 8px;
                    cursor: pointer;
                    border: 2px solid rgba(255, 255, 255, 0.1);
                    transition: all 0.3s ease;
                }

                .og-gradient-preset:hover {
                    border-color: #667eea;
                    transform: scale(1.05);
                }

                .og-empty-state {
                    text-align: center;
                    padding: 40px 20px;
                    color: #64748b;
                }

                .og-empty-state i {
                    font-size: 48px;
                    margin-bottom: 16px;
                    opacity: 0.3;
                }

                .og-empty-state p {
                    font-size: 13px;
                    margin: 0;
                }

                /* Icon Picker Modal */
                .og-icon-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(10px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    animation: fadeIn 0.2s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .og-icon-modal-content {
                    background: linear-gradient(135deg, rgba(15, 15, 35, 0.95) 0%, rgba(30, 30, 50, 0.95) 100%);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                    padding: 30px;
                    max-width: 600px;
                    width: 90%;
                    max-height: 80vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                }

                .og-icon-modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                }

                .og-icon-modal-title {
                    font-size: 20px;
                    font-weight: 700;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .og-icon-close {
                    width: 36px;
                    height: 36px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    color: white;
                    cursor: pointer;
                    font-size: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }

                .og-icon-close:hover {
                    background: rgba(239, 68, 68, 0.2);
                    border-color: #ef4444;
                }

                .og-icon-category {
                    margin-bottom: 24px;
                }

                .og-icon-category-title {
                    font-size: 13px;
                    font-weight: 600;
                    color: #94a3b8;
                    margin-bottom: 12px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .og-icon-grid {
                    display: grid;
                    grid-template-columns: repeat(8, 1fr);
                    gap: 12px;
                }

                .og-icon-item {
                    aspect-ratio: 1;
                    background: rgba(255, 255, 255, 0.05);
                    border: 2px solid rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 28px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .og-icon-item:hover {
                    background: rgba(102, 126, 234, 0.2);
                    border-color: #667eea;
                    transform: scale(1.1);
                }

                @media (max-width: 1200px) {
                    .og-studio-container {
                        grid-template-columns: 1fr;
                        height: auto;
                        max-height: none;
                    }
                    
                    .og-sidebar-left, .og-sidebar-right {
                        max-height: 400px;
                    }
                }
            </style>

            <div class="og-studio-container">
                <!-- LEFT SIDEBAR -->
                <div class="og-sidebar-left">
                    <!-- Templates Section -->
                    <div class="og-section">
                        <div class="og-section-title">📐 ${isTr ? 'ŞABLONLAR' : 'TEMPLATES'}</div>
                        <div class="og-template-grid" id="og-templates"></div>
                    </div>

                    <!-- Add Elements -->
                    <div class="og-section">
                        <div class="og-section-title">➕ ${isTr ? 'ÖĞELER' : 'ELEMENTS'}</div>
                        <div class="og-btn-group">
                            <button class="og-btn" id="og-add-text">
                                <i class="fas fa-font"></i>
                                ${isTr ? 'Metin' : 'Text'}
                            </button>
                            <button class="og-btn" id="og-add-image">
                                <i class="fas fa-image"></i>
                                ${isTr ? 'Resim' : 'Image'}
                            </button>
                            <button class="og-btn" id="og-add-shape">
                                <i class="fas fa-shapes"></i>
                                ${isTr ? 'Şekil' : 'Shape'}
                            </button>
                            <button class="og-btn" id="og-add-icon">
                                <i class="fas fa-icons"></i>
                                ${isTr ? 'İkon' : 'Icon'}
                            </button>
                        </div>
                    </div>

                    <!-- Background Section -->
                    <div class="og-section">
                        <div class="og-section-title">🎨 ${isTr ? 'ARKA PLAN' : 'BACKGROUND'}</div>
                        <div class="og-prop-group">
                            <div class="og-prop-label">${isTr ? 'Tip' : 'Type'}</div>
                            <select class="og-input" id="og-bg-type">
                                <option value="gradient">${isTr ? 'Gradyan' : 'Gradient'}</option>
                                <option value="solid">${isTr ? 'Düz Renk' : 'Solid Color'}</option>
                            </select>
                        </div>
                        <div id="og-gradient-section">
                            <div class="og-gradient-grid" id="og-gradients"></div>
                        </div>
                        <div id="og-solid-section" style="display: none;">
                            <input type="color" class="og-input" id="og-solid-color" value="#0f172a">
                        </div>
                    </div>

                    <!-- Filters Section -->
                    <div class="og-section">
                        <div class="og-section-title">🎭 ${isTr ? 'FİLTRELER' : 'FILTERS'}</div>
                        <div class="og-prop-group">
                            <div class="og-prop-label">
                                ${isTr ? 'Bulanıklık' : 'Blur'}
                                <span class="og-prop-value"><span id="blur-val">0</span>px</span>
                            </div>
                            <input type="range" class="og-slider" id="og-blur" min="0" max="20" value="0">
                        </div>
                        <div class="og-prop-group">
                            <div class="og-prop-label">
                                ${isTr ? 'Parlaklık' : 'Brightness'}
                                <span class="og-prop-value"><span id="brightness-val">100</span>%</span>
                            </div>
                            <input type="range" class="og-slider" id="og-brightness" min="50" max="150" value="100">
                        </div>
                        <div class="og-prop-group">
                            <div class="og-prop-label">
                                ${isTr ? 'Kontrast' : 'Contrast'}
                                <span class="og-prop-value"><span id="contrast-val">100</span>%</span>
                            </div>
                            <input type="range" class="og-slider" id="og-contrast" min="50" max="150" value="100">
                        </div>
                    </div>
                </div>

                <!-- CENTER - Canvas -->
                <div class="og-canvas-area">
                    <div class="og-canvas-info">
                        1200 × 630 px • Open Graph
                    </div>
                    <div class="og-canvas-wrapper">
                        <canvas id="og-canvas" width="1200" height="630"></canvas>
                    </div>
                    <div class="og-export-bar">
                        <select class="og-format-select" id="og-format">
                            <option value="png">PNG</option>
                            <option value="jpg">JPG</option>
                            <option value="webp">WebP</option>
                        </select>
                        <button class="og-export-btn" id="og-export">
                            <i class="fas fa-download"></i>
                            ${isTr ? 'Dışa Aktar' : 'Export'}
                        </button>
                        <button class="og-btn" id="og-clear-all">
                            <i class="fas fa-trash"></i>
                            ${isTr ? 'Temizle' : 'Clear'}
                        </button>
                    </div>
                </div>

                <!-- RIGHT SIDEBAR -->
                <div class="og-sidebar-right">
                    <!-- Layers Panel -->
                    <div class="og-layers-panel">
                        <div class="og-section-title">📚 ${isTr ? 'KATMANLAR' : 'LAYERS'}</div>
                        <div class="og-layers-list" id="og-layers-list"></div>
                    </div>

                    <!-- Properties Panel -->
                    <div class="og-props-panel">
                        <div class="og-section-title">⚙️ ${isTr ? 'ÖZELLİKLER' : 'PROPERTIES'}</div>
                        <div class="og-props-scroll" id="og-props-content"></div>
                    </div>
                </div>
            </div>
        `;
    }

    setupListeners() {
        this.canvas = document.getElementById('og-canvas');
        this.ctx = this.canvas.getContext('2d');

        // Load templates and gradients
        this.loadTemplates();
        this.loadGradients();

        // Add element buttons
        document.getElementById('og-add-text').onclick = () => this.addTextLayer();
        document.getElementById('og-add-image').onclick = () => this.uploadImage();
        document.getElementById('og-add-shape').onclick = () => this.addShapeLayer();
        document.getElementById('og-add-icon').onclick = () => this.showIconPicker();

        // Background controls
        document.getElementById('og-bg-type').onchange = (e) => {
            this.state.bgType = e.target.value;
            document.getElementById('og-gradient-section').style.display = e.target.value === 'gradient' ? 'block' : 'none';
            document.getElementById('og-solid-section').style.display = e.target.value === 'solid' ? 'block' : 'none';
            this.draw();
        };

        document.getElementById('og-solid-color').oninput = (e) => {
            this.state.bgColor = e.target.value;
            this.draw();
        };

        // Filter controls
        document.getElementById('og-blur').oninput = (e) => {
            this.state.filter.blur = e.target.value;
            document.getElementById('blur-val').textContent = e.target.value;
            this.draw();
        };

        document.getElementById('og-brightness').oninput = (e) => {
            this.state.filter.brightness = e.target.value;
            document.getElementById('brightness-val').textContent = e.target.value;
            this.draw();
        };

        document.getElementById('og-contrast').oninput = (e) => {
            this.state.filter.contrast = e.target.value;
            document.getElementById('contrast-val').textContent = e.target.value;
            this.draw();
        };

        // Export
        document.getElementById('og-export').onclick = () => this.exportImage();
        document.getElementById('og-clear-all').onclick = () => this.clearAll();

        // Canvas interactions
        this.canvas.onmousedown = (e) => this.onCanvasMouseDown(e);
        this.canvas.onmousemove = (e) => this.onCanvasMouseMove(e);
        this.canvas.onmouseup = () => this.onCanvasMouseUp();

        // Initial draw
        this.draw();
    }

    loadTemplates() {
        const isTr = document.documentElement.lang === 'tr';
        const templates = [
            { name: isTr ? 'Modern Tech' : 'Modern Tech', gradient: { from: '#667eea', to: '#764ba2', angle: 135 } },
            { name: isTr ? 'Gün Batımı' : 'Sunset', gradient: { from: '#ff6b6b', to: '#feca57', angle: 45 } },
            { name: isTr ? 'Okyanus' : 'Ocean', gradient: { from: '#1e3c72', to: '#2a5298', angle: 90 } },
            { name: isTr ? 'Orman' : 'Forest', gradient: { from: '#134e5e', to: '#71b280', angle: 135 } },
            { name: isTr ? 'Lavanta' : 'Lavender', gradient: { from: '#a8caba', to: '#5d4e6d', angle: 180 } },
            { name: isTr ? 'Ateş' : 'Fire', gradient: { from: '#f12711', to: '#f5af19', angle: 45 } },
            { name: isTr ? 'Geceyarısı' : 'Midnight', gradient: { from: '#2c3e50', to: '#3498db', angle: 135 } },
            { name: isTr ? 'Şafak' : 'Dawn', gradient: { from: '#ffecd2', to: '#fcb69f', angle: 90 } }
        ];

        const container = document.getElementById('og-templates');
        templates.forEach((template, idx) => {
            const card = document.createElement('div');
            card.className = 'og-template-card';
            card.style.background = `linear-gradient(${template.gradient.angle}deg, ${template.gradient.from}, ${template.gradient.to})`;
            card.innerHTML = `<div class="og-template-name">${template.name}</div>`;
            card.onclick = () => this.applyTemplate(template.gradient);
            container.appendChild(card);
        });
    }

    loadGradients() {
        const gradients = [
            { from: '#667eea', to: '#764ba2' },
            { from: '#f093fb', to: '#f5576c' },
            { from: '#4facfe', to: '#00f2fe' },
            { from: '#43e97b', to: '#38f9d7' },
            { from: '#fa709a', to: '#fee140' },
            { from: '#30cfd0', to: '#330867' },
            { from: '#a8edea', to: '#fed6e3' },
            { from: '#ff9a56', to: '#ff6a88' }
        ];

        const container = document.getElementById('og-gradients');
        gradients.forEach(grad => {
            const preset = document.createElement('div');
            preset.className = 'og-gradient-preset';
            preset.style.background = `linear-gradient(135deg, ${grad.from}, ${grad.to})`;
            preset.onclick = () => {
                this.state.gradient = { ...grad, angle: 135 };
                this.state.bgType = 'gradient';
                document.getElementById('og-bg-type').value = 'gradient';
                this.draw();
            };
            container.appendChild(preset);
        });
    }

    applyTemplate(gradient) {
        this.state.gradient = gradient;
        this.state.bgType = 'gradient';
        document.getElementById('og-bg-type').value = 'gradient';
        document.getElementById('og-gradient-section').style.display = 'block';
        document.getElementById('og-solid-section').style.display = 'none';
        this.draw();
    }

    showIconPicker() {
        const isTr = document.documentElement.lang === 'tr';

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'og-icon-modal';
        modal.innerHTML = `
            <div class="og-icon-modal-content">
                <div class="og-icon-modal-header">
                    <div class="og-icon-modal-title">${isTr ? 'İkon Seç' : 'Choose Icon'}</div>
                    <button class="og-icon-close">✕</button>
                </div>
                
                <div class="og-icon-category">
                    <div class="og-icon-category-title">${isTr ? 'EMOJİLER' : 'EMOJIS'}</div>
                    <div class="og-icon-grid" id="emoji-grid"></div>
                </div>
                
                <div class="og-icon-category">
                    <div class="og-icon-category-title">${isTr ? 'SOSYAL MEDYA' : 'SOCIAL MEDIA'}</div>
                    <div class="og-icon-grid" id="social-grid"></div>
                </div>
                
                <div class="og-icon-category">
                    <div class="og-icon-category-title">${isTr ? 'TEKNOLOJİ' : 'TECHNOLOGY'}</div>
                    <div class="og-icon-grid" id="tech-grid"></div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Emoji icons
        const emojis = ['🚀', '⭐', '💡', '🎨', '🔥', '⚡', '💻', '🎯', '✨', '🎪', '🎭', '🎬', '🎮', '🎲', '🎳', '⚽'];
        const emojiGrid = modal.querySelector('#emoji-grid');
        emojis.forEach(icon => {
            const item = document.createElement('div');
            item.className = 'og-icon-item';
            item.textContent = icon;
            item.onclick = () => {
                this.addIconLayerWithIcon(icon);
                document.body.removeChild(modal);
            };
            emojiGrid.appendChild(item);
        });

        // Social media (using Font Awesome classes but rendered as text)
        const social = ['📱', '📧', '📷', '📸', '📹', '📺', '📻', '📡'];
        const socialGrid = modal.querySelector('#social-grid');
        social.forEach(icon => {
            const item = document.createElement('div');
            item.className = 'og-icon-item';
            item.textContent = icon;
            item.onclick = () => {
                this.addIconLayerWithIcon(icon);
                document.body.removeChild(modal);
            };
            socialGrid.appendChild(item);
        });

        // Technology
        const tech = ['💾', '💿', '📀', '🖥️', '⌨️', '🖱️', '🖨️', '📱'];
        const techGrid = modal.querySelector('#tech-grid');
        tech.forEach(icon => {
            const item = document.createElement('div');
            item.className = 'og-icon-item';
            item.textContent = icon;
            item.onclick = () => {
                this.addIconLayerWithIcon(icon);
                document.body.removeChild(modal);
            };
            techGrid.appendChild(item);
        });

        // Close button
        modal.querySelector('.og-icon-close').onclick = () => {
            document.body.removeChild(modal);
        };

        // Close on backdrop click
        modal.onclick = (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        };
    }

    addIconLayerWithIcon(icon) {
        const layer = {
            id: ++this.layerIdCounter,
            type: 'icon',
            content: icon,
            x: 600,
            y: 315,
            fontSize: 80,
            visible: true
        };
        this.state.layers.push(layer);
        this.state.selectedLayer = layer;
        this.updateLayersList();
        this.updatePropertiesPanel();
        this.draw();
    }

    addTextLayer() {
        const isTr = document.documentElement.lang === 'tr';
        const layer = {
            id: ++this.layerIdCounter,
            type: 'text',
            content: isTr ? 'Yeni Metin' : 'New Text',
            x: 600,
            y: 315,
            fontSize: 64,
            fontFamily: 'Inter',
            color: '#ffffff',
            textAlign: 'center',
            fontWeight: 'bold',
            visible: true
        };
        this.state.layers.push(layer);
        this.state.selectedLayer = layer;
        this.updateLayersList();
        this.updatePropertiesPanel();
        this.draw();
    }

    addShapeLayer() {
        const layer = {
            id: ++this.layerIdCounter,
            type: 'shape',
            shape: 'rectangle',
            x: 600,
            y: 315,
            width: 200,
            height: 100,
            color: '#667eea',
            visible: true
        };
        this.state.layers.push(layer);
        this.state.selectedLayer = layer;
        this.updateLayersList();
        this.updatePropertiesPanel();
        this.draw();
    }

    uploadImage() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const layer = {
                        id: ++this.layerIdCounter,
                        type: 'image',
                        image: img,
                        x: 600,
                        y: 315,
                        width: img.width > 400 ? 400 : img.width,
                        height: img.height > 400 ? 400 : img.height,
                        visible: true
                    };
                    this.state.layers.push(layer);
                    this.state.selectedLayer = layer;
                    this.updateLayersList();
                    this.updatePropertiesPanel();
                    this.draw();
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        };
        input.click();
    }

    updateLayersList() {
        const isTr = document.documentElement.lang === 'tr';
        const container = document.getElementById('og-layers-list');

        if (this.state.layers.length === 0) {
            container.innerHTML = `
                <div class="og-empty-state">
                    <i class="fas fa-layer-group"></i>
                    <p>${isTr ? 'Henüz katman yok' : 'No layers yet'}</p>
                </div>
            `;
            return;
        }

        container.innerHTML = '';
        [...this.state.layers].reverse().forEach(layer => {
            const item = document.createElement('div');
            item.className = 'og-layer-item' + (this.state.selectedLayer?.id === layer.id ? ' active' : '');

            const icon = layer.type === 'text' ? 'fa-font' :
                layer.type === 'image' ? 'fa-image' :
                    layer.type === 'shape' ? 'fa-square' : 'fa-icons';

            const name = layer.type === 'text' ? layer.content.substring(0, 15) :
                layer.type === 'icon' ? layer.content :
                    layer.type.charAt(0).toUpperCase() + layer.type.slice(1);

            item.innerHTML = `
                <div class="og-layer-icon"><i class="fas ${icon}"></i></div>
                <div class="og-layer-info">
                    <div class="og-layer-name">${name}</div>
                    <div class="og-layer-type">${layer.type}</div>
                </div>
                <button class="og-layer-btn">
                    <i class="fas fa-trash"></i>
                </button>
            `;

            item.onclick = (e) => {
                if (!e.target.closest('.og-layer-btn')) {
                    this.state.selectedLayer = layer;
                    this.updateLayersList();
                    this.updatePropertiesPanel();
                    this.draw();
                }
            };

            item.querySelector('.og-layer-btn').onclick = (e) => {
                e.stopPropagation();
                this.deleteLayer(layer.id);
            };

            container.appendChild(item);
        });
    }

    deleteLayer(layerId) {
        this.state.layers = this.state.layers.filter(l => l.id !== layerId);
        if (this.state.selectedLayer?.id === layerId) {
            this.state.selectedLayer = null;
        }
        this.updateLayersList();
        this.updatePropertiesPanel();
        this.draw();
    }

    updatePropertiesPanel() {
        const isTr = document.documentElement.lang === 'tr';
        const container = document.getElementById('og-props-content');

        if (!this.state.selectedLayer) {
            container.innerHTML = `
                <div class="og-empty-state">
                    <i class="fas fa-mouse-pointer"></i>
                    <p>${isTr ? 'Bir katman seçin' : 'Select a layer'}</p>
                </div>
            `;
            return;
        }

        const layer = this.state.selectedLayer;
        let html = '';

        // Common properties
        html += `
            <div class="og-prop-group">
                <div class="og-prop-label">
                    X ${isTr ? 'Pozisyonu' : 'Position'}
                    <span class="og-prop-value">${layer.x}px</span>
                </div>
                <input type="range" class="og-slider" id="prop-x" value="${layer.x}" min="0" max="1200">
            </div>
            <div class="og-prop-group">
                <div class="og-prop-label">
                    Y ${isTr ? 'Pozisyonu' : 'Position'}
                    <span class="og-prop-value">${layer.y}px</span>
                </div>
                <input type="range" class="og-slider" id="prop-y" value="${layer.y}" min="0" max="630">
            </div>
        `;

        // Type-specific properties
        if (layer.type === 'text') {
            html += `
                <div class="og-prop-group">
                    <div class="og-prop-label">${isTr ? 'Metin' : 'Text'}</div>
                    <input type="text" class="og-input" id="prop-text" value="${layer.content}">
                </div>
                <div class="og-prop-group">
                    <div class="og-prop-label">
                        ${isTr ? 'Boyut' : 'Size'}
                        <span class="og-prop-value">${layer.fontSize}px</span>
                    </div>
                    <input type="range" class="og-slider" id="prop-size" value="${layer.fontSize}" min="12" max="200">
                </div>
                <div class="og-prop-group">
                    <div class="og-prop-label">${isTr ? 'Font' : 'Font'}</div>
                    <select class="og-input" id="prop-font">
                        <option value="Inter" ${layer.fontFamily === 'Inter' ? 'selected' : ''}>Inter</option>
                        <option value="Montserrat" ${layer.fontFamily === 'Montserrat' ? 'selected' : ''}>Montserrat</option>
                        <option value="Roboto" ${layer.fontFamily === 'Roboto' ? 'selected' : ''}>Roboto</option>
                        <option value="Playfair Display" ${layer.fontFamily === 'Playfair Display' ? 'selected' : ''}>Playfair Display</option>
                        <option value="Space Mono" ${layer.fontFamily === 'Space Mono' ? 'selected' : ''}>Space Mono</option>
                    </select>
                </div>
                <div class="og-prop-group">
                    <div class="og-prop-label">${isTr ? 'Renk' : 'Color'}</div>
                    <input type="color" class="og-input" id="prop-color" value="${layer.color}">
                </div>
                <div class="og-prop-group">
                    <div class="og-prop-label">${isTr ? 'Hizalama' : 'Align'}</div>
                    <select class="og-input" id="prop-align">
                        <option value="left" ${layer.textAlign === 'left' ? 'selected' : ''}>${isTr ? 'Sol' : 'Left'}</option>
                        <option value="center" ${layer.textAlign === 'center' ? 'selected' : ''}>${isTr ? 'Orta' : 'Center'}</option>
                        <option value="right" ${layer.textAlign === 'right' ? 'selected' : ''}>${isTr ? 'Sağ' : 'Right'}</option>
                    </select>
                </div>
            `;
        } else if (layer.type === 'shape') {
            html += `
                <div class="og-prop-group">
                    <div class="og-prop-label">${isTr ? 'Şekil' : 'Shape'}</div>
                    <select class="og-input" id="prop-shape">
                        <option value="rectangle" ${layer.shape === 'rectangle' ? 'selected' : ''}>${isTr ? 'Dikdörtgen' : 'Rectangle'}</option>
                        <option value="circle" ${layer.shape === 'circle' ? 'selected' : ''}>${isTr ? 'Daire' : 'Circle'}</option>
                    </select>
                </div>
                <div class="og-prop-group">
                    <div class="og-prop-label">
                        ${isTr ? 'Genişlik' : 'Width'}
                        <span class="og-prop-value">${layer.width}px</span>
                    </div>
                    <input type="range" class="og-slider" id="prop-width" value="${layer.width}" min="10" max="1200">
                </div>
                <div class="og-prop-group">
                    <div class="og-prop-label">
                        ${isTr ? 'Yükseklik' : 'Height'}
                        <span class="og-prop-value">${layer.height}px</span>
                    </div>
                    <input type="range" class="og-slider" id="prop-height" value="${layer.height}" min="10" max="630">
                </div>
                <div class="og-prop-group">
                    <div class="og-prop-label">${isTr ? 'Renk' : 'Color'}</div>
                    <input type="color" class="og-input" id="prop-color" value="${layer.color}">
                </div>
            `;
        } else if (layer.type === 'icon') {
            html += `
                <div class="og-prop-group">
                    <div class="og-prop-label">${isTr ? 'İkon' : 'Icon'}</div>
                    <input type="text" class="og-input" id="prop-icon" value="${layer.content}" maxlength="2">
                </div>
                <div class="og-prop-group">
                    <div class="og-prop-label">
                        ${isTr ? 'Boyut' : 'Size'}
                        <span class="og-prop-value">${layer.fontSize}px</span>
                    </div>
                    <input type="range" class="og-slider" id="prop-size" value="${layer.fontSize}" min="20" max="300">
                </div>
            `;
        } else if (layer.type === 'image') {
            html += `
                <div class="og-prop-group">
                    <div class="og-prop-label">
                        ${isTr ? 'Genişlik' : 'Width'}
                        <span class="og-prop-value">${layer.width}px</span>
                    </div>
                    <input type="range" class="og-slider" id="prop-width" value="${layer.width}" min="10" max="1200">
                </div>
                <div class="og-prop-group">
                    <div class="og-prop-label">
                        ${isTr ? 'Yükseklik' : 'Height'}
                        <span class="og-prop-value">${layer.height}px</span>
                    </div>
                    <input type="range" class="og-slider" id="prop-height" value="${layer.height}" min="10" max="630">
                </div>
            `;
        }

        container.innerHTML = html;

        // Attach listeners with live value display
        const self = this; // Capture this context
        const updateProp = (prop, value, displayId) => {
            layer[prop] = value;
            if (displayId) {
                // Input and label are siblings inside .og-prop-group
                const inputElement = container.querySelector(`#${displayId}`);
                if (inputElement) {
                    const propGroup = inputElement.closest('.og-prop-group');
                    if (propGroup) {
                        const display = propGroup.querySelector('.og-prop-value');
                        if (display) {
                            const suffix = (displayId.includes('size') || displayId.includes('width') || displayId.includes('height') || displayId.includes('x') || displayId.includes('y')) ? 'px' : '';
                            display.textContent = value + suffix;
                        }
                    }
                }
            }
            // Force immediate redraw
            self.draw();
        };

        // Helper to safely attach event listeners
        const attachListener = (id, event, handler) => {
            const el = container.querySelector(`#${id}`);
            if (el) {
                el.addEventListener(event, handler);
            } else {
                console.warn(`Element #${id} not found for event attachment`);
            }
        };

        // Common properties (X, Y always present)
        attachListener('prop-x', 'input', (e) => updateProp('x', parseInt(e.target.value), 'prop-x'));
        attachListener('prop-y', 'input', (e) => updateProp('y', parseInt(e.target.value), 'prop-y'));

        // Type-specific properties
        if (layer.type === 'text') {
            attachListener('prop-text', 'input', (e) => updateProp('content', e.target.value));
            attachListener('prop-size', 'input', (e) => updateProp('fontSize', parseInt(e.target.value), 'prop-size'));
            attachListener('prop-font', 'change', (e) => updateProp('fontFamily', e.target.value));
            attachListener('prop-color', 'input', (e) => updateProp('color', e.target.value));
            attachListener('prop-align', 'change', (e) => updateProp('textAlign', e.target.value));
        } else if (layer.type === 'shape') {
            attachListener('prop-shape', 'change', (e) => updateProp('shape', e.target.value));
            attachListener('prop-width', 'input', (e) => updateProp('width', parseInt(e.target.value), 'prop-width'));
            attachListener('prop-height', 'input', (e) => updateProp('height', parseInt(e.target.value), 'prop-height'));
            attachListener('prop-color', 'input', (e) => updateProp('color', e.target.value));
        } else if (layer.type === 'icon') {
            attachListener('prop-icon', 'input', (e) => updateProp('content', e.target.value));
            attachListener('prop-size', 'input', (e) => updateProp('fontSize', parseInt(e.target.value), 'prop-size'));
        } else if (layer.type === 'image') {
            attachListener('prop-width', 'input', (e) => updateProp('width', parseInt(e.target.value), 'prop-width'));
            attachListener('prop-height', 'input', (e) => updateProp('height', parseInt(e.target.value), 'prop-height'));
        }
    }

    onCanvasMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scale = this.canvas.width / rect.width;
        const x = (e.clientX - rect.left) * scale;
        const y = (e.clientY - rect.top) * scale;

        // Check if clicking on a layer
        for (let i = this.state.layers.length - 1; i >= 0; i--) {
            const layer = this.state.layers[i];

            // Check resize handles first (for images and shapes)
            if (layer.type === 'image' || layer.type === 'shape') {
                const handle = this.getResizeHandle(layer, x, y);
                if (handle) {
                    this.isResizing = true;
                    this.resizeHandle = handle;
                    this.state.selectedLayer = layer;
                    this.initialSize = { width: layer.width, height: layer.height };
                    this.dragOffset = { x, y };
                    this.updateLayersList();
                    this.updatePropertiesPanel();
                    this.draw();
                    return;
                }
            }

            if (this.hitTest(layer, x, y)) {
                this.isDragging = true;
                this.state.selectedLayer = layer;
                this.dragOffset = { x: x - layer.x, y: y - layer.y };
                this.updateLayersList();
                this.updatePropertiesPanel();
                this.draw();
                return;
            }
        }
    }

    onCanvasMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scale = this.canvas.width / rect.width;
        const x = (e.clientX - rect.left) * scale;
        const y = (e.clientY - rect.top) * scale;

        // Handle resizing
        if (this.isResizing && this.state.selectedLayer) {
            const layer = this.state.selectedLayer;
            const dx = x - this.dragOffset.x;
            const dy = y - this.dragOffset.y;

            let newWidth = this.initialSize.width;
            let newHeight = this.initialSize.height;

            if (this.resizeHandle === 'se') {
                newWidth = this.initialSize.width + dx;
                newHeight = this.initialSize.height + dy;
            } else if (this.resizeHandle === 'sw') {
                newWidth = this.initialSize.width - dx;
                newHeight = this.initialSize.height + dy;
            } else if (this.resizeHandle === 'ne') {
                newWidth = this.initialSize.width + dx;
                newHeight = this.initialSize.height - dy;
            } else if (this.resizeHandle === 'nw') {
                newWidth = this.initialSize.width - dx;
                newHeight = this.initialSize.height - dy;
            }

            if (e.shiftKey && layer.type === 'image') {
                const aspectRatio = this.initialSize.width / this.initialSize.height;
                newHeight = newWidth / aspectRatio;
            }

            layer.width = Math.max(20, Math.min(1200, Math.round(newWidth)));
            layer.height = Math.max(20, Math.min(630, Math.round(newHeight)));

            this.updatePropertiesPanel();
            this.draw();
            return;
        }

        // Handle dragging
        if (this.isDragging && this.state.selectedLayer) {
            this.state.selectedLayer.x = Math.max(0, Math.min(1200, x - this.dragOffset.x));
            this.state.selectedLayer.y = Math.max(0, Math.min(630, y - this.dragOffset.y));

            this.updatePropertiesPanel();
            this.draw();
        }
    }

    onCanvasMouseUp() {
        this.isDragging = false;
        this.isResizing = false;
        this.resizeHandle = null;
        this.canvas.style.cursor = 'default';
    }

    getResizeHandle(layer, x, y) {
        if (layer.type !== 'image' && layer.type !== 'shape') return null;

        const handleSize = 12;
        const left = layer.x - layer.width / 2;
        const right = layer.x + layer.width / 2;
        const top = layer.y - layer.height / 2;
        const bottom = layer.y + layer.height / 2;

        if (Math.abs(x - left) < handleSize && Math.abs(y - top) < handleSize) return 'nw';
        if (Math.abs(x - right) < handleSize && Math.abs(y - top) < handleSize) return 'ne';
        if (Math.abs(x - left) < handleSize && Math.abs(y - bottom) < handleSize) return 'sw';
        if (Math.abs(x - right) < handleSize && Math.abs(y - bottom) < handleSize) return 'se';

        return null;
    }

    hitTest(layer, x, y) {
        if (layer.type === 'text' || layer.type === 'icon') {
            const size = layer.fontSize || 64;
            return Math.abs(x - layer.x) < size * 2 && Math.abs(y - layer.y) < size;
        } else if (layer.type === 'shape' || layer.type === 'image') {
            return x >= layer.x - layer.width / 2 && x <= layer.x + layer.width / 2 &&
                y >= layer.y - layer.height / 2 && y <= layer.y + layer.height / 2;
        }
        return false;
    }

    draw() {
        const { width, height, bgType, bgColor, gradient, filter } = this.state;

        // Clear canvas
        this.ctx.clearRect(0, 0, width, height);

        // Apply filters
        this.ctx.filter = `blur(${filter.blur}px) brightness(${filter.brightness}%) contrast(${filter.contrast}%)`;

        // Draw background
        if (bgType === 'gradient') {
            const angle = (gradient.angle || 135) * Math.PI / 180;
            const x1 = width / 2 - Math.cos(angle) * width / 2;
            const y1 = height / 2 - Math.sin(angle) * height / 2;
            const x2 = width / 2 + Math.cos(angle) * width / 2;
            const y2 = height / 2 + Math.sin(angle) * height / 2;

            const grad = this.ctx.createLinearGradient(x1, y1, x2, y2);
            grad.addColorStop(0, gradient.from);
            grad.addColorStop(1, gradient.to);
            this.ctx.fillStyle = grad;
        } else {
            this.ctx.fillStyle = bgColor;
        }
        this.ctx.fillRect(0, 0, width, height);

        // Reset filter for layers
        this.ctx.filter = 'none';

        // Draw layers
        this.state.layers.forEach(layer => {
            if (!layer.visible) return;

            if (layer.type === 'text') {
                this.ctx.font = `${layer.fontWeight || 'bold'} ${layer.fontSize}px ${layer.fontFamily}`;
                this.ctx.fillStyle = layer.color;
                this.ctx.textAlign = layer.textAlign || 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(layer.content, layer.x, layer.y);

                // Selection indicator
                if (this.state.selectedLayer?.id === layer.id) {
                    this.ctx.strokeStyle = '#667eea';
                    this.ctx.lineWidth = 3;
                    const metrics = this.ctx.measureText(layer.content);
                    this.ctx.strokeRect(layer.x - metrics.width / 2 - 10, layer.y - layer.fontSize / 2 - 10,
                        metrics.width + 20, layer.fontSize + 20);
                }
            } else if (layer.type === 'shape') {
                this.ctx.fillStyle = layer.color;
                if (layer.shape === 'rectangle') {
                    this.ctx.fillRect(layer.x - layer.width / 2, layer.y - layer.height / 2, layer.width, layer.height);
                } else if (layer.shape === 'circle') {
                    this.ctx.beginPath();
                    this.ctx.arc(layer.x, layer.y, layer.width / 2, 0, Math.PI * 2);
                    this.ctx.fill();
                }

                if (this.state.selectedLayer?.id === layer.id) {
                    this.ctx.strokeStyle = '#667eea';
                    this.ctx.lineWidth = 3;
                    this.ctx.strokeRect(layer.x - layer.width / 2 - 5, layer.y - layer.height / 2 - 5,
                        layer.width + 10, layer.height + 10);

                    // Draw resize handles
                    const left = layer.x - layer.width / 2;
                    const right = layer.x + layer.width / 2;
                    const top = layer.y - layer.height / 2;
                    const bottom = layer.y + layer.height / 2;
                    this.drawResizeHandle(left, top);
                    this.drawResizeHandle(right, top);
                    this.drawResizeHandle(left, bottom);
                    this.drawResizeHandle(right, bottom);
                }
            } else if (layer.type === 'icon') {
                this.ctx.font = `${layer.fontSize}px Arial`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(layer.content, layer.x, layer.y);

                if (this.state.selectedLayer?.id === layer.id) {
                    this.ctx.strokeStyle = '#667eea';
                    this.ctx.lineWidth = 3;
                    this.ctx.strokeRect(layer.x - layer.fontSize / 2 - 10, layer.y - layer.fontSize / 2 - 10,
                        layer.fontSize + 20, layer.fontSize + 20);
                }
            } else if (layer.type === 'image') {
                this.ctx.drawImage(layer.image, layer.x - layer.width / 2, layer.y - layer.height / 2,
                    layer.width, layer.height);

                if (this.state.selectedLayer?.id === layer.id) {
                    this.ctx.strokeStyle = '#667eea';
                    this.ctx.lineWidth = 3;
                    this.ctx.strokeRect(layer.x - layer.width / 2 - 5, layer.y - layer.height / 2 - 5,
                        layer.width + 10, layer.height + 10);

                    // Draw resize handles
                    const left = layer.x - layer.width / 2;
                    const right = layer.x + layer.width / 2;
                    const top = layer.y - layer.height / 2;
                    const bottom = layer.y + layer.height / 2;
                    this.drawResizeHandle(left, top);
                    this.drawResizeHandle(right, top);
                    this.drawResizeHandle(left, bottom);
                    this.drawResizeHandle(right, bottom);
                }
            }
        });
    }


    drawResizeHandle(x, y) {
        const size = 8;
        this.ctx.fillStyle = '#ffffff';
        this.ctx.strokeStyle = '#667eea';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(x, y, size, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
    }

    exportImage() {
        const format = document.getElementById('og-format').value;
        const mimeType = format === 'png' ? 'image/png' : format === 'jpg' ? 'image/jpeg' : 'image/webp';

        this.canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `og-image.${format}`;
            a.click();
            URL.revokeObjectURL(url);
        }, mimeType, 0.95);
    }

    clearAll() {
        const isTr = document.documentElement.lang === 'tr';
        if (confirm(isTr ? 'Tüm katmanları silmek istediğinizden emin misiniz?' : 'Are you sure you want to clear all layers?')) {
            this.state.layers = [];
            this.state.selectedLayer = null;
            this.updateLayersList();
            this.updatePropertiesPanel();
            this.draw();
        }
    }
}

// Register tool
window.initOgImageLogic = OGImageStudioTool;
