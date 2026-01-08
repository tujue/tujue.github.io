/* TULPAR - Professional Mock Card Studio with Advanced Features */
class MockCardStudioTool extends BaseTool {
    constructor(config) {
        super(config);
        this.currentType = 'visa';
        this.savedCards = [];
    }

    renderUI() {
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const txt = isTr ? {
            title: 'Profesyonel Test Kartı Stüdyosu',
            holder: 'KART SAHİBİ',
            expires: 'SKT',
            cvv: 'CVV',
            generate: 'Yeni Kart Oluştur',
            bulk: 'Toplu Oluştur',
            save: 'Kaydet',
            clear: 'Temizle',
            export: 'Dışa Aktar',
            copy: 'JSON Kopyala',
            cardNumber: 'Kart Numarası',
            cardType: 'Kart Türü',
            details: 'Kart Detayları',
            savedCards: 'Kaydedilen Kartlar',
            bulkCount: 'Oluşturulacak Kart Sayısı',
            customName: 'Özel İsim',
            randomize: 'Rastgele'
        } : {
            title: 'Professional Test Card Studio',
            holder: 'CARD HOLDER',
            expires: 'EXP',
            cvv: 'CVV',
            generate: 'Generate New Card',
            bulk: 'Bulk Generate',
            save: 'Save Card',
            clear: 'Clear All',
            export: 'Export All',
            copy: 'Copy JSON',
            cardNumber: 'Card Number',
            cardType: 'Card Type',
            details: 'Card Details',
            savedCards: 'Saved Cards',
            bulkCount: 'Number of Cards',
            customName: 'Custom Name',
            randomize: 'Randomize'
        };

        return `
        <div class="tool-content card-studio" style="max-width: 100%; margin: 0 auto; padding: 20px;">
            <div style="display: grid; grid-template-columns: 1fr 380px; gap: 2rem;">
                
                <!-- Main Card Area -->
                <div>
                    <!-- 3D Card Display -->
                    <div style="perspective: 1500px; margin-bottom: 2rem;">
                        <div id="mc-visual" class="mc-card-3d">
                            <!-- Card Front -->
                            <div class="mc-card-front">
                                <!-- Chip & Logo -->
                                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 45px;">
                                    <div class="mc-chip"></div>
                                    <div id="mc-logo" class="mc-logo">VISA</div>
                                </div>

                                <!-- Card Number -->
                                <div id="mc-num" class="mc-number">4242 4242 4242 4242</div>

                                <!-- Details Row -->
                                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 35px;">
                                    <div style="flex: 1;">
                                        <div class="mc-label">${txt.holder}</div>
                                        <div id="mc-name" class="mc-value">JOHN DOE</div>
                                    </div>
                                    <div style="text-align: center; margin-right: 40px;">
                                        <div class="mc-label">${txt.expires}</div>
                                        <div id="mc-exp" class="mc-value">12/28</div>
                                    </div>
                                    <div style="text-align: right;">
                                        <div class="mc-label">${txt.cvv}</div>
                                        <div id="mc-cvv" class="mc-value">123</div>
                                    </div>
                                </div>

                                <!-- Decorative Elements -->
                                <div class="mc-glow-1"></div>
                                <div class="mc-glow-2"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Card Type Selection -->
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 2rem;">
                        <button id="mc-btn-visa" class="mc-type-btn active" data-type="visa">
                            <span style="font-size: 1.5rem;">💳</span>
                            <span>Visa</span>
                        </button>
                        <button id="mc-btn-master" class="mc-type-btn" data-type="master">
                            <span style="font-size: 1.5rem;">💳</span>
                            <span>Mastercard</span>
                        </button>
                        <button id="mc-btn-amex" class="mc-type-btn" data-type="amex">
                            <span style="font-size: 1.5rem;">💎</span>
                            <span>Amex</span>
                        </button>
                        <button id="mc-btn-discover" class="mc-type-btn" data-type="discover">
                            <span style="font-size: 1.5rem;">🔍</span>
                            <span>Discover</span>
                        </button>
                    </div>

                    <!-- Quick Actions -->
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 2rem;">
                        <button id="mc-btn-generate" class="btn btn-primary" style="font-weight: 700;">
                            ⚡ ${txt.generate}
                        </button>
                        <button id="mc-btn-save" class="btn btn-success" style="font-weight: 700;">
                            💾 ${txt.save}
                        </button>
                        <button id="mc-btn-copy-current" class="btn btn-secondary" style="font-weight: 700;">
                            📋 ${txt.copy}
                        </button>
                    </div>

                    <!-- Advanced Options -->
                    <div class="card" style="padding: 1.5rem; background: var(--surface); border-radius: 16px;">
                        <h4 style="font-size: 0.8rem; text-transform: uppercase; color: var(--primary); margin-bottom: 1rem;">ADVANCED OPTIONS</h4>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                            <div>
                                <label class="form-label" style="font-size: 0.75rem;">${txt.customName}</label>
                                <input type="text" id="mc-custom-name" class="form-input" placeholder="${txt.randomize}">
                            </div>
                            <div>
                                <label class="form-label" style="font-size: 0.75rem;">${txt.bulkCount}</label>
                                <input type="number" id="mc-bulk-count" class="form-input" value="5" min="1" max="50">
                            </div>
                        </div>
                        
                        <button id="mc-btn-bulk" class="btn btn-outline" style="width: 100%; font-weight: 700;">
                            🎲 ${txt.bulk}
                        </button>
                    </div>
                </div>

                <!-- Sidebar -->
                <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                    <!-- Current Card JSON -->
                    <div class="card" style="padding: 1.5rem; background: var(--surface); border-radius: 16px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                            <h4 style="font-size: 0.8rem; text-transform: uppercase; color: var(--primary); margin: 0;">CURRENT CARD</h4>
                            <span style="font-size: 0.65rem; color: #10b981; font-weight: 700;">✓ LUHN VALID</span>
                        </div>
                        <textarea id="mc-current-json" class="form-input" rows="8" readonly style="font-family: var(--font-mono); font-size: 0.75rem; background: rgba(0,0,0,0.3); border: none; color: #a5b4fc;"></textarea>
                    </div>

                    <!-- Saved Cards List -->
                    <div class="card" style="padding: 1.5rem; background: var(--surface); border-radius: 16px; flex: 1; display: flex; flex-direction: column;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                            <h4 style="font-size: 0.8rem; text-transform: uppercase; color: var(--primary); margin: 0;">${txt.savedCards} (<span id="mc-saved-count">0</span>)</h4>
                            <div style="display: flex; gap: 8px;">
                                <button id="mc-btn-export" class="btn btn-sm btn-success" style="font-size: 0.7rem;" disabled>📥 ${txt.export}</button>
                                <button id="mc-btn-clear" class="btn btn-sm btn-outline" style="font-size: 0.7rem;" disabled>🗑️ ${txt.clear}</button>
                            </div>
                        </div>
                        <div id="mc-saved-list" style="flex: 1; overflow-y: auto; max-height: 400px;">
                            <div style="text-align: center; opacity: 0.3; margin-top: 50px; font-size: 0.85rem;">No saved cards</div>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                .mc-card-3d {
                    width: 550px;
                    height: 340px;
                    margin: 0 auto;
                    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                    transform-style: preserve-3d;
                }

                .mc-card-3d:hover {
                    transform: perspective(1500px) rotateY(-5deg) rotateX(3deg);
                }

                .mc-card-front {
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #2563eb, #1e40af);
                    border-radius: 20px;
                    padding: 40px;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 25px 60px rgba(0,0,0,0.4);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: white;
                }

                .mc-chip {
                    width: 65px;
                    height: 50px;
                    background: linear-gradient(135deg, #fbbf24, #f59e0b);
                    border-radius: 10px;
                    border: 1px solid rgba(0,0,0,0.2);
                    box-shadow: inset 0 3px 8px rgba(255,255,255,0.4);
                    position: relative;
                }

                .mc-chip::before {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 40px;
                    height: 30px;
                    border: 2px solid rgba(0,0,0,0.1);
                    border-radius: 4px;
                }

                .mc-logo {
                    font-size: 2.2rem;
                    font-weight: 900;
                    font-style: italic;
                    opacity: 0.9;
                    letter-spacing: -1px;
                    text-shadow: 0 4px 8px rgba(0,0,0,0.3);
                }

                .mc-number {
                    font-family: var(--font-mono);
                    font-size: 1.7rem;
                    letter-spacing: 4px;
                    text-shadow: 0 4px 8px rgba(0,0,0,0.4);
                    font-weight: 700;
                    word-wrap: break-word;
                    line-height: 1.3;
                }

                .mc-label {
                    font-size: 0.65rem;
                    text-transform: uppercase;
                    opacity: 0.6;
                    margin-bottom: 5px;
                    letter-spacing: 1px;
                }

                .mc-value {
                    font-size: 1.1rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                }

                .mc-glow-1 {
                    position: absolute;
                    bottom: -60px;
                    right: -60px;
                    width: 300px;
                    height: 300px;
                    background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%);
                    border-radius: 50%;
                    pointer-events: none;
                }

                .mc-glow-2 {
                    position: absolute;
                    top: -100px;
                    left: -100px;
                    width: 250px;
                    height: 250px;
                    background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%);
                    border-radius: 50%;
                    pointer-events: none;
                }

                .mc-type-btn {
                    padding: 1rem;
                    background: var(--surface);
                    border: 2px solid var(--border-color);
                    border-radius: 12px;
                    color: var(--text-primary);
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                    font-weight: 600;
                    font-size: 0.85rem;
                }

                .mc-type-btn:hover {
                    background: var(--surface-hover);
                    transform: translateY(-2px);
                }

                .mc-type-btn.active {
                    background: var(--primary);
                    border-color: var(--primary);
                    color: white;
                }

                .mc-saved-card {
                    padding: 0.8rem;
                    background: rgba(0,0,0,0.2);
                    border-radius: 8px;
                    margin-bottom: 0.6rem;
                    border: 1px solid rgba(255,255,255,0.05);
                    transition: 0.2s;
                    cursor: pointer;
                }

                .mc-saved-card:hover {
                    background: rgba(0,0,0,0.3);
                    border-color: var(--primary);
                }
            </style>
        </div>
        `;
    }

