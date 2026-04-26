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

const sound1 = new Audio('sound1.mp3');
const sound2 = new Audio('sound2.mp3');
sound1.volume = 0.6;
sound2.volume = 0.6;

document.addEventListener('DOMContentLoaded', () => {
    // --- SOPHISTICATED BOOT SPLASH ---
    const initBtn = document.getElementById('init-btn');
    const splashScreen = document.getElementById('splash-screen');
    const splashTerminal = document.getElementById('splash-terminal');
    const bootHud = document.getElementById('boot-hud');
    const scanner = document.getElementById('scanner');
    let isBooting = false;

    const startBootSequence = async (e) => {
        if(e) e.preventDefault(); 
        if(isBooting) return;
        isBooting = true;
        sound1.play().catch(()=>{}); // Safe play
        
        initBtn.style.display = 'none'; 
        bootHud.style.display = 'flex';
        scanner.style.display = 'block';
        setTimeout(() => bootHud.style.opacity = '1', 10);
        
        // Request Gyro
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            try {
                const permissionState = await DeviceOrientationEvent.requestPermission();
                if (permissionState === 'granted') window.addEventListener('deviceorientation', handleGyro);
            } catch (e) {}
        } else { window.addEventListener('deviceorientation', handleGyro); }

        // HUD Data Streamers
        const hexStream = setInterval(() => {
            document.getElementById('hud-hex').innerText = '0x' + Math.floor(Math.random()*16777215).toString(16).toUpperCase();
            document.getElementById('hud-hex2').innerText = '0x' + Math.floor(Math.random()*16777215).toString(16).toUpperCase();
            document.getElementById('hud-volt').innerText = (Math.random() * (1.35 - 1.15) + 1.15).toFixed(2) + 'V';
            document.getElementById('hud-temp').innerText = Math.floor(Math.random() * (65 - 35) + 35) + '°C';
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
                splashTerminal.innerHTML = `> ${bootSteps[bootIdx]}`;
                document.getElementById(`seg-${bootIdx + 1}`).classList.add('active');
                bootIdx++;
            } else {
                clearInterval(bootInterval);
                clearInterval(hexStream);
                
                setTimeout(() => {
                    splashScreen.style.opacity = '0';
                    setTimeout(() => {
                        splashScreen.remove();
                        initLockScreen(); 
                    }, 500);
                }, 400);
            }
        }, 400);
    };

    // Bulletproof event binding for iOS
    if(initBtn) {
        initBtn.addEventListener('touchstart', startBootSequence, {passive: false});
        initBtn.addEventListener('click', startBootSequence);
    }

    // --- SECURE LOCK SCREEN LOGIC ---
    function initLockScreen() {
        const lockScreen = document.getElementById('lock-screen');
        lockScreen.style.display = 'flex';
        setTimeout(() => { lockScreen.style.opacity = '1'; }, 10);

        const savedPin = localStorage.getItem('efect_master_key');
        const lockTitle = document.getElementById('lock-title');
        const lockSubtitle = document.getElementById('lock-subtitle');
        const lockInput = document.getElementById('lock-input');
        const lockBtn = document.getElementById('lock-btn');
        const lockError = document.getElementById('lock-error');

        if (!savedPin) {
            lockTitle.innerText = "INITIAL SETUP";
            lockSubtitle.innerText = "Create a new Master Key to encrypt your hub.";
            lockBtn.innerText = "REGISTER KEY";
        } else {
            lockTitle.innerText = "SYSTEM LOCKED";
            lockSubtitle.innerText = "Enter your Master Key to proceed.";
            lockBtn.innerText = "AUTHENTICATE";
        }

        const handleAuth = (e) => {
            if(e) e.preventDefault();
            const val = lockInput.value.trim();
            if(!val) return;
            sound1.play().catch(()=>{});

            if (!savedPin) {
                localStorage.setItem('efect_master_key', val);
                unlockSystem();
            } else {
                if (val === savedPin) {
                    unlockSystem();
                } else {
                    lockError.style.display = 'block';
                    lockInput.value = ''; 
                    const mc = lockScreen.querySelector('.modal-content');
                    mc.style.transform = 'translateX(-10px)';
                    setTimeout(() => mc.style.transform = 'translateX(10px)', 100);
                    setTimeout(() => mc.style.transform = 'translateX(0)', 200);
                }
            }
        };

        lockBtn.addEventListener('touchstart', handleAuth, {passive: false});
        lockBtn.addEventListener('click', handleAuth);
        lockInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') handleAuth(); });
    }

    function unlockSystem() {
        const lockScreen = document.getElementById('lock-screen');
        lockScreen.style.opacity = '0';
        setTimeout(() => {
            lockScreen.style.display = 'none';
            typeWriter(); 
            initDiagnostics(); 
            fetchGitHubUpdates();
        }, 400);
    }

    // --- NATIVE IOS SHARE BUTTON ---
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: 'EFECT Suite',
                        text: 'Check out the EFECT Performance & Optimization Hub.',
                        url: window.location.href
                    });
                } catch (err) {}
            } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
            }
        });
    }

    // --- COMMAND CONSOLE LOGIC ---
    const consoleUI = document.getElementById('command-console');
    const cmdInput = document.getElementById('cmd-input');
    let startY = 0;

    document.addEventListener('touchstart', e => { startY = e.touches[0].clientY; });
    document.addEventListener('touchend', e => {
        if (startY < 80 && e.changedTouches[0].clientY > startY + 60) {
            consoleUI.style.top = '0';
            cmdInput.focus();
        }
    });

    consoleUI.addEventListener('submit', function (e) {
        e.preventDefault(); 
        const code = cmdInput.value.toLowerCase().replace(/\s+/g, '');
        
        if (code === 'efect.lit') {
            document.getElementById('secret-fps-card').style.display = 'flex';
            alert("FPS OVERRIDE ACTIVE.");
        } else if (code === 'color_override') {
            document.body.style.filter = `hue-rotate(${Math.floor(Math.random() * 360)}deg)`;
        } else if (code === 'matrix') {
            startMatrix();
        }
        
        consoleUI.style.top = '-100px';
        cmdInput.value = '';
        cmdInput.blur();
    });

    // --- MODALS ---
    const setupModal = (btnId, modalId, vidId = null) => {
        document.getElementById(btnId)?.addEventListener('click', (e) => {
            e.stopPropagation();
            sound1.play().catch(()=>{});
            const modal = document.getElementById(modalId);
            modal.style.display = 'flex';
            setTimeout(() => modal.style.opacity = '1', 10);
            if(vidId) document.getElementById(vidId).play();
        });
    };

    setupModal('btn-preview', 'preview-modal', 'macro-vid');
    setupModal('btn-fps-preview', 'fps-modal');

    document.getElementById('close-modal')?.addEventListener('click', () => {
        document.getElementById('preview-modal').style.opacity = '0';
        document.getElementById('macro-vid').pause();
        setTimeout(() => document.getElementById('preview-modal').style.display = 'none', 300);
    });

    document.getElementById('close-fps-modal')?.addEventListener('click', () => {
        document.getElementById('fps-modal').style.opacity = '0';
        setTimeout(() => document.getElementById('fps-modal').style.display = 'none', 300);
    });

    document.getElementById('btn-hub')?.addEventListener('click', () => window.open('https://efectmacrosxtweaks.netlify.app/', '_blank'));
    document.getElementById('btn-maps')?.addEventListener('click', () => window.open('https://fortnite.gg/creator/efect.lit', '_blank'));
});

