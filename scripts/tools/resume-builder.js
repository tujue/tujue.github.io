/* TULPAR - Resume Builder Tool (Wizard UX) */
class ResumeBuilderTool extends BaseTool {
    constructor(container) {
        super(container);

        // Enhance workspace size for Resume Builder
        // Force compact styles via JS to ensure immediate effect
        setTimeout(() => {
            const ws = document.querySelector('.workspace-content');
            if (ws) {
                ws.classList.add('full-width-workspace');
                this._origWsPadding = ws.style.padding;
                ws.style.padding = '0'; // Remove GAP between header and body completely
            }

            const header = document.querySelector('.workspace-header');
            if (header) {
                // Completely HIDE the default workspace header to reclaim space
                // We will integrate the title and close button into the tool's nav bar instead
                this._origHeaderDisplay = header.style.display;
                header.style.setProperty('display', 'none', 'important');
            }
        }, 10);

        this.data = this._load() || this._getDefaults();
        this.currentTab = 'personal'; // personal, exp, edu, skills, design, preview
        this.scaleValue = 1;
        this.zoom = 'fit';

        // Theme-specific experience limits (tested capacity)
        this.THEME_LIMITS = {
            'executive': 2,  // Yönetici
            'tech': 3,       // Teknoloji
            'skyline': 3,
            'minimal': 3,
            'modern': 3,
            'elegant': 3,
            'prime': 3,
            'orbit': 4,
            'bloom': 4,
            'leftside': 4,   // Sol Sütun
            'brutal': 4,
            'cyber': 4,
            'titan': 4,
            'bold': 5,
            'wave': 6,       // Safe default
            'nova': 6        // Safe default
        };
    }

    renderUI() {
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const txt = isTr ? {
            tabs: { p: 'Kişisel Bilgiler', x: 'Deneyim', e: 'Eğitim', c: 'Sertifikalar', l: 'Diller', v: 'Önizleme' },
            lbl: { name: 'Ad Soyad', title: 'Ünvan', mail: 'E-posta', web: 'Website', phone: 'Telefon', addr: 'Adres', photo: 'Profil Fotoğrafı', upload: 'Fotoğraf Yükle' },
            btn: { next: 'Sonraki Adım >', prev: '< Geri', print: 'Yazdır / PDF', reset: 'Sıfırla' },
            fonts: { sans: 'Standart', modern: 'Modern', display: 'Zarif', strong: 'Güçlü', serif: 'Serif', condensed: 'Sıkışık', mono: 'Kod', sweet: 'Tatlı (Nunito)', clean: 'Temiz (Open Sans)', elegant2: 'Zarif 2 (Raleway)', charismatic: 'Karizmatik (Merriweather)', modern2: 'Modern 2 (Lato)' },
            themes: { modern: 'Modern', nova: 'Nova (Modern)', orbit: 'Orbit (Koyu)', bloom: 'Bloom (Pastel)', wave: 'Wave (Dalga)', bold: 'Bold (Güçlü)', prime: 'Prime (Kurumsal)', elegant: 'Elegant (Yeni)', titan: 'Titan (Yeni)', cyber: 'Cyber (Yeni)', brutal: 'Brutal (Yeni)', executive: 'Yönetici', minimal: 'Minimal', leftside: 'Sol Sütun', skyline: 'Skyline', tech: 'Teknoloji' }
        } : {
            tabs: { p: 'Personal Info', x: 'Experience', e: 'Education', c: 'Certificates', l: 'Languages', v: 'Preview' },
            lbl: { name: 'Full Name', title: 'Job Title', mail: 'Email', web: 'Website', phone: 'Phone', addr: 'Address', photo: 'Profile Photo', upload: 'Upload Photo' },
            btn: { next: 'Next Step >', prev: '< Back', print: 'Print / PDF', reset: 'Reset' },
            fonts: { sans: 'Standard', modern: 'Modern', display: 'Elegant', strong: 'Strong', serif: 'Serif', condensed: 'Condensed', mono: 'Code', sweet: 'Sweet (Nunito)', clean: 'Clean (Open Sans)', elegant2: 'Elegant 2 (Raleway)', charismatic: 'Charismatic (Merriweather)', modern2: 'Modern 2 (Lato)' },
            themes: { modern: 'Modern', nova: 'Nova (Modern)', orbit: 'Orbit (Dark)', bloom: 'Bloom (Pastel)', wave: 'Wave (Curve)', bold: 'Bold (Sharp)', prime: 'Prime (Corp)', elegant: 'Elegant (New)', titan: 'Titan (New)', cyber: 'Cyber (New)', brutal: 'Brutal (New)', executive: 'Executive', minimal: 'Minimal', leftside: 'Left Side', skyline: 'Skyline', tech: 'Tech' }
        };

        const tabs = [
            { id: 'personal', icon: '👤', label: txt.tabs.p },
            { id: 'exp', icon: '💼', label: txt.tabs.x },
            { id: 'edu', icon: '🎓', label: txt.tabs.e },
            { id: 'skills', icon: '⚡', label: txt.tabs.s },
            { id: 'preview', icon: '👁️', label: txt.tabs.v }
        ];

        return `
        <div class="tool-content resume-wizard" style="width: 100%; height: 100%; background: var(--bg-primary); display: flex; flex-direction: column;">
            
            <!-- Wizard Header -->
            <div class="res-wizard-nav" style="justify-content: space-between; padding-right: 10px;">
                <!-- Title removed as requested -->

                <div style="display: flex; gap: 10px; overflow-x: auto; align-items: center; flex: 1;">
                    <div class="res-step ${this.currentTab === 'personal' ? 'active' : ''}" onclick="window._resTab('personal')"><span class="step-icon">👤</span> <span class="step-label">${txt.tabs.p}</span></div>
                    <div class="res-step ${this.currentTab === 'exp' ? 'active' : ''}" onclick="window._resTab('exp')"><span class="step-icon">💼</span> <span class="step-label">${txt.tabs.x}</span></div>
                    <div class="res-step ${this.currentTab === 'edu' ? 'active' : ''}" onclick="window._resTab('edu')"><span class="step-icon">🎓</span> <span class="step-label">${txt.tabs.e}</span></div>
                    <div class="res-step ${this.currentTab === 'certs' ? 'active' : ''}" onclick="window._resTab('certs')"><span class="step-icon">🏅</span> <span class="step-label">${txt.tabs.c}</span></div>
                    <div class="res-step ${this.currentTab === 'languages' ? 'active' : ''}" onclick="window._resTab('languages')"><span class="step-icon">🗣️</span> <span class="step-label">${txt.tabs.l}</span></div>
                    <div class="res-step ${this.currentTab === 'preview' ? 'active' : ''}" onclick="window._resTab('preview')"><span class="step-icon">👁️</span> <span class="step-label">${txt.tabs.v}</span></div>
                </div>
                
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="position: relative; width: 34px; height: 34px; overflow: hidden; border-radius: 8px; border: 1px solid var(--border-color); cursor: pointer; display: flex; align-items: center; justify-content: center; background: var(--bg-primary);" title="${isTr ? 'Renk Teması' : 'Color Theme'}">
                        <input type="color" oninput="window._setColor(this.value)" value="${this.data.color}" style="width: 150%; height: 150%; padding: 0; margin: 0; cursor: pointer; border: none; background: none;">
                    </div>
                    <!-- Dual Font Selectors in Sticky Nav -->
                    <div style="display: flex; flex-direction: column; gap: 2px;">
                        <select onchange="window._upField('headerFont', this.value)" style="padding: 2px 6px; border-radius: 4px; border: 1px solid var(--border-color); font-size: 0.7rem; width: 100px; height: 18px;" title="${isTr ? 'Başlık Fontu' : 'Header Font'}">
                             <option value="" disabled selected>${isTr ? 'Başlık' : 'Header'}</option>
                             ${Object.keys(txt.fonts).map(key => `<option value="${key}" ${this.data.headerFont === key || (!this.data.headerFont && this.data.font === key) ? 'selected' : ''}>${txt.fonts[key]}</option>`).join('')}
                        </select>
                        <select onchange="window._upField('bodyFont', this.value)" style="padding: 2px 6px; border-radius: 4px; border: 1px solid var(--border-color); font-size: 0.7rem; width: 100px; height: 18px;" title="${isTr ? 'İçerik Fontu' : 'Content Font'}">
                             <option value="" disabled selected>${isTr ? 'İçerik' : 'Body'}</option>
                             ${Object.keys(txt.fonts).map(key => `<option value="${key}" ${this.data.bodyFont === key || (!this.data.bodyFont && key === 'sans') ? 'selected' : ''}>${txt.fonts[key]}</option>`).join('')}
                        </select>
                    </div>
                    <select onchange="window._setTheme(this.value)" style="padding: 6px 10px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); cursor: pointer; font-size: 0.8rem; outline: none;" title="${isTr ? 'Tema Değiştir' : 'Change Theme'}">
                        <option value="" disabled selected>🎨 ${isTr ? 'Hızlı Tema' : 'Quick Theme'}</option>
                        ${Object.keys(txt.themes).map(key => `<option value="${key}" ${this.data.theme === key ? 'selected' : ''}>${txt.themes[key]}</option>`).join('')}
                    </select>
                    
                    <!-- NEW: Integrated Close Button -->
                    <button onclick="window.closeWorkspace()" style="background:none; border:none; color:var(--text-secondary); font-size:1.2rem; cursor:pointer; padding:5px 10px; margin-left:5px;" title="${isTr ? 'Kapat' : 'Close'}">✕</button>
                </div>
            </div>

            <!-- Content Area -->
            <div class="res-wizard-content" id="res-content-area">
                <!-- Injected via JS -->
            </div>

            <style>
                .res-wizard-nav { display: flex; background: var(--surface); border-bottom: 1px solid var(--border-color); padding: 0 10px; gap: 15px; overflow-x: auto; flex-shrink: 0; min-height: 45px; align-items: center; }
                .res-step { padding: 8px 5px; cursor: pointer; border-bottom: 3px solid transparent; opacity: 0.6; display: flex; align-items: center; gap: 6px; white-space: nowrap; transition: 0.2s; font-size: 0.9rem; }
                .res-step:hover { opacity: 1; background: rgba(0,0,0,0.02); }
                .res-step.active { border-bottom-color: var(--primary); opacity: 1; color: var(--primary); font-weight: 600; }
                .step-icon { font-size: 1.2rem; }
                
                .res-wizard-content { flex: 1; overflow: hidden !important; position: relative; width: 100%; display: flex; flex-direction: column; min-height: 0; }
                .res-scroll-container { 
                    flex: 1; 
                    overflow-y: auto !important; 
                    width: 100%; 
                    scroll-behavior: smooth; 
                    display: flex; 
                    flex-direction: column; 
                    align-items: center; 
                    position: relative; 
                    min-height: 0;
                    max-height: 100%;
                    -webkit-overflow-scrolling: touch; 
                    padding-top: 0; 
                }
                /* Padding to ensure bottom elements are reachable */
                .res-content-scroll-fix { padding-bottom: 250px; width: 100%; display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
                
                .res-sticky-nav { position: sticky; top: 0; z-index: 155; background: var(--bg-primary); border-bottom: 1px solid var(--border-color); display: flex; align-items: center; padding: 6px 15px; gap: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); backdrop-filter: blur(8px); width: 100%; flex-shrink: 0; }
                .res-sticky-nav.compact { padding: 4px 12px; min-height: 36px; }

                .res-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; width: 100%; }
                .res-full-width { grid-column: span 2; }
                .res-card { background: var(--surface); border: 1px solid var(--border-color); border-radius: 16px; padding: 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); width: 100%; max-width: 950px; margin: 15px auto; flex-shrink: 0; }
                
                /* Experience Grid for ultra-compact multi-column (5-6 per row) */
                .res-exp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; width: 100%; margin-bottom: 15px; }
                @media (max-width: 900px) { .res-exp-grid { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 15px; } }
                @media (max-width: 600px) { .res-exp-grid { grid-template-columns: 1fr; } }
                
                .res-photo-upload { width: 120px; height: 120px; border-radius: 50%; background: #eee; cursor: pointer; overflow: hidden; display: flex; align-items: center; justify-content: center; border: 2px dashed #ccc; transition: 0.2s; position: relative; margin: 0 auto 20px; }
                .res-photo-upload:hover { border-color: var(--primary); }
                .res-photo-upload img { width: 100%; height: 100%; object-fit: cover; }
                .res-photo-label { position: absolute; font-size: 0.7rem; background: rgba(0,0,0,0.6); color: white; width: 100%; bottom: 0; text-align: center; padding: 5px 0; }

                .theme-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 15px; }
                .theme-item { border: 2px solid transparent; border-radius: 8px; padding: 15px; text-align: center; cursor: pointer; background: rgba(0,0,0,0.03); transition: 0.2s; }
                .theme-item:hover { transform: translateY(-3px); background: rgba(var(--primary-rgb), 0.1); }
                .theme-item.active { border-color: var(--primary); background: rgba(var(--primary-rgb), 0.1); font-weight: bold; color: var(--primary); }
                
                #res-preview-container { height: 100%; display: flex; justify-content: center; overflow: auto; background: #525659; border-radius: 8px; padding: 0; position: relative; }
                .a4-page { transition: zoom 0.2s; background: white; box-shadow: 0 10px 30px rgba(0,0,0,0.3); transform-origin: top center; image-rendering: -webkit-optimize-contrast; -webkit-font-smoothing: antialiased; }

                /* Animations */
                .res-fade-in { animation: resFadeIn 0.3s ease-out; }
                @keyframes resFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            </style>
        </div>
        `;
    }

