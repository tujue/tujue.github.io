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
    }

    renderUI() {
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const txt = isTr ? {
            tabs: { p: 'Kişisel Bilgiler', x: 'Deneyim', e: 'Eğitim', s: 'Yetenekler', d: 'Tasarım', v: 'Önizleme' },
            lbl: { name: 'Ad Soyad', title: 'Ünvan', mail: 'E-posta', web: 'Website', phone: 'Telefon', addr: 'Adres', photo: 'Profil Fotoğrafı', upload: 'Fotoğraf Yükle' },
            btn: { next: 'Sonraki Adım >', prev: '< Geri', print: 'Yazdır / PDF', reset: 'Sıfırla' },
            fonts: { sans: 'Standart', modern: 'Modern', display: 'Zarif', strong: 'Güçlü', serif: 'Serif', condensed: 'Sıkışık', mono: 'Kod' },
            themes: { modern: 'Modern', nova: 'Nova (Modern)', orbit: 'Orbit (Koyu)', bloom: 'Bloom (Pastel)', wave: 'Wave (Dalga)', bold: 'Bold (Güçlü)', prime: 'Prime (Kurumsal)', elegant: 'Elegant (Yeni)', titan: 'Titan (Yeni)', cyber: 'Cyber (Yeni)', brutal: 'Brutal (Yeni)', executive: 'Yönetici', minimal: 'Minimal', leftside: 'Sol Sütun', skyline: 'Skyline', tech: 'Teknoloji' }
        } : {
            tabs: { p: 'Personal Info', x: 'Experience', e: 'Education', s: 'Skills', d: 'Design', v: 'Preview' },
            lbl: { name: 'Full Name', title: 'Job Title', mail: 'Email', web: 'Website', phone: 'Phone', addr: 'Address', photo: 'Profile Photo', upload: 'Upload Photo' },
            btn: { next: 'Next Step >', prev: '< Back', print: 'Print / PDF', reset: 'Reset' },
            fonts: { sans: 'Standard', modern: 'Modern', display: 'Elegant', strong: 'Strong', serif: 'Serif', condensed: 'Condensed', mono: 'Code' },
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
                    ${tabs.map(t => `
                        <div class="res-step ${this.currentTab === t.id ? 'active' : ''}" onclick="window._resTab('${t.id}')">
                            <span class="step-icon">${t.icon}</span>
                            <span class="step-label">${t.label}</span>
                        </div>
                    `).join('')}
                </div>
                
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="position: relative; width: 34px; height: 34px; overflow: hidden; border-radius: 8px; border: 1px solid var(--border-color); cursor: pointer; display: flex; align-items: center; justify-content: center; background: var(--bg-primary);" title="${isTr ? 'Renk Teması' : 'Color Theme'}">
                        <input type="color" oninput="window._setColor(this.value)" value="${this.data.color}" style="width: 150%; height: 150%; padding: 0; margin: 0; cursor: pointer; border: none; background: none;">
                    </div>
                    <select onchange="window._setFont(this.value)" style="padding: 6px 10px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); cursor: pointer; font-size: 0.8rem; outline: none;" title="${isTr ? 'Yazı Tipi' : 'Font'}">
                        <option value="" disabled selected>🔤 ${isTr ? 'Yazı Tipi' : 'Font'}</option>
                        ${Object.keys(txt.fonts).map(key => `<option value="${key}" ${this.data.font === key ? 'selected' : ''}>${txt.fonts[key]}</option>`).join('')}
                    </select>
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

            <!-- Wizard Footer -->
            <div class="res-wizard-footer">
                <button id="res-btn-prev" class="btn btn-outline" style="min-width: 80px; padding: 4px 10px; font-size: 0.9rem;">${txt.btn.prev}</button>
                <button id="res-btn-reset" class="btn btn-text" style="color: #ef4444; padding: 4px 10px; font-size: 0.9rem;">${txt.btn.reset}</button>
                <div style="flex:1;"></div>
                <button id="res-btn-next" class="btn btn-primary" style="min-width: 100px; font-weight: bold; padding: 4px 15px; font-size: 0.9rem;">${txt.btn.next}</button>
            </div>

            <style>
                .res-wizard-nav { display: flex; background: var(--surface); border-bottom: 1px solid var(--border-color); padding: 0 10px; gap: 15px; overflow-x: auto; flex-shrink: 0; min-height: 45px; align-items: center; }
                .res-step { padding: 8px 5px; cursor: pointer; border-bottom: 3px solid transparent; opacity: 0.6; display: flex; align-items: center; gap: 6px; white-space: nowrap; transition: 0.2s; font-size: 0.9rem; }
                .res-step:hover { opacity: 1; background: rgba(0,0,0,0.02); }
                .res-step.active { border-bottom-color: var(--primary); opacity: 1; color: var(--primary); font-weight: 600; }
                .step-icon { font-size: 1.2rem; }
                
                .res-wizard-content { flex: 1; overflow-y: auto !important; position: relative; padding: 40px 0; width: 100%; scroll-behavior: smooth; }
                .res-wizard-footer { padding: 5px 15px; background: var(--surface); border-top: 1px solid var(--border-color); display: none; gap: 10px; align-items: center; flex-shrink: 0; min-height: 45px; transition: 0.2s; }
                .res-wizard-footer.active { display: flex !important; }
                
                .res-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                .res-full-width { grid-column: span 2; }
                .res-card { background: var(--surface); border: 1px solid var(--border-color); border-radius: 16px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); width: 100%; max-width: 900px; margin: 30px auto; }
                
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
        window._printPdf = () => {
            const nextBtn = document.createElement('button'); // Temp button for context
            this._runPdfExport(nextBtn);
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
            if (type === 'exp') this.data.experience.push(this._getDefaultExperience());
            else if (type === 'edu') this.data.education.push(this._getDefaultEducation());
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
                this.data[field][index][subField] = value;
            } else if (index !== null) {
                this.data[field][index] = value;
            } else {
                this.data[field] = value;
            }
            this._save();
        };

        this.renderTabContent();
    }

    navigate(dir) {
        const tabs = ['personal', 'exp', 'edu', 'skills', 'preview']; // 'design' tab is now integrated into the nav bar
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

        // Toggle global footer - only show in preview
        const footer = document.querySelector('.res-wizard-footer');
        if (footer) {
            if (this.currentTab === 'preview') footer.classList.add('active');
            else footer.classList.remove('active');
        }
    }

    _runPdfExport(btn) {
        const originalText = btn.textContent;
        btn.textContent = 'PDF Oluşturuluyor...';
        btn.disabled = true;

        const page = document.getElementById('res-a4-page');
        if (!page) {
            console.error('A4 page not found for PDF export.');
            btn.textContent = originalText;
            btn.disabled = false;
            return;
        }

        // Temporarily remove zoom for accurate PDF generation
        const originalTransform = page.style.transform;
        page.style.transform = 'scale(1)';
        page.style.boxShadow = 'none'; // Remove shadow for PDF

        // Use html2canvas and jspdf to generate PDF
        import('html2canvas').then(html2canvasModule => {
            const html2canvas = html2canvasModule.default;
            return html2canvas(page, {
                scale: 2, // Higher scale for better quality
                useCORS: true, // Enable CORS for images
                allowTaint: true // Allow tainting canvas
            });
        }).then(canvas => {
            page.style.transform = originalTransform; // Restore original transform
            page.style.boxShadow = ''; // Restore shadow

            const imgData = canvas.toDataURL('image/png');
            const pdf = new window.jspdf.jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [page.offsetWidth, page.offsetHeight]
            });
            pdf.addImage(imgData, 'PNG', 0, 0, page.offsetWidth, page.offsetHeight);
            pdf.save('resume.pdf');

            btn.textContent = originalText;
            btn.disabled = false;
        }).catch(error => {
            console.error('Error generating PDF:', error);
            btn.textContent = originalText;
            btn.disabled = false;
            page.style.transform = originalTransform; // Restore original transform
            page.style.boxShadow = ''; // Restore shadow
            alert('PDF oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
        });
    }

    renderTabContent() {
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const txt = isTr ? {
            tabs: { p: 'Kişisel Bilgiler', x: 'Deneyim', e: 'Eğitim', s: 'Yetenekler', d: 'Tasarım', v: 'Önizleme' },
            btn: { next: 'Sonraki Adım >', prev: '< Geri', reset: 'Sıfırla', print: 'Yazdır / PDF' },
            lbl: { name: 'Ad Soyad', title: 'Ünvan', mail: 'E-posta', web: 'Website', phone: 'Telefon', addr: 'Adres', photo: 'Profil Fotoğrafı', upload: 'Fotoğraf Yükle', summary: 'Özet / Hakkımda', languages: 'Diller', interests: 'İlgi Alanları', skills: 'Yetenekler' },
            exp: { title: 'İş Deneyimi', add: 'Deneyim Ekle', company: 'Şirket Adı', position: 'Pozisyon', start: 'Başlangıç Tarihi', end: 'Bitiş Tarihi', current: 'Devam Ediyor', desc: 'Açıklama' },
            edu: { title: 'Eğitim', add: 'Eğitim Ekle', school: 'Okul Adı', degree: 'Derece / Bölüm', start: 'Başlangıç Tarihi', end: 'Bitiş Tarihi', current: 'Devam Ediyor', desc: 'Açıklama' },
            design: { title: 'Görünüm Ayarları', color: 'Renk Teması', font: 'Yazı Tipi', template: 'Şablon Seçimi' }
        } : {
            tabs: { p: 'Personal Info', x: 'Experience', e: 'Education', s: 'Skills', d: 'Design', v: 'Preview' },
            btn: { next: 'Next Step >', prev: '< Back', reset: 'Reset', print: 'Print / PDF' },
            lbl: { name: 'Full Name', title: 'Job Title', mail: 'Email', web: 'Website', phone: 'Phone', addr: 'Address', photo: 'Profile Photo', upload: 'Upload Photo', summary: 'Summary / About Me', languages: 'Languages', interests: 'Interests', skills: 'Skills' },
            exp: { title: 'Work Experience', add: 'Add Experience', company: 'Company Name', position: 'Position', start: 'Start Date', end: 'End Date', current: 'Current', desc: 'Description' },
            edu: { title: 'Education', add: 'Add Education', school: 'School Name', degree: 'Degree / Field of Study', start: 'Start Date', end: 'End Date', current: 'Current', desc: 'Description' },
            design: { title: 'Design Settings', color: 'Color Theme', font: 'Font', template: 'Template Selection' }
        };

        const renderFormButtons = () => {
            const tabs = ['personal', 'exp', 'edu', 'skills', 'preview'];
            const currentIdx = tabs.indexOf(this.currentTab);
            const isLastTab = currentIdx === tabs.length - 1;

            let nextButtonContent = '';
            if (this.currentTab === 'preview') {
                nextButtonContent = `<button onclick="window._printPdf()" class="btn btn-success" style="min-width: 120px; font-weight: bold; padding: 8px 20px; font-size: 0.9rem;">${txt.btn.print}</button>`;
            } else {
                nextButtonContent = `<button onclick="window._resNav(1)" class="btn btn-primary" style="min-width: 120px; font-weight: bold; padding: 8px 20px; font-size: 0.9rem;">${txt.btn.next}</button>`;
            }

            return `
                <div style="display: flex; gap: 15px; margin-top: 35px; padding-top: 25px; border-top: 1px solid var(--border-color); align-items: center; width: 100%;">
                    ${this.currentTab !== 'personal' ? `<button onclick="window._resNav(-1)" class="btn btn-outline" style="min-width: 90px; padding: 7px 15px; font-size: 0.85rem;">${txt.btn.prev}</button>` : ''}
                    <button onclick="window._resReset()" class="btn btn-text" style="color: #ef4444; padding: 7px 15px; font-size: 0.85rem;">${txt.btn.reset}</button>
                    <div style="flex:1;"></div>
                    ${nextButtonContent}
                </div>
            `;
        };

        const c = document.getElementById('res-content-area');
        c.innerHTML = '';
        const d = this.data;
        const div = document.createElement('div');
        div.className = 'res-fade-in';
        div.style.height = '100%';
        div.style.overflowY = 'auto'; // allow scroll within content

        if (this.currentTab === 'personal') {
            div.innerHTML = `
                <div class="res-card" style="max-width: 600px; margin: 0 auto;">
                    <h3 style="margin-bottom: 20px;">${txt.tabs.p}</h3>
                    
                    <div class="res-photo-upload" onclick="document.getElementById('res-upl').click()">
                        ${d.photo ? `<img src="${d.photo}">` : '<span style="font-size:2rem;color:#ccc;">📷</span>'}
                        <div class="res-photo-label">${txt.lbl.upload}</div>
                    </div>
                    <input type="file" id="res-upl" hidden accept="image/*">

                    <div class="res-form-grid">
                        <div class="res-full-width">
                            <label class="form-label">${txt.lbl.name}</label>
                            <input type="text" class="form-input" id="in-name" value="${d.name}">
                        </div>
                        <div class="res-full-width">
                            <label class="form-label">${txt.lbl.title}</label>
                            <input type="text" class="form-input" id="in-title" value="${d.title}">
                        </div>
                    </div>

                    <div style="margin-top: 1rem;">
                        <label class="form-label">${txt.lbl.summary}</label>
                        <textarea class="form-input" id="in-summary" rows="3" placeholder="${isTr ? 'Kendinizi kısaca tanıtın...' : 'Briefly introduce yourself...'}">${d.summary || ''}</textarea>
                    </div>
                    
                    <div class="grid-layout" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 1rem;">
                        <div>
                            <label class="form-label">${txt.lbl.mail}</label>
                            <input type="email" class="form-input" id="in-email" value="${d.email}">
                        </div>
                        <div>
                            <label class="form-label">Website / LinkedIn</label>
                            <input type="text" class="form-input" id="in-web" value="${d.website}">
                        </div>
                        <div>
                            <label class="form-label">Telefon</label>
                            <input type="text" class="form-input" id="in-phone" value="${d.phone || ''}">
                        </div>
                        <div>
                             <label class="form-label">Adres / Konum</label>
                            <input type="text" class="form-input" id="in-addr" value="${d.address || ''}">
                        </div>
                    </div>



                    <div class="grid-layout" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 1rem;">
                        <div>
                            <label class="form-label">Diller</label>
                            <textarea class="form-input" id="in-languages" rows="2" placeholder="Türkçe (Anadil), İngilizce (C1)...">${d.languages || ''}</textarea>
                        </div>
                        <div>
                            <label class="form-label">İlgi Alanları</label>
                            <textarea class="form-input" id="in-interests" rows="2" placeholder="Fotoğrafçılık, Satranç...">${d.interests || ''}</textarea>
                        </div>
                    </div>

                    ${renderFormButtons()}
                </div>
            `;
            c.appendChild(div);

            // Bindings
            const ids = ['name', 'title', 'summary', 'email', 'web', 'phone', 'addr', 'languages', 'interests'];
            ids.forEach(id => {
                const el = document.getElementById(`in-${id}`);
                el.oninput = () => {
                    if (id === 'web') d.website = el.value;
                    else if (id === 'addr') d.address = el.value;
                    else d[id] = el.value;
                    this._save();
                };
            });

            document.getElementById('res-upl').onchange = (e) => {
                const f = e.target.files[0];
                if (f) {
                    const r = new FileReader();
                    r.onload = (ye) => { d.photo = ye.target.result; this._save(); this.renderTabContent(); };
                    r.readAsDataURL(f);
                }
            };
        }
        else if (this.currentTab === 'exp') {
            div.innerHTML = `
                <div class="res-card">
                    <h3 style="margin-bottom: 20px;">${txt.exp.title}</h3>
                    <div id="exp-list">
                        ${d.experience.map((ex, i) => `
                            <div class="res-item-card" style="margin-bottom: 20px; padding: 15px; border: 1px solid var(--border-color); border-radius: 8px; position: relative;">
                                <button onclick="window._removeItem('experience', ${i})" style="position: absolute; top: 10px; right: 10px; background: none; border: none; color: #ef4444; cursor: pointer;">✕</button>
                                <div class="grid-layout" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                                    <div>
                                        <label class="form-label">${txt.exp.company}</label>
                                        <input type="text" class="form-input" oninput="window._upField('experience', this.value, ${i}, 'comp')" value="${ex.comp}">
                                    </div>
                                    <div>
                                        <label class="form-label">${txt.exp.position}</label>
                                        <input type="text" class="form-input" oninput="window._upField('experience', this.value, ${i}, 'role')" value="${ex.role}">
                                    </div>
                                    <div>
                                        <label class="form-label">${txt.exp.start} / ${txt.exp.end}</label>
                                        <input type="text" class="form-input" oninput="window._upField('experience', this.value, ${i}, 'date')" value="${ex.date}">
                                    </div>
                                    <div class="res-full-width">
                                        <label class="form-label">${txt.exp.desc}</label>
                                        <textarea class="form-input" rows="3" oninput="window._upField('experience', this.value, ${i}, 'desc')">${ex.desc}</textarea>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                        <button onclick="window._addItem('exp')" class="btn btn-outline" style="width: 100%; border-style: dashed; margin-top: 10px;">+ ${txt.exp.add}</button>
                    </div>
                    ${renderFormButtons()}
                </div>
            `;
            c.appendChild(div);
        }
        else if (this.currentTab === 'edu') {
            div.innerHTML = `
                <div class="res-card">
                    <h3 style="margin-bottom: 20px;">${txt.edu.title}</h3>
                    <div id="edu-list">
                        ${d.education.map((ed, i) => `
                            <div class="res-item-card" style="margin-bottom: 20px; padding: 15px; border: 1px solid var(--border-color); border-radius: 8px; position: relative;">
                                <button onclick="window._removeItem('education', ${i})" style="position: absolute; top: 10px; right: 10px; background: none; border: none; color: #ef4444; cursor: pointer;">✕</button>
                                <div class="grid-layout" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                                    <div>
                                        <label class="form-label">${txt.edu.school}</label>
                                        <input type="text" class="form-input" oninput="window._upField('education', this.value, ${i}, 'sch')" value="${ed.sch}">
                                    </div>
                                    <div>
                                        <label class="form-label">${txt.edu.degree}</label>
                                        <input type="text" class="form-input" oninput="window._upField('education', this.value, ${i}, 'deg')" value="${ed.deg}">
                                    </div>
                                    <div class="res-full-width">
                                        <label class="form-label">${txt.edu.start} / ${txt.edu.end}</label>
                                        <input type="text" class="form-input" oninput="window._upField('education', this.value, ${i}, 'date')" value="${ed.date}">
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                        <button onclick="window._addItem('edu')" class="btn btn-outline" style="width: 100%; border-style: dashed; margin-top: 10px;">+ ${txt.edu.add}</button>
                    </div>
                    ${renderFormButtons()}
                </div>
            `;
            c.appendChild(div);
        }
        else if (this.currentTab === 'skills') {
            div.innerHTML = `
                 <div class="res-card" style="max-width: 700px; margin: 0 auto;">
                    <h3 style="margin-bottom: 5px;">${txt.lbl.skills}</h3>
                    <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 20px;">
                        ${isTr ? 'Yeteneklerinizi virgül ile ayırarak yazın.' : 'Write your skills separated by commas.'}
                    </p>
                    <textarea oninput="window._upField('skills', this.value)" class="form-input" style="height: 150px; font-family: var(--font-mono); font-size: 0.9rem;" placeholder="Örn: Java, Python, Takım Çalışması, İngilizce...">${d.skills || ''}</textarea>
                    ${renderFormButtons()}
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
                             <label class="form-label">Yazı Tipi</label>
                             <select class="form-input" id="in-font">
                                <option value="sans">Inter (Standart)</option>
                                <option value="modern">Poppins (Modern)</option>
                                <option value="display">Playfair Display (Zarif)</option>
                                <option value="strong">Oswald (Güçlü)</option>
                                <option value="serif">Lora (Okunaklı)</option>
                                <option value="condensed">Condensed (Sıkışık)</option>
                                <option value="mono">Monospace (Kod)</option>
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
            const fontSel = document.getElementById('in-font');
            fontSel.value = d.font || 'sans';
            fontSel.onchange = () => { d.font = fontSel.value; this._save(); };

            fontSel.onchange = () => { d.font = fontSel.value; this._save(); };

            // _setTheme is now global in setupListeners
            const thGrid = div.querySelector('.theme-grid'); // localized scope if needed
        }
        else if (this.currentTab === 'preview') {
            div.innerHTML = `
                <div id="res-preview-container" style="flex:1; overflow:auto; background:#525659; position:relative; padding: 40px 0;">
                    <div id="res-page-wrapper" style="display: flex; justify-content: center; min-height: min-content; width: 100%;">
                        <div id="res-a4-page" class="a4-page" style="width: 794px; height: 1123px; flex-shrink: 0;"></div>
                    </div>
                    
                    <!-- Zoom Controls -->
                     <div style="position: absolute; bottom: 20px; right: 20px; background: rgba(0,0,0,0.85); border-radius: 30px; padding: 5px 15px; display: flex; align-items: center; gap: 12px; color: white; box-shadow: 0 4px 15px rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); z-index: 100;">
                        <button id="z-minus" style="background:none; border:none; color:white; cursor:pointer; font-size:1.2rem;">−</button>
                        <span id="z-val" style="min-width: 45px; text-align: center; font-size: 0.85rem; font-variant-numeric: tabular-nums;">FIT</span>
                        <button id="z-plus" style="background:none; border:none; color:white; cursor:pointer; font-size:1.2rem;">+</button>
                        <div style="width:1px; height:15px; background:rgba(255,255,255,0.3);"></div>
                        <button id="z-fit" style="background:none; border:none; color:var(--primary); cursor:pointer; font-size:0.75rem; font-weight:bold; padding: 5px 2px;">${isTr ? 'SIĞDIR' : 'FIT SCREEN'}</button>
                    </div>
                </div>
            `;
            c.appendChild(div);

            // Render HTML using Core
            if (window.DevTools.resumeGenerator && window.DevTools.resumeGenerator.generateResumeHTML) {
                const res = window.DevTools.resumeGenerator.generateResumeHTML(d);
                const page = document.getElementById('res-a4-page');

                // Inject Style
                let style = document.getElementById('res-style-inj');
                if (!style) { style = document.createElement('style'); style.id = 'res-style-inj'; document.head.appendChild(style); }
                style.textContent = res.css;

                page.innerHTML = res.html;
            } else {
                document.getElementById('res-a4-page').innerHTML = 'Core module update required.';
            }

            // Bind Zoom
            document.getElementById('z-plus').onclick = () => { this.zoom = 'manual'; this.scaleValue += 0.1; this.fitPreview(); };
            document.getElementById('z-minus').onclick = () => { this.zoom = 'manual'; this.scaleValue = Math.max(0.1, this.scaleValue - 0.1); this.fitPreview(); };
            document.getElementById('z-fit').onclick = () => { this.zoom = 'fit'; this.fitPreview(); };

            // Auto Fit
            this.zoom = 'fit';
            // Wait for DOM
            requestAnimationFrame(() => this.fitPreview());
            window.addEventListener('resize', () => { if (this.currentTab === 'preview' && this.zoom === 'fit') this.fitPreview(); });
        }
    }

    _renderList(container, type) {
        const listDiv = container.querySelector(`#list-${type}`);
        const list = type === 'exp' ? this.data.experience : this.data.education;

        listDiv.innerHTML = list.map((it, i) => `
            <div class="res-card" style="margin-bottom: 15px; position:relative; padding: 15px;">
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
            </div>
        `).join('');

        window._upItem = (t, idx, key, val) => {
            const l = t === 'exp' ? this.data.experience : this.data.education;
            l[idx][key] = val;
            this._save();
        };
        window._addItem = (t) => {
            const l = t === 'exp' ? this.data.experience : this.data.education;
            if (t === 'exp') l.push({ role: '', comp: '', date: '', desc: '' });
            else l.push({ deg: '', sch: '', date: '' });
            this._save();
            this.renderTabContent();
        };
        window._delItem = (t, idx) => {
            const l = t === 'exp' ? this.data.experience : this.data.education;
            l.splice(idx, 1);
            this._save();
            this.renderTabContent();
        };
        window._setColor = (val) => {
            this.data.color = val;
            this._save();
            if (this.currentTab === 'preview') this.renderTabContent();
        };
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
            // Smart Fit Strategy:
            // Use Window Height minus Header/Footer allowance (~100px) to prevent recursive height growth
            const availableH = window.innerHeight - 150;
            const wScale = contW / pageW;
            const hScale = availableH / pageH;

            // Choose the smaller scale to ensure it fits entirely on screen
            this.scaleValue = Math.min(wScale, hScale, 0.95);
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
            wrapper.style.height = `${scaledH + 80}px`; // page height + padding
        }

        const lbl = document.getElementById('z-val');
        if (lbl) lbl.textContent = this.zoom === 'fit' ? (isTr ? 'SIĞDI' : 'FIT') : Math.round(this.scaleValue * 100) + '%';
    }

    _save() { localStorage.setItem('dt_resume_v2', JSON.stringify(this.data)); }
    _load() { const s = localStorage.getItem('dt_resume_v2'); return s ? JSON.parse(s) : null; }
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
            photo: 'https://randomuser.me/api/portraits/men/32.jpg', // Placeholder image
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
