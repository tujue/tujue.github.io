/* TULPAR - Professional CSS Minifier & Optimizer v2.0 */
class CssMinifierTool extends BaseTool {
    constructor(config) {
        super(config);
        this.mode = 'minify';
    }

    renderUI() {
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const txt = isTr ? {
            title: 'Profesyonel CSS Optimizasyon Stüdyosu',
            input: 'CSS Kodu Girin',
            output: 'İşlenmiş CSS',
            minify: 'Küçült',
            beautify: 'Güzelleştir',
            analyze: 'Analiz Et',
            copy: 'Kopyala',
            download: 'İndir',
            clear: 'Temizle',
            loadExample: 'Örnek Yükle',
            stats: 'İstatistikler',
            originalSize: 'Orijinal Boyut',
            processedSize: 'İşlenmiş Boyut',
            saved: 'Kazanılan',
            selectors: 'Seçiciler',
            properties: 'Özellikler',
            mediaQueries: 'Media Query',
            comments: 'Yorumlar',
            options: 'Seçenekler',
            removeComments: 'Yorumları Kaldır',
            removeWhitespace: 'Boşlukları Kaldır',
            optimizeColors: 'Renkleri Optimize Et',
            shortenHex: 'Hex\'leri Kısalt'
        } : {
            title: 'Professional CSS Optimization Studio',
            input: 'Input CSS',
            output: 'Processed CSS',
            minify: 'Minify',
            beautify: 'Beautify',
            analyze: 'Analyze',
            copy: 'Copy',
            download: 'Download',
            clear: 'Clear',
            loadExample: 'Load Example',
            stats: 'Statistics',
            originalSize: 'Original Size',
            processedSize: 'Processed Size',
            saved: 'Saved',
            selectors: 'Selectors',
            properties: 'Properties',
            mediaQueries: 'Media Queries',
            comments: 'Comments',
            options: 'Options',
            removeComments: 'Remove Comments',
            removeWhitespace: 'Remove Whitespace',
            optimizeColors: 'Optimize Colors',
            shortenHex: 'Shorten Hex'
        };

        return `
            <style>
                .css-minifier-studio {
                    padding: 30px;
                    background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%);
                    border-radius: 24px;
                    max-width: 1600px;
                    margin: 0 auto;
                }

                .css-studio-header {
                    text-align: center;
                    margin-bottom: 40px;
                    padding-bottom: 20px;
                    border-bottom: 2px solid rgba(99, 102, 241, 0.3);
                }

                .css-studio-title {
                    font-size: 2.5rem;
                    font-weight: 800;
                    background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin-bottom: 10px;
                }

                .css-studio-subtitle {
                    color: #94a3b8;
                    font-size: 1rem;
                }

                .css-main-grid {
                    display: grid;
                    grid-template-columns: 1fr 300px;
                    gap: 30px;
                    margin-bottom: 30px;
                }

                .css-editors-section {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }

                .css-editor-panel {
                    background: rgba(15, 23, 42, 0.6);
                    border: 2px solid rgba(99, 102, 241, 0.2);
                    border-radius: 16px;
                    padding: 20px;
                    transition: all 0.3s ease;
                }

                .css-editor-panel:hover {
                    border-color: rgba(99, 102, 241, 0.5);
                    box-shadow: 0 8px 32px rgba(99, 102, 241, 0.2);
                }

                .css-editor-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                }

                .css-editor-label {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: #e2e8f0;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .css-editor-badge {
                    padding: 4px 12px;
                    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                    border-radius: 12px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: white;
                }

                .css-textarea {
                    width: 100%;
                    height: 500px;
                    background: rgba(0, 0, 0, 0.4);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    padding: 16px;
                    font-family: 'Fira Code', 'Courier New', monospace;
                    font-size: 13px;
                    color: #e2e8f0;
                    resize: vertical;
                    line-height: 1.6;
                    transition: all 0.3s ease;
                }

                .css-textarea:focus {
                    outline: none;
                    border-color: #6366f1;
                    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
                }

                .css-textarea::placeholder {
                    color: #475569;
                }

                .css-sidebar {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .css-stats-panel {
                    background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
                    border: 2px solid rgba(99, 102, 241, 0.3);
                    border-radius: 16px;
                    padding: 24px;
                }

                .css-stats-title {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #e2e8f0;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .css-stat-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 0;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }

                .css-stat-item:last-child {
                    border-bottom: none;
                }

                .css-stat-label {
                    font-size: 0.85rem;
                    color: #94a3b8;
                }

                .css-stat-value {
                    font-size: 0.95rem;
                    font-weight: 700;
                    color: #6366f1;
                }

                .css-stat-value.savings {
                    color: #10b981;
                    font-size: 1.2rem;
                }

                .css-options-panel {
                    background: rgba(15, 23, 42, 0.6);
                    border: 2px solid rgba(99, 102, 241, 0.2);
                    border-radius: 16px;
                    padding: 20px;
                }

                .css-option-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 0;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }

                .css-option-item:last-child {
                    border-bottom: none;
                }

                .css-toggle {
                    position: relative;
                    width: 48px;
                    height: 24px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .css-toggle.active {
                    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                }

                .css-toggle::after {
                    content: '';
                    position: absolute;
                    top: 2px;
                    left: 2px;
                    width: 20px;
                    height: 20px;
                    background: white;
                    border-radius: 50%;
                    transition: all 0.3s ease;
                }

                .css-toggle.active::after {
                    left: 26px;
                }

                .css-option-label {
                    font-size: 0.85rem;
                    color: #e2e8f0;
                    flex: 1;
                }

                .css-actions {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 12px;
                }

                .css-btn {
                    padding: 14px 20px;
                    border: none;
                    border-radius: 12px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }

                .css-btn-primary {
                    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                    color: white;
                }

                .css-btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
                }

                .css-btn-secondary {
                    background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);
                    color: white;
                }

                .css-btn-secondary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(236, 72, 153, 0.4);
                }

                .css-btn-outline {
                    background: rgba(255, 255, 255, 0.05);
                    border: 2px solid rgba(255, 255, 255, 0.2);
                    color: #e2e8f0;
                }

                .css-btn-outline:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: #6366f1;
                }

                .css-btn-success {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white;
                }

                .css-btn-success:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
                }

                @media (max-width: 1400px) {
                    .css-main-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .css-editors-section {
                        grid-template-columns: 1fr;
                    }
                }
            </style>

            <div class="css-minifier-studio">
                <div class="css-studio-header">
                    <div class="css-studio-title">🎨 ${txt.title}</div>
                    <div class="css-studio-subtitle">Advanced CSS Processing & Optimization</div>
                </div>

                <div class="css-main-grid">
                    <!-- Editors Section -->
                    <div class="css-editors-section">
                        <!-- Input Panel -->
                        <div class="css-editor-panel">
                            <div class="css-editor-header">
                                <div class="css-editor-label">📝 ${txt.input}</div>
                                <div class="css-editor-badge" id="css-in-size">0 B</div>
                            </div>
                            <textarea id="css-input" class="css-textarea" placeholder="/* Paste your CSS code here */\nbody {\n  background-color: #ffffff;\n  color: #000000;\n}"></textarea>
                        </div>

                        <!-- Output Panel -->
                        <div class="css-editor-panel">
                            <div class="css-editor-header">
                                <div class="css-editor-label">✨ ${txt.output}</div>
                                <div class="css-editor-badge" id="css-out-size">0 B</div>
                            </div>
                            <textarea id="css-output" class="css-textarea" readonly placeholder="Processed CSS will appear here..."></textarea>
                        </div>
                    </div>

                    <!-- Sidebar -->
                    <div class="css-sidebar">
                        <!-- Stats Panel -->
                        <div class="css-stats-panel">
                            <div class="css-stats-title">
                                <span>📊</span>
                                <span>${txt.stats}</span>
                            </div>
                            <div class="css-stat-item">
                                <span class="css-stat-label">${txt.originalSize}</span>
                                <span class="css-stat-value" id="stat-original">0 B</span>
                            </div>
                            <div class="css-stat-item">
                                <span class="css-stat-label">${txt.processedSize}</span>
                                <span class="css-stat-value" id="stat-processed">0 B</span>
                            </div>
                            <div class="css-stat-item">
                                <span class="css-stat-label">${txt.saved}</span>
                                <span class="css-stat-value savings" id="stat-savings">0%</span>
                            </div>
                            <div class="css-stat-item">
                                <span class="css-stat-label">${txt.selectors}</span>
                                <span class="css-stat-value" id="stat-selectors">0</span>
                            </div>
                            <div class="css-stat-item">
                                <span class="css-stat-label">${txt.properties}</span>
                                <span class="css-stat-value" id="stat-properties">0</span>
                            </div>
                            <div class="css-stat-item">
                                <span class="css-stat-label">${txt.mediaQueries}</span>
                                <span class="css-stat-value" id="stat-media">0</span>
                            </div>
                        </div>

                        <!-- Options Panel -->
                        <div class="css-options-panel">
                            <div class="css-stats-title" style="margin-bottom: 16px;">
                                <span>⚙️</span>
                                <span>${txt.options}</span>
                            </div>
                            <div class="css-option-item">
                                <div class="css-toggle active" data-option="removeComments"></div>
                                <div class="css-option-label">${txt.removeComments}</div>
                            </div>
                            <div class="css-option-item">
                                <div class="css-toggle active" data-option="removeWhitespace"></div>
                                <div class="css-option-label">${txt.removeWhitespace}</div>
                            </div>
                            <div class="css-option-item">
                                <div class="css-toggle active" data-option="optimizeColors"></div>
                                <div class="css-option-label">${txt.optimizeColors}</div>
                            </div>
                            <div class="css-option-item">
                                <div class="css-toggle active" data-option="shortenHex"></div>
                                <div class="css-option-label">${txt.shortenHex}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="css-actions">
                    <button id="css-btn-minify" class="css-btn css-btn-primary">
                        <span>📉</span>
                        <span>${txt.minify}</span>
                    </button>
                    <button id="css-btn-beautify" class="css-btn css-btn-secondary">
                        <span>✨</span>
                        <span>${txt.beautify}</span>
                    </button>
                    <button id="css-btn-analyze" class="css-btn css-btn-outline">
                        <span>🔍</span>
                        <span>${txt.analyze}</span>
                    </button>
                    <button id="css-btn-copy" class="css-btn css-btn-success">
                        <span>📋</span>
                        <span>${txt.copy}</span>
                    </button>
                    <button id="css-btn-download" class="css-btn css-btn-outline">
                        <span>💾</span>
                        <span>${txt.download}</span>
                    </button>
                    <button id="css-btn-clear" class="css-btn css-btn-outline">
                        <span>🗑️</span>
                        <span>${txt.clear}</span>
                    </button>
                    <button id="css-btn-example" class="css-btn css-btn-outline" style="grid-column: span 3;">
                        <span>📄</span>
                        <span>${txt.loadExample}</span>
                    </button>
                </div>
            </div>
        `;
    }