// --- GITHUB API LIVE FETCH (CACHED & SAFE) ---
async function fetchGitHubUpdates() {
    const ghUpdateElement = document.getElementById('gh-update');
    const cachedData = localStorage.getItem('efect_gh_update');
    const cacheTime = localStorage.getItem('efect_gh_time');
    
    if (cachedData && cacheTime && (Date.now() - cacheTime < 300000)) {
        ghUpdateElement.innerHTML = cachedData;
        return;
    }

    try {
        const response = await fetch('https://api.github.com/users/tjcorp420/events/public');
        if (response.status === 403) {
            if (cachedData) ghUpdateElement.innerHTML = cachedData; 
            else ghUpdateElement.innerHTML = `<i class="fa-solid fa-shield-halved"></i> GITHUB API RATE LIMIT: STANDING BY...`;
            return;
        }

        const events = await response.json();
        const lastPush = events.find(event => event.type === 'PushEvent' && event.payload && event.payload.commits && event.payload.commits.length > 0);
        
        if(lastPush) {
            let repoName = lastPush.repo.name.split('/')[1].replace(/-/g, ' '); 
            const commitDate = new Date(lastPush.created_at).toLocaleDateString();
            const commitMessage = lastPush.payload.commits[0].message;
            const finalHTML = `<i class="fa-solid fa-code-commit"></i> LATEST UPDATE [${repoName}] (${commitDate}): ${commitMessage}`;
            ghUpdateElement.innerHTML = finalHTML;
            localStorage.setItem('efect_gh_update', finalHTML);
            localStorage.setItem('efect_gh_time', Date.now());
        } else {
            ghUpdateElement.innerHTML = `<i class="fa-solid fa-satellite-dish"></i> SCANNING FOR NEW EFECT UPDATES...`;
        }
    } catch (error) {
        ghUpdateElement.innerHTML = `<i class="fa-solid fa-satellite-dish"></i> GITHUB LINK SECURED`;
    }
}

