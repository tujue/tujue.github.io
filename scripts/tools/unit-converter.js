/* TULPAR - Unit Converter Tool OOP Implementation */
class UnitConverterTool extends BaseTool {
    constructor(config) {
        super(config);
        this.isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        this.setupData();
    }

    setupData() {
        this.units = {
            length: [
                { value: 'mm', label: this.isTr ? 'Milimetre (mm)' : 'Millimeter (mm)', factor: 0.001 },
                { value: 'cm', label: this.isTr ? 'Santimetre (cm)' : 'Centimeter (cm)', factor: 0.01 },
                { value: 'm', label: this.isTr ? 'Metre (m)' : 'Meter (m)', factor: 1 },
                { value: 'km', label: this.isTr ? 'Kilometre (km)' : 'Kilometer (km)', factor: 1000 },
                { value: 'inch', label: this.isTr ? 'İnç' : 'Inch', factor: 0.0254 },
                { value: 'foot', label: this.isTr ? 'Fit' : 'Foot', factor: 0.3048 },
                { value: 'yard', label: this.isTr ? 'Yarda' : 'Yard', factor: 0.9144 },
                { value: 'mile', label: this.isTr ? 'Mil' : 'Mile', factor: 1609.34 }
            ],
            weight: [
                { value: 'mg', label: this.isTr ? 'Miligram (mg)' : 'Milligram (mg)', factor: 0.001 },
                { value: 'g', label: this.isTr ? 'Gram (g)' : 'Gram (g)', factor: 1 },
                { value: 'kg', label: this.isTr ? 'Kilogram (kg)' : 'Kilogram (kg)', factor: 1000 },
                { value: 'ton', label: 'Ton', factor: 1000000 },
                { value: 'oz', label: this.isTr ? 'Ons (oz)' : 'Ounce (oz)', factor: 28.3495 },
                { value: 'lb', label: this.isTr ? 'Libre (lb)' : 'Pound (lb)', factor: 453.592 }
            ],
            temperature: [
                { value: 'C', label: this.isTr ? 'Santigrat (°C)' : 'Celsius (°C)' },
                { value: 'F', label: this.isTr ? 'Fahrenhayt (°F)' : 'Fahrenheit (°F)' },
                { value: 'K', label: 'Kelvin (K)' }
            ],
            data: [
                { value: 'B', label: this.isTr ? 'Bayt (B)' : 'Byte (B)', factor: 1 },
                { value: 'KB', label: this.isTr ? 'Kilobayt (KB)' : 'Kilobyte (KB)', factor: 1024 },
                { value: 'MB', label: this.isTr ? 'Megabayt (MB)' : 'Megabyte (MB)', factor: 1048576 },
                { value: 'GB', label: this.isTr ? 'Gigabayt (GB)' : 'Gigabyte (GB)', factor: 1073741824 },
                { value: 'TB', label: this.isTr ? 'Terabayt (TB)' : 'Terabyte (TB)', factor: 1099511627776 }
            ],
            area: [
                { value: 'sqm', label: this.isTr ? 'Metrekare (m²)' : 'Square Meter (m²)', factor: 1 },
                { value: 'sqkm', label: this.isTr ? 'Kilometrekare (km²)' : 'Square Kilometer (km²)', factor: 1000000 },
                { value: 'sqfoot', label: this.isTr ? 'Fitkare (ft²)' : 'Square Foot (ft²)', factor: 0.092903 },
                { value: 'acre', label: this.isTr ? 'Akre' : 'Acre', factor: 4046.86 },
                { value: 'hectare', label: 'Hektar', factor: 10000 }
            ],
            volume: [
                { value: 'ml', label: this.isTr ? 'Mililitre (ml)' : 'Milliliter (ml)', factor: 0.001 },
                { value: 'l', label: this.isTr ? 'Litre (L)' : 'Liter (L)', factor: 1 },
                { value: 'gallon', label: 'Galon', factor: 3.78541 },
                { value: 'cup', label: this.isTr ? 'Kupa' : 'Cup', factor: 0.236588 },
                { value: 'pint', label: 'Pint', factor: 0.473176 },
                { value: 'quart', label: this.isTr ? 'Çeyrek (Quart)' : 'Quart', factor: 0.946353 }
            ],
            speed: [
                { value: 'mps', label: this.isTr ? 'Metre/saniye (m/s)' : 'Meters/sec (m/s)', factor: 1 },
                { value: 'kph', label: this.isTr ? 'Kilometre/saat (km/h)' : 'Kilometers/hour (km/h)', factor: 0.277778 },
                { value: 'mph', label: this.isTr ? 'Mil/saat (mph)' : 'Miles/hour (mph)', factor: 0.44704 },
                { value: 'knot', label: 'Knot', factor: 0.514444 }
            ],
            currency: [
                { value: 'USD', label: 'US Dollar ($)' }, { value: 'EUR', label: 'Euro (€)' }, { value: 'TRY', label: 'Turkish Lira (₺)' },
                { value: 'GBP', label: 'British Pound (£)' }, { value: 'JPY', label: 'Japanese Yen (¥)' }, { value: 'CNY', label: 'Chinese Yuan (¥)' }
            ],
            kitchen: [
                { value: 'tsp', label: this.isTr ? 'Çay Kaşığı' : 'Teaspoon', factor: 4.92892 },
                { value: 'tbsp', label: this.isTr ? 'Yemek Kaşığı' : 'Tablespoon', factor: 14.7868 },
                { value: 'cup', label: this.isTr ? 'Su Bardağı' : 'Cup', factor: 236.588 },
                { value: 'ml', label: 'Milliliter', factor: 1 } // Base unit
            ]
        };
    }