    setupListeners() {
        const input = document.getElementById('css-input');
        const output = document.getElementById('css-output');

        this.options = {
            removeComments: true,
            removeWhitespace: true,
            optimizeColors: true,
            shortenHex: true
        };

        // Toggle listeners
        document.querySelectorAll('.css-toggle').forEach(toggle => {
            toggle.onclick = () => {
                toggle.classList.toggle('active');
                const option = toggle.dataset.option;
                this.options[option] = toggle.classList.contains('active');
            };
        });

        // Button listeners
        document.getElementById('css-btn-minify').onclick = () => this.minify();
        document.getElementById('css-btn-beautify').onclick = () => this.beautify();
        document.getElementById('css-btn-analyze').onclick = () => this.analyze();
        document.getElementById('css-btn-copy').onclick = () => this.copyToClipboard();
        document.getElementById('css-btn-download').onclick = () => this.downloadCSS();
        document.getElementById('css-btn-clear').onclick = () => this.clear();
        document.getElementById('css-btn-example').onclick = () => this.loadExample();

        // Input size tracking
        input.oninput = () => {
            this.updateInputSize();
        };
    }

    minify() {
        const input = document.getElementById('css-input').value;
        if (!input.trim()) return;

        let css = input;

        // Remove comments
        if (this.options.removeComments) {
            css = css.replace(/\/\*[\s\S]*?\*\//g, '');
        }

        // Remove whitespace
        if (this.options.removeWhitespace) {
            css = css.replace(/\s+/g, ' ');
            css = css.replace(/\s?([:;{},])\s?/g, '$1');
            css = css.replace(/;}/g, '}');
        }

        // Optimize colors
        if (this.options.optimizeColors) {
            css = css.replace(/#([0-9a-fA-F])\1([0-9a-fA-F])\2([0-9a-fA-F])\3/g, '#$1$2$3');
            css = css.replace(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/g, (_, r, g, b) => {
                return '#' + [r, g, b].map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
            });
        }

        css = css.trim();

        document.getElementById('css-output').value = css;
        this.updateStats(input, css);
        this.mode = 'minify';
    }

    beautify() {
        const input = document.getElementById('css-input').value || document.getElementById('css-output').value;
        if (!input.trim()) return;

        // First minify to normalize
        let css = input.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').trim();

        // Add formatting
        css = css.replace(/{/g, ' {\n  ');
        css = css.replace(/}/g, '\n}\n\n');
        css = css.replace(/;/g, ';\n  ');
        css = css.replace(/,/g, ',\n');
        css = css.replace(/\n{3,}/g, '\n\n');
        css = css.replace(/\n\s*}/g, '\n}');

        document.getElementById('css-output').value = css.trim();
        this.updateStats(input, css);
        this.mode = 'beautify';
    }

