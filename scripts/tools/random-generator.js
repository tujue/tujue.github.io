/* TULPAR - Random Generator Tool OOP Implementation */
console.log('✅ Random Generator Script Loaded');
class RandomGeneratorTool extends BaseTool {
    constructor(config) {
        super(config);
    }

    renderUI() {
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const txt = isTr ? {
            type: 'Üretim Türü',
            generate: 'Rastgele Üret ✨',
            copy: 'Sonucu Kopyala',
            result: 'Üretilen Sonuç',
            config: 'Ayarlar',
            modes: {
                number: 'Sayı Üretici', dice: 'Zar Atma', lottery: 'Loto Sayıları',
                team: 'Takım Oluşturucu', name: 'İsim Seçici', date: 'Tarih',
                uuid: 'UUID v4', coin: 'Yazı/Tura', color: 'Renk'
            }
        } : {
            type: 'Generator Type',
            generate: 'Generate Random ✨',
            copy: 'Copy Result',
            result: 'Generated Result',
            config: 'Settings',
            modes: {
                number: 'Random Number', dice: 'Dice Roller', lottery: 'Lottery Numbers',
                team: 'Team Picker', name: 'Name Picker', date: 'Random Date',
                uuid: 'UUID v4', coin: 'Coin Flip', color: 'Random Color',
                user: 'Mock User Data'
            }
        };

        return `
        <div class="tool-content" style="max-width: 1000px; margin: 0 auto; padding: 20px;">
            <div class="grid-layout" style="display: grid; grid-template-columns: 320px 1fr; gap: 2rem;">
                <!-- Sidebar -->
                <div class="sidebar">
                    <div class="card" style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 12px; position: sticky; top: 20px;">
                        <h4 style="margin-bottom: 1.5rem; color: var(--primary);">${txt.config}</h4>
                        <div class="form-group">
                            <label class="form-label">${txt.type}</label>
                            <select id="rnd-type" class="form-select">
                                ${Object.entries(txt.modes).map(([id, name]) => `<option value="${id}">${name}</option>`).join('')}
                            </select>
                        </div>

                        <!-- Panel: Number -->
                        <div id="pnl-number" class="rnd-panel">
                            <div class="grid-2" style="gap: 10px;">
                                <div class="form-group"><label class="form-label">Min</label><input type="number" id="num-min" class="form-input" value="1"></div>
                                <div class="form-group"><label class="form-label">Max</label><input type="number" id="num-max" class="form-input" value="100"></div>
                            </div>
                        </div>

                        <!-- Panel: Dice -->
                        <div id="pnl-dice" class="rnd-panel" style="display: none;">
                            <div class="form-group"><label class="form-label">Sides</label><select id="dice-s" class="form-select"><option value="6">D6</option><option value="10">D10</option><option value="20">D20</option></select></div>
                            <div class="form-group"><label class="form-label">Count</label><input type="number" id="dice-c" class="form-input" value="1"></div>
                        </div>

                        <!-- Panel: Team/Name -->
                        <div id="pnl-names" class="rnd-panel" style="display: none;">
                            <div class="form-group">
                                <label class="form-label">Names (one per line)</label>
                                <textarea id="names-list" class="form-input" style="height: 120px;" placeholder="John\nJane..."></textarea>
                            </div>
                            <div id="team-size-grp" class="form-group" style="display: none;">
                                <label class="form-label">Teams</label>
                                <input type="number" id="team-count" class="form-input" value="2">
                            </div>
                        </div>

                        <!-- Panel: User Mock -->
                        <div id="pnl-user" class="rnd-panel" style="display: none;">
                             <div class="form-group"><label class="form-label">Quantity</label><input type="number" id="user-cnt" class="form-input" value="1" min="1" max="10"></div>
                             <div class="form-group"><label class="form-label">Format</label><select id="user-fmt" class="form-select"><option value="json">JSON</option><option value="csv">CSV</option></select></div>
                        </div>

                        <button id="rnd-gen-btn" class="btn btn-primary" style="width: 100%; margin-top: 1rem; height: 3.5rem; font-weight: 700;">${txt.generate}</button>
                    </div>
                </div>

                <!-- Results -->
                <div class="main-region">
                    <div class="card" style="padding: 2rem; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 16px; text-align: center; min-height: 300px; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                        <div style="font-size: 0.8rem; opacity: 0.5; text-transform: uppercase; margin-bottom: 2rem;">${txt.result}</div>
                        
                        <div id="rnd-res-area" style="font-size: 3.5rem; font-weight: 900; color: var(--primary); line-height: 1.2; word-break: break-all;">-</div>
                        
                        <div id="rnd-color-px" style="width: 100px; height: 100px; border-radius: 50%; border: 4px solid white; box-shadow: 0 10px 30px rgba(0,0,0,0.3); margin-top: 1.5rem; display: none;"></div>
                        
                        <div id="team-res-list" style="margin-top: 2rem; width: 100%; display: grid; gap: 10px; text-align: left;"></div>

                        <button id="rnd-copy-btn" class="btn btn-outline btn-sm" style="margin-top: 2rem;">📋 ${txt.copy}</button>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    setupListeners() {
        const type = document.getElementById('rnd-type');
        const resArea = document.getElementById('rnd-res-area');
        const colorPx = document.getElementById('rnd-color-px');
        const teamRes = document.getElementById('team-res-list');

        const panels = {
            number: document.getElementById('pnl-number'),
            dice: document.getElementById('pnl-dice'),
            team: document.getElementById('pnl-names'),
            name: document.getElementById('pnl-names'),
            user: document.getElementById('pnl-user')
        };

        type.onchange = () => {
            Object.values(panels).forEach(p => p.style.display = 'none');
            const val = type.value;
            if (panels[val]) panels[val].style.display = 'block';
            document.getElementById('team-size-grp').style.display = (val === 'team') ? 'block' : 'none';
        };

        const generate = () => {
            const mode = type.value;
            let result = '';
            resArea.style.fontSize = '3.5rem';
            resArea.style.textAlign = 'center';
            resArea.style.whiteSpace = 'normal';
            colorPx.style.display = 'none';
            teamRes.innerHTML = '';

            const rg = window.DevTools.randomGenerator;

            switch (mode) {
                case 'number':
                    result = rg.number(parseInt(document.getElementById('num-min').value), parseInt(document.getElementById('num-max').value));
                    break;
                case 'dice': {
                    const sides = parseInt(document.getElementById('dice-s').value);
                    const count = parseInt(document.getElementById('dice-c').value);
                    const d = rg.multipleDice(sides, count);

                    if (sides === 6 && count <= 5) {
                        const faces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
                        const visual = d.rolls.map(r => faces[r - 1]).join(' ');
                        result = `${visual} (${d.total})`;
                    } else {
                        result = `🎲 ${d.total} [${d.rolls.join(', ')}]`;
                    }
                    if (count > 1) resArea.style.fontSize = '2.5rem';
                    break;
                }
                case 'uuid':
                    result = rg.uuid();
                    resArea.style.fontSize = '1.2rem';
                    break;
                case 'coin': {
                    const coinRes = rg.coinFlip();
                    const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
                    if (isTr) {
                        result = coinRes === 'Heads' ? '🌑 Yazı' : '🌕 Tura';
                    } else {
                        result = coinRes === 'Heads' ? '🌑 Heads' : '🌕 Tails';
                    }
                    break;
                }
                case 'color': {
                    const c = rg.randomColor();
                    result = c.hex;
                    colorPx.style.display = 'block';
                    colorPx.style.background = c.hex;
                    break;
                }
                case 'name': {
                    const names = document.getElementById('names-list').value.split('\n').filter(n => n.trim());
                    if (names.length) result = `🎯 ${rg.namePicker(names).picked}`;
                    else result = 'Empty List';
                    break;
                }
                case 'date': {
                    const start = new Date(1970, 0, 1);
                    const end = new Date();
                    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
                    result = randomDate.toISOString().split('T')[0];
                    break;
                }
                case 'team': {
                    const tNames = document.getElementById('names-list').value.split('\n').filter(n => n.trim());
                    const tCount = parseInt(document.getElementById('team-count').value);
                    if (tNames.length >= tCount) {
                        const tr = rg.teamPicker(tNames, tCount);
                        result = 'Teams Created';
                        resArea.style.fontSize = '1.5rem';
                        tr.teams.forEach((t, i) => {
                            teamRes.innerHTML += `<div class="card" style="padding:1rem; background:rgba(255,255,255,0.05);"><strong>Team ${i + 1}:</strong> ${t.join(', ')}</div>`;
                        });
                    } else result = 'Need more names';
                    break;
                }
                case 'lottery':
                    result = rg.lotteryNumbers(6, 49, 1).numbers.join(' - ');
                    resArea.style.fontSize = '2rem';
                    break;
                case 'user': {
                    const count = parseInt(document.getElementById('user-cnt').value) || 1;
                    const fmt = document.getElementById('user-fmt').value;
                    const users = [];
                    const firstNames = ["James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda", "David", "Elizabeth"];
                    const lasts = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis"];
                    const domains = ["gmail.com", "yahoo.com", "outlook.com", "example.org"];

                    for (let i = 0; i < count; i++) {
                        const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
                        const ln = lasts[Math.floor(Math.random() * lasts.length)];
                        users.push({
                            id: i + 1,
                            name: `${fn} ${ln}`,
                            email: `${fn.toLowerCase()}.${ln.toLowerCase()}@${domains[Math.floor(Math.random() * domains.length)]}`,
                            active: Math.random() > 0.2
                        });
                    }

                    if (fmt === 'json') {
                        result = JSON.stringify(users, null, 2);
                        resArea.style.fontSize = '0.9rem';
                        resArea.style.textAlign = 'left';
                        resArea.style.whiteSpace = 'pre';
                    } else {
                        result = "id,name,email,active\n" + users.map(u => `${u.id},${u.name},${u.email},${u.active}`).join('\n');
                        resArea.style.fontSize = '0.9rem';
                        resArea.style.textAlign = 'left';
                        resArea.style.whiteSpace = 'pre';
                    }
                    if (count === 1 && fmt === 'json') result = result.trim();
                    break;
                }
            }

            resArea.textContent = result;
        };

        document.getElementById('rnd-gen-btn').onclick = generate;
        document.getElementById('rnd-copy-btn').onclick = () => this.copyToClipboard(resArea.textContent);

        generate(); // Initial
    }
}

// Register tool
window.initRandomGeneratorLogic = RandomGeneratorTool;
