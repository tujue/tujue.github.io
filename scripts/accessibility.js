/**
 * ACCESSIBILITY ENHANCEMENTS
 * Keyboard navigation, focus management, and ARIA support
 */

(function () {
    'use strict';

    // ========== BACK TO TOP BUTTON ==========
    const backToTopBtn = document.getElementById('back-to-top');

    if (backToTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.style.display = 'flex';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });

        // Smooth scroll to top
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ========== KEYBOARD NAVIGATION ==========

    // ESC key to close workspace modal
    document.addEventListener('keydown', (e) => {
        const workspace = document.getElementById('workspace');
        const legalModal = document.getElementById('legal-modal');

        if (e.key === 'Escape') {
            // Close workspace if open
            if (workspace && workspace.classList.contains('active')) {
                workspace.classList.remove('active');
                document.body.classList.remove('modal-open');
                restoreFocus();
            }

            // Close legal modal if open
            if (legalModal && legalModal.classList.contains('active')) {
                legalModal.classList.remove('active');
                document.body.classList.remove('modal-open');
            }
        }
    });

    // ========== FOCUS MANAGEMENT ==========

    let lastFocusedElement = null;

    // Store last focused element before opening modal
    function storeFocus() {
        lastFocusedElement = document.activeElement;
    }

    // Restore focus when closing modal
    function restoreFocus() {
        if (lastFocusedElement && lastFocusedElement.focus) {
            lastFocusedElement.focus();
            lastFocusedElement = null;
        }
    }

    // Focus trap for modals
    function trapFocus(modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        modal.addEventListener('keydown', function (e) {
            if (e.key !== 'Tab') return;

            // Shift + Tab (backwards)
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            }
            // Tab (forwards)
            else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });

        // Focus first element when modal opens
        setTimeout(() => {
            firstElement.focus();
        }, 100);
    }

    // ========== ENHANCED WORKSPACE HANDLING ==========

    // Override workspace opening to include accessibility features
    window._originalOpenTool = window.openTool;
    window.openTool = function (toolId) {
        storeFocus();

        // Call original function
        if (typeof window._originalOpenTool === 'function') {
            window._originalOpenTool(toolId);
        }

        // Add accessibility enhancements
        setTimeout(() => {
            const workspace = document.getElementById('workspace');
            if (workspace && workspace.classList.contains('active')) {
                document.body.classList.add('modal-open');
                trapFocus(workspace);
            }
        }, 100);
    };

    // ========== TOOL CARD KEYBOARD NAVIGATION ==========

    // Make tool cards keyboard accessible
    function enhanceToolCards() {
        const toolsGrid = document.getElementById('tools-grid');
        if (!toolsGrid) return;

        // Use MutationObserver to watch for dynamically added tool cards
        const observer = new MutationObserver(() => {
            const toolCards = toolsGrid.querySelectorAll('.tool-card');

            toolCards.forEach(card => {
                // Skip if already enhanced
                if (card.hasAttribute('data-accessible')) return;

                // Add keyboard support
                card.setAttribute('tabindex', '0');
                card.setAttribute('role', 'button');
                card.setAttribute('data-accessible', 'true');

                // Get tool name for better announcement
                const toolName = card.querySelector('.tool-title');
                if (toolName) {
                    card.setAttribute('aria-label', `Open ${toolName.textContent} tool`);
                }

                // Enter or Space to activate
                card.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        card.click();
                    }
                });
            });
        });

        // Start observing
        observer.observe(toolsGrid, {
            childList: true,
            subtree: true
        });

        // Initial enhancement
        observer.disconnect();
        observer.observe(toolsGrid, { childList: true, subtree: true });
    }

    // ========== ANNOUNCEMENTS FOR SCREEN READERS ==========

    // Create live region for dynamic announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);

    // Announce messages to screen readers
    window.announceToScreenReader = function (message) {
        liveRegion.textContent = message;

        // Clear after announcement
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 1000);
    };

    // ========== COPY BUTTON ANNOUNCEMENTS ==========

    // Override copyToClipboard to announce to screen readers
    if (window.DevTools && window.DevTools.copyToClipboard) {
        const originalCopy = window.DevTools.copyToClipboard;

        window.DevTools.copyToClipboard = async function (text, btn) {
            const result = await originalCopy.call(this, text, btn);

            if (result && window.announceToScreenReader) {
                const isTr = window.i18n && window.i18n.getCurrentLanguage() === 'tr';
                announceToScreenReader(isTr ? 'Panoya kopyalandı' : 'Copied to clipboard');
            }

            return result;
        };
    }

    // ========== INITIALIZE ==========

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            enhanceToolCards();
        });
    } else {
        enhanceToolCards();
    }

    console.log('✅ Accessibility enhancements loaded');
})();
