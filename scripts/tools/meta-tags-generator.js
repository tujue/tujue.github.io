/* TULPAR - Advanced SEO Meta Manager */
class MetaTagsSEOTool extends BaseTool {
  constructor(config) {
    super(config);
    this.currentTab = 'basic';
    this.data = {
      title: '', desc: '', keywords: '', url: '', image: '', site: '', author: '',
      robots: 'index,follow', canonical: '', lang: 'en', themeColor: '#6366f1',
      schemaType: 'WebSite', orgName: '', orgLogo: ''
    };
  }

  renderUI() {
    const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
    const txt = isTr ? {
      title: 'Gelişmiş SEO Meta Yöneticisi',
      tabs: { basic: 'Temel', advanced: 'Gelişmiş', schema: 'Schema.org', analytics: 'Analytics' },
      generate: 'Kod Üret',
      copy: 'Kopyala',
      download: 'HTML İndir'
    } : {
      title: 'Advanced SEO Meta Manager',
      tabs: { basic: 'Basic SEO', advanced: 'Advanced', schema: 'Schema.org', analytics: 'Analytics' },
      generate: 'Generate Code',
      copy: 'Copy',
      download: 'Download HTML'
    };

    return `
    <div class="tool-content seo-meta-mgr" style="max-width: 1400px; margin: 0 auto; padding: 20px;">
      <div style="display: grid; grid-template-columns: 400px 1fr; gap: 2rem; align-items: start;">
        
        <!-- Left: Config Panel (Dev-style) -->
        <div style="position: sticky; top: 20px;">
          <div class="card" style="padding: 0; background: #1e1e1e; border: 1px solid #333; border-radius: 12px; overflow: hidden; font-family: 'Consolas', 'Monaco', monospace;">
            <!-- Header -->
            <div style="background: #252526; padding: 1rem; border-bottom: 1px solid #333; display: flex; align-items: center; gap: 8px;">
              <div style="width: 12px; height: 12px; border-radius: 50%; background: #ff5f56;"></div>
              <div style="width: 12px; height: 12px; border-radius: 50%; background: #ffbd2e;"></div>
              <div style="width: 12px; height: 12px; border-radius: 50%; background: #27c93f;"></div>
              <span style="margin-left: auto; color: #858585; font-size: 0.75rem;">${txt.title}</span>
            </div>

            <!-- Tabs -->
            <div style="display: flex; background: #2d2d30; border-bottom: 1px solid #333;">
              ${Object.entries(txt.tabs).map(([k, v]) => `
                <button id="seo-tab-${k}" class="seo-tab" data-tab="${k}" style="flex: 1; padding: 10px 8px; background: ${k === 'basic' ? '#1e1e1e' : 'transparent'}; border: none; color: ${k === 'basic' ? '#fff' : '#858585'}; font-size: 0.7rem; cursor: pointer; border-bottom: 2px solid ${k === 'basic' ? '#007acc' : 'transparent'}; transition: all 0.2s;">${v}</button>
              `).join('')}
            </div>

            <!-- Content -->
            <div style="padding: 1.5rem; max-height: 70vh; overflow-y: auto;">
              ${this._renderTabs()}
            </div>

            <!-- Footer Actions -->
            <div style="padding: 1rem; background: #252526; border-top: 1px solid #333; display: flex; gap: 8px;">
              <button id="seo-btn-gen" class="btn btn-primary" style="flex: 1; height: 2.5rem; font-size: 0.8rem;">⚡ ${txt.generate}</button>
              <button id="seo-btn-copy" class="btn btn-outline" style="height: 2.5rem; font-size: 0.8rem; border-color: #555; color: #ddd;">📋</button>
            </div>
          </div>
        </div>

        <!-- Right: Code Output (Terminal-like) -->
        <div>
          <div class="card" style="background: #0d1117; border: 1px solid #30363d; border-radius: 12px; padding: 0; overflow: hidden;">
            <div style="background: #161b22; padding: 0.75rem 1rem; border-bottom: 1px solid #30363d; display: flex; justify-content: space-between; align-items: center;">
              <span style="color: #c9d1d9; font-family: monospace; font-size: 0.8rem; display: flex; align-items: center; gap: 8px;">
                <span style="color: #58a6ff;">➜</span> ~/${this.currentTab}.html
              </span>
              <div style="display: flex; gap: 8px;">
                <button id="seo-copy-quick" class="btn btn-sm" style="background: #21262d; border: 1px solid #30363d; color: #c9d1d9; font-size: 0.7rem; padding: 4px 10px;">Copy</button>
                <button id="seo-dl-html" class="btn btn-sm" style="background: #238636; border: none; color: white; font-size: 0.7rem; padding: 4px 10px;">Download</button>
              </div>
            </div>
            <pre id="seo-output" style="margin: 0; padding: 1.5rem; background: #0d1117; color: #c9d1d9; font-family: 'Consolas', 'Monaco', monospace; font-size: 0.75rem; line-height: 1.6; overflow-x: auto; min-height: 500px; max-height: 75vh; overflow-y: auto;"><!-- Generated meta tags will appear here --></pre>
          </div>

          <!-- Quick Templates -->
          <div style="margin-top: 1.5rem; display: flex; gap: 10px; flex-wrap: wrap;">
            <button class="seo-template btn btn-sm btn-outline" data-tpl="blog" style="font-size: 0.75rem;">📝 Blog Post</button>
            <button class="seo-template btn btn-sm btn-outline" data-tpl="ecom" style="font-size: 0.75rem;">🛒 E-commerce</button>
            <button class="seo-template btn btn-sm btn-outline" data-tpl="local" style="font-size: 0.75rem;">📍 Local Business</button>
            <button class="seo-template btn btn-sm btn-outline" data-tpl="article" style="font-size: 0.75rem;">📰 Article</button>
          </div>
        </div>
      </div>
    </div>
    `;
  }

