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

// --- HARDWARE AUDIO & HAPTICS BYPASS ---
// Note: Using just the filename works best for Vercel/Spck deployments
const clickSound = new Audio('click.wav'); 
const bootSound = new Audio('boot.mp3');   

clickSound.volume = 1.0;
bootSound.volume = 1.0;

// FORCE LOAD
clickSound.load();
bootSound.load();

// This function "primes" the audio for iOS
function unlockAudio() {
    clickSound.play().then(() => {
        clickSound.pause();
        clickSound.currentTime = 0;
    }).catch(e => console.log("Unlock failed:", e));
    
    bootSound.play().then(() => {
        bootSound.pause();
        bootSound.currentTime = 0;
    }).catch(e => console.log("Unlock failed:", e));
}

function triggerClick() {
    // Resetting currentTime is vital for rapid clicks
    clickSound.currentTime = 0; 
    const p = clickSound.play();
    if (p !== undefined) {
        p.catch(err => console.log("Play blocked:", err));
    }
    if (navigator.vibrate) navigator.vibrate(15); 
}

function triggerBoot() {
    bootSound.currentTime = 0;
    const p = bootSound.play();
    if (p !== undefined) {
        p.catch(err => console.log("Play blocked:", err));
    }
    if (navigator.vibrate) navigator.vibrate([40, 50, 40]); 
}

