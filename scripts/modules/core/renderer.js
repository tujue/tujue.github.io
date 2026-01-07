/**
 * Tool Renderer
 * Renders tool cards in the grid
 */

import { getAllTools, getToolName, getToolDescription } from '../config/tools.js';
import { openTool } from './workspace.js';

/**
 * Turkish translations map (comprehensive)
 */
const TR_TRANSLATIONS = {
    'base64-tool': { name: 'Base64 Kodlayıcı/Çözücü', description: 'Metni Base64\'e kodlayın veya Base64 dizelerini tekrar metne çözün' },
    'regex-tester': { name: 'Regex Test Aracı', description: 'Canlı geri bildirim ve eşleşme vurgulama ile düzenli ifadelerinizi test edin' },
    'url-tool': { name: 'URL Kodlayıcı/Çözücü', description: 'URL\'leri kodlayın ve çözün, URL bileşenlerini ayrıştırın' },
    'hash-generator': { name: 'Hash Oluşturucu', description: 'MD5, SHA-1, SHA-256, SHA-512 hash değerleri oluşturun' },
    'password-generator': { name: 'Şifre Oluşturucu', description: 'Anında güvenli rastgele şifreler oluşturun' },
    'qr-generator': { name: 'QR Kod Oluşturucu', description: 'URL, metin, WiFi ve daha fazlası için QR kodları oluşturun' },
    // Add more as needed...
};

/**
 * Get translated tool info
 */
function getTranslatedTool(tool, lang) {
    if (lang === 'tr') {
        const tr = tool.tr || TR_TRANSLATIONS[tool.id];
        if (tr) {
            return {
                name: tr.name || tool.name,
                description: tr.description || tool.description
            };
        }
    }
    return {
        name: tool.name,
        description: tool.description
    };
}

/**
 * Render tool cards in grid
 */
export function renderToolCards() {
    const toolsGrid = document.getElementById('tools-grid');
    if (!toolsGrid) {
        console.error('Tools grid not found');
        return;
    }

    toolsGrid.innerHTML = ''; // Clear existing

    const savedFavs = JSON.parse(localStorage.getItem('devToolsFavs') || '[]');
    const tools = getAllTools();

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
            card.style.background = 'linear-gradient(to bottom right, var(--bg-secondary), rgba(var(--primary-rgb), 0.05))';
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
            await openTool(tool.id);
        });

        toolsGrid.appendChild(card);
    });
}

/**
 * Toggle favorite tool
 */
export function toggleFav(id) {
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
}

export default {
    renderToolCards,
    toggleFav
};