// --- REAL HARDWARE DIAGNOSTICS ---
function initDiagnostics() {
    const battSpan = document.getElementById('batt-level');
    if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
            const updateBatt = () => { battSpan.innerText = `${Math.round(battery.level * 100)}% ${battery.charging ? '⚡' : ''}`; };
            updateBatt();
            battery.addEventListener('levelchange', updateBatt);
            battery.addEventListener('chargingchange', updateBatt);
        }).catch(() => { battSpan.innerText = "SECURED"; });
    } else { battSpan.innerText = "HIDDEN"; }

    const netSpan = document.getElementById('net-status');
    const updateNet = () => {
        if (navigator.connection && navigator.connection.effectiveType) {
            netSpan.innerText = navigator.connection.effectiveType.toUpperCase();
        } else {
            netSpan.innerText = navigator.onLine ? 'ONLINE' : 'OFFLINE';
        }
    };
    updateNet();
    window.addEventListener('online', updateNet);
    window.addEventListener('offline', updateNet);
}

// --- MATRIX EFFECT ---
function startMatrix() {
    const canvas = document.getElementById('matrix-canvas') || document.createElement('canvas');
    canvas.id = 'matrix-canvas';
    document.body.appendChild(canvas);
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    function draw() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#00ff00";
        ctx.font = fontSize + "px arial";

        for (let i = 0; i < drops.length; i++) {
            const text = characters.charAt(Math.floor(Math.random() * characters.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }
    setInterval(draw, 33);
}

// --- CORE UTILS ---
function handleGyro(e) {
    const grid = document.querySelector('.background-grid');
    if(grid) grid.style.transform = `translate(${e.gamma/1.5}px, ${(e.beta-45)/1.5}px)`;
}

function typeWriter() {
    if (i < text.length) {
        document.getElementById("typewriter").innerHTML += text.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
    } else { startTerminalLog(); }
}

function startTerminalLog() {
    const log = document.getElementById("terminal-log");
    setInterval(() => {
        log.innerText = "> " + systemLogs[logIndex];
        logIndex = (logIndex + 1) % systemLogs.length;
    }, 2000);
}

document.addEventListener('click', e => {
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
    for (let j = 0; j < 8; j++) {
        const p = document.createElement('div');
        p.classList.add('particle');
        document.body.appendChild(p);
        const angle = Math.random() * Math.PI * 2;
        const vel = 30 + Math.random() * 50;
        p.style.left = e.pageX + 'px';
        p.style.top = e.pageY + 'px';
        p.style.setProperty('--tx', Math.cos(angle) * vel + 'px');
        p.style.setProperty('--ty', Math.sin(angle) * vel + 'px');
        setTimeout(() => p.remove(), 600);
    }
});