document.addEventListener('DOMContentLoaded', () => {
    const crt = document.createElement('div');
    crt.classList.add('crt-overlay');
    document.body.appendChild(crt);

    // --- LOCK RESET ---
    // Forces the card to be RED and LOCKED every time you refresh
    localStorage.removeItem('efect_monitor_unlocked');

    const savedScore = localStorage.getItem('efect_synergy_score');
    if (savedScore) {
        const cardScore = document.getElementById('card-synergy-score');
        if (cardScore) cardScore.innerText = `${savedScore}/100`;
    }

    // --- SOPHISTICATED BOOT SPLASH ---
    const initBtn = document.getElementById('init-btn');
    const splashScreen = document.getElementById('splash-screen');
    const splashTerminal = document.getElementById('splash-terminal');
    const bootHud = document.getElementById('boot-hud');
    const scanner = document.getElementById('scanner');
    let isBooting = false;

    if (initBtn) {
        initBtn.addEventListener('click', async () => {
            if (isBooting) return;
            isBooting = true;
            
            // APPLE IOS AUDIO UNLOCK: Playing a sound on this specific click
            // unlocks the entire audio engine for the whole app.
            triggerBoot(); 
            
            initBtn.style.display = 'none'; 
            if (bootHud) bootHud.style.display = 'flex';
            if (scanner) scanner.style.display = 'block';
            setTimeout(() => { if(bootHud) bootHud.style.opacity = '1'; }, 10);
            
            if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
                try {
                    const permissionState = await DeviceOrientationEvent.requestPermission();
                    if (permissionState === 'granted') window.addEventListener('deviceorientation', handleGyro);
                } catch (err) {}
            } else { window.addEventListener('deviceorientation', handleGyro); }

            const hexStream = setInterval(() => {
                const hHex = document.getElementById('hud-hex');
                const hHex2 = document.getElementById('hud-hex2');
                const hVolt = document.getElementById('hud-volt');
                const hTemp = document.getElementById('hud-temp');
                if (hHex) hHex.innerText = '0x' + Math.floor(Math.random()*16777215).toString(16).toUpperCase();
                if (hHex2) hHex2.innerText = '0x' + Math.floor(Math.random()*16777215).toString(16).toUpperCase();
                if (hVolt) hVolt.innerText = (Math.random() * (1.35 - 1.15) + 1.15).toFixed(2) + 'V';
                if (hTemp) hTemp.innerText = Math.floor(Math.random() * (65 - 35) + 35) + '°C';
            }, 100);

            let bootIdx = 0;
            const bootSteps = [
                "INJECTING_KERNEL_HOOKS...",
                "BYPASSING_LATENCY_GATES...",
                "ALLOCATING_MEMORY...",
                "SECURING_ENCRYPTION...",
                "LINKING_HARDWARE...",
                "SYSTEM_READY"
            ];

            const bootInterval = setInterval(() => {
                if (bootIdx < 6) {
                    if (splashTerminal) splashTerminal.innerHTML = `> ${bootSteps[bootIdx]}`;
                    const seg = document.getElementById(`seg-${bootIdx + 1}`);
                    if (seg) seg.classList.add('active');
                    bootIdx++;
                } else {
                    clearInterval(bootInterval);
                    clearInterval(hexStream);
                    
                    setTimeout(() => {
                        if (splashScreen) splashScreen.style.opacity = '0';
                        setTimeout(() => {
                            if (splashScreen) splashScreen.remove();
                            initLockScreen(); 
                        }, 500);
                    }, 400);
                }
            }, 400);
        });
    }

    // --- LOCK SCREEN LOGIC ---
    function initLockScreen() {
        const lockScreen = document.getElementById('lock-screen');
        if (!lockScreen) {
            unlockSystem(); 
            return;
        }

        lockScreen.style.display = 'flex';
        setTimeout(() => { lockScreen.style.opacity = '1'; }, 10);

        const savedPin = localStorage.getItem('efect_master_key');
        const lockTitle = document.getElementById('lock-title');
        const lockSubtitle = document.getElementById('lock-subtitle');
        const lockInput = document.getElementById('lock-input');
        const lockBtn = document.getElementById('lock-btn');
        const lockError = document.getElementById('lock-error');

        if (!savedPin) {
            if (lockTitle) lockTitle.innerText = "INITIAL SETUP";
            if (lockSubtitle) lockSubtitle.innerText = "Create a new Master Key to encrypt your hub.";
            if (lockBtn) lockBtn.innerText = "REGISTER KEY";
        } else {
            if (lockTitle) lockTitle.innerText = "SYSTEM LOCKED";
            if (lockSubtitle) lockSubtitle.innerText = "Enter your Master Key to proceed.";
            if (lockBtn) lockBtn.innerText = "AUTHENTICATE";
        }

        const handleAuth = () => {
            if (!lockInput) return;
            const val = lockInput.value.trim();
            if (!val) return;
            triggerClick();

            if (!savedPin) {
                localStorage.setItem('efect_master_key', val);
                unlockSystem();
            } else {
                if (val === savedPin) {
                    unlockSystem();
                } else {
                    if (lockError) lockError.style.display = 'block';
                    lockInput.value = ''; 
                    const mc = lockScreen.querySelector('.modal-content');
                    if (mc) {
                        mc.style.transform = 'translateX(-10px)';
                        setTimeout(() => mc.style.transform = 'translateX(10px)', 100);
                        setTimeout(() => mc.style.transform = 'translateX(0)', 200);
                    }
                }
            }
        };

        if (lockBtn) lockBtn.addEventListener('click', handleAuth);
        if (lockInput) lockInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleAuth(); });
    }

    function unlockSystem() {
        const lockScreen = document.getElementById('lock-screen');
        if (lockScreen) lockScreen.style.opacity = '0';
        setTimeout(() => {
            if (lockScreen) lockScreen.style.display = 'none';
            typeWriter(); 
            initDiagnostics(); 
            fetchGitHubUpdates();
            scheduleNextSale();
        }, 400);
    }

    // --- COMMAND CONSOLE LOGIC ---
    const consoleUI = document.getElementById('command-console');
    const cmdInput = document.getElementById('cmd-input');
    let startY = 0;

    if (consoleUI && cmdInput) {
        document.addEventListener('touchstart', e => { startY = e.touches[0].clientY; });
        document.addEventListener('touchend', e => {
            if (startY < 250 && e.changedTouches[0].clientY > startY + 40) {
                consoleUI.style.top = '0';
                cmdInput.focus();
            }
        });

        consoleUI.addEventListener('submit', function (e) {
            e.preventDefault(); 
            triggerClick();
            const code = cmdInput.value.toLowerCase().replace(/\s+/g, '');
            
            if (code === 'efect.lit') {
                const fCard = document.getElementById('secret-fps-card');
                if (fCard) fCard.style.display = 'flex';
                alert("FPS OVERRIDE ACTIVE.");
            } else if (code === '420') {
                triggerBoot(); 
                unlockHardwareMonitor();
            }
            
            consoleUI.style.top = '-100px';
            cmdInput.value = '';
            cmdInput.blur();
        });
    }

    // --- MODALS & BINDINGS ---
    const setupModal = (btnId, modalId, vidId = null) => {
        document.getElementById(btnId)?.addEventListener('click', (e) => {
            e.stopPropagation();
            triggerClick();
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'flex';
                setTimeout(() => modal.style.opacity = '1', 10);
            }
            if (vidId) document.getElementById(vidId)?.play();
        });
    };

    setupModal('btn-preview', 'preview-modal', 'macro-vid');
    setupModal('btn-fps-preview', 'fps-modal');
    setupModal('btn-synergy', 'synergy-modal'); 
    setupModal('btn-docs', 'docs-modal'); 

    const closeModals = ['close-modal', 'close-fps-modal', 'close-synergy-modal', 'close-docs-modal'];
    closeModals.forEach(id => {
        document.getElementById(id)?.addEventListener('click', (e) => {
            triggerClick();
            const modal = e.target.closest('.modal-overlay');
            if (modal) {
                modal.style.opacity = '0';
                if(id === 'close-modal') document.getElementById('macro-vid')?.pause();
                setTimeout(() => { modal.style.display = 'none'; }, 300);
            }
        });
    });

    const tabBtns = document.querySelectorAll('.tab-btn');
    const docContents = document.querySelectorAll('.doc-content');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            triggerClick();
            tabBtns.forEach(b => b.classList.remove('active'));
            docContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.target).classList.add('active');
        });
    });

    document.getElementById('btn-hub')?.addEventListener('click', () => {
        triggerClick();
        window.open('https://efectmacrosxtweaks.netlify.app/', '_blank');
    });

    document.getElementById('btn-maps')?.addEventListener('click', () => {
        triggerClick();
        window.open('https://fortnite.gg/creator/efect.lit', '_blank');
    });

    // --- SYNERGY CALCULATION LOGIC ---
    document.getElementById('run-synergy-btn')?.addEventListener('click', () => {
        triggerClick();
        const gpuName = document.getElementById('syn-gpu').value.toUpperCase() || "UNKNOWN GPU";
        const cpuName = document.getElementById('syn-cpu').value.toUpperCase() || "UNKNOWN CPU";
        const perName = document.getElementById('syn-per').value.toUpperCase() || "STANDARD GEAR";
        
        let gpuVal = 50;
        if (gpuName.includes('4090')) gpuVal = 100;
        else if (gpuName.includes('4080') || gpuName.includes('4070')) gpuVal = 90;
        else if (gpuName.includes('4060') || gpuName.includes('3080')) gpuVal = 80;

        let cpuVal = 50;
        if (cpuName.includes('14900') || cpuName.includes('7800X3D')) cpuVal = 100;
        else if (cpuName.includes('14700') || cpuName.includes('13900')) cpuVal = 95;
        else if (cpuName.includes('14600')) cpuVal = 85;

        const score = Math.floor((gpuVal * 0.45) + (cpuVal * 0.40) + (50 * 0.15));
        const resultBox = document.getElementById('syn-result');
        const scoreText = document.getElementById('syn-score-text');
        const adviceText = document.getElementById('syn-advice');
        const cardScore = document.getElementById('card-synergy-score'); 
        
        resultBox.style.display = 'block';
        scoreText.innerText = "CALC...";
        
        setTimeout(() => {
            triggerClick(); 
            scoreText.innerText = score;
            localStorage.setItem('efect_synergy_score', score);
            if (cardScore) cardScore.innerText = `${score}/100`;
            adviceText.innerText = score >= 85 ? "Elite System Detected." : "Optimization Recommended.";
        }, 1500);
    });

    // --- HARDWARE MONITOR JAILBREAK ENGINE ---
    function unlockHardwareMonitor() {
        const hwCard = document.getElementById('hw-monitor-card');
        const hwBtn = document.getElementById('btn-hw-monitor');
        const hwBadge = document.getElementById('hw-status-badge');
        if (hwCard && hwBtn && hwBadge) {
            hwCard.classList.remove('locked');
            hwBadge.className = 'status online';
            hwBadge.innerHTML = '<span class="dot"></span> ONLINE';
            hwBadge.style.color = '#00ff00';
            hwBtn.classList.remove('disabled');
            hwBtn.removeAttribute('disabled');
            hwBtn.innerText = 'OPEN TELEMETRY';
        }
    }

    document.getElementById('btn-hw-monitor')?.addEventListener('click', (e) => {
        e.stopPropagation();
        triggerClick();
        const modal = document.getElementById('telemetry-modal');
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.style.opacity = '1', 10);
        }
    });

    document.getElementById('close-telemetry-modal')?.addEventListener('click', () => {
        triggerClick();
        const tm = document.getElementById('telemetry-modal');
        if (tm) tm.style.opacity = '0';
        setTimeout(() => { if (tm) tm.style.display = 'none'; }, 300);
    });
});

