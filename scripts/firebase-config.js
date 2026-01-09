/* Firebase Configuration & Core Logic */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue, runTransaction } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBfnU9tuRce7lFw8Xqh_0ueaEJEHiQx6Lk",
    authDomain: "tulpar-stats.firebaseapp.com",
    projectId: "tulpar-stats",
    storageBucket: "tulpar-stats.firebasestorage.app",
    messagingSenderId: "583434345906",
    appId: "1:583434345906:web:aad9383c44b576ec3218ab"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// State Cache for UI Persistence
let cachedToolCount = '...';
let cachedCopyCount = '...';

// UI Sync Helper - Ensures stats persist even if DOM is refreshed
const syncUI = () => {
    const toolEl = document.getElementById('tools-used');
    const copyEl = document.getElementById('total-copies');

    // Update only if value is valid and different
    if (toolEl && cachedToolCount !== '...' && toolEl.innerText !== cachedToolCount) {
        toolEl.innerText = cachedToolCount;
    }
    if (copyEl && cachedCopyCount !== '...' && copyEl.innerText !== cachedCopyCount) {
        copyEl.innerText = cachedCopyCount;
    }
};

// Run sync periodically to fix any DOM resets caused by tools/routers
setInterval(syncUI, 500);

// Global Firebase Manager
window.tulparFirebase = {
    // Increment total tools used count
    incrementToolUsage: () => {
        const toolsRef = ref(db, 'stats/toolsUsed');
        runTransaction(toolsRef, (currentValue) => {
            return (currentValue || 0) + 1;
        });
    },

    // Increment total copies count
    incrementCopyCount: () => {
        const copiesRef = ref(db, 'stats/copies');
        runTransaction(copiesRef, (currentValue) => {
            return (currentValue || 0) + 1;
        });
    }
};

// Signal that Firebase is ready
window.tulparFirebaseLoaded = true;

// Listen for Realtime Updates
const toolsRef = ref(db, 'stats/toolsUsed');
onValue(toolsRef, (snapshot) => {
    cachedToolCount = (snapshot.val() || 0).toLocaleString();
    syncUI();
});

const copiesRef = ref(db, 'stats/copies');
onValue(copiesRef, (snapshot) => {
    cachedCopyCount = (snapshot.val() || 0).toLocaleString();
    syncUI();
});

console.log('🔥 Tulpar Stats: Live & Auto-Sync Active');
