/* TULPAR - Markdown Editor Tool OOP Implementation */
class MarkdownEditorTool extends BaseTool {
  constructor(config) {
    super(config);
  }

  renderUI() {
    const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
    const txt = isTr ? {
      input: 'Markdown Girişi',
      preview: 'Canlı Önizleme',
      export: 'HTML Olarak İndir',
      copy: 'Markdown Kopyala',
      placeholder: '# Başlık\n\nBuraya yazmaya başlayın...',
      words: 'kelime',
      read: 'dk okuma',
      welcome: '# Markdown Editörü\n\nPremium Markdown editörüne hoş geldiniz. Solda yazmaya başlayın, sağda canlı önizlemeyi görün.\n\n### Özellikler\n- **Gerçek zamanlı** önizleme\n- HTML Dışa Aktarma\n- Temiz Arayüz'
    } : {
      input: 'Markdown Input',
      preview: 'Live Preview',
      export: 'Download HTML',
      copy: 'Copy Markdown',
      placeholder: '# Title\n\nStart typing here...',
      words: 'words',
      read: 'min read',
      welcome: '# Markdown Editor\n\nWelcome to your premium Markdown editor. Start typing on the left to see the live preview on the right.\n\n### Features\n- **Real-time** preview\n- HTML Export\n- Clean Interface'
    };

    return `
        <div class="tool-content" style="height: calc(100vh - 160px); display: flex; flex-direction: column; padding: 15px;">
            <!-- Toolbar -->
            <div class="editor-toolbar" style="display: flex; gap: 8px; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid var(--border-color); flex-wrap: wrap;">
                <button class="btn btn-sm btn-outline md-action" data-prefix="**" data-suffix="**"><strong>B</strong></button>
                <button class="btn btn-sm btn-outline md-action" data-prefix="*" data-suffix="*"><em>I</em></button>
                <button class="btn btn-sm btn-outline md-action" data-prefix="# ">H</button>
                <button class="btn btn-sm btn-outline md-action" data-prefix="[" data-suffix="](url)">🔗</button>
                <button class="btn btn-sm btn-outline md-action" data-prefix="\`" data-suffix="\`">&lt;/&gt;</button>
                <button class="btn btn-sm btn-outline md-action" data-prefix="- ">• List</button>
                
                <div style="flex: 1;"></div>
                
                <button id="md-btn-export" class="btn btn-sm btn-primary">💾 ${txt.export}</button>
                <button id="md-btn-copy" class="btn btn-sm btn-outline">📋 ${txt.copy}</button>
            </div>

            <!-- Editor & Preview -->
            <div class="grid-layout" style="flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; min-height: 0;">
                <div style="display: flex; flex-direction: column;">
                    <label class="form-label">${txt.input}</label>
                    <textarea id="md-in-area" class="form-input" style="flex: 1; font-family: var(--font-mono); font-size: 0.95rem; resize: none; background: rgba(0,0,0,0.1);" placeholder="${txt.placeholder}"></textarea>
                </div>
                <div style="display: flex; flex-direction: column;">
                    <label class="form-label">${txt.preview}</label>
                    <div id="md-out-area" class="markdown-preview" style="flex: 1; padding: 20px; overflow-y: auto; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 8px; line-height: 1.6;"></div>
                </div>
            </div>
            
            <div style="margin-top: 10px; font-size: 0.8rem; color: #888; display: flex; gap: 15px;">
                 <span id="md-stat-words">0 ${txt.words}</span>
                 <span id="md-stat-time">0 ${txt.read}</span>
            </div>
        </div>
        `;
  }

  setupListeners() {
    const input = document.getElementById('md-in-area');
    const preview = document.getElementById('md-out-area');

    const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
    const txtW = isTr ? 'kelime' : 'words';
    const txtR = isTr ? 'dk okuma' : 'min read';

    // Initial content if empty
    if (!input.value) {
      input.value = isTr ?
        '# Markdown Editörü\n\nPremium Markdown editörüne hoş geldiniz. Solda yazmaya başlayın, sağda canlı önizlemeyi görün.\n\n### Özellikler\n- **Gerçek zamanlı** önizleme\n- HTML Dışa Aktarma\n- Temiz Arayüz' :
        '# Markdown Editor\n\nWelcome to your premium Markdown editor. Start typing on the left to see the live preview on the right.\n\n### Features\n- **Real-time** preview\n- HTML Export\n- Clean Interface';
    }

    const update = () => {
      const val = input.value;
      preview.innerHTML = window.DevTools.markdownTools.parseMarkdown(val);

      const words = val.trim().split(/\s+/).filter(w => w.length > 0).length;
      const readTime = Math.ceil(words / 200);
      document.getElementById('md-stat-words').textContent = `${words} ${txtW}`;
      document.getElementById('md-stat-time').textContent = `${readTime} ${txtR}`;
    };

    input.addEventListener('input', update);
    input.addEventListener('change', update); // Backup

    // Toolbar Actions
    document.querySelectorAll('.md-action').forEach(btn => {
      btn.onclick = () => {
        const prefix = btn.dataset.prefix || '';
        const suffix = btn.dataset.suffix || '';

        const start = input.selectionStart;
        const end = input.selectionEnd;
        const text = input.value;
        const selection = text.substring(start, end);

        const newText = text.substring(0, start) + prefix + selection + suffix + text.substring(end);

        input.value = newText;
        update();
        input.focus();
        input.setSelectionRange(start + prefix.length, end + prefix.length);
      };
    });

    document.getElementById('md-btn-copy').onclick = () => {
      navigator.clipboard.writeText(input.value);
      const originalText = document.getElementById('md-btn-copy').innerHTML;
      document.getElementById('md-btn-copy').innerHTML = '✅ Copied';
      setTimeout(() => document.getElementById('md-btn-copy').innerHTML = originalText, 1500);
    };

    document.getElementById('md-btn-export').onclick = () => {
      if (window.DevTools.markdownTools && window.DevTools.markdownTools.exportHTML) {
        const html = window.DevTools.markdownTools.exportHTML(input.value);
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'markdown-export.html';
        a.click();
      }
    };

    update(); // Run initially

  }
}

// Register tool
window.initMarkdownEditorLogic = MarkdownEditorTool;
