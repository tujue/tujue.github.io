/**
 * Workspace Manager - Non-Module Version
 * Handles opening/closing tools workspace
 */

(function () {
    'use strict';

    // Local AppState reference
    const AppState = window.AppState || {
        currentTool: null,
        activeToolInstance: null,
        activeCleanup: null,
        totalToolsUsed: 0
    };

    /**
     * Get tool by ID from window.TOOLS
     */
    function getToolById(toolId) {
        const tools = window.TOOLS || window.TOOLS_DEFINITIONS || [];
        return tools.find(t => t.id === toolId);
    }

    /**
     * Get tool name (translated if applicable)
     */
    function getToolName(tool, lang) {
        // Method 1: Try i18n
        if (window.i18n) {
            const i18nName = window.i18n.t(`tool.${tool.id}.name`, null);
            if (i18nName && i18nName !== `tool.${tool.id}.name`) {
                return i18nName;
            }
        }

        // Method 2: Legacy
        if (lang === 'tr' && tool.tr && tool.tr.name) {
            return tool.tr.name;
        }
        return tool.name;
    }

    /**
     * Increment tool usage
     */
    function incrementToolUsage() {
        AppState.totalToolsUsed++;
        localStorage.setItem('devToolsUsed', AppState.totalToolsUsed);
        if (window.updateStats) window.updateStats();
    }

    /**
     * Open tool in workspace
     */
    async function openTool(toolId) {
        AppState.currentTool = toolId;
        const workspace = document.getElementById('workspace');
        const workspaceBody = document.getElementById('workspace-body');
        const workspaceTitle = document.getElementById('workspace-title');

        const tool = getToolById(toolId);
        if (!tool) {
            console.error(`Tool not found: ${toolId}`);
            return;
        }

        // Get current language
        const currentLang = window.i18n ? window.i18n.getCurrentLanguage() : 'en';
        const toolName = getToolName(tool, currentLang);

        workspaceTitle.textContent = toolName;

        // Load external dependencies first (if any)
        if (window.LazyLoader) {
            try {
                await window.LazyLoader.loadToolDependencies(toolId);
            } catch (error) {
                console.warn(`Failed to load dependencies for ${toolId}:`, error);
            }
        }

        // Generate tool UI (async to ensure scripts are loaded)
        if (window.generateToolUIAsync) {
            workspaceBody.innerHTML = await window.generateToolUIAsync(toolId);
        } else if (window.generateToolUI) {
            workspaceBody.innerHTML = window.generateToolUI(toolId);
        } else {
            workspaceBody.innerHTML = '<p>Tool implementation not found.</p>';
        }

        // Setup tool-specific listeners (legacy)
        if (window.setupToolListeners) {
            window.setupToolListeners(toolId);
        }

        // Show workspace
        workspace.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Increment usage stats
        incrementToolUsage();
    }

    /**
     * Close workspace
     */
    function closeWorkspace() {
        const workspace = document.getElementById('workspace');
        const workspaceBody = document.getElementById('workspace-body');

        // Run cleanup for OOP-based tools (onClose lifecycle method)
        if (AppState.activeToolInstance) {
            try {
                if (typeof AppState.activeToolInstance.onClose === 'function') {
                    AppState.activeToolInstance.onClose();
                } else if (typeof AppState.activeToolInstance.cleanup === 'function') {
                    // Fallback for older implementation
                    AppState.activeToolInstance.cleanup();
                }
            } catch (error) {
                console.error('Tool cleanup error:', error);
            }
        }

        // Run cleanup for legacy functional tools
        if (AppState.activeCleanup && typeof AppState.activeCleanup === 'function') {
            try {
                AppState.activeCleanup();
            } catch (error) {
                console.error('Legacy cleanup error:', error);
            }
        }

        // Clear state
        AppState.currentTool = null;
        AppState.activeToolInstance = null;
        AppState.activeCleanup = null;

        // Hide workspace
        workspace.classList.remove('active');
        document.body.style.overflow = '';

        // Clear content after animation
        setTimeout(() => {
            workspaceBody.innerHTML = '';
        }, 300);
    }

    /**
     * Setup workspace event listeners
     */
    function setupWorkspaceListeners() {
        // Close on background click
        const workspace = document.getElementById('workspace');
        if (workspace) {
            workspace.addEventListener('click', (e) => {
                if (e.target.id === 'workspace') {
                    closeWorkspace();
                }
            });
        }

        // Close button
        const closeBtn = document.getElementById('close-workspace');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeWorkspace);
        }

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && AppState.currentTool) {
                closeWorkspace();
            }
        });
    }

    // Make functions globally available
    if (typeof window !== 'undefined') {
        window.openTool = openTool;
        window.closeWorkspace = closeWorkspace;
        window.setupWorkspaceListeners = setupWorkspaceListeners;
        console.log('✅ Workspace functions available globally');
    }

    // Auto-initialize listeners
    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupWorkspaceListeners);
        } else {
            setupWorkspaceListeners();
        }
    }
})();
