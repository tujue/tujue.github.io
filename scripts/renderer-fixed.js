/**
 * Tool Renderer - Non-Module Version
 * Renders tool cards in the grid
 */

(function () {
    'use strict';

    /**
     * Get translated tool info
     */
    function getTranslatedTool(tool, lang) {
        // Method 1: Try i18n service (Best for dynamic language switching)
        if (window.i18n) {
            const i18nName = window.i18n.t(`tool.${tool.id}.name`, null);
            const i18nDesc = window.i18n.t(`tool.${tool.id}.desc`, null);

            // If i18n found a translation (and it's not the key itself), use it
            if (i18nName && i18nName !== `tool.${tool.id}.name`) {
                return {
                    name: i18nName,
                    description: i18nDesc || tool.description
                };
            }
        }

        // Method 2: Legacy 'tr' property in definitions (Fallback)
        if (lang === 'tr') {
            const tr = tool.tr;
            if (tr) {
                return {
                    name: tr.name || tool.name,
                    description: tr.description || tool.description
                };
            }
        }

        // Default
        return {
            name: tool.name,
            description: tool.description
        };
    }

    /**
     * Render tool cards in grid
     */
    function renderToolCards() {
        const toolsGrid = document.getElementById('tools-grid');
        if (!toolsGrid) {
            console.error('Tools grid not found');
            return;
        }

        toolsGrid.innerHTML = ''; // Clear existing

        const savedFavs = JSON.parse(localStorage.getItem('devToolsFavs') || '[]');

        // Use window.TOOLS
        const tools = window.TOOLS || window.TOOLS_DEFINITIONS || [];

        if (tools.length === 0) {
            console.error('No tools found in window.TOOLS!');
            return;
        }

        // Sort tools: Favorites first
        const sortedTools = [...tools].sort((a, b) => {
            const aFav = savedFavs.includes(a.id);
            const bFav = savedFavs.includes(b.id);
            if (aFav && !bFav) return -1;
            if (!aFav && bFav) return 1;
            return 0;
        });

        // Get current language
        const currentLang = window.i18n ? window.i18n.getCurrentLanguage() : 'en';

        sortedTools.forEach(tool => {
            const isFav = savedFavs.includes(tool.id);
            const card = document.createElement('div');
            card.className = 'tool-card';
            card.setAttribute('data-tool-id', tool.id);

            if (isFav) {
                card.style.borderColor = 'var(--primary)';
                card.style.background = 'linear-gradient(to bottom right, var(--bg-secondary), rgba(59, 130, 246, 0.05))';
            }

            // Get translated name and description
            const translated = getTranslatedTool(tool, currentLang);

            card.innerHTML = `
          <div class="tool-header">
            <div class="tool-icon">${tool.icon}</div>
            <div style="flex:1;">
                <h3 class="tool-title" style="margin-bottom:0;">${translated.name}</h3>
            </div>
            <button class="fav-btn" onclick="event.stopPropagation(); toggleFav('${tool.id}')" title="Add to Favorites">
                ${isFav ? '★' : '☆'}
            </button>
          </div>
          <p class="tool-description">${translated.description}</p>
          <div class="tool-tags">
            ${(tool.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
        `;

            card.addEventListener('click', async (e) => {
                if (e.target.closest('.fav-btn')) return;
                // Use window.openTool if available
                if (window.openTool) {
                    await window.openTool(tool.id);
                } else {
                    console.warn('window.openTool not available yet');
                }
            });

            toolsGrid.appendChild(card);
        });

        console.log(`✅ Rendered ${sortedTools.length} tool cards`);
    }

    /**
     * Toggle favorite tool
     */
    function toggleFav(id) {
        const savedFavs = JSON.parse(localStorage.getItem('devToolsFavs') || '[]');
        const index = savedFavs.indexOf(id);

        if (index === -1) {
            savedFavs.push(id);
        } else {
            savedFavs.splice(index, 1);
        }

        localStorage.setItem('devToolsFavs', JSON.stringify(savedFavs));
        renderToolCards(); // Re-render to update sorting
    }

    // Make globally available
    if (typeof window !== 'undefined') {
        window.renderToolCards = renderToolCards;
        window.toggleFav = toggleFav;
        console.log('✅ renderToolCards available globally');
    }
})();
