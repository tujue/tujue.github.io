/* TULPAR - Diff Checker Tool OOP Implementation */
class DiffCheckerTool extends BaseTool {
    constructor(config) {
        super(config);
    }

    renderUI() {
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const txt = isTr ? {
            original: 'Eski Versiyon',
            modified: 'Yeni Versiyon',
            compare: 'Karşılaştır ✨',
            clear: 'Temizle',
            result: 'Karşılaştırma Sonucu',
            identical: 'İçerikler tamamen aynı ✨',
            placeholder1: 'Eski metni buraya yapıştırın...',
            placeholder2: 'Yeni metni buraya yapıştırın...',
            waiting: 'Sonuçlar burada görünecek...'
        } : {
            original: 'Original Text',
            modified: 'Modified Text',
            compare: 'Compare Now ✨',
            clear: 'Clear',
            result: 'Comparison Result',
            identical: 'Contents are identical ✨',
            placeholder1: 'Paste original text here...',
            placeholder2: 'Paste new text here...',
            waiting: 'Results will appear here...'
        };

        return `
        <div class="tool-content" style="max-width: 1200px; margin: 0 auto; padding: 20px;">
            <div class="grid-layout" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
                <div class="card" style="padding: 1.2rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 12px;">
                    <label class="form-label" style="color: var(--text-secondary); font-size: 0.75rem; text-transform: uppercase;">${txt.original}</label>
                    <textarea id="diff-in-1" class="form-input" style="height: 300px; font-family: var(--font-mono); font-size: 0.9rem;" placeholder="${txt.placeholder1}"></textarea>
                </div>
                <div class="card" style="padding: 1.2rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 12px;">
                    <label class="form-label" style="color: var(--primary); font-size: 0.75rem; text-transform: uppercase;">${txt.modified}</label>
                    <textarea id="diff-in-2" class="form-input" style="height: 300px; font-family: var(--font-mono); font-size: 0.9rem;" placeholder="${txt.placeholder2}"></textarea>
                </div>
            </div>

            <div style="display: flex; gap: 10px; margin-bottom: 2rem;">
                <button id="diff-btn-run" class="btn btn-primary" style="flex: 2; height: 3.5rem; font-weight: 700;">${txt.compare}</button>
                <button id="diff-btn-clear" class="btn btn-outline" style="flex: 1;">${txt.clear}</button>
            </div>

            <div class="card" style="padding: 1.5rem; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 12px;">
                <h4 style="margin-bottom: 1rem; color: var(--text-secondary); font-size: 0.85rem; text-transform: uppercase;">${txt.result}</h4>
                <div id="diff-res-area" style="min-height: 200px; background: rgba(0,0,0,0.2); border-radius: 8px; border: 1px solid var(--border-color); font-family: var(--font-mono); font-size: 0.9rem; overflow-x: auto;">
                    <div style="padding: 2rem; text-align: center; opacity: 0.3;">${txt.waiting}</div>
                </div>
            </div>
        </div>
        `;
    }

    setupListeners() {
        const in1 = document.getElementById('diff-in-1');
        const in2 = document.getElementById('diff-in-2');
        const out = document.getElementById('diff-res-area');

        // Re-construct txt object inside localized scope or access it somehow?
        // Actually, easiest is to check isTr again inside here or just use static check.
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const txtWaiting = isTr ? 'Sonuçlar burada görünecek...' : 'Results will appear here...';
        const txtIdentical = isTr ? 'İçerikler tamamen aynı ✨' : 'Contents are identical ✨';


        document.getElementById('diff-btn-run').onclick = () => {
            try {
                const diffs = window.DevTools.diffTools.compare(in1.value, in2.value);
                let identical = true;
                let html = '<div style="padding: 1rem;">';

                let lineNum1 = 1;
                let lineNum2 = 1;

                diffs.forEach(part => {
                    const color = part.added ? 'rgba(34, 197, 94, 0.15)' : part.removed ? 'rgba(239, 68, 68, 0.15)' : 'transparent';
                    const border = part.added ? '#22c55e' : part.removed ? '#ef4444' : 'transparent';
                    const prefix = part.added ? '+' : part.removed ? '-' : ' ';
                    if (part.added || part.removed) identical = false;

                    const lines = part.value.split('\n');
                    lines.forEach((line, idx) => {
                        if (idx === lines.length - 1 && line === '') return;

                        let l1 = '', l2 = '';
                        if (part.removed) { l1 = lineNum1++; }
                        else if (part.added) { l2 = lineNum2++; }
                        else { l1 = lineNum1++; l2 = lineNum2++; }

                        html += `
                            <div style="background: ${color}; border-left: 4px solid ${border}; padding: 2px 10px; display: grid; grid-template-columns: 30px 30px 20px 1fr; align-items: center; gap: 10px; font-family: 'Fira Code', monospace; font-size: 0.85rem;">
                                <span style="text-align: right; opacity: 0.3; user-select: none;">${l1}</span>
                                <span style="text-align: right; opacity: 0.3; user-select: none;">${l2}</span>
                                <span style="text-align: center; opacity: 0.5; user-select: none; color: ${border !== 'transparent' ? border : 'inherit'}; font-weight: 700;">${prefix}</span>
                                <span style="white-space: pre-wrap;">${line || ' '}</span>
                            </div>`;
                    });
                });

                html += '</div>';
                if (identical && in1.value) {
                    html = `<div style="padding: 3rem; text-align: center; color: var(--success);">${txtIdentical}</div>`;
                }
                out.innerHTML = html;
            } catch (e) {
                this.showNotification(e.message, 'error');
            }
        };

        document.getElementById('diff-btn-clear').onclick = () => {
            in1.value = ''; in2.value = '';
            out.innerHTML = `<div style="padding: 2rem; text-align: center; opacity: 0.3;">${txtWaiting}</div>`;
        };
    }
}

// Register tool
window.initDiffCheckerLogic = DiffCheckerTool;
