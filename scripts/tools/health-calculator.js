/* TULPAR - Health Intelligence Studio OOP Implementation */
class HealthCalculatorTool extends BaseTool {
    constructor(config) {
        super(config);
        this.currentMode = 'bmi';
    }

    renderUI() {
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const txt = isTr ? {
            title: 'Kişisel Sağlık Analiz Merkezi',
            modes: { age: 'Yaş & Burç', bmi: 'Vücut Kitle', cal: 'Kalori', water: 'Su', bf: 'Yağ Oranı' },
            calc: 'Analiz Et ✨',
            results: 'Analiz Sonuçları',
            inputs: {
                gender: 'Cinsiyet', male: 'Erkek', female: 'Kadın',
                age: 'Yaş', weight: 'Ağırlık (kg)', height: 'Boy (cm)',
                activity: 'Aktivite', actLevels: { sedentary: 'Hareketsiz', moderate: 'Orta Hareketli', elite: 'Çok Hareketli (Sporcu)' },
                neck: 'Boyun (cm)', waist: 'Bel (cm)', hip: 'Kalça (cm)',
                dob: 'Doğum Tarihi'
            },
            empty: {
                title: 'Kapsamlı sağlık analizi için verilerinizi girin',
                subtitle: 'Vücut Kitle Endeksi, Kalori İhtiyacı, Su Tüketimi ve daha fazlasını hesaplayın.'
            }
        } : {
            title: 'Personal Health Insights Center',
            modes: { age: 'Age & Zodiac', bmi: 'BMI', cal: 'Calories', water: 'Hydration', bf: 'Body Fat %' },
            calc: 'Analyze Data ✨',
            results: 'Diagnostic Results',
            inputs: {
                gender: 'Gender', male: 'Male', female: 'Female',
                age: 'Age', weight: 'Weight (kg)', height: 'Height (cm)',
                activity: 'Activity', actLevels: { sedentary: 'Sedentary', moderate: 'Moderate', elite: 'Elite Athlete' },
                neck: 'Neck (cm)', waist: 'Waist (cm)', hip: 'Hip (cm)',
                dob: 'Date of Birth'
            },
            empty: {
                title: 'Enter your data for a comprehensive health analysis',
                subtitle: 'Calculate BMI, Calorie needs, Hydration goals and more.'
            }
        };

        return `
        <div class="tool-content health-studio" style="max-width: 1100px; margin: 0 auto; padding: 20px;">
            <div class="grid-layout" style="display: grid; grid-template-columns: 320px 1fr; gap: 2.5rem;">
                
                <!-- Sidebar: Mode Selection & Input -->
                <div class="health-sidebar">
                    <div class="card" style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 20px; position: sticky; top: 20px;">
                        <h4 style="margin-bottom: 1.5rem; color: var(--primary); text-transform: uppercase; font-size: 0.85rem;">${txt.title}</h4>
                        
                        <div class="mode-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 2rem;">
                            <button id="hl-tab-bmi" class="btn btn-sm btn-primary">${txt.modes.bmi}</button>
                            <button id="hl-tab-cal" class="btn btn-sm btn-outline">${txt.modes.cal}</button>
                            <button id="hl-tab-water" class="btn btn-sm btn-outline">${txt.modes.water}</button>
                            <button id="hl-tab-bf" class="btn btn-sm btn-outline">${txt.modes.bf}</button>
                            <button id="hl-tab-age" class="btn btn-sm btn-outline" style="grid-column: span 2;">${txt.modes.age}</button>
                        </div>

                        <!-- Dynamic Inputs -->
                        <div id="hl-inputs">
                            <!-- BMI / Cal / BF Shared Inputs -->
                            <div id="hl-grp-common">
                                <div class="form-group"><label class="form-label">${txt.inputs.gender}</label><select id="hl-in-gen" class="form-select"><option value="male">${txt.inputs.male}</option><option value="female">${txt.inputs.female}</option></select></div>
                                <div class="form-group" id="hl-div-age"><label class="form-label">${txt.inputs.age}</label><input type="number" id="hl-in-age" class="form-input" value="25"></div>
                                <div class="form-group"><label class="form-label">${txt.inputs.weight}</label><input type="number" id="hl-in-w" class="form-input" value="70"></div>
                                <div class="form-group"><label class="form-label">${txt.inputs.height}</label><input type="number" id="hl-in-h" class="form-input" value="175"></div>
                            </div>
                            
                            <div id="hl-grp-cal" style="display:none;">
                                <div class="form-group"><label class="form-label">${txt.inputs.activity}</label><select id="hl-in-act" class="form-select"><option value="1.2">${txt.inputs.actLevels.sedentary}</option><option value="1.55">${txt.inputs.actLevels.moderate}</option><option value="1.9">${txt.inputs.actLevels.elite}</option></select></div>
                            </div>

                            <div id="hl-grp-bf" style="display:none;">
                                <div class="form-group"><label class="form-label">${txt.inputs.neck}</label><input type="number" id="hl-in-neck" class="form-input" value="38"></div>
                                <div class="form-group"><label class="form-label">${txt.inputs.waist}</label><input type="number" id="hl-in-waist" class="form-input" value="85"></div>
                                <div id="hl-div-hip" style="display:none;" class="form-group"><label class="form-label">${txt.inputs.hip}</label><input type="number" id="hl-in-hip" class="form-input" value="95"></div>
                            </div>

                            <div id="hl-grp-age" style="display:none;">
                                <div class="form-group"><label class="form-label">${txt.inputs.dob}</label><input type="date" id="hl-in-dob" class="form-input"></div>
                            </div>
                        </div>

                        <button id="hl-btn-run" class="btn btn-primary" style="width: 100%; margin-top: 1.5rem; font-weight: 700;">${txt.calc}</button>
                    </div>
                </div>

                <!-- Main Display: Dynamic Results -->
                <div class="health-main">
                    <div id="hl-res-empty" style="height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; opacity: 0.15; padding: 4rem; text-align: center;">
                        <div style="font-size: 5rem; margin-bottom: 2rem;">🏥</div>
                        <h3>${txt.empty.title}</h3>
                        <p>${txt.empty.subtitle}</p>
                    </div>

                    <div id="hl-res-cont" style="display: none;">
                        <div class="card" style="padding: 2.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 24px; text-align: center;">
                            <h5 style="text-transform: uppercase; font-size: 0.75rem; letter-spacing: 2px; color: var(--primary); margin-bottom: 1.5rem;">${txt.results}</h5>
                            <div id="hl-res-val" style="font-size: 4rem; font-weight: 900; line-height: 1; margin-bottom: 10px;"></div>
                            <div id="hl-res-sub" style="font-size: 1.25rem; font-weight: 600; opacity: 0.7; margin-bottom: 2rem;"></div>
                            
                            <div id="hl-res-stats" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; border-top: 1px solid var(--border-color); padding-top: 2rem; margin-top: 2rem;">
                                <!-- Dynamic Stat Cards -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    setupListeners() {
        const tabs = { bmi: document.getElementById('hl-tab-bmi'), cal: document.getElementById('hl-tab-cal'), water: document.getElementById('hl-tab-water'), bf: document.getElementById('hl-tab-bf'), age: document.getElementById('hl-tab-age') };
        const btnRun = document.getElementById('hl-btn-run');
        const empty = document.getElementById('hl-res-empty');
        const cont = document.getElementById('hl-res-cont');

        const switchMode = (mode) => {
            this.currentMode = mode;
            Object.values(tabs).forEach(t => t.classList.replace('btn-primary', 'btn-outline'));
            tabs[mode].classList.replace('btn-outline', 'btn-primary');

            // Toggle input groups
            document.getElementById('hl-grp-common').style.display = mode === 'age' ? 'none' : 'block';
            document.getElementById('hl-div-age').style.display = (mode === 'bmi' || mode === 'water') ? 'none' : 'block';
            document.getElementById('hl-grp-cal').style.display = mode === 'cal' ? 'block' : 'none';
            document.getElementById('hl-grp-bf').style.display = mode === 'bf' ? 'block' : 'none';
            document.getElementById('hl-grp-age').style.display = mode === 'age' ? 'block' : 'none';

            this._checkHip();
        };

        Object.keys(tabs).forEach(k => tabs[k].onclick = () => switchMode(k));
        document.getElementById('hl-in-gen').onchange = () => this._checkHip();

        btnRun.onclick = () => {
            empty.style.display = 'none';
            cont.style.display = 'block';
            this._calculate();
        };
    }

    _checkHip() {
        const isFemale = document.getElementById('hl-in-gen').value === 'female';
        document.getElementById('hl-div-hip').style.display = (this.currentMode === 'bf' && isFemale) ? 'block' : 'none';
    }

    _calculate() {
        const hc = window.DevTools.healthCalculator;
        const resVal = document.getElementById('hl-res-val');
        const resSub = document.getElementById('hl-res-sub');
        const resStats = document.getElementById('hl-res-stats');

        const w = parseFloat(document.getElementById('hl-in-w').value);
        const h = parseFloat(document.getElementById('hl-in-h').value);
        const age = parseInt(document.getElementById('hl-in-age').value);
        const gender = document.getElementById('hl-in-gen').value;

        resStats.innerHTML = '';

        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';

        if (this.currentMode === 'bmi') {
            const res = hc.calculateBMI(w, h, gender);
            resVal.textContent = res.bmi;
            // Simple translation for BMI categories if needed
            let cat = res.category;
            if (isTr) {
                if (cat === 'Underweight') cat = 'Zayıf';
                else if (cat === 'Normal weight') cat = 'Normal';
                else if (cat === 'Overweight') cat = 'Kilolu';
                else if (cat === 'Obese') cat = 'Obez';
            }
            resSub.textContent = cat;
            this._addStat(isTr ? 'İdeal Kilo' : 'Ideal Weight', `${res.idealWeightTarget} kg`);
            this._addStat(isTr ? 'Sağlıklı Aralık' : 'Healthy Range', res.idealWeightRange);
            this._addStat(isTr ? 'Metrik' : 'Metric', `${w}kg @ ${h}cm`);
        } else if (this.currentMode === 'cal') {
            const act = parseFloat(document.getElementById('hl-in-act').value);
            const res = hc.calculateCalories(w, h, age, gender, act);
            resVal.textContent = res.tdee;
            resVal.style.fontSize = '3rem';
            resSub.textContent = isTr ? 'Kalori / Gün' : 'Calories / Day';
            this._addStat('BMR', res.bmr);
            this._addStat(isTr ? 'Kilo Verme' : 'Loss', res.weightLoss);
            this._addStat(isTr ? 'Kilo Alma' : 'Gain', res.weightGain);
            this._addStat('Protein', res.macros.protein + 'g');
        } else if (this.currentMode === 'water') {
            const res = hc.calculateWaterIntake(w, 30);
            resVal.textContent = res.liters + ' L';
            resSub.textContent = isTr ? 'Günlük Su İhtiyacı' : 'Daily Hydration';
            this._addStat(isTr ? 'Bardak' : 'Glasses', res.glasses);
            this._addStat(isTr ? 'Mililitre' : 'Milliliters', res.ml);
        } else if (this.currentMode === 'bf') {
            const neck = parseFloat(document.getElementById('hl-in-neck').value);
            const waist = parseFloat(document.getElementById('hl-in-waist').value);
            const hip = parseFloat(document.getElementById('hl-in-hip').value);
            const res = hc.calculateBodyFat(gender, w, h, neck, waist, hip);
            resVal.textContent = res.bodyFat;
            let cat = res.category;
            if (isTr) {
                if (cat === 'Essential fat') cat = 'Hayati Yağ';
                else if (cat === 'Athletes') cat = 'Sporcu';
                else if (cat === 'Fitness') cat = 'Fitness';
                else if (cat === 'Average') cat = 'Ortalama';
                else if (cat === 'Obese') cat = 'Obez';
            }
            resSub.textContent = cat;
            this._addStat(isTr ? 'Yöntem' : 'Method', 'US Navy');
        } else if (this.currentMode === 'age') {
            const dob = document.getElementById('hl-in-dob').value;
            if (!dob) return;
            const res = hc.calculateAge(dob);
            resVal.textContent = res.years;
            resSub.textContent = isTr ? 'Yaşında' : 'Years Old';

            // Translate Zodiac Signs
            let zodiacName = res.zodiac;
            if (isTr) {
                const zodiacMap = {
                    'Capricorn': 'Oğlak', 'Aquarius': 'Kova', 'Pisces': 'Balık', 'Aries': 'Koç',
                    'Taurus': 'Boğa', 'Gemini': 'İkizler', 'Cancer': 'Yengeç', 'Leo': 'Aslan',
                    'Virgo': 'Başak', 'Libra': 'Terazi', 'Scorpio': 'Akrep', 'Sagittarius': 'Yay'
                };
                zodiacName = zodiacMap[res.zodiac] || res.zodiac;
            }

            this._addStat(isTr ? 'Burç' : 'Zodiac', zodiacName);
            this._addStat(isTr ? 'Toplam Gün' : 'Total Days', res.totalDays);
            this._addStat(isTr ? 'Doğum Gününe Kalan' : 'Days to Bday', res.nextBirthday);
        }
    }

    _addStat(label, val) {
        const div = document.createElement('div');
        div.style.cssText = 'padding: 1rem; background: rgba(0,0,0,0.1); border-radius: 12px;';
        div.innerHTML = `<span style="display: block; font-size: 0.65rem; text-transform: uppercase; opacity: 0.5; margin-bottom: 5px;">${label}</span><strong style="font-size: 1.1rem;">${val}</strong>`;
        document.getElementById('hl-res-stats').appendChild(div);
    }
}

// Register tool
window.initHealthCalculatorLogic = HealthCalculatorTool;
