/* ============================================
   UI ENHANCEMENTS
   Keyboard shortcuts, search, categories
   ============================================ */

const UIEnhancements = {
    // ========== KEYBOARD SHORTCUTS ==========
    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K: Quick tool search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.openQuickSearch();
            }

            // ESC: Close workspace (already handled in main.js)

            // Ctrl/Cmd + /: Show keyboard shortcuts
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                e.preventDefault();
                this.showKeyboardShortcuts();
            }

            // Ctrl/Cmd + C: Copy output (when workspace is open)
            if ((e.ctrlKey || e.metaKey) && e.key === 'c' && AppState.currentTool) {
                // Will use default browser copy behavior
            }
        });
    },

    // ========== QUICK TOOL SEARCH ==========
    openQuickSearch() {
        // Check if already exists
        if (document.getElementById('quick-search-modal')) return;

        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const placeholder = isTr ? '🔍 Araçları ara... (filtrelemek için yazın)' : '🔍 Search tools... (type to filter)';

        const modal = document.createElement('div');
        modal.id = 'quick-search-modal';
        modal.innerHTML = `
            <div class="quick-search-overlay" onclick="UIEnhancements.closeQuickSearch()"></div>
            <div class="quick-search-container">
                <input 
                    type="text" 
                    id="quick-search-input" 
                    class="quick-search-input" 
                    placeholder="${placeholder}"
                    autofocus
                />
                <div id="quick-search-results" class="quick-search-results"></div>
            </div>
        `;

        document.body.appendChild(modal);

        // Style
        const style = document.createElement('style');
        style.textContent = `
            #quick-search-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 10000;
                display: flex;
                align-items: flex-start;
                justify-content: center;
                padding-top: 15vh;
            }
            .quick-search-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(4px);
            }
            .quick-search-container {
                position: relative;
                width: 90%;
                max-width: 600px;
                background: var(--bg-secondary);
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                overflow: hidden;
                animation: slideDown 0.2s ease;
            }
            @keyframes slideDown {
                from { opacity: 0; transform: translateY(-20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .quick-search-input {
                width: 100%;
                padding: 1.2rem 1.5rem;
                font-size: 1.1rem;
                border: none;
                background: transparent;
                color: var(--text-primary);
                outline: none;
                border-bottom: 1px solid var(--border-color);
            }
            .quick-search-results {
                max-height: 400px;
                overflow-y: auto;
            }
            .quick-search-item {
                padding: 1rem 1.5rem;
                cursor: pointer;
                transition: background 0.15s;
                border-bottom: 1px solid var(--border-color);
            }
            .quick-search-item:hover {
                background: rgba(255, 255, 255, 0.05);
            }
            .quick-search-item.selected {
                background: var(--primary);
            }
            .quick-search-item.selected .quick-search-item-title,
            .quick-search-item.selected .quick-search-item-desc {
                color: white;
            }
            .quick-search-item-title {
                font-weight: 600;
                color: var(--text-primary);
                margin-bottom: 0.25rem;
            }
            .quick-search-item-desc {
                font-size: 0.85rem;
                color: var(--text-secondary);
            }
            .quick-search-item-tags {
                margin-top: 0.5rem;
                display: flex;
                gap: 0.5rem;
                flex-wrap: wrap;
            }
            .quick-search-tag {
                padding: 2px 8px;
                background: var(--primary-alpha);
                color: var(--primary);
                border-radius: 4px;
                font-size: 0.75rem;
            }
        `;
        document.head.appendChild(style);

        // Render all tools initially
        this.renderSearchResults(TOOLS);

        // Track selection
        this.selectedIndex = -1;

        // Search functionality
        const input = document.getElementById('quick-search-input');
        input.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = TOOLS.filter(tool =>
                tool.name.toLowerCase().includes(query) ||
                tool.description.toLowerCase().includes(query) ||
                tool.tags.some(tag => tag.toLowerCase().includes(query))
            );
            this.filteredTools = filtered; // Store for navigation
            this.selectedIndex = -1;
            this.renderSearchResults(filtered);
        });

        // ESC to close
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeQuickSearch();
            }

            const results = document.querySelectorAll('.quick-search-item');
            if (results.length === 0) return;

            // Arrow keys for navigation
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.selectedIndex = (this.selectedIndex + 1) % results.length;
                this.updateSelection(results);
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.selectedIndex = (this.selectedIndex - 1 + results.length) % results.length;
                this.updateSelection(results);
            }

            // Enter to select
            if (e.key === 'Enter') {
                e.preventDefault();
                const selected = this.selectedIndex >= 0 ? this.filteredTools[this.selectedIndex] : this.filteredTools[0];
                if (selected) {
                    this.closeQuickSearch();
                    openTool(selected.id);
                }
            }
        });
    },

    updateSelection(results) {
        results.forEach((el, i) => {
            if (i === this.selectedIndex) {
                el.classList.add('selected');
                el.scrollIntoView({ block: 'nearest' });
            } else {
                el.classList.remove('selected');
            }
        });
    },

    renderSearchResults(tools) {
        const resultsContainer = document.getElementById('quick-search-results');
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
        const noTools = isTr ? 'Araç bulunamadı' : 'No tools found';

        if (!tools || tools.length === 0) {
            resultsContainer.innerHTML = `
                <div style="padding: 2rem; text-align: center; color: var(--text-secondary);">
                    ${noTools}
                </div>
            `;
            return;
        }

        resultsContainer.innerHTML = tools.map(tool => {
            let toolName = tool.name;
            let toolDesc = tool.description;
            if (window.i18n && window.i18n.getCurrentLanguage() === 'tr') {
                toolName = window.i18n.t(`tool.${tool.id}.name`, toolName);
                toolDesc = window.i18n.t(`tool.${tool.id}.desc`, toolDesc);
            }
            return `
            <div class="quick-search-item" onclick="UIEnhancements.selectTool('${tool.id}')">
                <div class="quick-search-item-title">${tool.icon} ${toolName}</div>
                <div class="quick-search-item-desc">${toolDesc}</div>
                <div class="quick-search-item-tags">
                    ${tool.tags.map(tag => `<span class="quick-search-tag">${tag}</span>`).join('')}
                </div>
            </div>`;
        }).join('');
    },

    selectTool(toolId) {
        this.closeQuickSearch();
        openTool(toolId);
    },

    closeQuickSearch() {
        const modal = document.getElementById('quick-search-modal');
        if (modal) {
            modal.remove();
        }
    },

    // ========== KEYBOARD SHORTCUTS HELP ==========
    showKeyboardShortcuts() {
        const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';

        if (isTr) {
            alert(`⌨️ KLAVYE KISAYOLLARI

Ctrl/Cmd + K  →  Hızlı araç arama
Ctrl/Cmd + /  →  Bu menüyü göster
ESC           →  Aracı/pencereyi kapat
Ctrl/Cmd + C  →  Çıktıyı kopyala

💡 İpucu: Araçları hızlıca bulmak için Ctrl+K kullanın!`);
        } else {
            alert(`⌨️ KEYBOARD SHORTCUTS

Ctrl/Cmd + K  →  Quick tool search
Ctrl/Cmd + /  →  Show this help
ESC           →  Close tool/modal
Ctrl/Cmd + C  →  Copy output

💡 Tip: Use Ctrl+K to quickly find and open tools!`);
        }
    },

    // ========== TOOL CATEGORIES FILTER ==========
    initCategoryFilter() {
        const toolsSection = document.querySelector('.tools-section');
        if (!toolsSection) return;

        const categoryFilter = document.createElement('div');
        categoryFilter.className = 'category-filter';

        const getCategoryName = (key, fallback) => {
            return window.i18n ? window.i18n.t(key, fallback) : fallback;
        };

        const updateCategoryText = () => {
            const filterTitle = categoryFilter.querySelector('.filter-title');
            if (filterTitle) filterTitle.textContent = getCategoryName('category.title', 'Filter by category:');

            const cats = ['all', 'developer', 'image', 'design', 'document', 'converter', 'security', 'other'];
            cats.forEach(cat => {
                const btn = categoryFilter.querySelector(`.category-btn[data-category="${cat}"]`);
                if (btn) {
                    // Capitalize fallback
                    const fallback = cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1);
                    btn.textContent = getCategoryName(`category.${cat}`, fallback);
                }
            });
        };

        // Initial Render
        const title = getCategoryName('category.title', 'Filter by category:');
        categoryFilter.innerHTML = `
            <div style="text-align: center; margin-bottom: 2rem;">
                <div class="filter-title" style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1rem;">
                    ${title}
                </div>
                <div class="category-buttons">
                    <button class="category-btn active" data-category="all" data-i18n="category.all">All</button>
                    <button class="category-btn" data-category="developer" data-i18n="category.developer">Developer</button>
                    <button class="category-btn" data-category="image" data-i18n="category.image">Image</button>
                    <button class="category-btn" data-category="design" data-i18n="category.design">Design</button>
                    <button class="category-btn" data-category="document" data-i18n="category.document">Document</button>
                    <button class="category-btn" data-category="converter" data-i18n="category.converter">Converter</button>
                    <button class="category-btn" data-category="security" data-i18n="category.security">Security</button>
                    <button class="category-btn" data-category="other" data-i18n="category.other">Other</button>
                </div>
            </div>
        `;

        // Style
        const style = document.createElement('style');
        style.textContent = `
            .category-buttons {
                display: flex;
                gap: 0.75rem;
                justify-content: center;
                flex-wrap: wrap;
            }
            .category-btn {
                padding: 0.5rem 1.0rem;
                background: var(--surface);
                border: 1px solid var(--border-color);
                border-radius: 8px;
                color: var(--text-secondary);
                cursor: pointer;
                transition: all 0.2s;
                font-size: 0.85rem;
            }
            .category-btn:hover {
                background: var(--bg-secondary);
                border-color: var(--primary);
                color: var(--text-primary);
            }
            .category-btn.active {
                background: var(--primary);
                border-color: var(--primary);
                color: white;
            }
        `;
        document.head.appendChild(style);

        // Insert before tools grid
        const toolsGrid = document.getElementById('tools-grid');
        toolsGrid.parentElement.insertBefore(categoryFilter, toolsGrid);

        // Listen for language changes
        window.addEventListener('languageChanged', updateCategoryText);

        // Add event listeners
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filter tools
                const category = btn.dataset.category;
                this.filterToolsByCategory(category);
            });
        });
    },

    filterToolsByCategory(category) {
        const toolCards = document.querySelectorAll('.tool-card');

        toolCards.forEach(card => {
            const toolId = card.dataset.toolId;
            const tool = TOOLS.find(t => t.id === toolId);
            if (!tool) return;

            if (category === 'all') {
                card.style.display = 'block';
                return;
            }



            // Direct Category Match
            if (tool.category === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    },

    // ========== INITIALIZE ALL ==========
    init() {
        this.initKeyboardShortcuts();
        // Category filter will be added after DOM is ready
        setTimeout(() => {
            this.initCategoryFilter();

            // Bind Main Search Input
            const mainSearch = document.getElementById('main-search');
            if (mainSearch) {
                mainSearch.addEventListener('input', (e) => {
                    const query = e.target.value.toLowerCase();
                    const toolCards = document.querySelectorAll('.tool-card');

                    toolCards.forEach(card => {
                        const title = card.querySelector('.tool-title').innerText.toLowerCase();
                        const desc = card.querySelector('.tool-description').innerText.toLowerCase();
                        const tags = Array.from(card.querySelectorAll('.tag')).map(t => t.innerText.toLowerCase());

                        // Check if matches query
                        const hasMatch = title.includes(query) || desc.includes(query) || tags.some(t => t.includes(query));

                        // Respect current category if needed, but usually search overrides category
                        if (hasMatch) {
                            card.style.display = 'block';
                            // Add highlight effect
                            card.style.animation = 'fadeIn 0.3s ease';
                        } else {
                            card.style.display = 'none';
                        }
                    });

                    // Reset category active state if searching
                    document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                });

                // (Ctrl+K listener removed from here as it is already handled in initKeyboardShortcuts)
            }
        }, 500);
    }
};

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    UIEnhancements.init();
});

// Export globally
window.UIEnhancements = UIEnhancements;