  _renderTabs() {
    return `
      <!-- Basic SEO -->
      <div id="seo-cont-basic" class="seo-cont">
        <div class="form-group" style="margin-bottom: 1rem;"><label style="color: #58a6ff; font-size: 0.7rem; margin-bottom: 4px; display: block;">TITLE:</label><input type="text" id="seo-title" class="form-input" placeholder="Your Page Title" style="background: #1e1e1e; border: 1px solid #333; color: #ddd; font-size: 0.8rem; font-family: monospace;"></div>
        <div class="form-group" style="margin-bottom: 1rem;"><label style="color: #58a6ff; font-size: 0.7rem; margin-bottom: 4px; display: block;">DESCRIPTION:</label><textarea id="seo-desc" class="form-input" rows="3" placeholder="Page description..." style="background: #1e1e1e; border: 1px solid #333; color: #ddd; font-size: 0.8rem; font-family: monospace; resize: none;"></textarea></div>
        <div class="form-group" style="margin-bottom: 1rem;"><label style="color: #58a6ff; font-size: 0.7rem; margin-bottom: 4px; display: block;">KEYWORDS:</label><input type="text" id="seo-keywords" class="form-input" placeholder="keyword1, keyword2" style="background: #1e1e1e; border: 1px solid #333; color: #ddd; font-size: 0.8rem; font-family: monospace;"></div>
        <div class="form-group" style="margin-bottom: 1rem;"><label style="color: #58a6ff; font-size: 0.7rem; margin-bottom: 4px; display: block;">URL:</label><input type="text" id="seo-url" class="form-input" placeholder="https://example.com/page" style="background: #1e1e1e; border: 1px solid #333; color: #ddd; font-size: 0.8rem; font-family: monospace;"></div>
        <div class="form-group" style="margin-bottom: 1rem;"><label style="color: #58a6ff; font-size: 0.7rem; margin-bottom: 4px; display: block;">IMAGE_URL:</label><input type="text" id="seo-image" class="form-input" placeholder="https://example.com/image.jpg" style="background: #1e1e1e; border: 1px solid #333; color: #ddd; font-size: 0.8rem; font-family: monospace;"></div>
      </div>

      <!-- Advanced -->
      <div id="seo-cont-advanced" class="seo-cont" style="display: none;">
        <div class="form-group" style="margin-bottom: 1rem;"><label style="color: #f97583; font-size: 0.7rem; margin-bottom: 4px; display: block;">ROBOTS:</label><select id="seo-robots" class="form-select" style="background: #1e1e1e; border: 1px solid #333; color: #ddd; font-size: 0.8rem;"><option value="index,follow">index, follow</option><option value="noindex,nofollow">noindex, nofollow</option><option value="index,nofollow">index, nofollow</option><option value="noindex,follow">noindex, follow</option></select></div>
        <div class="form-group" style="margin-bottom: 1rem;"><label style="color: #f97583; font-size: 0.7rem; margin-bottom: 4px; display: block;">CANONICAL:</label><input type="text" id="seo-canonical" class="form-input" placeholder="https://example.com/canonical" style="background: #1e1e1e; border: 1px solid #333; color: #ddd; font-size: 0.8rem; font-family: monospace;"></div>
        <div class="form-group" style="margin-bottom: 1rem;"><label style="color: #f97583; font-size: 0.7rem; margin-bottom: 4px; display: block;">LANG:</label><input type="text" id="seo-lang" class="form-input" placeholder="en" value="en" style="background: #1e1e1e; border: 1px solid #333; color: #ddd; font-size: 0.8rem; font-family: monospace;"></div>
        <div class="form-group"><label style="color: #f97583; font-size: 0.7rem; margin-bottom: 4px; display: block;">THEME_COLOR:</label><input type="color" id="seo-theme" value="#6366f1" style="width: 100%; height: 40px; background: #1e1e1e; border: 1px solid #333; border-radius: 4px;"></div>
      </div>

      <!-- Schema -->
      <div id="seo-cont-schema" class="seo-cont" style="display: none;">
        <div class="form-group" style="margin-bottom: 1rem;"><label style="color: #79c0ff; font-size: 0.7rem; margin-bottom: 4px; display: block;">SCHEMA_TYPE:</label><select id="seo-schema-type" class="form-select" style="background: #1e1e1e; border: 1px solid #333; color: #ddd; font-size: 0.8rem;"><option value="WebSite">WebSite</option><option value="Organization">Organization</option><option value="Article">Article</option><option value="Product">Product</option><option value="LocalBusiness">LocalBusiness</option></select></div>
        <div class="form-group" style="margin-bottom: 1rem;"><label style="color: #79c0ff; font-size: 0.7rem; margin-bottom: 4px; display: block;">ORG_NAME:</label><input type="text" id="seo-org-name" class="form-input" placeholder="Your Company" style="background: #1e1e1e; border: 1px solid #333; color: #ddd; font-size: 0.8rem; font-family: monospace;"></div>
        <div class="form-group"><label style="color: #79c0ff; font-size: 0.7rem; margin-bottom: 4px; display: block;">ORG_LOGO:</label><input type="text" id="seo-org-logo" class="form-input" placeholder="https://example.com/logo.png" style="background: #1e1e1e; border: 1px solid #333; color: #ddd; font-size: 0.8rem; font-family: monospace;"></div>
      </div>

      <!-- Analytics -->
      <div id="seo-cont-analytics" class="seo-cont" style="display: none;">
        <p style="color: #858585; font-size: 0.7rem; line-height: 1.5; margin-bottom: 1rem;">Add tracking IDs for analytics platforms. Leave empty to skip.</p>
        <div class="form-group" style="margin-bottom: 1rem;"><label style="color: #85e89d; font-size: 0.7rem; margin-bottom: 4px; display: block;">GOOGLE_ANALYTICS:</label><input type="text" id="seo-ga" class="form-input" placeholder="G-XXXXXXXXXX" style="background: #1e1e1e; border: 1px solid #333; color: #ddd; font-size: 0.8rem; font-family: monospace;"></div>
        <div class="form-group"><label style="color: #85e89d; font-size: 0.7rem; margin-bottom: 4px; display: block;">GTM_ID:</label><input type="text" id="seo-gtm" class="form-input" placeholder="GTM-XXXXXXX" style="background: #1e1e1e; border: 1px solid #333; color: #ddd; font-size: 0.8rem; font-family: monospace;"></div>
      </div>
    `;
  }

