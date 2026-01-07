/* TULPAR - Unit Converter Tool OOP Implementation */
class UnitConverterTool extends BaseTool {
    constructor(config) {
        super(config);
        this.isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        this.units = {
            length: [
                { value: 'mm', label: this.isTr ? 'Milimetre (mm)' : 'Millimeter (mm)' },
                { value: 'cm', label: this.isTr ? 'Santimetre (cm)' : 'Centimeter (cm)' },
                { value: 'm', label: this.isTr ? 'Metre (m)' : 'Meter (m)' },
                { value: 'km', label: this.isTr ? 'Kilometre (km)' : 'Kilometer (km)' },
                { value: 'inch', label: this.isTr ? 'İnç' : 'Inch' },
                { value: 'foot', label: this.isTr ? 'Fit' : 'Foot' },
                { value: 'yard', label: this.isTr ? 'Yarda' : 'Yard' },
                { value: 'mile', label: this.isTr ? 'Mil' : 'Mile' }
            ],
            weight: [
                { value: 'mg', label: this.isTr ? 'Miligram (mg)' : 'Milligram (mg)' },
                { value: 'g', label: this.isTr ? 'Gram (g)' : 'Gram (g)' },
                { value: 'kg', label: this.isTr ? 'Kilogram (kg)' : 'Kilogram (kg)' },
                { value: 'ton', label: 'Ton' },
                { value: 'oz', label: this.isTr ? 'Ons (oz)' : 'Ounce (oz)' },
                { value: 'lb', label: this.isTr ? 'Libre (lb)' : 'Pound (lb)' }
            ],
            temperature: [
                { value: 'C', label: this.isTr ? 'Santigrat (°C)' : 'Celsius (°C)' },
                { value: 'F', label: this.isTr ? 'Fahrenhayt (°F)' : 'Fahrenheit (°F)' },
                { value: 'K', label: 'Kelvin (K)' }
            ],
            data: [
                { value: 'B', label: this.isTr ? 'Bayt (B)' : 'Byte (B)' },
                { value: 'KB', label: this.isTr ? 'Kilobayt (KB)' : 'Kilobyte (KB)' },
                { value: 'MB', label: this.isTr ? 'Megabayt (MB)' : 'Megabyte (MB)' },
                { value: 'GB', label: this.isTr ? 'Gigabayt (GB)' : 'Gigabyte (GB)' },
                { value: 'TB', label: this.isTr ? 'Terabayt (TB)' : 'Terabyte (TB)' }
            ],
            area: [
                { value: 'sqm', label: this.isTr ? 'Metrekare (m²)' : 'Square Meter (m²)' },
                { value: 'sqkm', label: this.isTr ? 'Kilometrekare (km²)' : 'Square Kilometer (km²)' },
                { value: 'sqfoot', label: this.isTr ? 'Fitkare (ft²)' : 'Square Foot (ft²)' },
                { value: 'acre', label: this.isTr ? 'Akre' : 'Acre' },
                { value: 'hectare', label: 'Hektar' }
            ],
            volume: [
                { value: 'ml', label: this.isTr ? 'Mililitre (ml)' : 'Milliliter (ml)' },
                { value: 'l', label: this.isTr ? 'Litre (L)' : 'Liter (L)' },
                { value: 'gallon', label: 'Galon' },
                { value: 'cup', label: this.isTr ? 'Kupa' : 'Cup' },
                { value: 'pint', label: 'Pint' },
                { value: 'quart', label: this.isTr ? 'Çeyrek (Quart)' : 'Quart' }
            ],
            speed: [
                { value: 'mps', label: this.isTr ? 'Metre/saniye (m/s)' : 'Meters/sec (m/s)' },
                { value: 'kph', label: this.isTr ? 'Kilometre/saat (km/h)' : 'Kilometers/hour (km/h)' },
                { value: 'mph', label: this.isTr ? 'Mil/saat (mph)' : 'Miles/hour (mph)' },
                { value: 'knot', label: 'Knot' }
            ],
            currency: [
                { value: 'USD', label: 'US Dollar ($)' }, { value: 'EUR', label: 'Euro (€)' }, { value: 'TRY', label: 'Turkish Lira (₺)' },
                { value: 'GBP', label: 'British Pound (£)' }, { value: 'JPY', label: 'Japanese Yen (¥)' }, { value: 'CNY', label: 'Chinese Yuan (¥)' }
            ],
            kitchen: [
                { value: 'tsp', label: this.isTr ? 'Çay Kaşığı' : 'Teaspoon' },
                { value: 'tbsp', label: this.isTr ? 'Yemek Kaşığı' : 'Tablespoon' },
                { value: 'cup', label: this.isTr ? 'Su Bardağı' : 'Cup' },
                { value: 'ml', label: 'Milliliter' }
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
            const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
            const msgInvalid = isTr ? '✗ Geçersiz değer' : '✗ Invalid value';
            const msgCalculating = isTr ? '⏳ Hesaplanıyor...' : '⏳ Calculating...';
            const msgEstimates = isTr ? 'Tahmini kurlara göre' : 'Based on estimated rates';

            if (isNaN(val)) return updateStatus(msgInvalid, 'error');

            if (cat === 'currency') {
                status.textContent = msgCalculating;
                const res = await window.DevTools.unitConverter.convertCurrency(val, from, to);
                if (res.success) {
                    output.textContent = `${val} ${from} = ${res.result} ${to}`;
                    status.textContent = msgEstimates;
                }
            } else {
                const res = window.DevTools.unitConverter.convert(val, from, to, cat);
                if (res.success) {
                    output.textContent = `${val} ${from} = ${res.result} ${to}`;
                    status.textContent = isTr ? 'Dönüştürme başarılı' : 'Conversion successful';
                }
            }
        };

        const updateStatus = (msg, type) => {
            status.textContent = msg;
            status.style.color = type === 'error' ? 'var(--danger)' : 'var(--text-secondary)';
        };

        copyBtn.onclick = () => this.copyToClipboard(output.textContent);
        convertBtn.click();
    }
}

// Register tool
window.initUnitConverterLogic = UnitConverterTool;
