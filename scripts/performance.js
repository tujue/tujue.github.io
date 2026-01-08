/**
 * PERFORMANCE OPTIMIZATIONS
 * - Lazy load images
 * - Preload critical resources
 * - Monitor performance metrics
 */

(function () {
    'use strict';

    // ========== LAZY LOAD NON-CRITICAL CSS ==========

    function loadCSS(href) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.media = 'print'; // Load without blocking
        link.onload = function () {
            this.media = 'all'; // Apply after load
        };
        document.head.appendChild(link);
    }

    // Load main CSS after critical content is rendered
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            // Main CSS is already loaded, this is for future optimizations
        });
    }

    // ========== LAZY LOAD IMAGES ==========

    function setupLazyLoading() {
        // Use Intersection Observer for lazy loading
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;

                        // Load image
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }

                        // Load srcset
                        if (img.dataset.srcset) {
                            img.srcset = img.dataset.srcset;
                            img.removeAttribute('data-srcset');
                        }

                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px' // Start loading 50px before entering viewport
            });

            // Observe all lazy images
            document.querySelectorAll('img[data-src], img[data-srcset]').forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback: load all images immediately
            document.querySelectorAll('img[data-src]').forEach(img => {
                img.src = img.dataset.src;
            });
        }
    }

    // ========== PRELOAD CRITICAL RESOURCES ==========

    function preloadCriticalResources() {
        const criticalFonts = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'
        ];

        criticalFonts.forEach(font => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = font;
            document.head.appendChild(link);
        });
    }

    // ========== PERFORMANCE MONITORING ==========

    function monitorPerformance() {
        if (!window.performance || !window.performance.timing) return;

        window.addEventListener('load', () => {
            setTimeout(() => {
                const timing = window.performance.timing;
                const metrics = {
                    // Page load time
                    pageLoadTime: timing.loadEventEnd - timing.navigationStart,

                    // DOM ready time
                    domReadyTime: timing.domContentLoadedEventEnd - timing.navigationStart,

                    // Time to first byte
                    ttfb: timing.responseStart - timing.navigationStart,

                    // DOM processing time
                    domProcessing: timing.domComplete - timing.domLoading
                };

                console.log('📊 Performance Metrics:', metrics);

                // Log warnings for slow metrics
                if (metrics.pageLoadTime > 3000) {
                    console.warn('⚠️ Page load time is over 3 seconds');
                }

                if (metrics.ttfb > 600) {
                    console.warn('⚠️ Time to First Byte is over 600ms');
                }

                // Store metrics for analytics (optional)
                if (window.localStorage) {
                    try {
                        const perfData = {
                            timestamp: new Date().toISOString(),
                            metrics: metrics
                        };
                        localStorage.setItem('lastPerformanceMetrics', JSON.stringify(perfData));
                    } catch (e) {
                        // Silent fail
                    }
                }
            }, 0);
        });
    }

    // ========== WEB VITALS (Core Web Vitals) ==========

    function measureWebVitals() {
        // Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            try {
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    console.log('📈 LCP:', lastEntry.renderTime || lastEntry.loadTime);
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                // Silently fail if not supported
            }

            // First Input Delay (FID)
            try {
                const fidObserver = new PerformanceObserver((list) => {
                    list.getEntries().forEach((entry) => {
                        console.log('⚡ FID:', entry.processingStart - entry.startTime);
                    });
                });
                fidObserver.observe({ entryTypes: ['first-input'] });
            } catch (e) {
                // Silently fail
            }

            // Cumulative Layout Shift (CLS)
            try {
                let clsScore = 0;
                const clsObserver = new PerformanceObserver((list) => {
                    list.getEntries().forEach((entry) => {
                        if (!entry.hadRecentInput) {
                            clsScore += entry.value;
                        }
                    });
                    console.log('📐 CLS:', clsScore);
                });
                clsObserver.observe({ entryTypes: ['layout-shift'] });
            } catch (e) {
                // Silently fail
            }
        }
    }

    // ========== DEBOUNCE SCROLL EVENTS ==========

    function debounceScrollEvents() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    // Scroll handlers will use this
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // ========== REDUCE MAIN THREAD WORK ==========

    function deferNonCriticalWork() {
        // Use requestIdleCallback for non-critical tasks
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                // Initialize non-critical features
                setupLazyLoading();
            });
        } else {
            // Fallback to setTimeout
            setTimeout(() => {
                setupLazyLoading();
            }, 1);
        }
    }

    // ========== INITIALIZE ==========

    // Run performance monitoring
    monitorPerformance();
    measureWebVitals();

    // Preload critical resources
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            preloadCriticalResources();
            deferNonCriticalWork();
            debounceScrollEvents();
        });
    } else {
        preloadCriticalResources();
        deferNonCriticalWork();
        debounceScrollEvents();
    }

    console.log('⚡ Performance optimizations loaded');
})();
