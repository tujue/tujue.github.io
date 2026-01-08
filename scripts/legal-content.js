const LEGAL_CONTENT = {
    en: {
        about: {
            title: "About TULPAR",
            content: `
                <div style="margin-bottom:20px;">
                    <h3>The Next Generation Developer Toolkit</h3>
                    <p>TULPAR is not just a collection of tools; it's a statement of speed, privacy, and precision. Built for modern developers who demand efficiency without compromising security.</p>
                </div>
                
                <div style="display:grid; gap:15px; margin-bottom:20px;">
                    <div style="background:rgba(255,255,255,0.03); padding:15px; border-radius:8px; border-left:3px solid var(--accent-color);">
                        <h4 style="margin:0 0 5px 0;">🚀 Mythological Speed</h4>
                        <p style="margin:0; font-size:0.9rem;">Named after the legendary winged horse of Turkic mythology, TULPAR is engineered to be swift. By leveraging advanced Client-Side technologies (WebAssembly, Modern JS), we ensure zero-latency performance.</p>
                    </div>
                    <div style="background:rgba(255,255,255,0.03); padding:15px; border-radius:8px; border-left:3px solid var(--accent-purple);">
                        <h4 style="margin:0 0 5px 0;">🛡️ Maximum Privacy</h4>
                        <p style="margin:0; font-size:0.9rem;">We believe your code and data are sacred. Unlike other platforms, TULPAR processes everything locally on your device. No cloud uploads, no data leaks.</p>
                    </div>
                </div>

                <p>Designed and meticulously crafted by <strong>Kaan Turkmen</strong>, TULPAR aims to set a new standard for open-source developer utilities.</p>
            `
        },
        privacy: {
            title: "Privacy Policy",
            content: `
                <h3>Privacy Manifesto</h3>
                <p>We respect your right to privacy. Our architecture is fundamentally designed to protect your data.</p>

                <h4>1. The "Zero-Knowledge" Architecture</h4>
                <p>TULPAR operates entirely within your web browser. When you compress an image or format JSON:</p>
                <ul>
                    <li>The data <strong>NEVER</strong> leaves your computer.</li>
                    <li>No copies are sent to our servers.</li>
                    <li>No logs of your file contents are created.</li>
                </ul>

                <h4>2. Local Storage Usage</h4>
                <p>We use your browser's "Local Storage" strictly for user experience preferences, such as:</p>
                <ul>
                    <li>Remembering your "Dark Mode" preference.</li>
                    <li>Saving your "Favorites" list.</li>
                    <li>Persisting the selected language (EN/TR).</li>
                </ul>
                <p>This data stays on your device and is never synchronized with any external database.</p>

                <h4>3. Third-Party Infrastructure</h4>
                <p>While the app runs locally, the static files are hosted on secure GitHub Pages. GitHub may log basic access info (IP address, User Agent) purely for security purposes.</p>
            `
        },
        terms: {
            title: "Terms of Service",
            content: `
                <h3>Terms and Conditions</h3>
                <p>By accessing TULPAR, you agree to be bound by these restrictions and terms of use due to the nature of our open-access tools.</p>

                <h4>1. License & Usage Rights</h4>
                <p>TULPAR grants you a revocable, non-exclusive, non-transferable license to use the tools for both personal and commercial projects. You are free to use the output (e.g., converted files, generated code) in your own applications without attribution.</p>

                <h4>2. Prohibited Activities</h4>
                <p>You strictly agree NOT to:</p>
                <ul>
                    <li>Use the tools for any illegal, malicious, or fraudulent activities.</li>
                    <li>Attempt to reverse-engineer, decompile, or extract the source code of TULPAR.</li>
                    <li>Use automated scripts (bots) to scrape or overload our service.</li>
                    <li>Sell, rent, or sublicense the tools themselves as your own product.</li>
                </ul>

                <h4>3. Disclaimer of Warranties</h4>
                <p>The service is provided on an "AS IS" and "AS AVAILABLE" basis. TULPAR makes no warranties regarding the accuracy, reliability, or uninterrupted availability of the tools. We are not liable for any data loss, browser crashes, or errors resulting from the use of our tools.</p>

                <h4>4. Limitation of Liability</h4>
                <p>In no event shall TULPAR or Kaan Turkmen be liable for any direct, indirect, incidental, or consequential damages arising from your use of the website.</p>

                <h4>5. Changes to Service</h4>
                <p>We reserve the right to modify, suspend, or discontinue any part of the service at any time without prior notice.</p>
            `
        },
        contact: {
            title: "Contact Us",
            content: `
                <div style="display:flex; flex-direction:column; gap:20px; font-size:1.1rem; margin-top:10px;">
                    <p>Have questions, suggestions, or feedback? Feel free to reach out to us directly:</p>
                    
                    <a href="mailto:0n.watts@europe.com" style="display:flex; align-items:center; gap:20px; background:rgba(255,255,255,0.03); padding:20px; border-radius:12px; text-decoration:none; color:var(--text-primary); border:1px solid var(--border); transition:all 0.2s;" onmouseover="this.style.borderColor='var(--accent-blue)'; this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.borderColor='var(--border)'; this.style.background='rgba(255,255,255,0.03)'">
                        <div style="width:50px; height:50px; background:rgba(59, 130, 246, 0.1); border-radius:10px; display:flex; align-items:center; justify-content:center;">
                             <i class="fas fa-envelope" style="font-size:1.5rem; color:#3b82f6;"></i>
                        </div>
                        <div>
                            <div style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:2px;">Email</div>
                            <div style="font-weight:600; font-size:1.1rem;">0n.watts@europe.com</div>
                        </div>
                    </a>

                    <a href="https://instagram.com/kaan.turkmen12" target="_blank" style="display:flex; align-items:center; gap:20px; background:rgba(255,255,255,0.03); padding:20px; border-radius:12px; text-decoration:none; color:var(--text-primary); border:1px solid var(--border); transition:all 0.2s;" onmouseover="this.style.borderColor='#E1306C'; this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.borderColor='var(--border)'; this.style.background='rgba(255,255,255,0.03)'">
                        <div style="width:50px; height:50px; background:rgba(225, 48, 108, 0.1); border-radius:10px; display:flex; align-items:center; justify-content:center;">
                             <i class="fab fa-instagram" style="font-size:1.8rem; color:#E1306C;"></i>
                        </div>
                        <div>
                            <div style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:2px;">Instagram</div>
                            <div style="font-weight:600; font-size:1.1rem;">@kaan.turkmen12</div>
                        </div>
                    </a>
                </div>
            `
        },
        copyright: {
            title: "Legal Information",
            content: `
                <div style="text-align:center; margin-bottom:25px; padding-bottom:10px; border-bottom:1px solid var(--border);">
                    <i class="fas fa-copyright" style="font-size:3rem; color:var(--accent-color); margin-bottom:15px;"></i>
                    <h3 style="color:var(--text-primary); margin:0;">Copyright & Licensing</h3>
                    <div style="font-size:0.8rem; color:var(--text-secondary); margin-top:5px;">Intellectual Property Rights</div>
                </div>
                
                <h4>1. Copyright Notice</h4>
                <p>The content of TULPAR, including source code, design elements, logos, and features, is the intellectual property of <strong>Kaan Turkmen</strong>. All rights are reserved.</p>

                <h4>2. Usage Rights</h4>
                <p>You are welcome to use TULPAR for your personal or commercial projects. The output generated by our tools (JSON, Images, PDFs, etc.) is entirely yours to use without restriction.</p>

                <h4>3. Fair Use</h4>
                <p>While TULPAR is free to use, re-distributing, selling, or claiming the project as your own without permission is not allowed. We encourage fair use and respect for intellectual property.</p>

                <div style="background:rgba(59, 130, 246, 0.1); border:1px solid var(--accent-color); padding:15px; border-radius:8px; margin-top:20px; font-size:0.9rem;">
                    <strong>🤝 CONTRIBUTE:</strong><br>
                    TULPAR is a free project driven by the open-source spirit. Found a bug or have a suggestion? Feel free to contribute or reach out via GitHub.
                </div>
            `
        }
    },
    tr: {
        about: {
            title: "TULPAR ve Vizyonumuz",
            content: `
                 <div style="margin-bottom:20px;">
                    <h3>Geliştiriciler İçin Yeni Nesil Güç</h3>
                    <p>TULPAR, sıradan bir araç seti değildir; hızın, gizliliğin ve kesinliğin birleşimidir. Güvenlikten ödün vermeden verimlilik isteyen modern geliştiriciler için Kaan Türkmen tarafından tasarlanmıştır.</p>
                </div>
                
                <div style="display:grid; gap:15px; margin-bottom:20px;">
                    <div style="background:rgba(255,255,255,0.03); padding:15px; border-radius:8px; border-left:3px solid var(--accent-color);">
                        <h4 style="margin:0 0 5px 0;">🚀 Mitolojik Hız</h4>
                        <p style="margin:0; font-size:0.9rem;">Adını Türk mitolojisinin efsanevi kanatlı atından alan TULPAR, hız için tasarlandı. Gelişmiş tarayıcı teknolojileri (Client-Side) sayesinde bekleme süresi ve gecikme yoktur.</p>
                    </div>
                    <div style="background:rgba(255,255,255,0.03); padding:15px; border-radius:8px; border-left:3px solid var(--accent-purple);">
                        <h4 style="margin:0 0 5px 0;">🛡️ Maksimum Gizlilik</h4>
                        <p style="margin:0; font-size:0.9rem;">Kodlarınız ve verileriniz kutsaldır. Diğer platformların aksine, TULPAR her şeyi yerel olarak cihazınızda işler. Buluta yükleme yok, veri sızıntısı yok.</p>
                    </div>
                </div>
            `
        },
        privacy: {
            title: "Gizlilik Manifestosu",
            content: `
                <h3>Gizliliğiniz Bizim İçin Kutsaldır</h3>
                <p>Kaan Türkmen olarak, kullanıcı gizliliğine mutlak saygı duyuyoruz. Mimari yapımız, verilerinizi korumak üzerine kurulmuştur.</p>

                <h4>1. "Sıfır Bilgi" Mimarisi (Zero-Knowledge)</h4>
                <p>TULPAR tamamen tarayıcınızın içinde çalışır. Bir resim sıkıştırdığınızda veya JSON formatladığınızda:</p>
                <ul>
                    <li>Verileriniz <strong>ASLA</strong> bilgisayarınızı terk etmez.</li>
                    <li>Sunucularımıza hiçbir kopya gönderilmez.</li>
                    <li>Dosya içeriklerinizin kaydı tutulmaz.</li>
                </ul>

                <h4>2. Yerel Depolama (Local Storage)</h4>
                <p>Tarayıcınızın "Yerel Depolama" özelliğini sadece deneyiminizi iyileştirmek için kullanırız:</p>
                <ul>
                    <li>Karanlık mod tercihiniz.</li>
                    <li>Favori araçlar listeniz.</li>
                    <li>Dil seçiminiz.</li>
                </ul>
                <p>Bu veriler sadece sizin cihazınızda kalır ve dış dünyayla paylaşılmaz.</p>
            `
        },
        terms: {
            title: "Kullanım ve Hizmet Sözleşmesi",
            content: `
                <h3>Kullanım ve Hizmet Sözleşmesi</h3>
                <p>TULPAR Geliştirici Seti'ne erişerek ve kullanarak, aşağıdaki bağlayıcı yasal şartları kabul etmiş sayılırsınız.</p>

                <h4>1. Lisans ve Kullanım Hakları</h4>
                <p>Kaan Türkmen, size bu araçları hem kişisel hem de ticari projelerinizde kullanmanız için geri alınabilir, münhasır olmayan bir lisans verir. Araçların ürettiği çıktıları (örn: dönüştürülen dosyalar, kodlar) herhangi bir kısıtlama olmaksızın projelerinizde kullanabilirsiniz.</p>

                <h4>2. Yasaklanmış Faaliyetler</h4>
                <p>Kullanıcılar aşağıdaki eylemleri <strong>gerçekleştiremez</strong>:</p>
                <ul>
                    <li>Araçları yasa dışı, kötü amaçlı veya diğer kullanıcılara zarar verecek şekilde kullanmak.</li>
                    <li>TULPAR'ın kaynak kodlarını tersine mühendislik (reverse engineering) yöntemiyle çözmeye, kopyalamaya veya çalmaya çalışmak.</li>
                    <li>Sistemi yormak amacıyla otomatik bot veya scriptler kullanmak.</li>
                </ul>

                <h4>3. Sorumluluk Reddi (Disclaimer)</h4>
                <p>Hizmet "OLDUĞU GİBİ" (AS IS) sunulmaktadır. TULPAR, araçların hatasız çalışacağına, kesintisiz olacağına veya belirli bir amaca uygunluğuna dair hiçbir garanti vermez. Kullanımdan doğabilecek veri kaybı, tarayıcı çökmesi veya diğer teknik sorunlardan Kaan Türkmen sorumlu tutulamaz.</p>

                <h4>4. Fikri Mülkiyet</h4>
                <p>Bu web sitesinin tasarımı, logosu, arayüz bileşenleri ve özel algoritmaları Kaan Türkmen'in fikri mülkiyetidir ve izinsiz kullanılamaz.</p>

                <h4>5. Değişiklik Hakkı</h4>
                <p>Hizmet sağlayıcı, önceden bildirimde bulunmaksızın özellikleri değiştirme, kaldırma veya hizmeti tamamen durdurma hakkını saklı tutar.</p>
            `
        },
        contact: {
            title: "İletişim",
            content: `
                <div style="display:flex; flex-direction:column; gap:20px; font-size:1.1rem; margin-top:10px;">
                    <p>Sorularınız, önerileriniz veya geri bildirimleriniz mi var? Bize doğrudan ulaşabilirsiniz:</p>
                    
                    <a href="mailto:0n.watts@europe.com" style="display:flex; align-items:center; gap:20px; background:rgba(255,255,255,0.03); padding:20px; border-radius:12px; text-decoration:none; color:var(--text-primary); border:1px solid var(--border); transition:all 0.2s;" onmouseover="this.style.borderColor='var(--accent-blue)'; this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.borderColor='var(--border)'; this.style.background='rgba(255,255,255,0.03)'">
                        <div style="width:50px; height:50px; background:rgba(59, 130, 246, 0.1); border-radius:10px; display:flex; align-items:center; justify-content:center;">
                             <i class="fas fa-envelope" style="font-size:1.5rem; color:#3b82f6;"></i>
                        </div>
                        <div>
                            <div style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:2px;">E-posta</div>
                            <div style="font-weight:600; font-size:1.1rem;">0n.watts@europe.com</div>
                        </div>
                    </a>

                    <a href="https://instagram.com/kaan.turkmen12" target="_blank" style="display:flex; align-items:center; gap:20px; background:rgba(255,255,255,0.03); padding:20px; border-radius:12px; text-decoration:none; color:var(--text-primary); border:1px solid var(--border); transition:all 0.2s;" onmouseover="this.style.borderColor='#E1306C'; this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.borderColor='var(--border)'; this.style.background='rgba(255,255,255,0.03)'">
                        <div style="width:50px; height:50px; background:rgba(225, 48, 108, 0.1); border-radius:10px; display:flex; align-items:center; justify-content:center;">
                             <i class="fab fa-instagram" style="font-size:1.8rem; color:#E1306C;"></i>
                        </div>
                        <div>
                            <div style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:2px;">Instagram</div>
                            <div style="font-weight:600; font-size:1.1rem;">@kaan.turkmen12</div>
                        </div>
                    </a>
                </div>
            `
        },
        copyright: {
            title: "Yasal Bilgilendirme",
            content: `
                <div style="text-align:center; margin-bottom:25px; padding-bottom:10px; border-bottom:1px solid var(--border);">
                    <i class="fas fa-copyright" style="font-size:3rem; color:var(--accent-color); margin-bottom:15px;"></i>
                    <h3 style="color:var(--text-primary); margin:0;">Telif Hakkı ve Lisans</h3>
                    <div style="font-size:0.8rem; color:var(--text-secondary); margin-top:5px;">Fikri Mülkiyet Hakları</div>
                </div>
                
                <h4>1. Telif Hakkı Bildirimi</h4>
                <p>TULPAR projesinin tüm içeriği; kaynak kodları, arayüz tasarımı, logosu ve özellikleri dahil olmak üzere <strong>Kaan Türkmen</strong>'in fikri mülkiyetidir. Tüm hakları saklıdır.</p>

                <h4>2. Kullanım Hakları</h4>
                <p>TULPAR'ı kişisel veya ticari projelerinizde özgürce kullanabilirsiniz. Araçlarımızın ürettiği çıktılar (PDF, Görsel, Kod vb.) tamamen size aittir ve üzerlerinde herhangi bir kısıtlama yoktur.</p>

                <h4>3. Adil Kullanım</h4>
                <p>Bu projenin izinsiz olarak kopyalanması, satılması veya başka bir isim altında dağıtılmasına izin verilmemektedir. Emeğe saygı çerçevesinde adil kullanımı destekliyoruz.</p>

                <div style="background:rgba(59, 130, 246, 0.1); border:1px solid var(--accent-color); padding:15px; border-radius:8px; margin-top:20px; font-size:0.9rem;">
                    <strong>🤝 KATKIDA BULUNUN:</strong><br>
                    Bu proje tamamen ücretsiz ve açık kaynak ruhuyla geliştirilmektedir. Hata bildirmek, öneride bulunmak veya destek olmak için GitHub üzerinden bize ulaşabilirsiniz.
                </div>
            `
        }
    }
};

