/**
 * Application State Management
 * Centralized state for the application
 */

export const AppState = {
    currentTool: null,
    toolsUsed: 0,
    totalCopies: 0,
    activeCleanup: null
};

/**
 * Update statistics display
 */
export function updateStats() {
    const toolsUsedEl = document.getElementById('tools-used');
    const totalCopiesEl = document.getElementById('total-copies');

    if (toolsUsedEl) toolsUsedEl.textContent = AppState.toolsUsed;
    if (totalCopiesEl) totalCopiesEl.textContent = AppState.totalCopies;
}

/**
 * Save statistics to localStorage
 */
export function saveStats() {
    localStorage.setItem('devToolsStats', JSON.stringify({
        toolsUsed: AppState.toolsUsed,
        totalCopies: AppState.totalCopies
    }));
}

/**
 * Load statistics from localStorage
 */
export function loadStats() {
    const savedStats = localStorage.getItem('devToolsStats');
    if (savedStats) {
        const stats = JSON.parse(savedStats);
        AppState.toolsUsed = stats.toolsUsed || 0;
        AppState.totalCopies = stats.totalCopies || 0;
        updateStats();
    }
}

/**
 * Increment tool usage counter
 */
export function incrementToolUsage() {
    AppState.toolsUsed++;
    updateStats();
    saveStats();
}

/**
 * Increment copy counter
 */
export function incrementCopyCount() {
    AppState.totalCopies++;
    updateStats();
    saveStats();
}

export default AppState;