    setupListeners() {
        window._resTab = (id) => {
            this.currentTab = id;
            this.renderTabContent();
            this.updateNav();
            const area = document.getElementById('res-content-area');
            if (area) area.scrollTop = 0; // Fix: Always scroll to top on tab change
        };
        window._resNav = (dir) => this.navigate(dir);
        window._resReset = () => {
            if (confirm(window.i18n?.getCurrentLanguage() === 'tr' ? 'Verileri sıfırlamak istediğinize emin misiniz?' : 'Are you sure you want to reset all data?')) {
                this.data = this._getDefaults();
                this._save();
                this.renderTabContent();
            }
        };
        window._setTheme = (id) => {
            this.data.theme = id;
            this._save();
            this.renderTabContent();
            // Update dropdowns if exists
            document.querySelectorAll('select[onchange*="_setTheme"]').forEach(s => s.value = id);
        };
        window._printPdf = (btn) => {
            this._runPdfExport(btn);
        };
        window._setFont = (id) => {
            this.data.font = id;
            this._save();
            this.renderTabContent();
            document.querySelectorAll('select[onchange*="_setFont"]').forEach(s => s.value = id);
        };
        window._setColor = (val) => {
            this.data.color = val;
            this._save();
            this.renderTabContent();
        };
        window._addItem = (type) => {
            if (!this.data.experience) this.data.experience = [];
            if (!this.data.font) this.data.font = 'sans';
            // Sanitize Certificates
            if (this.data.certificates) this.data.certificates = this.data.certificates.map(c => ({ name: c.name || '', issuer: c.issuer || '', date: c.date || '' }));
            if (!this.data.education) this.data.education = [];
            if (!this.data.certificates) this.data.certificates = [];

            if (type === 'exp') this.data.experience.push({ comp: '', role: '', date: '', desc: '' });
            else if (type === 'edu') this.data.education.push({ sch: '', deg: '', date: '' });
            else if (type === 'certs') this.data.certificates.push({ name: '', issuer: '', date: '' });
            this._save();
            this.renderTabContent();
        };
        window._removeItem = (type, index) => {
            if (confirm(window.i18n?.getCurrentLanguage() === 'tr' ? 'Bu öğeyi silmek istediğinize emin misiniz?' : 'Are you sure you want to delete this item?')) {
                this.data[type].splice(index, 1);
                this._save();
                this.renderTabContent();
            }
        };
        window._upField = (field, value, index = null, subField = null) => {
            if (index !== null && subField !== null) {
                if (this.data[field][index]) this.data[field][index][subField] = value;
            } else if (index !== null) {
                if (this.data[field]) this.data[field][index] = value;
            } else {
                this.data[field] = value;
            }
            this._save();

            // Special handling for Fonts (CSS Only - No Flash)
            if (field.includes('Font')) {
                const res = this.generateResumeHTML(this.data);
                let style = document.getElementById('res-style-inj');
                if (style) style.textContent = res.css;
                if (this.currentTab === 'preview') this.fitPreview();
                return;
            }

            // DO NOT renderTabContent for standard inputs (prevents focus loss)
            // Only render for specific global changes that affect UI structure

            // Force Preview Update and Render for Global Settings
            if (field === 'theme' || field === 'color') {
                this.renderTabContent(); // Render UI (Sticky Nav color etc)
                const res = this.generateResumeHTML(this.data);
                let style = document.getElementById('res-style-inj');
                if (style) style.textContent = res.css; // Update Preview CSS
            }
        };

        this.renderTabContent();
    }

    navigate(dir) {
        const tabs = ['personal', 'exp', 'edu', 'certs', 'skills', 'preview']; // 'design' tab is now integrated into the nav bar
        const idx = tabs.indexOf(this.currentTab);
        const newIdx = idx + dir;
        if (newIdx >= 0 && newIdx < tabs.length) {
            this.currentTab = tabs[newIdx];
            this.renderTabContent();
            this.updateNav();
        }
    }

    updateNav() {
        document.querySelectorAll('.res-step').forEach(el => el.classList.remove('active'));
        const active = document.querySelector(`.res-step[onclick="window._resTab('${this.currentTab}')"]`);
        if (active) active.classList.add('active');
    }

