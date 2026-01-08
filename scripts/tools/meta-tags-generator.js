/* TULPAR - Meta Tags Generator Tool OOP Implementation */
class MetaTagsTool extends BaseTool {
  constructor(config) {
    super(config);
  }

  renderUI() {
    const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
    const txt = isTr ? {
      config: 'İçerik Ayarları',
      template: 'Hızlı Şablon',
      labels: { title: 'Başlık', desc: 'Açıklama', keywords: 'Etiketler', url: 'URL', image: 'Görsel URL', site: 'Site Adı', author: 'Yazar', twitter: 'Twitter' },
      tabs: { google: 'Google', fb: 'Facebook', tw: 'Twitter', insta: 'Instagram 📸', code: 'Kaynak Kod' },
      preview: 'Önizleme'
    } : {
      config: 'Content Configuration',
      template: 'Quick Template',
      labels: { title: 'Title', desc: 'Description', keywords: 'Keywords', url: 'URL', image: 'Image URL', site: 'Site Name', author: 'Author', twitter: 'Twitter Handle' },
      tabs: { google: 'Google', fb: 'Facebook', tw: 'Twitter', insta: 'Instagram 📸', code: 'Source Code' },
      preview: 'Preview'
    };

    const templates = [{ id: 'blog', name: 'Blog Post' }, { id: 'product', name: 'Product' }, { id: 'portfolio', name: 'Portfolio' }];

    return `
        <div class="tool-content" style="max-width: 1400px; margin: 0 auto; padding: 20px;">
            <div class="grid-layout" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                <!-- Inputs -->
                <div class="input-section">
                     <div class="card" style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 12px;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:1.5rem;">
                            <h4 style="margin:0; color:var(--primary);">${txt.config}</h4>
                            <div style="display:flex; gap:5px;">
                                ${templates.map(t => `<button class="btn btn-sm btn-outline meta-tpl" data-id="${t.id}">${t.name}</button>`).join('')}
                            </div>
                        </div>

                        <div class="form-group"><label class="form-label">${txt.labels.title}</label><input type="text" id="m-in-title" class="form-input m-in" placeholder="Page Title (Max 60 chars)"></div>
                        <div class="form-group"><label class="form-label">${txt.labels.desc}</label><textarea id="m-in-desc" class="form-input m-in" rows="3" placeholder="Page Description (Max 160 chars)"></textarea></div>
                        <div class="form-group"><label class="form-label">${txt.labels.image}</label><input type="text" id="m-in-img" class="form-input m-in" placeholder="https://example.com/image.jpg"></div>
                        
                        <div class="grid-2" style="display:grid; grid-template-columns:1fr 1fr; gap:15px; margin-top:10px;">
                             <div class="form-group"><label class="form-label">${txt.labels.url}</label><input type="text" id="m-in-url" class="form-input m-in" placeholder="https://..."></div>
                             <div class="form-group"><label class="form-label">${txt.labels.site}</label><input type="text" id="m-in-site" class="form-input m-in" placeholder="MySite"></div>
                        </div>
                        <div class="grid-2" style="display:grid; grid-template-columns:1fr 1fr; gap:15px; margin-top:10px;">
                             <div class="form-group"><label class="form-label">${txt.labels.author}</label><input type="text" id="m-in-author" class="form-input m-in" placeholder="John Doe"></div>
                             <div class="form-group"><label class="form-label">${txt.labels.twitter}</label><input type="text" id="m-in-tw" class="form-input m-in" placeholder="@username"></div>
                        </div>
                     </div>
                </div>

                <!-- Previews -->
                <div class="preview-section">
                    <div style="display:flex; gap:10px; margin-bottom:1rem; overflow-x:auto; padding-bottom:5px;">
                        <button class="btn btn-sm btn-primary m-tab" data-tab="google">Google</button>
                        <button class="btn btn-sm btn-outline m-tab" data-tab="fb">Facebook</button>
                        <button class="btn btn-sm btn-outline m-tab" data-tab="tw">Twitter</button>
                        <button class="btn btn-sm btn-outline m-tab" data-tab="insta">${txt.tabs.insta}</button>
                        <button class="btn btn-sm btn-outline m-tab" data-tab="code">${txt.tabs.code}</button>
                    </div>

                    <!-- Google -->
                    <div id="m-view-google" class="m-view" style="background:#fff; padding:20px; border-radius:8px; color:#333; font-family:arial,sans-serif;">
                        <div style="font-size:14px; color:#202124; margin-bottom:5px; display:flex; align-items:center;">
                            <div style="width:26px; height:26px; background:#f1f3f4; border-radius:50%; margin-right:10px; display:flex; align-items:center; justify-content:center;">G</div>
                            <span id="p-g-site">example.com</span>
                            <span style="color:#5f6368; margin-left:5px;">› ...</span>
                        </div>
                        <div id="p-g-title" style="font-size:20px; color:#1a0dab; cursor:pointer;">Page Title</div>
                        <div id="p-g-desc" style="font-size:14px; color:#4d5156; margin-top:3px; line-height:1.58;">Page description goes here...</div>
                    </div>

                    <!-- Facebook -->
                    <div id="m-view-fb" class="m-view" style="display:none; background:#f0f2f5; padding:20px; border-radius:8px; font-family: Helvetica, Arial, sans-serif;">
                         <div style="background:#fff; border:1px solid #ddd; border-radius:8px; overflow:hidden; max-width:500px; margin:0 auto;">
                            <div id="p-fb-img" style="height:260px; background:#eee; background-size:cover; background-position:center;"></div>
                            <div style="padding:10px 12px; background:#f2f3f5;">
                                <div id="p-fb-site" style="text-transform:uppercase; color:#606770; font-size:12px; margin-bottom:5px;">EXAMPLE.COM</div>
                                <div id="p-fb-title" style="color:#1d2129; font-weight:600; font-size:16px; margin-bottom:5px; line-height:20px; max-height:40px; overflow:hidden;">Page Title</div>
                                <div id="p-fb-desc" style="color:#606770; font-size:14px; line-height:20px; max-height:20px; overflow:hidden; white-space:nowrap; text-overflow:ellipsis;">Description goes here...</div>
                            </div>
                         </div>
                    </div>

                    <!-- Twitter -->
                    <div id="m-view-tw" class="m-view" style="display:none; background:#15202b; padding:20px; border-radius:8px; color:white; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                        <div style="background:#000; border:1px solid #38444d; border-radius:14px; overflow:hidden; max-width:500px; margin:0 auto;">
                            <div id="p-tw-img" style="height:260px; background:#222; background-size:cover; background-position:center;"></div>
                            <div style="padding:12px; border-top:1px solid #38444d;">
                                <div id="p-tw-title" style="font-weight:bold; font-size:15px; margin-bottom:3px;">Page Title</div>
                                <div id="p-tw-desc" style="color:#8899a6; font-size:14px; margin-bottom:5px;">Description goes here...</div>
                                <div id="p-tw-site" style="color:#8899a6; font-size:14px;">example.com</div>
                            </div>
                        </div>
                    </div>

                    <!-- Instagram -->
                    <div id="m-view-insta" class="m-view" style="display:none; background:#fff; padding:20px; border-radius:8px; color:#262626; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; border: 1px solid #dbdbdb; min-height: 400px;">
                        <div style="max-width:400px; margin:0 auto; border:1px solid #dbdbdb; background:white; border-radius:3px;">
                            <!-- Header -->
                            <div style="padding:14px; display:flex; align-items:center;">
                                <div style="width:32px; height:32px; border-radius:50%; background:linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%); padding:2px; flex-shrink: 0;">
                                    <div style="background:white; width:100%; height:100%; border-radius:50%;"></div>
                                </div>
                                <div style="margin-left:10px; font-weight:600; font-size:14px; overflow:hidden; text-overflow:ellipsis;" id="p-in-user">username</div>
                                <div style="margin-left:auto;">•••</div>
                            </div>
                            <!-- Image -->
                            <div id="p-in-img" style="width:100%; padding-bottom:100%; background:#fafafa; background-size:cover; background-position:center; position:relative;"></div>
                            <!-- Actions -->
                            <div style="padding:10px; font-size:24px;">
                                ♡ 💬 ➤ <span style="float:right">⚑</span>
                            </div>
                            <!-- Caption -->
                            <div style="padding:0 12px 12px; font-size:14px; line-height:1.4;">
                                <span style="font-weight:600; margin-right:5px;" id="p-in-user2">username</span>
                                <span id="p-in-desc">Caption...</span>
                                <div style="color:#8e8e8e; font-size:10px; margin-top:5px; text-transform:uppercase;">10 HOURS AGO</div>
                            </div>
                        </div>
                    </div>

                    <!-- Code -->
                    <div id="m-view-code" class="m-view" style="display:none;">
                        <div style="margin-bottom:10px; display:flex; justify-content:flex-end;">
                            <button id="m-btn-copy" class="btn btn-sm btn-primary">📋 Copy</button>
                        </div>
                        <pre id="m-out-code" style="background:#1e1e1e; color:#d4d4d4; padding:15px; border-radius:8px; overflow-x:auto; font-family:monospace; font-size:13px;"></pre>
                    </div>
                </div>
            </div>
        </div>
        `;
  }