/**
 * Show legal modal with content
 */
window.showLegal = function (type) {
    const modal = document.getElementById('legal-modal');
    const title = document.getElementById('legal-title');
    const body = document.getElementById('legal-body');

    if (!modal || !title || !body) {
        console.error('Legal modal elements not found');
        return;
    }

    // Get current language
    const currentLang = window.i18n ? window.i18n.getCurrentLanguage() : 'en';

    // Get content
    const content = LEGAL_CONTENT[currentLang]?.[type] || LEGAL_CONTENT['en']?.[type];

    if (!content) {
        console.error(`Legal content not found for type: ${type}`);
        return;
    }

    // Set content
    title.textContent = content.title;
    body.innerHTML = content.content;

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

/**
 * Close legal modal and restore scrolling
 */
window.closeLegal = function () {
    const modal = document.getElementById('legal-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
};

// Setup event listeners for legal modal
document.addEventListener('DOMContentLoaded', function () {
    const legalModal = document.getElementById('legal-modal');

    // Close on backdrop click
    if (legalModal) {
        legalModal.addEventListener('click', function (e) {
            if (e.target.id === 'legal-modal') {
                closeLegal();
            }
        });
    }

    // Close on Escape key (only if legal modal is active)
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && legalModal && legalModal.classList.contains('active')) {
            closeLegal();
        }
    });
});

console.log('✅ Legal content loaded');
