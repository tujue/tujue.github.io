/* TULPAR - Social Grid Studio Tool OOP Implementation */
class SocialGridStudioTool extends BaseTool {
    constructor(config) {
        super(config);
        this.img = null;
    }

    renderUI() {
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const txt = isTr ? {
            title: 'Sosyal Izgara Stüdyosu',
            upload: 'Görsel Yükle veya Sürükle',
            type: 'Parçalama Modu',
            slice: '✂️ Şimdi Parçala',
            help: 'İndirmek için parçaların üzerindeki butona tıklayın.'
        } : {
            title: 'Social Grid Studio',
            upload: 'Upload or Drag Image',
            type: 'Slicing Strategy',
            slice: '✂️ Slice Now',
            help: 'Click the download icon on each slice to save.'
        };

        return `
        <div class="tool-content grid-studio" style="max-width: 1200px; margin: 0 auto; padding: 20px;">
            <div class="grid-layout" style="display: grid; grid-template-columns: 320px 1fr; gap: 2.5rem;">
                
                <!-- Sidebar -->
                <div class="gs-sidebar">
                    <div id="gs-drop" class="card" style="padding: 2rem; border: 2px dashed var(--primary); border-radius: 20px; text-align: center; cursor: pointer; transition: 0.3s; background: rgba(99, 102, 241, 0.05); margin-bottom: 2rem;">
                        <input type="file" id="gs-file" hidden accept="image/*">
                        <div style="font-size: 2.5rem; margin-bottom: 1rem;">📷</div>
                        <h5 style="font-size: 0.85rem;">${txt.upload}</h5>
                    </div>

                    <div class="card" style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border-color); border-radius: 20px;">
                        <h4 style="font-size: 0.75rem; text-transform: uppercase; color: var(--primary); margin-bottom: 1.5rem;">${txt.type}</h4>
                        
                        <select id="gs-in-type" class="form-input" style="margin-bottom: 1rem;">
                            <optgroup label="SQUARES">
                                <option value="3x3">3x3 (Full Profile)</option>
                                <option value="3x2">3x2 Grid</option>
                                <option value="3x1">3x1 Banner</option>
                            </optgroup>
                            <optgroup label="PANORAMA">
                                <option value="pano-2">2-Screen Swipe</option>
                                <option value="pano-3" selected>3-Screen Swipe</option>
                            </optgroup>
                        </select>

                        <button id="gs-btn-run" class="btn btn-primary" style="width: 100%; height: 3.5rem; font-weight: 700; font-size: 1rem;" disabled>${txt.slice}</button>
                        
                        <p style="margin-top: 1.5rem; font-size: 0.75rem; opacity: 0.5; text-align: center;">${txt.help}</p>
                    </div>
                </div>

                <!-- Preview Area -->
                <div class="gs-main">
                    <div id="gs-empty" class="card" style="height: 100%; min-height: 500px; display: flex; align-items: center; justify-content: center; opacity: 0.3; border: 1px dashed var(--border-color); border-radius: 24px;">
                        <h3>Select an image to see preview</h3>
                    </div>
                    <div id="gs-out-grid" style="display: none;">
                        <!-- Generated tiles -->
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    setupListeners() {
        const drop = document.getElementById('gs-drop');
        const file = document.getElementById('gs-file');
        const btn = document.getElementById('gs-btn-run');
        const type = document.getElementById('gs-in-type');

        drop.onclick = () => file.click();
        file.onchange = (e) => {
            const f = e.target.files[0];
            if (!f) return;
            const r = new FileReader();
            r.onload = (re) => {
                this.img = new Image();
                this.img.onload = () => {
                    btn.disabled = false;
                    drop.style.borderColor = '#10b981';
                    drop.innerHTML = `<h5>Loaded: ${f.name}</h5>`;
                };
                this.img.src = re.target.result;
            };
            r.readAsDataURL(f);
        };

        btn.onclick = () => {
            if (!this.img) return;
            const mode = type.value;
            let rows = 1, cols = 3, isPano = mode.startsWith('pano');

            if (mode === '3x3') { rows = 3; cols = 3; }
            else if (mode === '3x2') { rows = 2; cols = 3; }
            else if (mode === 'pano-2') { rows = 1; cols = 2; }

            const w = this.img.width, h = this.img.height;
            const out = document.getElementById('gs-out-grid');
            document.getElementById('gs-empty').style.display = 'none';
            out.style.display = 'grid';
            out.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
            out.style.gap = '10px';
            out.innerHTML = '';

            // Grid Calculation Logic
            let cellW, cellH, startX, startY;

            if (!isPano) {
                // For Grids (Squares): We must crop the image to fit the grid ratio calculated as (cols/rows)
                // This ensures each cell is a perfect square.
                const targetValuesRatio = cols / rows; // e.g. 3/3 = 1, 3/2 = 1.5
                const imgRatio = w / h;

                let cropW, cropH;

                if (imgRatio > targetValuesRatio) {
                    // Image is wider than needed -> Crop Width (center)
                    cropH = h;
                    cropW = h * targetValuesRatio;
                    startX = (w - cropW) / 2;
                    startY = 0;
                } else {
                    // Image is taller than needed -> Crop Height (center)
                    cropW = w;
                    cropH = w / targetValuesRatio;
                    startX = 0;
                    startY = (h - cropH) / 2;
                }

                cellW = cropW / cols;
                cellH = cropH / rows;
            } else {
                // For Panorama: Use full image width/height divided by cols/rows
                // Panoramas usually use the whole image.
                cellW = w / cols;
                cellH = h / rows;
                startX = 0;
                startY = 0;
            }

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const canvas = document.createElement('canvas');
                    canvas.width = cellW; canvas.height = cellH;

                    // Draw the specific chunk
                    canvas.getContext('2d').drawImage(
                        this.img,
                        startX + c * cellW, startY + r * cellH, cellW, cellH, // Source
                        0, 0, cellW, cellH // Dest
                    );

                    const url = canvas.toDataURL('image/jpeg', 0.95);

                    const tile = document.createElement('div');
                    tile.style.cssText = 'position:relative; background:#000; border-radius:12px; overflow:hidden; aspect-ratio:1/1;';
                    // Panoramas might not be square, so let them be flexible or fit content
                    if (isPano) tile.style.aspectRatio = `${cellW}/${cellH}`;

                    tile.innerHTML = `
                        <img src="${url}" style="width:100%; height:100%; object-fit:cover;">
                        <a href="${url}" download="TULPAR_Grid_${r + 1}_${c + 1}.jpg" style="position:absolute; bottom:10px; right:10px; width:32px; height:32px; background:var(--primary); color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; text-decoration:none; font-weight:900; box-shadow: 0 2px 5px rgba(0,0,0,0.5);">↓</a>
                        <span style="position:absolute; top:10px; left:10px; font-size:0.6rem; background:rgba(0,0,0,0.6); color:white; padding:3px 6px; border-radius:4px;">#${r * cols + c + 1}</span>
                    `;
                    out.appendChild(tile);
                }
            }
        };
    }
}

// Register tool
window.initSocialGridMakerLogic = SocialGridStudioTool;