    setupListeners() {
        const types = {
            visa: { prefix: '4', length: 16, gradient: 'linear-gradient(135deg, #2563eb, #1e40af)', logo: 'VISA' },
            master: { prefix: '51', length: 16, gradient: 'linear-gradient(135deg, #ef4444, #dc2626)', logo: 'MASTERCARD' },
            amex: { prefix: '37', length: 15, gradient: 'linear-gradient(135deg, #10b981, #059669)', logo: 'AMEX' },
            discover: { prefix: '6011', length: 16, gradient: 'linear-gradient(135deg, #f97316, #ea580c)', logo: 'DISCOVER' }
        };

        const generateCard = (type = this.currentType, customName = null) => {
            const config = types[type];
            // Formerly window.DevTools.cardTools.generateLuhn
            const raw = this._generateLuhn(config.prefix, config.length);
            // Formerly window.DevTools.cardTools.format
            const formatted = this._formatCardNumber(raw);

            const names = ["JOHN DOE", "JANE SMITH", "ALEX MERDEZ", "SARAH CONNOR", "TONY STARK", "BRUCE WAYNE", "DIANA PRINCE", "PETER PARKER"];
            const name = customName || names[Math.floor(Math.random() * names.length)];
            const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
            const year = Math.floor(Math.random() * 5) + 25;
            const exp = `${month}/${year}`;
            const cvv = type === 'amex' ? Math.floor(Math.random() * 8999) + 1000 : Math.floor(Math.random() * 899) + 100;

            return {
                scheme: type.toUpperCase(),
                number: raw,
                formatted: formatted,
                holder: name,
                expiry: exp,
                cvv: cvv,
                luhn_valid: true
            };
        };

        const updateUI = (cardData) => {
            const config = types[this.currentType];

            document.getElementById('mc-num').textContent = cardData.formatted;
            document.getElementById('mc-name').textContent = cardData.holder;
            document.getElementById('mc-exp').textContent = cardData.expiry;
            document.getElementById('mc-cvv').textContent = cardData.cvv;
            document.getElementById('mc-logo').textContent = config.logo;

            const cardFront = document.querySelector('.mc-card-front');
            cardFront.style.background = config.gradient;

            const card3d = document.getElementById('mc-visual');
            card3d.style.transform = 'perspective(1500px) rotateY(15deg) rotateX(5deg)';
            setTimeout(() => {
                card3d.style.transform = 'perspective(1500px) rotateY(0) rotateX(0)';
            }, 400);

            document.getElementById('mc-current-json').value = JSON.stringify(cardData, null, 2);
        };

        const updateSavedList = () => {
            const list = document.getElementById('mc-saved-list');
            if (this.savedCards.length === 0) {
                list.innerHTML = '<div style="text-align: center; opacity: 0.3; margin-top: 50px; font-size: 0.85rem;">No saved cards</div>';
                document.getElementById('mc-btn-export').disabled = true;
                document.getElementById('mc-btn-clear').disabled = true;
            } else {
                list.innerHTML = this.savedCards.map((card, idx) => `
                    <div class="mc-saved-card" onclick="window.currentTool._selectSavedCard(${idx})">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                            <span style="font-weight: 700; font-size: 0.85rem;">${card.scheme}</span>
                            <button onclick="event.stopPropagation(); window.currentTool._removeSavedCard(${idx})" class="btn btn-sm btn-outline" style="font-size: 0.65rem; padding: 4px 8px;">×</button>
                        </div>
                        <div style="font-family: var(--font-mono); font-size: 0.75rem; opacity: 0.8;">${card.formatted}</div>
                        <div style="font-size: 0.7rem; opacity: 0.6; margin-top: 0.3rem;">${card.holder}</div>
                    </div>
                `).join('');
                document.getElementById('mc-btn-export').disabled = false;
                document.getElementById('mc-btn-clear').disabled = false;
            }
            document.getElementById('mc-saved-count').textContent = this.savedCards.length;
        };

        // Card Type Buttons
        ['visa', 'master', 'amex', 'discover'].forEach(type => {
            document.getElementById(`mc-btn-${type}`).onclick = () => {
                this.currentType = type;
                document.querySelectorAll('.mc-type-btn').forEach(btn => btn.classList.remove('active'));
                document.getElementById(`mc-btn-${type}`).classList.add('active');
                const card = generateCard(type);
                updateUI(card);
            };
        });

        // Generate Button
        document.getElementById('mc-btn-generate').onclick = () => {
            const customName = document.getElementById('mc-custom-name').value.trim().toUpperCase();
            const card = generateCard(this.currentType, customName || null);
            updateUI(card);
        };

        // Save Button
        document.getElementById('mc-btn-save').onclick = () => {
            const jsonText = document.getElementById('mc-current-json').value;
            const card = JSON.parse(jsonText);
            this.savedCards.push(card);
            updateSavedList();
            this.showNotification('Card saved!', 'success');
        };

        // Copy Current
        document.getElementById('mc-btn-copy-current').onclick = () => {
            this.copyToClipboard(document.getElementById('mc-current-json').value);
        };

        // Bulk Generate
        document.getElementById('mc-btn-bulk').onclick = () => {
            const count = parseInt(document.getElementById('mc-bulk-count').value) || 5;
            for (let i = 0; i < count; i++) {
                const randomType = ['visa', 'master', 'amex', 'discover'][Math.floor(Math.random() * 4)];
                const card = generateCard(randomType);
                this.savedCards.push(card);
            }
            updateSavedList();
            this.showNotification(`Generated ${count} cards!`, 'success');
        };

        // Export All
        document.getElementById('mc-btn-export').onclick = () => {
            const json = JSON.stringify(this.savedCards, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `test_cards_${Date.now()}.json`;
            a.click();
        };

        // Clear All
        document.getElementById('mc-btn-clear').onclick = () => {
            if (confirm('Clear all saved cards?')) {
                this.savedCards = [];
                updateSavedList();
            }
        };

        // Initial card
        const initialCard = generateCard('visa');
        updateUI(initialCard);
    }

    _selectSavedCard(idx) {
        const card = this.savedCards[idx];
        this.currentType = card.scheme.toLowerCase();

        document.querySelectorAll('.mc-type-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`mc-btn-${this.currentType}`).classList.add('active');

        document.getElementById('mc-num').textContent = card.formatted;
        document.getElementById('mc-name').textContent = card.holder;
        document.getElementById('mc-exp').textContent = card.expiry;
        document.getElementById('mc-cvv').textContent = card.cvv;
        document.getElementById('mc-current-json').value = JSON.stringify(card, null, 2);
    }

    _removeSavedCard(idx) {
        this.savedCards.splice(idx, 1);
        document.getElementById('mc-saved-list').innerHTML = this.savedCards.map((card, i) => `
            <div class="mc-saved-card" onclick="window.currentTool._selectSavedCard(${i})">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <span style="font-weight: 700; font-size: 0.85rem;">${card.scheme}</span>
                    <button onclick="event.stopPropagation(); window.currentTool._removeSavedCard(${i})" class="btn btn-sm btn-outline" style="font-size: 0.65rem; padding: 4px 8px;">×</button>
                </div>
                <div style="font-family: var(--font-mono); font-size: 0.75rem; opacity: 0.8;">${card.formatted}</div>
                <div style="font-size: 0.7rem; opacity: 0.6; margin-top: 0.3rem;">${card.holder}</div>
            </div>
        `).join('');

        if (this.savedCards.length === 0) {
            document.getElementById('mc-saved-list').innerHTML = '<div style="text-align: center; opacity: 0.3; margin-top: 50px; font-size: 0.85rem;">No saved cards</div>';
            document.getElementById('mc-btn-export').disabled = true;
            document.getElementById('mc-btn-clear').disabled = true;
        }

        document.getElementById('mc-saved-count').textContent = this.savedCards.length;
    }

    // INTERNAL LOGIC (Formerly in DevTools.cardTools)

    _generateLuhn(prefix, length) {
        let ccNum = prefix;
        while (ccNum.length < (length - 1)) {
            ccNum += Math.floor(Math.random() * 10);
        }

        // Calculate check digit
        let sum = 0;
        let pos = 0;
        const reversedCC = ccNum.split('').reverse().join('');

        for (let i = 0; i < reversedCC.length; i++) {
            let digit = parseInt(reversedCC.charAt(i));
            if ((pos % 2) === 0) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            sum += digit;
            pos++;
        }

        const checkDigit = (10 - (sum % 10)) % 10;
        return ccNum + checkDigit;
    }

    _formatCardNumber(num) {
        return num.replace(/(\d{4})(?=\d)/g, '$1 ');
    }
}

window.initMockCreditCardLogic = MockCardStudioTool;
