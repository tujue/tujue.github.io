/**
 * TULPAR - Main Application Entry Point
 * Orchestrates modular tool loading and legacy fallbacks
 */

// Initialize Application State
window.AppState = window.AppState || {
    totalToolsUsed: 0,
    totalCopies: 0,
    currentTool: null,
    activeCleanup: null
};

/**
 * Update UI Stats
 */
window.updateStats = function () {
    const toolsUsedEl = document.getElementById('tools-used');
    const totalCopiesEl = document.getElementById('total-copies');
    if (toolsUsedEl) toolsUsedEl.textContent = window.AppState.totalToolsUsed || 0;
    if (totalCopiesEl) totalCopiesEl.textContent = window.AppState.totalCopies || 0;
};

/**
 * Helper to get init function name from toolId
 */
function getInitFuncName(toolId) {
    // All tools now follow consistent OOP naming: initCamelCaseLogic
    // Special cases maintained only for historical compatibility
    const specialCases = {
        'qr-generator': 'initQRLogic',
        'p2p-transfer': 'initP2PLogic',
        'og-image-generator': 'initOgImageLogic'
    };

    if (specialCases[toolId]) return specialCases[toolId];

    // Standard pattern: initCamelCaseLogic
    return `init${toolId.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('')}Logic`;
}

/**
 * Helper to load a script dynamically
 */
function loadToolScript(toolId) {
    return new Promise((resolve, reject) => {
        // All tools now use 1:1 filename mapping (toolId === fileName)
        const scriptId = `script-tool-${toolId}`;

        if (document.getElementById(scriptId)) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.id = scriptId;
        script.src = `scripts/tools/${toolId}.js?v=3.10.4`;
        script.onload = resolve;
        script.onerror = () => {
            console.error(`Failed to load tool script: ${toolId}.js`);
            reject();
        };
        document.body.appendChild(script);
    });
}

/**
 * Generate UI for a tool -  Router for template generation
 */
window.generateToolUI = function (toolId) {
    const initFuncName = getInitFuncName(toolId);
    const toolRef = window[initFuncName];

    // If it's a class-based tool, it will handle its own rendering in setupToolListeners
    if (typeof toolRef === 'function' && toolRef.prototype instanceof BaseTool) {
        return '';
    }

    if (toolRef && toolRef.template) {
        return typeof toolRef.template === 'function'
            ? toolRef.template()
            : toolRef.template;
    }

    // Return a functional placeholder for missing templates
    const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
    return `
        <div style="padding: 2rem; text-align: center; background: var(--surface); border-radius: 12px; border: 1px dashed var(--border-color);">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🏗️</div>
            <h3 style="margin-bottom: 0.5rem;">${isTr ? 'Modül Yapılandırması Bekleniyor' : 'Module Implementation Pending'}</h3>
            <p style="color: var(--text-secondary); max-width: 400px; margin: 0 auto 1.5rem;">
                ${isTr ? `${toolId} aracı için UI şablonu henüz modüler sisteme taşınmadı.` : `The UI template for ${toolId} hasn't been moved to the modular system yet.`}
            </p>
            <div style="font-size: 0.8rem; font-family: monospace; padding: 0.5rem; background: var(--bg-primary); border-radius: 4px; display: inline-block;">
                ID: ${toolId} | Function: ${initFuncName}
            </div>
        </div>
    `;
};

/**
 * Async wrapper to ensure script is loaded before UI generation
 */
window.generateToolUIAsync = async function (toolId) {
    const initFuncName = getInitFuncName(toolId);

    // Ensure script is loaded FIRST
    if (!window[initFuncName]) {
        try {
            await loadToolScript(toolId);
        } catch (e) {
            console.error(`Failed to load script for tool ${toolId}:`, e);
        }
    }

    // Now generate UI with loaded script
    return window.generateToolUI(toolId);
};

/**
 * Setup Tool Listeners - Router for tool initialization
 */
window.setupToolListeners = async function (toolId) {
    const initFuncName = getInitFuncName(toolId);

    // Ensure tool script is loaded
    if (!window[initFuncName]) {
        try {
            await loadToolScript(toolId);
        } catch (e) {
            console.error(`Error loading script for tool ${toolId}:`, e);
            return;
        }
    }

    const toolRef = window[initFuncName];
    const workspaceBody = document.getElementById('workspace-body');

    // Class-based Tool
    if (typeof toolRef === 'function' && toolRef.prototype instanceof BaseTool) {
        console.log(`🚀 Initializing class-based tool: ${toolId}`);
        const instance = new toolRef({ id: toolId });
        instance.render(workspaceBody);
        window.AppState.activeToolInstance = instance; // Store for cleanup
    }
    // Functional Tool
    else if (typeof toolRef === 'function') {
        console.log(`🚀 Initializing modular tool: ${toolId} via ${initFuncName}`);
        try {
            toolRef();
        } catch (e) {
            console.error(`Error initializing tool ${toolId}:`, e);
        }
    } else {
        console.warn(`⚠️ No initialization function [${initFuncName}] found for tool: ${toolId}`);
    }
};

/**
 * Global increment tool usage helper
 */
window.incrementToolUsage = function () {
    window.AppState.totalToolsUsed++;
    localStorage.setItem('devToolsUsed', window.AppState.totalToolsUsed);
    window.updateStats();
};

/**
 * App Initialization
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('✨ TULPAR Initializing...');

    // Load stats from localStorage
    window.AppState.totalToolsUsed = parseInt(localStorage.getItem('devToolsUsed') || '0');
    window.AppState.totalCopies = parseInt(localStorage.getItem('devToolsCopies') || '0');
    window.updateStats();

    // Re-verify TOOLS array is available
    if (typeof TOOLS === 'undefined') {
        console.error('CRITICAL: TOOLS definition not found!');
    }

    // Language Dropdown
    const langSelect = document.getElementById('language-select');
    if (langSelect && window.i18n) {
        langSelect.value = window.i18n.getCurrentLanguage();
        langSelect.addEventListener('change', (e) => {
            window.i18n.setLanguage(e.target.value);
            // Re-render cards for translations
            if (window.renderToolCards) window.renderToolCards();
        });
    }

    // Initial translation update
    if (window.i18n) {
        window.i18n.updateUI();
    }

    // Rendering cards - wait for ES6 modules to load and export to window
    setTimeout(() => {
        if (window.renderToolCards) {
            window.renderToolCards();
        } else {
            console.error('window.renderToolCards not found. Check modular loading.');
            // Fallback: try again after a bit more time
            setTimeout(() => {
                if (window.renderToolCards) {
                    window.renderToolCards();
                } else {
                    console.error('CRITICAL: renderToolCards still not available after 1s.');
                }
            }, 500);
        }
    }, 500);
});