    renderUI() {
        const isTr = this.isTr;
        const txt = isTr ? {
            category: 'Kategori', from: 'Giriş', to: 'Çıkış', value: 'Değer', convert: 'Dönüştür', result: 'Sonuç'
        } : {
            category: 'Category', from: 'From', to: 'To', value: 'Value', convert: 'Convert', result: 'Result'
        };

        const categories = [
            { id: 'length', name: isTr ? 'Uzunluk' : 'Length', icon: '📏' },
            { id: 'weight', name: isTr ? 'Ağırlık' : 'Weight', icon: '⚖️' },
            { id: 'temperature', name: isTr ? 'Sıcaklık' : 'Temperature', icon: '🌡️' },
            { id: 'data', name: isTr ? 'Veri' : 'Data', icon: '💾' },
            { id: 'area', name: isTr ? 'Alan' : 'Area', icon: '🗺️' },
            { id: 'volume', name: isTr ? 'Hacim' : 'Volume', icon: '🧪' },
            { id: 'speed', name: isTr ? 'Hız' : 'Speed', icon: '🚀' },
            { id: 'currency', name: isTr ? 'Para' : 'Currency', icon: '💰' },
            { id: 'kitchen', name: isTr ? 'Mutfak' : 'Kitchen', icon: '🍳' }
        ];

        return `
        <div class="tool-content" style="max-width: 800px; margin: 0 auto; padding: 20px;">
            <div class="card" style="padding: 2rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 12px;">
                <div class="form-group">
                    <label class="form-label">${txt.category}</label>
                    <select id="unit-category" class="form-select" style="font-size: 1.1rem; padding: 12px;">
                        ${categories.map(c => `<option value="${c.id}">${c.icon} ${c.name}</option>`).join('')}
                    </select>
                </div>

                <div class="grid-layout" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 1.5rem;">
                    <div class="form-group"><label class="form-label">${txt.from}</label><select id="unit-from" class="form-select"></select></div>
                    <div class="form-group"><label class="form-label">${txt.to}</label><select id="unit-to" class="form-select"></select></div>
                </div>

                <div class="form-group" style="margin-top: 1.5rem;">
                    <label class="form-label">${txt.value}</label>
                    <div style="display: flex; gap: 10px;">
                        <input type="number" id="unit-value" class="form-input" value="1" step="any" style="flex: 1; font-weight: bold;">
                        <button id="unit-convert-btn" class="btn btn-primary" style="padding: 0 2rem;">🔄 ${txt.convert}</button>
                    </div>
                </div>

                <div id="unit-result-box" class="card" style="margin-top: 2rem; border: none; background: var(--bg-primary); padding: 1.5rem; text-align: center;">
                    <div style="opacity: 0.7; font-size: 0.85rem; margin-bottom: 0.5rem; text-transform: uppercase;">${txt.result}</div>
                    <div id="unit-output" style="font-size: 1.8rem; font-weight: 800; color: var(--primary); margin-bottom: 1rem;">-</div>
                    <button id="copy-unit-btn" class="btn btn-sm btn-outline">📋 Copy Result</button>
                    <div id="unit-status" style="margin-top: 10px; font-size: 0.8rem; height: 1.5rem; color: var(--text-secondary);"></div>
                </div>
            </div>
        </div>
        `;
    }

