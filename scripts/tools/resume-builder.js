/*
 * TULPAR CV STUDIO v4.0 - THEME UNIVERSE
 * Distinct architectural styles for every theme.
 */

class ResumeBuilder {
    constructor(containerId) {
        this.containerId = containerId;

        this.state = {
            theme: 'modern',
            color: '#3b82f6',

            config: {
                fontFamily: 'Inter',
                baseFontSize: 14,
                lineHeight: 1.5,
                showPhoto: true,
                photoShape: 'circle',
                showSummary: true,
                showSkills: true,
            },

            personal: {
                photo: 'images/cv.jpg',
                name: 'KAAN TÜRKMEN',
                title: 'Lead Full Stack Developer & AI Architect',
                email: '0n.watts@europe.com',
                phone: '+90 555 123 45 67',
                address: 'Istanbul, TR',
                website: 'github.com/tujue',
                summary: 'Modern AI teknolojileri ve web ekosistemleri üzerine uzmanlaşmış, yüksek performanslı ve ölçeklenebilir çözümler geliştiren kıdemli yazılım mühendisi. Karmaşık problemleri basit ve kullanıcı odaklı ürünlere dönüştürme konusunda tutkuludur.'
            },
            experience: [
                { id: 1, role: 'Senior Developer', company: 'Tech Solutions', date: '2021 - Present', description: 'Yapay zeka entegrasyonu ve modern frontend mimarileri üzerine ekip liderliği.' },
                { id: 2, role: 'Full Stack Engineer', company: 'Global Tech', date: '2018 - 2021', description: 'Ölçeklenebilir mikroservis mimarileri ve yüksek trafikli web uygulamaları geliştirme.' }
            ],
            education: [
                { id: 1, school: 'İstanbul Teknik Üniversitesi', degree: 'Bilgisayar Mühendisliği', date: '2014 - 2018' }
            ],
            skills: 'JavaScript, React, Node.js, Python, AI Integration, Next.js, Cloud Architectures',
            projects: [],
            languages: [],
            certificates: [
                { title: 'AI & Data Science Specialist', issuer: 'Meta', date: '2023' }
            ],
            references: [
                { name: 'Dr. Mehmet Yılmaz', position: 'CTO', company: 'Tech Solutions', email: 'm.yilmaz@techsolutions.com', phone: '+90 555 987 65 43' }
            ]
        };

        this.loadFonts();

        const savedData = localStorage.getItem('tulpar_cv_data_v4');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                this.state = { ...this.state, ...parsed, config: { ...this.state.config, ...parsed.config } };
            } catch (e) { console.error(e); }
        }

        this.init();

        window.addEventListener('languageChanged', () => {
            this.init();
        });
    }

    t(key) {
        return window.i18n ? window.i18n.t(key) : key;
    }

    loadFonts() {
        // Load a wide variety of fonts for different themes
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Space+Grotesk:wght@400;700&family=Lexend+Mega&family=Cormorant+Garamond:wght@400;600;700&family=Inter:wght@300;400;600;800&family=Montserrat:wght@400;700;900&family=Oswald:wght@500;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Roboto+Mono:wght@400;700&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }

    escapeHtml(text) {
        if (!text) return '';
        return text.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    init() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        // Ensure state has defaults if empty (prevent breaking preview)
        const p = this.state.personal;
        if (!p.name) p.name = '';

        container.innerHTML = `
            <div class="cv-studio-wrapper">
                <style>
                    .cv-studio-wrapper { display: flex; height: 100vh; overflow: hidden; background: #f1f5f9; font-family: 'Inter', sans-serif; }
                    .studio-sidebar { 
                        width: 380px; background: white; border-right: 1px solid #e2e8f0; 
                        display: flex; flex-direction: column; z-index: 10; flex-shrink: 0;
                        height: 100%; 
                    }
                    .sidebar-header { padding: 20px; border-bottom: 1px solid #e2e8f0; background: #fff; flex-shrink: 0; }
                    .sidebar-scroll { flex: 1; overflow-y: auto; padding: 20px; scrollbar-width: thin; }
                    
                    .control-group { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-bottom: 20px; }
                    .control-title { font-size: 11px; text-transform: uppercase; font-weight: 800; color: #94a3b8; margin-bottom: 12px; letter-spacing: 0.5px; }
                    .control-label { font-size: 12px; font-weight: 600; color: #475569; margin-bottom: 4px; display: block; }

                    .form-input { width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px; margin-bottom: 12px; transition: border-color 0.2s; background: #f8fafc; color: #1e293b; }
                    .form-input:focus { border-color: #3b82f6; outline: none; background: #fff; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
                    .form-input::placeholder { color: #94a3b8; }
                    
                    .theme-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
                    .theme-card { 
                        border: 2px solid #e2e8f0; border-radius: 6px; padding: 10px 5px; text-align: center; cursor: pointer; 
                        transition: all 0.2s; position: relative; overflow: hidden; background: #fff; font-size: 10px;
                        color: #334155; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;
                    }
                    .theme-card:hover { transform: translateY(-2px); border-color: #cbd5e1; }
                    .theme-card.active { border-color: #3b82f6; background: #eff6ff; color: #3b82f6; font-weight: 700; box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.1); }
                    .theme-icon { font-size: 18px; margin-bottom: 4px; display: block; }

                    .btn { width: 100%; padding: 12px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 14px; margin-top: 5px; transition: all 0.2s; }
                    .btn-primary { background: #3b82f6; color: white; box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2); }
                    .btn-primary:hover { background: #2563eb; transform: translateY(-1px); }
                    .btn-outline { background: white; border: 1px solid #cbd5e1; color: #475569; }
                    .btn-outline:hover { border-color: #94a3b8; color: #1e293b; background: #f8fafc; }

                    .studio-preview { 
                        flex: 1; padding: 40px; display: flex; justify-content: center; align-items: flex-start;
                        height: 100%; overflow-y: auto; scroll-behavior: smooth;
                    }
                    .a4-page { 
                        background: white; width: 210mm; min-height: 297mm; 
                        box-shadow: 0 20px 50px rgba(0,0,0,0.3); 
                        box-sizing: border-box; 
                        overflow: hidden;
                        transition: all 0.3s ease;
                        flex-shrink: 0; 
                    }

                    /* --- THEME SPECIFIC RESETS --- */
                    .theme-root { width: 100%; height: 100%; min-height: 297mm; box-sizing: border-box; }
                    


                    @page { size: A4; margin: 0mm !important; }
                    
                    @media print {
                        html, body { width: 210mm; height: 297mm; margin: 0 !important; padding: 0 !important; overflow: hidden; }
                        .cv-studio-wrapper { display: block; margin: 0 !important; padding: 0 !important; height: 100%; background: white; overflow: hidden; }
                        .studio-sidebar { display: none; }
                        .studio-preview { margin: 0 !important; padding: 0 !important; background: white; display: block; height: 100%; overflow: hidden; }
                        .a4-page { width: 100% !important; height: 100% !important; margin: 0 !important; padding: 0; box-shadow: none; overflow: hidden; page-break-after: avoid; page-break-inside: avoid; border: none !important; }
                        /* Force background prints */
                        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    }

                    /* Firefox Specific Fix - Overrides strict dimensions with fluid layout */
                    @-moz-document url-prefix() {
                        @media print {
                            @page { margin: 0; size: auto; }
                            html, body { width: 100% !important; height: auto !important; overflow: visible !important; }
                            .a4-page { width: 100% !important; height: auto !important; min-height: 297mm; transform: none !important; margin: 0 auto !important; }
                            .cv-studio-wrapper, .studio-preview { width: 100% !important; height: auto !important; overflow: visible !important; display: block !important; margin: 0 !important; padding: 0 !important; }
                        }
                    }
                </style>

                <div class="studio-sidebar">
                    <div class="sidebar-header">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <div style="font-weight: 900; font-size: 20px; color: #1e293b; letter-spacing: -0.5px;">cv<span style="color:#3b82f6">studio</span>.pro</div>
                            <button onclick="window.location.reload()" style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 6px; cursor: pointer; color: #ef4444; font-size: 12px; padding: 4px 10px; font-weight: 600; display: flex; align-items: center; gap: 5px;">
                                <span>❌</span> ${this.t('btn.close')}
                            </button>
                        </div>
                        <div style="font-size: 11px; color: #64748b; margin-top: 4px;">${this.t('resume.version')}</div>
                    </div>
                    <div class="sidebar-scroll">
                        
                        <!-- THEME SELECTOR -->
                        <div class="control-group">
                            <div class="control-title">${this.t('resume.designArchitecture')}</div>
                            <div class="theme-grid">
                                <div class="theme-card ${this.state.theme === 'modern' ? 'active' : ''}" onclick="app.setTheme('modern')">
                                    <span class="theme-icon">👔</span> ${this.t('resume.theme.modern')}
                                </div>
                                <div class="theme-card ${this.state.theme === 'elegant' ? 'active' : ''}" onclick="app.setTheme('elegant')">
                                    <span class="theme-icon">✒️</span> ${this.t('resume.theme.elegant')}
                                </div>
                                <div class="theme-card ${this.state.theme === 'creative' ? 'active' : ''}" onclick="app.setTheme('creative')">
                                    <span class="theme-icon">🎨</span> ${this.t('resume.theme.creative')}
                                </div>
                                <div class="theme-card ${this.state.theme === 'cyber' ? 'active' : ''}" onclick="app.setTheme('cyber')">
                                    <span class="theme-icon">🚀</span> ${this.t('resume.theme.cyber')}
                                </div>
                                <div class="theme-card ${this.state.theme === 'brutal' ? 'active' : ''}" onclick="app.setTheme('brutal')">
                                    <span class="theme-icon">🔥</span> ${this.t('resume.theme.brutal')}
                                </div>
                                <div class="theme-card ${this.state.theme === 'grid' ? 'active' : ''}" onclick="app.setTheme('grid')">
                                    <span class="theme-icon">🍱</span> ${this.t('resume.theme.grid')}
                                </div>
                                <div class="theme-card ${this.state.theme === 'minimal' ? 'active' : ''}" onclick="app.setTheme('minimal')">
                                    <span class="theme-icon">🍃</span> ${this.t('resume.theme.minimal')}
                                </div>
                                <div class="theme-card ${this.state.theme === 'compact' ? 'active' : ''}" onclick="app.setTheme('compact')">
                                    <span class="theme-icon">📏</span> ${this.t('resume.theme.compact')}
                                </div>
                                <div class="theme-card ${this.state.theme === 'timeline' ? 'active' : ''}" onclick="app.setTheme('timeline')">
                                    <span class="theme-icon">⏳</span> ${this.t('resume.theme.timeline')}
                                </div>
                                <div class="theme-card ${this.state.theme === 'corporate' ? 'active' : ''}" onclick="app.setTheme('corporate')">
                                    <span class="theme-icon">🏢</span> ${this.t('resume.theme.classic')}
                                </div>
                                <div class="theme-card ${this.state.theme === 'startup' ? 'active' : ''}" onclick="app.setTheme('startup')">
                                    <span class="theme-icon">🦄</span> ${this.t('resume.theme.startup')}
                                </div>
                                <div class="theme-card ${this.state.theme === 'academic' ? 'active' : ''}" onclick="app.setTheme('academic')">
                                    <span class="theme-icon">🎓</span> ${this.t('resume.theme.scholar')}
                                </div>
                                <div class="theme-card ${this.state.theme === 'infographic' ? 'active' : ''}" onclick="app.setTheme('infographic')">
                                    <span class="theme-icon">📊</span> ${this.t('resume.theme.infographic')}
                                </div>
                                <div class="theme-card ${this.state.theme === 'magazine' ? 'active' : ''}" onclick="app.setTheme('magazine')">
                                    <span class="theme-icon">📰</span> ${this.t('resume.theme.magazine')}
                                </div>
                                <div class="theme-card ${this.state.theme === 'retro' ? 'active' : ''}" onclick="app.setTheme('retro')">
                                    <span class="theme-icon">📻</span> ${this.t('resume.theme.retro')}
                                </div>
                            </div>
                            
                            <div style="margin-top: 15px;">
                                <div class="control-title">${this.t('resume.accentColor')}</div>
                                <div style="display:flex; gap:8px; flex-wrap: wrap;">
                                    ${['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#000000'].map(c =>
            `<div style="width:28px; height:28px; background:${c}; border-radius:50%; cursor:pointer; border:2px solid ${this.state.color === c ? '#cbd5e1' : 'transparent'}; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transform: scale(${this.state.color === c ? 1.1 : 1}); transition: transform 0.2s;" onclick="app.setColor('${c}')"></div>`
        ).join('')}
                                    <input type="color" value="${this.state.color}" style="width:28px; height:28px; padding:0; border:none; background:none; cursor:pointer;" onchange="app.setColor(this.value)">
                                </div>
                            </div>
                        </div>

                        <!-- CONTENT EDITORS -->
                        <div class="control-group">
                            <div class="control-title">${this.t('resume.profileIdentity')}</div>
                            <div style="text-align:center; margin-bottom:20px;">
                                <div style="width:80px; height:80px; background:#f1f5f9; border-radius:50%; margin:0 auto 10px; overflow:hidden; cursor:pointer; border: 2px dashed #cbd5e1; display:flex; align-items:center; justify-content:center; position:relative;" onclick="document.getElementById('photoInput').click()">
                                    ${this.state.personal.photo ? `<img src="${this.state.personal.photo}" style="width:100%;height:100%;object-fit:cover">` : '<span style="font-size:24px; color:#cbd5e1;">📷</span>'}
                                    <div style="position:absolute; bottom:0; width:100%; background:rgba(0,0,0,0.5); color:white; font-size:9px; padding:2px 0;">${this.t('resume.edit')}</div>
                                </div>
                                <input type="file" id="photoInput" hidden onchange="app.handlePhoto(this)">
                            </div>

                            <label class="control-label">${this.t('resume.fullName')}</label>
                            <input class="form-input" placeholder="${this.t('resume.placeholder.fullName')}" value="${this.escapeHtml(this.state.personal.name)}" oninput="app.updateP('name', this.value)">
                            
                            <label class="control-label">${this.t('resume.professionalTitle')}</label>
                            <input class="form-input" placeholder="${this.t('resume.placeholder.title')}" value="${this.escapeHtml(this.state.personal.title)}" oninput="app.updateP('title', this.value)">
                            
                            <label class="control-label">${this.t('resume.professionalSummary')}</label>
                            <textarea class="form-input" style="min-height:80px; resize:vertical;" placeholder="${this.t('resume.placeholder.summary')}" oninput="app.updateP('summary', this.value)">${this.state.personal.summary}</textarea>
                        </div>

                         <div class="control-group">
                            <div class="control-title">${this.t('resume.contactInformation')}</div>
                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                                <div>
                                    <label class="control-label">${this.t('resume.email')}</label>
                                    <input class="form-input" placeholder="${this.t('resume.placeholder.email')}" value="${this.escapeHtml(this.state.personal.email)}" oninput="app.updateP('email', this.value)">
                                </div>
                                <div>
                                    <label class="control-label">${this.t('resume.phone')}</label>
                                    <input class="form-input" placeholder="${this.t('resume.placeholder.phone')}" value="${this.escapeHtml(this.state.personal.phone)}" oninput="app.updateP('phone', this.value)">
                                </div>
                            </div>
                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                                <div>
                                    <label class="control-label">${this.t('resume.location')}</label>
                                    <input class="form-input" placeholder="${this.t('resume.placeholder.location')}" value="${this.escapeHtml(this.state.personal.address)}" oninput="app.updateP('address', this.value)">
                                </div>
                                <div>
                                    <label class="control-label">${this.t('resume.website')}</label>
                                    <input class="form-input" placeholder="${this.t('resume.placeholder.website')}" value="${this.escapeHtml(this.state.personal.website)}" oninput="app.updateP('website', this.value)">
                                </div>
                            </div>
                            
                            <div style="margin-top:15px;">
                                <div class="control-title">${this.t('resume.keySkills')}</div>
                                <textarea class="form-input" style="min-height:60px;" placeholder="${this.t('resume.placeholder.skills_hint')}" oninput="app.updateSkills(this.value)">${this.state.skills}</textarea>
                            </div>
                        </div>

                        <div class="control-group">
                            <div class="control-title">${this.t('resume.experienceHistory')}</div>
                            <div id="exp_list"></div>
                            <button class="btn btn-outline" onclick="app.addItem('experience')">
                                <span style="font-size:16px; margin-right:5px;">+</span> ${this.t('resume.addPosition')}
                            </button>
                        </div>

                        <div class="control-group">
                            <div class="control-title">${this.t('resume.certificatesAwards')}</div>
                            <div id="cert_list"></div>
                            <button class="btn btn-outline" onclick="app.addItem('certificates')">
                                <span style="font-size:16px; margin-right:5px;">+</span> ${this.t('resume.addItem')}
                            </button>
                        </div>

                        <div class="control-group">
                            <div class="control-title">${this.t('resume.references')}</div>
                            <div id="ref_list"></div>
                            <button class="btn btn-outline" onclick="app.addItem('references')">
                                <span style="font-size:16px; margin-right:5px;">+</span> ${this.t('resume.addReference')}
                            </button>
                        </div>
                        
                        <div style="margin-top:20px; padding-bottom: 40px;">
                             <button class="btn btn-primary" style="padding:16px; font-size:16px; font-weight:700; display:flex; align-items:center; justify-content:center; gap:8px;" onclick="app.downloadPDF()">
                                <span>${this.t('resume.downloadPdf')}</span>
                                <span style="font-size:18px;">⬇️</span>
                             </button>
                             <div style="text-align:center; font-size:11px; color:#94a3b8; margin-top:10px; background:#fff; padding:8px; border-radius:6px; border:1px dashed #cbd5e1;">
                                ${this.t('resume.printNote')}
                             </div>
                        </div>

                    </div>
                </div>

                <div class="studio-preview">
                    <div id="cv_preview" class="a4-page"></div>
                </div>
            </div>
        `;

        this.renderExpList();
        this.renderCertList();
        this.renderRefList();
        this.renderPreview();
        window.app = this;
    }

    setTheme(t) { this.state.theme = t; this.init(); } // Re-render to update UI active state
    setColor(c) { this.state.color = c; this.renderPreview(); }
    updateP(k, v) { this.state.personal[k] = v; this.renderPreview(); }
    updateSkills(v) { this.state.skills = v; this.renderPreview(); }

    handlePhoto(input) {
        if (input.files && input.files[0]) {
            const r = new FileReader();
            r.onload = (e) => { this.state.personal.photo = e.target.result; this.init(); };
            r.readAsDataURL(input.files[0]);
        }
    }

    renderExpList() {
        const c = document.getElementById('exp_list');
        if (!c) return;
        c.innerHTML = this.state.experience.map((e, i) => `
            <div style="margin-bottom:15px; border-bottom:1px solid #e2e8f0; padding-bottom:15px;">
                <div style="display:grid; grid-template-columns: 2fr 1fr; gap:10px;">
                    <div>
                        <label class="control-label">${this.t('resume.role')}</label>
                        <input class="form-input" style="font-weight:600;" placeholder="${this.t('resume.placeholder.role')}" value="${this.escapeHtml(e.role)}" oninput="app.updateExp(${i}, 'role', this.value)">
                    </div>
                    <div>
                        <label class="control-label">${this.t('resume.year')}</label>
                        <input class="form-input" placeholder="2020 - 2023" value="${this.escapeHtml(e.date || '')}" oninput="app.updateExp(${i}, 'date', this.value)">
                    </div>
                </div>
                
                <label class="control-label">${this.t('resume.company')}</label>
                <input class="form-input" placeholder="${this.t('resume.placeholder.company')}" value="${this.escapeHtml(e.company)}" oninput="app.updateExp(${i}, 'company', this.value)">
                
                <label class="control-label">${this.t('resume.description')}</label>
                <textarea class="form-input" style="min-height:60px;" placeholder="${this.t('resume.placeholder.description')}" oninput="app.updateExp(${i}, 'description', this.value)">${e.description}</textarea>
                
                <div style="text-align:right;">
                    <button class="btn" style="background:#fee2e2; color:#ef4444; padding:6px 12px; font-size:11px; width:auto; border:1px solid #fecaca;" onclick="app.removeExp(${i})">${this.t('resume.removeItem')}</button>
                </div>
            </div>
        `).join('');
    }

    renderCertList() {
        const c = document.getElementById('cert_list');
        if (!c) return;
        c.innerHTML = this.state.certificates.map((e, i) => `
            <div style="margin-bottom:15px; border-bottom:1px solid #e2e8f0; padding-bottom:15px;">
                <label class="control-label">${this.t('resume.certTitle')}</label>
                <input class="form-input" style="font-weight:600;" placeholder="e.g. AWS Certified" value="${this.escapeHtml(e.title)}" oninput="app.updateCert(${i}, 'title', this.value)">
                
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                    <div>
                        <label class="control-label">${this.t('resume.issuer')}</label>
                        <input class="form-input" placeholder="Organization" value="${this.escapeHtml(e.issuer)}" oninput="app.updateCert(${i}, 'issuer', this.value)">
                    </div>
                    <div>
                        <label class="control-label">${this.t('resume.year')}</label>
                        <input class="form-input" placeholder="2023" value="${this.escapeHtml(e.date)}" oninput="app.updateCert(${i}, 'date', this.value)">
                    </div>
                </div>
                
                <div style="text-align:right;">
                    <button class="btn" style="background:#fee2e2; color:#ef4444; padding:6px 12px; font-size:11px; width:auto; border:1px solid #fecaca;" onclick="app.removeCert(${i})">${this.t('resume.removeItem')}</button>
                </div>
            </div>
        `).join('');
    }

    renderRefList() {
        const c = document.getElementById('ref_list');
        if (!c) return;
        c.innerHTML = this.state.references.map((r, i) => `
            <div style="margin-bottom:15px; border-bottom:1px solid #e2e8f0; padding-bottom:15px;">
                <label class="control-label">${this.t('resume.referenceName')}</label>
                <input class="form-input" style="font-weight:600;" placeholder="${this.t('resume.placeholder.refName')}" value="${this.escapeHtml(r.name)}" oninput="app.updateRef(${i}, 'name', this.value)">
                
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                    <div>
                        <label class="control-label">${this.t('resume.referencePosition')}</label>
                        <input class="form-input" placeholder="${this.t('resume.placeholder.refPosition')}" value="${this.escapeHtml(r.position)}" oninput="app.updateRef(${i}, 'position', this.value)">
                    </div>
                    <div>
                        <label class="control-label">${this.t('resume.company')}</label>
                        <input class="form-input" placeholder="${this.t('resume.placeholder.company')}" value="${this.escapeHtml(r.company)}" oninput="app.updateRef(${i}, 'company', this.value)">
                    </div>
                </div>
                
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                    <div>
                        <label class="control-label">${this.t('resume.email')}</label>
                        <input class="form-input" placeholder="${this.t('resume.placeholder.email')}" value="${this.escapeHtml(r.email)}" oninput="app.updateRef(${i}, 'email', this.value)">
                    </div>
                    <div>
                        <label class="control-label">${this.t('resume.phone')}</label>
                        <input class="form-input" placeholder="${this.t('resume.placeholder.phone')}" value="${this.escapeHtml(r.phone)}" oninput="app.updateRef(${i}, 'phone', this.value)">
                    </div>
                </div>
                
                <div style="text-align:right;">
                    <button class="btn" style="background:#fee2e2; color:#ef4444; padding:6px 12px; font-size:11px; width:auto; border:1px solid #fecaca;" onclick="app.removeRef(${i})">${this.t('resume.removeItem')}</button>
                </div>
            </div>
        `).join('');
    }

    addItem(type) {
        if (type === 'experience') {
            this.state.experience.push({ role: this.t('resume.placeholder.role'), company: this.t('resume.placeholder.company'), date: '2023 - Present', description: '' });
            this.renderExpList();
        } else if (type === 'certificates') {
            this.state.certificates.push({ title: this.t('resume.placeholder.cert'), issuer: this.t('resume.placeholder.issuer'), date: this.t('resume.placeholder.year') });
            this.renderCertList();
        } else if (type === 'references') {
            this.state.references.push({ name: this.t('resume.placeholder.refName'), position: this.t('resume.placeholder.refPosition'), company: this.t('resume.placeholder.company'), email: '', phone: '' });
            this.renderRefList();
        }
        this.renderPreview();
    }

    removeExp(i) { this.state.experience.splice(i, 1); this.renderExpList(); this.renderPreview(); }
    updateExp(i, k, v) { this.state.experience[i][k] = v; this.renderPreview(); }

    removeCert(i) { this.state.certificates.splice(i, 1); this.renderCertList(); this.renderPreview(); }
    updateCert(i, k, v) { this.state.certificates[i][k] = v; this.renderPreview(); }

    removeRef(i) { this.state.references.splice(i, 1); this.renderRefList(); this.renderPreview(); }
    updateRef(i, k, v) { this.state.references[i][k] = v; this.renderPreview(); }

    // --- UTILS ---
    getContrastColor(hex) {
        if (!hex || hex.length < 7) return 'white';
        const r = parseInt(hex.substr(1, 2), 16);
        const g = parseInt(hex.substr(3, 2), 16);
        const b = parseInt(hex.substr(5, 2), 16);
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return (yiq >= 180) ? '#1e293b' : 'white'; // Higher threshold for better readability
    }

    // --- THEME ENGINE ---
    renderPreview() {
        const t = document.getElementById('cv_preview');
        if (t) t.style.padding = '0';
        // Clone state to avoid mutating original data during rendering transformations
        const s = JSON.parse(JSON.stringify(this.state));

        // Auto-translate 'Present' in dates
        const presentTxt = this.t('resume.present');
        if (s.experience) s.experience.forEach(e => { if (e.date) e.date = e.date.replace(/Present/gi, presentTxt); });
        if (s.education) s.education.forEach(e => { if (e.date) e.date = e.date.replace(/Present/gi, presentTxt); });
        if (s.certificates) s.certificates.forEach(c => { if (c.date) c.date = c.date.replace(/Present/gi, presentTxt); });
        const p = {
            ...s.personal,
            name: s.personal.name || this.t('resume.placeholder.fullName').toUpperCase(),
            title: s.personal.title || this.t('resume.placeholder.title')
        };
        const contrast = this.getContrastColor(s.color);

        // --- 1. MODERN THEME ---
        if (s.theme === 'modern') {
            t.innerHTML = `
                <div class="theme-root" style="display:grid; grid-template-columns: 33% 67%; color:#334155;">
                    <div style="background:${s.color}; color:${contrast}; padding:40px 30px;">
                        ${p.photo ? `<img src="${p.photo}" style="width:120px; height:120px; border-radius:50%; margin-bottom:30px; border:4px solid rgba(255,255,255,0.2); object-fit:cover; filter: contrast(1.1) brightness(1.1); image-rendering: -webkit-optimize-contrast;">` : ''}
                        
                        <div style="margin-bottom:40px;">
                            <div style="text-transform:uppercase; font-size:12px; font-weight:700; letter-spacing:1px; margin-bottom:15px; border-bottom:1px solid ${contrast}44; padding-bottom:5px;">${this.t('resume.section.contact')}</div>
                            <div style="font-size:13px; display:flex; flex-direction:column; gap:10px; opacity:0.9;">
                                ${p.email ? `<div>📧 ${p.email}</div>` : ''}
                                ${p.phone ? `<div>📱 ${p.phone}</div>` : ''}
                                ${p.address ? `<div>📍 ${p.address}</div>` : ''}
                                ${p.website ? `<div>🔗 ${p.website}</div>` : ''}
                            </div>
                        </div>

                        <div style="margin-bottom:40px;">
                             <div style="text-transform:uppercase; font-size:12px; font-weight:700; letter-spacing:1px; margin-bottom:15px; border-bottom:1px solid ${contrast}44; padding-bottom:5px;">${this.t('resume.section.skills')}</div>
                             <div style="display:flex; flex-wrap:wrap; gap:5px;">
                                ${s.skills.split(',').map(ski => `<span style="background:${contrast}22; padding:3px 8px; border-radius:4px; font-size:12px;">${ski.trim()}</span>`).join('')}
                             </div>
                        </div>
                    </div>
                    <div style="padding:50px;">
                        <div style="margin-bottom:40px;">
                            <h1 style="margin:0; font-size:42px; line-height:1; font-weight:800; color:${s.color}; letter-spacing:-1px;">${p.name.split(' ')[0]}<br><span style="color:#1e293b">${p.name.split(' ').slice(1).join(' ')}</span></h1>
                            <div style="font-size:18px; color:#64748b; margin-top:10px; font-weight:500;">${p.title}</div>
                        </div>

                        ${p.summary ? `
                        <div style="margin-bottom:40px;">
                            <h3 style="font-size:14px; text-transform:uppercase; font-weight:800; color:${s.color}; border-bottom:2px solid #e2e8f0; padding-bottom:8px; margin-bottom:15px;">${this.t('resume.section.profile')}</h3>
                            <div style="font-size:14px; line-height:1.7; color:#475569;">${p.summary}</div>
                        </div>` : ''}

                        <div>
                             <h3 style="font-size:14px; text-transform:uppercase; font-weight:800; color:${s.color}; border-bottom:2px solid #e2e8f0; padding-bottom:8px; margin-bottom:15px;">${this.t('resume.section.experience')}</h3>
                             ${s.experience.map(e => `
                                <div style="margin-bottom:25px;">
                                    <div style="font-weight:800; font-size:16px;">${e.role}</div>
                                    <div style="color:${s.color}; font-weight:600; font-size:14px; margin-bottom:5px;">${e.company}</div>
                                    <div style="font-size:14px; line-height:1.6; color:#475569; white-space:pre-line;">${e.description}</div>
                                </div>
                             `).join('')}

                             ${s.certificates.length > 0 ? `
                                <h3 style="font-size:14px; text-transform:uppercase; font-weight:800; color:${s.color}; border-bottom:2px solid #e2e8f0; padding-bottom:8px; margin-bottom:15px; margin-top:30px;">${this.t('resume.section.certificates')}</h3>
                                ${s.certificates.map(c => `
                                    <div style="margin-bottom:15px;">
                                        <div style="font-weight:700; font-size:15px;">${c.title}</div>
                                        <div style="font-size:13px; color:#64748b;">${c.issuer} • ${c.date}</div>
                                    </div>
                                `).join('')}
                             ` : ''}
                             
                             ${s.references.length > 0 ? `
                                <h3 style="font-size:14px; text-transform:uppercase; font-weight:800; color:${s.color}; border-bottom:2px solid #e2e8f0; padding-bottom:8px; margin-bottom:15px; margin-top:30px;">${this.t('resume.section.references')}</h3>
                                ${s.references.map(r => `
                                    <div style="margin-bottom:15px;">
                                        <div style="font-weight:700; font-size:15px;">${r.name}</div>
                                        <div style="font-size:13px; color:#64748b;">${r.position} • ${r.company}</div>
                                        <div style="font-size:12px; color:#94a3b8;">${r.email}${r.phone ? ` • ${r.phone}` : ''}</div>
                                    </div>
                                `).join('')}
                             ` : ''}
                        </div>
                    </div>
                </div>
            `;
        }

        // --- 2. ELEGANT THEME (Serif, Centered, Magazine) ---
        else if (s.theme === 'elegant') {
            t.innerHTML = `
                <div class="theme-root" style="padding:60px 80px; text-align:center; font-family:'Playfair Display', serif; color:#1c1917; height:100%; min-height:297mm; box-sizing:border-box; display:flex; flex-direction:column;" >
                    ${p.photo ? `<img src="${p.photo}" style="width:100px; height:100px; border-radius:50%; object-fit:cover; margin-bottom:20px; filter: contrast(1.1) brightness(1.1); image-rendering: -webkit-optimize-contrast;">` : ''}
                    
                    <h1 style="font-size:48px; margin:0; font-weight:700; color:${s.color}; letter-spacing:-0.5px;">${p.name}</h1>
                    <div style="font-size:14px;font-family:'Inter',sans-serif; text-transform:uppercase; letter-spacing:2px; margin-top:10px; color:#78716c;">${p.title}</div>
                    
                    <div style="display:flex; justify-content:center; gap:20px; margin-top:20px; font-family:'Inter',sans-serif; font-size:12px; color:#57534e;">
                         ${[p.email, p.phone, p.address, p.website].filter(x => x).map(x => `<span>${x}</span>`).join('<span style="color:#d6d3d1">•</span>')}
                    </div>

                    <div style="width:50px; height:1px; background:#d6d3d1; margin:30px auto;"></div>

                    <div style="text-align:left; max-width:100%; flex:1;">
                         ${p.summary ? `
                         <div style="margin-bottom:40px; text-align:center;">
                            <p style="font-size:15px; line-height:1.8; color:#444;">${p.summary}</p>
                         </div>` : ''}

                         <div style="display:grid; grid-template-columns: 1fr 1fr; gap:60px; text-align:left;">
                            <div>
                                <h3 style="font-family:'Inter', sans-serif; font-size:11px; font-weight:900; letter-spacing:1px; text-transform:uppercase; color:${s.color}; border-top:1px solid #e7e5e4; padding-top:10px; margin-bottom:20px;">${this.t('resume.section.experience')}</h3>
                                ${s.experience.map(e => `
                                    <div style="margin-bottom:30px;">
                                        <div style="font-weight:700; font-size:18px;">${e.role}</div>
                                        <div style="font-family:'Inter',sans-serif; font-size:12px; color:#78716c; margin-top:4px;">${e.company}</div>
                                        <div style="margin-top:10px; font-size:14px; line-height:1.6; color:#444;">${e.description}</div>
                                    </div>
                                `).join('')}
                            </div>
                            <div>
                                <h3 style="font-family:'Inter', sans-serif; font-size:11px; font-weight:900; letter-spacing:1px; text-transform:uppercase; color:${s.color}; border-top:1px solid #e7e5e4; padding-top:10px; margin-bottom:20px;">${this.t('resume.section.expertise')}</h3>
                                <div style="display:flex; flex-wrap:wrap; gap:10px;">
                                    ${s.skills.split(',').map(sk => `<span style="border:1px solid #e7e5e4; padding:6px 12px; font-family:'Inter',sans-serif; font-size:12px; color:#57534e;">${sk.trim()}</span>`).join('')}
                                </div>
                                
                                <h3 style="font-family:'Inter', sans-serif; font-size:11px; font-weight:900; letter-spacing:1px; text-transform:uppercase; color:${s.color}; border-top:1px solid #e7e5e4; padding-top:10px; margin-bottom:20px; margin-top:40px;">${this.t('resume.section.education')}</h3>
                                ${s.education.map(ed => `
                                    <div style="margin-bottom:15px;">
                                        <div style="font-weight:700; font-size:16px;">${ed.degree}</div>
                                        <div style="font-family:'Inter',sans-serif; font-size:12px; color:#78716c;">${ed.school}</div>
                                    </div>
                                `).join('')}
                                ${s.certificates.length > 0 ? `
                                    <h3 style="font-family:'Inter', sans-serif; font-size:11px; font-weight:900; letter-spacing:1px; text-transform:uppercase; color:${s.color}; border-top:1px solid #e7e5e4; padding-top:10px; margin-bottom:20px; margin-top:40px;">${this.t('resume.section.certificates')}</h3>
                                    ${s.certificates.map(c => `
                                        <div style="margin-bottom:15px;">
                                            <div style="font-weight:700; font-size:15px; font-family:'Playfair Display', serif;">${c.title}</div>
                                            <div style="font-family:'Inter',sans-serif; font-size:12px; color:#78716c;">${c.issuer} (${c.date})</div>
                                        </div>
                                    `).join('')}
                                ` : ''}
                                ${s.references.length > 0 ? `
                                    <h3 style="font-family:'Inter', sans-serif; font-size:11px; font-weight:900; letter-spacing:1px; text-transform:uppercase; color:${s.color}; border-top:1px solid #e7e5e4; padding-top:10px; margin-bottom:20px; margin-top:40px;">${this.t('resume.section.references')}</h3>
                                    ${s.references.map(r => `
                                        <div style="margin-bottom:15px;">
                                            <div style="font-weight:700; font-size:15px; font-family:'Playfair Display', serif;">${r.name}</div>
                                            <div style="font-family:'Inter',sans-serif; font-size:12px; color:#78716c;">${r.position}, ${r.company}</div>
                                            <div style="font-family:'Inter',sans-serif; font-size:11px; color:#a8a29e;">${r.email}${r.phone ? ` • ${r.phone}` : ''}</div>
                                        </div>
                                    `).join('')}
                                ` : ''}
                            </div>
                         </div>
                    </div>
                </div>
                `;
        }

        // --- 3. CREATIVE THEME (Asymmetric, Bold) ---
        else if (s.theme === 'creative') {
            t.innerHTML = `
                <div class="theme-root" style="color:#0f172a; font-family:'Space Grotesk', sans-serif;" >
                     <div style="background:${s.color}; height:15px;"></div>
                     <div style="padding:50px 60px;">
                        <h1 style="font-size:80px; line-height:0.8; font-weight:700; letter-spacing:-3px; margin:0 0 20px -5px;">${p.name.split(' ')[0]}<br><span style="text-stroke:2px black; -webkit-text-stroke:2px black; color:transparent;">${p.name.split(' ').length > 1 ? p.name.split(' ')[1] : ''}</span></h1>
                        
                        <div style="display:flex; justify-content:space-between; align-items:flex-end; border-bottom:4px solid #000; padding-bottom:20px; margin-bottom:40px;">
                            <div style="font-size:24px; font-weight:700; background:#000; color:white; padding:5px 15px; transform:rotate(-2deg);">${p.title}</div>
                             <div style="font-family:'Inter'; font-size:12px; font-weight:600; text-align:right;">
                                ${p.email}<br>${p.phone}<br>${p.address}${p.website ? `<br>${p.website}` : ''}
                            </div>
                        </div>

                        <div style="display:grid; grid-template-columns: 2fr 1fr; gap:50px;">
                            <div>
                                ${p.summary ? `<p style="font-size:18px; font-weight:400; line-height:1.6; margin-bottom:40px;">${p.summary}</p>` : ''}
                                
                                <div style="margin-bottom:20px; font-size:14px; font-weight:700; text-transform:uppercase; letter-spacing:1px; background:#f1f5f9; display:inline-block; padding:5px 10px;">${this.t('resume.section.experience')}</div>
                                ${s.experience.map((e, i) => `
                                    <div style="margin-bottom:30px; border-left:4px solid ${s.color}; padding-left:20px;">
                                        <div style="font-size:20px; font-weight:700;">${e.role}</div>
                                        <div style="font-family:'Inter'; font-weight:600; font-size:13px; color:#64748b; margin:5px 0 10px;">${e.company}</div>
                                        <div style="font-family:'Inter'; font-size:14px; line-height:1.5;">${e.description}</div>
                                    </div>
                                `).join('')}
                            </div>
                            
                            <div>
                                ${p.photo ? `<div style="width:100%; aspect-ratio:1; background:#000; margin-bottom:30px;"><img src="${p.photo}" style="width:100%; height:100%; object-fit:cover; opacity:0.8; filter: contrast(1.1) brightness(1.1); image-rendering: -webkit-optimize-contrast;"></div>` : ''}
                                
                                <div style="margin-bottom:15px; font-weight:700;">// ${this.t('resume.section.skills').toUpperCase()}</div>
                                <div style="display:flex; flex-direction:column; gap:8px;">
                                    ${s.skills.split(',').map(k => `
                                        <div style="font-family:'Inter'; font-size:13px; font-weight:600; background:${s.color}22; padding:8px 12px; border:1px solid ${s.color}; color:${s.color};">
                                            ${k.trim()}
                                        </div>
                                    `).join('')}
                                 </div>

                                ${s.certificates.length > 0 ? `
                                    <div style="margin-bottom:15px; font-weight:700; margin-top:40px;">// ${this.t('resume.section.certificates').toUpperCase()}</div>
                                    ${s.certificates.map(c => `
                                        <div style="margin-bottom:10px;">
                                            <div style="font-weight:700; font-size:14px;">${c.title}</div>
                                            <div style="font-size:12px; color:#64748b;">${c.issuer} / ${c.date}</div>
                                        </div>
                                    `).join('')}
                                ` : ''}
                                ${s.references.length > 0 ? `
                                    <div style="margin-bottom:15px; font-weight:700; margin-top:40px;">// ${this.t('resume.section.references').toUpperCase()}</div>
                                    ${s.references.map(r => `
                                        <div style="margin-bottom:10px;">
                                            <div style="font-weight:700; font-size:14px;">${r.name}</div>
                                            <div style="font-size:12px; color:#64748b;">${r.position} @ ${r.company}</div>
                                            <div style="font-size:11px; color:#94a3b8;">${r.email}${r.phone ? ` • ${r.phone}` : ''}</div>
                                        </div>
                                    `).join('')}
                                ` : ''}
                            </div>
                        </div>
                     </div>
                </div>
            `;
        }

        // --- 4. CYBER THEME (Dark, Terminal) ---
        else if (s.theme === 'cyber') {
            t.innerHTML = `
                <div class="theme-root" style="background:#0f172a; color:#f8fafc; padding:40px; font-family:'Share Tech Mono', monospace;" >
                    <div style="border:1px solid ${s.color}; padding:5px; margin-bottom:30px;">
                        <div style="background:${s.color}22; padding:30px; border:1px solid ${s.color}; position:relative;">
                             <div style="position:absolute; top:-10px; left:20px; background:#0f172a; padding:0 10px; color:${s.color}; font-size:12px;">${this.t('resume.cyber.identity')}</div>
                             <div style="display:flex; justify-content:space-between; align-items:center;">
                                <div>
                                    <h1 style="font-size:36px; margin:0; text-shadow:0 0 10px ${s.color}88;">&gt; ${p.name}_<span style="animation:blink 1s infinite">|</span></h1>
                                    <div style="color:${s.color}; margin-top:5px;">${p.title}</div>
                                </div>
                                ${p.photo ? `<div style="width:80px; height:80px; border:2px solid ${s.color}; border-radius:50%; overflow:hidden;"><img src="${p.photo}" style="width:100%;height:100%;filter:grayscale(100%) contrast(1.1) brightness(1.1); object-fit:cover; image-rendering: -webkit-optimize-contrast;"></div>` : ''}
                            </div>
                        </div>
                    </div>

                    <div style="display:grid; grid-template-columns: 2fr 1fr; gap:30px;">
                        <div>
                             <div style="color:${s.color}; border-bottom:1px dashed ${s.color}; margin-bottom:20px; padding-bottom:5px;">${this.t('resume.cyber.experience')}</div>
                             ${s.experience.map(e => `
                                <div style="margin-bottom:25px;">
                                    <div style="display:flex; margin-bottom:5px;">
                                        <div style="color:${s.color}">root@company:</div>
                                        <div style="margin-left:10px;">${e.company}</div>
                                    </div>
                                    <div style="font-weight:bold; font-size:18px; margin-bottom:5px;">${e.role}</div>
                                    <div style="font-size:13px; opacity:0.8; line-height:1.5;">${e.description}</div>
                                </div>
                            `).join('')}
                        </div>
                         <div>
                            <div style="color:${s.color}; border-bottom:1px dashed ${s.color}; margin-bottom:20px; padding-bottom:5px;">${this.t('resume.cyber.specs')}</div>
                            <div style="background:black; padding:15px; font-size:12px; border-left:3px solid ${s.color};">
                                ${p.email ? `<div style="margin-bottom:5px;">"email": "${p.email}"</div>` : ''}
                                ${p.phone ? `<div style="margin-bottom:5px;">"phone": "${p.phone}"</div>` : ''}
                                ${p.address ? `<div style="margin-bottom:5px;">"loc": "${p.address}"</div>` : ''}
                                ${p.website ? `<div style="margin-bottom:5px;">"web": "${p.website}"</div>` : ''}
                            </div>

                            <div style="margin-top:30px; color:${s.color}; border-bottom:1px dashed ${s.color}; margin-bottom:15px; padding-bottom:5px;">./${this.t('resume.section.skills').toLowerCase()}</div>
                            <div style="display:flex; flex-wrap:wrap; gap:8px;">
                                ${s.skills.split(',').map(k => `<div style="border:1px solid #334155; padding:4px 8px; font-size:11px;">${k.trim()}</div>`).join('')}
                            </div>
                            
                            ${s.certificates.length > 0 ? `
                                <div style="margin-top:30px; color:${s.color}; border-bottom:1px dashed ${s.color}; margin-bottom:15px; padding-bottom:5px;">./${this.t('resume.section.certificates').toLowerCase()}.log</div>
                                ${s.certificates.map(c => `
                                    <div style="margin-bottom:10px; font-size:13px;">
                                        <span style="color:${s.color}">&gt;</span> ${c.title}
                                        <div style="opacity:0.6; padding-left:15px; font-size:11px;">${c.issuer} [${c.date}]</div>
                                    </div>
                                `).join('')}
                            ` : ''}
                            
                            ${s.references.length > 0 ? `
                                <div style="margin-top:30px; color:${s.color}; border-bottom:1px dashed ${s.color}; margin-bottom:15px; padding-bottom:5px;">./${this.t('resume.section.references').toLowerCase()}.log</div>
                                ${s.references.map(r => `
                                    <div style="margin-bottom:10px; font-size:13px;">
                                        <span style="color:${s.color}">></span> ${r.name}
                                        <div style="opacity:0.6; padding-left:15px; font-size:11px;">${r.position} @ ${r.company}</div>
                                        <div style="opacity:0.5; padding-left:15px; font-size:10px;">${r.email}</div>
                                    </div>
                                `).join('')}
                            ` : ''}
                        </div>
                    </div>
                </div>
                `;
        }

        // --- 5. BRUTAL THEME (Neo-Brutalism) ---
        else if (s.theme === 'brutal') {
            t.innerHTML = `
                <div class="theme-root" style="background:${s.color}22; padding:40px; font-family:'Lexend Mega', sans-serif; color:black; height:100%; min-height:297mm; box-sizing:border-box; display:flex; flex-direction:column;" >
                    <div style="background:white; border:4px solid black; padding:30px; box-shadow:10px 10px 0px black; margin-bottom:40px;">
                        <h1 style="font-size:48px; line-height:1;margin:0; text-transform:uppercase;">${p.name}</h1>
                        <div style="font-size:20px; font-weight:700; background:${s.color}; color:black; display:inline-block; padding:5px 10px; margin-top:15px; border:2px solid black;">${p.title}</div>
                    </div>
                    
                    ${p.photo ? `<div style="position:absolute; top:40px; right:40px; width:120px; height:150px; border:4px solid black; background:#fff; box-shadow:5px 5px 0 ${s.color}; overflow:hidden;"><img src="${p.photo}" style="width:100%; height:100%; object-fit:cover; filter: contrast(1.1) brightness(1.1); image-rendering: -webkit-optimize-contrast;"></div>` : ''}

            <div style="display:grid; grid-template-columns: 1fr 1.5fr; gap:30px; flex:1;">
                <div>
                    <div style="background:#000; color:white; padding:15px; font-weight:700; margin-bottom:20px; box-shadow:5px 5px 0px ${s.color};">${this.t('resume.section.contact').toUpperCase()}</div>
                    <div style="background:white; border:3px solid black; padding:20px; font-size:12px; font-family:'Inter'; font-weight:600; margin-bottom:30px;">
                        ${[p.email, p.phone, p.address, p.website].filter(x => x).map(x => `<div style="margin-bottom:5px; border-bottom:1px solid #eee;">${x}</div>`).join('')}
                    </div>

                    <div style="background:#000; color:white; padding:15px; font-weight:700; margin-bottom:20px; box-shadow:5px 5px 0px ${s.color};">${this.t('resume.section.skills').toUpperCase()}</div>
                    <div style="display:flex; flex-wrap:wrap; gap:10px;">
                        ${s.skills.split(',').map(k => `<div style="background:white; border:2px solid black; padding:5px 10px; font-size:11px; font-weight:700;">${k.trim()}</div>`).join('')}
                    </div>

                    ${s.certificates.length > 0 ? `
                                <div style="background:#000; color:white; padding:15px; font-weight:700; margin-bottom:20px; box-shadow:5px 5px 0px ${s.color}; margin-top:30px;">${this.t('resume.section.certificates').toUpperCase()}</div>
                                <div style="background:white; border:3px solid black; padding:20px; font-size:12px; font-family:'Inter'; font-weight:600;">
                                    ${s.certificates.map(c => `
                                        <div style="margin-bottom:10px;">
                                            <div style="font-weight:700; font-size:13px;">${c.title}</div>
                                            <div style="font-size:11px; color:#666;">${c.issuer} (${c.date})</div>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : ''}
                    
                    ${s.references.length > 0 ? `
                        <div style="background:#000; color:white; padding:15px; font-weight:700; margin-bottom:20px; box-shadow:5px 5px 0px ${s.color}; margin-top:30px;">${this.t('resume.section.references').toUpperCase()}</div>
                        <div style="background:white; border:3px solid black; padding:20px; font-size:12px; font-family:'Inter'; font-weight:600;">
                            ${s.references.map(r => `
                                <div style="margin-bottom:10px;">
                                    <div style="font-weight:700; font-size:13px;">${r.name}</div>
                                    <div style="font-size:11px; color:#666;">${r.position} @ ${r.company}</div>
                                    <div style="font-size:10px; color:#999;">${r.email}</div>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>

                <div>
                    ${s.experience.map(e => `
                                <div style="background:white; border:4px solid black; padding:20px; margin-bottom:30px; position:relative; transition:transform 0.2s;">
                                    <div style="position:absolute; top:-15px; right:20px; background:${s.color}; border:2px solid black; padding:2px 10px; font-weight:700; font-size:12px;">${e.date}</div>
                                    <h3 style="margin:0; font-size:20px;">${e.role}</h3>
                                    <div style="font-size:14px; font-weight:700; text-decoration:underline;">@ ${e.company}</div>
                                    <p style="font-family:'Inter'; font-size:13px; line-height:1.5; margin-top:15px;">${e.description}</p>
                                </div>
                            `).join('')}
                </div>
            </div>
                </div>
                `;
        }

        // --- 6. GRID THEME (Cards, Dashboard) ---
        else if (s.theme === 'grid') {
            t.innerHTML = `
                <div class="theme-root" style="background:#f3f4f6; padding:30px; font-family:'Inter', sans-serif; color:#1f2937; height:100%; min-height:297mm; box-sizing:border-box; display:flex; flex-direction:column;">
                    <div style="display:grid; grid-template-columns: 1fr 2fr; grid-template-rows: 1fr auto auto; gap:20px; flex:1;">

                        <!-- CARD 1: IDENTITY -->
                        <div style="background:white; padding:30px; border-radius:16px; display:flex; flex-direction:column; align-items:center; text-align:center; grid-column: span 1; height:fit-content;">
                            ${p.photo ? `<img src="${p.photo}" style="width:100px; height:100px; border-radius:30px; margin-bottom:20px; object-fit:cover; filter: contrast(1.1) brightness(1.1); image-rendering: -webkit-optimize-contrast;">` : ''}
                            <h2 style="margin:0; font-size:22px; font-weight:800;">${p.name}</h2>
                            <div style="color:${s.color}; font-weight:600; margin-top:5px;">${p.title}</div>
                            <!-- ... contacts ... -->
                            <div style="width:100%; margin-top:30px; text-align:left; font-size:13px; color:#6b7280; display:flex; flex-direction:column; gap:10px;">
                                ${p.email ? `<div style="background:#f9fafb; padding:10px; border-radius:8px;">📧 ${p.email}</div>` : ''}
                                ${p.phone ? `<div style="background:#f9fafb; padding:10px; border-radius:8px;">📱 ${p.phone}</div>` : ''}
                                ${p.address ? `<div style="background:#f9fafb; padding:10px; border-radius:8px;">📍 ${p.address}</div>` : ''}
                                ${p.website ? `<div style="background:#f9fafb; padding:10px; border-radius:8px;">🔗 ${p.website}</div>` : ''}
                            </div>
                        </div>

                        <!-- CARD 2: SUMMARY & EXP -->
                        <div style="display:flex; flex-direction:column; gap:20px;">
                            ${p.summary ? `
                             <div style="background:white; padding:25px; border-radius:16px;">
                                <div style="font-size:12px; font-weight:700; color:#9ca3af; margin-bottom:10px;">${this.t('resume.section.profile').toUpperCase()}</div>
                                <div style="font-size:14px; line-height:1.6;">${p.summary}</div>
                             </div>` : ''}

                            <div style="background:white; padding:25px; border-radius:16px; flex:1;">
                                <div style="font-size:12px; font-weight:700; color:#9ca3af; margin-bottom:20px;">${this.t('resume.section.experience').toUpperCase()}</div>
                                ${s.experience.map(e => `
                                    <div style="display:flex; gap:15px; margin-bottom:25px;">
                                        <div style="flex-shrink:0; width:40px; height:40px; background:${s.color}15; color:${s.color}; border-radius:10px; display:flex; align-items:center; justify-content:center; font-weight:700;">💼</div>
                                        <div>
                                            <div style="font-weight:700; font-size:15px;">${e.role}</div>
                                            <div style="font-size:12px; color:#6b7280;">${e.company} • ${e.date}</div>
                                            <div style="font-size:13px; margin-top:5px; color:#374151;">${e.description}</div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- CARD 3: SKILLS -->
                        <div style="background:white; padding:25px; border-radius:16px; grid-column: 1 / -1;">
                            <div style="font-size:12px; font-weight:700; color:#9ca3af; margin-bottom:15px;">${this.t('resume.section.expertise').toUpperCase()}</div>
                            <div style="display:flex; flex-wrap:wrap; gap:10px;">
                                ${s.skills.split(',').map(k => `
                                    <div style="background:${s.color}; color:${contrast}; padding:8px 16px; border-radius:100px; font-size:12px; font-weight:600;">${k.trim()}</div>
                                `).join('')}
                            </div>
                        </div>

                        ${s.certificates.length > 0 ? `
                             <div style="background:white; padding:25px; border-radius:16px; grid-column: span 1;">
                                 <div style="font-size:12px; font-weight:700; color:#9ca3af; margin-bottom:15px;">${this.t('resume.section.certificates').toUpperCase()}</div>
                                 ${s.certificates.map(c => `
                                    <div style="margin-bottom:10px; border-bottom:1px solid #f3f4f6; padding-bottom:10px;">
                                        <div style="font-weight:700; font-size:13px;">${c.title}</div>
                                        <div style="font-size:11px; color:#6b7280;">${c.issuer}</div>
                                    </div>
                                 `).join('')}
                            </div>
                        ` : ''}
                        
                        ${s.references.length > 0 ? `
                             <div style="background:white; padding:25px; border-radius:16px; grid-column: span 1;">
                                 <div style="font-size:12px; font-weight:700; color:#9ca3af; margin-bottom:15px;">${this.t('resume.section.references').toUpperCase()}</div>
                                 ${s.references.map(r => `
                                    <div style="margin-bottom:10px; border-bottom:1px solid #f3f4f6; padding-bottom:10px;">
                                        <div style="font-weight:700; font-size:13px;">${r.name}</div>
                                        <div style="font-size:11px; color:#6b7280;">${r.position}, ${r.company}</div>
                                        <div style="font-size:10px; color:#9ca3af;">${r.email}</div>
                                    </div>
                                 `).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
                `;
        }

        // --- 7. MINIMAL THEME ---
        else if (s.theme === 'minimal') {
            t.innerHTML = `
                <div class="theme-root" style="padding:60px; font-family:'Inter', sans-serif; color:#333;" >
                    <div style="margin-bottom:50px;">
                        <h1 style="font-size:32px; font-weight:300; letter-spacing:-0.5px; margin:0 0 10px 0;">${p.name.toUpperCase()}</h1>
                        <div style="color:${s.color}; font-size:14px; font-weight:600; letter-spacing:1px; text-transform:uppercase;">${p.title}</div>
                        <div style="margin-top:20px; font-size:13px; color:#666; display:flex; gap:20px;">
                            ${[p.email, p.phone, p.address, p.website].filter(Boolean).map(x => `<span>${x}</span>`).join('<span style="color:#ddd">|</span>')}
                        </div>
                    </div>

                    <div style="display:grid; grid-template-columns: 1fr 3fr; gap:40px;">
                        <!-- Left Col -->
                        <div>
                            ${p.photo ? `<img src="${p.photo}" style="width:100px; height:100px; border-radius:50%; margin-bottom:30px; object-fit:cover; filter:grayscale(100%) contrast(1.1) brightness(1.1); image-rendering: -webkit-optimize-contrast;">` : ''}

                             <div style="margin-bottom:30px;">
                                <div style="font-size:11px; font-weight:700; text-transform:uppercase; margin-bottom:15px; letter-spacing:1px;">${this.t('resume.section.skills')}</div>
                                <div style="font-size:13px; line-height:1.6; color:#555;">
                                    ${s.skills.split(',').map(k => `<div style="margin-bottom:5px;">${k.trim()}</div>`).join('')}
                                </div>
                            </div>
                            
                            ${s.education.length ? `
                            <div style="margin-bottom:30px;">
                                <div style="font-size:11px; font-weight:700; text-transform:uppercase; margin-bottom:15px; letter-spacing:1px;">${this.t('resume.section.education')}</div>
                                ${s.education.map(ed => `
                                    <div style="margin-bottom:15px;">
                                        <div style="font-weight:600; font-size:13px;">${ed.degree}</div>
                                        <div style="font-size:12px; color:#888;">${ed.school}</div>
                                        <div style="font-size:12px; color:#aaa;">${ed.date}</div>
                                    </div>
                                `).join('')}
                            </div>
                            ` : ''}
                        </div>

                        <!-- Right Col -->
                        <div>
                            ${p.summary ? `
                            <div style="margin-bottom:40px;">
                                <p style="font-size:15px; line-height:1.7; color:#444; margin:0;">${p.summary}</p>
                            </div>` : ''}

                            <div>
                                <div style="font-size:11px; font-weight:700; text-transform:uppercase; margin-bottom:25px; letter-spacing:1px; border-bottom:1px solid #eee; padding-bottom:10px;">${this.t('resume.section.experience')}</div>
                                ${s.experience.map(e => `
                                    <div style="margin-bottom:35px;">
                                        <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:8px;">
                                            <div style="font-weight:600; font-size:16px;">${e.role}</div>
                                            <div style="font-size:12px; color:${s.color}; font-weight:600;">${e.date}</div>
                                        </div>
                                        <div style="font-size:13px; font-weight:500; color:#666; margin-bottom:8px;">${e.company}</div>
                                        <div style="font-size:14px; line-height:1.6; color:#444;">${e.description}</div>
                                    </div>
                                `).join('')}
                            </div>
                            
                            ${s.certificates.length > 0 ? `
                                <div style="margin-top:40px;">
                                    <div style="font-size:11px; font-weight:700; text-transform:uppercase; margin-bottom:20px; letter-spacing:1px; border-bottom:1px solid #eee; padding-bottom:10px;">${this.t('resume.section.certificates')}</div>
                                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                                    ${s.certificates.map(c => `
                                        <div>
                                            <div style="font-weight:600; font-size:14px;">${c.title}</div>
                                            <div style="font-size:12px; color:#888;">${c.issuer} (${c.date})</div>
                                        </div>
                                    `).join('')}
                                    </div>
                                </div>
                            ` : ''}
                            
                            ${s.references.length > 0 ? `
                                <div style="margin-top:40px;">
                                    <div style="font-size:11px; font-weight:700; text-transform:uppercase; margin-bottom:20px; letter-spacing:1px; border-bottom:1px solid #eee; padding-bottom:10px;">${this.t('resume.section.references')}</div>
                                    ${s.references.map(r => `
                                        <div style="margin-bottom:15px;">
                                            <div style="font-weight:600; font-size:14px;">${r.name}</div>
                                            <div style="font-size:12px; color:#666;">${r.position}, ${r.company}</div>
                                            <div style="font-size:11px; color:#999;">${r.email}${r.phone ? ` • ${r.phone}` : ''}</div>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
                `;
        }

        // --- 8. COMPACT THEME ---
        else if (s.theme === 'compact') {
            // Calculate content density for dynamic scaling
            const contentScore =
                (p.summary ? p.summary.length : 0) +
                (s.experience.reduce((acc, e) => acc + e.description.length + 50, 0)) +
                (s.skills.length) +
                (s.certificates.length * 40) +
                (s.references.length * 40);

            // Scale factor: low content = 1.2 (bigger), high content = 0.85 (smaller)
            const scale = Math.max(0.85, Math.min(1.2, 1.5 - (contentScore / 2000)));

            // Dynamic sizing
            const sizes = {
                padding: Math.round(25 * scale),
                photo: Math.round(70 * scale),
                nameSize: Math.round(26 * scale),
                titleSize: Math.round(14 * scale),
                contactSize: Math.round(11 * scale),
                headerPadding: Math.round(12 * scale),
                headerMargin: Math.round(15 * scale),
                sectionTitleSize: Math.round(12 * scale),
                sectionMargin: Math.round(15 * scale),
                roleSize: Math.round(12 * scale),
                textSize: Math.round(10 * scale),
                smallTextSize: Math.round(9 * scale),
                skillSize: Math.round(10 * scale),
                itemMargin: Math.round(10 * scale),
                gap: Math.round(4 * scale)
            };

            t.innerHTML = `
                <div class="theme-root" style="padding:${sizes.padding}px ${sizes.padding + 5}px; font-family:'Roboto Condensed', sans-serif; color:#1e293b;" >
                    <div style="display:flex; gap:${sizes.gap * 3}px; border-bottom:2px solid ${s.color}; padding-bottom:${sizes.headerPadding}px; margin-bottom:${sizes.headerMargin}px; align-items:center;">
                        ${p.photo ? `<img src="${p.photo}" style="width:${sizes.photo}px; height:${sizes.photo}px; border-radius:6px; object-fit:cover; filter: contrast(1.1) brightness(1.1); image-rendering: -webkit-optimize-contrast;">` : ''}
                        <div style="flex:1;">
                            <h1 style="font-size:${sizes.nameSize}px; font-weight:700; margin:0; line-height:1;">${p.name}</h1>
                            <div style="font-size:${sizes.titleSize}px; color:${s.color}; font-weight:700; text-transform:uppercase; margin-top:3px;">${p.title}</div>
                        </div>
                        <div style="text-align:right; font-size:${sizes.contactSize}px; line-height:1.4;">
                            <div>${p.email}</div>
                            <div>${p.phone}</div>
                            <div>${p.address}</div>
                            ${p.website ? `<div>${p.website}</div>` : ''}
                        </div>
                    </div>

                    <div style="column-count: 2; column-gap: ${sizes.gap * 5}px;">
                         ${p.summary ? `
                         <div style="break-inside: avoid; margin-bottom:${sizes.sectionMargin}px;">
                            <h3 style="font-size:${sizes.sectionTitleSize}px; font-weight:700; text-transform:uppercase; border-bottom:1px solid #e2e8f0; margin-bottom:${sizes.gap * 1.5}px; padding-bottom:3px;">${this.t('resume.section.profile')}</h3>
                            <p style="font-size:${sizes.textSize}px; line-height:1.4; margin:0;">${p.summary}</p>
                         </div>` : ''}

                         <div style="break-inside: avoid; margin-bottom:${sizes.sectionMargin}px;">
                            <h3 style="font-size:${sizes.sectionTitleSize}px; font-weight:700; text-transform:uppercase; border-bottom:1px solid #e2e8f0; margin-bottom:${sizes.gap * 1.5}px; padding-bottom:3px;">${this.t('resume.section.experience')}</h3>
                            ${s.experience.map(e => `
                                <div style="margin-bottom:${sizes.itemMargin}px;">
                                    <div style="font-weight:700; font-size:${sizes.roleSize}px;">${e.role}</div>
                                    <div style="font-size:${sizes.textSize}px; color:${s.color}; font-weight:700;">${e.company} <span style="color:#94a3b8; font-weight:400;">| ${e.date}</span></div>
                                    <div style="font-size:${sizes.textSize}px; line-height:1.3; margin-top:2px;">${e.description}</div>
                                </div>
                            `).join('')}
                         </div>

                         <div style="break-inside: avoid; margin-bottom:${sizes.sectionMargin}px;">
                            <h3 style="font-size:${sizes.sectionTitleSize}px; font-weight:700; text-transform:uppercase; border-bottom:1px solid #e2e8f0; margin-bottom:${sizes.gap * 1.5}px; padding-bottom:3px;">${this.t('resume.section.skills')}</h3>
                            <div style="display:flex; flex-wrap:wrap; gap:${sizes.gap}px;">
                                ${s.skills.split(',').map(k => `<span style="border:1px solid #cbd5e1; padding:2px ${sizes.gap + 1}px; border-radius:3px; font-size:${sizes.skillSize}px; font-weight:600;">${k.trim()}</span>`).join('')}
                            </div>
                         </div>
                         
                         ${s.certificates.length > 0 ? `
                         <div style="break-inside: avoid; margin-bottom:${sizes.sectionMargin}px;">
                            <h3 style="font-size:${sizes.sectionTitleSize}px; font-weight:700; text-transform:uppercase; border-bottom:1px solid #e2e8f0; margin-bottom:${sizes.gap * 1.5}px; padding-bottom:3px;">${this.t('resume.section.certificates')}</h3>
                            ${s.certificates.map(c => `
                                <div style="margin-bottom:${Math.round(sizes.gap * 1.2)}px; font-size:${sizes.textSize}px;">
                                    <span style="font-weight:700;">${c.title}</span> - <span style="color:#64748b;">${c.issuer}</span>
                                </div>
                            `).join('')}
                         </div>
                         ` : ''}
                         
                         ${s.references.length > 0 ? `
                         <div style="break-inside: avoid; margin-bottom:${sizes.sectionMargin}px;">
                            <h3 style="font-size:${sizes.sectionTitleSize}px; font-weight:700; text-transform:uppercase; border-bottom:1px solid #e2e8f0; margin-bottom:${sizes.gap * 1.5}px; padding-bottom:3px;">${this.t('resume.section.references')}</h3>
                            ${s.references.map(r => `
                                <div style="margin-bottom:${Math.round(sizes.gap * 1.2)}px; font-size:${sizes.textSize}px;">
                                    <span style="font-weight:700;">${r.name}</span> - <span style="color:#64748b;">${r.position}, ${r.company}</span>
                                    <div style="font-size:${sizes.smallTextSize}px; color:#94a3b8;">${r.email}</div>
                                </div>
                            `).join('')}
                         </div>
                         ` : ''}
                    </div>
                </div>
                `;
        }

        // --- 10. CORPORATE (CLASSIC) THEME ---
        else if (s.theme === 'corporate') {
            t.innerHTML = `
                <div class="theme-root" style="padding:50px; font-family:'Georgia', serif; color:#333;" >
                    <div style="border-bottom:4px solid ${s.color}; padding-bottom:20px; margin-bottom:30px; display:flex; justify-content:space-between; align-items:flex-end;">
                        <div>
                            <h1 style="font-size:36px; margin:0; font-weight:bold; color:#111;">${p.name}</h1>
                            <div style="font-size:18px; color:${s.color}; font-style:italic; margin-top:5px; font-family:'Arial', sans-serif;">${p.title}</div>
                        </div>
                        ${p.photo ? `<img src="${p.photo}" style="width:80px; height:80px; object-fit:cover; border:1px solid #ccc; padding:3px; filter: contrast(1.1) brightness(1.1); image-rendering: -webkit-optimize-contrast;">` : ''}
                    </div>
                    
                    <div style="font-family:'Arial', sans-serif; font-size:12px; margin-bottom:30px; color:#555;">
                        <b>${this.t('resume.location')}:</b> ${p.address} &bull; <b>${this.t('resume.phone')}:</b> ${p.phone} &bull; <b>${this.t('resume.email')}:</b> ${p.email}${p.website ? ` &bull; <b>Web:</b> ${p.website}` : ''}
                    </div>

                    ${p.summary ? `
                    <div style="margin-bottom:25px;">
                        <h3 style="font-family:'Arial', sans-serif; font-size:14px; font-weight:bold; text-transform:uppercase; background:#f5f5f5; padding:5px 10px; border-left:4px solid ${s.color}; margin-bottom:15px;">${this.t('resume.section.profile')}</h3>
                        <p style="font-size:14px; line-height:1.6;">${p.summary}</p>
                    </div>` : ''
                }

                    <div style="margin-bottom:25px;">
                        <h3 style="font-family:'Arial', sans-serif; font-size:14px; font-weight:bold; text-transform:uppercase; background:#f5f5f5; padding:5px 10px; border-left:4px solid ${s.color}; margin-bottom:15px;">${this.t('resume.section.experience')}</h3>
                        ${s.experience.map(e => `
                            <div style="margin-bottom:20px;">
                                <div style="display:flex; justify-content:space-between; font-family:'Arial', sans-serif;">
                                    <div style="font-weight:bold; font-size:15px;">${e.company}</div>
                                    <div style="font-size:12px; font-weight:bold;">${e.date}</div>
                                </div>
                                <div style="font-style:italic; font-size:14px; margin-bottom:5px;">${e.role}</div>
                                <div style="font-size:14px; line-height:1.5;">${e.description}</div>
                            </div>
                        `).join('')}
                    </div>

                    <div style="margin-bottom:25px;">
                         <h3 style="font-family:'Arial', sans-serif; font-size:14px; font-weight:bold; text-transform:uppercase; background:#f5f5f5; padding:5px 10px; border-left:4px solid ${s.color}; margin-bottom:15px;">${this.t('resume.section.education')} & ${this.t('resume.section.skills')}</h3>
                         <div style="font-size:14px; line-height:1.6;">
                            ${s.education.map(ed => `<div><b>${ed.degree}</b>, ${ed.school} (${ed.date})</div>`).join('')}
                            <div style="margin-top:10px;"><b>Key Skills:</b> ${s.skills}</div>
                         </div>
                    </div>
                    
                    ${s.certificates.length > 0 ? `
                        <div style="margin-bottom:25px;">
                             <h3 style="font-family:'Arial', sans-serif; font-size:14px; font-weight:bold; text-transform:uppercase; background:#f5f5f5; padding:5px 10px; border-left:4px solid ${s.color}; margin-bottom:15px;">${this.t('resume.section.certificates')}</h3>
                             ${s.certificates.map(c => `
                                <div style="font-size:14px; margin-bottom:5px;">
                                    <b>${c.title}</b> - ${c.issuer} (${c.date})
                                </div>
                             `).join('')}
                        </div>
                    ` : ''}
                    
                    ${s.references.length > 0 ? `
                        <div style="margin-bottom:25px;">
                             <h3 style="font-family:'Arial', sans-serif; font-size:14px; font-weight:bold; text-transform:uppercase; background:#f5f5f5; padding:5px 10px; border-left:4px solid ${s.color}; margin-bottom:15px;">${this.t('resume.section.references')}</h3>
                             ${s.references.map(r => `
                                <div style="font-size:14px; margin-bottom:5px;">
                                    <b>${r.name}</b> - ${r.position}, ${r.company}
                                    <div style="font-size:12px; color:#666;">${r.email}</div>
                                </div>
                             `).join('')}
                        </div>
                    ` : ''}
                </div>
                </div>
                `;
        }

        // --- 9. TIMELINE THEME ---
        else if (s.theme === 'timeline') {
            t.innerHTML = `
                <div class="theme-root" style="padding:0; display:flex; color:#333; font-family:'Inter', sans-serif;" >
                     <div style="width:35%; background:#2c3e50; color:white; padding:50px 30px; min-height:297mm;">
                        <!-- Fixed dark background, white text is safe here -->
                        <div style="text-align:center; margin-bottom:40px;">
                             ${p.photo ? `<img src="${p.photo}" style="width:120px; height:120px; border-radius:50%; border:5px solid ${s.color}; box-shadow:0 10px 20px rgba(0,0,0,0.3); margin-bottom:20px; object-fit:cover; filter: contrast(1.1) brightness(1.1); image-rendering: -webkit-optimize-contrast;">` : ''}
                             <h2 style="font-size:24px; margin:0;">${p.name}</h2>
                             <div style="color:${s.color}; font-size:14px; margin-top:5px; font-weight:600;">${p.title}</div>
                        </div>
                        
                        <div style="margin-bottom:40px;">
                             <div style="font-size:12px; font-weight:700; color:${s.color}; margin-bottom:15px; letter-spacing:1px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:5px;">${this.t('resume.section.contact').toUpperCase()}</div>
                             <div style="font-size:13px; opacity:0.8; display:flex; flex-direction:column; gap:10px;">
                                 <div>${p.email}</div>
                                 <div>${p.phone}</div>
                                 <div>${p.address}</div>
                                 ${p.website ? `<div>${p.website}</div>` : ''}
                             </div>
                        </div>

                        <div>
                             <div style="font-size:12px; font-weight:700; color:${s.color}; margin-bottom:15px; letter-spacing:1px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:5px;">${this.t('resume.section.skills').toUpperCase()}</div>
                             <div style="display:flex; flex-wrap:wrap; gap:8px;">
                                 ${s.skills.split(',').map(k => `<span style="background:rgba(255,255,255,0.1); padding:4px 8px; border-radius:4px; font-size:12px;">${k.trim()}</span>`).join('')}
                             </div>
                        </div>
                     </div>
                     <!-- ... Right side unchanged ... -->
                <div style="width:65%; padding:50px;">
                    ${p.summary ? `
                        <div style="margin-bottom:40px; background:${s.color}15; padding:20px; border-left:4px solid ${s.color}; border-radius:0 8px 8px 0;">
                             <p style="margin:0; font-size:14px; line-height:1.6; color:#555;">${p.summary}</p>
                        </div>` : ''}

                    <div>
                        <h3 style="font-size:18px; color:#2c3e50; border-bottom:2px solid #eee; padding-bottom:10px; margin-bottom:25px;">${this.t('resume.section.experience')}</h3>
                        <div style="border-left:2px solid #eee; padding-left:20px; margin-left:10px;">
                            ${s.experience.map(e => `
                                    <div style="position:relative; margin-bottom:30px;">
                                        <div style="position:absolute; left:-27px; top:5px; width:12px; height:12px; background:${s.color}; border-radius:50%; border:2px solid white; box-shadow:0 0 0 2px ${s.color};"></div>
                                        <div style="font-size:16px; font-weight:700; color:#2c3e50;">${e.role}</div>
                                        <div style="font-size:13px; color:${s.color}; font-weight:600; margin:2px 0 8px;">${e.company}</div>
                                        <div style="font-size:14px; line-height:1.6; color:#666;">${e.description}</div>
                                    </div>
                                `).join('')}
                        </div>

                        ${s.certificates.length > 0 ? `
                                <div style="border-left:2px solid #eee; padding-left:20px; margin-left:10px; margin-top:30px;">
                                    <h3 style="font-size:16px; color:#2c3e50; margin-bottom:20px;">${this.t('resume.section.certificates')}</h3>
                                    ${s.certificates.map(c => `
                                        <div style="position:relative; margin-bottom:15px;">
                                             <div style="position:absolute; left:-27px; top:5px; width:12px; height:12px; background:white; border-radius:50%; border:2px solid ${s.color};"></div>
                                             <div style="font-weight:700; font-size:14px;">${c.title}</div>
                                             <div style="font-size:12px; color:#666;">${c.issuer}, ${c.date}</div>
                                        </div>
                                    `).join('')}
                                </div>
                             ` : ''}
                             
                             ${s.references.length > 0 ? `
                                <div style="border-left:2px solid #eee; padding-left:20px; margin-left:10px; margin-top:30px;">
                                    <h3 style="font-size:16px; color:#2c3e50; margin-bottom:20px;">${this.t('resume.section.references')}</h3>
                                    ${s.references.map(r => `
                                        <div style="position:relative; margin-bottom:15px;">
                                             <div style="position:absolute; left:-27px; top:5px; width:12px; height:12px; background:white; border-radius:50%; border:2px solid ${s.color};"></div>
                                             <div style="font-weight:700; font-size:14px;">${r.name}</div>
                                             <div style="font-size:12px; color:#666;">${r.position}, ${r.company}</div>
                                             <div style="font-size:11px; color:#999;">${r.email}</div>
                                        </div>
                                    `).join('')}
                                </div>
                             ` : ''}
                    </div>
                </div>
                </div>
                `;
        }

        // --- 11. STARTUP THEME (Modern, Bold) ---
        else if (s.theme === 'startup') {
            t.innerHTML = `
                <div class="theme-root" style="padding:0; background:white; font-family:'Montserrat', sans-serif; color:#2d3748;" >
                     <div style="background:${s.color}; padding:60px 50px; color:${contrast}; clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);">
                         <h1 style="font-size:48px; margin:0; font-weight:900; letter-spacing:-1px;">${p.name}</h1>
                         <div style="font-size:20px; margin-top:5px; opacity:0.9; font-weight:500;">${p.title}</div>
                         <div style="margin-top:20px; font-size:13px; font-weight:500; display:flex; gap:20px; align-items:center;">
                            <span>✉️ ${p.email}</span>
                            <span>📱 ${p.phone}</span>
                            ${p.website ? `<span>🔗 ${p.website}</span>` : ''}
                            ${p.photo ? `<img src="${p.photo}" style="width:80px; height:80px; border-radius:50%; border:3px solid ${contrast}; margin-left:auto; object-fit:cover; filter: contrast(1.1) brightness(1.1); image-rendering: -webkit-optimize-contrast;">` : ''}
                         </div>
                     </div>
                     <!-- ... Rest of Startup theme ... -->
                <div style="padding:20px 50px;">
                    <div style="display:grid; grid-template-columns: 2fr 1fr; gap:40px;">
                        <div>
                            ${p.summary ? `
                                <div style="margin-bottom:40px;">
                                     <h3 style="font-size:16px; font-weight:800; color:${s.color}; text-transform:uppercase; margin-bottom:15px;">${this.t('resume.section.profile')}</h3>
                                     <p style="font-size:15px; line-height:1.7; color:#4a5568;">${p.summary}</p>
                                </div>` : ''}

                            <div>
                                <h3 style="font-size:16px; font-weight:800; color:${s.color}; text-transform:uppercase; margin-bottom:20px;">${this.t('resume.section.experience')}</h3>
                                ${s.experience.map(e => `
                                        <div style="margin-bottom:30px;">
                                            <div style="font-size:18px; font-weight:800;">${e.role}</div>
                                            <div style="color:${s.color}; font-size:13px; font-weight:700; margin-bottom:8px;">${e.company}</div>
                                            <div style="font-size:14px; line-height:1.6; color:#4a5568;">${e.description}</div>
                                        </div>
                                     `).join('')}
                            </div>
                        </div>

                        <div>
                            <h3 style="font-size:16px; font-weight:800; color:${s.color}; text-transform:uppercase; margin-bottom:20px;">${this.t('resume.section.expertise').toUpperCase()}</h3>
                            <div style="display:flex; flex-direction:column; gap:10px;">
                                ${s.skills.split(',').map(k => `
                                        <div style="background:#edf2f7; padding:10px 15px; border-radius:8px; font-size:13px; font-weight:600; color:#2d3748; border-left:4px solid ${s.color};">
                                            ${k.trim()}
                                        </div>
                                     `).join('')}
                            </div>

                            ${s.certificates.length > 0 ? `
                                    <h3 style="font-size:16px; font-weight:800; color:${s.color}; text-transform:uppercase; margin-bottom:20px; margin-top:40px;">${this.t('resume.section.certificates')}</h3>
                                    ${s.certificates.map(c => `
                                        <div style="margin-bottom:15px;">
                                            <div style="font-weight:800; font-size:14px;">${c.title}</div>
                                            <div style="font-size:12px; opacity:0.7;">${c.issuer}</div>
                                        </div>
                                    `).join('')}
                                ` : ''}
                                
                                ${s.references.length > 0 ? `
                                    <h3 style="font-size:16px; font-weight:800; color:${s.color}; text-transform:uppercase; margin-bottom:20px; margin-top:40px;">${this.t('resume.section.references')}</h3>
                                    ${s.references.map(r => `
                                        <div style="margin-bottom:15px;">
                                            <div style="font-weight:800; font-size:14px;">${r.name}</div>
                                            <div style="font-size:12px; opacity:0.7;">${r.position}, ${r.company}</div>
                                            <div style="font-size:11px; opacity:0.6;">${r.email}</div>
                                        </div>
                                    `).join('')}
                                ` : ''}
                        </div>
                    </div>
                </div>
                </div>
                `;
        }

        // --- 12. ACADEMIC THEME (Scholar, Clean) ---
        else if (s.theme === 'academic') {
            t.innerHTML = `
                <div class="theme-root" style="padding:60px; font-family:'Garamond', 'Cormorant Garamond', serif; color:#000;" >
                     <div style="text-align:center; border-bottom:1px solid #000; padding-bottom:20px; margin-bottom:30px;">
                         ${p.photo ? `<img src="${p.photo}" style="width:100px; height:100px; object-fit:cover; margin-bottom:15px; border:1px solid #000; padding:4px; filter: contrast(1.1) brightness(1.1); image-rendering: -webkit-optimize-contrast;">` : ''}
                         <h1 style="font-size:32px; margin:0; text-transform:uppercase; letter-spacing:2px;">${p.name}</h1>
                         <div style="font-style:italic; font-size:16px; margin-top:5px;">${p.title}</div>
                         <div style="font-size:14px; margin-top:10px;">${p.address} • ${p.email} • ${p.phone}${p.website ? ` • ${p.website}` : ''}</div>
                     </div>

                     <div style="margin-bottom:30px;">
                        <div style="font-weight:bold; font-size:16px; text-transform:uppercase; margin-bottom:10px; border-bottom:1px solid #ccc;">${this.t('resume.section.education')}</div>
                        ${s.education.map(ed => `
                            <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                                <div><b>${ed.school}</b>, ${ed.degree}</div>
                                <div>${ed.date}</div>
                            </div>
                        `).join('')}
                     </div>

                     <div style="margin-bottom:30px;">
                        <div style="font-weight:bold; font-size:16px; text-transform:uppercase; margin-bottom:10px; border-bottom:1px solid #ccc;">${this.t('resume.section.experience')}</div>
                        ${s.experience.map(e => `
                            <div style="margin-bottom:15px;">
                                <div style="display:flex; justify-content:space-between;">
                                    <div><b>${e.company}</b> - ${e.role}</div>
                                    <div>${e.date}</div>
                                </div>
                                <div style="font-size:15px; margin-top:5px; text-align:justify;">${e.description}</div>
                            </div>
                        `).join('')}
                     </div>

                     <div style="margin-bottom:30px;">
                        <div style="font-weight:bold; font-size:16px; text-transform:uppercase; margin-bottom:10px; border-bottom:1px solid #ccc;">${this.t('resume.section.skills')} & ${this.t('resume.section.expertise')}</div>
                         <div style="font-size:15px; line-height:1.6;">
                             ${s.skills}
                         </div>
                      </div>

                      ${s.certificates.length > 0 ? `
                        <div style="margin-bottom:30px;">
                           <div style="font-weight:bold; font-size:16px; text-transform:uppercase; margin-bottom:10px; border-bottom:1px solid #ccc;">${this.t('resume.section.certificates')}</div>
                           ${s.certificates.map(c => `
                               <div style="margin-bottom:5px;">
                                   <b>${c.title}</b>, ${c.issuer} (${c.date})
                               </div>
                           `).join('')}
                        </div>
                      ` : ''}
                      
                      ${s.references.length > 0 ? `
                        <div style="margin-bottom:30px;">
                           <div style="font-weight:bold; font-size:16px; text-transform:uppercase; margin-bottom:10px; border-bottom:1px solid #ccc;">${this.t('resume.section.references')}</div>
                           ${s.references.map(r => `
                               <div style="margin-bottom:5px;">
                                   <b>${r.name}</b>, ${r.position}, ${r.company}
                                   <div style="font-size:13px; color:#666;">${r.email}</div>
                               </div>
                           `).join('')}
                        </div>
                      ` : ''}
                </div>
                `;
        }

        // --- 13. INFOGRAPHIC THEME ---
        else if (s.theme === 'infographic') {
            const contrast = this.getContrastColor(s.color);
            t.innerHTML = `
                <div class="theme-root" style="height:100%; min-height:297mm; box-sizing:border-box; padding:25px; font-family:'Inter',sans-serif; background:linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); display:flex; flex-direction:column;">
                    <div style="background:white; padding:25px; border-radius:15px; box-shadow:0 10px 30px rgba(0,0,0,0.1); flex:1;">
                        <div style="display:flex; gap:20px; margin-bottom:25px; align-items:center;">
                            ${p.photo ? `<div style="position:relative; flex-shrink:0;"><img src="${p.photo}" style="width:100px; height:100px; border-radius:50%; object-fit:cover; border:4px solid ${s.color};"><div style="position:absolute; bottom:2px; right:2px; width:24px; height:24px; background:${s.color}; border-radius:50%; border:3px solid white;"></div></div>` : ''}
                            <div style="flex:1;">
                                <h1 style="font-size:32px; font-weight:900; margin:0; line-height:1.1; color:${s.color};">${p.name}</h1>
                                <div style="font-size:16px; color:#555; font-weight:600; margin-top:4px;">${p.title}</div>
                                <div style="display:flex; gap:15px; margin-top:10px; flex-wrap:wrap; font-size:12px; color:#444;">
                                    ${p.address ? `<div style="display:flex; align-items:center; gap:4px;">📍 ${p.address}</div>` : ''}
                                    ${p.email ? `<div style="display:flex; align-items:center; gap:4px;">✉ ${p.email}</div>` : ''}
                                    ${p.phone ? `<div style="display:flex; align-items:center; gap:4px;">📱 ${p.phone}</div>` : ''}
                                    ${p.website ? `<div style="display:flex; align-items:center; gap:4px;">🔗 ${p.website}</div>` : ''}
                                </div>
                            </div>
                        </div>

                        ${p.summary ? `
                        <div style="background:${s.color}10; padding:15px; border-radius:10px; border-left:4px solid ${s.color}; margin-bottom:20px;">
                            <h3 style="font-size:13px; font-weight:800; color:${s.color}; margin:0 0 5px 0; text-transform:uppercase;">📝 ${this.t('resume.section.profile')}</h3>
                            <p style="font-size:12px; line-height:1.5; margin:0; color:#444;">${p.summary}</p>
                        </div>` : ''}

                        <div style="display:grid; grid-template-columns: 1.3fr 1fr; gap:20px;">
                            <!-- Left Column -->
                            <div>
                                <div style="background:white; border:1px solid #eee; padding:15px; border-radius:12px; margin-bottom:15px; box-shadow:0 2px 10px rgba(0,0,0,0.03);">
                                    <h3 style="font-size:14px; font-weight:800; color:${s.color}; margin:0 0 15px 0; padding-bottom:10px; border-bottom:2px solid ${s.color}30;">💼 ${this.t('resume.section.experience')}</h3>
                                    ${s.experience.map(e => `
                                        <div style="margin-bottom:15px; padding-bottom:15px; border-bottom:1px dashed #eee;">
                                            <div style="font-weight:700; font-size:14px; color:#222;">${e.role}</div>
                                            <div style="font-size:11px; color:${s.color}; font-weight:600; margin:2px 0;">${e.company} • ${e.date}</div>
                                            <div style="font-size:11px; color:#555; margin-top:5px; line-height:1.4;">${e.description}</div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                            <!-- Right Column -->
                            <div>
                                <div style="background:${s.color}08; padding:15px; border-radius:12px; margin-bottom:15px;">
                                    <h3 style="font-size:14px; font-weight:800; color:${s.color}; margin:0 0 10px 0;">🎓 ${this.t('resume.section.education')}</h3>
                                    ${s.education.map(ed => `
                                        <div style="margin-bottom:10px; border-bottom:1px solid #fff; padding-bottom:10px;">
                                            <div style="font-weight:700; font-size:12px;">${ed.school}</div>
                                            <div style="font-size:11px; color:#666;">${ed.degree}</div>
                                            <div style="font-size:10px; color:${s.color}; opacity:0.8;">${ed.date}</div>
                                        </div>
                                    `).join('')}
                                </div>

                                <div style="background:${s.color}08; padding:15px; border-radius:12px; margin-bottom:15px;">
                                    <h3 style="font-size:14px; font-weight:800; color:${s.color}; margin:0 0 10px 0;">🎯 ${this.t('resume.section.skills')}</h3>
                                    <div style="display:flex; flex-wrap:wrap; gap:6px;">
                                        ${s.skills.split(',').map(k => `<span style="background:white; color:${s.color}; border:1px solid ${s.color}; padding:4px 10px; border-radius:15px; font-size:10px; font-weight:700;">${k.trim()}</span>`).join('')}
                                    </div>
                                </div>
                                
                                ${s.certificates.length > 0 ? `
                                <div style="background:${s.color}08; padding:15px; border-radius:12px; margin-bottom:15px;">
                                    <h3 style="font-size:14px; font-weight:800; color:${s.color}; margin:0 0 10px 0;">🏆 ${this.t('resume.section.certificates')}</h3>
                                    ${s.certificates.map(c => `
                                        <div style="margin-bottom:8px; font-size:11px; display:flex; align-items:start; gap:5px;">
                                            <span style="color:${s.color};">✓</span>
                                            <div>
                                                <div style="font-weight:700;">${c.title}</div>
                                                <div style="font-size:10px; color:#666;">${c.issuer}</div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>` : ''}

                                ${s.references.length > 0 ? `
                                <div style="background:${s.color}08; padding:15px; border-radius:12px;">
                                    <h3 style="font-size:14px; font-weight:800; color:${s.color}; margin:0 0 10px 0;">👥 ${this.t('resume.section.references')}</h3>
                                    ${s.references.map(r => `
                                        <div style="margin-bottom:8px; font-size:11px;">
                                            <div style="font-weight:700;">${r.name}</div>
                                            <div style="font-size:10px; color:#555;">${r.position}, ${r.company}</div>
                                            <div style="font-size:9px; color:${s.color};">${r.email}</div>
                                        </div>
                                    `).join('')}
                                </div>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        // --- 14. MAGAZINE THEME ---
        else if (s.theme === 'magazine') {
            t.innerHTML = `
                <div class="theme-root" style="height:100%; min-height:297mm; box-sizing:border-box; padding:0; font-family:'Playfair Display',serif; background:#1a1a1a; color:white; display:flex; flex-direction:column;">
                    <div style="background:${s.color}; padding:30px 40px; flex-shrink:0;">
                        <h1 style="font-size:42px; font-weight:900; margin:5px 0; line-height:1;">${p.name}</h1>
                        <div style="font-size:18px; font-style:italic;">${p.title}</div>
                    </div>
                    <div style="padding:30px; background:white; color:#1a1a1a; flex:1; box-sizing:border-box;">
                        <div style="display:flex; gap:30px;">
                            <div style="width:30%;">
                                ${p.photo ? `<img src="${p.photo}" style="width:100%; aspect-ratio:1; object-fit:cover; filter:grayscale(100%); margin-bottom:20px;">` : ''}
                                <div style="margin-bottom:20px;"><h3 style="font-size:12px; font-weight:900; letter-spacing:2px; margin:0 0 10px 0; font-family:'Inter',sans-serif;">${this.t('resume.contact')}</h3><div style="font-family:'Inter',sans-serif; font-size:11px; line-height:1.6;">${p.address ? `<div>${p.address}</div>` : ''}${p.email ? `<div>${p.email}</div>` : ''}${p.phone ? `<div>${p.phone}</div>` : ''}${p.website ? `<div>${p.website}</div>` : ''}</div></div>
                                <div><h3 style="font-size:12px; font-weight:900; letter-spacing:2px; margin:0 0 10px 0; font-family:'Inter',sans-serif;">${this.t('resume.section.skills').toUpperCase()}</h3><div style="font-family:'Inter',sans-serif; font-size:11px;">${s.skills.split(',').map(k => `<div style="border-left:3px solid ${s.color}; padding-left:10px; margin-bottom:4px;">${k.trim()}</div>`).join('')}</div></div>
                            </div>
                            <div style="flex:1;">
                                ${p.summary ? `<div style="margin-bottom:20px;"><div style="font-size:50px; color:${s.color}; opacity:0.2; line-height:0.5;">"</div><p style="font-size:14px; line-height:1.6; font-style:italic; margin:-20px 0 0 20px;">${p.summary}</p></div>` : ''}
                                <h2 style="font-size:24px; margin:0 0 15px 0; border-bottom:3px solid ${s.color}; padding-bottom:5px;">${this.t('resume.section.experience')}</h2>
                                ${s.experience.map(e => `<div style="margin-bottom:20px;"><div style="display:flex; justify-content:space-between;"><h3 style="font-size:18px; margin:0;">${e.role}</h3><div style="font-family:'Inter',sans-serif; font-size:11px; color:${s.color};">${e.date}</div></div><div style="font-family:'Inter',sans-serif; font-size:13px; color:${s.color}; margin:2px 0;">${e.company}</div><p style="font-family:'Inter',sans-serif; font-size:12px; line-height:1.5; margin:5px 0 0 0;">${e.description}</p></div>`).join('')}
                                
                                <h2 style="font-size:24px; margin:25px 0 15px 0; border-bottom:3px solid ${s.color}; padding-bottom:5px;">${this.t('resume.section.education')}</h2>
                                ${s.education.map(ed => `<div style="margin-bottom:15px;"><div style="display:flex; justify-content:space-between;"><h3 style="font-size:16px; margin:0; font-weight:700;">${ed.school}</h3><div style="font-family:'Inter',sans-serif; font-size:11px; color:${s.color};">${ed.date}</div></div><div style="font-family:'Inter',sans-serif; font-size:12px; color:#555; margin-top:2px;">${ed.degree}</div></div>`).join('')}

                                ${s.certificates.length > 0 ? `<h2 style="font-size:24px; margin:25px 0 15px 0; border-bottom:3px solid ${s.color}; padding-bottom:5px;">${this.t('resume.section.certificates')}</h2>${s.certificates.map(c => `<div style="margin-bottom:8px; font-family:'Inter',sans-serif; font-size:12px;"><div style="font-weight:700;">${c.title}</div><div style="opacity:0.7;">${c.issuer}</div></div>`).join('')}` : ''}
                                ${s.references.length > 0 ? `<h2 style="font-size:24px; margin:25px 0 15px 0; border-bottom:3px solid ${s.color}; padding-bottom:5px;">${this.t('resume.section.references')}</h2><div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">${s.references.map(r => `<div style="font-family:'Inter',sans-serif; font-size:12px;"><div style="font-weight:700; font-size:13px;">${r.name}</div><div style="color:${s.color};">${r.position}</div><div style="opacity:0.7;">${r.company}</div><div style="font-size:11px; opacity:0.6; margin-top:2px;">${r.email}</div></div>`).join('')}</div>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        // --- 15. RETRO THEME ---
        else if (s.theme === 'retro') {
            t.innerHTML = `
                <div class="theme-root" style="height:100%; min-height:297mm; box-sizing:border-box; padding:25px; font-family:'Courier New',monospace; background:#f4e8d0;">
                    <div style="background:white; padding:30px; border:8px double #8b7355; box-shadow:10px 10px 0px rgba(0,0,0,0.1); height:100%; box-sizing:border-box;">
                        <div style="text-align:center; border-bottom:4px double #8b7355; padding-bottom:15px; margin-bottom:20px;">
                            ${p.photo ? `<div style="display:inline-block; padding:6px; background:#8b7355; margin-bottom:10px;"><img src="${p.photo}" style="width:90px; height:90px; object-fit:cover; filter:sepia(30%); border:4px solid white;"></div>` : ''}
                            <h1 style="font-size:36px; font-weight:bold; margin:5px 0; letter-spacing:2px; color:#2d1810;">${p.name}</h1>
                            <div style="font-size:16px; font-weight:bold; color:#8b7355; letter-spacing:4px;">— ${p.title} —</div>
                            <div style="margin-top:10px; font-size:12px;">${p.address ? `📍 ${p.address} • ` : ''}${p.email ? `📧 ${p.email}` : ''} ${p.phone ? `• ☎️ ${p.phone}` : ''} ${p.website ? `• 🔗 ${p.website}` : ''}</div>
                        </div>
                        ${p.summary ? `<div style="background:#f9f5f0; border:2px solid #8b7355; padding:15px; margin-bottom:20px; position:relative;"><div style="position:absolute; top:-10px; left:20px; background:white; padding:0 8px; font-weight:bold; color:#8b7355; font-size:11px;">✦ ${this.t('resume.section.profile')} ✦</div><p style="font-size:12px; line-height:1.6; margin:5px 0 0 0; text-align:justify;">${p.summary}</p></div>` : ''}
                        <div style="display:grid; grid-template-columns: 2fr 1fr; gap:20px;">
                            <div>
                                <div style="background:#2d1810; color:white; padding:10px 20px; margin-bottom:20px; text-align:center; font-weight:bold; letter-spacing:2px;">✦ ${this.t('resume.section.experience').toUpperCase()} ✦</div>
                                ${s.experience.map(e => `<div style="margin-bottom:25px; border-left:4px solid #8b7355; padding-left:15px;"><div style="font-weight:bold; font-size:16px; text-decoration:underline;">${e.role}</div><div style="font-size:13px; color:#8b7355; font-weight:bold; margin:3px 0;">${e.company} | ${e.date}</div><div style="font-size:12px; line-height:1.5; margin-top:8px;">${e.description}</div></div>`).join('')}
                                
                                <div style="margin-top:30px;"><div style="background:#2d1810; color:white; padding:10px 20px; margin-bottom:15px; text-align:center; font-weight:bold; letter-spacing:2px;">✦ ${this.t('resume.section.education').toUpperCase()} ✦</div>
                                ${s.education.map(ed => `<div style="margin-bottom:20px; padding-left:15px;"><div style="font-weight:bold; font-size:15px; text-decoration:underline;">${ed.school}</div><div style="font-size:13px; color:#8b7355; font-weight:bold; margin:3px 0;">${ed.degree}</div><div style="font-size:12px;">${ed.date}</div></div>`).join('')}</div>

                                ${s.references.length > 0 ? `<div style="margin-top:30px;"><div style="background:#2d1810; color:white; padding:10px 20px; margin-bottom:15px; text-align:center; font-weight:bold; letter-spacing:2px;">✦ ${this.t('resume.section.references').toUpperCase()} ✦</div>${s.references.map(r => `<div style="margin-bottom:12px; font-size:12px; border:1px dashed #8b7355; padding:10px;"><div style="font-weight:bold;">${r.name}</div><div>${r.position} - ${r.company}</div><div style="font-size:11px; color:#666;">${r.email}</div></div>`).join('')}</div>` : ''}
                            </div>
                            <div>
                                <div style="background:#2d1810; color:white; padding:10px 15px; margin-bottom:15px; text-align:center; font-weight:bold; font-size:12px; letter-spacing:1px;">✦ ${this.t('resume.section.skills').toUpperCase()}</div>
                                <div style="background:#f9f5f0; border:2px solid #8b7355; padding:15px; margin-bottom:20px;">${s.skills.split(',').map(k => `<div style="margin-bottom:5px; font-size:12px;">▸ ${k.trim()}</div>`).join('')}</div>
                                ${s.certificates.length > 0 ? `<div><div style="background:#2d1810; color:white; padding:10px 15px; margin-bottom:15px; text-align:center; font-weight:bold; font-size:12px; letter-spacing:1px;">✦ ${this.t('resume.section.certificates').toUpperCase()}</div><div style="background:#f9f5f0; border:2px solid #8b7355; padding:15px;">${s.certificates.map(c => `<div style="margin-bottom:10px; font-size:11px;"><div style="font-weight:bold;">✓ ${c.title}</div><div style="color:#666;">${c.issuer}</div></div>`).join('')}</div></div>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

    }
    downloadPDF() {
        const originalTitle = document.title;
        const name = this.state.personal.name || 'CV';
        document.title = `CV_${name.replace(/\s+/g, '_')}`;
        window.print();
        setTimeout(() => { document.title = originalTitle; }, 1000);
    }
}

// Initialize the Resume Builder
window.initResumeBuilderLogic = function () {
    window.app = new ResumeBuilder('workspace-body');
};
