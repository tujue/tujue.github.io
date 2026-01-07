/* TULPAR - Social Preview Tool OOP Implementation */
class SocialPreviewTool extends BaseTool {
    constructor(config) {
        super(config);
        this.data = {
            url: 'https://example.com',
            title: 'Your Premium Social Title',
            desc: 'A brief description of what your website or product does. Make it catchy and concise for better engagement.',
            image: ''
        };
    }

    renderUI() {
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const txt = isTr ? {
            title: 'Sosyal Medya Önizleme Stüdyosu',
            url: 'Website Adresi (URL)',
            pageTitle: 'Sayfa Başlığı',
            desc: 'Açıklama Metni',
            image: 'Önizleme Görseli',
            drop: 'Görseli bırakın veya yükleyin',
            previews: {
                google: 'Google Arama Sonucu',
                facebook: 'Facebook / LinkedIn Kartı',
                twitter: 'Twitter (X) Gönderisi',
                discord: 'Discord Yerleşik Bağlantı'
            },
            stats: {
                title: 'Başlık Uzunluğu',
                desc: 'Açıklama Uzunluğu'
            },
            copy: 'Meta Etiketlerini Kopyala'
        } : {
            title: 'Social Preview Studio',
            url: 'Website URL',
            pageTitle: 'Page Title',
            desc: 'Description Text',
            image: 'Preview Image',
            drop: 'Drop preview image or upload',
            previews: {
                google: 'Google Search Simulation',
                facebook: 'Facebook / LinkedIn Card',
                twitter: 'Twitter (X) Post Card',
                discord: 'Discord Embed Style'
            },
            stats: {
                title: 'Title Length',
                desc: 'Description Weight'
            },
            copy: 'Copy SEO Meta Tags'
        };

        return `
        <div class="tool-content social-studio" style="max-width: 1300px; margin: 0 auto; padding: 20px;">
            <div class="grid-layout" style="display: grid; grid-template-columns: 360px 1fr; gap: 2.5rem; align-items: start;">
                
                <!-- Input Panel -->
                <div class="social-inputs">
                    <div class="card" style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 20px; position: sticky; top: 20px;">
                        <h4 style="margin-bottom: 1.5rem; color: var(--primary); text-transform: uppercase; font-size: 0.85rem;">${txt.title}</h4>
                        
                        <div class="form-group">
                            <label class="form-label">${txt.url}</label>
                            <input type="text" id="sp-in-url" class="form-input" value="${this.data.url}" placeholder="https://">
                        </div>

                        <div class="form-group">
                            <div style="display:flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                                <label class="form-label" style="margin:0;">${txt.pageTitle}</label>
                                <span id="sp-title-badge" style="font-size: 0.65rem; font-weight: 700;">OK</span>
                            </div>
                            <input type="text" id="sp-in-title" class="form-input" value="${this.data.title}">
                            <div style="font-size: 0.7rem; opacity: 0.5; margin-top: 4px; text-align: right;"><span id="sp-cnt-title">0</span> / 60</div>
                        </div>

                        <div class="form-group">
                            <div style="display:flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                                <label class="form-label" style="margin:0;">${txt.desc}</label>
                                <span id="sp-desc-badge" style="font-size: 0.65rem; font-weight: 700;">OK</span>
                            </div>
                            <textarea id="sp-in-desc" class="form-input" style="height: 100px; resize: none;">${this.data.desc}</textarea>
                            <div style="font-size: 0.7rem; opacity: 0.5; margin-top: 4px; text-align: right;"><span id="sp-cnt-desc">0</span> / 160</div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">${txt.image}</label>
                            <div id="sp-drop" class="dropzone" style="height: 100px; border: 2px dashed var(--border-color); border-radius: 12px; display: flex; flex-direction: column; justify-content: center; align-items: center; cursor: pointer; background: rgba(0,0,0,0.1);">
                                <span id="sp-drop-txt" style="font-size: 0.75rem; opacity: 0.6; text-align: center;">${txt.drop}</span>
                                <input type="file" id="sp-in-img" hidden accept="image/*">
                            </div>
                        </div>

                        <button id="sp-btn-copy" class="btn btn-primary" style="width: 100%; margin-top: 1.5rem; font-weight: 700;">${txt.copy}</button>
                    </div>
                </div>

                <!-- Preview Simulations -->
                <div class="social-previews" style="display: flex; flex-direction: column; gap: 2rem;">
                    
                    <!-- Google -->
                    <section>
                        <h5 style="margin-bottom: 0.75rem; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary);">${txt.previews.google}</h5>
                        <div class="card" style="background: #202124; padding: 1.5rem; border-radius: 12px; font-family: arial, sans-serif;">
                            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                                <div style="width: 28px; height: 28px; background: #303134; border-radius: 50%; display: grid; place-items: center; color: #fff; font-size: 14px;">G</div>
                                <div style="display: flex; flex-direction: column;">
                                    <span id="p-g-domain" style="color: #dadce0; font-size: 14px;">example.com</span>
                                    <span id="p-g-url" style="color: #bdc1c6; font-size: 12px;">https://example.com</span>
                                </div>
                            </div>
                            <h3 id="p-g-title" style="color: #8ab4f8; font-size: 20px; font-weight: normal; margin: 0 0 4px; line-height: 1.3;">Page title here</h3>
                            <p id="p-g-desc" style="color: #bdc1c6; font-size: 14px; margin: 0; line-height: 1.58;">Description snippet here...</p>
                        </div>
                    </section>

                    <!-- Facebook -->
                    <section>
                        <h5 style="margin-bottom: 0.75rem; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary);">${txt.previews.facebook}</h5>
                        <div class="card" style="background: #242526; padding: 0; border: 1px solid #3e4042; border-radius: 0; max-width: 550px; overflow: hidden; font-family: Helvetica, Arial, sans-serif;">
                            <div id="p-fb-img" style="height: 280px; background: #3a3b3c; background-size: cover; background-position: center;"></div>
                            <div style="padding: 12px; background: #242526;">
                                <div id="p-fb-domain" style="color: #b0b3b8; font-size: 12px; text-transform: uppercase; margin-bottom: 4px;">EXAMPLE.COM</div>
                                <div id="p-fb-title" style="color: #e4e6eb; font-weight: 600; font-size: 16px; margin-bottom: 4px;">Page Title</div>
                                <div id="p-fb-desc" style="color: #b0b3b8; font-size: 14px; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;">Description text here...</div>
                            </div>
                        </div>
                    </section>

                    <!-- Twitter Card -->
                    <section>
                        <h5 style="margin-bottom: 0.75rem; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary);">${txt.previews.twitter}</h5>
                        <div class="card" style="background: black; border: 1px solid #333639; border-radius: 14px; overflow: hidden; max-width: 550px; font-family: Segoe UI, sans-serif;">
                            <div id="p-tw-img" style="height: 280px; background: #1a1a1a; background-size: cover; background-position: center;"></div>
                            <div style="padding: 12px;">
                                <div id="p-tw-domain" style="color: #71767b; font-size: 15px; margin-bottom: 2px;">example.com</div>
                                <div id="p-tw-title" style="color: #e7e9ea; font-size: 15px; margin-bottom: 2px;">Page title...</div>
                                <div id="p-tw-desc" style="color: #71767b; font-size: 15px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">Page description text goes here in this simulation...</div>
                            </div>
                        </div>
                    </section>

                    <!-- Discord -->
                    <section>
                        <h5 style="margin-bottom: 0.75rem; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary);">${txt.previews.discord}</h5>
                        <div class="card" style="background: #2f3136; border-left: 4px solid #202225; padding: 12px; border-radius: 4px; max-width: 432px; font-family: Whitney, sans-serif;">
                            <div id="p-ds-domain" style="font-size: 12px; color: #b9bbbe; margin-bottom: 4px;">example.com</div>
                            <div id="p-ds-title" style="font-size: 16px; color: #00b0f4; font-weight: 600; margin-bottom: 4px;">Page Title</div>
                            <div id="p-ds-desc" style="font-size: 14px; color: #dcddde; margin-bottom: 12px; line-height: 1.3;">Description content text...</div>
                            <div id="p-ds-img" style="width: 100%; height: 225px; background: #202225; background-size: cover; background-position: center; border-radius: 4px;"></div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
        `;
    }

