/* TULPAR - SQL Studio Tool OOP Implementation */
class SQLStudioTool extends BaseTool {
    constructor(config) {
        super(config);
        this.db = null;
        this.SQL = null;
        this.lastResults = null;
    }

    renderUI() {
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const txt = isTr ? {
            title: 'SQL Sorgu Stüdyosu',
            status: 'SQL Motoru Hazırlanıyor...',
            ready: 'Hazır ✓',
            run: 'Sorguyu Çalıştır (Ctrl+Enter)',
            schema: 'Veritabanı Şeması',
            emptySchema: 'Tablo bulunamadı.',
            demo: 'Demo Veri Yükle 🛠️',
            import: 'SQLite Dosyası Aç 📂',
            export: 'Veritabanını İndir 💾',
            history: 'Sorgu Geçmişi',
            result: 'Sorgu Sonuçları'
        } : {
            title: 'SQL Query Studio',
            status: 'Initializing SQL Engine...',
            ready: 'Ready ✓',
            run: 'Run Query (Ctrl+Enter)',
            schema: 'Database Schema',
            emptySchema: 'No tables found.',
            demo: 'Load Demo Data 🛠️',
            import: 'Open SQLite File 📂',
            export: 'Export Database 💾',
            history: 'Query History',
            result: 'Query Results'
        };

        return `
        <div class="tool-content sql-studio" style="height: calc(100vh - 160px); max-width: 1400px; margin: 0 auto; display: flex; flex-direction: column; gap: 1rem; padding: 10px;">
            <div style="display: flex; gap: 1rem; flex: 1; min-height: 0;">
                
                <!-- Left: Navigation & Schema -->
                <div style="width: 280px; display: flex; flex-direction: column; gap: 1rem;">
                    <div class="card" style="flex: 1; background: var(--surface); border: 1px solid var(--border-color); border-radius: 16px; display: flex; flex-direction: column; overflow: hidden;">
                        <div style="padding: 1rem; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
                            <h4 style="margin: 0; font-size: 0.8rem; text-transform: uppercase; color: var(--primary);">${txt.schema}</h4>
                            <span id="sql-status-badge" style="font-size: 0.65rem; padding: 2px 8px; border-radius: 10px; background: rgba(0,0,0,0.2);">${txt.status}</span>
                        </div>
                        <div id="sql-schema-list" style="flex: 1; overflow-y: auto; padding: 10px;">
                            <div style="padding: 2rem; text-align: center; opacity: 0.3; font-size: 0.8rem;">${txt.emptySchema}</div>
                        </div>
                    </div>

                    <div class="card" style="background: var(--surface); border: 1px solid var(--border-color); border-radius: 16px; padding: 1rem; display: flex; flex-direction: column; gap: 8px;">
                        <input type="file" id="sql-in-file" hidden accept=".sqlite,.db">
                        <label class="form-label" style="font-size:0.75rem;">Datasets & Actions</label>
                        <select id="sql-in-demo" class="form-select" style="font-size:0.8rem;">
                            <option value="">Load Dataset...</option>
                            <option value="ecommerce">🛍️ E-commerce</option>
                            <option value="employees">👥 Employees</option>
                            <option value="school">🎓 School</option>
                        </select>
                        <button id="sql-btn-imp" class="btn btn-sm btn-outline" style="width: 100%;">${txt.import}</button>
                        <div style="display:flex; gap:5px;">
                            <button id="sql-btn-exp" class="btn btn-sm btn-outline" style="flex:1;">DB 💾</button>
                            <button id="sql-btn-csv" class="btn btn-sm btn-outline" style="flex:1;">CSV 📄</button>
                        </div>
                    </div>
                </div>

                <!-- Right: Editor & Results -->
                <div style="flex: 1; display: flex; flex-direction: column; gap: 1rem; min-width: 0;">
                    <!-- Editor -->
                    <div class="card" style="flex: 1; background: var(--surface); border: 1px solid var(--border-color); border-radius: 16px; display: flex; flex-direction: column; overflow: hidden; min-height: 250px;">
                        <div style="padding: 0.75rem 1rem; background: rgba(0,0,0,0.1); border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
                             <h4 style="margin: 0; font-size: 0.8rem; text-transform: uppercase;">${txt.title}</h4>
                             <button id="sql-btn-run" class="btn btn-sm btn-primary" title="Ctrl+Enter" disabled>⚡ ${txt.run}</button>
                        </div>
                        <textarea id="sql-in-query" class="form-input" style="flex: 1; border: none; font-family: var(--font-mono); font-size: 0.9rem; padding: 1.5rem; background: transparent; resize: none;" placeholder="SELECT * FROM users;"></textarea>
                    </div>

                    <!-- Results -->
                    <div class="card" style="flex: 1.2; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 16px; display: flex; flex-direction: column; overflow: hidden;">
                        <div style="padding: 0.75rem 1rem; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
                             <h4 style="margin: 0; font-size: 0.8rem; text-transform: uppercase; color: var(--text-secondary);">${txt.result}</h4>
                             <div id="sql-res-meta" style="font-size: 0.75rem; opacity: 0.6;"></div>
                        </div>
                        <div id="sql-res-table-cont" style="flex: 1; overflow: auto; padding: 1px;">
                            <div style="height: 100%; display: flex; align-items: center; justify-content: center; opacity: 0.2; font-size: 0.9rem;">
                                Waiting for query...
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    async setupListeners() {
        const status = document.getElementById('sql-status-badge');
        const btnRun = document.getElementById('sql-btn-run');
        const queryIn = document.getElementById('sql-in-query');
        const resCont = document.getElementById('sql-res-table-cont');
        const schemaList = document.getElementById('sql-schema-list');
        const resMeta = document.getElementById('sql-res-meta');

        const btnDemo = document.getElementById('sql-in-demo');
        const btnImp = document.getElementById('sql-btn-imp');
        const btnExp = document.getElementById('sql-btn-exp');
        const btnCsv = document.getElementById('sql-btn-csv');
        const inFile = document.getElementById('sql-in-file');

        try {
            await this._initEngine();
            status.textContent = 'Ready ✓';
            status.style.color = '#10b981';
            btnRun.disabled = false;
        } catch (err) {
            status.textContent = 'Error';
            status.style.color = '#ef4444';
            this.showNotification('Failed to load SQL engine', 'error');
        }

        const runQuery = () => {
            const sql = queryIn.value.trim();
            if (!sql || !this.db) return;
            try {
                const startTime = performance.now();
                const results = this.db.exec(sql);
                const duration = (performance.now() - startTime).toFixed(1);

                this.lastResults = results[0];
                this._renderResults(results, duration);
                this._refreshSchema();
            } catch (e) {
                resCont.innerHTML = `<div style="padding:2rem; color:#ef4444; font-family:var(--font-mono); background:rgba(239,68,68,0.1);">Error: ${e.message}</div>`;
            }
        };

        btnRun.onclick = runQuery;
        queryIn.onkeydown = (e) => { if (e.ctrlKey && e.key === 'Enter') runQuery(); };

        btnDemo.onchange = () => {
            const val = btnDemo.value;
            if (!val) return;
            let setupSql = "";
            let q = "";

            if (val === 'ecommerce') {
                setupSql = `
                    DROP TABLE IF EXISTS orders; DROP TABLE IF EXISTS products;
                    CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price REAL, stock INTEGER);
                    INSERT INTO products (name, price, stock) VALUES ('Laptop', 1200.50, 10), ('Mouse', 25.00, 50), ('Keyboard', 45.99, 30), ('Monitor', 300.00, 15);
                    CREATE TABLE orders (id INTEGER PRIMARY KEY, product_id INTEGER, quantity INTEGER, date TEXT);
                    INSERT INTO orders (product_id, quantity, date) VALUES (1, 1, '2023-10-01'), (2, 2, '2023-10-02'), (1, 1, '2023-10-05'), (3, 5, '2023-10-10');
                `;
                q = "SELECT p.name, SUM(o.quantity) as sold FROM products p JOIN orders o ON p.id = o.product_id GROUP BY p.name;";
            } else if (val === 'employees') {
                setupSql = `
                    DROP TABLE IF EXISTS employees; DROP TABLE IF EXISTS depts;
                    CREATE TABLE depts (id INTEGER PRIMARY KEY, name TEXT);
                    INSERT INTO depts (name) VALUES ('Engineering'), ('HR'), ('Marketing');
                    CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, dept_id INTEGER, salary INTEGER);
                    INSERT INTO employees (name, dept_id, salary) VALUES ('Alice', 1, 90000), ('Bob', 1, 85000), ('Charlie', 2, 60000), ('Dave', 3, 70000);
                `;
                q = "SELECT d.name, AVG(e.salary) as avg_salary FROM depts d JOIN employees e ON d.id = e.dept_id GROUP BY d.name;";
            } else if (val === 'school') {
                setupSql = `
                    DROP TABLE IF EXISTS students;
                    CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT, grade INTEGER);
                    INSERT INTO students (name, grade) VALUES ('John', 85), ('Jane', 92), ('Doe', 78), ('Smith', 88);
                `;
                q = "SELECT * FROM students WHERE grade > 80;";
            }

            this.db.exec(setupSql);
            queryIn.value = q;
            runQuery();
            this.showNotification('Dataset loaded', 'success');
            btnDemo.value = "";
        };

        btnCsv.onclick = () => {
            if (!this.lastResults) return this.showNotification('No results to export', 'error');
            const cols = this.lastResults.columns.join(',');
            const rows = this.lastResults.values.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
            const csv = `${cols}\n${rows}`;
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'query_results.csv';
            a.click();
        };

        btnImp.onclick = () => inFile.click();
        inFile.onchange = (e) => this._handleImport(e.target.files[0]);

        btnExp.onclick = () => {
            if (!this.db) return;
            const data = this.db.export();
            const blob = new Blob([data]);
            const a = document.createElement('a');
            a.download = 'database.sqlite';
            a.href = URL.createObjectURL(blob);
            a.click();
        };
    }

    async _initEngine() {
        if (typeof initSqlJs === 'undefined') {
            await new Promise((res, rej) => {
                const s = document.createElement('script');
                s.src = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js';
                s.onload = res;
                s.onerror = rej;
                document.head.appendChild(s);
            });
        }

        this.SQL = await initSqlJs({
            locateFile: filename => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${filename}`
        });
        this.db = new this.SQL.Database();
    }

    _handleImport(file) {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const uints = new Uint8Array(reader.result);
            this.db = new this.SQL.Database(uints);
            this._refreshSchema();
            this.showNotification(`Loaded: ${file.name}`, 'success');
        };
        reader.readAsArrayBuffer(file);
    }

    _refreshSchema() {
        const schemaList = document.getElementById('sql-schema-list');
        const res = this.db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
        if (!res.length || !res[0].values.length) {
            schemaList.innerHTML = `<div style="padding: 2rem; text-align: center; opacity: 0.3; font-size: 0.8rem;">No tables found.</div>`;
            return;
        }

        schemaList.innerHTML = res[0].values.map(row => `
            <div class="sql-table-item" style="padding: 8px 12px; border-radius: 8px; cursor: pointer; font-size: 0.85rem; display: flex; align-items: center; gap: 8px; margin-bottom: 4px; transition: 0.2s;" onmouseover="this.style.background='rgba(59, 130, 246, 0.1)'" onmouseout="this.style.background='transparent'" onclick="window.sqlOpenTable('${row[0]}')">
                <span style="opacity: 0.5;">📄</span> ${row[0]}
            </div>
        `).join('');

        window.sqlOpenTable = (t) => {
            document.getElementById('sql-in-query').value = `SELECT * FROM ${t} LIMIT 100;`;
            document.getElementById('sql-btn-run').click();
        };
    }

    _renderResults(results, duration) {
        const cont = document.getElementById('sql-res-table-cont');
        const meta = document.getElementById('sql-res-meta');

        if (!results.length) {
            cont.innerHTML = '<div style="padding:3rem; text-align:center; opacity:0.5;">Query successful (No results)</div>';
            meta.textContent = `Completed in ${duration}ms`;
            return;
        }

        const data = results[0];
        meta.textContent = `${data.values.length} rows in ${duration}ms`;

        let html = `<table style="width:100%; border-collapse:collapse; font-size:0.8rem;">`;
        html += `<thead style="position:sticky; top:0; background:var(--surface); z-index:1;"><tr>${data.columns.map(c => `<th style="text-align:left; padding:10px; border-bottom:2px solid var(--border-color);">${c}</th>`).join('')}</tr></thead>`;
        html += `<tbody>${data.values.map(row => `<tr>${row.map(v => `<td style="padding:8px 10px; border-bottom:1px solid rgba(255,255,255,0.05);">${v === null ? '<span style="opacity:0.3">NULL</span>' : v}</td>`).join('')}</tr>`).join('')}</tbody>`;
        html += `</table>`;
        cont.innerHTML = html;
    }
}

// Register tool
window.initSqlPlaygroundLogic = SQLStudioTool;