  setupListeners() {
    const els = {
      title: document.getElementById('m-in-title'),
      desc: document.getElementById('m-in-desc'),
      img: document.getElementById('m-in-img'),
      url: document.getElementById('m-in-url'),
      site: document.getElementById('m-in-site'),
      author: document.getElementById('m-in-author'),
      tw: document.getElementById('m-in-tw')
    };

    const updatePreviews = () => {
      const val = (k) => els[k].value;
      const fallbackImg = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlZWVlZWUiLz48dGV4dCB4PSI1MCIgeT0iNTAiIGZvbnQtZmFtaWx5PSJhcmlhbCIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5OTk5OSI+SU1BR0U8L3RleHQ+PC9zdmc+';

      // Google
      document.getElementById('p-g-title').textContent = val('title') || 'Page Title';
      document.getElementById('p-g-desc').textContent = val('desc') || 'Page description...';
      document.getElementById('p-g-site').textContent = val('site') || 'example.com';

      // Facebook
      document.getElementById('p-fb-title').textContent = val('title') || 'Page Title';
      document.getElementById('p-fb-desc').textContent = val('desc') || 'Description...';
      document.getElementById('p-fb-site').textContent = (val('site') || 'EXAMPLE.COM').toUpperCase();
      document.getElementById('p-fb-img').style.backgroundImage = `url('${val('img') || fallbackImg}')`;

      // Twitter
      document.getElementById('p-tw-title').textContent = val('title') || 'Page Title';
      document.getElementById('p-tw-desc').textContent = val('desc') || 'Description...';
      document.getElementById('p-tw-site').textContent = (val('site') || 'example.com').toLowerCase();
      document.getElementById('p-tw-img').style.backgroundImage = `url('${val('img') || fallbackImg}')`;

      // Instagram
      const user = val('tw') || val('author') || 'username';
      document.getElementById('p-in-user').textContent = user;
      document.getElementById('p-in-user2').textContent = user;
      document.getElementById('p-in-desc').textContent = val('desc') || 'Caption text goes here...';
      document.getElementById('p-in-img').style.backgroundImage = `url('${val('img') || fallbackImg}')`;

      // Code Generation
      const data = {};
      Object.keys(els).forEach(k => data[k] = els[k].value);
      // Map keys correctly for generator
      const map = { title: 'title', desc: 'description', img: 'image', url: 'url', site: 'siteName', author: 'author', tw: 'twitterHandle' };
      const genData = {};
      Object.keys(data).forEach(k => genData[map[k]] = data[k] || '');

      document.getElementById('m-out-code').textContent = this.generateMetaTags(genData);
    };

    Object.values(els).forEach(e => e.addEventListener('input', updatePreviews));

    // Tabs
    const tabBtns = document.querySelectorAll('.m-tab');
    const views = document.querySelectorAll('.m-view');
    tabBtns.forEach(btn => {
      btn.onclick = () => {
        tabBtns.forEach(b => b.classList.replace('btn-primary', 'btn-outline'));
        btn.classList.replace('btn-outline', 'btn-primary');
        views.forEach(v => v.style.display = 'none');
        document.getElementById(`m-view-${btn.dataset.tab}`).style.display = 'block';
      };
    });

    // Templates
    document.querySelectorAll('.meta-tpl').forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        if (id === 'blog') {
          els.title.value = 'My Awesome Blog Post';
          els.desc.value = 'Read about the latest trends in technology and development.';
          els.img.value = 'https://source.unsplash.com/random/800x600?tech';
          els.site.value = 'MyBlog';
        } else if (id === 'product') {
          els.title.value = 'Amazing Product - Shop Now';
          els.desc.value = 'Best quality product you can find online. Buy now with 50% discount.';
          els.img.value = 'https://source.unsplash.com/random/800x600?product';
          els.site.value = 'MyShop';
        } else if (id === 'portfolio') {
          els.title.value = 'John Doe - Portfolio';
          els.desc.value = 'Showcasing my latest work in web design and development.';
          els.img.value = 'https://source.unsplash.com/random/800x600?design';
          els.site.value = 'JohnDoe';
          els.author.value = 'John Doe';
        }
        updatePreviews();
      };
    });

    document.getElementById('m-btn-copy').onclick = () => {
      navigator.clipboard.writeText(document.getElementById('m-out-code').textContent);
      const btn = document.getElementById('m-btn-copy');
      const original = btn.textContent;
      btn.textContent = '✅ Copied';
      setTimeout(() => btn.textContent = original, 1500);
    };

    updatePreviews();
  }

  // INTERNAL LOGIC (Formerly in DevTools.metaTagsTools)

  generateMetaTags(data) {
    const { title, description, image, url, siteName, author, twitterHandle } = data;

    let html = `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}">
<meta name="description" content="${description}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${image}">
`;

    if (siteName) html += `<meta property="og:site_name" content="${siteName}">\n`;

    html += `
<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${url}">
<meta property="twitter:title" content="${title}">
<meta property="twitter:description" content="${description}">
<meta property="twitter:image" content="${image}">
`;

    if (twitterHandle) html += `<meta name="twitter:creator" content="${twitterHandle}">\n`;
    if (author) html += `<meta name="author" content="${author}">\n`;

    return html;
  }
}

window.initMetaTagsGeneratorLogic = MetaTagsTool;
