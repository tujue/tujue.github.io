/**
 * Base Tool Class
 * All tools extend from this base class
 */
class BaseTool {
    constructor(config) {
        this.id = config.id;
        this.name = config.name;
        this.description = config.description;
    }

    /**
     * Generate tool UI (must be implemented by each tool)
     */
    renderUI() {
        throw new Error('renderUI() must be implemented');
    }

    /**
     * Setup event listeners (must be implemented by each tool)
     */
    setupListeners() {
        // Optional: Override if needed
    }

    /**
     * Cleanup when tool is closed
     */
    cleanup() {
        // Optional: Override if needed
    }

    /**
     * Helper: Get i18n text
     */
    t(key) {
        return window.i18n ? window.i18n.t(key) : key;
    }

    /**
     * Helper: Copy to clipboard
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
            this.showNotification(isTr ? 'Panoya kopyalandı!' : 'Copied to clipboard!', 'success');
            if (window.AppState) {
                window.AppState.totalCopies++;
                if (window.updateStats) window.updateStats();
                if (window.saveStats) window.saveStats();
            }
            return true;
        } catch (err) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textarea);
            return success;
        }
    }

    /**
     * Helper: Show notification
     */
    showNotification(message, type = 'info') {
        if (window.showNotification) {
            window.showNotification(message, type);
        } else {
            alert(message);
        }
    }

    /**
     * Helper: Download file
     */
    downloadFile(content, filename, mimeType = 'text/plain') {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Utility: Render template to element
     */
    render(container) {
        if (!container) return;
        container.innerHTML = this.renderUI();
        this.setupListeners();
    }
}

// Make globally available
if (typeof window !== 'undefined') {
    window.BaseTool = BaseTool;
}
