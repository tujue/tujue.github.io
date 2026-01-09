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

// Listen for Realtime Updates and Update UI
// Wait for DOM to be ready to attach listeners
const updateStatsUI = () => {
    // Tools Used Listener
    const toolsRef = ref(db, 'stats/toolsUsed');
    onValue(toolsRef, (snapshot) => {
        const count = snapshot.val() || 0;
        // Update DOM elements - targeting elements by ID or Class
        const toolEls = document.querySelectorAll('#tools-used');
        toolEls.forEach(el => {
            // Animate number change
            animateValue(el, parseInt(el.innerText.replace(/,/g, '')) || 0, count, 1000);
        });
    });

    // Copies Listener
    const copiesRef = ref(db, 'stats/copies');
    onValue(copiesRef, (snapshot) => {
        const count = snapshot.val() || 0;
        const copyEls = document.querySelectorAll('#total-copies');
        copyEls.forEach(el => {
            animateValue(el, parseInt(el.innerText.replace(/,/g, '')) || 0, count, 1000);
        });
    });
};

function animateValue(obj, start, end, duration) {
    if (start === end) return;
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            obj.innerHTML = end.toLocaleString();
        }
    };
    window.requestAnimationFrame(step);
}

// Start listening immediately
updateStatsUI();

console.log('🔥 Tulpar Stats: Firebase initialized');
