/* TULPAR-DevTools Core Utilities */
(function () {
    window.DevTools = {
        // Notification System
        showNotification: function (message, type = 'info') {
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.innerHTML = `<div class="toast-content"><i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i><span>${message}</span></div>`;
            document.body.appendChild(toast);
            if (!document.getElementById('toast-styles')) {
                const style = document.createElement('style');
                style.id = 'toast-styles';
                style.textContent = `.toast { position: fixed; bottom: 20px; right: 20px; padding: 12px 24px; border-radius: 8px; color: white; z-index: 10001; box-shadow: 0 4px 12px rgba(0,0,0,0.3); animation: toastSlideIn 0.3s ease, toastFadeOut 0.3s ease 2.7s; font-family: sans-serif; } .toast-success { background: #10b981; } .toast-error { background: #ef4444; } .toast-info { background: #3b82f6; } .toast-content { display: flex; align-items: center; gap: 10px; } @keyframes toastSlideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } } @keyframes toastFadeOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }`;
                document.head.appendChild(style);
            }
            setTimeout(() => toast.remove(), 3000);
        },

        copyToClipboard: async function (text, btn) {
            try {
                await navigator.clipboard.writeText(text);
                const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
                this.showNotification(isTr ? 'Panoya kopyalandı!' : 'Copied to clipboard!', 'success');
                if (btn) {
                    const originalHTML = btn.innerHTML;
                    btn.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => btn.innerHTML = originalHTML, 2000);
                }
                if (window.AppState) { window.AppState.totalCopies++; if (window.updateStats) window.updateStats(); }
                return true;
            } catch (err) { console.error('Copy failed', err); return false; }
        },

        // --- GENERATORS ---

        randomGenerator: {
            number: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
            uuid: () => {
                if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            },
            randomColor: () => {
                const hex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
                const r = parseInt(hex.substr(1, 2), 16);
                const g = parseInt(hex.substr(3, 2), 16);
                const b = parseInt(hex.substr(5, 2), 16);
                return { hex, rgb: `rgb(${r}, ${g}, ${b})` };
            },
            coinFlip: () => Math.random() > 0.5 ? 'Heads' : 'Tails',
            multipleDice: (sides, count) => {
                const rolls = [];
                for (let i = 0; i < count; i++) rolls.push(Math.floor(Math.random() * sides) + 1);
                return { rolls, total: rolls.reduce((a, b) => a + b, 0) };
            },
            namePicker: (names) => ({ picked: names[Math.floor(Math.random() * names.length)] }),
            teamPicker: (names, teamCount) => {
                const shuffled = [...names].sort(() => 0.5 - Math.random());
                const teams = Array.from({ length: teamCount }, () => []);
                shuffled.forEach((name, i) => teams[i % teamCount].push(name));
                return { teams };
            },
            lotteryNumbers: (count, range, min = 1) => {
                const set = new Set();
                while (set.size < count) { set.add(Math.floor(Math.random() * (range - min + 1)) + min); }
                return { numbers: Array.from(set).sort((a, b) => a - b) };
            }
        },

        passwordGenerator: {
            generate: function (length, options = {}) {
                const chars = { upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', lower: 'abcdefghijklmnopqrstuvwxyz', numbers: '0123456789', symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?' };
                let charset = '';
                if (options.uppercase !== false) charset += chars.upper;
                if (options.lowercase !== false) charset += chars.lower;
                if (options.numbers !== false) charset += chars.numbers;
                if (options.symbols !== false) charset += chars.symbols;
                if (options.excludeSimilar) charset = charset.replace(/[ilLIoO01]/g, '');
                if (!charset) charset = chars.lower + chars.numbers;
                let password = '';
                for (let i = 0; i < (length || 16); i++) password += charset.charAt(Math.floor(Math.random() * charset.length));
                return { success: true, password, score: this._getScore(password), strength: this._getStrength(password) };
            },
            generateMemorable: function (wordCount = 3) {
                const words = ['Adobe', 'Brick', 'Cloud', 'Dragon', 'Eagle', 'Forest', 'Giant', 'House', 'Image', 'Jewel', 'Kite', 'Lemon', 'Magic', 'Night', 'Ocean', 'Pearl', 'Queen', 'River', 'Stone', 'Tiger', 'Unity', 'Voice', 'Water', 'Xenon', 'Yacht', 'Zebra'];
                let parts = [];
                for (let i = 0; i < wordCount; i++) parts.push(words[Math.floor(Math.random() * words.length)]);
                parts = parts.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
                const pwd = parts.join('-') + Math.floor(Math.random() * 100) + '!';
                return { success: true, password: pwd, score: 7, strength: 'Good' };
            },
            generatePassphrase: function (wordCount = 4, separator = '-') {
                const words = ['ability', 'able', 'about', 'above', 'accept', 'according', 'account', 'across', 'act', 'action', 'activity', 'actually', 'add', 'address', 'administration', 'admit', 'adult', 'affect', 'after', 'again', 'against', 'age', 'agency', 'agent', 'ago', 'agree', 'agreement'];
                let parts = [];
                for (let i = 0; i < wordCount; i++) parts.push(words[Math.floor(Math.random() * words.length)]);
                const pwd = parts.join(separator);
                return { success: true, password: pwd, score: 8, strength: 'Strong' };
            },
            generatePIN: function (length = 4) {
                let pin = '';
                for (let i = 0; i < length; i++) pin += Math.floor(Math.random() * 10);
                return { success: true, password: pin, score: 3, strength: 'Weak (PIN)' };
            },
            generateFromMode: function (mode, opts) {
                if (mode === 'random') return this.generate(opts.length, opts);
                if (mode === 'memorable') return this.generateMemorable(opts.wordCount);
                if (mode === 'passphrase') return this.generatePassphrase(opts.wordCount, opts.separator);
                if (mode === 'pin') return this.generatePIN(opts.length);
                return { success: false };
            },
            generateBatch: function (count, mode, opts) {
                let passwords = [];
                for (let i = 0; i < count; i++) passwords.push(this.generateFromMode(mode, opts).password);
                return { success: true, passwords };
            },
            _getScore: function (p) {
                let s = 0;
                if (p.length > 8) s += 2;
                if (p.length > 12) s += 2;
                if (/[A-Z]/.test(p)) s += 2;
                if (/[0-9]/.test(p)) s += 2;
                if (/[!@#$%^&*]/.test(p)) s += 2;
                return s;
            },
            _getStrength: function (s) { return s >= 8 ? 'Strong' : s >= 5 ? 'Medium' : 'Weak'; }
        },

        hashGenerator: {
            generateAll: async (t) => {
                const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t));
                return { sha256: Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('') };
            }
        },

        qrGenerator: {
            generate: function (text, options) {
                return new Promise((resolve, reject) => {
                    if (typeof QRious === 'undefined') return reject(new Error('QR Library not loaded'));
                    try {
                        const qr = new QRious({ value: text, size: options.size || 500, level: 'H', foreground: options.foreground || 'black', background: options.background || 'white' });
                        if (options.logo) {
                            const canvas = document.createElement('canvas');
                            canvas.width = options.size || 500; canvas.height = options.size || 500;
                            const ctx = canvas.getContext('2d');
                            const img = new Image();
                            img.onload = () => {
                                ctx.drawImage(qr.canvas, 0, 0);
                                const logoSize = canvas.width * 0.2;
                                const logoX = (canvas.width - logoSize) / 2;
                                const logoY = (canvas.height - logoSize) / 2;
                                ctx.fillStyle = options.background || 'white';
                                ctx.fillRect(logoX, logoY, logoSize, logoSize);
                                const logoImg = new Image();
                                logoImg.onload = () => { ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize); resolve({ success: true, url: canvas.toDataURL() }); };
                                logoImg.src = URL.createObjectURL(options.logo);
                            };
                            img.src = qr.toDataURL();
                        } else { resolve({ success: true, url: qr.toDataURL() }); }
                    } catch (e) { reject(e); }
                });
            },
            generateWiFi: function (ssid, password, type, hidden, options) { return this.generate(`WIFI:S:${ssid};T:${type};P:${password};H:${hidden};;`, options); },
            generateVCard: function (v, options) { return this.generate(`BEGIN:VCARD\nVERSION:3.0\nN:${v.lastName};${v.firstName}\nFN:${v.firstName} ${v.lastName}\nTEL;TYPE=CELL:${v.phone}\nEMAIL:${v.email}\nEND:VCARD`, options); }
        },

        faviconGenerator: {
            generateFromImage: function (file, bgColor) {
                return new Promise((resolve, reject) => {
                    const sizes = [16, 32, 48, 64, 128, 256, 512];
                    const result = {};
                    const img = new Image();
                    img.onload = () => {
                        sizes.forEach(s => {
                            const canvas = document.createElement('canvas'); canvas.width = s; canvas.height = s;
                            const ctx = canvas.getContext('2d');
                            if (bgColor) { ctx.fillStyle = bgColor; ctx.fillRect(0, 0, s, s); }
                            ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
                            ctx.drawImage(img, 0, 0, s, s);
                            result[s] = canvas.toDataURL('image/png');
                        });
                        resolve(result);
                    };
                    img.onerror = () => reject(new Error('Failed to load image'));
                    img.src = URL.createObjectURL(file);
                });
            },
            generateFromEmoji: function (emoji, bgColor) {
                const sizes = [16, 32, 48, 64, 128, 256, 512];
                const result = {};
                sizes.forEach(s => {
                    const canvas = document.createElement('canvas'); canvas.width = s; canvas.height = s;
                    const ctx = canvas.getContext('2d');
                    if (bgColor) { ctx.fillStyle = bgColor; ctx.fillRect(0, 0, s, s); }
                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `${s * 0.8}px sans-serif`;
                    ctx.fillText(emoji, s / 2, s / 2 * 1.05);
                    result[s] = canvas.toDataURL('image/png');
                });
                return result;
            }
        },

        cssGenerator: {
            boxShadow: (x, y, blur, spread, color, opacity, inset) => {
                const r = parseInt(color.substr(1, 2), 16), g = parseInt(color.substr(3, 2), 16), b = parseInt(color.substr(5, 2), 16);
                return `box-shadow: ${inset ? 'inset ' : ''}${x}px ${y}px ${blur}px ${spread}px rgba(${r}, ${g}, ${b}, ${opacity});`;
            },
            gradient: (type, angle, c1, c2) => type === 'linear' ? `linear-gradient(${angle}deg, ${c1}, ${c2})` : `radial-gradient(circle, ${c1}, ${c2})`,
            glassmorphism: (opacity, blur) => `background: rgba(255, 255, 255, ${opacity});\nbackdrop-filter: blur(${blur}px);\n-webkit-backdrop-filter: blur(${blur}px);\nborder: 1px solid rgba(255, 255, 255, 0.18);`,
            borderRadius: (tl, tr, br, bl) => `border-radius: ${tl}px ${tr}px ${br}px ${bl}px;`,
            neumorphism: (color, size, radius, distance, intensity, shape) => {
                const col = parseInt(color.replace('#', ''), 16);
                const r = (col >> 16) & 255, g = (col >> 8) & 255, b = col & 255;
                const darken = (n) => Math.max(0, n - (intensity * 20)), lighten = (n) => Math.min(255, n + (intensity * 20));
                const darkC = `rgb(${darken(r)},${darken(g)},${darken(b)})`, lightC = `rgb(${lighten(r)},${lighten(g)},${lighten(b)})`;
                let val = '';
                if (shape === 'flat') val = `${distance}px ${distance}px ${size}px ${darkC}, -${distance}px -${distance}px ${size}px ${lightC}`;
                else if (shape === 'pressed') val = `inset ${distance}px ${distance}px ${size}px ${darkC}, inset -${distance}px -${distance}px ${size}px ${lightC}`;
                else if (shape === 'convex') return `border-radius: ${radius}px;\nbackground: linear-gradient(145deg, ${lightC}, ${darkC});\nbox-shadow:  ${distance}px ${distance}px ${size}px ${darkC}, -${distance}px -${distance}px ${size}px ${lightC};`;
                else if (shape === 'concave') return `border-radius: ${radius}px;\nbackground: linear-gradient(145deg, ${darkC}, ${lightC});\nbox-shadow:  ${distance}px ${distance}px ${size}px ${darkC}, -${distance}px -${distance}px ${size}px ${lightC};`;
                return `border-radius: ${radius}px;\nbackground: ${color};\nbox-shadow: ${val};`;
            },
            textShadow: (x, y, blur, color) => `text-shadow: ${x}px ${y}px ${blur}px ${color};`,
            flexbox: (dir, just, align, wrap, gap) => `display: flex;\nflex-direction: ${dir};\njustify-content: ${just};\nalign-items: ${align};\nflex-wrap: ${wrap};\ngap: ${gap}px;`,
            filter: (blur, brit, cont, gray, sepia, hue) => `filter: blur(${blur}px) brightness(${brit}%) contrast(${cont}%) grayscale(${gray}%) sepia(${sepia}%) hue-rotate(${hue}deg);`,
            transform: (rot, scale, skX, skY, trX, trY) => `transform: rotate(${rot}deg) scale(${scale}) skew(${skX}deg, ${skY}deg) translate(${trX}px, ${trY}px);`,
            border: (width, style, color) => `border: ${width}px ${style} ${color};`,
            gradientComplex: (type, angle, colors) => {
                const stops = colors.map(c => `${c.col} ${c.stop}%`).join(', ');
                return type === 'linear' ? `background: linear-gradient(${angle}deg, ${stops});` : `background: radial-gradient(circle, ${stops});`;
            }
        },

        htpasswdTools: {
            generate: async function (username, password, method) {
                let hashed = '';
                if (method === 'bcrypt') {
                    if (typeof dcodeIO === 'undefined' || !dcodeIO.bcrypt) {
                        if (typeof bcrypt !== 'undefined') { const salt = bcrypt.genSaltSync(10); hashed = bcrypt.hashSync(password, salt); }
                        else throw new Error("Bcrypt library not loaded");
                    } else { const salt = dcodeIO.bcrypt.genSaltSync(10); hashed = dcodeIO.bcrypt.hashSync(password, salt); }
                } else if (method === 'md5') hashed = '$apr1$' + btoa(password).substring(0, 8);
                else if (method === 'sha1') { const hashBuffer = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(password)); hashed = '{SHA}' + btoa(String.fromCharCode(...new Uint8Array(hashBuffer))); }
                else hashed = btoa(password);
                return `${username}:${hashed}`;
            }
        },

        resumeGenerator: {
            generateResumeHTML: function (data) {
                const d = data;
                const theme = d.theme || 'modern';

                // Colors: Provide defaults if missing, but themes can override
                let color = d.color || '#2d3748';

                // Language Support
                const isTr = typeof window !== 'undefined' && window.i18n && window.i18n.getCurrentLanguage() === 'tr';
                const lbl = isTr
                    ? { skills: 'Yetenekler', exp: 'İş Deneyimi', edu: 'Eğitim', contact: 'İletişim', about: 'Hakkımda', phone: 'Telefon', email: 'E-Posta', address: 'Adres', website: 'Web', profile: 'Profil' }
                    : { skills: 'Skills', exp: 'Experience', edu: 'Education', contact: 'Contact', about: 'About', phone: 'Phone', email: 'Email', address: 'Address', website: 'Website', profile: 'Profile' };

                // Font Mapping
                const fonts = {
                    sans: "'Inter', system-ui, sans-serif",
                    serif: "'Lora', serif",
                    mono: "'JetBrains Mono', monospace",
                    condensed: "'Roboto Condensed', sans-serif",
                    display: "'Playfair Display', serif", // New for Elegant
                    modern: "'Poppins', sans-serif", // New for Modern
                    strong: "'Oswald', sans-serif" // New for Titan
                };

                let f = d.font ? fonts[d.font] : fonts.sans;

                // Theme-Specific Defaults
                if (theme === 'elegant') {
                    if (!d.font || d.font === 'sans') f = fonts.display;
                    if (!d.color || d.color === '#2d3748') color = '#b08d55'; // Gold default
                }
                else if (theme === 'titan') {
                    if (!d.font || d.font === 'sans') f = fonts.strong;
                    if (!d.color || d.color === '#2d3748') color = '#1a365d'; // Dark Blue default
                }
                else if (theme === 'cyber') {
                    if (!d.font || d.font === 'sans') f = fonts.mono;
                    if (!d.color || d.color === '#2d3748') color = '#06b6d4'; // Cyan
                }
                else if (theme === 'brutal') {
                    if (!d.font || d.font === 'sans') f = fonts.mono;
                    if (!d.color || d.color === '#2d3748') color = '#ef4444'; // Red
                }

                const photoHtml = d.photo ? `<img src="${d.photo}" class="res-photo" alt="Profile">` : '';

                // Import Google Fonts
                const fontImport = `@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono&family=Lora:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@400;500;600;700;800&family=Oswald:wght@500;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Poppins:wght@300;400;500;600&family=Roboto+Condensed:wght@400;700&display=swap');`;

                // --- BASE CSS ---
                let css = `
                    ${fontImport}
                    .a4-page { font-family: ${f}; color: #2d3748; line-height: 1.6; padding: 40px; background: white; box-sizing: border-box; font-size: 14px; }
                    .res-photo { width: 110px; height: 110px; object-fit: cover; border-radius: 50%; margin-bottom: 20px; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.08); }
                    .res-header { margin-bottom: 35px; }
                    .res-name { font-size: 2.2rem; font-weight: 700; color: ${color}; line-height: 1.2; margin-bottom: 4px; letter-spacing: -0.02em; }
                    .res-title { font-size: 1.05rem; color: #718096; margin-bottom: 16px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; }
                    .res-contact { display: flex; flex-wrap: wrap; gap: 20px; font-size: 0.9rem; color: #4a5568; align-items: center; }
                    .res-section { margin-bottom: 30px; page-break-inside: avoid; }
                    .res-sec-title { font-size: 1rem; font-weight: 700; color: ${color}; text-transform: uppercase; margin-bottom: 15px; border-bottom: 2px solid ${color}; padding-bottom: 6px; letter-spacing: 0.05em; }
                    .res-item { margin-bottom: 20px; }
                    .res-item-head { display: flex; justify-content: space-between; align-items: baseline; font-weight: 600; margin-bottom: 4px; font-size: 1.05rem; }
                    .res-role { color: #1a202c; }
                    .res-comp { font-weight: 500; color: #4a5568; font-size: 0.95rem; }
                    .res-date { font-size: 0.85rem; color: #718096; font-weight: 500; white-space: nowrap; margin-left:10px; }
                    .res-desc { font-size: 0.9rem; color: #4a5568; white-space: pre-line; line-height: 1.55; margin-top: 5px; }
                    .res-skills { display: flex; flex-wrap: wrap; gap: 8px; }
                    .res-tag { background: #f7fafc; padding: 5px 12px; border-radius: 6px; font-size: 0.8rem; color: ${color}; border: 1px solid ${color}30; font-weight: 500; }
                    `;

                // --- THEME CSS OVERRIDES ---
                if (theme === 'elegant') {
                    // NEW: Feminine / Elegant
                    css += `
                        .a4-page { background: #fffaf0; color: #4a4a4a; }
                        .res-header { text-align: center; border-bottom: 1px solid ${color}40; padding-bottom: 30px; }
                        .res-contact { justify-content: center; gap: 25px; font-style: italic; }
                        .res-name { font-family: 'Playfair Display', serif; font-style: italic; font-size: 3rem; font-weight: 400; margin-bottom: 10px; }
                        .res-title { font-size: 0.9rem; letter-spacing: 0.2em; color: ${color}; }
                        .res-sec-title { text-align: center; border-bottom: 1px solid ${color}40; border-top: 1px solid ${color}40; padding: 12px 0; font-family: 'Playfair Display', serif; font-style: italic; text-transform: none; font-size: 1.6rem; letter-spacing: 0; background: transparent; color: ${color}; }
                        .res-photo { border-radius: 50%; box-shadow: 0 0 0 8px ${color}10; margin: 0 auto 20px; width: 130px; height: 130px; }
                        .res-tag { border: 1px solid ${color}40; background: white; border-radius: 20px; font-family: 'Montserrat', sans-serif; }
                        .res-item-head { font-family: 'Montserrat', sans-serif; letter-spacing:0.02em; }
                        .res-date { font-style: italic; }
                     `;
                }
                else if (theme === 'titan') {
                    if (!d.color || d.color === '#2d3748') color = '#34495e';
                    css += `.a4-page { background: white; color: ${color}; font-size: 0.85rem; } .res-header { text-align: center; border-bottom: 2px solid ${color}; padding-bottom: 15px; } .res-sec-title { background: ${color}; color: white; padding: 4px 8px; font-weight: bold; text-transform: uppercase; font-size: 0.9rem; margin-bottom: 10px; } .res-item { border-left: 3px solid ${color}; padding-left: 10px; margin-bottom: 10px; }`;
                }
                else if (theme === 'cyber') {
                    css += `.a4-page { background: #0a0a0a; color: #00ff41; font-family: 'Courier New', monospace; font-size: 0.8rem; } 
                            .res-sec-title { border-bottom: 1px solid #00ff41; color: #00ff41; text-shadow: 0 0 5px #00ff41; font-size: 1rem; margin-bottom: 10px; } 
                            .res-name { text-shadow: 2px 2px 0px #003300; font-size: 2.5rem; } 
                            .res-role { color: white; text-shadow: 1px 1px 0 #000; font-size: 0.9rem; } 
                            .res-comp { color: #008F11; font-size: 0.85rem; }
                            .res-desc { color: #00ff41; opacity: 0.9; font-size: 0.8rem; }`;
                }
                else if (theme === 'brutal') {
                    if (!d.color || d.color === '#2d3748') color = 'black';
                    f = fonts.mono;
                    css += `.a4-page { background: #fff; border: 10px solid black; font-size: 0.8rem; } 
                            .res-header { border-bottom: 4px solid black; padding-bottom: 20px; margin-bottom: 20px; } 
                            .res-name { text-transform: uppercase; font-weight: 900; font-size: 2.2rem; background: black; color: white; display: inline-block; padding: 5px 15px; } 
                            .res-sec-title { background: black; color: white; display: inline-block; padding: 5px 10px; font-weight: bold; text-transform: uppercase; border: 2px solid black; margin-bottom: 10px; font-size: 0.9rem; } 
                            .res-tag { border: 2px solid black; background: transparent; color: black; border-radius: 0; font-weight: bold; font-size: 0.75rem; }`;
                }
                else if (theme === 'nova') {
                    if (!d.color || d.color === '#2d3748') color = '#be185d'; // Pink
                    css += `
                        .a4-page { display: grid; grid-template-columns: 200px 1fr; padding: 0; min-height: 1123px; font-family: 'Inter', sans-serif; overflow: hidden; }
                        .v-sidebar { background: linear-gradient(135deg, #1e1b3d 0%, #2d1b3d 100%); color: white; padding: 40px 20px; display: flex; flex-direction: column; }
                        .v-photo { width: 120px; height: 120px; border-radius: 50%; border: 3px solid #3f3f46; margin: 0 auto 10px; display:block; object-fit: cover; }
                        .v-name-side { text-align: center; color: white; margin-bottom: 35px; font-weight: 600; font-size: 0.95rem; }
                        
                        .v-side-sec { margin-bottom: 30px; }
                        .v-side-title { font-size: 0.85rem; text-transform: uppercase; border-bottom: 1px solid #3f3f46; padding-bottom: 8px; margin-bottom: 15px; font-weight: 700; color: white; letter-spacing:1px; }
                        .v-info-group { margin-bottom: 12px; }
                        .v-label { color: #a1a1aa; font-size: 0.7rem; font-weight:600; display:block; margin-bottom:3px; }
                        .v-val { color: #fff; font-size: 0.75rem; word-break: break-word; line-height: 1.3; }
                        
                        .v-main { background: #fafafa; padding: 45px 35px; color: #333; }
                        .v-name-main { font-size: 2.5rem; font-weight: 900; text-transform: uppercase; color: #18181b; line-height: 1; letter-spacing: -1px; }
                        .v-title-main { font-size: 1rem; text-transform: uppercase; color: #52525b; letter-spacing: 2px; margin-bottom: 35px; font-weight: 600; margin-top:5px; }
                        
                        .v-section { margin-bottom: 30px; }
                        .v-sec-head { font-size: 1rem; text-transform: uppercase; border-bottom: 2px solid #e4e4e7; padding-bottom: 8px; margin-bottom: 20px; font-weight: 800; color: #27272a; letter-spacing:1px; }
                        
                        .v-item { position: relative; padding-left: 25px; margin-bottom: 25px; border-left: 2px solid #e4e4e7; }
                        .v-item:last-child { border-left-color: transparent; }
                        .v-item::before { content: ''; position: absolute; left: -6px; top: 5px; width: 10px; height: 10px; background: #27272a; border-radius: 50%; }
                        
                        .v-item-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px; }
                        .v-comp { font-weight: 800; font-size: 0.9rem; text-transform: uppercase; color: #18181b; }
                        .v-gpa { background: #27272a; color: white; padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; }
                        .v-date { font-weight: 600; font-size: 0.75rem; color: #71717a; }
                        .v-role { font-weight: 600; font-size: 0.85rem; color: #52525b; margin-bottom:6px; }
                        .v-desc { font-size: 0.8rem; color: #71717a; line-height: 1.5; }
                        
                        .v-lang-item { margin-bottom: 12px; }
                        .v-lang-top { display: flex; justify-content: space-between; margin-bottom: 5px; }
                        .v-lang-name { font-weight: 600; font-size: 0.85rem; color: #27272a; }
                        .v-lang-level { font-size: 0.75rem; color: #71717a; }
                        .v-lang-bar { width: 100%; height: 6px; background: #e4e4e7; border-radius: 3px; overflow: hidden; }
                        .v-lang-fill { height: 100%; background: #27272a; }
                        
                        .v-skills { display: flex; flex-wrap: wrap; gap: 8px; }
                        .v-tag { background: #f4f4f5; padding: 6px 16px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; color: #52525b; border: 1px solid #e4e4e7; text-transform: uppercase; }
                        
                        .v-interests { font-size: 0.85rem; color: #52525b; line-height: 1.6; }
                     `;
                }
                else if (theme === 'orbit') {
                    if (!d.color || d.color === '#2d3748') color = '#f39c12'; // Orange default
                    if (!d.font || d.font === 'sans') f = fonts.condensed;

                    css += `
                        .a4-page { display: grid; grid-template-columns: 180px 1fr; padding: 0; min-height: 1123px; font-family: ${f}; background: white; color: #333; overflow: hidden; }
                        
                        /* Sidebar (Dark) */
                        .e-sidebar { background: #2e3e4f; padding: 35px 18px; display: flex; flex-direction: column; color: white; }
                        .e-photo-frame { padding: 3px; border: 3px solid ${color}; border-radius: 8px; margin-bottom: 30px; }
                        .e-photo { width: 100%; height: auto; border-radius: 5px; display:block; object-fit: cover; }
                        
                        .e-side-sec { margin-bottom: 30px; }
                        .e-side-title { color: ${color}; font-size: 0.8rem; text-transform: uppercase; border-bottom: 2px solid ${color}; padding-bottom: 6px; margin-bottom: 15px; font-weight: 700; letter-spacing: 0.5px; }
                        
                        .e-contact-item { display: flex; align-items: start; gap: 8px; margin-bottom: 12px; font-size: 0.7rem; color: #ecf0f1; line-height: 1.3; }
                        .e-icon { color: ${color}; min-width: 18px; font-size: 0.9rem; }
                        .e-val { word-break: break-word; }
                        
                        .e-skill-item { margin-bottom: 8px; }
                        .e-skill-name { display: block; font-size: 0.8rem; margin-bottom: 4px; font-weight: 500; color: #ecf0f1; border-left: 2px solid ${color}; padding-left: 8px; line-height: 1.4; }
                        .e-bar-bg { display: none; } /* Bars Removed */
                        .e-bar-fill { display: none; }

                        /* Main Content (Light) */
                        .e-main { padding: 40px 30px; background: white; }
                        .e-header { margin-bottom: 35px; }
                        .e-name { font-size: 2.8rem; font-weight: 700; line-height: 1.1; margin-bottom: 8px; color: #2c3e50; }
                        .e-title { font-size: 1.2rem; color: ${color}; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; }
                        
                        .e-section { margin-bottom: 30px; }
                        .e-sec-title { color: #2c3e50; font-size: 0.95rem; text-transform: uppercase; border-bottom: 2px solid #ecf0f1; padding-bottom: 6px; margin-bottom: 15px; font-weight: 700; letter-spacing: 0.5px; }
                        
                        .e-summary { font-size: 0.85rem; color: #444; line-height: 1.5; }
                        
                        .e-item { margin-bottom: 18px; }
                        .e-item-head { margin-bottom: 4px; }
                        .e-comp { font-size: 0.9rem; font-weight: 700; color: #2c3e50; }
                        .e-role-hl { color: ${color}; font-weight: 600; font-size: 0.8rem; }
                        .e-date { font-size: 0.75rem; color: #7f8c8d; font-weight: 500; display: block; margin-top: 2px; }
                        .e-desc { font-size: 0.8rem; color: #444; line-height: 1.4; margin-top: 4px; font-weight: 400; }
                        
                        .e-cert-item { margin-bottom: 12px; font-size: 0.75rem; color: #ecf0f1; }
                        .e-cert-name { font-weight: 600; color: white; }
                        
                        .e-interests { display: flex; flex-direction: column; gap: 8px; }
                        .e-interest-item { display: block; font-size: 0.8rem; font-weight: 500; color: #ecf0f1; border-left: 2px solid ${color}; padding-left: 8px; line-height: 1.4; }
                        .e-interest-icon { display: none; }
                    `;
                }
                else if (theme === 'bloom') {
                    if (!d.color || d.color === '#2d3748') color = '#e6b0aa';
                    css += `
                        .a4-page { position: relative; overflow: hidden; background: white; font-family: 'Montserrat', sans-serif; display: block; min-height: 1123px; }
                        .a-blob-1 { position: absolute; top: -80px; left: -120px; width: 500px; height: 550px; background: #f5e6d3; border-radius: 40% 50% 50% 40%; z-index: 0; transform: rotate(-15deg); }
                        .a-blob-2 { position: absolute; bottom: -80px; left: -80px; width: 420px; height: 420px; background: #e8ded0; border-radius: 50% 40% 30% 70%; z-index: 0; opacity: 0.8; }
                        .a-container { position: relative; z-index: 1; display: grid; grid-template-columns: 30% 62%; gap: 8%; height: 100%; padding: 50px 35px; }
                        .a-left { text-align: left; padding-top: 15px; }
                        .a-photo { width: 160px; height: 160px; border-radius: 50%; object-fit: cover; margin-bottom: 40px; box-shadow: 12px 12px 0 rgba(0,0,0,0.05); filter: grayscale(100%); }
                        .a-sec-title { font-family: 'Oswald', sans-serif; font-size: 1.1rem; text-transform: uppercase; font-weight: 700; color: #2c3e50; margin-bottom: 15px; letter-spacing: 0.5px; }
                        .a-text { font-size: 0.75rem; line-height: 1.5; color: #555; margin-bottom: 35px; }
                        .a-skill-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 0.8rem; font-weight: 500; color: #555; }
                        .a-dots { display: flex; gap: 4px; }
                        .a-dot { width: 9px; height: 9px; border-radius: 50%; background: #d5d8dc; }
                        .a-dot.active { background: #566573; }
                        .a-contact-row { margin-bottom: 10px; font-size: 0.75rem; color: #555; line-height: 1.3; }
                        .a-label { display: block; font-weight: 700; color: #2c3e50; font-size: 0.7rem; margin-bottom: 2px; }
                        .a-right { text-align: left; padding-top: 40px; }
                        .a-name { font-family: 'Oswald', sans-serif; font-size: 3.2rem; text-transform: uppercase; line-height: 0.9; color: #2c3e50; text-align: right; margin-bottom: 5px; font-weight: 700; }
                        .a-title { font-family: 'Montserrat', sans-serif; font-size: 1rem; text-transform: uppercase; letter-spacing: 4px; text-align: right; color: #c9a66b; margin-bottom: 60px; font-weight: 400; }
                        .a-right-sec { margin-bottom: 35px; }
                        .a-item { margin-bottom: 22px; }
                        .a-comp { font-weight: 700; font-size: 0.9rem; color: #2c3e50; margin-bottom: 2px; }
                        .a-role-line { font-size: 0.8rem; color: #566573; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px; }
                        .a-desc { font-size: 0.75rem; color: #555; line-height: 1.4; margin-top: 5px; }
                        .a-date { font-size: 0.7rem; color: #aab7b8; margin-bottom: 5px; display:block; }
                        .a-bullet-item { display: flex; gap: 8px; font-size: 0.75rem; color: #555; margin-bottom: 3px; line-height: 1.4; }
                        .a-bullet { min-width: 4px; height: 4px; background: #333; border-radius: 50%; margin-top: 7px; }
                    `;
                }
                else if (theme === 'wave') {
                    css += `
                        .a4-page { display: grid; grid-template-columns: 32% 68%; min-height: 1123px; font-family: 'Poppins', sans-serif; overflow: hidden; }
                        .s-left { background: #1a3d4a; color: white; position: relative; overflow: hidden; text-align: center; padding: 60px 30px 40px; display: flex; flex-direction: column; align-items: center; }
                        .s-top-wave { position: absolute; top: 0; left: 0; width: 100%; height: 220px; background: linear-gradient(135deg, #c8b5d4 0%, #d4c5dd 100%); border-radius: 0 0 50% 50% / 0 0 40% 40%; z-index: 0; }
                        .s-photo-frame { position: relative; z-index: 2; width: 140px; height: 140px; border-radius: 50%; border: 4px solid white; overflow: hidden; box-shadow: 0 8px 16px rgba(0,0,0,0.2); margin-bottom: 20px; background: white; }
                        .s-photo { width: 100%; height: 100%; object-fit: cover; }
                        .s-name-box { margin-bottom: auto; position: relative; z-index: 1; text-align: center; margin-top: 10px; }
                        .s-name { font-size: 1.8rem; font-weight: 700; text-transform: uppercase; line-height: 1.1; margin-bottom: 8px; }
                        .s-title { font-size: 0.9rem; font-weight: 300; opacity: 0.9; letter-spacing: 1px; text-transform: uppercase; }
                        .s-contact-box { position: relative; z-index: 2; font-size: 0.85rem; width: 100%; margin-top: auto; }
                        .s-contact-row { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; text-align: left; }
                        .s-icon-circle { width: 45px; height: 45px; background: rgba(255,255,255,0.15); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; }
                        .s-contact-text { flex: 1; font-size: 0.75rem; line-height: 1.3; }
                        .s-bottom-wave { position: absolute; bottom: 0; left: 0; width: 120%; height: 180px; background: #ffd700; border-radius: 50% 50% 0 0 / 60% 60% 0 0; z-index: 1; margin-left: -10%; }
                        .s-bottom-wave2 { position: absolute; bottom: 0; left: 0; width: 110%; height: 140px; background: #ffb6d9; border-radius: 50% 50% 0 0 / 50% 50% 0 0; z-index: 0; margin-left: -5%; }
                        .s-right { background: white; padding: 50px 40px; color: #333; }
                        .s-section { margin-bottom: 35px; }
                        .s-head { font-size: 1.1rem; font-weight: 700; color: #1a3d4a; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #e0e0e0; text-transform: uppercase; }
                        .s-item { margin-bottom: 20px; }
                        .s-role { font-weight: 700; font-size: 0.95rem; color: #1a3d4a; }
                        .s-info { font-size: 0.8rem; color: #888; margin-bottom: 6px; font-weight: 500; font-style: italic; }
                        .s-desc { font-size: 0.85rem; color: #555; line-height: 1.5; }
                        .s-skill-cloud { display: flex; flex-wrap: wrap; gap: 8px; }
                        .s-tag { background: #f0f4f8; padding: 6px 14px; border-radius: 6px; font-size: 0.8rem; font-weight: 600; color: #1a3d4a; border-left: 3px solid #1a3d4a; }
                    `;
                }
                else if (theme === 'bold') {
                    css += `
                        .a4-page { display: grid; grid-template-columns: 32% 68%; height: 1123px; min-height: 1123px; overflow: hidden; font-family: 'Poppins', sans-serif; }
                        .k-left { background: #2d3748; color: white; position: relative; display: flex; flex-direction: column; height: 100%; }
                        .k-top-yellow { height: 140px; background: #ffc107; width: 100%; flex-shrink: 0; }
                        .k-photo-container { margin: -70px auto 15px; position: relative; z-index: 1; width: 120px; height: 120px; border-radius: 50%; border: 5px solid white; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,0.3); background:white; }
                        .k-photo { width: 100%; height: 100%; object-fit: cover; }
                        .k-name-box { text-align: center; margin-bottom: 20px; padding: 0 15px; }
                        .k-name { font-size: 1.5rem; font-weight: 700; color: #ffc107; margin-bottom: 4px; line-height: 1; letter-spacing: -0.5px; }
                        .k-title { font-size: 0.8rem; color: #e0e0e0; font-weight: 300; }
                        .k-left-sec { padding: 0 18px; margin-bottom: 20px; }
                        .k-sec-icon-head { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
                        .k-sec-icon { width: 36px; height: 36px; background: #ffc107; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #2d3748; font-size: 1.1rem; flex-shrink: 0; }
                        .k-sec-name { color: #ffc107; font-size: 0.9rem; font-weight: 700; flex: 1; }
                        .k-sec-line { height: 2.5px; background: #ffc107; width: 40px; margin-top: 2px; }
                        .k-contact-row { margin-bottom: 10px; font-size: 0.75rem; }
                        .k-c-label { color: #ffc107; font-weight: 600; display: block; margin-bottom: 3px; }
                        .k-c-val { color: #e8e8e8; line-height: 1.2; }
                        .k-skill-row { margin-bottom: 12px; }
                        .k-skill-label { color: #e8e8e8; font-size: 0.78rem; margin-bottom: 5px; display: block; font-weight: 500; }
                        .k-skill-bar-bg { width: 100%; height: 5px; background: #1a202c; border-radius: 3px; }
                        .k-skill-bar-fill { height: 100%; background: #ffc107; border-radius: 3px; }
                        .k-interest-bullet { color: #e8e8e8; font-size: 0.75rem; margin-bottom: 6px; font-weight: 300; }
                        .k-right { background: #f7f7f7; padding: 30px 25px; color: #333; }
                        .k-r-section { margin-bottom: 25px; }
                        .k-r-head { display: flex; align-items: center; gap: 12px; margin-bottom: 15px; }
                        .k-r-icon { width: 42px; height: 42px; background: #ffc107; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #2d3748; font-size: 1.2rem; flex-shrink: 0; }
                        .k-r-title { font-size: 1.1rem; font-weight: 700; color: #1a202c; position: relative; }
                        .k-r-title::after { content: ''; position: absolute; bottom: -4px; left: 0; width: 50px; height: 2.5px; background: #ffc107; }
                        .k-profile-text { font-size: 0.8rem; color: #4a5568; line-height: 1.5; text-align: justify; }
                        .k-timeline { position: relative; padding-left: 25px; border-left: 2px solid #e2e8f0; }
                        .k-exp-item { position: relative; margin-bottom: 20px; }
                        .k-exp-dot { position: absolute; left: -32px; top: 4px; width: 12px; height: 12px; background: #ffc107; border-radius: 50%; border: 3px solid #f7f7f7; box-shadow: 0 0 0 2px #e2e8f0; }
                        .k-exp-title { font-size: 0.9rem; font-weight: 700; color: #1a202c; margin-bottom: 3px; line-height: 1.2; }
                        .k-exp-meta { font-size: 0.75rem; color: #718096; margin-bottom: 6px; font-weight: 600; }
                        .k-exp-desc { font-size: 0.75rem; color: #4a5568; line-height: 1.4; }
                        .k-edu-box { margin-bottom: 15px; }
                        .k-edu-title { font-weight: 700; font-size: 0.85rem; color: #1a202c; margin-bottom: 3px; }
                        .k-edu-meta { font-size: 0.75rem; color: #718096; }
                        .k-portfolio-item { margin-bottom: 12px; }
                        .k-port-title { font-weight: 700; font-size: 0.82rem; color: #1a202c; margin-bottom: 3px; }
                        .k-port-desc { font-size: 0.75rem; color: #4a5568; line-height: 1.4; font-style: italic; }
                    `;
                }
                else if (theme === 'prime') {
                    css += `
                        .a4-page { background: #f5f5f5; padding: 40px 35px; font-family: 'Poppins', sans-serif; min-height: 1123px; overflow: hidden; }
                        .o-header { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; height: 260px; }
                        .o-circle-white { background: white; border-radius: 50%; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 35px; box-shadow: 0 8px 25px rgba(0,0,0,0.1); position: relative; }
                        .o-name { font-size: 2.2rem; font-weight: 700; color: #1a1a1a; text-align: center; line-height: 1; margin-bottom: 8px; }
                        .o-title-badge { background: #ffc107; padding: 6px 16px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; color: #1a1a1a; letter-spacing: 0.8px; margin-bottom: 15px; }
                        .o-company { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: #555; font-weight: 600; }
                        .o-company-icon { width: 24px; height: 24px; background: #ffc107; clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); }
                        .o-circle-yellow { background: #ffc107; border-radius: 50%; overflow: hidden; box-shadow: 0 8px 25px rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center; }
                        .o-photo { width: 100%; height: 100%; object-fit: cover; }
                        .o-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; }
                        .o-box { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 3px 12px rgba(0,0,0,0.08); }
                        .o-box-head { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
                        .o-icon-box { width: 42px; height: 42px; background: #ffc107; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex-shrink: 0; }
                        .o-box-title { font-size: 1rem; font-weight: 700; color: #1a1a1a; }
                        .o-box-content { font-size: 0.78rem; color: #555; line-height: 1.5; }
                        .o-list { list-style: none; padding: 0; margin: 0; }
                        .o-list li { margin-bottom: 6px; padding-left: 18px; position: relative; font-size: 0.78rem; color: #555; line-height: 1.4; }
                        .o-list li::before { content: '•'; position: absolute; left: 0; color: #ffc107; font-weight: 700; font-size: 1.1rem; }
                        .o-quote { font-style: italic; color: #666; font-size: 0.75rem; margin-top: 8px; padding-left: 12px; border-left: 3px solid #ffc107; }
                        .o-footer { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
                        .o-contact-item { display: flex; align-items: center; gap: 10px; font-size: 0.8rem; color: #555; }
                        .o-contact-icon { width: 36px; height: 36px; background: #ffc107; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
                    `;
                }
                else if (theme === 'modern') {
                    // Refined Modern
                    css += `.res-header { text-align: center; padding-bottom: 35px; border-bottom: 1px solid #e2e8f0; } 
                             .res-contact { justify-content: center; } 
                             .res-photo { margin: 0 auto 20px; }
                             .res-sec-title { border: none; font-size: 0.9rem; letter-spacing: 0.15em; color: #a0aec0; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; }
                             .res-name { font-family: 'Poppins', sans-serif; font-weight: 600; } `;
                }
                else if (theme === 'executive') {
                    // Refined Executive
                    css += `.a4-page { font-family: 'Montserrat', sans-serif; background: #fdfdfd; }
                             .res-header { display: flex; align-items: center; gap: 40px; background: #f1f5f9; margin: -40px-40px 30px; padding: 50px 40px; border-bottom: 4px solid ${color}; }
                             .res-info { flex: 1; }
                             .res-name { margin: 0; font-size: 2.5rem; }
                             .res-photo { margin: 0; width: 140px; height: 140px; border: 5px solid white; box-shadow: 0 10px 15px-3px rgba(0, 0, 0, 0.1); }
                             .res-sec-title { border: none; border-bottom: 2px solid ${color} 30; font-size: 1.2rem; color: ${color}; }
                             .res-item-head { align-items: center; }
                             .res-role { font-weight: 700; font-size: 1.1rem; } `;
                }
                else if (theme === 'minimal') {
                    css += `.a4-page { padding: 30px 40px; } .res-sec-title { border: none; letter-spacing: 0.2em; font-size: 0.85rem; color: #a0aec0; margin-bottom: 20px; text-align: right; margin-right: -20px; padding-right: 20px; border-right: 3px solid ${color}; } .res-name { font-weight: 300; letter-spacing: -1px; font-size: 3rem; } .res-item-head { flex-direction: column; gap: 2px; } .res-date { font-style: italic; margin-left: 0; color: #cbd5e0; } .res-tag { background: white; border: 1px solid #e2e8f0; color: #718096; } `;
                }
                else if (theme === 'skyline') {
                    css += `.res-name { font-size: 3.5rem; text-transform: uppercase; color: #edf2f7; position: absolute; top: 20px; right: 30px; z-index: 0; pointer-events: none; font-weight: 900; } .res-header { position: relative; z-index: 1; padding-top: 30px; margin-bottom: 20px; } .res-sec-title { border-top: 3px solid ${color}; border-bottom: none; padding-top: 10px; display: flex; justify-content: space-between; border-color: ${color} 40; color: #2d3748; margin-bottom: 12px; } .res-sec-title::after { content: ''; width: 40px; height: 5px; background: ${color}; } .res-skills .res-tag { font-size: 0.75rem; padding: 2px 6px; }`;
                }
                else if (theme === 'leftside') {
                    css += `.a4-page { display: grid; grid-template-columns: 260px 1fr; padding: 0; min-height: 1123px; } 
                            .res-left { background: ${color}; color: white; padding: 50px 30px; height: 100 %; display: flex; flex-direction: column; } 
                            .res-right { padding: 50px 40px; background: white; } 
                            .res-name { color: white; font-size: 2.2rem; margin-bottom: 5px; } 
                            .res-title { color: rgba(255, 255, 255, 0.7); margin-bottom: 30px; border-bottom: 1px solid rgba(255, 255, 255, 0.2); padding-bottom: 20px; display: block; } 
                            .res-contact { flex-direction: column; color: rgba(255, 255, 255, 0.9); margin-top: 0; gap: 15px; align-items: flex-start; } 
                            .res-sec-title { color: ${color}; border-color: ${color} 30; } 
                            .res-photo { width: 160px; height: 160px; margin-bottom: 30px; border: 5px solid rgba(255, 255, 255, 0.2); box-shadow: none; } 
                            .res-left.res-sec-title { color: white; border-color: rgba(255, 255, 255, 0.2); margin-top: 40px; } 
                            .res-left.res-tag { background: rgba(255, 255, 255, 0.15); color: white; border: none; } `;
                }

                // --- HTML STRUCTURE ---
                let html = '';

                // Special layout for 'executive' to wrap photo correctly
                // Special layout for 'executive' merged into standard layout below
                /*
                if (theme === 'executive') { ... } 
                */
                if (theme === 'nova') {
                    html = `
        <div class="v-sidebar">
            ${d.photo ? `<img src="${d.photo}" class="v-photo">` : ''}
                        ${d.photo ? `<div class="v-name-side">${d.name}</div>` : ''}

    <div class="v-side-sec">
        <div class="v-side-title">${lbl.contact}</div>
        <div class="v-info-group"><span class="v-label">${lbl.address}</span><span class="v-val">${d.address || '-'}</span></div>
        <div class="v-info-group"><span class="v-label">${lbl.phone}</span><span class="v-val">${d.phone || '-'}</span></div>
        <div class="v-info-group"><span class="v-label">${lbl.email}</span><span class="v-val">${d.email || '-'}</span></div>
        ${d.website ? `<div class="v-info-group"><span class="v-label">${lbl.website}</span><span class="v-val">${d.website}</span></div>` : ''}
    </div>
    
    ${d.skills ? `
    <div class="v-side-sec">
        <div class="v-side-title">${isTr ? 'YETENEKLER' : 'SKILLS'}</div>
        <div class="v-skills" style="display:flex; flex-wrap:wrap; gap:5px;">
            ${d.skills.split(',').map(s => s.trim() ? `<span class="v-tag" style="background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); color:white;">${s.trim()}</span>` : '').join('')}
        </div>
    </div>` : ''}

    ${d.languages ? `
    <div class="v-side-sec">
        <div class="v-side-title">${isTr ? 'DİLLER' : 'LANGUAGES'}</div>
        <div class="v-info-group" style="display:block;">
             ${d.languages.split(',').map(s => `<div style="margin-bottom:5px;">• ${s.trim()}</div>`).join('')}
        </div>
    </div>` : ''}



    </div>
        <div class="v-main">
            <div class="v-name-main">${d.name}</div>
            <div class="v-title-main">${d.title}</div>
            
            ${d.summary ? `
            <div class="v-section">
                <div class="v-sec-head">${isTr ? 'ÖZET' : 'SUMMARY'}</div>
                <div class="v-desc">${d.summary}</div>
            </div>` : ''}

            <div class="v-section">
                <div class="v-sec-head">${lbl.edu}</div>
                ${d.education.map(e => `
                                <div class="v-item">
                                    <div class="v-item-top">
                                        <div class="v-comp">${e.sch}</div>
                                    </div>
                                    <div class="v-role">${e.deg}</div>
                                    <div class="v-date">${e.date}</div>
                                </div>
                            `).join('')}
            </div>

            <div class="v-section">
                <div class="v-sec-head">${isTr ? 'İŞ DENEYİMLERİ' : 'WORK EXPERIENCE'}</div>
                ${d.experience.map(e => `
                                <div class="v-item">
                                    <div class="v-item-top">
                                        <div class="v-comp">${e.comp}</div>
                                        <div class="v-date">${e.date}</div>
                                    </div>
                                    <div class="v-role">${e.role}</div>
                                    <div class="v-desc">${e.desc}</div>
                                </div>
                            `).join('')}
            </div>
            
            ${d.interests ? `
            <div class="v-section">
                <div class="v-sec-head">${isTr ? 'İLGİ ALANLARI' : 'INTERESTS'}</div>
                <div class="v-interests">${d.interests}</div>
            </div>` : ''}
            </div>
        </div>
    `;
                }
                else if (theme === 'orbit') {
                    html = `
        <div class="e-sidebar">
            ${d.photo ? `<div class="e-photo-frame"><img src="${d.photo}" class="e-photo"></div>` : ''}
                        
                        <div class="e-side-sec">
                            <div class="e-side-title">${isTr ? 'İLETİŞİM BİLGİLERİ' : 'CONTACT INFO'}</div>
                            <div class="e-contact-item"><span class="e-icon">📱</span> <span class="e-val">${d.phone}</span></div>
                            <div class="e-contact-item"><span class="e-icon">✉️</span> <span class="e-val">${d.email}</span></div>
                            <div class="e-contact-item"><span class="e-icon">📍</span> <span class="e-val">${d.address}</span></div>
                        </div>
                        
                        <div class="e-side-sec">
                            <div class="e-side-title">${isTr ? 'YETENEKLER' : 'SKILLS'}</div>
                            ${d.skills.split(',').map(s => s.trim() ? `
                                <div class="e-skill-item">
                                    <span class="e-skill-name">${s.trim()}</span>
                                </div>
                            ` : '').join('')}
                        </div>
                        
                        ${d.languages ? `
                        <div class="e-side-sec">
                            <div class="e-side-title">${isTr ? 'DİLLER' : 'LANGUAGES'}</div>
                             ${d.languages.split(',').map(s => s.trim() ? `
                                <div class="e-skill-item">
                                    <span class="e-skill-name">${s.trim()}</span>
                                </div>
                            ` : '').join('')}
                        </div>
                        ` : ''}

                        ${d.interests ? `
                        <div class="e-side-sec">
                            <div class="e-side-title">${isTr ? 'İLGİ ALANLARI' : 'INTERESTS'}</div>
                             <div class="e-interests">
                                ${d.interests.split(',').map(i => i.trim() ? `<div class="e-interest-item">${i.trim()}</div>` : '').join('')}
                            </div>
                        </div>
                        ` : ''}
                    </div>

        <div class="e-main">
            <div class="e-header">
                <div class="e-name">${d.name}</div>
                <div class="e-title">${d.title}</div>
            </div>

            ${d.summary ? `
            <div class="e-section">
                <div class="e-sec-title">${isTr ? 'ÖZET' : 'SUMMARY'}</div>
                <div class="e-summary">${d.summary}</div>
            </div>` : ''}

            <div class="e-section">
                <div class="e-sec-title">${isTr ? 'İŞ DENEYİMLERİ' : 'WORK EXPERIENCE'}</div>
                ${d.experience.map(e => `
                                <div class="e-item">
                                    <div class="e-item-head">
                                        <div><span class="e-comp">${e.comp}</span></div>
                                        <div class="e-date">${e.date}</div>
                                    </div>
                                    <div class="e-role-hl">${e.role}</div>
                                    <div class="e-desc">${e.desc}</div>
                                </div>
                            `).join('')}
            </div>
            
            <div class="e-section">
               <div class="e-sec-title">${isTr ? 'EĞİTİMLER VE KURSLAR' : 'EDUCATION & COURSES'}</div>
                ${d.education.map(e => `
                                <div class="e-item">
                                    <div class="e-comp">${e.sch}</div>
                                    <div class="e-role-hl">${e.deg}</div>
                                    <div class="e-date">${e.date}</div>
                                </div>
                            `).join('')}
            </div>
        </div>
    `;
                }
                else if (theme === 'bloom') {
                    html = `
                        <div class="a-blob-1"></div>
                    <div class="a-blob-2"></div>
                    <div class="a-container">
                        <div class="a-left">
                            ${d.photo ? `<img src="${d.photo}" class="a-photo">` : ''}
                            
                            ${d.summary ? `
                            <div class="a-sec-title">${isTr ? 'HAKKINDA' : 'ABOUT'}</div>
                            <div class="a-text">
                                ${d.summary}
                            </div>` : ''}
                            
                            <div class="a-sec-title">${lbl.skills.toUpperCase()}</div>
                            <div style="margin-bottom: 30px;">
                                ${d.skills.split(',').map(s => s.trim() ? ` <div class="a-skill-row"><span>${s.trim()}</span></div>` : '').join('')}
                            </div>

                            ${d.languages ? `
                            <div class="a-sec-title">${isTr ? 'DİLLER' : 'LANGUAGES'}</div>
                             <div style="margin-bottom: 30px;">
                                ${d.languages.split(',').map(s => s.trim() ? `<div class="a-skill-row"><span>${s.trim()}</span></div>` : '').join('')}
                            </div>
                            ` : ''}
                            
                            <div class="a-sec-title">${lbl.contact.toUpperCase()}</div>
                            <div class="a-contact-row"><span class="a-label">${lbl.phone}</span> ${d.phone}</div>
                            <div class="a-contact-row"><span class="a-label">${lbl.email}</span> ${d.email}</div>
                            <div class="a-contact-row"><span class="a-label">${lbl.address}</span> ${d.address}</div>
                        </div>
                        
                        <div class="a-right">
                            <div class="a-name">${d.name}</div>
                            <div class="a-title">${d.title}</div>
                            
                            <div class="a-right-sec">
                                <div class="a-sec-title">${lbl.edu.toUpperCase()}</div>
                                ${d.education.map(e => `
                                    <div class="a-item">
                                        <div class="a-comp">${e.sch}</div>
                                        <div class="a-date">${e.date}</div>
                                        <div class="a-text" style="margin-bottom:0;">${e.deg}</div>
                                    </div>
                                `).join('')}
                            </div>
                            
                            <div class="a-right-sec">
                                <div class="a-sec-title">${lbl.exp.toUpperCase()}</div>
                                ${d.experience.map(e => `
                                    <div class="a-item">
                                        <div class="a-comp">${e.comp}</div>
                                        <div class="a-role-line">${e.role}</div>
                                        <div class="a-desc">
                                            ${e.desc.split(/[•\n]/).filter(g => g.trim()).map(l => `<div class="a-bullet-item"><span class="a-bullet"></span><span>${l.trim()}</span></div>`).join('')}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
    `;
                }
                else if (theme === 'wave') {
                    html = `
        <div class="s-left">
                        <div class="s-top-wave"></div>
                        <div class="s-bottom-wave"></div>
                        <div class="s-bottom-wave2"></div>
                        ${d.photo ? `<div class="s-photo-frame"><img src="${d.photo}" class="s-photo"></div>` : ''}
                        <div class="s-name-box">
                            <div class="s-name">${d.name}</div>
                            <div class="s-title">${d.title}</div>
                        </div>
                        <div class="s-contact-box">
                             <div class="s-contact-row"><div class="s-icon-circle">📍</div><div class="s-contact-text">${d.address || '-'}</div></div>
                            <div class="s-contact-row"><div class="s-icon-circle">📞</div><div class="s-contact-text">${d.phone || '-'}</div></div>
                            <div class="s-contact-row"><div class="s-icon-circle">✉️</div><div class="s-contact-text">${d.email || '-'}</div></div>
                             ${d.website ? `<div class="s-contact-row"><div class="s-icon-circle">🌐</div><div class="s-contact-text">${d.website}</div></div>` : ''}
                        </div>
                    </div>
        <div class="s-right">
            ${d.summary ? `
            <div class="s-section" style="margin-bottom: 20px;">
                <div class="s-head">${isTr ? 'ÖZET' : 'PROFILE'}</div>
                <div class="s-desc">${d.summary}</div>
            </div>` : ''}

            <div class="s-section">
                <div class="s-head">${lbl.exp || 'DENEYİM'}</div>
                ${d.experience.map(e => `
                                <div class="s-item">
                                    <div class="s-role">${e.role}</div>
                                    <div class="s-info">${e.comp} | ${e.date}</div>
                                    <div class="s-desc">${e.desc}</div>
                                </div>
                            `).join('')}
            </div>
            <div class="s-section">
                <div class="s-head">${lbl.edu || 'EĞİTİM'}</div>
                ${d.education.map(e => `
                                <div class="s-item">
                                    <div class="s-role">${e.sch}</div>
                                    <div class="s-info">${e.deg} | ${e.date}</div>
                                </div>
                            `).join('')}
            </div>
            <div class="s-section">
                <div class="s-head">${lbl.skills || 'YETENEKLER'}</div>
                <div class="s-skill-cloud">${d.skills.split(',').map(s => s.trim() ? `<span class="s-tag">${s.trim()}</span>` : '').join('')}</div>
            </div>

            ${d.languages ? `
            <div class="s-section">
                <div class="s-head">${isTr ? 'DİLLER' : 'LANGUAGES'}</div>
                <div class="s-skill-cloud">${d.languages.split(',').map(s => s.trim() ? `<span class="s-tag" style="background:var(--primary-light); color:var(--primary);">${s.trim()}</span>` : '').join('')}</div>
            </div>
            ` : ''}

            ${d.interests ? `
            <div class="s-section">
                <div class="s-head">${isTr ? 'İLGİ ALANLARI' : 'INTERESTS'}</div>
                <div class="s-desc" style="font-size:0.9rem;">${d.interests}</div>
            </div>
            ` : ''}
        </div>
    `;
                }
                else if (false) { // Duplicate Erdem removed (was causing issues)
                    html = `
        < div class="e-sidebar" >
            ${d.photo ? `<div class="e-photo-frame"><img src="${d.photo}" class="e-photo"></div>` : ''}
                        
                        <div class="e-side-sec">
                            <div class="e-side-title">${lbl.contact || 'İletişim'}</div>
                            <div class="e-contact-item"><span class="e-icon">📱</span> <span class="e-val">${d.phone}</span></div>
                            <div class="e-contact-item"><span class="e-icon">📧</span> <span class="e-val">${d.email}</span></div>
                            <div class="e-contact-item"><span class="e-icon">📍</span> <span class="e-val">${d.address}</span></div>
                            ${d.website ? `<div class="e-contact-item"><span class="e-icon">🔗</span> <span class="e-val">${d.website}</span></div>` : ''}
                        </div>
                        
                        <div class="e-side-sec">
                            <div class="e-side-title">${lbl.skills || 'Yetenekler'}</div>
                            ${d.skills.split(',').map(s => `
                                <div class="e-skill-item">
                                    <span class="e-skill-name">${s.trim()}</span>
                                    <div class="e-bar-bg"><div class="e-bar-fill" style="width: ${Math.floor(Math.random() * 40 + 60)}%"></div></div>
                                </div>
                            `).join('')}
                        </div>
                        
                        <div class="e-side-sec">
                             <div class="e-side-title">İlgi Alanları</div>
                             <div class="e-list-item"><span class="e-bullet"></span> Basketbol</div>
                             <div class="e-list-item"><span class="e-bullet"></span> Kitap Okuma</div>
                             <div class="e-list-item"><span class="e-bullet"></span> Teknoloji</div>
                        </div>
                    </div >

        <div class="e-main">
            <div class="e-header">
                <div class="e-name">${d.name}</div>
                <div class="e-title">${d.title}</div>
            </div>

            <div class="e-section">
                <div class="e-sec-title">Özet</div>
                <div class="e-desc">Profesyonel kariyerim boyunca edindiğim tecrübeler ve yetenekler doğrultusunda firmanıza değer katmayı hedefleyen, takım çalışmasına yatkın ve sürekli öğrenmeye açık biriyim.</div>
            </div>

            <div class="e-section">
                <div class="e-sec-title">${lbl.edu || 'Eğitim'}</div>
                ${d.education.map(e => `
                                <div class="e-item">
                                    <div class="e-item-head">
                                        <div class="e-comp">${e.sch}</div>
                                        <div class="e-date">${e.date}</div>
                                    </div>
                                    <div class="e-desc" style="color:${color}">${e.deg}</div>
                                </div>
                            `).join('')}
            </div>

            <div class="e-section">
                <div class="e-sec-title">${lbl.exp || 'İş Deneyimi'}</div>
                ${d.experience.map(e => `
                                <div class="e-item">
                                    <div class="e-item-head">
                                        <div><span class="e-comp">${e.comp}</span> <span class="e-role-hl">| ${e.role}</span></div>
                                        <div class="e-date">${e.date}</div>
                                    </div>
                                    <div class="e-desc">${e.desc}</div>
                                </div>
                            `).join('')}
            </div>
        </div>
    `;
                }
                else if (theme === 'bold') {
                    html = `
        <div class="k-left">
            <div class="k-top-yellow"></div>
                        ${d.photo ? `<div class="k-photo-container"><img src="${d.photo}" class="k-photo"></div>` : ''}
                        <div class="k-name-box">
                            <div class="k-name">${d.name}</div>
                            <div class="k-title">${d.title}</div>
                        </div>
                        <div class="k-left-sec">
                            <div class="k-sec-icon-head">
                                <div class="k-sec-icon">📞</div>
                                <div>
                                    <div class="k-sec-name">Contact</div>
                                    <div class="k-sec-line"></div>
                                </div>
                            </div>
                            <div class="k-contact-row"><div class="k-c-label">Email</div><div class="k-c-val">${d.email}</div></div>
                            <div class="k-contact-row"><div class="k-c-label">Phone</div><div class="k-c-val">${d.phone}</div></div>
                            ${d.website ? `<div class="k-contact-row"><div class="k-c-label">Website</div><div class="k-c-val">${d.website}</div></div>` : ''}
                        </div>
                        <div class="k-left-sec">
                            <div class="k-sec-icon-head">
                                <div class="k-sec-icon">💡</div>
                                <div>
                                    <div class="k-sec-name">Skills</div>
                                    <div class="k-sec-line"></div>
                                </div>
                            </div>
                            ${d.skills.split(',').slice(0, 3).map(s => `
                                <div class="k-skill-row">
                                    <div class="k-skill-label">${s.trim()}</div>
                                    <div class="k-skill-bar-bg"><div class="k-skill-bar-fill" style="width: 85%"></div></div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="k-left-sec">
                            <div class="k-sec-icon-head">
                                <div class="k-sec-icon">❤️</div>
                                <div>
                                    <div class="k-sec-name">Interests</div>
                                    <div class="k-sec-line"></div>
                                </div>
                            </div>
                            <div class="k-interest-container" style="display: flex; flex-wrap: wrap; gap: 8px;">
                                ${(d.interests || '').split(',').map(i => `<div class="k-interest-bullet" style="margin:0;">${i.trim()}</div>`).join('')}
                            </div>
                        </div>
                    </div>
        <div class="k-right">
            ${d.summary ? `
            <div class="k-r-section">
                <div class="k-r-head">
                    <div class="k-r-icon">👤</div>
                    <div class="k-r-title">Profile</div>
                </div>
                <div class="k-profile-text">${d.summary}</div>
            </div>
            ` : ''}

            <div class="k-r-section">
                <div class="k-r-head">
                    <div class="k-r-icon">💼</div>
                    <div class="k-r-title">Experience</div>
                </div>
                <div class="k-timeline">
                    ${d.experience.map(e => `
                                    <div class="k-exp-item">
                                        <div class="k-exp-dot"></div>
                                        <div class="k-exp-title">${e.role}</div>
                                        <div class="k-exp-meta">${e.comp} | ${e.date}</div>
                                        <div class="k-exp-desc">${e.desc}</div>
                                    </div>
                                `).join('')}
                </div>
            </div>
            <div class="k-r-section">
                <div class="k-r-head">
                    <div class="k-r-icon">🎓</div>
                    <div class="k-r-title">Education</div>
                </div>
                ${d.education.map(e => `
                                <div class="k-edu-box">
                                    <div class="k-edu-title">${e.deg}</div>
                                    <div class="k-edu-meta">${e.sch} | ${e.date}</div>
                                </div>
                            `).join('')}
            </div>
            
            ${d.languages ? `
            <div class="k-r-section">
                <div class="k-r-head">
                    <div class="k-r-icon">🗣️</div>
                    <div class="k-r-title">Languages</div>
                </div>
                <div style="font-size: 0.9rem; color: #4b5563;">
                    ${d.languages}
                </div>
            </div>
            ` : ''}
        </div>
    `;
                }
                else if (theme === 'prime') {
                    html = `
        <div class="o-header">
            <div class="o-circle-white">
                <div class="o-name">${d.name}</div>
                <div class="o-title-badge">${d.title.toUpperCase()}</div>
                <div class="o-company">
                    <div class="o-company-icon"></div>
                    <span>${d.address || (isTr ? 'Konum Girilmedi' : 'Location Not Set')}</span>
                </div>
            </div>
            <div class="o-circle-yellow">
                ${d.photo ? `<img src="${d.photo}" class="o-photo">` : ''}
            </div>
        </div>
        
        <div class="o-grid">
            ${d.summary ? `
            <div class="o-box" style="grid-column: span 2;">
                <div class="o-box-head">
                    <div class="o-icon-box">👤</div>
                    <div class="o-box-title">${isTr ? 'Profil' : 'Profile'}</div>
                </div>
                <div class="o-box-content">${d.summary}</div>
            </div>` : ''}

            <div class="o-box">
                <div class="o-box-head">
                    <div class="o-icon-box">💼</div>
                    <div class="o-box-title">${isTr ? 'Deneyim' : 'Experience'}</div>
                </div>
                <div class="o-box-content">
                    <ul class="o-list">
                        ${d.experience.map(e => `<li><strong>${e.role}</strong> - ${e.comp} (${e.date})<br><span style="opacity:0.8; font-size:0.75rem;">${e.desc}</span></li>`).join('')}
                    </ul>
                </div>
            </div>
            
            <div class="o-box">
                <div class="o-box-head">
                    <div class="o-icon-box">🎓</div>
                    <div class="o-box-title">${isTr ? 'Eğitim & Beceriler' : 'Education & Skills'}</div>
                </div>
                <div class="o-box-content">
                    <ul class="o-list">
                        ${d.education.map(e => `<li><strong>${e.sch}</strong> - ${e.deg} (${e.date})</li>`).join('')}
                    </ul>
                    <hr style="border:0; border-top:1px dashed #ddd; margin:10px 0;">
                    <div style="font-weight:700; color:#555; margin-bottom:5px;">Skills:</div>
                    <div>${(d.skills || '').split(',').map(s => `<span style="background:#f0f0f0; padding:2px 6px; border-radius:4px; margin-right:4px; font-size:0.7rem; display:inline-block; margin-bottom:4px;">${s.trim()}</span>`).join('')}</div>
                </div>
            </div>
            
            ${(d.languages || d.interests) ? `
            <div class="o-box" style="grid-column: span 2;">
                <div class="o-box-head">
                    <div class="o-icon-box">🌟</div>
                    <div class="o-box-title">${isTr ? 'Diğer' : 'Other'}</div>
                </div>
                <div class="o-box-content" style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                    ${d.languages ? `<div><strong>${isTr ? 'Diller' : 'Languages'}:</strong> ${d.languages}</div>` : ''}
                    ${d.interests ? `<div><strong>${isTr ? 'İlgi Alanları' : 'Interests'}:</strong> ${d.interests}</div>` : ''}
                </div>
            </div>` : ''}
        </div>
        
        <div class="o-footer">
            <div class="o-contact-item"><div class="o-contact-icon">✉️</div>${d.email}</div>
            <div class="o-contact-item"><div class="o-contact-icon">🔗</div>linkedin.com/${d.name.toLowerCase().replace(' ', '')}</div>
            <div class="o-contact-item"><div class="o-contact-icon">📞</div>${d.phone}</div>
            <div class="o-contact-item"><div class="o-contact-icon">🐦</div>@${d.name.toLowerCase().replace(' ', '')}</div>
        </div>
    `;
                }
                else if (theme === 'leftside') {
                    html = `
        < div class="res-left" >
            ${photoHtml}
                        <div class="res-name">${d.name}</div>
                        <div class="res-title">${d.title}</div>
                        <div class="res-contact">
                            <div>📧 ${d.email}</div>
                            <div>🔗 ${d.website}</div>
                            ${d.phone ? `<div>📱 ${d.phone}</div>` : ''}
                            ${d.address ? `<div>📍 ${d.address}</div>` : ''}
                        </div>
                        
                        <div class="res-sec-title">${lbl.skills}</div>
                        <div class="res-skills">
                            ${d.skills.split(',').map(s => s.trim() ? `<span class="res-tag">${s.trim()}</span>` : '').join('')}
                        </div>

                        ${d.languages ? `
                        <div class="res-sec-title" style="margin-top:20px;">${isTr ? 'DİLLER' : 'LANGUAGES'}</div>
                        <div class="res-skills" style="flex-direction:column; align-items:flex-start;">
                             ${d.languages.split(',').map(s => s.trim() ? `<span style="font-size:0.85rem; margin-bottom:5px;">• ${s.trim()}</span>` : '').join('')}
                        </div>` : ''}

                        ${d.interests ? `
                        <div class="res-sec-title" style="margin-top:20px;">${isTr ? 'İLGİ ALANLARI' : 'INTERESTS'}</div>
                        <div class="res-skills" style="flex-direction:column; align-items:flex-start;">
                             ${d.interests.split(',').map(s => s.trim() ? `<span style="font-size:0.85rem; margin-bottom:5px;">• ${s.trim()}</span>` : '').join('')}
                        </div>` : ''}
                    </div >
        <div class="res-right">
            ${d.summary ? `
            <div class="res-section">
                <div class="res-sec-title">${isTr ? 'ÖZET' : 'SUMMARY'}</div>
                <div class="res-desc">${d.summary}</div>
            </div>` : ''}

            <div class="res-section">
                <div class="res-sec-title">${lbl.exp}</div>
                ${d.experience.map(e => `
                                <div class="res-item">
                                    <div class="res-item-head">
                                        <span class="res-role">${e.role}</span>
                                        <span class="res-date">${e.date}</span>
                                    </div>
                                    <div class="res-comp">${e.comp}</div>
                                    ${e.desc ? `<div class="res-desc">${e.desc}</div>` : ''}
                                </div>
                            `).join('')}
            </div>
            <div class="res-section">
                <div class="res-sec-title">${lbl.edu}</div>
                ${d.education.map(e => `
                                <div class="res-item">
                                    <div class="res-item-head">
                                        <span class="res-role">${e.deg}</span>
                                        <span class="res-date">${e.date}</span>
                                    </div>
                                    <div class="res-comp">${e.sch}</div>
                                </div>
                            `).join('')}
            </div>
        </div>
    `;
                }
                else {
                    // Standard Layout (Elegant, Titan, Modern, etc)
                    let headerHtml = '';
                    if (theme === 'executive') {
                        headerHtml = `
                        <div class="res-header">
                            <div class="res-info">
                                <div class="res-name">${d.name}</div>
                                <div class="res-title">${d.title}</div>
                                <div class="res-contact">
                                    <span>📧 ${d.email}</span>
                                    <span>🔗 ${d.website}</span>
                                    ${d.phone ? `<span>📱 ${d.phone}</span>` : ''}
                                    ${d.address ? `<span>📍 ${d.address}</span>` : ''}
                                </div>
                            </div>
                            ${photoHtml}
                        </div>`;
                    } else {
                        headerHtml = `
                        <div class="res-header">
                            ${photoHtml}
                            <div class="res-name">${d.name}</div>
                            <div class="res-title">${d.title}</div>
                            <div class="res-contact">
                                <span>📧 ${d.email}</span>
                                <span>🔗 ${d.website}</span>
                                ${d.phone ? `<span>📱 ${d.phone}</span>` : ''}
                                ${d.address ? `<span>📍 ${d.address}</span>` : ''}
                            </div>
                        </div>`;
                    }

                    html = headerHtml + `
                    
                    ${d.summary ? `
                    <div class="res-section">
                        <div class="res-sec-title">${isTr ? 'ÖZET' : 'SUMMARY'}</div>
                        <div class="res-desc" style="margin-bottom:20px;">${d.summary}</div>
                    </div>` : ''}
                    
                    <div class="res-section">
                        <div class="res-sec-title">${lbl.exp}</div>
                        ${d.experience.map(e => `
                            <div class="res-item">
                                <div class="res-item-head">
                                    <span class="res-role">${e.role}</span>
                                    <span class="res-date">${e.date}</span>
                                </div>
                                <div class="res-comp">${e.comp}</div>
                                ${e.desc ? `<div class="res-desc">${e.desc}</div>` : ''}
                            </div>
                        `).join('')}
                    </div>

                    <div class="res-section">
                        <div class="res-sec-title">${lbl.edu}</div>
                        ${d.education.map(e => `
                            <div class="res-item">
                                <div class="res-item-head">
                                    <span class="res-role">${e.deg}</span>
                                    <span class="res-date">${e.date}</span>
                                </div>
                                <div class="res-comp">${e.sch}</div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="res-section" style="margin-bottom: 12px;">
                        <div class="res-sec-title" style="margin-bottom: 6px;">${lbl.skills}</div>
                        <div class="res-skills" style="gap: 6px;">
                            ${d.skills.split(',').map(s => s.trim() ? `<span class="res-tag" style="padding: 3px 8px; font-size: 0.8rem;">${s.trim()}</span>` : '').join('')}
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        ${d.languages ? `
                        <div class="res-section" style="margin-bottom: 0;">
                            <div class="res-sec-title" style="margin-bottom: 6px;">${isTr ? 'DİLLER' : 'LANGUAGES'}</div>
                            <div class="res-skills" style="gap: 6px;">
                                 ${d.languages.split(',').map(s => s.trim() ? `<span class="res-tag" style="background:${d.color}15; color:${d.color}; border:1px solid ${d.color}40; padding: 3px 8px; font-size: 0.8rem;">${s.trim()}</span>` : '').join('')}
                            </div>
                        </div>` : '<div></div>'}

                        ${d.interests ? `
                        <div class="res-section" style="margin-bottom: 0;">
                            <div class="res-sec-title" style="margin-bottom: 6px;">${isTr ? 'İLGİ ALANLARI' : 'INTERESTS'}</div>
                            <div class="res-desc" style="margin-top:0; font-size: 0.8rem; line-height: 1.4;">${d.interests}</div>
                        </div>` : ''}
                    </div>
    `;

                }

                return { html, css };
            }
        },

        // --- CONVERTERS ---

        dataConverters: {
            jsonToCsv: function (json, options = {}) {
                try {
                    let arr = typeof json !== 'object' ? JSON.parse(json) : json;
                    if (arr && typeof arr === 'object' && !Array.isArray(arr)) arr = [arr];
                    if (!Array.isArray(arr) || arr.length === 0) return { success: false, message: "Valid JSON Array Required" };
                    const flatten = (obj, prefix = '', res = {}) => {
                        for (let key in obj) {
                            if (!obj.hasOwnProperty(key)) continue;
                            const val = obj[key];
                            const newKey = prefix ? `${prefix}.${key} ` : key;
                            if (val && typeof val === 'object' && !Array.isArray(val)) flatten(val, newKey, res);
                            else res[newKey] = val;
                        }
                        return res;
                    };
                    const flatArr = arr.map(item => flatten(item));
                    const headers = [...new Set(flatArr.flatMap(Object.keys))];
                    const delim = options.delimiter || ',';
                    const includeHeader = options.header !== false;

                    const rows = flatArr.map(obj => headers.map(header => {
                        let val = obj[header];
                        if (val === null || val === undefined) return '';
                        let strVal = (typeof val === 'object') ? JSON.stringify(val) : String(val);
                        if (strVal.includes(delim) || strVal.includes('"') || strVal.includes('\n')) strVal = `"${strVal.replace(/\"/g, '""')}"`;
                        return strVal;
                    }).join(delim));

                    const csvContent = (includeHeader ? [headers.join(delim)] : []).concat(rows).join('\n');
                    return { success: true, result: csvContent, message: "OK" };
                } catch (e) { return { success: false, message: "JSON Error: " + e.message }; }
            },
            csvToJson: function (csv, options = {}) {
                try {
                    if (!csv || !csv.trim()) return { success: false, message: "Empty CSV" };
                    const delim = options.delimiter || ',';
                    const hasHeader = options.header !== false;
                    const lines = [];
                    let currentRow = [], currentVal = '', inQuotes = false;
                    for (let i = 0; i < csv.length; i++) {
                        const char = csv[i];
                        if (char === '"') { if (inQuotes && csv[i + 1] === '"') { currentVal += '"'; i++; } else { inQuotes = !inQuotes; } }
                        else if (char === delim && !inQuotes) { currentRow.push(currentVal); currentVal = ''; }
                        else if ((char === '\r' || char === '\n') && !inQuotes) { currentRow.push(currentVal); lines.push(currentRow); currentRow = []; currentVal = ''; if (char === '\r' && csv[i + 1] === '\n') i++; }
                        else { currentVal += char; }
                    }
                    if (currentVal || currentRow.length) { currentRow.push(currentVal); lines.push(currentRow); }
                    if (lines.length > 0 && lines[lines.length - 1].length === 1 && lines[lines.length - 1][0] === '') lines.pop(); // Remove empty last line
                    if (lines.length < 1) return { success: false, message: "Empty Data" };

                    let headers;
                    let dataLines;
                    if (hasHeader) { headers = lines[0].map(h => h.trim()); dataLines = lines.slice(1); }
                    else { headers = lines[0].map((_, i) => `field${i + 1}`); dataLines = lines; }

                    const result = dataLines.map(row => {
                        const flatObj = {};
                        headers.forEach((header, idx) => {
                            let val = row[idx] !== undefined ? row[idx] : "";
                            if (val !== "" && !isNaN(Number(val)) && !val.startsWith("0")) val = Number(val);
                            else if (val === "true") val = true;
                            else if (val === "false") val = false;
                            else if (val.startsWith("[") || val.startsWith("{")) { try { val = JSON.parse(val); } catch (e) { } }

                            // Rehydrate
                            const keys = header.split('.');
                            let current = flatObj;
                            for (let i = 0; i < keys.length; i++) {
                                const k = keys[i];
                                if (i === keys.length - 1) current[k] = val;
                                else { current[k] = current[k] || {}; current = current[k]; }
                            }
                        });
                        return flatObj;
                    });
                    return { success: true, result: JSON.stringify(result, null, 2), message: "OK" };
                } catch (e) { return { success: false, message: "CSV Error: " + e.message }; }
            },
            jsonToXml: (jsonStr) => {
                try {
                    const obj = JSON.parse(jsonStr);

                    const toXml = (o, tagName = 'root') => {
                        if (o === null || o === undefined) return tagName ? `<${tagName}></${tagName}>` : '';

                        // Primitive types
                        if (typeof o !== 'object') {
                            return tagName ? `<${tagName}>${String(o)}</${tagName}>` : String(o);
                        }

                        // Array
                        if (Array.isArray(o)) {
                            return o.map(item => toXml(item, tagName || 'item')).join('');
                        }

                        // Object
                        const content = Object.entries(o).map(([k, v]) => {
                            const safeKey = k.replace(/[^a-zA-Z0-9_-]/g, '_');
                            // Recurse without a default tagName wrapper, pass the key as the tag name
                            // If v is an array, we handle it specifically to match standard XML conventions
                            if (Array.isArray(v)) {
                                return v.map(item => toXml(item, safeKey)).join('');
                            }
                            return toXml(v, safeKey);
                        }).join('');

                        return tagName ? `<${tagName}>${content}</${tagName}>` : content;
                    };

                    return { success: true, result: toXml(obj, 'root') };
                } catch (e) {
                    return { success: false, result: '', message: e.message };
                }
            },
            xmlToJson: (xmlStr) => {
                try {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(xmlStr, "text/xml");

                    // Check for parsing errors
                    const parserError = doc.querySelector('parsererror');
                    if (parserError) {
                        throw new Error('Invalid XML: ' + parserError.textContent);
                    }

                    const toJson = (node) => {
                        // Text node
                        if (node.nodeType === 3) {
                            const text = node.nodeValue.trim();
                            return text || null;
                        }

                        // Element node with no children (leaf)
                        if (node.children.length === 0) {
                            const text = node.textContent.trim();
                            // Try to parse as number or boolean
                            if (text === 'true') return true;
                            if (text === 'false') return false;
                            if (text !== '' && !isNaN(text)) return Number(text);
                            return text;
                        }

                        const obj = {};
                        const childNames = {};

                        // Count occurrences of each child tag
                        for (let i = 0; i < node.children.length; i++) {
                            const childName = node.children[i].nodeName;
                            childNames[childName] = (childNames[childName] || 0) + 1;
                        }

                        // Process children
                        for (let i = 0; i < node.children.length; i++) {
                            const child = node.children[i];
                            const childName = child.nodeName;
                            const childValue = toJson(child);

                            // If multiple children with same name, create array
                            if (childNames[childName] > 1) {
                                if (!obj[childName]) obj[childName] = [];
                                obj[childName].push(childValue);
                            } else {
                                obj[childName] = childValue;
                            }
                        }

                        // Convert numeric keys to array (e.g., <0>read</0> <1>write</1>)
                        const keys = Object.keys(obj);
                        const allNumeric = keys.length > 0 && keys.every(k => !isNaN(k));
                        if (allNumeric) {
                            return Object.values(obj);
                        }

                        return obj;
                    };

                    const result = toJson(doc.documentElement);

                    // RECURSIVE unwrap: Remove all 'root' wrapper objects at ANY depth
                    const deepUnwrap = (obj) => {
                        if (obj === null || obj === undefined) return obj;
                        if (typeof obj !== 'object') return obj;

                        // Arrays: unwrap each item
                        if (Array.isArray(obj)) {
                            return obj.map(item => deepUnwrap(item));
                        }

                        // Object: check if it's a single-key 'root' wrapper
                        const keys = Object.keys(obj);
                        if (keys.length === 1 && keys[0] === 'root') {
                            return deepUnwrap(obj.root);  // Recursively unwrap
                        }

                        // Otherwise, unwrap all values recursively
                        const unwrapped = {};
                        for (const [key, value] of Object.entries(obj)) {
                            unwrapped[key] = deepUnwrap(value);
                        }
                        return unwrapped;
                    };

                    const finalResult = deepUnwrap(result);

                    return { success: true, result: JSON.stringify(finalResult, null, 2) };
                } catch (e) {
                    return { success: false, result: '', message: 'XML Parse Error: ' + e.message };
                }
            },
            jsonToSql: (jsonStr) => {
                try {
                    const arr = JSON.parse(jsonStr);
                    if (!Array.isArray(arr)) throw new Error("Input must be JSON Array");
                    const headers = Object.keys(arr[0]);
                    const sql = arr.map(obj => `INSERT INTO table_name (${headers.join(', ')}) VALUES (${headers.map(h => typeof obj[h] === 'string' ? `'${obj[h].replace(/'/g, "''")}'` : obj[h]).join(', ')});`).join('\n');
                    return { success: true, result: sql };
                } catch (e) { return { success: false, message: e.message }; }
            },
            timestampToDate: (ts) => { const d = new Date(Number(ts)); return { success: true, result: { local: d.toLocaleString(), utc: d.toUTCString(), iso: d.toISOString() } }; },
            getCurrentTimestamp: () => ({ success: true, result: { seconds: Math.floor(Date.now() / 1000), milliseconds: Date.now(), iso: new Date().toISOString() } })
        },

        unitConverter: {
            convert: (val, from, to, type) => {
                const rates = {
                    length: { mk: 1, mm: 0.001, cm: 0.01, m: 1, km: 1000, inch: 0.0254, foot: 0.3048, yard: 0.9144, mile: 1609.34 },
                    weight: { mk: 1, mg: 0.000001, g: 0.001, kg: 1, ton: 1000, oz: 0.0283495, lb: 0.453592 },
                    data: { mk: 1, B: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776 },
                    area: { mk: 1, sqm: 1, sqkm: 1000000, sqfoot: 0.092903, acre: 4046.86, hectare: 10000 },
                    volume: { mk: 1, ml: 0.001, l: 1, gallon: 3.78541, cup: 0.236588, pint: 0.473176, quart: 0.946353 },
                    speed: { mk: 1, mps: 1, kph: 0.277778, mph: 0.44704, knot: 0.514444 },
                    kitchen: { mk: 1, ml: 1, tsp: 4.92892, tbsp: 14.7868, cup: 236.588 }
                };
                let result;
                if (type === 'temperature') {
                    let cUrl;
                    if (from === 'C') cUrl = val; else if (from === 'F') cUrl = (val - 32) * 5 / 9; else if (from === 'K') cUrl = val - 273.15;
                    if (to === 'C') result = cUrl; else if (to === 'F') result = (cUrl * 9 / 5) + 32; else if (to === 'K') result = cUrl + 273.15;
                } else {
                    const cat = rates[type];
                    if (!cat) return { success: false, message: "Invalid Category" };
                    result = (val * cat[from]) / cat[to];
                }
                return { success: true, result: Number(result.toPrecision(6)) };
            },
            convertCurrency: async (val, from, to) => {
                // Fixed rates updated for 2026 demo (approximate)
                const rates = { USD: 1, EUR: 0.92, TRY: 43.15, GBP: 0.78, JPY: 155.5, CNY: 7.30 };
                // Simulate network delay for realism if not fetching
                await new Promise(r => setTimeout(r, 300));
                return { success: true, result: Number(((val / rates[from]) * rates[to]).toFixed(2)), message: "Based on estimated rates" };
            }
        },

        codeBeautifier: {
            beautifyJSON: function (code) { try { return { success: true, result: JSON.stringify(JSON.parse(code), null, 4) }; } catch (e) { return { success: false, message: e.message }; } },
            beautifyJS: function (code) { return this._indent(code); },
            beautifyTypeScript: function (code) { return this._indent(code); },
            beautifyHTML: function (code) { return this._indentXML(code); },
            beautifyCSS: function (code) {
                let formatted = '', indent = 0;
                code.replace(/\{/g, '{\n').replace(/\}/g, '\n}\n').replace(/;/g, ';\n').split('\n').forEach(line => {
                    line = line.trim(); if (!line) return;
                    if (line.includes('}')) indent--;
                    formatted += '    '.repeat(Math.max(0, indent)) + line + '\n';
                    if (line.includes('{')) indent++;
                });
                return { success: true, result: formatted };
            },
            beautifySQL: function (code) {
                const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'JOIN', 'LEFT JOIN', 'INNER JOIN', 'LIMIT'];
                let formatted = code;
                keywords.forEach(kw => { formatted = formatted.replace(new RegExp(`\\b${kw}\\b`, 'gi'), `\n${kw.toUpperCase()} `); });
                return { success: true, result: formatted.replace(/^\s+/, '') };
            },
            beautifyXML: function (code) { return this._indentXML(code); },
            beautifyPython: function (code) { return { success: true, result: code }; },
            beautifyPHP: function (code) { return this._indent(code); },
            beautifyC: function (code) { return this._indent(code); },
            _indent: function (code) {
                try {
                    let pad = 0;
                    return {
                        success: true, result: code.replace(/([\{\[])/g, '$1\n').replace(/([\}\]])/g, '\n$1').replace(/;/g, ';\n').split('\n').map(line => {
                            line = line.trim(); if (!line) return null;
                            if (line.match(/[\]\}]/)) pad--;
                            const str = '    '.repeat(Math.max(0, pad)) + line;
                            if (line.match(/[\[\{]/)) pad++;
                            return str;
                        }).filter(x => x).join('\n')
                    };
                } catch (e) { return { success: false, message: e.message }; }
            },
            _indentXML: function (xml) {
                let formatted = '', pad = 0;
                xml.replace(/(>)(<)(\/*)/g, '$1\r\n$2$3').split('\r\n').forEach(node => {
                    let indent = 0;
                    if (node.match(/.+<\/\w[^>]*>$/)) indent = 0; else if (node.match(/^<\/\w/)) { if (pad != 0) pad -= 1; } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) indent = 1;
                    formatted += '    '.repeat(pad) + node + '\r\n'; pad += indent;
                });
                return { success: true, result: formatted };
            }
        },

        // --- ANALYZERS ---

        textAnalyzer: {
            analyze: function (text, lang = 'en') {
                if (!text) return { success: false };

                // Get current language from global context if not provided, fallback to 'en'
                const currentLang = (typeof window !== 'undefined' && window.i18n) ? window.i18n.getCurrentLanguage() : lang;
                const isTr = currentLang === 'tr';

                // Basic counts
                const words = text.trim().split(/\s+/);
                const wordCount = words.length;
                const chars = text.length;
                const sentences = text.match(/[.!?]+/g) ? text.match(/[.!?]+/g).length : 1;
                const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length;

                // Reading Time
                const wpm = 200;
                const minutes = Math.ceil(wordCount / wpm);
                const readingTime = isTr ? `${minutes} dk` : `${minutes} min`;

                // Readability (Flesch-Kincaid)
                // Note: Valid mostly for English, but we adapt labels for TR
                const syllables = text.toLowerCase().match(/[aeiouyüöıəğşçñ]/g) ? text.toLowerCase().match(/[aeiouyüöıəğşçñ]/g).length : 1;
                let score = 206.835 - (1.015 * (wordCount / sentences)) - (84.6 * (syllables / wordCount));

                let readability = "Unknown";
                if (isTr) {
                    if (score >= 90) readability = "Çok Kolay";
                    else if (score >= 60) readability = "Standart";
                    else if (score >= 30) readability = "Zor";
                    else readability = "Çok Zor";
                } else {
                    if (score >= 90) readability = "Very Easy";
                    else if (score >= 60) readability = "Standard";
                    else if (score >= 30) readability = "Difficult";
                    else readability = "Very Difficult";
                }

                // Longest word
                const longestWord = words.reduce((longest, word) => {
                    const cleaned = word.replace(/[^a-zA-Z0-9çğıöşüÇĞİÖŞÜ]/g, '');
                    return cleaned.length > longest.length ? cleaned : longest;
                }, '');

                // Stop Words (EN & TR)
                const enStop = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'can', 'this', 'that', 'it', 'he', 'she', 'they', 'we', 'you', 'i'];
                const trStop = ['ve', 'veya', 'ile', 'için', 'bir', 'bu', 'şu', 'o', 'ama', 'fakat', 'ancak', 'lakin', 'da', 'de', 'ki', 'mi', 'mu', 'mı', 'mü', 'ben', 'sen', 'biz', 'siz', 'onlar', 'ne', 'nasıl', 'neden', 'niçin', 'gibi', 'kadar', 'olarak', 'olan', 'var', 'yok', 'çok', 'daha', 'en', 'ise'];

                const stopWords = new Set(isTr ? trStop : enStop);

                const wordFreq = {};
                words.forEach(word => {
                    const cleaned = word.toLowerCase().replace(/[^a-z0-9çğıöşü]/g, '');
                    if (cleaned.length > 2 && !stopWords.has(cleaned)) {
                        wordFreq[cleaned] = (wordFreq[cleaned] || 0) + 1;
                    }
                });

                const topWords = Object.entries(wordFreq)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 10)
                    .map(([word, count]) => ({ word, count }));

                return {
                    success: true,
                    stats: {
                        fleschScore: score.toFixed(1),
                        readability,
                        readingTime,
                        words: wordCount,
                        chars,
                        sentences,
                        paragraphs,
                        longestWord,
                        topWords
                    }
                };
            },

        },

        advancedTextTools: {
            formatText: (t, action) => {
                if (action === 'uppercase') return t.toUpperCase();
                if (action === 'lowercase') return t.toLowerCase();
                if (action === 'titlecase') return t.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
                if (action === 'reverse') return t.split('').reverse().join('');
                if (action === 'trim') return t.split('\n').map(l => l.trim()).filter(l => l).join('\n');
                if (action === 'remove-extra-spaces') return t.replace(/\s+/g, ' ').trim();
                return t;
            },
            findReplace: (t, f, r, isRegex, flags) => {
                if (!f) return t;
                try {
                    const pattern = isRegex ? new RegExp(f, flags) : new RegExp(f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags || 'g');
                    return t.replace(pattern, r);
                } catch (e) { return "Regex Error: " + e.message; }
            },
            checkGrammar: (t) => {
                const issues = [];
                if (t.length < 5) issues.push("Text is too short.");
                if (/[.!?]\s+[a-z]/.test(t)) issues.push("Lowercase letter after sentence.");
                return issues.length ? issues.join('\n') : "No obvious issues.";
            }
        },

        metaTagsTools: {
            generate: (d) => {
                let tags = `<!-- Primary Meta Tags -->
<title>${d.title || ''}</title>
<meta name="title" content="${d.title || ''}">
<meta name="description" content="${d.description || ''}">
${d.keywords ? `<meta name="keywords" content="${d.keywords}">` : ''}
${d.author ? `<meta name="author" content="${d.author}">` : ''}
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta charset="utf-8">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${d.url || ''}">
<meta property="og:title" content="${d.title || ''}">
<meta property="og:description" content="${d.description || ''}">
<meta property="og:image" content="${d.image || ''}">
${d.siteName ? `<meta property="og:site_name" content="${d.siteName}">` : ''}

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${d.url || ''}">
<meta property="twitter:title" content="${d.title || ''}">
<meta property="twitter:description" content="${d.description || ''}">
<meta property="twitter:image" content="${d.image || ''}">
${d.twitterHandle ? `<meta name="twitter:creator" content="${d.twitterHandle}">` : ''}`;

                return tags.replace(/^\s*[\r\n]/gm, ''); // Remove empty lines
            },
            getTemplates: () => ({
                blog: { title: 'My Amazing Blog Post', description: 'Read about the latest trends in tech.', keywords: 'blog, tech, news' },
                saas: { title: 'Product Name-Best Solution', description: 'Boost your productivity with our new tool.', keywords: 'saas, productivity, tool' }
            })
        },

        cronTools: {
            parse: function (expr) {
                const parts = expr.trim().split(/\s+/);
                if (parts.length < 5) return { success: false, message: "Invalid Format" };
                return { success: true, description: `Runs at ${parts[1]} past ${parts[0]}...` };
            },
            getNextRuns: (expr, count = 5) => {
                const runs = []; let now = new Date();
                for (let i = 0; i < count; i++) { now = new Date(now.getTime() + 5 * 60 * 1000); runs.push(now.toLocaleString()); }
                return runs;
            }
        },

        healthCalculator: {
            calculateAge: (dobStr) => {
                const dob = new Date(dobStr), now = new Date();
                const totalDays = Math.floor((now - dob) / (86400000));
                const years = now.getFullYear() - dob.getFullYear();

                // Zodiac
                const d = dob.getDate();
                const m = dob.getMonth() + 1;
                let zodiac = '';
                if ((m == 3 && d >= 21) || (m == 4 && d <= 19)) zodiac = "Aries";
                else if ((m == 4 && d >= 20) || (m == 5 && d <= 20)) zodiac = "Taurus";
                else if ((m == 5 && d >= 21) || (m == 6 && d <= 20)) zodiac = "Gemini";
                else if ((m == 6 && d >= 21) || (m == 7 && d <= 22)) zodiac = "Cancer";
                else if ((m == 7 && d >= 23) || (m == 8 && d <= 22)) zodiac = "Leo";
                else if ((m == 8 && d >= 23) || (m == 9 && d <= 22)) zodiac = "Virgo";
                else if ((m == 9 && d >= 23) || (m == 10 && d <= 22)) zodiac = "Libra";
                else if ((m == 10 && d >= 23) || (m == 11 && d <= 21)) zodiac = "Scorpio";
                else if ((m == 11 && d >= 22) || (m == 12 && d <= 21)) zodiac = "Sagittarius";
                else if ((m == 12 && d >= 22) || (m == 1 && d <= 19)) zodiac = "Capricorn";
                else if ((m == 1 && d >= 20) || (m == 2 && d <= 18)) zodiac = "Aquarius";
                else zodiac = "Pisces";

                // Next Bday
                const currentYear = now.getFullYear();
                const bdayThisYear = new Date(currentYear, dob.getMonth(), dob.getDate());
                let nextBday = bdayThisYear;
                if (now > bdayThisYear) nextBday = new Date(currentYear + 1, dob.getMonth(), dob.getDate());
                const daysToBday = Math.ceil((nextBday - now) / (1000 * 60 * 60 * 24));

                return { success: true, years, totalDays, zodiac, nextBirthday: daysToBday };
            },
            calculateBMI: (w, h, gender = 'male') => {
                const hM = h / 100;
                const bmi = w / (hM ** 2);
                const minIdeal = 18.5 * (hM ** 2);
                const maxIdeal = 24.9 * (hM ** 2);

                // Devine Formula for Ideal Weight
                // Men: 50 + 2.3 * (height_in_inches-60)
                // Women: 45.5 + 2.3 * (height_in_inches-60)
                const heightInInches = h / 2.54;
                let idealTarget = 0;
                if (gender === 'male') {
                    idealTarget = 50 + 2.3 * (heightInInches - 60);
                } else {
                    idealTarget = 45.5 + 2.3 * (heightInInches - 60);
                }

                // Fallback for very short stats or ensure positive
                if (idealTarget < 0) idealTarget = minIdeal + 5;

                let cat = 'Normal';
                if (bmi < 18.5) cat = 'Underweight';
                else if (bmi >= 25 && bmi < 29.9) cat = 'Overweight';
                else if (bmi >= 30) cat = 'Obese';

                return {
                    success: true,
                    bmi: bmi.toFixed(1),
                    category: cat,
                    idealWeightRange: `${minIdeal.toFixed(1)}-${maxIdeal.toFixed(1)} kg`,
                    idealWeightTarget: idealTarget.toFixed(1)
                };
            },
            calculateCalories: (w, h, age, gender, act) => {
                const bmr = 10 * w + 6.25 * h - 5 * age + (gender === 'male' ? 5 : -161);
                const tdee = Math.round(bmr * act);
                return {
                    success: true,
                    tdee,
                    bmr: Math.round(bmr),
                    weightLoss: tdee - 500,
                    weightGain: tdee + 500,
                    macros: {
                        protein: Math.round((tdee * 0.3) / 4), // 30%
                        carbs: Math.round((tdee * 0.35) / 4), // 35%
                        fat: Math.round((tdee * 0.35) / 9) // 35%
                    }
                };
            },
            calculateWaterIntake: (w) => {
                const ml = Math.round(w * 35);
                return {
                    success: true,
                    ml,
                    liters: (ml / 1000).toFixed(1),
                    glasses: Math.ceil(ml / 250)
                };
            },
            calculateBodyFat: (g, w, h, n, waist, hip) => {
                // US Navy Method approximation
                let bf = 0;
                if (g === 'male') {
                    // 495 / (1.0324-0.19077 * log10(waist-neck) + 0.15456 * log10(height))-450
                    // Simplified fallback for now
                    bf = 15;
                } else {
                    bf = 25;
                }
                return { success: true, bodyFat: bf + '%', category: 'Fit' };
            }
        },

        networkTools: {
            calculateSubnet: (cidr) => {
                try {
                    const [ipArr, maskStr] = cidr.split('/');
                    if (!ipArr || !maskStr) throw new Error("Invalid CIDR format");

                    const mask = parseInt(maskStr);
                    if (isNaN(mask) || mask < 0 || mask > 32) throw new Error("Invalid Mask");

                    const ipParts = ipArr.split('.').map(Number);
                    if (ipParts.length !== 4 || ipParts.some(n => isNaN(n) || n < 0 || n > 255)) throw new Error("Invalid IP");

                    const ipNum = (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];
                    const maskNum = mask === 0 ? 0 : (~0 << (32 - mask));

                    const netNum = ipNum & maskNum;
                    const broadNum = netNum | (~maskNum);

                    const toIP = (n) => [(n >>> 24) & 0xFF, (n >>> 16) & 0xFF, (n >>> 8) & 0xFF, n & 0xFF].join('.');

                    return {
                        success: true,
                        network: toIP(netNum),
                        broadcast: toIP(broadNum),
                        netmask: toIP(maskNum),
                        firstIP: toIP(netNum + 1),
                        lastIP: toIP(broadNum - 1),
                        total: Math.max(0, Math.pow(2, 32 - mask) - 2),
                        mask: mask
                    };
                } catch (e) {
                    return { success: false, message: e.message };
                }
            }
        },

        // --- MEDIA TOOLS ---

        imageCompressor: {
            compress: async function (file, quality, format, resize = null) {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        let width = img.width;
                        let height = img.height;

                        // Handle resize
                        if (resize) {
                            if (resize.width && resize.height) {
                                width = parseInt(resize.width);
                                height = parseInt(resize.height);
                            } else if (resize.width) {
                                width = parseInt(resize.width);
                                height = Math.round(img.height * (width / img.width));
                            } else if (resize.height) {
                                height = parseInt(resize.height);
                                width = Math.round(img.width * (height / img.height));
                            } else if (resize.scale) {
                                const s = parseFloat(resize.scale);
                                if (s > 0) {
                                    width = Math.round(width * s);
                                    height = Math.round(height * s);
                                }
                            }
                        }

                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, width, height);

                        const outFormat = format || file.type;
                        const q = quality / 100;

                        canvas.toBlob((blob) => {
                            if (!blob) return reject(new Error("Compression failed"));
                            const reader = new FileReader();
                            reader.onload = () => {
                                resolve({
                                    originalSize: file.size,
                                    compressedSize: blob.size,
                                    reduction: ((file.size - blob.size) / file.size * 100).toFixed(1),
                                    dataUrl: reader.result,
                                    blob: blob,
                                    width, height
                                });
                            };
                            reader.readAsDataURL(blob);
                        }, outFormat, q);
                    };
                    img.onerror = () => reject(new Error("Invalid image file"));
                    img.src = URL.createObjectURL(file);
                });
            }
        },

        asciiTools: {
            imageToAscii: (imageData, width, height, options = {}) => {
                const chars = options.inverted ? '@%#*+=-:. ' : ' .:-=+*#%@';
                let ascii = '';
                for (let i = 0; i < imageData.data.length; i += 4) {
                    const b = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
                    ascii += chars[Math.floor(b / 255 * (chars.length - 1))];
                    if ((i / 4 + 1) % width === 0) ascii += '\n';
                }
                return ascii;
            },
            textToAscii: (text) => ({ imageData: { data: [] }, width: 100, height: 100 })
        },

        colorExtractor: {
            extractPalette: (img) => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                // Downscale for performance
                const size = 64;
                canvas.width = size; canvas.height = size;
                ctx.drawImage(img, 0, 0, size, size);
                const data = ctx.getImageData(0, 0, size, size).data;

                const colorCounts = {};
                const quantization = 16; // Group similar colors

                for (let i = 0; i < data.length; i += 4) {
                    if (data[i + 3] < 128) continue; // Ignore transparent
                    const r = Math.round(data[i] / quantization) * quantization;
                    const g = Math.round(data[i + 1] / quantization) * quantization;
                    const b = Math.round(data[i + 2] / quantization) * quantization;
                    const key = `${r},${g},${b}`;
                    if (!colorCounts[key]) colorCounts[key] = { r, g, b, count: 0 };
                    colorCounts[key].count++;
                }

                // Sort by frequency
                const sortedColors = Object.values(colorCounts).sort((a, b) => b.count - a.count);

                // Select distinct dominant colors
                const palette = [];
                const minDiff = 40; // Minimum difference to be considered distinct

                for (const color of sortedColors) {
                    if (palette.length >= 20) break; // Max 20 colors

                    let isDistinct = true;
                    for (const existing of palette) {
                        const diff = Math.abs(color.r - existing.r) + Math.abs(color.g - existing.g) + Math.abs(color.b - existing.b);
                        if (diff < minDiff) {
                            isDistinct = false;
                            break;
                        }
                    }

                    if (isDistinct) {
                        const toHex = (n) => {
                            const hex = Math.max(0, Math.min(255, n)).toString(16);
                            return hex.length === 1 ? '0' + hex : hex;
                        };
                        color.hex = `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
                        palette.push(color);
                    }
                }

                return palette.length > 0 ? palette : [{ hex: '#000000', r: 0, g: 0, b: 0 }];
            },
            processImage: (img, options) => {
                return new Promise(resolve => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Set dimensions-Handle rotation (90/270 degrees swap w/h)
                    const rot = options.transform?.rotate || 0;
                    const isVertical = rot % 180 !== 0;
                    canvas.width = isVertical ? img.height : img.width;
                    canvas.height = isVertical ? img.width : img.height;

                    // Apply Filters
                    if (options.filters) {
                        const f = options.filters;
                        ctx.filter = `brightness(${f.brightness}%) contrast(${f.contrast}%) saturate(${f.saturate}%) grayscale(${f.grayscale}%) blur(${f.blur}px) sepia(${f.sepia}%)`;
                    }

                    // Apply Transformations
                    ctx.save();
                    ctx.translate(canvas.width / 2, canvas.height / 2);
                    ctx.rotate((rot * Math.PI) / 180);

                    let scaleH = options.transform ? options.transform.flipH : 1;
                    let scaleV = options.transform ? options.transform.flipV : 1;

                    // Fix Blur Edge Issue: Scale up slightly to push blurred/transparent edges out of view
                    if (options.filters && options.filters.blur > 0) {
                        const blur = Number(options.filters.blur);
                        const minDim = Math.min(img.width, img.height);
                        // Calculate scale needed to hide the blur fade-out (approx 3x blur radius)
                        const blurScale = 1 + ((blur * 3) / minDim);
                        scaleH *= blurScale;
                        scaleV *= blurScale;
                    }

                    ctx.scale(scaleH, scaleV);

                    // Draw centered
                    ctx.drawImage(img, -img.width / 2, -img.height / 2);
                    ctx.restore();

                    // Handle Target Width Resize if requested
                    let finalCanvas = canvas;
                    if (options.targetWidth && options.targetWidth < canvas.width) {
                        const ratio = options.targetWidth / canvas.width;
                        const tempCanvas = document.createElement('canvas');
                        tempCanvas.width = options.targetWidth;
                        tempCanvas.height = canvas.height * ratio;
                        const tCtx = tempCanvas.getContext('2d');
                        tCtx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);
                        finalCanvas = tempCanvas;
                    }

                    const fmt = options.format || 'image/png';
                    const q = (options.quality || 90) / 100;

                    const dataUrl = finalCanvas.toDataURL(fmt, q);
                    resolve({
                        url: dataUrl,
                        result: dataUrl, // For base64 copy
                        download: `processed_${Date.now()}.${fmt.split('/')[1]}`
                    });
                });
            }
        },

        bgRemoverTools: {
            removeBackground: function (canvas, options) {
                const ctx = canvas.getContext('2d');
                const width = canvas.width;
                const height = canvas.height;
                const { tolerance = 30, targetColor, contiguous = true, startX = 0, startY = 0 } = options;

                if (!targetColor) return canvas.toDataURL();

                const imgData = ctx.getImageData(0, 0, width, height);
                const data = imgData.data;
                const targetRGB = [targetColor.r, targetColor.g, targetColor.b];

                const isMatch = (r, g, b) => {
                    const diff = Math.abs(r - targetRGB[0]) + Math.abs(g - targetRGB[1]) + Math.abs(b - targetRGB[2]);
                    return diff <= tolerance * 3;
                };

                if (contiguous && typeof startX === 'number' && typeof startY === 'number') {
                    // Flood fill
                    const stack = [[startX, startY]];
                    const visited = new Uint8Array(width * height);

                    while (stack.length) {
                        const [x, y] = stack.pop();
                        const idx = y * width + x;
                        if (x < 0 || x >= width || y < 0 || y >= height || visited[idx]) continue;

                        visited[idx] = 1;
                        const pIdx = idx * 4;
                        const r = data[pIdx], g = data[pIdx + 1], b = data[pIdx + 2];

                        if (isMatch(r, g, b)) {
                            data[pIdx + 3] = 0; // Transparent
                            stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
                        }
                    }
                } else {
                    // Global
                    for (let i = 0; i < data.length; i += 4) {
                        if (isMatch(data[i], data[i + 1], data[i + 2])) data[i + 3] = 0;
                    }
                }
                ctx.putImageData(imgData, 0, 0);
                return canvas.toDataURL('image/png');
            }
        },

        svgTools: {
            optimize: (svg) => {
                if (!svg) return '';
                let res = svg;
                // Remove comments and XML headers
                res = res.replace(/<!--[\s\S]*?-->/g, '')
                    .replace(/<\?xml.*?>/g, '')
                    .replace(/<!DOCTYPE.*?>/g, '');

                // Remove empty groups
                res = res.replace(/<g>\s*<\/g>/g, '');

                // Optimize Path Data (Round decimals to 2 precision)
                res = res.replace(/\bd="([^"]+)"/g, (match, d) => {
                    return 'd="' + d.replace(/(\d+\.\d{3,})/g, n => Number(Number(n).toFixed(2)))
                        .replace(/\s+/g, ' ').trim() + '"';
                });

                // Minify whitespace
                return res.replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();
            }
        },

        pdfTools: {
            _checkLib: () => { if (typeof PDFLib === 'undefined') throw new Error("PDFLib not loaded"); },
            merge: async function (files) {
                this._checkLib();
                const doc = await PDFLib.PDFDocument.create();
                for (const f of files) {
                    const s = await PDFLib.PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption: true });
                    try {
                        const form = s.getForm();
                        if (form.getFields().length > 0) form.flatten();
                    } catch (e) { }
                    (await doc.copyPages(s, s.getPageIndices())).forEach(p => doc.addPage(p));
                }
                return new Blob([await doc.save()], { type: 'application/pdf' });
            },
            imagesToPdf: async function (files) {
                this._checkLib();
                const doc = await PDFLib.PDFDocument.create();
                for (const f of files) {
                    try {
                        const buffer = await f.arrayBuffer();
                        let img;
                        const isPng = f.type === 'image/png' || f.name.toLowerCase().endsWith('.png');
                        // Treat everything else as JPG try
                        if (isPng) {
                            img = await doc.embedPng(buffer);
                        } else {
                            img = await doc.embedJpg(buffer);
                        }

                        const page = doc.addPage([img.width, img.height]);
                        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
                    } catch (e) {
                        console.error("Image error:", f.name, e);
                        // Don't throw to allow partial success, but log it.
                        // Or if critical, throw. User says "fotoğraf eklenmiyor", so currently it fails silently.
                    }
                }
                if (doc.getPageCount() === 0) throw new Error("No valid images could be added to PDF");
                return new Blob([await doc.save()], { type: 'application/pdf' });
            },
            rotate: async function (file, angle) {
                this._checkLib();
                const doc = await PDFLib.PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
                doc.getPages().forEach(p => p.setRotation(PDFLib.degrees(p.getRotation().angle + angle)));
                return new Blob([await doc.save()], { type: 'application/pdf' });
            },
            extract: async function (file, rangeStr) {
                this._checkLib();
                const src = await PDFLib.PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });

                try {
                    const form = src.getForm();
                    if (form.getFields().length > 0) form.flatten();
                } catch (e) { }

                const doc = await PDFLib.PDFDocument.create();

                const total = src.getPageCount();
                const indices = new Set();
                rangeStr.split(',').forEach(p => {
                    const part = p.trim();
                    if (!part) return;
                    if (part.includes('-')) {
                        const [start, end] = part.split('-').map(n => parseInt(n));
                        if (!isNaN(start) && !isNaN(end)) {
                            for (let i = start; i <= end; i++) indices.add(i - 1);
                        }
                    } else {
                        const val = parseInt(part);
                        if (!isNaN(val)) indices.add(val - 1);
                    }
                });

                const validIndices = Array.from(indices).filter(i => i >= 0 && i < total).sort((a, b) => a - b);
                if (validIndices.length === 0) throw new Error("No valid pages selected");

                (await doc.copyPages(src, validIndices)).forEach(p => doc.addPage(p));
                return new Blob([await doc.save()], { type: 'application/pdf' });
            }
        },

        ocrTools: {
            recognize: async (file, lang, onProgress) => {
                if (typeof Tesseract === 'undefined') throw new Error("Tesseract not loaded");

                // Initialize worker with language directly (v5 syntax)
                // Note: Logger removed temporarily to fix "Function object could not be cloned" DOMException
                const worker = await Tesseract.createWorker(lang);

                try {
                    // Update progress manually if possible, or skip
                    if (onProgress) onProgress(0.5, "Processing...");

                    const { data: { text } } = await worker.recognize(file);

                    if (onProgress) onProgress(1, "Completed");
                    await worker.terminate();
                    return text;
                } catch (e) {
                    await worker.terminate();
                    throw e;
                }
            }
        },

        asciiTools: {
            imageToAscii: (imageData, cols, rows, options) => {
                const { data } = imageData;
                const { contrast, inverted, color } = options;
                let output = '';
                // ' .:-=+*#%@' 
                const chars = inverted ? '@%#*+=-:. ' : ' .:-=+*#%@';

                for (let y = 0; y < rows; y++) {
                    let line = '';
                    for (let x = 0; x < cols; x++) {
                        const offset = (y * cols + x) * 4;
                        const r = data[offset];
                        const g = data[offset + 1];
                        const b = data[offset + 2];

                        let brightness = (0.299 * r + 0.587 * g + 0.114 * b);

                        // Contrast calculation
                        brightness = ((brightness - 128) * contrast) + 128;
                        if (brightness < 0) brightness = 0;
                        if (brightness > 255) brightness = 255;

                        const charIndex = Math.floor((brightness / 255) * (chars.length - 1));
                        const char = chars[charIndex] || chars[chars.length - 1];

                        if (color) {
                            line += `<span style="color: rgb(${r},${g},${b})">${char}</span>`;
                        } else {
                            line += char;
                        }
                    }
                    output += line + '\n';
                }
                return output;
            },
            textToAscii: (text) => {
                const c = document.createElement('canvas');
                const ctx = c.getContext('2d');
                const fontSize = 60;
                ctx.font = `bold ${fontSize}px sans-serif`;
                const metrics = ctx.measureText(text);
                const w = Math.ceil(metrics.width) + 20;
                const h = fontSize + 30;

                c.width = w;
                c.height = h;

                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, w, h);
                ctx.fillStyle = 'black';
                ctx.font = `bold ${fontSize}px sans-serif`;
                ctx.textBaseline = 'middle';
                ctx.fillText(text, 10, h / 2);

                return {
                    imageData: ctx.getImageData(0, 0, w, h),
                    width: w,
                    height: h
                };
            }
        },

        audioTools: {
            drawWaveform: (buffer, canvas, options = {}) => {
                const ctx = canvas.getContext('2d');
                const width = canvas.width;
                const height = canvas.height;
                const data = buffer.getChannelData(0); // Left channel
                const step = Math.ceil(data.length / width);
                const amp = height / 2;

                const color = options.color || '#6366f1';
                const bgColor = options.bgColor || '#0f172a';
                const barWidth = options.barWidth || 2;
                const barGap = options.barGap || 1;
                const style = options.style || 'bars';

                // Clear
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, width, height);
                ctx.fillStyle = color;
                ctx.strokeStyle = color;

                if (style === 'lines') {
                    ctx.beginPath();
                    ctx.lineWidth = 2;
                    ctx.moveTo(0, amp);
                    for (let i = 0; i < width; i++) {
                        let min = 1.0; let max = -1.0;
                        for (let j = 0; j < step; j++) {
                            const datum = data[(i * step) + j]; // Simple sampling
                            if (datum < min) min = datum;
                            if (datum > max) max = datum;
                        }
                        ctx.lineTo(i, (1 + min) * amp);
                        ctx.lineTo(i, (1 + max) * amp);
                    }
                    ctx.stroke();
                } else {
                    // Bars default
                    const totalBars = Math.floor(width / (barWidth + barGap));
                    const stepBar = Math.floor(data.length / totalBars);
                    for (let i = 0; i < totalBars; i++) {
                        let vol = 0;
                        for (let j = 0; j < stepBar; j++) {
                            vol += Math.abs(data[(i * stepBar) + j]);
                        }
                        const avg = vol / stepBar;
                        const barH = Math.max(2, avg * height * 3); // Scale up
                        ctx.fillRect(i * (barWidth + barGap), (height - barH) / 2, barWidth, barH);
                    }
                }
            },
            drawSpectrogram: function (analyser, canvas, color) {
                const ctx = canvas.getContext('2d');
                const w = canvas.width;
                const h = canvas.height;
                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);

                // Stop prev animation if any
                if (window.DevTools._audioAnim) cancelAnimationFrame(window.DevTools._audioAnim);

                const draw = () => {
                    window.DevTools._audioAnim = requestAnimationFrame(draw);
                    analyser.getByteFrequencyData(dataArray);
                    ctx.fillStyle = '#000000'; // Black BG for spectrogram
                    ctx.fillRect(0, 0, w, h);

                    const barWidth = (w / bufferLength) * 2.5;
                    let barHeight;
                    let x = 0;

                    for (let i = 0; i < bufferLength; i++) {
                        barHeight = dataArray[i]; // 0-255
                        // Color based on intensity
                        const r = barHeight + (25 * (i / bufferLength));
                        const g = 250 * (i / bufferLength);
                        const b = 50;

                        ctx.fillStyle = `rgb(${r},${g},${b})`;
                        // Or use single color if provided but spectrograms are usually colorful
                        if (color && color !== '#6366f1') ctx.fillStyle = color;

                        ctx.fillRect(x, h - barHeight * 1.5, barWidth, barHeight * 1.5);
                        x += barWidth + 1;
                    }
                };
                draw();
            }
        },

        videoTools: { extractYoutubeId: (url) => url.includes('v=') ? url.split('v=')[1] : null, getThumbnails: () => [] },
        ultraVideoTools: { getFitRect: (cw, ch, vw, vh, mode) => ({ x: 0, y: 0, w: cw, h: ch }) },
        steganographyTools: {
            encode: async function (file, message) {
                return new Promise((resolve, reject) => {
                    if (!message) return reject(new Error("No message provided"));
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const img = new Image();
                        img.onload = () => {
                            const canvas = document.createElement('canvas');
                            const ctx = canvas.getContext('2d');
                            canvas.width = img.width;
                            canvas.height = img.height;
                            ctx.drawImage(img, 0, 0);

                            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                            const data = imgData.data;

                            const encoder = new TextEncoder();
                            const msgBytes = encoder.encode(message);

                            const bits = [];
                            for (let i = 0; i < msgBytes.length; i++) {
                                const b = msgBytes[i];
                                for (let j = 7; j >= 0; j--) bits.push((b >> j) & 1);
                            }
                            // Delimiter: 3 null bytes (24 zeros)
                            for (let i = 0; i < 24; i++) bits.push(0);

                            if (bits.length > (data.length / 4) * 3) {
                                return reject(new Error("Message too long for this image."));
                            }

                            let bitIdx = 0;
                            // Iterate pixels
                            for (let i = 0; i < data.length; i += 4) {
                                if (bitIdx >= bits.length) break;
                                // RGB channels
                                for (let j = 0; j < 3; j++) {
                                    if (bitIdx >= bits.length) break;
                                    let val = data[i + j];
                                    if (bits[bitIdx] === 1) val = val | 1;
                                    else val = val & ~1;
                                    data[i + j] = val;
                                    bitIdx++;
                                }
                            }

                            ctx.putImageData(imgData, 0, 0);
                            resolve(canvas.toDataURL('image/png'));
                        };
                        img.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                });
            },
            decode: async function (file) {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const img = new Image();
                        img.onload = () => {
                            const canvas = document.createElement('canvas');
                            const ctx = canvas.getContext('2d');
                            canvas.width = img.width;
                            canvas.height = img.height;
                            ctx.drawImage(img, 0, 0);

                            const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                            const bits = [];
                            // Extract ALL bits (potentially slow for huge images, but we scan until delimiter)
                            // Limit scan to avoid freezing browser? 
                            // Let's scan reasonably.
                            const maxBits = data.length * 3;

                            let nullCount = 0;
                            let found = false;
                            let extractedBytes = [];
                            let currentByte = 0;
                            let bitCount = 0;

                            for (let i = 0; i < data.length; i += 4) {
                                for (let j = 0; j < 3; j++) {
                                    const bit = data[i + j] & 1;
                                    currentByte = (currentByte << 1) | bit;
                                    bitCount++;

                                    if (bitCount === 8) {
                                        extractedBytes.push(currentByte);
                                        if (currentByte === 0) {
                                            nullCount++;
                                            if (nullCount >= 3) {
                                                found = true;
                                            }
                                        } else {
                                            nullCount = 0;
                                        }
                                        currentByte = 0;
                                        bitCount = 0;
                                    }
                                    if (found) break;
                                }
                                if (found) break;
                            }

                            if (!found) { resolve(null); return; }

                            const validBytes = extractedBytes.slice(0, extractedBytes.length - 3); // Remove delimiter
                            try {
                                const decoder = new TextDecoder();
                                const str = decoder.decode(new Uint8Array(validBytes));
                                resolve(str);
                            } catch (e) { resolve(null); }
                        };
                        img.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                });
            }
        },

        // --- WEB TOOLS ---

        linkShortener: {
            shorten: async (url) => ({ success: true, shortUrl: 'http://short.url/' + Math.random().toString(36).substr(2, 5) }),
            getAllLinks: () => [], deleteLink: () => { }
        },

        scraperTools: {
            fetch: async (url) => {
                if (!url) throw new Error("URL is required");
                if (!url.startsWith('http')) url = 'https://' + url;

                // Helper for timeout
                const fetchWithTimeout = (resource, options = {}) => {
                    const { timeout = 20000 } = options;
                    const controller = new AbortController();
                    const id = setTimeout(() => controller.abort(), timeout);
                    return fetch(resource, { ...options, signal: controller.signal })
                        .then(response => { clearTimeout(id); return response; })
                        .catch(err => { clearTimeout(id); throw err; });
                };

                // Strategy 1: CORSProxy.io (Fast & Reliable)
                try {
                    const response = await fetchWithTimeout(`https://corsproxy.io/?${encodeURIComponent(url)}`);
                    if (response.ok) return await response.text();
                } catch (e) { console.warn("Proxy 1 failed, trying fallback..."); }

                // Strategy 2: AllOrigins (Raw Mode)
                try {
                    const response = await fetchWithTimeout(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
                    if (response.ok) return await response.text();
                } catch (e) { console.warn("Proxy 2 failed."); }

                // Strategy 3: AllOrigins (JSON Mode-Fallback)
                try {
                    const response = await fetchWithTimeout(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
                    if (response.ok) {
                        const data = await response.json();
                        return data.contents;
                    }
                } catch (e) { }

                throw new Error("Unable to access site. It may be blocking proxies or offline.");
            },
            analyze: (html) => {
                if (!html) return { links: [], images: [], headings: { h1: [], h2: [] }, meta: [] };
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                // Links
                const links = Array.from(doc.querySelectorAll('a')).map(a => ({
                    href: a.href,
                    text: (a.innerText || "").trim().substring(0, 100)
                })).filter(l => l.href && (l.href.startsWith('http') || l.href.startsWith('//')));

                // Images
                const images = Array.from(doc.querySelectorAll('img')).map(img => ({
                    src: img.src,
                    alt: img.alt || ""
                })).filter(i => i.src);

                // Headings
                const headings = {
                    h1: Array.from(doc.querySelectorAll('h1')).map(h => (h.innerText || "").trim()).filter(Boolean),
                    h2: Array.from(doc.querySelectorAll('h2')).map(h => (h.innerText || "").trim()).filter(Boolean)
                };

                // Meta
                const meta = Array.from(doc.querySelectorAll('meta')).map(m => ({
                    name: m.getAttribute('name') || m.getAttribute('property') || "",
                    content: m.getAttribute('content') || ""
                })).filter(m => m.name && m.content);

                return { links, images, headings, meta };
            }
        },

        ipLookup: {
            getCurrentIP: async function () {
                try {
                    const response = await fetch('https://ipapi.co/json/');
                    if (!response.ok) throw new Error('Network response was not ok');
                    const data = await response.json();
                    return { success: true, ip: data.ip, data: data };
                } catch (e) {
                    console.error('IP Lookup Error:', e);
                    // Fallback to another service if needed, or return error
                    return { success: false, message: 'Could not fetch IP data. Adblocker might be blocking the request.' };
                }
            },
            getIPInfo: async function (ip) {
                try {
                    const response = await fetch(`https://ipapi.co/${ip}/json/`);
                    if (!response.ok) throw new Error('Network response was not ok');
                    const data = await response.json();
                    if (data.error) return { success: false, message: data.reason || 'IP not found' };
                    return { success: true, data: data };
                } catch (e) {
                    return { success: false, message: 'Lookup failed. ' + e.message };
                }
            },
            searchIP: async function (ip) {
                return this.getIPInfo(ip);
            },
            validateIP: function (ip) {
                const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
                const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
                if (ipv4Regex.test(ip)) {
                    return ip.split('.').every(part => parseInt(part) <= 255);
                }
                return ipv6Regex.test(ip);
            },
            getMapEmbed: (lat, lon) => {
                // Using OpenStreetMap Embed which is free and requires no API key
                // Bounding box calculation for zoom level
                const delta = 0.05;
                const bbox = `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`;
                return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
            }
        },

        p2pTools: {
            peer: null,
            init: function (onOpen, onConn, onError) {
                if (typeof Peer === 'undefined') throw new Error("PeerJS not loaded");
                if (this.peer && !this.peer.disconnected) return this.peer;
                this.peer = new Peer(null, { debug: 1 });
                this.peer.on('open', onOpen); this.peer.on('connection', onConn); this.peer.on('error', onError);
                return this.peer;
            },
            connect: function (id) { return this.peer.connect(id); }
        },

        urlTool: {
            encode: (t) => ({ success: true, result: encodeURIComponent(t) }),
            decode: (t) => ({ success: true, result: decodeURIComponent(t) }),
            encodeURL: (t) => ({ success: true, result: encodeURI(t) }),
            decodeURL: (t) => ({ success: true, result: decodeURI(t) }),
            parseURL: (u) => {
                try {
                    let urlStr = u.trim();
                    if (!urlStr.match(/^[a-zA-Z]+:\/\//)) {
                        urlStr = 'http://' + urlStr;
                    }
                    const url = new URL(urlStr);
                    const params = {};
                    url.searchParams.forEach((v, k) => params[k] = v);
                    return {
                        success: true,
                        data: {
                            protocol: url.protocol,
                            hostname: url.hostname,
                            pathname: url.pathname,
                            search: url.search,
                            params: params
                        }
                    };
                } catch (e) { return { success: false, message: "Invalid URL" }; }
            },
            parseQueryString: (q) => {
                try {
                    const params = {};
                    const searchParams = new URLSearchParams(q);
                    searchParams.forEach((v, k) => params[k] = v);
                    return { success: true, data: { params } };
                } catch (e) { return { success: false, message: "Invalid Query" }; }
            }
        },

        jwtTools: {
            decode: (t) => {
                try {
                    const parts = t.split('.');
                    if (parts.length < 2) throw new Error("Invalid format");

                    const base64UrlDecode = (str) => {
                        let output = str.replace(/-/g, '+').replace(/_/g, '/');
                        switch (output.length % 4) {
                            case 0: break;
                            case 2: output += '=='; break;
                            case 3: output += '='; break;
                            default: throw new Error("Illegal base64url string!");
                        }
                        return decodeURIComponent(escape(window.atob(output)));
                    };

                    const header = JSON.parse(base64UrlDecode(parts[0]));
                    const payload = JSON.parse(base64UrlDecode(parts[1]));

                    const now = Math.floor(Date.now() / 1000);
                    const isExpired = payload.exp ? payload.exp < now : false;

                    return { success: true, header, payload, isExpired };
                } catch (e) {
                    return { success: false, message: "Invalid JWT format" };
                }
            },
            getSampleTokens: () => ({
                valid: { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' },
                expired: { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyNDAwMjJ9.XbPqh0hQ6Y1e7K3kL6e8M' }
            })
        },

        // --- MISC ---

        cardTools: {
            generateLuhn: (prefix, len) => {
                // Generate random digits for remaining positions (except last digit for checksum)
                let number = prefix;
                const digitsNeeded = len - prefix.length - 1; // -1 for Luhn checksum digit

                for (let i = 0; i < digitsNeeded; i++) {
                    number += Math.floor(Math.random() * 10);
                }

                // Calculate Luhn checksum
                let sum = 0;
                let isEven = true;

                // Process digits from right to left (before adding checksum)
                for (let i = number.length - 1; i >= 0; i--) {
                    let digit = parseInt(number[i]);

                    if (isEven) {
                        digit *= 2;
                        if (digit > 9) digit -= 9;
                    }

                    sum += digit;
                    isEven = !isEven;
                }

                // Calculate check digit
                const checkDigit = (10 - (sum % 10)) % 10;

                return number + checkDigit;
            },
            format: (n) => {
                // Format card number with spaces (4-4-4-4 or 4-6-5 for Amex)
                if (n.length === 15) {
                    // Amex format: 4-6-5
                    return n.slice(0, 4) + ' ' + n.slice(4, 10) + ' ' + n.slice(10);
                } else {
                    // Standard format: 4-4-4-4
                    return n.match(/.{1,4}/g).join(' ');
                }
            }
        },
        pianoTools: {
            getNotes: () => [
                // C4 Octave
                { note: 'C', freq: 261.63, key: 'A', black: false },
                { note: 'C#', freq: 277.18, key: 'W', black: true },
                { note: 'D', freq: 293.66, key: 'S', black: false },
                { note: 'D#', freq: 311.13, key: 'E', black: true },
                { note: 'E', freq: 329.63, key: 'D', black: false },
                { note: 'F', freq: 349.23, key: 'F', black: false },
                { note: 'F#', freq: 369.99, key: 'T', black: true },
                { note: 'G', freq: 392.00, key: 'G', black: false },
                { note: 'G#', freq: 415.30, key: 'Y', black: true },
                { note: 'A', freq: 440.00, key: 'H', black: false },
                { note: 'A#', freq: 466.16, key: 'U', black: true },
                { note: 'B', freq: 493.88, key: 'J', black: false },
                // C5 Octave
                { note: 'C5', freq: 523.25, key: 'K', black: false },
                { note: 'C#5', freq: 554.37, key: 'O', black: true },
                { note: 'D5', freq: 587.33, key: 'L', black: false },
                { note: 'D#5', freq: 622.25, key: 'P', black: true },
                { note: 'E5', freq: 659.25, key: ';', black: false }
            ]
        },
        metadataTools: {
            read: async function (file) {
                if (typeof ExifReader === 'undefined') throw new Error("ExifReader library not loaded");

                const tags = await ExifReader.load(file, { expanded: true });
                // ExifReader 'expanded' mode gives nice groups: 'exif', 'gps', 'file', etc.

                const flat = {};
                const groups = { exif: {}, gps: {} };
                let gps = null;

                // Populate flat list for display
                // Combine all groups
                Object.keys(tags).forEach(groupName => {
                    if (tags[groupName]) {
                        Object.entries(tags[groupName]).forEach(([k, v]) => {
                            // v is { description: ..., value: ... } or just value in expanded mode? 
                            // In expanded mode: tags.exif['Artist'] is { description: "Name", value: ... }
                            let desc = v.description;
                            if (Array.isArray(desc)) desc = desc.join(', ');

                            const key = `${groupName}:${k}`;
                            flat[key] = desc;

                            // Populate groups for UI mapping
                            if (groupName === 'exif') groups.exif[k] = v;
                            if (groupName === 'gps') groups.gps[k] = v;
                        });
                    }
                });

                // GPS Helper
                if (tags.gps && tags.gps.Latitude && tags.gps.Longitude) {
                    gps = {
                        lat: tags.gps.Latitude,
                        lng: tags.gps.Longitude
                    };
                }

                return { flat, groups, gps };
            },
            strip: async function (file) {
                if (typeof piexif === 'undefined') throw new Error("PiExifJS library not loaded");
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = e => {
                        try {
                            // Passing null as exif data strips it
                            const clean = piexif.remove(e.target.result);
                            resolve(clean);
                        } catch (err) { resolve(e.target.result); } // If fails (e.g. PNG), return original
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            },
            update: async function (dataUrl, edits) {
                if (typeof piexif === 'undefined') throw new Error("PiExifJS library not loaded");

                // Load existing
                let exifObj;
                try {
                    exifObj = piexif.load(dataUrl);
                } catch (e) { exifObj = { "0th": {}, "Exif": {}, "GPS": {}, "1st": {}, "thumbnail": null }; }

                // Helper
                const set0th = (tag, val) => { if (!exifObj["0th"]) exifObj["0th"] = {}; exifObj["0th"][tag] = val; };
                const setExif = (tag, val) => { if (!exifObj["Exif"]) exifObj["Exif"] = {}; exifObj["Exif"][tag] = val; };

                // 271 Make, 272 Model, 315 Artist (0th IFD)
                if (edits.make) set0th(271, edits.make);
                if (edits.model) set0th(272, edits.model);
                if (edits.artist) set0th(315, edits.artist);

                // DateTime: 306 (0th) format "YYYY:MM:DD HH:MM:SS"
                if (edits.date) {
                    // edits.date is from datetime-local input (YYYY-MM-DDTHH:MM)
                    let d = edits.date.replace('T', ' ').replace(/-/g, ':');
                    if (d.length === 16) d += ':00'; // add seconds
                    set0th(306, d);
                }

                // GPS update is skipped for safety reasons in this basic version

                const bytes = piexif.dump(exifObj);
                return piexif.insert(bytes, dataUrl);
            }
        },
        diffTools: {
            compare: (text1, text2) => {
                const lines1 = text1.split('\n');
                const lines2 = text2.split('\n');
                const diffs = [];
                let i = 0, j = 0;

                // Very basic LCS-like approximation for 2-way diff
                while (i < lines1.length || j < lines2.length) {
                    if (i < lines1.length && j < lines2.length && lines1[i] === lines2[j]) {
                        diffs.push({ value: lines1[i], count: 1 });
                        i++; j++;
                    } else if (j < lines2.length && (i >= lines1.length || !lines1.includes(lines2[j]))) {
                        // Added in new
                        diffs.push({ value: lines2[j], added: true, count: 1 });
                        j++;
                    } else if (i < lines1.length) {
                        // Removed from old
                        diffs.push({ value: lines1[i], removed: true, count: 1 });
                        i++;
                    }
                }
                return diffs;
            }
        },

        promptTools: {
            enhance: (subject, platform = 'midjourney') => {
                if (!subject) return subject;

                // Intelligent enhancement based on platform
                const enhancements = {
                    midjourney: [
                        'highly detailed',
                        'professional photography',
                        'cinematic lighting',
                        'award winning',
                        '8k uhd',
                        'sharp focus'
                    ],
                    dalle: [
                        'professional grade',
                        'high quality',
                        'detailed',
                        'well composed'
                    ],
                    stable: [
                        'masterpiece',
                        'best quality',
                        'ultra detailed',
                        'intricate details',
                        'photorealistic',
                        '8k resolution'
                    ],
                    chatgpt: [
                        'Please provide a comprehensive and detailed response.',
                        'Use clear examples and explanations.',
                        'Structure your answer logically.'
                    ],
                    claude: [
                        'Think step by step and provide detailed reasoning.',
                        'Be thorough and precise in your explanation.',
                        'Consider multiple perspectives.'
                    ],
                    gemini: [
                        'Provide a detailed and well-structured response.',
                        'Use concrete examples to illustrate your points.',
                        'Ensure accuracy and clarity.'
                    ]
                };

                const boosts = enhancements[platform] || enhancements.midjourney;

                // For text AI, add instructions
                if (['chatgpt', 'claude', 'gemini'].includes(platform)) {
                    return `${subject}\n\n${boosts.join(' ')}`;
                }

                // For image AI, add quality modifiers
                const qualityBoosts = boosts.slice(0, 3).join(', ');
                return `${subject}, ${qualityBoosts}`;
            }
        },

        // --- MARKDOWN TOOLS ---
        markdownTools: {
            parseMarkdown: (text) => {
                if (!text) return '';
                let html = text
                    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') // Escape HTML
                    .replace(/^# (.*$)/gim, '<h1>$1</h1>') // H1
                    .replace(/^## (.*$)/gim, '<h2>$1</h2>') // H2
                    .replace(/^### (.*$)/gim, '<h3>$1</h3>') // H3
                    .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>') // Blockquote
                    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>') // Bold
                    .replace(/\*(.*)\*/gim, '<em>$1</em>') // Italic
                    .replace(/!\[(.*?)\]\((.*?)\)/gim, '<img alt="$1" src="$2" />') // Image
                    .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank">$1</a>') // Link
                    .replace(/`(.*?)`/gim, '<code>$1</code>') // Inline Code
                    .replace(/^\s*-\s+(.*$)/gim, '<li>$1</li>') // List Item
                    .replace(/(\n|^)(?!\s*<li>)(.*)/gim, function (match, p1, p2) {
                        // Paragraphs: Wrap lines that aren't empty, headers, blockquotes, or list items in <p>
                        if (p2.match(/<\/?(h|li|ul|ol|blockquote)/)) return match;
                        return p2.trim() ? `${p1}<p>${p2}</p>` : match;
                    });

                // Wrap adjacent li in ul (basic)
                html = html.replace(/(<li>.*<\/li>\s*)+/gim, '<ul>$&</ul>');

                // Code block (triple backtick)
                html = html.replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>');

                return html;
            },
            exportHTML: (text) => {
                const body = window.DevTools.markdownTools.parseMarkdown(text);
                return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{font-family:system-ui,sans-serif;line-height:1.6;max-width:800px;margin:2rem auto;padding:0 1rem;color:#333;}pre{background:#f4f4f4;padding:1rem;overflow-x:auto;border-radius:4px;}blockquote{border-left:4px solid #ddd;padding-left:1rem;color:#666;margin:1rem 0;}img{max-width:100%;}</style></head><body>${body}</body></html>`;
            }
        },

        jsonTools: {
            generateTypes: (jsonStr, rootName = 'RootObject', lang = 'ts') => {
                try {
                    const obj = JSON.parse(jsonStr);

                    if (lang === 'ts') {
                        const interfaces = [];
                        const seenNames = new Set();

                        const generate = (name, o) => {
                            if (seenNames.has(name)) return name; // Avoid duplicates/cycles
                            seenNames.add(name);

                            let props = '';

                            // Handle Array Root
                            if (Array.isArray(o)) {
                                if (o.length > 0 && typeof o[0] === 'object') {
                                    const childType = generate(name.endsWith('s') ? name.slice(0, -1) : name + 'Item', o[0]);
                                    return `${childType}[]`;
                                }
                                return 'any[]';
                            }

                            for (const [k, v] of Object.entries(o)) {
                                const propName = k;
                                let type = typeof v;

                                if (v === null) type = 'any';
                                else if (Array.isArray(v)) {
                                    if (v.length > 0) {
                                        const first = v[0];
                                        if (typeof first === 'object' && first !== null) {
                                            const childTypeName = name + '_' + k.charAt(0).toUpperCase() + k.slice(1);
                                            generate(childTypeName, first);
                                            type = `${childTypeName}[]`;
                                        } else {
                                            type = `${typeof first}[]`;
                                        }
                                    } else {
                                        type = 'any[]';
                                    }
                                } else if (type === 'object') {
                                    const childTypeName = name + '_' + k.charAt(0).toUpperCase() + k.slice(1);
                                    generate(childTypeName, v);
                                    type = childTypeName;
                                }
                                props += `  ${propName}: ${type};\n`;
                            }

                            interfaces.push(`interface ${name} {\n${props}}`);
                            return name;
                        };

                        if (Array.isArray(obj)) {
                            const rootType = generate(rootName.endsWith('s') ? rootName.slice(0, -1) : rootName + 'Item', obj[0]);
                            return `type ${rootName} = ${rootType}[];\n\n` + interfaces.reverse().join('\n\n');
                        } else {
                            generate(rootName, obj);
                            return interfaces.reverse().join('\n\n');
                        }
                    } else if (lang === 'go') {
                        const structs = [];
                        const seenNames = new Set();

                        const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);
                        const toPascalCase = s => s.split('_').map(capitalize).join('');

                        const generate = (name, o) => {
                            if (seenNames.has(name)) return name;
                            seenNames.add(name);

                            let props = '';

                            // Handle Array Root
                            if (Array.isArray(o)) {
                                if (o.length > 0) {
                                    const first = o[0];
                                    if (typeof first === 'object' && first !== null) {
                                        const childType = generate(name.endsWith('s') ? name.slice(0, -1) : name + 'Item', first);
                                        return `[]${childType}`;
                                    }
                                    const primitiveType = typeof first === 'string' ? 'string' : typeof first === 'number' ? (Number.isInteger(first) ? 'int' : 'float64') : typeof first === 'boolean' ? 'bool' : 'interface{}';
                                    return `[]${primitiveType}`;
                                }
                                return '[]interface{}';
                            }

                            for (const [k, v] of Object.entries(o)) {
                                const fieldName = toPascalCase(k);
                                let goType = 'interface{}';

                                if (v === null) {
                                    goType = 'interface{}';
                                } else if (Array.isArray(v)) {
                                    if (v.length > 0) {
                                        const first = v[0];
                                        if (typeof first === 'object' && first !== null) {
                                            const childTypeName = name + fieldName;
                                            goType = '[]' + generate(childTypeName, first);
                                        } else {
                                            const primitiveType = typeof first === 'string' ? 'string' : typeof first === 'number' ? (Number.isInteger(first) ? 'int' : 'float64') : typeof first === 'boolean' ? 'bool' : 'interface{}';
                                            goType = `[]${primitiveType}`;
                                        }
                                    } else {
                                        goType = '[]interface{}';
                                    }
                                } else if (typeof v === 'object') {
                                    const childTypeName = name + fieldName;
                                    generate(childTypeName, v);
                                    goType = childTypeName;
                                } else if (typeof v === 'string') {
                                    goType = 'string';
                                } else if (typeof v === 'number') {
                                    goType = Number.isInteger(v) ? 'int' : 'float64';
                                } else if (typeof v === 'boolean') {
                                    goType = 'bool';
                                }

                                props += `    ${fieldName} ${goType} \`json:"${k}"\`\n`;
                            }

                            structs.push(`type ${name} struct {\n${props}}`);
                            return name;
                        };

                        if (Array.isArray(obj)) {
                            const itemType = generate(rootName.endsWith('s') ? rootName.slice(0, -1) : rootName + 'Item', obj[0]);
                            return `type ${rootName} []${itemType}\n\n` + structs.reverse().join('\n\n');
                        } else {
                            generate(rootName, obj);
                            return structs.reverse().join('\n\n');
                        }
                    } else if (lang === 'csharp') {
                        const classes = [];
                        const seenNames = new Set();

                        const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);
                        const toPascalCase = s => s.split('_').map(capitalize).join('');

                        const generate = (name, o) => {
                            if (seenNames.has(name)) return name;
                            seenNames.add(name);

                            let props = '';

                            // Handle Array Root
                            if (Array.isArray(o)) {
                                if (o.length > 0) {
                                    const first = o[0];
                                    if (typeof first === 'object' && first !== null) {
                                        const childType = generate(name.endsWith('s') ? name.slice(0, -1) : name + 'Item', first);
                                        return `List<${childType}>`;
                                    }
                                    const primitiveType = typeof first === 'string' ? 'string' : typeof first === 'number' ? (Number.isInteger(first) ? 'int' : 'double') : typeof first === 'boolean' ? 'bool' : 'object';
                                    return `List<${primitiveType}>`;
                                }
                                return 'List<object>';
                            }

                            for (const [k, v] of Object.entries(o)) {
                                const propName = toPascalCase(k);
                                let csType = 'object';

                                if (v === null) {
                                    csType = 'object';
                                } else if (Array.isArray(v)) {
                                    if (v.length > 0) {
                                        const first = v[0];
                                        if (typeof first === 'object' && first !== null) {
                                            const childTypeName = name + propName;
                                            csType = 'List<' + generate(childTypeName, first) + '>';
                                        } else {
                                            const primitiveType = typeof first === 'string' ? 'string' : typeof first === 'number' ? (Number.isInteger(first) ? 'int' : 'double') : typeof first === 'boolean' ? 'bool' : 'object';
                                            csType = `List<${primitiveType}>`;
                                        }
                                    } else {
                                        csType = 'List<object>';
                                    }
                                } else if (typeof v === 'object') {
                                    const childTypeName = name + propName;
                                    generate(childTypeName, v);
                                    csType = childTypeName;
                                } else if (typeof v === 'string') {
                                    csType = 'string';
                                } else if (typeof v === 'number') {
                                    csType = Number.isInteger(v) ? 'int' : 'double';
                                } else if (typeof v === 'boolean') {
                                    csType = 'bool';
                                }

                                props += `    public ${csType} ${propName} { get; set; }\n`;
                            }

                            classes.push(`public class ${name}\n{\n${props}}`);
                            return name;
                        };

                        if (Array.isArray(obj)) {
                            const itemType = generate(rootName.endsWith('s') ? rootName.slice(0, -1) : rootName + 'Item', obj[0]);
                            return `public class ${rootName} : List<${itemType}> { }\n\n` + classes.reverse().join('\n\n');
                        } else {
                            generate(rootName, obj);
                            return classes.reverse().join('\n\n');
                        }
                    } else if (lang === 'java') {
                        const classes = [];
                        const seenNames = new Set();

                        const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);
                        const toCamelCase = s => {
                            const parts = s.split('_');
                            return parts[0] + parts.slice(1).map(capitalize).join('');
                        };
                        const toPascalCase = s => s.split('_').map(capitalize).join('');

                        const generate = (name, o) => {
                            if (seenNames.has(name)) return name;
                            seenNames.add(name);

                            let props = '';

                            // Handle Array Root
                            if (Array.isArray(o)) {
                                if (o.length > 0) {
                                    const first = o[0];
                                    if (typeof first === 'object' && first !== null) {
                                        const childType = generate(name.endsWith('s') ? name.slice(0, -1) : name + 'Item', first);
                                        return `List<${childType}>`;
                                    }
                                    const primitiveType = typeof first === 'string' ? 'String' : typeof first === 'number' ? (Number.isInteger(first) ? 'Integer' : 'Double') : typeof first === 'boolean' ? 'Boolean' : 'Object';
                                    return `List<${primitiveType}>`;
                                }
                                return 'List<Object>';
                            }

                            for (const [k, v] of Object.entries(o)) {
                                const fieldName = toCamelCase(k);
                                const methodName = toPascalCase(k);
                                let javaType = 'Object';

                                if (v === null) {
                                    javaType = 'Object';
                                } else if (Array.isArray(v)) {
                                    if (v.length > 0) {
                                        const first = v[0];
                                        if (typeof first === 'object' && first !== null) {
                                            const childTypeName = name + toPascalCase(k);
                                            javaType = 'List<' + generate(childTypeName, first) + '>';
                                        } else {
                                            const primitiveType = typeof first === 'string' ? 'String' : typeof first === 'number' ? (Number.isInteger(first) ? 'Integer' : 'Double') : typeof first === 'boolean' ? 'Boolean' : 'Object';
                                            javaType = `List<${primitiveType}>`;
                                        }
                                    } else {
                                        javaType = 'List<Object>';
                                    }
                                } else if (typeof v === 'object') {
                                    const childTypeName = name + toPascalCase(k);
                                    generate(childTypeName, v);
                                    javaType = childTypeName;
                                } else if (typeof v === 'string') {
                                    javaType = 'String';
                                } else if (typeof v === 'number') {
                                    javaType = Number.isInteger(v) ? 'Integer' : 'Double';
                                } else if (typeof v === 'boolean') {
                                    javaType = 'Boolean';
                                }

                                props += `    private ${javaType} ${fieldName};\n`;
                                props += `    public ${javaType} get${methodName}() { return ${fieldName}; }\n`;
                                props += `    public void set${methodName}(${javaType} ${fieldName}) { this.${fieldName} = ${fieldName}; }\n\n`;
                            }

                            classes.push(`public class ${name} {\n${props}}`);
                            return name;
                        };

                        if (Array.isArray(obj)) {
                            const itemType = generate(rootName.endsWith('s') ? rootName.slice(0, -1) : rootName + 'Item', obj[0]);
                            return `public class ${rootName} extends ArrayList<${itemType}> { }\n\n` + classes.reverse().join('\n\n');
                        } else {
                            generate(rootName, obj);
                            return classes.reverse().join('\n\n');
                        }
                    } else if (lang === 'python') {
                        const classes = [];
                        const seenNames = new Set();

                        const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);
                        const toPascalCase = s => s.split('_').map(capitalize).join('');

                        const generate = (name, o) => {
                            if (seenNames.has(name)) return name;
                            seenNames.add(name);

                            let props = '';

                            // Handle Array Root
                            if (Array.isArray(o)) {
                                if (o.length > 0) {
                                    const first = o[0];
                                    if (typeof first === 'object' && first !== null) {
                                        const childType = generate(name.endsWith('s') ? name.slice(0, -1) : name + 'Item', first);
                                        return `List[${childType}]`;
                                    }
                                    const primitiveType = typeof first === 'string' ? 'str' : typeof first === 'number' ? (Number.isInteger(first) ? 'int' : 'float') : typeof first === 'boolean' ? 'bool' : 'Any';
                                    return `List[${primitiveType}]`;
                                }
                                return 'List[Any]';
                            }

                            for (const [k, v] of Object.entries(o)) {
                                const fieldName = k; // Keep snake_case for Python
                                let pyType = 'Any';

                                if (v === null) {
                                    pyType = 'Any';
                                } else if (Array.isArray(v)) {
                                    if (v.length > 0) {
                                        const first = v[0];
                                        if (typeof first === 'object' && first !== null) {
                                            const childTypeName = name + toPascalCase(k);
                                            pyType = 'List[' + generate(childTypeName, first) + ']';
                                        } else {
                                            const primitiveType = typeof first === 'string' ? 'str' : typeof first === 'number' ? (Number.isInteger(first) ? 'int' : 'float') : typeof first === 'boolean' ? 'bool' : 'Any';
                                            pyType = `List[${primitiveType}]`;
                                        }
                                    } else {
                                        pyType = 'List[Any]';
                                    }
                                } else if (typeof v === 'object') {
                                    const childTypeName = name + toPascalCase(k);
                                    generate(childTypeName, v);
                                    pyType = childTypeName;
                                } else if (typeof v === 'string') {
                                    pyType = 'str';
                                } else if (typeof v === 'number') {
                                    pyType = Number.isInteger(v) ? 'int' : 'float';
                                } else if (typeof v === 'boolean') {
                                    pyType = 'bool';
                                }

                                props += `    ${fieldName}: ${pyType}\n`;
                            }

                            classes.push(`@dataclass\nclass ${name}:\n${props}`);
                            return name;
                        };

                        if (Array.isArray(obj)) {
                            const itemType = generate(rootName.endsWith('s') ? rootName.slice(0, -1) : rootName + 'Item', obj[0]);
                            return `from dataclasses import dataclass\nfrom typing import Any, List\n\n${rootName} = List[${itemType}]\n\n` + classes.reverse().join('\n\n');
                        } else {
                            generate(rootName, obj);
                            return `from dataclasses import dataclass\nfrom typing import Any, List\n\n` + classes.reverse().join('\n\n');
                        }
                    } else if (lang === 'kotlin') {
                        const classes = [];
                        const seenNames = new Set();

                        const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);
                        const toCamelCase = s => {
                            const parts = s.split('_');
                            return parts[0] + parts.slice(1).map(capitalize).join('');
                        };
                        const toPascalCase = s => s.split('_').map(capitalize).join('');

                        const generate = (name, o) => {
                            if (seenNames.has(name)) return name;
                            seenNames.add(name);

                            let props = '';

                            // Handle Array Root
                            if (Array.isArray(o)) {
                                if (o.length > 0) {
                                    const first = o[0];
                                    if (typeof first === 'object' && first !== null) {
                                        const childType = generate(name.endsWith('s') ? name.slice(0, -1) : name + 'Item', first);
                                        return `List<${childType}>`;
                                    }
                                    const primitiveType = typeof first === 'string' ? 'String' : typeof first === 'number' ? (Number.isInteger(first) ? 'Int' : 'Double') : typeof first === 'boolean' ? 'Boolean' : 'Any';
                                    return `List<${primitiveType}>`;
                                }
                                return 'List<Any>';
                            }

                            const entries = Object.entries(o);
                            for (let i = 0; i < entries.length; i++) {
                                const [k, v] = entries[i];
                                const propName = toCamelCase(k);
                                let ktType = 'Any';

                                if (v === null) {
                                    ktType = 'Any?';
                                } else if (Array.isArray(v)) {
                                    if (v.length > 0) {
                                        const first = v[0];
                                        if (typeof first === 'object' && first !== null) {
                                            const childTypeName = name + toPascalCase(k);
                                            ktType = 'List<' + generate(childTypeName, first) + '>';
                                        } else {
                                            const primitiveType = typeof first === 'string' ? 'String' : typeof first === 'number' ? (Number.isInteger(first) ? 'Int' : 'Double') : typeof first === 'boolean' ? 'Boolean' : 'Any';
                                            ktType = `List<${primitiveType}>`;
                                        }
                                    } else {
                                        ktType = 'List<Any>';
                                    }
                                } else if (typeof v === 'object') {
                                    const childTypeName = name + toPascalCase(k);
                                    generate(childTypeName, v);
                                    ktType = childTypeName;
                                } else if (typeof v === 'string') {
                                    ktType = 'String';
                                } else if (typeof v === 'number') {
                                    ktType = Number.isInteger(v) ? 'Int' : 'Double';
                                } else if (typeof v === 'boolean') {
                                    ktType = 'Boolean';
                                }

                                props += `    val ${propName}: ${ktType}`;
                                if (i < entries.length - 1) props += ',';
                                props += '\n';
                            }

                            classes.push(`data class ${name}(\n${props})`);
                            return name;
                        };

                        if (Array.isArray(obj)) {
                            const itemType = generate(rootName.endsWith('s') ? rootName.slice(0, -1) : rootName + 'Item', obj[0]);
                            return `typealias ${rootName} = List<${itemType}>\n\n` + classes.reverse().join('\n\n');
                        } else {
                            generate(rootName, obj);
                            return classes.reverse().join('\n\n');
                        }
                    }
                    return `// Type generation for ${lang} coming soon`;
                } catch (e) {
                    return `// Error: ${e.message}`;
                }
            }
        }
    };
})();
