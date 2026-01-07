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
            <div class="studio-tabs" style="display: flex; gap: 8px; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid var(--border-color);">
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
                
                <!-- CSV Options -->
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
                            <option value="kotlin">Kotlin Data Class</option>
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
                fmtOutput.value = JSON.stringify(parsed, null, 2); // Also format and show in output
                fmtStatus.innerHTML = '✅ <b>Valid JSON</b>';
                fmtStatus.style.color = '#10b981'; // Success Green
                window.DevTools.showNotification('Valid JSON', 'success');
            } catch (e) {
                fmtStatus.innerHTML = `❌ <b>Invalid JSON:</b> ${e.message}`;
                fmtStatus.style.color = '#ef4444'; // Error Red
                window.DevTools.showNotification('Invalid JSON', 'error');
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
            const res = window.DevTools.dataConverters.jsonToCsv(cvJson.value, opts);
            if (res.success) cvCsv.value = res.result;
            else window.DevTools.showNotification(res.message, 'error');
        };

        document.getElementById('js-btn-c2j').onclick = () => {
            const opts = {
                header: document.getElementById('js-opt-header').checked,
                delimiter: document.getElementById('js-opt-delim').value
            };
            const res = window.DevTools.dataConverters.csvToJson(cvCsv.value, opts);
            if (res.success) cvJson.value = res.result;
            else window.DevTools.showNotification(res.message, 'error');
        };

        document.getElementById('js-csv-copy').onclick = () => this.copyToClipboard(cvCsv.value);


        // TypeGen Logic
        const tgInput = document.getElementById('js-tg-input');
        const tgOutput = document.getElementById('js-tg-output');
        const tgLang = document.getElementById('js-tg-lang');
        const tgRoot = document.getElementById('js-tg-root');

        document.getElementById('js-tg-gen').onclick = () => {
            try {
                // Now using centralized logic
                const results = window.DevTools.jsonTools.generateTypes(tgInput.value, tgRoot.value || 'Root', tgLang.value);
                tgOutput.value = results;
            } catch (e) {
                window.DevTools.showNotification('Error: ' + e.message, 'error');
                tgOutput.value = '// Error generating types\n' + e.message;
            }
        };

        document.getElementById('js-tg-copy').onclick = () => this.copyToClipboard(tgOutput.value);

        // XML Convert Logic
        const xmlJson = document.getElementById('js-xml-json');
        const xmlXml = document.getElementById('js-xml-xml');

        document.getElementById('js-btn-j2x').onclick = () => {
            const res = window.DevTools.dataConverters.jsonToXml(xmlJson.value);
            if (res.success) xmlXml.value = res.result;
            else window.DevTools.showNotification(res.message || 'Error converting to XML', 'error');
        };

        document.getElementById('js-btn-x2j').onclick = () => {
            const res = window.DevTools.dataConverters.xmlToJson(xmlXml.value);
            if (res.success) xmlJson.value = res.result;
            else window.DevTools.showNotification(res.message || 'Error converting to JSON', 'error');
        };

        document.getElementById('js-xml-copy').onclick = () => this.copyToClipboard(xmlXml.value);


        // SQL Convert Logic - SMART VERSION
        const sqlJson = document.getElementById('js-sql-json');
        const sqlOutput = document.getElementById('js-sql-output');
        const sqlTable = document.getElementById('js-sql-table');

        document.getElementById('js-btn-j2s').onclick = () => {
            try {
                console.log('🔍 JSON to SQL conversion started');
                const jsonInput = sqlJson.value.trim();
                if (!jsonInput) throw new Error('Please enter JSON data');

                const data = JSON.parse(jsonInput);
                console.log('✅ Parsed:', data);

                const tableName = sqlTable.value.trim() || 'table_name';

                // Helper: Flatten nested objects with dot notation
                const flatten = (obj, prefix = '') => {
                    const result = {};
                    for (const [key, value] of Object.entries(obj)) {
                        const newKey = prefix ? `${prefix}_${key}` : key;
                        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
                            Object.assign(result, flatten(value, newKey));
                        } else if (Array.isArray(value)) {
                            // Arrays: stringify as JSON
                            result[newKey] = JSON.stringify(value);
                        } else {
                            result[newKey] = value;
                        }
                    }
                    return result;
                };

                // Convert to array if single object
                let rows = Array.isArray(data) ? data : [data];

                // Flatten each row
                rows = rows.map(row => flatten(row));

                // Get all unique columns
                const columns = [...new Set(rows.flatMap(row => Object.keys(row)))];

                // Generate SQL
                const sql = rows.map(row => {
                    const values = columns.map(col => {
                        const val = row[col];
                        if (val === undefined || val === null) return 'NULL';
                        if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
                        if (typeof val === 'boolean') return val;
                        if (typeof val === 'number') return val;
                        return `'${String(val).replace(/'/g, "''")}'`;
                    }).join(', ');
                    return `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values});`;
                }).join('\n');

                console.log('✅ SQL generated successfully');
                sqlOutput.value = sql;
                window.DevTools.showNotification(`Generated ${rows.length} INSERT statement(s)!`, 'success');
            } catch (e) {
                console.error('❌ SQL Error:', e);
                sqlOutput.value = '';
                window.DevTools.showNotification('Error: ' + e.message, 'error');
            }
        };

        document.getElementById('js-sql-copy').onclick = () => this.copyToClipboard(sqlOutput.value);
    }
}

// Register tool
window.initJsonMasterStudioLogic = JSONMasterTool;
