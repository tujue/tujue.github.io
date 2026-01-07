/* TULPAR - Text Analyzer Tool OOP Implementation */
class TextAnalyzerTool extends BaseTool {
    constructor(config) {
        super(config);
        this.timeout = null;
    }

    renderUI() {
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const txt = isTr ? {
            placeholder: 'Analiz etmek istediğiniz metni buraya yapıştırın...',
            analyze: 'Analiz Et',
            basic: 'Temel İstatistikler',
            advanced: 'Gelişmiş Analiz',
            keywords: 'En Çok Kullanılan Kelimeler',
            labels: {
                chars: 'Karakter',
                words: 'Kelime',
                sentences: 'Cümle',
                paragraphs: 'Paragraf',
                reading: 'Okuma Süresi',
                readability: 'Okunabilirlik',
                longest: 'En Uzun Kelime'
            }
        } : {
            placeholder: 'Paste your text here for analysis...',
            analyze: 'Analyze Text',
            basic: 'Basic Statistics',
            advanced: 'Advanced Analysis',
            keywords: 'Top Keywords',
            labels: {
                chars: 'Characters',
                words: 'Words',
                sentences: 'Sentences',
                paragraphs: 'Paragraphs',
                reading: 'Reading Time',
                readability: 'Readability',
                longest: 'Longest Word'
            }
        };

        const categories = [
            { id: 'words', label: txt.labels.words, icon: '📝' },
            { id: 'chars', label: txt.labels.chars, icon: '🔡' },
            { id: 'sentences', label: txt.labels.sentences, icon: '📏' },
            { id: 'paragraphs', label: txt.labels.paragraphs, icon: '📑' }
        ];

        return `
        <div class="tool-content" style="max-width: 1000px; margin: 0 auto; padding: 20px;">
            <div class="card" style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 12px; margin-bottom: 2rem;">
                <textarea id="text-analyze-input" class="form-input" style="width: 100%; height: 250px; font-family: var(--font-mono); font-size: 1rem; border: none; background: transparent; outline: none;" placeholder="${txt.placeholder}"></textarea>
                <div style="display: flex; justify-content: flex-end; margin-top: 1rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
                    <button id="text-analyze-btn" class="btn btn-primary">✨ ${txt.analyze}</button>
                </div>
            </div>

            <div id="text-stats" style="display: none; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem;">
                ${categories.map(c => `
                    <div class="card" style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); text-align: center; border-radius: 16px;">
                        <div style="font-size: 1.5rem; margin-bottom: 5px;">${c.icon}</div>
                        <div id="stat-${c.id}" style="font-size: 2rem; font-weight: 800; color: var(--primary);">0</div>
                        <div style="font-size: 0.8rem; color: var(--text-secondary); text-transform: uppercase;">${c.label}</div>
                    </div>
                `).join('')}
            </div>

            <div id="text-advanced-stats" style="display: none; display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 2rem;">
                <div class="card" style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 12px;">
                    <h4 style="margin-bottom: 1.2rem; color: var(--primary);">${txt.advanced}</h4>
                    <div style="display: grid; gap: 15px;">
                        <div style="display: flex; justify-content: space-between;"><span style="color: var(--text-secondary);">${txt.labels.reading}:</span><strong id="stat-reading">-</strong></div>
                        <div style="display: flex; justify-content: space-between;"><span style="color: var(--text-secondary);">${txt.labels.readability}:</span><strong id="stat-readability">-</strong></div>
                        <div style="display: flex; flex-direction: column; gap: 5px; margin-top: 10px;">
                            <span style="color: var(--text-secondary); font-size: 0.85rem;">${txt.labels.longest}:</span>
                            <div id="stat-longest-word" style="font-family: var(--font-mono); color: var(--secondary); font-size: 0.9rem; word-break: break-all; background: rgba(0,0,0,0.1); padding: 8px; border-radius: 6px;"></div>
                        </div>
                    </div>
                </div>

                <div class="card" style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 12px;">
                    <h4 style="margin-bottom: 1.2rem; color: var(--secondary);">${txt.keywords}</h4>
                    <div id="stat-keywords" style="display: flex; flex-wrap: wrap; gap: 8px;"></div>
                </div>
            </div>
        </div>
        `;
    }

    setupListeners() {
        const input = document.getElementById('text-analyze-input');
        const analyzeBtn = document.getElementById('text-analyze-btn');

        const analyze = () => {
            const val = input.value.trim();
            if (!val) return;
            const res = window.DevTools.textAnalyzer.analyze(val);
            if (res.success) {
                document.getElementById('text-stats').style.display = 'grid';
                document.getElementById('text-advanced-stats').style.display = 'grid';

                ['chars', 'words', 'sentences', 'paragraphs'].forEach(key => {
                    document.getElementById(`stat-${key}`).textContent = res.stats[key];
                });

                document.getElementById('stat-reading').textContent = res.stats.readingTime;
                document.getElementById('stat-readability').textContent = res.stats.readability;
                document.getElementById('stat-longest-word').textContent = res.stats.longestWord;

                const kwContainer = document.getElementById('stat-keywords');
                kwContainer.innerHTML = (res.stats.topWords || []).map(tw =>
                    `<span style="background: var(--bg-primary); border: 1px solid var(--border-color); padding: 4px 10px; border-radius: 20px; font-size: 0.85rem;">
                        <strong>${tw.word}</strong> <small style="opacity: 0.5;">${tw.count}</small>
                    </span>`
                ).join('');
            }
        };

        analyzeBtn.onclick = analyze;
        input.oninput = () => {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(analyze, 500);
        };
    }
}

// Register tool
window.initTextAnalyzerLogic = TextAnalyzerTool;
