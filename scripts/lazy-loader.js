/* ============================================
   LAZY LOADING SYSTEM
   Dynamically load external libraries only when needed
   ============================================ */

const LazyLoader = {
    // Track loaded scripts
    loaded: new Set(),
    loading: new Map(), // toolId -> Promise

    /**
     * Load a script dynamically
     * @param {string} src - Script URL
     * @param {string} id - Unique identifier
     * @returns {Promise}
     */
    loadScript(src, id) {
        // Already loaded
        if (this.loaded.has(id)) {
            return Promise.resolve();
        }

        // Currently loading
        if (this.loading.has(id)) {
            return this.loading.get(id);
        }

        // Load script
        const promise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = () => {
                this.loaded.add(id);
                this.loading.delete(id);
                resolve();
            };
            script.onerror = () => {
                this.loading.delete(id);
                reject(new Error(`Failed to load ${id}`));
            };
            document.head.appendChild(script);
        });

        this.loading.set(id, promise);
        return promise;
    },

    /**
     * Load dependencies for a specific tool
     * @param {string} toolId - Tool identifier
     * @returns {Promise}
     */
    async loadToolDependencies(toolId) {
        // Centralized library definitions
        const libraries = {
            tesseract: 'https://unpkg.com/tesseract.js@5.0.3/dist/tesseract.min.js',
            pdfLib: 'https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.js',
            exifReader: 'https://cdn.jsdelivr.net/npm/exifreader@4.23.3/dist/exif-reader.min.js',
            piexifjs: 'https://cdn.jsdelivr.net/npm/piexifjs@1.0.6/piexif.min.js',
            diff: 'https://cdn.jsdelivr.net/npm/diff@5.2.0/dist/diff.min.js',
            bcrypt: 'https://cdn.jsdelivr.net/npm/bcryptjs@2.4.3/dist/bcrypt.min.js',
            jszip: 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js',
            qrious: 'https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js',
            html2canvas: 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js',
            highlight: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js',
            sql: 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js',
            cropper: 'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.1/cropper.min.js',
            peerjs: 'https://unpkg.com/peerjs@1.5.2/dist/peerjs.min.js',
            marked: 'https://cdn.jsdelivr.net/npm/marked/marked.min.js'
        };

        // Tool specific dependencies (references library IDs)
        const toolDependencies = {
            'ocr-tool': ['tesseract'],
            'pdf-manager': ['pdfLib'],
            'metadata-tool': ['exifReader', 'piexifjs'],
            'diff-checker': ['diff'],
            'htpasswd-generator': ['bcrypt'],
            'favicon-generator': ['jszip'],
            'qr-generator': ['qrious'],
            'link-shortener': ['qrious'],
            'code-to-image': ['html2canvas', 'highlight'],

            'sql-playground': ['sql'],
            'bg-remover': [],
            'image-tools': ['cropper'],
            'photo-editor': [],
            'og-image-generator': ['html2canvas'],
            'p2p-transfer': ['peerjs', 'qrious'],
            'social-grid-maker': ['jszip'],
            'resume-builder': [],
            'markdown-editor': ['marked'],
            'virtual-piano': [],
            'audio-waveform': []
        };

        const toolDeps = toolDependencies[toolId];

        if (!toolDeps || toolDeps.length === 0) {
            return Promise.resolve(); // No dependencies
        }

        // Show loading indicator
        this.showLoadingIndicator(toolId);

        try {
            // Load all dependencies in parallel
            await Promise.all(
                toolDeps.map(libId => {
                    const src = libraries[libId];
                    if (src) {
                        return this.loadScript(src, libId);
                    } else {
                        console.warn(`Library URL not found for ID: ${libId}`);
                        return Promise.resolve();
                    }
                })
            );
            this.hideLoadingIndicator();
        } catch (error) {
            this.hideLoadingIndicator();
            throw error;
        }
    },

    /**
     * Show loading indicator in workspace
     */
    showLoadingIndicator(toolId) {
        const workspaceBody = document.getElementById('workspace-body');
        if (workspaceBody) {
            workspaceBody.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 300px; gap: 1rem;">
                    <div class="loading-spinner"></div>
                    <div style="font-size: 1.1rem; color: var(--text-secondary);">
                        Loading ${toolId} dependencies...
                    </div>
                    <div style="font-size: 0.9rem; color: var(--text-muted);">
                        This happens only once, then it's cached
                    </div>
                </div>
                <style>
                    .loading-spinner {
                        width: 50px;
                        height: 50px;
                        border: 4px solid var(--surface);
                        border-top-color: var(--primary);
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                    }
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                </style>
            `;
        }
    },

    /**
     * Hide loading indicator
     */
    hideLoadingIndicator() {
        // Indicator will be replaced by actual tool UI
    },

    /**
     * Preload critical libraries (on page load)
     */
    async preloadCritical() {
        // Preload most commonly used libraries
        // Example:
        // this.loadScript('https://unpkg.com/tesseract.js@5.0.3/dist/tesseract.min.js', 'tesseract');
    }
};

// Export for use in main.js
window.LazyLoader = LazyLoader;

// Optionally preload on page load (after a delay)
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        // LazyLoader.preloadCritical(); // Uncomment to enable
    }, 3000); // Wait 3 seconds after page load
});
