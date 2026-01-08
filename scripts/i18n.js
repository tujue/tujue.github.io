// ==================== INTERNATIONALIZATION (i18n) ====================
const translations = {
    en: {
        // Header & Navigation
        'app.title': 'TULPAR - 50+ Professional Developer Tools | JSON, OCR, PDF, Background Remover & More',
        'app.tagline': '50+ Free Professional Tools',
        'search.placeholder': "Search for tools (e.g., 'json', 'pdf', 'color')...",
        'search.noResults': 'No tools found',
        'favorites.title': 'Favorites',
        'favorites.empty': 'No favorites yet',

        // Categories
        'category.all': 'All Tools',
        'category.text': 'Text Tools',
        'category.image': 'Image Tools',
        'category.code': 'Code Tools',
        'category.converter': 'Converters',
        'category.generator': 'Generators',
        'category.format': 'Formatters',
        'category.security': 'Security',
        'category.document': 'Documents',
        'category.media': 'Media',
        'category.network': 'Network',
        'category.utility': 'Utilities',

        // Common UI
        'btn.copy': 'Copy',
        'btn.paste': 'Paste',
        'btn.clear': 'Clear',
        'btn.reset': 'Reset',
        'btn.download': 'Download',
        'btn.upload': 'Upload',
        'btn.generate': 'Generate',
        'btn.convert': 'Convert',
        'btn.close': 'Close',
        'btn.save': 'Save',
        'btn.print': 'Print',
        'btn.export': 'Export',
        'btn.import': 'Import',

        // Notifications
        'notify.copied': 'Copied to clipboard!',
        'notify.error': 'An error occurred',
        'notify.success': 'Success!',

        // Footer
        'footer.madeWith': 'Made with',
        'footer.by': 'by',
        'footer.allRights': 'All rights reserved',

        // Stats
        'stats.toolsUsed': 'Tools Used:',
        'stats.copies': 'Copies:',

        // Hero Section
        'hero.badge': '100% Free • No Login • No Limits • Privacy First',
        'hero.title': 'TULPAR - Next-Gen Developer Studio',
        'hero.subtitle': '50+ Professional tools for developers, designers, and creators. Completely free, lightning-fast, and 100% privacy-focused. Your data never leaves your device.',

        // Features
        'features.title': 'Why TULPAR?',
        'features.fast.title': 'Lightning Fast',
        'features.fast.desc': 'All tools run locally in your browser. No server requests, no waiting. Instant results every time.',
        'features.privacy.title': 'Privacy First',
        'features.privacy.desc': 'Your data never leaves your device. Everything is processed locally. No tracking, no analytics, no cookies.',
        'features.mobile.title': 'Mobile Friendly',
        'features.mobile.desc': 'Responsive design that works perfectly on all devices. Use your favorite tools anywhere, anytime.',
        'features.ui.title': 'Beautiful UI',
        'features.ui.desc': 'Modern, clean interface with smooth animations. Dark mode by default for comfortable extended use.',
        'features.offline.title': 'Works Offline',
        'features.offline.desc': 'Once loaded, works completely offline. Perfect for developers working in environments with restricted internet.',
        'features.free.title': '100% Free',
        'features.free.desc': 'Completely free forever. No premium features, no paywalls, no hidden costs. All tools, all the time.',

        // Common
        'common.addToFavorites': 'Add to Favorites',
        'common.removeFromFavorites': 'Remove from Favorites',

        // Footer
        'footer.rights': '© 2025 TULPAR. All rights reserved.',
        'footer.madeWith': 'Developed by Kaan Turkmen 🚀',
        'footer.about': 'About',
        'footer.privacy': 'Privacy Policy',
        'footer.terms': 'Terms of Service',
        'footer.contact': 'Contact',
        'footer.github': 'GitHub',
    },

    tr: {
        // Header & Navigasyon
        'app.title': 'TULPAR - 50+ Ücretsiz Geliştirici Aracı | JSON, OCR, PDF, Arka Plan Silici ve Daha Fazlası',
        'app.tagline': '50+ Ücretsiz Profesyonel Araç',
        'search.placeholder': "Araç ara (örn: 'json', 'pdf', 'renk')...",
        'search.noResults': 'Araç bulunamadı',
        'favorites.title': 'Favoriler',
        'favorites.empty': 'Henüz favori yok',

        // Kategoriler
        'category.all': 'Tüm Araçlar',
        'category.text': 'Metin Araçları',
        'category.image': 'Görsel Araçları',
        'category.code': 'Kod Araçları',
        'category.converter': 'Dönüştürücüler',
        'category.generator': 'Oluşturucular',
        'category.format': 'Biçimlendiriciler',
        'category.security': 'Güvenlik',
        'category.document': 'Dökümanlar',
        'category.media': 'Medya',
        'category.network': 'Ağ',
        'category.utility': 'Yardımcılar',

        // Genel Arayüz
        'btn.copy': 'Kopyala',
        'btn.paste': 'Yapıştır',
        'btn.clear': 'Temizle',
        'btn.reset': 'Sıfırla',
        'btn.download': 'İndir',
        'btn.upload': 'Yükle',
        'btn.generate': 'Oluştur',
        'btn.convert': 'Dönüştür',
        'btn.close': 'Kapat',
        'btn.save': 'Kaydet',
        'btn.print': 'Yazdır',
        'btn.export': 'Dışa Aktar',
        'btn.import': 'İçe Aktar',

        // Bildirimler
        'notify.copied': 'Panoya kopyalandı!',
        'notify.error': 'Bir hata oluştu',
        'notify.success': 'Başarılı!',


        // Stats
        'stats.toolsUsed': 'Kullanılan Araçlar:',
        'stats.copies': 'Kopyalamalar:',

        // Hero Section
        'hero.badge': '100% Ücretsiz • Üyelik Yok • Gizlilik Odaklı',
        'hero.title': 'TULPAR - Yeni Nesil Geliştirici Stüdyosu',
        'hero.subtitle': 'Geliştiriciler, tasarımcılar ve herkes için 50+ profesyonel araç. Tamamen ücretsiz, ışık hızında ve %100 gizlilik odaklı. Verileriniz asla cihazınızı terk etmez.',

        // Kategoriler
        'category.title': 'Kategoriye göre filtrele:',
        'category.all': 'Tümü',
        'category.developer': 'Geliştirici',
        'category.image': 'Görsel & Medya',
        'category.design': 'Tasarım',
        'category.document': 'Döküman',
        'category.converter': 'Dönüştürücü',
        'category.security': 'Güvenlik & Kripto',
        'category.social': 'Sosyal Medya',
        'category.text': 'Metin Araçları',
        'category.ai': 'Yapay Zeka',
        'category.other': 'Diğer',

        // Özellikler
        'features.title': 'Neden TULPAR?',
        'features.fast.title': 'Yıldırım Hızı',
        'features.fast.desc': 'Tüm araçlar tarayıcınızda yerel olarak çalışır. Sunucu isteği yok, bekleme yok. Her seferinde anında sonuçlar.',
        'features.privacy.title': 'Gizlilik Öncelikli',
        'features.privacy.desc': 'Verileriniz hiçbir zaman cihazınızdan ayrılmaz. Her şey yerel olarak işlenir. İzleme yok, analitik yok, çerez yok.',
        'features.mobile.title': 'Mobil Uyumlu',
        'features.mobile.desc': 'Tüm cihazlarda mükemmel çalışan duyarlı tasarım. Favori araçlarınızı her yerde, her zaman kullanın.',
        'features.ui.title': 'Güzel Arayüz',
        'features.ui.desc': 'Akıcı animasyonlarla modern, temiz arayüz. Rahat uzun süreli kullanım için varsayılan olarak koyu mod.',
        'features.offline.title': 'Çevrimdışı Çalışır',
        'features.offline.desc': 'Bir kez yüklendikten sonra tamamen çevrimdışı çalışır. Kısıtlı internet ortamlarında çalışan geliştiriciler için mükemmel.',
        'features.free.title': '100% Ücretsiz',
        'features.free.desc': 'Sonsuza kadar tamamen ücretsiz. Premium özellik yok, ücretli duvar yok, gizli maliyet yok. Tüm araçlar, her zaman.',

        // Genel
        'common.addToFavorites': 'Favorilere Ekle',
        'common.removeFromFavorites': 'Favorilerden Çıkar',

        // Footer
        'footer.rights': '© 2025 TULPAR. Tüm hakları saklıdır.',
        'footer.madeWith': 'Kaan Türkmen tarafından geliştirildi 🚀',
        'footer.about': 'Hakkında',
        'footer.privacy': 'Gizlilik Politikası',
        'footer.terms': 'Kullanım Şartları',
        'footer.contact': 'İletişim',
        'footer.github': 'GitHub',

        // Araç İsimleri ve Açıklamaları
        'tool.base64-tool.name': 'Base64 Kodlayıcı/Çözücü',
        'tool.base64-tool.desc': 'Metni Base64\'e kodlayın veya Base64 dizelerini tekrar metne çözün',
        'tool.regex-tester.name': 'Regex Test Aracı',
        'tool.regex-tester.desc': 'Canlı geri bildirim ve eşleşme vurgulama ile düzenli ifadelerinizi test edin',
        'tool.url-tool.name': 'URL Kodlayıcı/Çözücü',
        'tool.url-tool.desc': 'URL\'leri kodlayın ve çözün, URL bileşenlerini ayrıştırın',
        'tool.hash-generator.name': 'Hash Oluşturucu',
        'tool.hash-generator.desc': 'MD5, SHA-1, SHA-256, SHA-512 hash değerleri oluşturun',
        'tool.uuid-generator.name': 'UUID Oluşturucu',
        'tool.uuid-generator.desc': 'Toplu oluşturma desteğiyle v1, v4, v5 UUID oluşturun',
        'tool.password-generator.name': 'Şifre Oluşturucu',
        'tool.password-generator.desc': 'Anında güvenli rastgele şifreler oluşturun',
        'tool.qr-generator.name': 'QR Kod Oluşturucu',
        'tool.qr-generator.desc': 'URL, metin, WiFi ve daha fazlası için QR kodları oluşturun',
        'tool.color-picker.name': 'Renk Seçici',
        'tool.color-picker.desc': 'Renk seçin ve HEX, RGB, HSL formatları arasında dönüştürün',
        'tool.resume-builder.name': 'CV Oluşturucu',
        'tool.resume-builder.desc': 'Canlı önizleme ve PDF dışa aktarma ile profesyonel CV\'ler anında oluşturun',
        'tool.markdown-editor.name': 'Markdown Editörü',
        'tool.markdown-editor.desc': 'Canlı önizleme ile Markdown yazın ve düzenleyin',
        'tool.diff-checker.name': 'Fark Kontrol Aracı',
        'tool.diff-checker.desc': 'İki metin arasındaki farkları yan yana karşılaştırın',
        'tool.lorem-ipsum.name': 'Lorem Ipsum Oluşturucu',
        'tool.lorem-ipsum.desc': 'Test için yer tutucu metin oluşturun',
        'tool.case-converter.name': 'Metin Dönüştürücü',
        'tool.case-converter.desc': 'Metni farklı durumlara dönüştürün',
        'tool.word-counter.name': 'Kelime Sayacı',
        'tool.word-counter.desc': 'Kelime, karakter, cümle ve paragraf sayısını sayın',
        'tool.image-compressor.name': 'Görsel Sıkıştırıcı',
        'tool.image-compressor.desc': 'Görselleri kaliteden ödün vermeden sıkıştırın',
        'tool.pdf-tools.name': 'PDF Araçları',
        'tool.pdf-tools.desc': 'PDF\'leri birleştirin, bölün, sıkıştırın',
        'tool.unit-converter.name': 'Birim Dönüştürücü',
        'tool.unit-converter.desc': 'Uzunluk, ağırlık, sıcaklık dönüştürün',
        'tool.timestamp-converter.name': 'Zaman Damgası Dönüştürücü',
        'tool.timestamp-converter.desc': 'Unix zaman damgalarını dönüştürün',
        'tool.jwt-decoder.name': 'JWT Çözücü',
        'tool.jwt-decoder.desc': 'JWT tokenlarını çözün ve doğrulayın',
        'tool.cron-expression.name': 'Cron İfade Oluşturucu',
        'tool.cron-expression.desc': 'Cron zamanlaması oluşturun',
        'tool.json-to-csv.name': 'JSON\'dan CSV\'ye',
        'tool.json-to-csv.desc': 'JSON verilerini CSV formatına dönüştürün',
        'tool.csv-to-json.name': 'CSV\'den JSON\'a',
        'tool.csv-to-json.desc': 'CSV verilerini JSON formatına dönüştürün',
        'tool.html-encoder.name': 'HTML Kodlayıcı',
        'tool.html-encoder.desc': 'HTML özel karakterlerini kodlayın',
        'tool.text-reverser.name': 'Metin Ters Çevirici',
        'tool.text-reverser.desc': 'Metni tersine çevirin',
        'tool.ascii-art.name': 'ASCII Sanat',
        'tool.ascii-art.desc': 'Metni ASCII sanata dönüştürün',
        'tool.image-converter.name': 'Görsel Dönüştürücü',
        'tool.image-converter.desc': 'Görselleri farklı formatlara dönüştürün',
        'tool.qr-reader.name': 'QR Okuyucu',
        'tool.qr-reader.desc': 'QR kodlarını okuyun',
        'tool.color-palette-generator.name': 'Renk Paleti',
        'tool.color-palette-generator.desc': 'Renk paletleri oluşturun',
        'tool.gradient-generator.name': 'Gradyan Oluşturucu',
        'tool.gradient-generator.desc': 'CSS gradyanları oluşturun',
        'tool.svg-optimizer.name': 'SVG Optimize Edici',
        'tool.svg-optimizer.desc': 'SVG dosyalarını optimize edin',
        'tool.favicon-generator.name': 'Favicon Oluşturucu',
        'tool.favicon-generator.desc': 'Favicon oluşturun',
        'tool.meta-tags-generator.name': 'Meta Etiket Oluşturucu',
        'tool.meta-tags-generator.desc': 'SEO meta etiketleri',
        'tool.screenshot-tool.name': 'Ekran Görüntüsü',
        'tool.screenshot-tool.desc': 'Ekran görüntüsü alın',
        'tool.text-to-speech.name': 'Metinden Sese',
        'tool.text-to-speech.desc': 'Metni sese dönüştürün',
        'tool.ip-lookup.name': 'IP Sorgulama',
        'tool.ip-lookup.desc': 'IP adreslerini sorgulayın',
        'tool.dns-lookup.name': 'DNS Sorgulama',
        'tool.dns-lookup.desc': 'DNS kayıtlarını sorgulayın',
        'tool.ssl-checker.name': 'SSL Kontrol',
        'tool.ssl-checker.desc': 'SSL sertifikalarını kontrol edin',
        'tool.web-scraper.name': 'Web Kazıyıcı',
        'tool.web-scraper.desc': 'Web sayfalarından veri çıkarın',
        'tool.minifier.name': 'Küçültücü',
        'tool.minifier.desc': 'CSS, JS, HTML küçültün',
        'tool.random-generator.name': 'Rastgele Oluşturucu',
        'tool.random-generator.desc': 'Rastgele sayılar oluşturun',
        'tool.text-diff.name': 'Metin Farkı',
        'tool.text-diff.desc': 'Metinleri karşılaştırın',
        'tool.binary-converter.name': 'İkili Dönüştürücü',
        'tool.binary-converter.desc': 'İkili sistem dönüştürücü',
        'tool.morse-code.name': 'Mors Kodu',
        'tool.morse-code.desc': 'Mors kodu çevir',
        'tool.barcode-generator.name': 'Barkod Oluşturucu',
        'tool.barcode-generator.desc': 'Barkod oluşturun',
        'tool.crypto-tools.name': 'Kripto Araçları',
        'tool.crypto-tools.desc': 'Şifreleme araçları',
        'tool.image-resizer.name': 'Görsel Boyutlandırıcı',
        'tool.image-resizer.desc': 'Görselleri yeniden boyutlandırın',
        'tool.photo-editor.name': 'Fotoğraf Editörü',
        'tool.photo-editor.desc': 'Fotoğrafları düzenleyin',
        'tool.background-remover.name': 'Arka Plan Silici',
        'tool.background-remover.desc': 'Arka planı kaldırın',
        'tool.ocr-tool.name': 'OCR Aracı',
        'tool.ocr-tool.desc': 'Görüntüden metin çıkarın',
        'tool.exif-viewer.name': 'EXIF Görüntüleyici',
        'tool.exif-viewer.desc': 'Görsel meta verilerini görün',
        'tool.text-analyzer.name': 'Metin Analizörü',
        'tool.text-analyzer.desc': 'Metni detaylı analiz edin',
        'tool.health-calculator.name': 'Sağlık Hesaplayıcı',
        'tool.health-calculator.desc': 'Sağlık hesaplamaları yapın',
        'tool.social-preview.name': 'Sosyal Medya Önizleme',
        'tool.social-preview.desc': 'Sosyal medya paylaşım önizlemesi',
        'tool.css-generator.name': 'CSS Oluşturucu',
        'tool.css-generator.desc': 'CSS kodları oluşturun',
        'tool.image-tools.name': 'Görsel Araçları',
        'tool.image-tools.desc': 'Görsel analiz ve düzenleme',
        'tool.text-tools.name': 'Metin Araçları',
        'tool.text-tools.desc': 'Çoklu metin işlemleri',
        'tool.audio-waveform.name': 'Ses Dalga Formu',
        'tool.audio-waveform.desc': 'Ses dalga formları oluşturun',
        'tool.jwt-debugger.name': 'JWT Hata Ayıklayıcı',
        'tool.jwt-debugger.desc': 'JWT tokenlarını debug edin',
        'tool.color-palette.name': 'Renk Paleti',
        'tool.color-palette.desc': 'Renk paletleri oluşturun',
        'tool.cron-builder.name': 'Cron İfade Oluşturucu',
        'tool.cron-builder.desc': 'Cron zamanlama ifadeleri',
        'tool.bg-remover.name': 'Arka Plan Kaldırıcı',
        'tool.bg-remover.desc': 'Otomatik arka plan silme',
        'tool.pdf-manager.name': 'PDF Yöneticisi',
        'tool.pdf-manager.desc': 'PDF birleştir, böl, düzenle',
        'tool.metadata-tool.name': 'Meta Veri Uzmanı',
        'tool.metadata-tool.desc': 'Dosya meta verilerini yönetin',
        'tool.steganography.name': 'Steganografi Ustası',
        'tool.steganography.desc': 'Görsellere gizli mesaj sakla',
        'tool.htpasswd-generator.name': 'htpasswd Oluşturucu',
        'tool.htpasswd-generator.desc': 'Apache htpasswd dosyası oluştur',
        'tool.link-shortener.name': 'Link Kısaltıcı & QR',
        'tool.link-shortener.desc': 'Link kısalt ve QR oluştur',
        'tool.gamepad-tester.name': 'Gamepad Test Aracı',
        'tool.gamepad-tester.desc': 'Oyun kumandalarını test edin',

        'tool.code-to-image.name': 'Kod Görsel Stüdyosu',
        'tool.code-to-image.desc': 'Kodu güzel görsellere çevirin',
        'tool.mock-credit-card.name': 'Test Kart Stüdyosu',
        'tool.mock-credit-card.desc': 'Test kredi kartları oluşturun',
        'tool.subnet-calculator.name': 'CIDR Subnet Hesaplayıcı',
        'tool.subnet-calculator.desc': 'Alt ağ hesaplamaları',
        'tool.http-client.name': 'HTTP İstek Oluşturucu',
        'tool.http-client.desc': 'HTTP istekleri gönderin',
        'tool.social-grid-maker.name': 'Sosyal Grid & Panorama',
        'tool.social-grid-maker.desc': 'Instagram grid oluşturun',
        'tool.sql-playground.name': 'SQL Stüdyosu',
        'tool.sql-playground.desc': 'SQL sorguları çalıştırın',
        'tool.p2p-transfer.name': 'DevDrop (P2P Transfer)',
        'tool.p2p-transfer.desc': 'Dosya paylaşımı P2P (Sunucusuz)',
        'tool.og-image-generator.name': 'OG Görsel Stüdyosu',
        'tool.og-image-generator.desc': 'Sosyal medya görselleri',
        'tool.virtual-piano.name': 'Sanal Piyano',
        'tool.virtual-piano.desc': 'Tarayıcıda piyano çalın',
        'tool.color-extractor.name': 'Renk Çıkarıcı',
        'tool.color-extractor.desc': 'Görsellerden renk paleti çıkarın',
        'tool.prompt-wizard.name': 'Yapay Zeka Prompt Sihirbazı',
        'tool.prompt-wizard.desc': 'Midjourney & DALL-E için mükemmel promptlar oluşturun',

        // Missing tools from original map
        'tool.json-master-studio.name': 'JSON Stüdyosu',
        'tool.json-master-studio.desc': 'Hepsi Bir Arada JSON Aracı: Biçimlendirme, Doğrulama, Küçültme, CSV/XML Dönüştürme ve 6 Dilde Tip Oluşturma (TS/Go/C#/Java/Python/Kotlin).',
        'tool.code-beautifier.name': 'Kod Güzelleştirici',
        'tool.code-beautifier.desc': 'HTML, CSS, JavaScript ve JSON kodlarını güzelleştirin ve biçimlendirin',
    }
};