    analyze() {
        const input = document.getElementById('css-input').value;
        if (!input.trim()) return;

        const selectors = input.match(/[^{}]+(?=\{)/g) || [];
        const properties = input.match(/[^:]+:[^;]+/g) || [];
        const mediaQueries = input.match(/@media[^{]+/g) || [];

        document.getElementById('stat-selectors').textContent = selectors.length;
        document.getElementById('stat-properties').textContent = properties.length;
        document.getElementById('stat-media').textContent = mediaQueries.length;
    }

    updateStats(original, processed) {
        const originalBytes = new Blob([original]).size;
        const processedBytes = new Blob([processed]).size;
        const savings = original.length > 0 ? ((originalBytes - processedBytes) / originalBytes * 100).toFixed(1) : 0;

        document.getElementById('stat-original').textContent = this.formatBytes(originalBytes);
        document.getElementById('stat-processed').textContent = this.formatBytes(processedBytes);
        document.getElementById('stat-savings').textContent = savings > 0 ? `-${savings}%` : '0%';
        document.getElementById('css-out-size').textContent = this.formatBytes(processedBytes);

        this.analyze();
    }

    updateInputSize() {
        const input = document.getElementById('css-input').value;
        const bytes = new Blob([input]).size;
        document.getElementById('css-in-size').textContent = this.formatBytes(bytes);
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / 1048576).toFixed(2) + ' MB';
    }

    copyToClipboard() {
        const output = document.getElementById('css-output').value;
        if (!output) return;

        navigator.clipboard.writeText(output);
        const btn = document.getElementById('css-btn-copy');
        const original = btn.innerHTML;
        btn.innerHTML = '<span>✅</span><span>Copied!</span>';
        setTimeout(() => btn.innerHTML = original, 1500);
    }

    downloadCSS() {
        const output = document.getElementById('css-output').value;
        if (!output) return;

        const blob = new Blob([output], { type: 'text/css' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.mode === 'minify' ? 'minified.css' : 'beautified.css';
        a.click();
        URL.revokeObjectURL(url);
    }

    clear() {
        document.getElementById('css-input').value = '';
        document.getElementById('css-output').value = '';
        this.updateInputSize();
        this.updateStats('', '');
    }

    loadExample() {
        const example = `/* Modern Button Styles */
.btn {
  display: inline-block;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

@media (max-width: 768px) {
  .btn {
    padding: 10px 20px;
    font-size: 14px;
  }
}`;

        document.getElementById('css-input').value = example;
        this.updateInputSize();
    }
}

// Register tool
window.initCssMinifierLogic = CssMinifierTool;