    _runPdfExport(btn) {
        const originalText = btn.textContent;
        btn.textContent = 'PDF Oluşturuluyor...';
        btn.disabled = true;

        const loadLibraries = () => {
            return new Promise((resolve, reject) => {
                if (window.html2canvas && window.jspdf) {
                    resolve();
                    return;
                }

                const script1 = document.createElement('script');
                script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
                script1.onload = () => {
                    const script2 = document.createElement('script');
                    script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
                    script2.onload = () => resolve();
                    script2.onerror = () => reject(new Error('jsPDF yüklenemedi'));
                    document.head.appendChild(script2);
                };
                script1.onerror = () => reject(new Error('html2canvas yüklenemedi'));
                document.head.appendChild(script1);
            });
        };

        loadLibraries().then(async () => {
            try {
                const originalPage = document.querySelector('.a4-page');
                if (!originalPage) {
                    throw new Error('CV sayfası bulunamadı');
                }

                // Wait for fonts
                await document.fonts.ready;
                await new Promise(r => setTimeout(r, 200));

                // Create a clean clone at ORIGINAL SIZE (no zoom/scale)
                const clone = originalPage.cloneNode(true);
                clone.style.position = 'fixed';
                clone.style.left = '-99999px';
                clone.style.top = '0';
                clone.style.width = '794px';  // A4 width in pixels
                clone.style.height = '1123px'; // A4 height in pixels
                clone.style.zoom = '1';        // Force no zoom
                clone.style.transform = 'none'; // Force no transform
                document.body.appendChild(clone);

                // Clean problematic CSS from ALL elements in clone
                const cleanElements = clone.querySelectorAll('*');
                cleanElements.forEach(el => {
                    el.style.textShadow = 'none';
                    el.style.boxShadow = 'none';
                    el.style.filter = 'none';
                    el.style.transform = 'none';
                    el.style.zoom = '1';
                });

                // Clone itself also needs cleaning
                clone.style.textShadow = 'none';
                clone.style.boxShadow = 'none';

                // Wait for clone to fully render
                await new Promise(r => setTimeout(r, 300));

                // Capture the clean clone at 1:1 scale
                const canvas = await html2canvas(clone, {
                    scale: 2,
                    useCORS: true,
                    allowTaint: false,
                    logging: false,
                    backgroundColor: '#ffffff',
                    width: 794,
                    height: 1123
                });

                // Remove clone
                document.body.removeChild(clone);

                const imgData = canvas.toDataURL('image/png');
                const pdf = new window.jspdf.jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4'
                });

                const pdfWidth = 210;
                const pdfHeight = 297;
                const imgWidth = pdfWidth;
                const imgHeight = (canvas.height * pdfWidth) / canvas.width;

                if (imgHeight > pdfHeight) {
                    const scale = pdfHeight / imgHeight;
                    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth * scale, pdfHeight);
                } else {
                    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
                }

                const fileName = `CV_${this.data.name || 'Resume'}.pdf`.replace(/\s+/g, '_');
                pdf.save(fileName);

                btn.textContent = originalText;
                btn.disabled = false;

            } catch (error) {
                console.error('PDF oluşturma hatası:', error);
                alert('PDF oluşturulamadı: ' + error.message);
                btn.textContent = originalText;
                btn.disabled = false;
            }
        }).catch(error => {
            console.error('Kütüphane yükleme hatası:', error);
            alert('PDF kütüphaneleri yüklenemedi. İnternet bağlantısını kontrol edin.');
            btn.textContent = originalText;
            btn.disabled = false;
        });
    }

    renderTabContent() {
        // Data Sanitization to prevent undefined/broken UI
        if (this.data.certificates && Array.isArray(this.data.certificates)) {
            this.data.certificates = this.data.certificates.map(c => (typeof c === 'object' && c) ? { name: c.name || '', issuer: c.issuer || '', date: c.date || '' } : { name: '', issuer: '', date: '' });
        }

        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const txt = isTr ? {
            tabs: { p: 'Kişisel Bilgiler', x: 'Deneyim', e: 'Eğitim', c: 'Sertifikalar', l: 'Diller', s: 'Yetenekler', d: 'Görünüm', v: 'Önizleme' },
            btn: { next: 'Sonraki Adım >', prev: '< Geri', reset: 'Sıfırla', print: 'Yazdır / PDF' },
            lbl: { name: 'Ad Soyad', title: 'Ünvan', mail: 'E-posta', web: 'Website', phone: 'Telefon', addr: 'Adres', photo: 'Profil Fotoğrafı', upload: 'Fotoğraf Yükle', summary: 'Özet / Hakkımda', languages: 'Diller', interests: 'İlgi Alanları', skills: 'Yetenekler' },
            exp: { title: 'İş Deneyimi', add: 'Deneyim Ekle', company: 'Şirket Adı', position: 'Pozisyon', start: 'Başlangıç Tarihi', end: 'Bitiş Tarihi', current: 'Devam Ediyor', desc: 'Açıklama' },
            edu: { title: 'Eğitim', add: 'Eğitim Ekle', school: 'Okul Adı', degree: 'Derece / Bölüm', start: 'Başlangıç Tarihi', end: 'Bitiş Tarihi', current: 'Devam Ediyor', desc: 'Açıklama' },
            certs: { title: 'Sertifikalar', add: 'Sertifika Ekle', name: 'Sertifika Adı', issuer: 'Veren Kurum', date: 'Tarih' },
            design: { title: 'Görünüm Ayarları', color: 'Renk Teması', font: 'Yazı Tipi', template: 'Şablon Seçimi' },
            fonts: { sans: 'Standart', modern: 'Modern', display: 'Zarif', strong: 'Güçlü', serif: 'Serif', condensed: 'Sıkışık', mono: 'Kod', sweet: 'Tatlı (Nunito)' }
        } : {
            tabs: { p: 'Personal Info', x: 'Experience', e: 'Education', c: 'Certificates', l: 'Languages', s: 'Skills', d: 'Design', v: 'Preview' },
            btn: { next: 'Next Step >', prev: '< Back', reset: 'Reset', print: 'Print / PDF' },
            lbl: { name: 'Full Name', title: 'Job Title', mail: 'Email', web: 'Website', phone: 'Phone', addr: 'Address', photo: 'Profile Photo', upload: 'Upload Photo', summary: 'Summary / About Me', languages: 'Languages', interests: 'Interests', skills: 'Skills' },
            exp: { title: 'Work Experience', add: 'Add Experience', company: 'Company Name', position: 'Position', start: 'Start Date', end: 'End Date', current: 'Current', desc: 'Description' },
            edu: { title: 'Education', add: 'Add Education', school: 'School Name', degree: 'Degree / Field of Study', start: 'Start Date', end: 'End Date', current: 'Current', desc: 'Description' },
            certs: { title: 'Certificates', add: 'Add Certificate', name: 'Certificate Name', issuer: 'Issuer', date: 'Date' },
            design: { title: 'Design Settings', color: 'Color Theme', font: 'Font', template: 'Template Selection' },
            fonts: { sans: 'Standard', modern: 'Modern', display: 'Elegant', strong: 'Strong', serif: 'Serif', condensed: 'Condensed', mono: 'Code', sweet: 'Sweet (Nunito)' }
        };

        const renderStickyNav = (isCompact = false, warningBadge = '') => {
            const tabs = ['personal', 'exp', 'edu', 'certs', 'skills', 'preview'];
            const currentIdx = tabs.indexOf(this.currentTab);

            let nextBtn = '';
            if (this.currentTab === 'preview') {
                nextBtn = `<button onclick="window._printPdf(this)" class="btn btn-success btn-sm" style="font-weight: bold; min-width: 110px;">💾 ${txt.btn.print}</button>`;
            } else {
                nextBtn = `<button onclick="window._resNav(1)" class="btn btn-primary btn-sm" style="font-weight: bold; min-width: 100px;">${txt.btn.next}</button>`;
            }

            return `
                <div class="res-sticky-nav ${isCompact ? 'compact' : ''}">
                    ${this.currentTab !== 'personal' ? `<button onclick="window._resNav(-1)" class="btn btn-outline btn-sm" style="min-width: 70px; background: var(--surface);">${txt.btn.prev}</button>` : ''}
                    <button onclick="window._resReset()" class="btn btn-text btn-sm" style="color: #ef4444; opacity: 0.8;">${txt.btn.reset}</button>
                    ${warningBadge ? warningBadge : '<div style="flex:1;"></div>'}
                    ${!warningBadge ? '<div style="flex:1;"></div>' : ''}
                    ${nextBtn}
                </div>
            `;
        };

        const c = document.getElementById('res-content-area');
        c.innerHTML = '';
        const d = this.data;
        const div = document.createElement('div');
        div.className = 'res-fade-in';
        div.style.flex = '1';
        div.style.display = 'flex';
        div.style.flexDirection = 'column';
        div.style.minHeight = '0';
        div.style.width = '100%';
        div.style.height = '100%';

        if (this.currentTab === 'personal') {
            div.innerHTML = `
                ${renderStickyNav()}
                <div class="res-scroll-container">
                    <div class="res-card">
                        <h3 style="margin-bottom: 15px; font-size: 1.15rem;">${txt.tabs.p}</h3>
                        
                        <div class="res-photo-upload" onclick="document.getElementById('res-upl').click()">
                            ${d.photo ? `<img src="${d.photo}">` : '<span style="font-size:2rem;color:#ccc;">📷</span>'}
                            <div class="res-photo-label">${txt.lbl.upload}</div>
                        </div>
                        <input type="file" id="res-upl" hidden accept="image/*">

                        <div class="res-form-grid">
                            <div class="res-full-width">
                                <label class="form-label">${txt.lbl.name}</label>
                                <input type="text" class="form-input" oninput="window._upField('name', this.value)" value="${d.name || ''}" placeholder="${isTr ? 'Adınız Soyadınız' : 'Full Name'}">
                            </div>
                            <div class="res-full-width">
                                <label class="form-label">${txt.lbl.title}</label>
                                <input type="text" class="form-input" oninput="window._upField('title', this.value)" value="${d.title || ''}" placeholder="${isTr ? 'Ünvan (Örn: Web Geliştici)' : 'Job Title'}">
                            </div>
                            <div>
                                <label class="form-label">${txt.lbl.mail}</label>
                                <input type="email" class="form-input" oninput="window._upField('email', this.value)" value="${d.email || ''}">
                            </div>
                            <div>
                                <label class="form-label">Website</label>
                                <input type="text" class="form-input" oninput="window._upField('website', this.value)" value="${d.website || ''}">
                            </div>
                            <div>
                                <label class="form-label">Telefon</label>
                                <input type="text" class="form-input" oninput="window._upField('phone', this.value)" value="${d.phone || ''}">
                            </div>
                            <div>
                                 <label class="form-label">Konum / Adres</label>
                                <input type="text" class="form-input" oninput="window._upField('address', this.value)" value="${d.address || ''}">
                            </div>
                            <div class="res-full-width">
                                <label class="form-label">${txt.lbl.summary}</label>
                                <textarea class="form-input" rows="3" oninput="window._upField('summary', this.value)" style="resize: vertical; min-height: 80px;" placeholder="${isTr ? 'Özet / Hakkımda bilgisi...' : 'Summary / About me...'}">${d.summary || ''}</textarea>
                            </div>
                            <div class="res-full-width">
                                 <label class="form-label">${isTr ? 'Yetenekler & Uzmanlık (React, Node.js...)' : 'Skills & Expertise (React, Node.js...)'}</label>
                                <textarea class="form-input" rows="2" oninput="window._upField('skills', this.value)" style="resize: vertical; min-height: 60px;" placeholder="JavaScript, CSS, SQL...">${d.skills || ''}</textarea>
                            </div>
                        </div>
                    </div>
                    <!-- Dedicated Spacer -->
                    <div style="height: 150px; width: 100%; flex-shrink: 0;"></div>
                </div>
            `;
            c.appendChild(div);

            const upl = document.getElementById('res-upl');
            if (upl) {
                upl.onchange = (e) => {
                    const f = e.target.files[0];
                    if (f) {
                        const r = new FileReader();
                        r.onload = (ye) => { this.data.photo = ye.target.result; this._save(); this.renderTabContent(); };
                        r.readAsDataURL(f);
                    }
                };
            }
        }
        else if (this.currentTab === 'exp') {
            div.innerHTML = `
                ${renderStickyNav()}
                <div class="res-scroll-container">
                    <div class="res-card">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <h3 style="margin: 0; font-size: 1.1rem;">${txt.exp.title}</h3>
                            <button onclick="window._addItem('exp')" class="btn btn-primary" style="padding: 6px 12px; font-size: 0.85rem;">+ ${txt.exp.add}</button>
                        </div>
                        <div class="res-exp-grid">
                            ${d.experience.map((ex, i) => `
                                <div class="res-item-card" style="padding: 10px; border: 1px solid var(--border-color); border-radius: 6px; position: relative; background: rgba(255,255,255,0.02);">
                                    <button onclick="window._removeItem('experience', ${i})" style="position: absolute; top: 6px; right: 6px; background: none; border: none; color: #ef4444; cursor: pointer; padding: 3px; z-index: 10; font-size: 0.9rem;">✕</button>
                                    <div style="display: flex; flex-direction: column; gap: 8px;">
                                        <div>
                                            <label class="form-label" style="font-size: 0.75rem; margin-bottom: 3px;">${txt.exp.company}</label>
                                            <input type="text" class="form-input" style="padding: 6px 8px; font-size: 0.85rem;" oninput="window._upField('experience', this.value, ${i}, 'comp')" value="${ex.comp || ''}" placeholder="Şirket">
                                        </div>
                                        <div>
                                            <label class="form-label" style="font-size: 0.75rem; margin-bottom: 3px;">${txt.exp.position}</label>
                                            <input type="text" class="form-input" style="padding: 6px 8px; font-size: 0.85rem;" oninput="window._upField('experience', this.value, ${i}, 'role')" value="${ex.role || ''}" placeholder="Pozisyon">
                                        </div>
                                        <div>
                                            <label class="form-label" style="font-size: 0.75rem; margin-bottom: 3px;">${txt.exp.start} / ${txt.exp.end}</label>
                                            <input type="text" class="form-input" style="padding: 6px 8px; font-size: 0.85rem;" oninput="window._upField('experience', this.value, ${i}, 'date')" value="${ex.date || ''}" placeholder="2020-2023">
                                        </div>
                                        <div>
                                            <label class="form-label" style="font-size: 0.75rem; margin-bottom: 3px;">${txt.exp.desc}</label>
                                            <textarea class="form-input" rows="2" style="min-height: 50px; resize: vertical; padding: 6px 8px; font-size: 0.85rem;" oninput="window._upField('experience', this.value, ${i}, 'desc')" placeholder="Görevler...">${ex.desc || ''}</textarea>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div style="height: 100px; flex-shrink: 0;"></div>
                </div>
            `;
            c.appendChild(div);
        }
        else if (this.currentTab === 'edu') {
            div.innerHTML = `
                ${renderStickyNav()}
                <div class="res-scroll-container">
                    <div class="res-card">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <h3 style="margin: 0; font-size: 1.1rem;">${txt.edu.title}</h3>
                            <button onclick="window._addItem('edu')" class="btn btn-primary" style="padding: 6px 12px; font-size: 0.85rem;">+ ${txt.edu.add}</button>
                        </div>
                        <div class="res-exp-grid">
                            ${d.education.map((ed, i) => `
                                <div class="res-item-card" style="padding: 10px; border: 1px solid var(--border-color); border-radius: 6px; position: relative; background: rgba(255,255,255,0.02);">
                                    <button onclick="window._removeItem('education', ${i})" style="position: absolute; top: 6px; right: 6px; background: none; border: none; color: #ef4444; cursor: pointer; padding: 3px; z-index: 10; font-size: 0.9rem;">✕</button>
                                    <div style="display: flex; flex-direction: column; gap: 8px;">
                                        <div>
                                            <label class="form-label" style="font-size: 0.75rem; margin-bottom: 3px;">${txt.edu.school}</label>
                                            <input type="text" class="form-input" style="padding: 6px 8px; font-size: 0.85rem;" oninput="window._upField('education', this.value, ${i}, 'sch')" value="${ed.sch || ''}" placeholder="Okul">
                                        </div>
                                        <div>
                                            <label class="form-label" style="font-size: 0.75rem; margin-bottom: 3px;">${txt.edu.degree}</label>
                                            <input type="text" class="form-input" style="padding: 6px 8px; font-size: 0.85rem;" oninput="window._upField('education', this.value, ${i}, 'deg')" value="${ed.deg || ''}" placeholder="Bölüm">
                                        </div>
                                        <div>
                                            <label class="form-label" style="font-size: 0.75rem; margin-bottom: 3px;">${txt.edu.start} / ${txt.edu.end}</label>
                                            <input type="text" class="form-input" style="padding: 6px 8px; font-size: 0.85rem;" oninput="window._upField('education', this.value, ${i}, 'date')" value="${ed.date || ''}" placeholder="2018-2022">
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div style="height: 100px; flex-shrink: 0;"></div>
                </div>
            `;
            c.appendChild(div);
        }
        else if (this.currentTab === 'certs') {
            if (!d.certificates) d.certificates = [];

            div.innerHTML = `
                ${renderStickyNav()}
                <div class="res-scroll-container">
                    <div class="res-card">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <h3 style="margin: 0; font-size: 1.1rem;">${txt.certs.title}</h3>
                            <button onclick="window._addItem('certs')" class="btn btn-primary" style="padding: 6px 12px; font-size: 0.85rem;">+ ${txt.certs.add}</button>
                        </div>
                        <div class="res-exp-grid">
                            ${d.certificates.map((cert, i) => `
                                <div class="res-item-card" style="padding: 10px; border: 1px solid var(--border-color); border-radius: 6px; position: relative; background: rgba(255,255,255,0.02);">
                                    <button onclick="window._removeItem('certificates', ${i})" style="position: absolute; top: 6px; right: 6px; background: none; border: none; color: #ef4444; cursor: pointer; padding: 3px; z-index: 10; font-size: 0.9rem;">✕</button>
                                    <div style="display: flex; flex-direction: column; gap: 8px;">
                                        <div>
                                            <label class="form-label" style="font-size: 0.75rem; margin-bottom: 3px;">${txt.certs.name}</label>
                                            <input type="text" class="form-input" style="padding: 6px 8px; font-size: 0.85rem;" oninput="window._upField('certificates', this.value, ${i}, 'name')" value="${cert.name || ''}" placeholder="${isTr ? 'Yazılım Uzmanı' : 'Software Expert'}">
                                        </div>
                                        <div>
                                            <label class="form-label" style="font-size: 0.75rem; margin-bottom: 3px;">${txt.certs.issuer}</label>
                                            <input type="text" class="form-input" style="padding: 6px 8px; font-size: 0.85rem;" oninput="window._upField('certificates', this.value, ${i}, 'issuer')" value="${cert.issuer || ''}" placeholder="Google">
                                        </div>
                                        <div>
                                            <label class="form-label" style="font-size: 0.75rem; margin-bottom: 3px;">${txt.certs.date}</label>
                                            <input type="text" class="form-input" style="padding: 6px 8px; font-size: 0.85rem;" oninput="window._upField('certificates', this.value, ${i}, 'date')" value="${cert.date || ''}" placeholder="2023">
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div style="height: 100px; flex-shrink: 0;"></div>
                </div>
            `;
            c.appendChild(div);
        }
        else if (this.currentTab === 'skills') {
            div.innerHTML = `
                ${renderStickyNav()}
                <div class="res-scroll-container">
                    <div class="res-card" style="max-width: 700px;">
                        <h3 style="margin-bottom: 5px; font-size: 1.2rem;">${txt.lbl.skills}</h3>
                        <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 20px;">
                            ${isTr ? 'Yeteneklerinizi virgül ile ayırarak yazın.' : 'Write your skills separated by commas.'}
                        </p>
                        <textarea oninput="window._upField('skills', this.value)" class="form-input" style="height: 180px; font-family: var(--font-mono); font-size: 0.9rem;" placeholder="Örn: Java, Python, Takım Çalışması, İngilizce...">${d.skills || ''}</textarea>
                    </div>
                    <div style="height: 120px; flex-shrink: 0;"></div>
                </div>
            `;
            c.appendChild(div);
        }
        else if (this.currentTab === 'languages') {
            div.innerHTML = `
                ${renderStickyNav()}
                <div class="res-scroll-container">
                    <div class="res-card" style="max-width: 700px;">
                        <h3 style="margin-bottom: 5px; font-size: 1.2rem;">${isTr ? 'Konuşulan Diller' : 'Languages'}</h3>
                        <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 20px;">
                            ${isTr ? 'Bildiğiniz dilleri virgül ile ayırarak yazın.' : 'Write languages separated by commas.'}
                        </p>
                        <textarea oninput="window._upField('languages', this.value)" class="form-input" style="height: 180px; font-family: var(--font-mono); font-size: 0.9rem;" placeholder="${isTr ? 'Örn: Türkçe, İngilizce, Almanca...' : 'Ex: English, Spanish, German...'}">${d.languages || ''}</textarea>
                    </div>
                    <div style="height: 120px; flex-shrink: 0;"></div>
                </div>
            `;
            c.appendChild(div);
        }
        else if (this.currentTab === 'design') {
            const themes = [
                { id: 'modern', name: 'Modern' },
                { id: 'nova', name: 'Nova (Modern)' },
                { id: 'orbit', name: 'Orbit (Koyu)' },
                { id: 'bloom', name: 'Bloom (Pastel)' },
                { id: 'wave', name: 'Wave (Dalga)' },
                { id: 'bold', name: 'Bold (Güçlü)' },
                { id: 'prime', name: 'Prime (Kurumsal)' },
                { id: 'elegant', name: 'Elegant (Premium)' },
                { id: 'titan', name: 'Titan (Premium)' },
                { id: 'cyber', name: 'Cyber (Dark)' },
                { id: 'brutal', name: 'Brutal (Bold)' },
                { id: 'executive', name: 'Executive' },
                { id: 'minimal', name: 'Minimal' },
                { id: 'leftside', name: 'Sol Sütun' },
                { id: 'skyline', name: 'Skyline' },
                { id: 'tech', name: 'Teknoloji' },
                { id: 'classic', name: 'Klasik' }
            ];

            div.innerHTML = `
                <div class="res-card">
                    <h3>Görünüm Ayarları</h3>
                    <div class="res-form-grid" style="margin-top:20px;">
                        <div>
                             <label class="form-label">Renk Teması</label>
                             <div style="display:flex; gap:10px; align-items:center;">
                                <input type="color" id="in-color" value="${d.color}" style="height:40px; width:60px;">
                                <span style="font-family:monospace;">${d.color}</span>
                             </div>
                        </div>
                        <div>
                             <label class="form-label">Başlık Yazı Tipi</label>
                             <select class="form-input" id="in-header-font">
                                <option value="sans">Inter (Standart)</option>
                                <option value="modern">Poppins (Modern)</option>
                                <option value="display">Playfair Display (Zarif)</option>
                                <option value="strong">Oswald (Güçlü)</option>
                                <option value="serif">Lora (Serif)</option>
                                <option value="mono">JetBrains Mono (Kod)</option>
                                <option value="condensed">Roboto Condensed (Sıkışık)</option>
                                <option value="sweet">Nunito (Tatlı)</option>
                                <option value="clean">Open Sans (Temiz)</option>
                                <option value="elegant2">Raleway (Zarif 2)</option>
                                <option value="charismatic">Merriweather (Karizmatik)</option>
                                <option value="modern2">Lato (Modern 2)</option>
                             </select>
                        </div>
                        <div style="margin-top: 15px;">
                             <label class="form-label">İçerik Yazı Tipi</label>
                             <select class="form-input" id="in-body-font">
                                <option value="sans">Inter (Standart)</option>
                                <option value="modern">Poppins (Modern)</option>
                                <option value="display">Playfair Display (Zarif)</option>
                                <option value="strong">Oswald (Güçlü)</option>
                                <option value="serif">Lora (Serif)</option>
                                <option value="mono">JetBrains Mono (Kod)</option>
                                <option value="condensed">Roboto Condensed (Sıkışık)</option>
                                <option value="sweet">Nunito (Tatlı)</option>
                                <option value="clean">Open Sans (Temiz)</option>
                                <option value="elegant2">Raleway (Zarif 2)</option>
                                <option value="charismatic">Merriweather (Karizmatik)</option>
                                <option value="modern2">Lato (Modern 2)</option>
                             </select>
                        </div>
                    </div>
                    
                    <h4 style="margin: 20px 0 10px;">Şablon Seçimi</h4>
                    <div class="theme-grid">
                        ${themes.map(t => `
                            <div class="theme-item ${d.theme === t.id ? 'active' : ''}" onclick="window._setTheme('${t.id}')">
                                <div style="font-size:2rem; margin-bottom:5px;">📄</div>
                                <div style="font-size:0.85rem;">${t.name}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                `;
            c.appendChild(div);

            document.getElementById('in-color').oninput = (e) => { d.color = e.target.value; this._save(); };
            const hFontSel = document.getElementById('in-header-font');
            const bFontSel = document.getElementById('in-body-font');
            hFontSel.value = d.headerFont || d.font || 'sans';
            bFontSel.value = d.bodyFont || d.font || 'sans';
            const updateFonts = () => {
                d.headerFont = hFontSel.value;
                d.bodyFont = bFontSel.value;
                this._save();
            };
            hFontSel.onchange = updateFonts;
            bFontSel.onchange = updateFonts;



            // _setTheme is now global in setupListeners
            const thGrid = div.querySelector('.theme-grid'); // localized scope if needed
        }
        else if (this.currentTab === 'preview') {
            // Generate warning for sticky nav
            const currentTheme = d.theme || 'modern';
            const limit = this.THEME_LIMITS[currentTheme] || 99;
            const expCount = d.experience.length;
            const isOverLimit = expCount >= limit;
            const isCritical = expCount > limit;

            let warningBadge = '';
            if (isOverLimit) {
                const warningColor = isCritical ? '#ef4444' : '#f59e0b';
                const warningBg = isCritical ? '#fef2f2' : '#fffbeb';
                const warningIcon = isCritical ? '⚠️' : '💡';
                const warningText = isTr
                    ? `${warningIcon} ${txt.tabs.x}: ${expCount}/${limit}`
                    : `${warningIcon} Exp: ${expCount}/${limit}`;

                warningBadge = `<div style="background: ${warningBg}; border: 1px solid ${warningColor}; border-radius: 4px; padding: 4px 10px; font-size: 0.75rem; color: ${warningColor}; font-weight: 600; white-space: nowrap;">${warningText}</div>`;
            }

            div.innerHTML = `
                <div id="res-preview-wrapper" class="res-fade-in" style="display: flex; flex-direction: column; flex: 1; height: 100%; min-height: 0;">
                    ${renderStickyNav(true, warningBadge)}

            <div id="res-preview-container" style="flex:1; overflow:auto; background:#525659; position:relative; padding: 20px 0;">
                <div id="res-page-wrapper" style="display: flex; justify-content: center; min-height: min-content; width: 100%;">
                    <div id="res-a4-page" class="a4-page" style="width: 794px; height: 1123px; flex-shrink: 0; transform: scale(0.8); transform-origin: top center;"></div>
                </div>
            </div>
        </div>
                `;
            c.appendChild(div);

            // Render HTML using Local Generator
            if (this.generateResumeHTML) {
                const res = this.generateResumeHTML(d);
                const page = document.getElementById('res-a4-page');

                // Inject Style
                let style = document.getElementById('res-style-inj');
                if (!style) { style = document.createElement('style'); style.id = 'res-style-inj'; document.head.appendChild(style); }
                style.textContent = res.css;

                // Optimized Update
                if (page.innerHTML !== res.html) page.innerHTML = res.html;
                this.fitPreview();
            } else {
                document.getElementById('res-a4-page').innerHTML = 'Core module update required.';
            }
        }
    }

    /* -------------------------------------------------------------------------- */
    /*                        CORE RESUME GENERATOR ENGINE                        */
    /* -------------------------------------------------------------------------- */

    generateResumeHTML(data) {
        const t = data.theme || 'modern';
        const cols = this._getThemeColors(t, data.color);
        const fontFam = this._getFontFamily(data.font || data.bodyFont);
        const headFont = this._getFontFamily(data.headerFont || data.font);

        // Core Layout Strategy
        const isSplit = ['modern', 'leftside', 'skyline', 'tech', 'orbit', 'cyber', 'nova', 'bloom', 'wave', 'titan'].includes(t);
        const isDark = ['orbit', 'cyber', 'titan'].includes(t);
        const isExec = t === 'executive';
        const isBrutal = t === 'brutal';

        const css = `
            /* Core Reset */
            .res-container * { box-sizing: border-box; margin: 0; padding: 0; }
            .res-container { 
                position: absolute;
                top: 0; left: 0;
                width: 794px; height: 1123px; 
                margin: 0; padding: 0;
                font-family: ${fontFam}; 
                color: ${isDark ? '#e2e8f0' : '#2d3748'}; 
                background: ${isDark ? '#1a202c' : '#ffffff'};
                line-height: 1.5; 
                overflow: hidden; 
                display: flex; 
                flex-direction: ${isSplit ? 'row' : 'column'};
            }
            
            /* Typography */
            h1, h2, h3, h4, .res-name, .res-title, .res-section-title, .res-item-head { font-family: ${headFont}; }
            .res-item-desc, .res-contact-item, .res-item-sub { font-family: ${fontFam}; }
            
            /* Helper Classes */
            .res-section { margin-bottom: 20px; }
            .res-section-title { 
                font-size: 14px; 
                text-transform: uppercase; 
                font-weight: 800; 
                letter-spacing: 1px; 
                margin-bottom: 15px; 
                padding-bottom: 5px; 
                border-bottom: 2px solid ${cols.accent}; 
                color: ${cols.primary}; 
            }
            .res-item { margin-bottom: 12px; }
            .res-item-head { display: flex; justify-content: space-between; align-items: baseline; font-weight: 700; font-size: 13px; }
            .res-item-sub { font-size: 12px; font-style: italic; opacity: 0.8; margin-bottom: 4px; }
            .res-item-desc { font-size: 11px; white-space: pre-line; opacity: 0.9; }
            .res-contact-item { display: flex; align-items: center; gap: 6px; font-size: 11px; margin-bottom: 4px; }
            
            /* Split Layout Specifics */
            .res-left { 
                width: 33%; 
                height: 100%;
                background: ${isSplit ? cols.bgSide : 'transparent'}; 
                color: ${isSplit ? cols.textSide : 'inherit'}; 
                padding: 40px 30px; 
                flex-shrink: 0;
                display: flex;
                flex-direction: column;
            }
            .res-right { 
                flex: 1; 
                height: 100%;
                padding: 40px; 
                background: ${isDark ? '#1a202c' : '#ffffff'};
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }

            /* Theme Specific Overrides */
            ${this._getThemeCSS(t, cols)}
        `;

        // HTML Construction
        let leftContent = '', rightContent = '';

        /* --- Personal Info Block --- */
        const contactBlock = `
            <div class="res-contact-list">
                ${data.email ? `<div class="res-contact-item">📧 ${data.email}</div>` : ''}
                ${data.phone ? `<div class="res-contact-item">📱 ${data.phone}</div>` : ''}
                ${data.website ? `<div class="res-contact-item">🌐 ${data.website.replace('https://', '')}</div>` : ''}
                ${data.address ? `<div class="res-contact-item">📍 ${data.address}</div>` : ''}
            </div>
        `;

        const photoBlock = data.photo ? `<div class="res-photo"><img src="${data.photo}"></div>` : '';
        const nameBlock = `<div class="res-header">
            <h1 class="res-name">${data.name || 'Your Name'}</h1>
            <div class="res-title">${data.title || 'Job Title'}</div>
        </div>`;

        /* --- Modules --- */
        const skillsBlock = data.skills ? `
            <div class="res-section">
                <div class="res-section-title">Skills</div>
                <div class="res-skills">
                    ${data.skills.split(',').map(s => `<span class="res-skill-tag">${s.trim()}</span>`).join('')}
                </div>
            </div>` : '';

        const expBlock = (data.experience && data.experience.length) ? `
            <div class="res-section">
                <div class="res-section-title">Experience</div>
                ${data.experience.map(e => `
                    <div class="res-item">
                        <div class="res-item-head">
                            <span>${e.role}</span>
                            <span style="opacity:0.7">${e.date}</span>
                        </div>
                        <div class="res-item-sub">${e.comp}</div>
                        <div class="res-item-desc">${e.desc}</div>
                    </div>
                `).join('')}
            </div>` : '';

        const eduBlock = (data.education && data.education.length) ? `
            <div class="res-section">
                <div class="res-section-title">Education</div>
                ${data.education.map(e => `
                    <div class="res-item">
                        <div class="res-item-head">
                            <span>${e.sch}</span>
                            <span style="opacity:0.7">${e.date}</span>
                        </div>
                        <div class="res-item-sub">${e.deg}</div>
                    </div>
                `).join('')}
            </div>` : '';

        const summaryBlock = data.summary ? `
            <div class="res-section">
                 <div class="res-section-title">Summary</div>
                 <div class="res-item-desc" style="font-size:12px;">${data.summary}</div>
            </div>` : '';


        // Distribute Content based on Layout
        if (isSplit) {
            // Sidebar: Photo, Contact, Skills, Languages
            leftContent = `
                ${photoBlock}
                ${contactBlock}
                <div style="margin-top:20px;"></div>
                ${skillsBlock}
                ${data.languages ? `
                    <div class="res-section">
                        <div class="res-section-title">Languages</div>
                        <div class="res-item-desc">${data.languages}</div>
                    </div>` : ''}
            `;
            // Main: Name, Summary, Exp, Edu
            rightContent = `
                ${nameBlock}
                <div style="margin-top:20px;"></div>
                ${summaryBlock}
                ${expBlock}
                ${eduBlock}
                ${data.certificates && data.certificates.length ? `
                    <div class="res-section">
                         <div class="res-section-title">Certificates</div>
                         ${data.certificates.map(c => `<div class="res-item-desc"><b>${c.name}</b> - ${c.issuer} (${c.date})</div>`).join('')}
                    </div>`: ''}
            `;

            return {
                css,
                html: `
                    <div class="res-container ${t}-theme">
                        <div class="res-left">${leftContent}</div>
                        <div class="res-right">${rightContent}</div>
                    </div>
                `
            };
        } else {
            // SINGLE COLUMN LAYOUT (Classic, Minimal, etc)
            return {
                css,
                html: `
                <div class="res-container ${t}-theme">
                    <div class="res-main" style="width:100%;">
                        <div class="res-header" style="display:flex; gap:20px; align-items:center; border-bottom:2px solid ${cols.accent}; padding-bottom:20px; margin-bottom:20px;">
                             ${photoBlock}
                             <div style="flex:1">
                                <h1 class="res-name" style="font-size:28px;">${data.name}</h1>
                                <div class="res-title" style="font-size:16px; margin-bottom:10px;">${data.title}</div>
                                <div class="res-contact-list" style="display:flex; gap:15px; flex-wrap:wrap; font-size:12px;">
                                    ${data.email ? `<span>📧 ${data.email}</span>` : ''}
                                    ${data.phone ? `<span>📱 ${data.phone}</span>` : ''}
                                    ${data.address ? `<span>📍 ${data.address}</span>` : ''}
                                </div>
                             </div>
                        </div>
                        
                        ${summaryBlock}
                        ${expBlock}
                        ${eduBlock}
                        
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                            ${skillsBlock}
                            ${data.languages ? `<div class="res-section"><div class="res-section-title">Languages</div><div class="res-item-desc">${data.languages}</div></div>` : ''}
                        </div>
                    </div>
                </div>`
            };
        }
    }

    _getThemeColors(theme, baseColor) {
        const c = baseColor || '#2d3748';
        switch (theme) {
            case 'modern': return { primary: c, accent: c, bgSide: '#f7fafc', textSide: '#2d3748' };
            case 'nova': return { primary: c, accent: '#cbd5e0', bgSide: '#1a202c', textSide: '#ffffff' };
            case 'orbit': return { primary: '#63b3ed', accent: '#4a5568', bgSide: '#1a202c', textSide: '#e2e8f0' };
            case 'bloom': return { primary: '#6b46c1', accent: '#fbb6ce', bgSide: '#fff5f7', textSide: '#44337a' };
            case 'wave': return { primary: '#3182ce', accent: '#bee3f8', bgSide: '#ebf8ff', textSide: '#2a4365' };
            case 'bold': return { primary: '#000000', accent: c, bgSide: '#ffffff', textSide: '#000000' };
            case 'prime': return { primary: '#2c5282', accent: '#2c5282', bgSide: '#f7fafc', textSide: '#2d3748' };
            case 'elegant': return { primary: '#b794f4', accent: '#b794f4', bgSide: '#faf5ff', textSide: '#553c9a' };
            case 'titan': return { primary: '#f6ad55', accent: '#4a5568', bgSide: '#171923', textSide: '#cbd5e0' };
            case 'cyber': return { primary: '#00ff41', accent: '#003b00', bgSide: '#000000', textSide: '#00ff41' };
            case 'brutal': return { primary: '#000000', accent: '#000000', bgSide: '#ffff00', textSide: '#000000' };
            case 'executive': return { primary: '#1a365d', accent: '#c0c0c0', bgSide: '#ffffff', textSide: '#1a365d' };
            case 'minimal': return { primary: '#000', accent: '#e2e8f0', bgSide: '#fff', textSide: '#000' };
            case 'leftside': return { primary: c, accent: '#e2e8f0', bgSide: c, textSide: '#ffffff' };
            case 'skyline': return { primary: '#2b6cb0', accent: '#cbd5e0', bgSide: '#f7fafc', textSide: '#2d3748' };
            case 'tech': return { primary: '#38b2ac', accent: '#2d3748', bgSide: '#1a202c', textSide: '#e6fffa' };
            default: return { primary: c, accent: c, bgSide: '#f7fafc', textSide: '#333' };
        }
    }

    _getFontFamily(fontKey) {
        const fonts = {
            'sans': "'Inter', sans-serif",
            'modern': "'Poppins', sans-serif",
            'display': "'Playfair Display', serif",
            'strong': "'Oswald', sans-serif",
            'serif': "'Lora', serif",
            'condensed': "'Roboto Condensed', sans-serif",
            'mono': "'JetBrains Mono', monospace",
            'sweet': "'Nunito', sans-serif",
            'clean': "'Open Sans', sans-serif",
            'elegant2': "'Raleway', sans-serif",
            'charismatic': "'Merriweather', serif",
            'modern2': "'Lato', sans-serif"
        };
        return fonts[fontKey] || fonts['sans'];
    }

    _getThemeCSS(theme, cols) {
        let css = `
            .res-photo { width: 100px; height: 100px; border-radius: 8px; overflow: hidden; margin-bottom: 20px; }
            .res-photo img { width: 100%; height: 100%; object-fit: cover; }
            .res-skill-tag { display: inline-block; background: #edf2f7; color: #4a5568; padding: 4px 10px; border-radius: 4px; margin: 0 4px 4px 0; font-size: 11px; font-weight:600; }
            .res-section-title { color: ${cols.primary}; border-bottom-color: ${cols.accent}; }
            .res-name { color: ${cols.primary}; }
        `;

        if (theme === 'modern') {
            css += `
                .res-name { font-size: 36px; font-weight: 800; text-transform:uppercase; line-height: 1; margin-bottom: 5px; }
                .res-title { font-size: 14px; text-transform: uppercase; letter-spacing: 2px; font-weight: 600; opacity: 0.8; }
                .res-right { border-left: 1px solid #edf2f7; }
            `;
        } else if (theme === 'skyline') {
            css += `
                .res-name { font-size: 32px; font-weight: 300; letter-spacing: 4px; text-transform: uppercase; }
                .res-title { border-top: 1px solid ${cols.accent}; padding-top: 5px; font-size: 12px; letter-spacing: 5px; }
                .res-section-title { border-bottom: 4px solid ${cols.accent}; width: fit-content; }
            `;
        } else if (theme === 'tech') {
            css += `
                .res-container { background: #0f172a; color: #94a3b8; }
                .res-name { color: ${cols.primary}; font-family: 'JetBrains Mono', monospace; font-size: 28px; }
                .res-section-title { font-family: 'JetBrains Mono', monospace; border-left: 4px solid ${cols.primary}; border-bottom: none; padding-left: 10px; }
                .res-skill-tag { background: #1e293b; color: ${cols.primary}; border: 1px solid ${cols.primary}33; }
            `;
        } else if (theme === 'leftside' || theme === 'nova') {
            css += `
                .res-left { background: ${cols.bgSide} !important; color: ${cols.textSide} !important; }
                .res-left .res-section-title { color: ${cols.textSide}; border-color: rgba(255,255,255,0.3); }
                .res-photo { width: 120px; height: 120px; border-radius: 50%; border: 3px solid rgba(255,255,255,0.2); margin: 0 auto 20px; }
                .res-name { font-size: 28px; font-weight: 800; }
                .res-skill-tag { background: rgba(255,255,255,0.15); color: ${cols.textSide}; }
            `;
        } else if (theme === 'orbit' || theme === 'cyber') {
            css += `
                .res-container { background: #000; color: ${cols.primary}; }
                .res-section-title { border-color: ${cols.primary}; color: ${cols.primary}; }
                .res-name { font-size: 36px; font-weight: 900; color: ${cols.primary}; text-shadow: 0 0 10px ${cols.primary}44; }
                .res-skill-tag { background: ${cols.accent}; color: ${cols.primary}; border: 1px solid ${cols.primary}44; }
            `;
        } else if (theme === 'bloom' || theme === 'wave') {
            css += `
                .res-container { background: ${cols.bgSide}; }
                .res-section-title { border-radius: 20px; background: ${cols.accent}; border: none; padding: 5px 15px; color: ${cols.primary}; }
                .res-photo { border-radius: 20px; }
            `;
        } else if (theme === 'bold') {
            css += `
                .res-name { font-size: 48px; font-weight: 900; line-height: 0.9; margin-bottom: 10px; }
                .res-title { background: ${cols.primary}; color: white; padding: 4px 10px; display: inline-block; }
                .res-section-title { border-bottom: 8px solid ${cols.primary}; font-size: 18px; }
            `;
        } else if (theme === 'prime') {
            css += `
                .res-header { border-left: 10px solid ${cols.primary}; padding-left: 20px; }
                .res-section-title { background: #f8fafc; border-left: 5px solid ${cols.primary}; border-bottom: none; padding: 8px 12px; }
            `;
        } else if (theme === 'elegant') {
            css += `
                .res-main { padding: 60px; }
                .res-name { font-style: italic; font-size: 34px; border-bottom: 1px solid ${cols.accent}; padding-bottom: 10px; display: block; width: 100%; }
                .res-section-title { text-align: center; border-bottom: none; }
                .res-section-title::after { content: ''; display: block; width: 40px; height: 2px; background: ${cols.accent}; margin: 5px auto; }
            `;
        } else if (theme === 'brutal') {
            css += `
                .res-container { background: #fff; border: 4px solid #000; }
                .res-section-title { background: #ffff00; border: 3px solid #000; color: #000; padding: 5px 10px; transform: rotate(-1deg); width: fit-content; }
                .res-item { border-left: 5px solid #000; padding-left: 10px; }
                .res-name { font-size: 40px; font-weight: 900; text-transform: uppercase; -webkit-text-stroke: 1px #000; color: #000; }
            `;
        } else if (theme === 'executive') {
            css += `
                .res-main { padding: 40px; }
                .res-header { text-align: center; border-bottom: 4px double ${cols.primary}; padding-bottom: 20px; margin-bottom: 30px; }
                .res-name { font-size: 32px; font-weight: 700; color: ${cols.primary}; }
                .res-section-title { border-bottom: 1px solid ${cols.primary}; text-align: center; width: 60%; margin: 6px auto 20px; }
            `;
        } else if (theme === 'minimal') {
            css += `
                .res-main { padding: 50px; }
                .res-section-title { border-bottom: 1px solid #eee; font-weight: 400; color: #999; }
                .res-name { font-weight: 400; font-size: 24px; color: #000; }
                .res-skill-tag { background: none; border: 1px solid #eee; color: #666; }
            `;
        }

        return css;
    }

    _renderList(container, type) {
        const listDiv = container.querySelector(`#list-${type}`);
        const list = type === 'exp' ? this.data.experience : this.data.education;

        listDiv.innerHTML = list.map((it, i) => `
                < div class="res-card" style = "margin-bottom: 15px; position:relative; padding: 15px;" >
                <button onclick="window._delItem('${type}', ${i})" style="position:absolute; top:10px; right:10px; background:none; border:none; color:red; cursor:pointer;">🗑️</button>
                <div class="res-form-grid">
                    ${type === 'exp' ? `
                        <div class="res-full-width"><input class="form-input" placeholder="Rol / Pozisyon" value="${it.role}" oninput="window._upItem('${type}', ${i}, 'role', this.value)"></div>
                        <div><input class="form-input" placeholder="Şirket" value="${it.comp}" oninput="window._upItem('${type}', ${i}, 'comp', this.value)"></div>
                    ` : `
                        <div class="res-full-width"><input class="form-input" placeholder="Derece / Bölüm" value="${it.deg}" oninput="window._upItem('${type}', ${i}, 'deg', this.value)"></div>
                        <div><input class="form-input" placeholder="Okul" value="${it.sch}" oninput="window._upItem('${type}', ${i}, 'sch', this.value)"></div>
                    `}
                    <div><input class="form-input" placeholder="Tarih Aralığı" value="${it.date}" oninput="window._upItem('${type}', ${i}, 'date', this.value)"></div>
                    ${type === 'exp' ? `<div class="res-full-width"><textarea class="form-input" placeholder="Açıklama" rows="2" oninput="window._upItem('${type}', ${i}, 'desc', this.value)">${it.desc}</textarea></div>` : ''}
                </div>
            </div >
                `).join('');

    }

    onClose() {
        const ws = document.querySelector('.workspace-content');
        if (ws) {
            ws.classList.remove('full-width-workspace');
            ws.style.padding = this._origWsPadding || ''; // Restore original padding
        }

        // Restore header styles
        const header = document.querySelector('.workspace-header');
        if (header) {
            header.style.display = this._origHeaderDisplay || '';
            header.style.cssText = '';
        }

        const title = document.querySelector('.workspace-header .workspace-title');
        if (title) title.style.cssText = '';

        // CLEANUP: Remove injected styles to prevent conflicts
        const style = document.getElementById('res-style-inj');
        if (style) style.remove();

        // CLEANUP: Remove global handlers to prevent memory leaks and double-firing
        [
            '_resTab', '_resNav', '_resReset', '_setTheme',
            '_printPdf', '_setFont', '_setColor', '_addItem',
            '_removeItem', '_upField', '_delItem', '_upItem'
        ].forEach(fn => {
            if (window[fn]) delete window[fn];
        });
    }

    fitPreview() {
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const container = document.getElementById('res-preview-container');
        const page = document.getElementById('res-a4-page');
        if (!container || !page) return;

        const contW = container.clientWidth - 40; // Subtract padding room
        const pageW = 794;
        const pageH = 1123;

        if (this.zoom === 'fit') {
            // Restore generous scaling logic to prevent the "tiny" view
            const wScale = contW / pageW;
            // Use a higher multiplier for available height to avoid excessive shrinking
            this.scaleValue = Math.min(wScale, 0.98);

            // If height is really a problem, allow it to scroll rather than making it unreadable
            if (pageH * this.scaleValue > container.clientHeight - 20) {
                // But don't let it be taller than the view area if we can avoid it
                const hScale = (container.clientHeight - 40) / pageH;
                this.scaleValue = Math.max(hScale, this.scaleValue * 0.85);
            }
        }

        // Use 'zoom' property for better sharpness in Chrome/Edge. Fallback to transform if needed.
        if ('zoom' in page.style) {
            page.style.zoom = this.scaleValue;
            page.style.transform = 'none';
        } else {
            page.style.transform = `scale(${this.scaleValue})`;
        }

        // Ensure wrapper height accounts for the scaled content to allow proper scrolling
        const wrapper = document.getElementById('res-page-wrapper');
        if (wrapper) {
            const scaledH = pageH * this.scaleValue;
            wrapper.style.height = `${scaledH + 80} px`; // page height + padding
        }

        const lbl = document.getElementById('z-val');
        if (lbl) lbl.textContent = this.zoom === 'fit' ? (isTr ? 'SIĞDI' : 'FIT') : Math.round(this.scaleValue * 100) + '%';
    }

    _save() { localStorage.setItem('dt_resume_v2', JSON.stringify(this.data)); }
    _load() {
        const s = localStorage.getItem('dt_resume_v2');
        if (!s) return null;
        try {
            const data = JSON.parse(s);
            // Auto-migrate legacy randomuser images to new local default
            if (data.photo && data.photo.includes('randomuser.me')) {
                data.photo = 'assets/default-avatar.png';
            }
            return data;
        } catch (e) {
            return null;
        }
    }
    _getDefaults() {
        // Check language for localized sample data
        const isTr = typeof window !== 'undefined' && window.i18n && window.i18n.getCurrentLanguage() === 'tr';

        return {
            name: isTr ? 'Demir Yılmaz' : 'Alex Morgan',
            title: isTr ? 'Kıdemli Yazılım Mimarı' : 'Senior Software Architect',
            email: 'hello@example.com',
            website: 'linkedin.com/in/demo',
            phone: '+90 555 012 34 56',
            address: isTr ? 'İstanbul, Türkiye' : 'San Francisco, CA',
            summary: isTr ? 'Yenilikçi ve çözüm odaklı yaklaşımım ile projelerinize değer katmayı hedefleyen, takım çalışmasına yatkın ve sürekli öğrenmeye açık bir profesyonelim.' : 'Innovative and solution-oriented professional aiming to add value to your projects with a focus on continuous learning and teamwork.',
            photo: 'assets/default-avatar.png', // Default local avatar
            skills: 'JavaScript, React.js, Node.js, Python, Docker, AWS, UI/UX Design, TypeScript, Agile',
            theme: 'modern',
            font: 'sans',
            color: '#2d3748',
            experience: [
                {
                    role: isTr ? 'Kıdemli Takım Lideri' : 'Senior Team Lead',
                    comp: 'TechGlobal Systems',
                    date: '2021 - Günümüz',
                    desc: isTr ? '• Dağıtık sistemlerin mimari tasarımı ve ölçeklendirilmesi.\n• 15 kişilik yazılım ekibinin yönetimi ve mentorluğu.\n• CI/CD süreçlerinin optimizasyonu ile deploy süresinin %40 azaltılması.'
                        : '• Architectural design and scaling of distributed systems.\n• Management and mentorship of a 15-person software team.\n• Optimization of CI/CD processes reducing deploy time by 40%.'
                },
                {
                    role: isTr ? 'Full Stack Geliştirici' : 'Full Stack Developer',
                    comp: 'Innova Startups',
                    date: '2018 - 2021',
                    desc: isTr ? '• Modern web teknolojileri ile SaaS ürün geliştirme.\n• RESTful API tasarımı ve mikroservis entegrasyonları.\n• Kullanıcı deneyimini (UX) artırmaya yönelik performans iyileştirmeleri.'
                        : '• SaaS product development with modern web technologies.\n• RESTful API design and microservices integration.\n• Performance improvements focused on enhancing user experience (UX).'
                }
            ],
            education: [
                {
                    sch: isTr ? 'Orta Doğu Teknik Üniversitesi' : 'Stanford University',
                    deg: isTr ? 'Bilgisayar Mühendisliği, B.S.' : 'B.S. Computer Science',
                    date: '2014 - 2018'
                }
            ],
            languages: isTr ? 'Türkçe (Anadil), İngilizce (C1), Almanca (B1)' : 'English (Native), Spanish (C1), German (B1)',
            interests: isTr ? 'Fotoğrafçılık, Açık Kaynak, Seyahat, Gitar' : 'Photography, Open Source, Travel, Guitar'
        };
    }
}

window.initResumeBuilderLogic = ResumeBuilderTool;
