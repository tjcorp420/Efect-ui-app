const text = "> INIT_EFECT_SUITE...";
let i = 0;
const speed = 75; 

const systemLogs = [
    "Bypassing OS latency... OK",
    "Optimizing system registry... OK",
    "Loading macro engine hooks... OK",
    "Establishing secure connection... DONE"
];
let logIndex = 0;

// --- AUDIO (RESTORED TO YOUR WORKING VERSION) ---
const clickSound = new Audio('spckclick.mp3'); 
const bootSound = new Audio('efectboot.mp3');   
clickSound.volume = 0.8;
bootSound.volume = 0.9;

function triggerClick() {
    clickSound.currentTime = 0; 
    clickSound.play().catch(() => {});
    if (navigator.vibrate) navigator.vibrate(15); 
}

function triggerBoot() {
    bootSound.currentTime = 0;
    bootSound.play().catch(() => {});
    if (navigator.vibrate) navigator.vibrate([40, 50, 40]); 
}

document.addEventListener('DOMContentLoaded', () => {
    // Force reset Hardware Monitor memory so it stays locked
    localStorage.removeItem('efect_monitor_unlocked');

    const crt = document.createElement('div');
    crt.classList.add('crt-overlay');
    document.body.appendChild(crt);

    const initBtn = document.getElementById('init-btn');
    const splashScreen = document.getElementById('splash-screen');
    const splashTerminal = document.getElementById('splash-terminal');
    const bootHud = document.getElementById('boot-hud');
    const scanner = document.getElementById('scanner');
    let isBooting = false;

    if (initBtn) {
        // Using 'click' as requested since it worked for you before
        initBtn.addEventListener('click', async () => {
            if (isBooting) return;
            isBooting = true;
            triggerBoot(); 
            
            initBtn.style.display = 'none'; 
            if (bootHud) bootHud.style.display = 'flex';
            if (scanner) scanner.style.display = 'block';
            setTimeout(() => { if(bootHud) bootHud.style.opacity = '1'; }, 10);
            
            const hexStream = setInterval(() => {
                const hHex = document.getElementById('hud-hex');
                const hHex2 = document.getElementById('hud-hex2');
                if (hHex) hHex.innerText = '0x' + Math.floor(Math.random()*16777215).toString(16).toUpperCase();
                if (hHex2) hHex2.innerText = '0x' + Math.floor(Math.random()*16777215).toString(16).toUpperCase();
            }, 100);

            let bootIdx = 0;
            const bootSteps = ["INJECTING_KERNEL...", "BYPASSING_GATES...", "SECURING_LAYER...", "SYSTEM_READY"];

            const bootInterval = setInterval(() => {
                if (bootIdx < bootSteps.length) {
                    if (splashTerminal) splashTerminal.innerHTML = `> ${bootSteps[bootIdx]}`;
                    const seg = document.getElementById(`seg-${bootIdx + 1}`);
                    if (seg) seg.classList.add('active');
                    bootIdx++;
                } else {
                    clearInterval(bootInterval);
                    clearInterval(hexStream);
                    
                    setTimeout(() => {
                        if (splashScreen) {
                            splashScreen.style.opacity = '0';
                            // CRITICAL FIX: Moves splash screen behind everything so it can't block clicks
                            setTimeout(() => { 
                                splashScreen.style.display = 'none'; 
                                splashScreen.style.zIndex = '-1';
                                initLockScreen(); 
                            }, 500);
                        }
                    }, 400);
                }
            }, 500);
        });
    }

    function initLockScreen() {
        const lockScreen = document.getElementById('lock-screen');
        if (!lockScreen) { unlockSystem(); return; }
        lockScreen.style.display = 'flex';
        setTimeout(() => { lockScreen.style.opacity = '1'; }, 10);

        const savedPin = localStorage.getItem('efect_master_key');
        const lockBtn = document.getElementById('lock-btn');
        const lockInput = document.getElementById('lock-input');

        const handleAuth = () => {
            const val = lockInput.value.trim();
            triggerClick();
            if (!savedPin || val === savedPin) {
                if (!savedPin) localStorage.setItem('efect_master_key', val);
                unlockSystem();
            } else {
                document.getElementById('lock-error').style.display = 'block';
            }
        };
        lockBtn?.addEventListener('click', handleAuth);
    }

    function unlockSystem() {
        const ls = document.getElementById('lock-screen');
        if (ls) {
            ls.style.opacity = '0';
            setTimeout(() => { 
                ls.style.display = 'none'; 
                typeWriter(); 
                fetchGitHubUpdates();
                scheduleNextSale(); 
            }, 400);
        }
    }

    // --- COMMAND CONSOLE (420) ---
    const consoleUI = document.getElementById('command-console');
    const cmdInput = document.getElementById('cmd-input');
    let startY = 0;
    document.addEventListener('touchstart', e => { startY = e.touches[0].clientY; });
    document.addEventListener('touchend', e => {
        if (startY < 200 && e.changedTouches[0].clientY > startY + 50) {
            consoleUI.style.top = '0';
            cmdInput.focus();
        }
    });

    consoleUI?.addEventListener('submit', (e) => {
        e.preventDefault();
        const code = cmdInput.value.toLowerCase().trim();
        if (code === '420') {
            triggerBoot();
            unlockHardwareMonitor();
        } else {
            triggerClick();
        }
        consoleUI.style.top = '-100px';
        cmdInput.value = '';
    });

    // --- MODALS ---
    const setupM = (btn, mod) => {
        document.getElementById(btn)?.addEventListener('click', () => {
            triggerClick();
            const m = document.getElementById(mod);
            if (m) { m.style.display = 'flex'; setTimeout(() => m.style.opacity = '1', 10); }
        });
    };
    setupM('btn-synergy', 'synergy-modal');
    setupM('btn-docs', 'docs-modal');
    setupM('btn-hw-monitor', 'telemetry-modal');

    document.querySelectorAll('.close-btn').forEach(b => {
        b.addEventListener('click', (e) => {
            triggerClick();
            const mod = e.target.closest('.modal-overlay');
            if (mod) { mod.style.opacity = '0'; setTimeout(() => mod.style.display = 'none', 300); }
        });
    });
});