    setupListeners() {
        const catSelect = document.getElementById('unit-category');
        const fromSelect = document.getElementById('unit-from');
        const toSelect = document.getElementById('unit-to');
        const valInput = document.getElementById('unit-value');
        const convertBtn = document.getElementById('unit-convert-btn');
        const output = document.getElementById('unit-output');
        const status = document.getElementById('unit-status');
        const copyBtn = document.getElementById('copy-unit-btn');

        const updateOptions = (cat) => {
            const list = this.units[cat] || [];
            fromSelect.innerHTML = ''; toSelect.innerHTML = '';
            list.forEach(u => {
                fromSelect.add(new Option(u.label, u.value));
                toSelect.add(new Option(u.label, u.value));
            });
            if (list.length > 1) toSelect.selectedIndex = 1;
        };

        catSelect.onchange = () => updateOptions(catSelect.value);
        updateOptions(catSelect.value);

        convertBtn.onclick = async () => {
            const val = parseFloat(valInput.value);
            const from = fromSelect.value;
            const to = toSelect.value;
            const cat = catSelect.value;

            // Localization helpers
            const isTr = this.isTr;
            const msgInvalid = isTr ? '✗ Geçersiz değer' : '✗ Invalid value';
            const msgCalculating = isTr ? '⏳ Hesaplanıyor...' : '⏳ Calculating...';
            const msgEstimates = isTr ? 'Tahmini kurlara göre' : 'Based on estimated rates';

            if (isNaN(val)) {
                status.textContent = msgInvalid;
                status.style.color = 'var(--danger)';
                return;
            }

            if (cat === 'currency') {
                status.textContent = msgCalculating;
                const res = await this.convertCurrency(val, from, to);
                if (res.success) {
                    output.textContent = `${val} ${from} = ${res.result} ${to}`;
                    status.textContent = msgEstimates;
                    status.style.color = 'var(--text-secondary)';
                } else {
                    status.textContent = isTr ? 'Hata oluştu' : 'Error occurred';
                }
            } else {
                const res = this.convert(val, from, to, cat);
                if (res.success) {
                    output.textContent = `${val} ${from} = ${res.result} ${to}`;
                    status.textContent = isTr ? 'Dönüştürme başarılı' : 'Conversion successful';
                    status.style.color = 'var(--text-secondary)';
                }
            }
        };

        copyBtn.onclick = () => this.copyToClipboard(output.textContent);
        convertBtn.click();
    }

    // INTERNAL LOGIC (Previously in dev-tools-core.js)

    convert(value, fromUnit, toUnit, category) {
        // Temperature is special
        if (category === 'temperature') {
            return this.convertTemperature(value, fromUnit, toUnit);
        }

        // Standard conversions using factors
        const units = this.units[category];
        const fromData = units.find(u => u.value === fromUnit);
        const toData = units.find(u => u.value === toUnit);

        if (!fromData || !toData) return { success: false };

        // Convert to base unit then to target unit
        // value * fromFactor / toFactor
        const baseValue = value * fromData.factor;
        const result = baseValue / toData.factor;

        // Format result (max 6 decimals, remove trailing zeros)
        const formatted = parseFloat(result.toFixed(6));
        return { success: true, result: formatted };
    }

    convertTemperature(value, from, to) {
        let celsius;
        // Convert to Celsius first
        if (from === 'C') celsius = value;
        else if (from === 'F') celsius = (value - 32) * 5 / 9;
        else if (from === 'K') celsius = value - 273.15;

        let result;
        // Convert from Celsius to target
        if (to === 'C') result = celsius;
        else if (to === 'F') result = (celsius * 9 / 5) + 32;
        else if (to === 'K') result = celsius + 273.15;

        return { success: true, result: parseFloat(result.toFixed(2)) };
    }

    async convertCurrency(amount, from, to) {
        // Use a free API fallback or hardcoded estimates
        // For privacy/offline reasons, we will use hardcoded estimates for now
        // Ideally this should fetch from an API if online

        const rates = {
            USD: 1,
            EUR: 0.95,
            GBP: 0.80,
            TRY: 35.50, // Needs regular update
            JPY: 154,
            CNY: 7.25
        };

        const result = (amount / rates[from]) * rates[to];
        return { success: true, result: result.toFixed(2) };
    }
}

// Register tool
window.initUnitConverterLogic = UnitConverterTool;
