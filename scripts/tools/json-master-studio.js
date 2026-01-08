/* TULPAR - JSON Master Studio OOP Implementation */
class JSONMasterTool extends BaseTool {
    constructor(config) {
        super(config);
        this.currentTab = 'format';
    }

    renderUI() {
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const txt = isTr ? {
            tabs: { format: 'Format & Validasyon', convert: 'JSON <> CSV', xml: 'JSON <> XML', sql: 'JSON -> SQL', typegen: 'Model Oluşturucu' },
            format: { beautify: 'Güzelleştir', minify: 'Sıkıştır', validate: 'Doğrula', clear: 'Temizle', placeholder: 'JSON buraya yapıştırın...' },
            convert: { j2c: 'JSON -> CSV', c2j: 'CSV -> JSON' },
            xml: { j2x: 'JSON -> XML', x2j: 'XML -> JSON' },
            sql: { j2s: 'JSON -> SQL', tableName: 'Tablo Adı:' },
            typegen: { target: 'Hedef Dil:', root: 'Kök Sınıf:', generate: 'Kod Üret ⚡' },
            copy: 'Kopyala'
        } : {
            tabs: { format: 'Format & Validate', convert: 'JSON <> CSV', xml: 'JSON <> XML', sql: 'JSON -> SQL', typegen: 'Type Generator' },
            format: { beautify: 'Beautify', minify: 'Minify', validate: 'Validate', clear: 'Clear', placeholder: 'Paste JSON here...' },
            convert: { j2c: 'JSON to CSV', c2j: 'CSV to JSON' },
            xml: { j2x: 'JSON -> XML', x2j: 'XML -> JSON' },
            sql: { j2s: 'JSON -> SQL', tableName: 'Table Name:' },
            typegen: { target: 'Target:', root: 'Root Name:', generate: 'Generate Types ⚡' },
            copy: 'Copy'
        };

        return `
        <div class="tool-content jms-studio" style="height: 100%; min-height: 600px; display: flex; flex-direction: column; padding: 10px;">
            <!-- Studio Tabs -->
            <div class="studio-tabs" style="display: flex; gap: 8px; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid var(--border-color); overflow-x: auto;">
                ${Object.entries(txt.tabs).map(([id, label]) => `
                    <button id="jms-tab-${id}" class="btn ${id === 'format' ? 'btn-primary' : 'btn-outline'} btn-sm jms-tab-btn" data-tab="${id}">${label}</button>
                `).join('')}
            </div>

            <!-- View: Format & Validate -->
            <div id="jms-view-format" class="jms-view" style="flex: 1; display: flex; flex-direction: column; min-height: 0;">
                <div style="display: flex; gap: 10px; margin-bottom: 15px; flex-wrap: wrap;">
                    <button id="js-btn-beautify" class="btn btn-primary flex-1">✨ ${txt.format.beautify}</button>
                    <button id="js-btn-minify" class="btn btn-secondary flex-1">🗜️ ${txt.format.minify}</button>
                    <button id="js-btn-validate" class="btn btn-success flex-1">✅ ${txt.format.validate}</button>
                    <button id="js-btn-clear" class="btn btn-outline" style="color: var(--danger); border-color: var(--danger);">${txt.format.clear}</button>
                </div>
                <div style="flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; min-height: 400px;">
                    <textarea id="js-fmt-input" class="form-input" style="height: 100%; min-height: 100%; font-family: var(--font-mono); font-size: 0.9rem; resize: none;" placeholder="${txt.format.placeholder}"></textarea>
                    <div style="position: relative; height: 100%;">
                        <textarea id="js-fmt-output" class="form-input" style="height: 100%; min-height: 100%; font-family: var(--font-mono); font-size: 0.9rem; background: rgba(0,0,0,0.1); resize: none;" readonly></textarea>
                        <button id="js-fmt-copy" class="btn btn-sm btn-primary" style="position: absolute; top: 10px; right: 10px;">📋 ${txt.copy}</button>
                    </div>
                </div>
                <div id="js-fmt-status" style="margin-top: 8px; font-size: 0.85rem; min-height: 1.2rem;"></div>
            </div>

            <!-- View: Convert -->
            <div id="jms-view-convert" class="jms-view" style="flex: 1; display: none; flex-direction: column; min-height: 0;">
                <div style="display: flex; gap: 15px; justify-content: center; margin-bottom: 15px;">
                    <button id="js-btn-j2c" class="btn btn-primary" style="min-width: 200px;">${txt.convert.j2c} ➡️</button>
                    <button id="js-btn-c2j" class="btn btn-primary" style="min-width: 200px;">⬅️ ${txt.convert.c2j}</button>
                </div>
                
                <div style="display: flex; gap: 20px; justify-content: center; margin-bottom: 15px; font-size: 0.85rem; padding: 10px; background: rgba(0,0,0,0.1); border-radius: 8px;">
                     <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                        <input type="checkbox" id="js-opt-header" checked> Include Header
                     </label>
                     <div style="display: flex; align-items: center; gap: 6px;">
                        <span>Delimiter:</span>
                        <select id="js-opt-delim" class="form-select" style="height: 24px; padding: 0 5px; font-size: 0.8rem; width: auto;">
                            <option value=",">Comma (,)</option>
                            <option value=";">Semicolon (;)</option>
                            <option value="|">Pipe (|)</option>
                            <option value="\t">Tab</option>
                        </select>
                     </div>
                </div>

                <div style="flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; min-height: 400px;">
                    <div style="display: flex; flex-direction: column; height: 100%;">
                        <label class="form-label" style="opacity: 0.5; font-size: 0.75rem; text-transform: uppercase;">JSON</label>
                        <textarea id="js-cv-json" class="form-input" style="flex: 1; min-height: 0; font-family: var(--font-mono); resize: none;" placeholder='[ {"name": "Test", "val": 1} ]'></textarea>
                    </div>
                    <div style="display: flex; flex-direction: column; height: 100%; position: relative;">
                        <label class="form-label" style="opacity: 0.5; font-size: 0.75rem; text-transform: uppercase;">CSV</label>
                        <textarea id="js-cv-csv" class="form-input" style="flex: 1; min-height: 0; font-family: var(--font-mono); resize: none;" placeholder="name,val&#10;Test,1"></textarea>
                        <button id="js-csv-copy" class="btn btn-sm btn-primary" style="position: absolute; top: 30px; right: 10px;">📋 ${txt.copy}</button>
                    </div>
                </div>
            </div>

            <!-- View: XML Converter -->
            <div id="jms-view-xml" class="jms-view" style="flex: 1; display: none; flex-direction: column; min-height: 0;">
                <div style="display: flex; gap: 15px; justify-content: center; margin-bottom: 15px;">
                    <button id="js-btn-j2x" class="btn btn-primary" style="min-width: 200px;">${txt.xml.j2x} ➡️</button>
                    <button id="js-btn-x2j" class="btn btn-primary" style="min-width: 200px;">⬅️ ${txt.xml.x2j}</button>
                </div>
                <div style="flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; min-height: 400px;">
                    <div style="display: flex; flex-direction: column; height: 100%;">
                        <label class="form-label" style="opacity: 0.5; font-size: 0.75rem; text-transform: uppercase;">JSON</label>
                        <textarea id="js-xml-json" class="form-input" style="flex: 1; min-height: 0; font-family: var(--font-mono); resize: none;" placeholder='{"key": "value"}'></textarea>
                    </div>
                    <div style="display: flex; flex-direction: column; height: 100%; position: relative;">
                        <label class="form-label" style="opacity: 0.5; font-size: 0.75rem; text-transform: uppercase;">XML</label>
                        <textarea id="js-xml-xml" class="form-input" style="flex: 1; min-height: 0; font-family: var(--font-mono); resize: none;" placeholder="<root>...</root>"></textarea>
                        <button id="js-xml-copy" class="btn btn-sm btn-primary" style="position: absolute; top: 30px; right: 10px;">📋 ${txt.copy}</button>
                    </div>
                </div>
            </div>

            <!-- View: SQL Converter -->
            <div id="jms-view-sql" class="jms-view" style="flex: 1; display: none; flex-direction: column; min-height: 0;">
                <div style="display: flex; gap: 15px; align-items: flex-end; margin-bottom: 15px; padding: 15px; background: rgba(0,0,0,0.1); border-radius: 8px;">
                    <div style="flex: 1;">
                        <label class="form-label">${txt.sql.tableName}</label>
                        <input type="text" id="js-sql-table" class="form-input" value="table_name" placeholder="table_name">
                    </div>
                    <button id="js-btn-j2s" class="btn btn-primary" style="min-width: 200px; height: 42px;">${txt.sql.j2s} ⚡</button>
                </div>
                <div style="flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; min-height: 400px;">
                    <div style="display: flex; flex-direction: column; height: 100%;">
                        <label class="form-label" style="opacity: 0.5; font-size: 0.75rem; text-transform: uppercase;">JSON Array</label>
                        <textarea id="js-sql-json" class="form-input" style="flex: 1; min-height: 0; font-family: var(--font-mono); resize: none;" placeholder='[{"id": 1, "name": "Test"}]'></textarea>
                    </div>
                    <div style="display: flex; flex-direction: column; height: 100%; position: relative;">
                        <label class="form-label" style="opacity: 0.5; font-size: 0.75rem; text-transform: uppercase;">SQL INSERT</label>
                        <textarea id="js-sql-output" class="form-input" style="flex: 1; min-height: 0; font-family: var(--font-mono); resize: none; background: rgba(0,0,0,0.1);" readonly></textarea>
                        <button id="js-sql-copy" class="btn btn-sm btn-primary" style="position: absolute; top: 30px; right: 10px;">📋 ${txt.copy}</button>
                    </div>
                </div>
            </div>

            <!-- View: TypeGen -->
            <div id="jms-view-typegen" class="jms-view" style="flex: 1; display: none; flex-direction: column; min-height: 0;">
                <div class="card" style="padding: 1rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 15px; display: flex; gap: 15px; align-items: flex-end; flex-wrap: wrap;">
                    <div style="flex: 1; min-width: 150px;">
                        <label class="form-label">${txt.typegen.target}</label>
                        <select id="js-tg-lang" class="form-select">
                            <option value="ts">TypeScript</option>
                            <option value="go">Go Struct</option>
                            <option value="csharp">C# Class</option>
                            <option value="java">Java POJO</option>
                            <option value="python">Python Dataclass</option>
                        </select>
                    </div>
                    <div style="flex: 1; min-width: 150px;">
                        <label class="form-label">${txt.typegen.root}</label>
                        <input type="text" id="js-tg-root" class="form-input" value="RootObject">
                    </div>
                    <button id="js-tg-gen" class="btn btn-primary" style="height: 42px; flex: 1; min-width: 120px;">${txt.typegen.generate}</button>
                </div>
                <div style="flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; min-height: 400px;">
                    <textarea id="js-tg-input" class="form-input" style="height: 100%; min-height: 100%; font-family: var(--font-mono); resize: none;" placeholder="Paste JSON here..."></textarea>
                    <div style="position: relative; height: 100%;">
                        <textarea id="js-tg-output" class="form-input" style="height: 100%; min-height: 100%; font-family: var(--font-mono); font-size: 0.85rem; background: rgba(0,0,0,0.1); resize: none;" readonly></textarea>
                        <button id="js-tg-copy" class="btn btn-sm btn-primary" style="position: absolute; top: 10px; right: 10px;">📋 ${txt.copy}</button>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    setupListeners() {
        const tabBtns = document.querySelectorAll('.jms-tab-btn');
        const views = {
            format: document.getElementById('jms-view-format'),
            convert: document.getElementById('jms-view-convert'),
            xml: document.getElementById('jms-view-xml'),
            sql: document.getElementById('jms-view-sql'),
            typegen: document.getElementById('jms-view-typegen')
        };

        const showNotification = window.showNotification || ((msg) => alert(msg));

        tabBtns.forEach(btn => {
            btn.onclick = () => {
                const tab = btn.dataset.tab;
                tabBtns.forEach(b => b.classList.replace('btn-primary', 'btn-outline'));
                btn.classList.replace('btn-outline', 'btn-primary');
                Object.entries(views).forEach(([id, view]) => {
                    view.style.display = id === tab ? 'flex' : 'none';
                });
            };
        });

        // Format Logic
        const fmtInput = document.getElementById('js-fmt-input');
        const fmtOutput = document.getElementById('js-fmt-output');
        const fmtStatus = document.getElementById('js-fmt-status');

        document.getElementById('js-btn-beautify').onclick = () => {
            try {
                const obj = JSON.parse(fmtInput.value);
                fmtOutput.value = JSON.stringify(obj, null, 2);
                fmtStatus.textContent = '✅ Valid & Formatted';
                fmtStatus.style.color = 'var(--success)';
            } catch (e) {
                fmtStatus.textContent = '❌ Error: ' + e.message;
                fmtStatus.style.color = 'var(--danger)';
            }
        };

        document.getElementById('js-btn-minify').onclick = () => {
            try {
                const obj = JSON.parse(fmtInput.value);
                fmtOutput.value = JSON.stringify(obj);
                fmtStatus.textContent = '✅ Valid & Minified';
                fmtStatus.style.color = 'var(--success)';
            } catch (e) {
                fmtStatus.textContent = '❌ Error: ' + e.message;
                fmtStatus.style.color = 'var(--danger)';
            }
        };

        document.getElementById('js-btn-validate').onclick = () => {
            if (!fmtInput.value.trim()) {
                fmtStatus.textContent = '⚠️ Please enter valid JSON';
                fmtStatus.style.color = 'var(--text-secondary)';
                return;
            }
            try {
                const parsed = JSON.parse(fmtInput.value);
                fmtOutput.value = JSON.stringify(parsed, null, 2);
                fmtStatus.innerHTML = '✅ <b>Valid JSON</b>';
                fmtStatus.style.color = '#10b981';
                showNotification('Valid JSON', 'success');
            } catch (e) {
                fmtStatus.innerHTML = `❌ <b>Invalid JSON:</b> ${e.message}`;
                fmtStatus.style.color = '#ef4444';
                showNotification('Invalid JSON', 'error');
            }
        };

        document.getElementById('js-btn-clear').onclick = () => {
            fmtInput.value = ''; fmtOutput.value = ''; fmtStatus.textContent = '';
        };

        document.getElementById('js-fmt-copy').onclick = () => this.copyToClipboard(fmtOutput.value);

        // Convert Logic
        const cvJson = document.getElementById('js-cv-json');
        const cvCsv = document.getElementById('js-cv-csv');

        document.getElementById('js-btn-j2c').onclick = () => {
            const opts = {
                header: document.getElementById('js-opt-header').checked,
                delimiter: document.getElementById('js-opt-delim').value
            };
            const res = this.jsonToCsv(cvJson.value, opts);
            if (res.success) cvCsv.value = res.result;
            else showNotification(res.message, 'error');
        };

        document.getElementById('js-btn-c2j').onclick = () => {
            const opts = {
                header: document.getElementById('js-opt-header').checked,
                delimiter: document.getElementById('js-opt-delim').value
            };
            const res = this.csvToJson(cvCsv.value, opts);
            if (res.success) cvJson.value = res.result;
            else showNotification(res.message, 'error');
        };

        document.getElementById('js-csv-copy').onclick = () => this.copyToClipboard(cvCsv.value);

        // TypeGen Logic
        const tgInput = document.getElementById('js-tg-input');
        const tgOutput = document.getElementById('js-tg-output');
        const tgLang = document.getElementById('js-tg-lang');
        const tgRoot = document.getElementById('js-tg-root');

        document.getElementById('js-tg-gen').onclick = () => {
            try {
                if (!tgInput.value.trim()) {
                    showNotification('Please enter JSON to generate types', 'warning');
                    tgOutput.value = '';
                    return;
                }
                const results = this.generateTypes(tgInput.value, tgRoot.value || 'Root', tgLang.value);
                tgOutput.value = results;
            } catch (e) {
                showNotification('Error: ' + e.message, 'error');
                tgOutput.value = ''; // Don't write error to output
            }
        };

        document.getElementById('js-tg-copy').onclick = () => this.copyToClipboard(tgOutput.value);

        // XML Convert Logic
        const xmlJson = document.getElementById('js-xml-json');
        const xmlXml = document.getElementById('js-xml-xml');

        document.getElementById('js-btn-j2x').onclick = () => {
            const res = this.jsonToXml(xmlJson.value);
            if (res.success) xmlXml.value = res.result;
            else showNotification(res.message || 'Error converting to XML', 'error');
        };

        document.getElementById('js-btn-x2j').onclick = () => {
            const res = this.xmlToJson(xmlXml.value);
            if (res.success) xmlJson.value = res.result;
            else showNotification(res.message || 'Error converting to JSON', 'error');
        };

        document.getElementById('js-xml-copy').onclick = () => this.copyToClipboard(xmlXml.value);

        // SQL Convert Logic (Already Implemented Self-Contained)
        const sqlJson = document.getElementById('js-sql-json');
        const sqlOutput = document.getElementById('js-sql-output');
        const sqlTable = document.getElementById('js-sql-table');

        document.getElementById('js-btn-j2s').onclick = () => {
            try {
                const jsonInput = sqlJson.value.trim();
                if (!jsonInput) throw new Error('Please enter JSON data');
                const data = JSON.parse(jsonInput);
                const tableName = sqlTable.value.trim() || 'table_name';

                // Helper to flatten rows
                const flatten = (obj, prefix = '') => {
                    const result = {};
                    for (const [key, value] of Object.entries(obj)) {
                        const newKey = prefix ? `${prefix}_${key}` : key;
                        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
                            Object.assign(result, flatten(value, newKey));
                        } else if (Array.isArray(value)) {
                            result[newKey] = JSON.stringify(value);
                        } else {
                            result[newKey] = value;
                        }
                    }
                    return result;
                };

                let rows = Array.isArray(data) ? data : [data];
                rows = rows.map(r => flatten(r));
                const columns = [...new Set(rows.flatMap(r => Object.keys(r)))];

                const sql = rows.map(row => {
                    const values = columns.map(col => {
                        const val = row[col];
                        if (val === undefined || val === null) return 'NULL';
                        if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
                        return `'${String(val).replace(/'/g, "''")}'`;
                    }).join(', ');
                    return `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values});`;
                }).join('\n');

                sqlOutput.value = sql;
                showNotification(`Generated ${rows.length} statements!`, 'success');
            } catch (e) {
                sqlOutput.value = '';
                showNotification(e.message, 'error');
            }
        };

        document.getElementById('js-sql-copy').onclick = () => this.copyToClipboard(sqlOutput.value);
    }

    // ========== HELPER METHODS (Replaced Window.DevTools dependencies) ==========

    jsonToCsv(jsonStr, opts) {
        try {
            const arr = JSON.parse(jsonStr);
            const data = Array.isArray(arr) ? arr : [arr];
            if (data.length === 0) return { success: false, message: 'Empty JSON array' };
            const delim = opts.delimiter || ',';
            const keys = Object.keys(data[0]);
            const header = opts.header ? keys.join(delim) + '\n' : '';
            const rows = data.map(obj => keys.map(k => {
                let val = obj[k] === undefined ? '' : obj[k];
                if (typeof val === 'string' && (val.includes(delim) || val.includes('\n'))) {
                    val = `"${val.replace(/"/g, '""')}"`;
                }
                return val;
            }).join(delim));
            return { success: true, result: header + rows.join('\n') };
        } catch (e) { return { success: false, message: e.message }; }
    }

    csvToJson(csvStr, opts) {
        try {
            const delim = opts.delimiter || ',';
            const lines = csvStr.trim().split('\n');
            if (lines.length < 1) return { success: false, message: 'Empty CSV' };
            const headers = opts.header ? lines[0].split(delim).map(h => h.trim()) : null;
            const start = opts.header ? 1 : 0;
            const result = [];
            for (let i = start; i < lines.length; i++) {
                const values = lines[i].split(delim);
                if (headers) {
                    const obj = {};
                    headers.forEach((h, idx) => obj[h] = values[idx]?.trim());
                    result.push(obj);
                } else {
                    result.push(values);
                }
            }
            return { success: true, result: JSON.stringify(result, null, 2) };
        } catch (e) { return { success: false, message: e.message }; }
    }

    jsonToXml(jsonStr) {
        try {
            const obj = JSON.parse(jsonStr);
            const toXml = (o) => {
                let xml = '';
                for (let key in o) {
                    if (o.hasOwnProperty(key)) {
                        let val = o[key];
                        xml += `<${key}>`;
                        if (typeof val === 'object' && val !== null) {
                            xml += toXml(val);
                        } else {
                            xml += String(val);
                        }
                        xml += `</${key}>`;
                    }
                }
                return xml;
            };
            return { success: true, result: `<root>${toXml(obj)}</root>` };
        } catch (e) { return { success: false, message: e.message }; }
    }

    xmlToJson(xmlStr) {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlStr, "text/xml");
            const xmlToJson = (xml) => {
                let obj = {};
                if (xml.nodeType === 1) { // element
                    if (xml.attributes.length > 0) {
                        obj["@attributes"] = {};
                        for (let j = 0; j < xml.attributes.length; j++) {
                            let attribute = xml.attributes.item(j);
                            obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                        }
                    }
                } else if (xml.nodeType === 3) { // text
                    obj = xml.nodeValue;
                }
                if (xml.hasChildNodes()) {
                    for (let i = 0; i < xml.childNodes.length; i++) {
                        let item = xml.childNodes.item(i);
                        let nodeName = item.nodeName;
                        if (typeof (obj[nodeName]) == "undefined") {
                            obj[nodeName] = xmlToJson(item);
                        } else {
                            if (typeof (obj[nodeName].push) == "undefined") {
                                let old = obj[nodeName];
                                obj[nodeName] = [];
                                obj[nodeName].push(old);
                            }
                            obj[nodeName].push(xmlToJson(item));
                        }
                    }
                }
                return obj;
            };
            const json = xmlToJson(xmlDoc);
            return { success: true, result: JSON.stringify(json, null, 2) };
        } catch (e) { return { success: false, message: e.message }; }
    }

    generateTypes(jsonStr, rootName, lang) {
        let obj;
        try { obj = JSON.parse(jsonStr); } catch (e) { throw new Error('Invalid JSON'); }

        const models = [];
        const seen = new Set();
        const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);
        const toPascal = s => s.split(/[_-]/).map(capitalize).join('');

        if (lang === 'ts') {
            const getType = (v, k) => {
                if (v === null) return 'any';
                if (Array.isArray(v)) {
                    if (v.length === 0) return 'any[]';
                    const firstItem = v[0];
                    if (typeof firstItem === 'object' && firstItem !== null) {
                        return `${toPascal(k)}[]`;
                    }
                    return `${typeof firstItem}[]`;
                }
                if (typeof v === 'object') return toPascal(k);
                return typeof v;
            };

            const process = (o, name) => {
                if (!o || typeof o !== 'object' || Array.isArray(o) || seen.has(name)) return;
                seen.add(name);

                let code = `export interface ${name} {\n`;
                for (let [k, v] of Object.entries(o)) {
                    code += `    ${k}: ${getType(v, k)};\n`;
                }
                code += `}\n`;
                models.push(code);

                // Recursively process nested objects
                for (let [k, v] of Object.entries(o)) {
                    if (v && typeof v === 'object' && !Array.isArray(v)) {
                        process(v, toPascal(k));
                    } else if (Array.isArray(v) && v.length > 0 && typeof v[0] === 'object' && v[0] !== null) {
                        process(v[0], toPascal(k));
                    }
                }
            };

            process(obj, rootName);
            return models.reverse().join('\n');
        }

        if (lang === 'csharp') {
            const getType = (v, k) => {
                if (v === null) return 'object';
                if (Array.isArray(v)) {
                    if (v.length === 0) return 'List<object>';
                    const firstItem = v[0];
                    if (typeof firstItem === 'object' && firstItem !== null) {
                        return `List<${toPascal(k)}>`;
                    }
                    const baseType = typeof firstItem === 'number' ? (firstItem % 1 === 0 ? 'int' : 'double') :
                        typeof firstItem === 'boolean' ? 'bool' : 'string';
                    return `List<${baseType}>`;
                }
                if (typeof v === 'object') return toPascal(k);
                if (typeof v === 'number') return v % 1 === 0 ? 'int' : 'double';
                if (typeof v === 'boolean') return 'bool';
                return 'string';
            };

            const process = (o, name) => {
                if (!o || typeof o !== 'object' || Array.isArray(o) || seen.has(name)) return;
                seen.add(name);

                let code = `public class ${name}\n{\n`;
                for (let [k, v] of Object.entries(o)) {
                    const type = getType(v, k);
                    code += `    [JsonPropertyName("${k}")]\n`;
                    code += `    public ${type} ${toPascal(k)} { get; set; }\n\n`;
                }
                code += `}\n`;
                models.push(code);

                for (let [k, v] of Object.entries(o)) {
                    if (v && typeof v === 'object' && !Array.isArray(v)) {
                        process(v, toPascal(k));
                    } else if (Array.isArray(v) && v.length > 0 && typeof v[0] === 'object' && v[0] !== null) {
                        process(v[0], toPascal(k));
                    }
                }
            };

            process(obj, rootName);
            return "using System.Text.Json.Serialization;\nusing System.Collections.Generic;\n\n" + models.reverse().join('\n');
        }

        if (lang === 'go') {
            const getType = (v, k) => {
                if (v === null) return 'interface{}';
                if (Array.isArray(v)) {
                    if (v.length === 0) return '[]interface{}';
                    const firstItem = v[0];
                    if (typeof firstItem === 'object' && firstItem !== null) {
                        return `[]${toPascal(k)}`;
                    }
                    const baseType = typeof firstItem === 'number' ? (firstItem % 1 === 0 ? 'int' : 'float64') :
                        typeof firstItem === 'boolean' ? 'bool' : 'string';
                    return `[]${baseType}`;
                }
                if (typeof v === 'object') return toPascal(k);
                if (typeof v === 'number') return v % 1 === 0 ? 'int' : 'float64';
                if (typeof v === 'boolean') return 'bool';
                return 'string';
            };

            const process = (o, name) => {
                if (!o || typeof o !== 'object' || Array.isArray(o) || seen.has(name)) return;
                seen.add(name);

                let code = `type ${name} struct {\n`;
                for (let [k, v] of Object.entries(o)) {
                    code += `    ${toPascal(k)} ${getType(v, k)} \`json:"${k}"\`\n`;
                }
                code += `}\n`;
                models.push(code);

                for (let [k, v] of Object.entries(o)) {
                    if (v && typeof v === 'object' && !Array.isArray(v)) {
                        process(v, toPascal(k));
                    } else if (Array.isArray(v) && v.length > 0 && typeof v[0] === 'object' && v[0] !== null) {
                        process(v[0], toPascal(k));
                    }
                }
            };

            process(obj, rootName);
            return models.reverse().join('\n');
        }

        if (lang === 'java') {
            const getType = (v, k) => {
                if (v === null) return 'Object';
                if (Array.isArray(v)) {
                    if (v.length === 0) return 'List<Object>';
                    const firstItem = v[0];
                    if (typeof firstItem === 'object' && firstItem !== null) {
                        return `List<${toPascal(k)}>`;
                    }
                    const baseType = typeof firstItem === 'number' ? (firstItem % 1 === 0 ? 'Integer' : 'Double') :
                        typeof firstItem === 'boolean' ? 'Boolean' : 'String';
                    return `List<${baseType}>`;
                }
                if (typeof v === 'object') return toPascal(k);
                if (typeof v === 'number') return v % 1 === 0 ? 'Integer' : 'Double';
                if (typeof v === 'boolean') return 'Boolean';
                return 'String';
            };

            const process = (o, name) => {
                if (!o || typeof o !== 'object' || Array.isArray(o) || seen.has(name)) return;
                seen.add(name);

                let code = `public class ${name} {\n`;

                // Fields
                for (let [k, v] of Object.entries(o)) {
                    code += `    private ${getType(v, k)} ${k};\n`;
                }
                code += `\n`;

                // Getters and Setters
                for (let [k, v] of Object.entries(o)) {
                    const type = getType(v, k);
                    const cap = toPascal(k);
                    code += `    public ${type} get${cap}() { return ${k}; }\n`;
                    code += `    public void set${cap}(${type} ${k}) { this.${k} = ${k}; }\n\n`;
                }

                code += `}\n`;
                models.push(code);

                for (let [k, v] of Object.entries(o)) {
                    if (v && typeof v === 'object' && !Array.isArray(v)) {
                        process(v, toPascal(k));
                    } else if (Array.isArray(v) && v.length > 0 && typeof v[0] === 'object' && v[0] !== null) {
                        process(v[0], toPascal(k));
                    }
                }
            };

            process(obj, rootName);
            return "import java.util.List;\n\n" + models.reverse().join('\n');
        }

        if (lang === 'python') {
            const getType = (v, k) => {
                if (v === null) return 'Any';
                if (Array.isArray(v)) {
                    if (v.length === 0) return 'List[Any]';
                    const firstItem = v[0];
                    if (typeof firstItem === 'object' && firstItem !== null) {
                        return `List[${toPascal(k)}]`;
                    }
                    const baseType = typeof firstItem === 'number' ? (firstItem % 1 === 0 ? 'int' : 'float') :
                        typeof firstItem === 'boolean' ? 'bool' : 'str';
                    return `List[${baseType}]`;
                }
                if (typeof v === 'object') return toPascal(k);
                if (typeof v === 'number') return v % 1 === 0 ? 'int' : 'float';
                if (typeof v === 'boolean') return 'bool';
                return 'str';
            };

            const process = (o, name) => {
                if (!o || typeof o !== 'object' || Array.isArray(o) || seen.has(name)) return;
                seen.add(name);

                let code = `@dataclass\nclass ${name}:\n`;
                const entries = Object.entries(o);
                if (entries.length === 0) {
                    code += "    pass\n";
                } else {
                    for (let [k, v] of entries) {
                        code += `    ${k}: ${getType(v, k)}\n`;
                    }
                }
                code += `\n`;
                models.push(code);

                for (let [k, v] of Object.entries(o)) {
                    if (v && typeof v === 'object' && !Array.isArray(v)) {
                        process(v, toPascal(k));
                    } else if (Array.isArray(v) && v.length > 0 && typeof v[0] === 'object' && v[0] !== null) {
                        process(v[0], toPascal(k));
                    }
                }
            };

            process(obj, rootName);
            return "from dataclasses import dataclass\nfrom typing import List, Any\n\n" + models.reverse().join('\n');
        }

        return `// Type generation for ${lang} not fully implemented yet.`;
    }
}

// Register tool
window.initJsonMasterStudioLogic = JSONMasterTool;
