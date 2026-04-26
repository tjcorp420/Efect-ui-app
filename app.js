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
    // --- BOOT SPLASH & GYRO ---
    const initBtn = document.getElementById('init-btn');
    const splashScreen = document.getElementById('splash-screen');
    const splashTerminal = document.getElementById('splash-terminal');
    const loaderBar = document.getElementById('loader-bar');

    if(initBtn) {
        initBtn.addEventListener('click', async () => {
            initBtn.style.display = 'none'; 
            document.getElementById('loader-wrapper').style.display = 'block';
            
            if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
                try {
                    const permissionState = await DeviceOrientationEvent.requestPermission();
                    if (permissionState === 'granted') window.addEventListener('deviceorientation', handleGyro);
                } catch (e) { console.error(e); }
            } else { window.addEventListener('deviceorientation', handleGyro); }

            let bootIdx = 0;
            const bootInterval = setInterval(() => {
                if (bootIdx < 6) {
                    splashTerminal.innerHTML += `> BOOT_SEQ_${bootIdx}... OK<br>`;
                    bootIdx++;
                    loaderBar.style.width = `${(bootIdx / 6) * 100}%`;
                } else {
                    clearInterval(bootInterval);
                    setTimeout(() => {
                        splashScreen.style.opacity = '0';
                        setTimeout(() => {
                            splashScreen.remove();
                            typeWriter(); 
                            initDiagnostics(); 
                            startTelemetry(); // Start the live ping loop
                        }, 500);
                    }, 600);
                }
            }, 300);
        });
    }

    // --- FIXED COMMAND CONSOLE LOGIC ---
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

    // --- BUTTONS & MODALS ---
    const setupModal = (btnId, modalId, vidId = null) => {
        document.getElementById(btnId)?.addEventListener('click', (e) => {
            e.stopPropagation();
            sound1.play();
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

// --- REAL HARDWARE DIAGNOSTICS ---
function initDiagnostics() {
    // 1. Battery API
    const battSpan = document.getElementById('batt-level');
    if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
            const updateBatt = () => {
                battSpan.innerText = `${Math.round(battery.level * 100)}% ${battery.charging ? '⚡' : ''}`;
            };
            updateBatt();
            battery.addEventListener('levelchange', updateBatt);
            battery.addEventListener('chargingchange', updateBatt);
        }).catch(() => {
            battSpan.innerText = "SECURED";
        });
    } else {
        battSpan.innerText = "HIDDEN"; // Fallback for iOS Safari
    }

    // 2. Network API
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

function startTelemetry() {
    const pingElement = document.getElementById("live-ping");
    if (!pingElement) return;
    setInterval(() => {
        pingElement.innerText = `Simulated Input: ${(Math.random() * 0.8 + 0.1).toFixed(2)}ms`;
    }, 120); 
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