// --- UTILS ---
function handleGyro(e) {
    const galaxy = document.querySelector('.galaxy-wrapper');
    if (galaxy) galaxy.style.transform = `translate(${e.gamma/1.5}px, ${(e.beta-45)/1.5}px)`;
}

function typeWriter() {
    if (i < text.length) {
        const tw = document.getElementById("typewriter");
        if (tw) tw.innerHTML += text.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
    } else { startTerminalLog(); }
}

function startTerminalLog() {
    const log = document.getElementById("terminal-log");
    if (log) {
        setInterval(() => {
            log.innerText = "> " + systemLogs[logIndex];
            logIndex = (logIndex + 1) % systemLogs.length;
        }, 2000);
    }
}

// --- SALES ENGINE ---
const efectProducts = ["Efect Pro Elite", "Efect Macro Engine", "Efect FPS Booster"];
const efectLocations = ["Texas, USA", "London, UK", "Florida, USA", "Germany"];

function triggerRandomSale() {
    const toast = document.getElementById('sales-toast');
    if (!toast) return;
    const product = efectProducts[Math.floor(Math.random() * efectProducts.length)];
    const location = efectLocations[Math.floor(Math.random() * efectLocations.length)];
    const orderNum = Math.floor(Math.random() * 90000) + 10000; 
    document.getElementById('sale-desc').innerHTML = `User from <strong>${location}</strong> secured <strong>${product}</strong> <br>[Order #${orderNum}]`;
    toast.classList.add('show');
    clickSound.play().catch(() => {});
    setTimeout(() => {
        toast.classList.remove('show');
        scheduleNextSale();
    }, 6000); 
}

function scheduleNextSale() {
    const nextDelay = Math.floor(Math.random() * (45000 - 15000 + 1)) + 15000;
    setTimeout(triggerRandomSale, nextDelay);
}