function unlockHardwareMonitor() {
    const hwCard = document.getElementById('hw-monitor-card');
    const hwBtn = document.getElementById('btn-hw-monitor');
    const hwBadge = document.getElementById('hw-status-badge');
    if (hwCard) {
        hwCard.classList.remove('locked');
        hwBadge.innerHTML = 'ONLINE';
        hwBadge.className = 'status online';
        hwBtn.classList.remove('disabled');
        hwBtn.removeAttribute('disabled');
        hwBtn.innerText = 'OPEN TELEMETRY';
    }
}

function typeWriter() {
    if (i < text.length) {
        document.getElementById("typewriter").innerHTML += text.charAt(i);
        i++; setTimeout(typeWriter, speed);
    }
}

// --- SALES ENGINE (RANDOM PROOF) ---
const pds = ["Efect Pro Elite", "Efect Macro Engine", "Efect FPS Booster"];
const locs = ["Texas", "London", "Florida", "California", "France", "Ohio"];

function triggerRandomSale() {
    const toast = document.getElementById('sales-toast');
    if (!toast) return;
    const p = pds[Math.floor(Math.random() * pds.length)];
    const l = locs[Math.floor(Math.random() * locs.length)];
    document.getElementById('sale-desc').innerHTML = `User from <strong>${l}</strong> secured <strong>${p}</strong> <br>[Order #${Math.floor(Math.random()*90000)+10000}]`;
    toast.classList.add('show');
    triggerClick();
    setTimeout(() => { toast.classList.remove('show'); scheduleNextSale(); }, 6000); 
}

function scheduleNextSale() {
    setTimeout(triggerRandomSale, Math.floor(Math.random() * (35000 - 20000)) + 20000);
}

// Dummy functions for GitHub
async function fetchGitHubUpdates() {}