// Language Manager
class I18n {
    constructor() {
        this.currentLang = localStorage.getItem('app-language') || 'en';
        this.translations = translations;
    }

    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('app-language', lang);
            this.updateUI();
            return true;
        }
        return false;
    }

    t(key, fallback) {
        return this.translations[this.currentLang]?.[key] || fallback || key;
    }

    updateUI() {
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = this.t(key);

            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                if (el.getAttribute('placeholder')) {
                    el.placeholder = translation;
                }
            } else {
                el.textContent = translation;
            }
        });

        // Update placeholders with data-i18n-placeholder attribute
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const translation = this.t(key);
            el.placeholder = translation;
        });

        // Update title
        document.title = this.t('app.title');

        // Update SEO Section Visibility
        const seoEn = document.getElementById('seo-en');
        const seoTr = document.getElementById('seo-tr');
        if (seoEn && seoTr) {
            if (this.currentLang === 'tr') {
                seoEn.style.display = 'none';
                seoTr.style.display = 'block';
            } else {
                seoEn.style.display = 'block';
                seoTr.style.display = 'none';
            }
        }

        // Trigger custom event for other components
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: this.currentLang } }));
    }

    getCurrentLanguage() {
        return this.currentLang;
    }
}

// Initialize global i18n instance
window.i18n = new I18n();