  setupListeners() {
    // Tab switching
    document.querySelectorAll('.seo-tab').forEach(btn => {
      btn.onclick = () => {
        this.currentTab = btn.dataset.tab;
        document.querySelectorAll('.seo-tab').forEach(b => {
          b.style.background = 'transparent';
          b.style.color = '#858585';
          b.style.borderBottom = '2px solid transparent';
        });
        btn.style.background = '#1e1e1e';
        btn.style.color = '#fff';
        btn.style.borderBottom = '2px solid #007acc';

        document.querySelectorAll('.seo-cont').forEach(c => c.style.display = 'none');
        document.getElementById(`seo-cont-${this.currentTab}`).style.display = 'block';
      };
    });

    // Generate
    document.getElementById('seo-btn-gen').onclick = () => this.generate();

    // Copy
    [document.getElementById('seo-btn-copy'), document.getElementById('seo-copy-quick')].forEach(btn => {
      if (btn) btn.onclick = () => this.copyToClipboard(document.getElementById('seo-output').textContent);
    });

    // Download
    document.getElementById('seo-dl-html').onclick = () => {
      const code = document.getElementById('seo-output').textContent;
      const blob = new Blob([code], { type: 'text/html' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'meta-tags.html';
      a.click();
    };

    // Templates
    document.querySelectorAll('.seo-template').forEach(btn => {
      btn.onclick = () => {
        const tpl = btn.dataset.tpl;
        if (tpl === 'blog') {
          document.getElementById('seo-title').value = 'My Awesome Blog Post Title';
          document.getElementById('seo-desc').value = 'Discover amazing insights and tips in this comprehensive blog post.';
          document.getElementById('seo-keywords').value = 'blog, tutorial, guide';
          document.getElementById('seo-schema-type').value = 'Article';
        } else if (tpl === 'ecom') {
          document.getElementById('seo-title').value = 'Premium Product Name - Best Price';
          document.getElementById('seo-desc').value = 'Buy Premium Product with free shipping. Limited stock available.';
          document.getElementById('seo-keywords').value = 'product, shop, buy';
          document.getElementById('seo-schema-type').value = 'Product';
        } else if (tpl === 'local') {
          document.getElementById('seo-title').value = 'Local Business Name - City, State';
          document.getElementById('seo-desc').value = 'Best local services in your area. Contact us today!';
          document.getElementById('seo-schema-type').value = 'LocalBusiness';
        } else if (tpl === 'article') {
          document.getElementById('seo-title').value = 'Breaking: Important News Article Title';
          document.getElementById('seo-desc').value = 'Latest updates on this important topic with expert analysis.';
          document.getElementById('seo-schema-type').value = 'Article';
        }
        this.generate();
      };
    });
  }

  generate() {
    const data = {
      title: document.getElementById('seo-title').value || 'Page Title',
      desc: document.getElementById('seo-desc').value || 'Page description',
      keywords: document.getElementById('seo-keywords').value,
      url: document.getElementById('seo-url').value || 'https://example.com',
      image: document.getElementById('seo-image').value,
      robots: document.getElementById('seo-robots').value,
      canonical: document.getElementById('seo-canonical').value,
      lang: document.getElementById('seo-lang').value || 'en',
      theme: document.getElementById('seo-theme').value,
      schemaType: document.getElementById('seo-schema-type').value,
      orgName: document.getElementById('seo-org-name').value,
      orgLogo: document.getElementById('seo-org-logo').value,
      ga: document.getElementById('seo-ga').value,
      gtm: document.getElementById('seo-gtm').value
    };

    let code = `<!DOCTYPE html>
<html lang="${data.lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Basic SEO -->
  <title>${data.title}</title>
  <meta name="description" content="${data.desc}">
  ${data.keywords ? `<meta name="keywords" content="${data.keywords}">` : ''}
  <meta name="robots" content="${data.robots}">
  ${data.canonical ? `<link rel="canonical" href="${data.canonical}">` : ''}
  <meta name="theme-color" content="${data.theme}">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${data.url}">
  <meta property="og:title" content="${data.title}">
  <meta property="og:description" content="${data.desc}">
  ${data.image ? `<meta property="og:image" content="${data.image}">` : ''}
  
  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="${data.url}">
  <meta property="twitter:title" content="${data.title}">
  <meta property="twitter:description" content="${data.desc}">
  ${data.image ? `<meta property="twitter:image" content="${data.image}">` : ''}
  
  <!-- Schema.org JSON-LD -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "${data.schemaType}",
    "name": "${data.orgName || data.title}",
    "url": "${data.url}"${data.orgLogo ? `,\n    "logo": "${data.orgLogo}"` : ''}
  }
  </script>
  ${data.ga ? `
  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=${data.ga}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${data.ga}');
  </script>` : ''}
  ${data.gtm ? `
  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','${data.gtm}');</script>` : ''}
</head>
<body>
  <!-- Your content here -->
</body>
</html>`;

    document.getElementById('seo-output').textContent = code;
  }
}

// Register tool
window.initMetaTagsGeneratorLogic = MetaTagsSEOTool;
