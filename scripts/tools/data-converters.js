/* TULPAR - Data Converters Tool OOP Implementation */
class DataConvertersTool extends BaseTool {
    constructor(config) {
        super(config);
        this.currentType = 'csv-json';
    }

    renderUI() {
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const txt = isTr ? {
            title: 'Veri Dönüştürücü Merkezi',
            type: 'Dönüşüm Tipi',
            input: 'Giriş Verisi',
            output: 'Sonuç Verisi',
            convert: 'Şimdi Dönüştür ⚡',
            copy: 'Kopyala',
            clear: 'Temizle',
            current: 'Şu Anki Zaman Damgası',
            placeholder: 'Veriyi buraya yapıştırın...'
        } : {
            title: 'Data Converter Hub',
            type: 'Conversion Type',
            input: 'Source Data',
            output: 'Result Data',
            convert: 'Convert Now ⚡',
            copy: 'Copy',
            clear: 'Clear',
            current: 'Get Current Timestamp',
            placeholder: 'Paste your source data here...'
        };

        const types = [
            { id: 'csv-json', name: 'CSV ➔ JSON' },
            { id: 'json-csv', name: 'JSON ➔ CSV' },
            { id: 'json-xml', name: 'JSON ➔ XML' },
            { id: 'xml-json', name: 'XML ➔ JSON' },
            { id: 'json-sql', name: 'JSON ➔ SQL' },
            { id: 'timestamp-date', name: 'Timestamp ➔ Date' },
            { id: 'date-timestamp', name: 'Date ➔ Timestamp' }
        ];

        return `
        <div class="tool-content data-studio" style="max-width: 1100px; margin: 0 auto; padding: 20px;">
            <div class="grid-layout" style="display: grid; grid-template-columns: 320px 1fr; gap: 2.5rem;">
                
                <!-- Sidebar Controls -->
                <div class="data-sidebar">
                    <div class="card" style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 16px;">
                        <h4 style="margin-bottom: 1.5rem; color: var(--primary); text-transform: uppercase; font-size: 0.85rem;">${txt.title}</h4>
                        
                        <div class="form-group">
                            <label class="form-label">${txt.type}</label>
                            <select id="data-in-type" class="form-select">
                                ${types.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
                            </select>
                        </div>

                        <div id="data-time-opt" style="display: none; margin-bottom: 1.5rem;">
                            <button id="data-btn-now" class="btn btn-sm btn-outline" style="width: 100%;">${txt.current}</button>
                        </div>

                        <button id="data-btn-run" class="btn btn-primary" style="width: 100%; height: 3.5rem; font-weight: 700; margin-top: 1rem;">${txt.convert}</button>
                    </div>
                </div>

                <!-- Main Work Area -->
                <div class="data-main">
                    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                        <div class="card" style="padding: 1.2rem; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 16px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                <h5 style="margin: 0; font-size: 0.8rem; text-transform: uppercase; opacity: 0.6;">${txt.input}</h5>
                            </div>
                            <textarea id="data-in-area" class="form-input" style="height: 250px; font-family: var(--font-mono); font-size: 0.85rem; background: rgba(0,0,0,0.1); border: none;" placeholder="${txt.placeholder}"></textarea>
                        </div>

                        <div class="card" style="padding: 1.2rem; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 16px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                <h5 style="margin: 0; font-size: 0.8rem; text-transform: uppercase; opacity: 0.6;">${txt.output}</h5>
                                <div style="display: flex; gap: 8px;">
                                    <button id="data-btn-clear" class="btn btn-sm btn-outline" style="font-size: 0.7rem;">${txt.clear}</button>
                                    <button id="data-btn-copy" class="btn btn-sm btn-primary" style="font-size: 0.7rem;">${txt.copy}</button>
                                </div>
                            </div>
                            <pre id="data-out-area" style="min-height: 200px; max-height: 400px; overflow: auto; background: rgba(0,0,0,0.2); padding: 1.2rem; border-radius: 8px; font-family: var(--font-mono); font-size: 0.85rem; margin: 0; border: 1px solid rgba(255,255,255,0.05);"></pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    setupListeners() {
        const inType = document.getElementById('data-in-type');
        const inArea = document.getElementById('data-in-area');
        const outArea = document.getElementById('data-out-area');
        const btnRun = document.getElementById('data-btn-run');
        const btnNow = document.getElementById('data-btn-now');
        const timeOpt = document.getElementById('data-time-opt');

        inType.onchange = () => {
            this.currentType = inType.value;
            timeOpt.style.display = (this.currentType.includes('timestamp') || this.currentType.includes('date')) ? 'block' : 'none';
        };

        btnNow.onclick = () => {
            const now = Math.floor(Date.now() / 1000);
            inArea.value = now;
            btnRun.click();
        };

        btnRun.onclick = () => {
            const raw = inArea.value.trim();
            if (!raw) return;

            let result = '';
            try {
                switch (this.currentType) {
                    case 'csv-json': result = this.csvToJson(raw).result; break;
                    case 'json-csv': result = this.jsonToCsv(raw).result; break;
                    case 'json-xml': result = this.jsonToXml(raw).result; break;
                    case 'xml-json': result = this.xmlToJson(raw).result; break;
                    case 'json-sql': result = this.jsonToSql(raw).result; break;
                    case 'timestamp-date':
                        const r = this.timestampToDate(raw);
                        result = r.success ? JSON.stringify(r.result, null, 2) : r.message;
                        break;
                    case 'date-timestamp':
                        const r2 = this.dateToTimestamp(raw);
                        result = r2.success ? JSON.stringify(r2.result, null, 2) : r2.message;
                        break;
                }
                outArea.textContent = result;
            } catch (err) {
                outArea.textContent = `Error: ${err.message}`;
            }
        };

        document.getElementById('data-btn-copy').onclick = () => this.copyToClipboard(outArea.textContent);
        document.getElementById('data-btn-clear').onclick = () => { inArea.value = ''; outArea.textContent = ''; };
    }

    // INTERNAL LOGIC (Formerly in DevTools.dataConverters)

    csvToJson(csv) {
        const lines = csv.split('\n');
        const result = [];
        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));

        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            const obj = {};
            const currentline = lines[i].split(','); // Simple split, doesn't handle commas in quotes
            for (let j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentline[j]?.trim().replace(/^"|"$/g, '') || "";
            }
            result.push(obj);
        }
        return { success: true, result: JSON.stringify(result, null, 2) };
    }

    jsonToCsv(jsonStr) {
        const json = JSON.parse(jsonStr);
        const array = Array.isArray(json) ? json : [json];
        if (array.length === 0) return { success: false, message: "Empty JSON" };

        const headers = Object.keys(array[0]);
        const csvRows = [];
        csvRows.push(headers.join(','));

        for (const row of array) {
            const values = headers.map(header => {
                const escaped = ('' + row[header]).replace(/"/g, '\\"');
                return `"${escaped}"`;
            });
            csvRows.push(values.join(','));
        }
        return { success: true, result: csvRows.join('\n') };
    }

    jsonToXml(jsonStr) {
        const json = JSON.parse(jsonStr);
        let xml = '';
        const toXml = (obj, rootName = 'root') => {
            let xml = '';
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (typeof obj[key] === 'object' && obj[key] !== null) {
                        xml += toXml(obj[key], key);
                    } else {
                        xml += `<${key}>${obj[key]}</${key}>`;
                    }
                }
            }
            return rootName ? `<${rootName}>${xml}</${rootName}>` : xml;
        }
        // Handle array root
        if (Array.isArray(json)) {
            xml = `<root>${json.map(item => toXml(item, 'item')).join('')}</root>`;
        } else {
            xml = toXml(json);
        }
        return { success: true, result: xml };
    }

    xmlToJson(xmlStr) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlStr, "text/xml");

        const xmlToJson = (xml) => {
            let obj = {};
            if (xml.nodeType === 1) { // element
                if (xml.attributes.length > 0) {
                    obj["@attributes"] = {};
                    for (let j = 0; j < xml.attributes.length; j++) {
                        const attribute = xml.attributes.item(j);
                        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                    }
                }
            } else if (xml.nodeType === 3) { // text
                obj = xml.nodeValue;
            }

            if (xml.hasChildNodes()) {
                for (let i = 0; i < xml.childNodes.length; i++) {
                    const item = xml.childNodes.item(i);
                    const nodeName = item.nodeName;
                    if (typeof (obj[nodeName]) === "undefined") {
                        const val = xmlToJson(item);
                        // If text node only, simplify
                        if (typeof val === 'object' && Object.keys(val).length === 0) continue; // empty
                        // if text node #text
                        if (nodeName === "#text") {
                            const textVal = item.nodeValue.trim();
                            if (textVal) return textVal; else continue;
                        }
                        obj[nodeName] = val;
                    } else {
                        if (typeof (obj[nodeName].push) === "undefined") {
                            const old = obj[nodeName];
                            obj[nodeName] = [];
                            obj[nodeName].push(old);
                        }
                        obj[nodeName].push(xmlToJson(item));
                    }
                }
            }
            return obj;
        };
        const res = xmlToJson(xmlDoc.documentElement);
        return { success: true, result: JSON.stringify(res, null, 2) };
    }

    jsonToSql(jsonStr) {
        const json = JSON.parse(jsonStr);
        const array = Array.isArray(json) ? json : [json];
        if (array.length === 0) return { success: false, message: "Empty JSON" };

        const tableName = "my_table";
        const keys = Object.keys(array[0]);
        let sql = `CREATE TABLE ${tableName} (${keys.map(k => `${k} VARCHAR(255)`).join(', ')});\n`; // Naive schema
        sql += `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES\n`;

        const values = array.map(row => {
            const vals = keys.map(k => `'${String(row[k]).replace(/'/g, "''")}'`).join(', ');
            return `(${vals})`;
        }).join(',\n');

        sql += values + ';';
        return { success: true, result: sql };
    }

    timestampToDate(ts) {
        const timestamp = parseInt(ts);
        if (isNaN(timestamp)) return { success: false, message: "Invalid timestamp" };
        const date = new Date(timestamp * 1000); // assume seconds
        const result = {
            iso: date.toISOString(),
            utc: date.toUTCString(),
            local: date.toString(),
            unix: timestamp
        };
        return { success: true, result: result };
    }

    dateToTimestamp(dateStr) {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return { success: false, message: "Invalid date" };
        const ts = Math.floor(date.getTime() / 1000);
        return { success: true, result: { timestamp: ts } };
    }
}

// Register tool
window.initDataConvertersLogic = DataConvertersTool;