    setupListeners() {
        const urlIn = document.getElementById('sp-in-url');
        const titleIn = document.getElementById('sp-in-title');
        const descIn = document.getElementById('sp-in-desc');
        const drop = document.getElementById('sp-drop');
        const imgIn = document.getElementById('sp-in-img');
        const btnCopy = document.getElementById('sp-btn-copy');

        const update = () => {
            const urlValue = urlIn.value || 'https://example.com';
            this.data.url = urlValue;
            this.data.title = titleIn.value;
            this.data.desc = descIn.value;

            let host = 'example.com';
            try { host = new URL(urlValue.includes('://') ? urlValue : 'https://' + urlValue).hostname; } catch (e) { }

            // Update Counts & Badges
            const tLen = this.data.title.length;
            document.getElementById('sp-cnt-title').textContent = tLen;
            const tBadge = document.getElementById('sp-title-badge');
            if (tLen < 30 || tLen > 65) { tBadge.textContent = 'WARN'; tBadge.style.color = '#eab308'; }
            else { tBadge.textContent = 'PERFECT'; tBadge.style.color = '#22c55e'; }

            const dLen = this.data.desc.length;
            document.getElementById('sp-cnt-desc').textContent = dLen;
            const dBadge = document.getElementById('sp-desc-badge');
            if (dLen < 60 || dLen > 165) { dBadge.textContent = 'WARN'; dBadge.style.color = '#eab308'; }
            else { dBadge.textContent = 'PERFECT'; dBadge.style.color = '#22c55e'; }

            // Google
            document.getElementById('p-g-domain').textContent = host;
            document.getElementById('p-g-url').textContent = urlValue;
            document.getElementById('p-g-title').textContent = this.data.title || 'Page Title';
            document.getElementById('p-g-desc').textContent = this.data.desc || 'Page description...';

            // FB
            document.getElementById('p-fb-domain').textContent = host.toUpperCase();
            document.getElementById('p-fb-title').textContent = this.data.title || 'Page Title';
            document.getElementById('p-fb-desc').textContent = this.data.desc || 'Page description...';
            if (this.data.image) document.getElementById('p-fb-img').style.backgroundImage = `url(${this.data.image})`;

            // Twitter
            document.getElementById('p-tw-domain').textContent = host;
            document.getElementById('p-tw-title').textContent = this.data.title || 'Page Title';
            document.getElementById('p-tw-desc').textContent = this.data.desc || 'Page description...';
            if (this.data.image) document.getElementById('p-tw-img').style.backgroundImage = `url(${this.data.image})`;

            // Discord
            document.getElementById('p-ds-domain').textContent = host;
            document.getElementById('p-ds-title').textContent = this.data.title || 'Page Title';
            document.getElementById('p-ds-desc').textContent = this.data.desc || 'Page description...';
            if (this.data.image) document.getElementById('p-ds-img').style.backgroundImage = `url(${this.data.image})`;
        };

        [urlIn, titleIn, descIn].forEach(el => el.oninput = update);

        drop.onclick = () => imgIn.click();
        imgIn.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (re) => {
                    this.data.image = re.target.result;
                    document.getElementById('sp-drop-txt').textContent = `📄 ${file.name}`;
                    update();
                };
                reader.readAsDataURL(file);
            }
        };

        btnCopy.onclick = () => {
            const code = `
<!-- Standard Meta Tags -->
<title>${this.data.title}</title>
<meta name="description" content="${this.data.desc}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${this.data.url}">
<meta property="og:title" content="${this.data.title}">
<meta property="og:description" content="${this.data.desc}">
${this.data.image ? `<meta property="og:image" content="YOUR_IMAGE_URL">` : ''}

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${this.data.url}">
<meta property="twitter:title" content="${this.data.title}">
<meta property="twitter:description" content="${this.data.desc}">
${this.data.image ? `<meta property="twitter:image" content="YOUR_IMAGE_URL">` : ''}
            `.trim();
            this.copyToClipboard(code);
        };

        update();
    }
}

// Register tool
window.initSocialPreviewLogic = SocialPreviewTool;
