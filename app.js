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

// --- BOOT SPLASH & LOADER LOGIC ---
const initBtn = document.getElementById('init-btn');
const splashScreen = document.getElementById('splash-screen');
const splashTerminal = document.getElementById('splash-terminal');
const loaderWrapper = document.getElementById('loader-wrapper');
const loaderBar = document.getElementById('loader-bar');

const bootSequenceLogs = [
    "Mounting EFECT file system...",
    "Initializing hardware monitor...",
    "Injecting Efect Pro Macro core...",
    "Bypassing system latency limits...",
    "Locking CPU cores...",
    "SYSTEM READY."
];

document.addEventListener('DOMContentLoaded', () => {
    if(initBtn) {
        initBtn.addEventListener('click', async () => {
            initBtn.style.display = 'none'; 
            loaderWrapper.style.display = 'block';
            
            if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
                try {
                    const permissionState = await DeviceOrientationEvent.requestPermission();
                    if (permissionState === 'granted') {
                        window.addEventListener('deviceorientation', handleGyro);
                    }
                } catch (error) { console.error("Gyro denied", error); }
            } else {
                window.addEventListener('deviceorientation', handleGyro);
            }

            let bootIdx = 0;
            splashTerminal.innerHTML = "";
            
            const bootInterval = setInterval(() => {
                if (bootIdx < bootSequenceLogs.length) {
                    splashTerminal.innerHTML += `> ${bootSequenceLogs[bootIdx]}<br>`;
                    bootIdx++;
                    const progress = (bootIdx / bootSequenceLogs.length) * 100;
                    loaderBar.style.width = `${progress}%`;
                } else {
                    clearInterval(bootInterval);
                    setTimeout(() => {
                        splashScreen.style.opacity = '0';
                        setTimeout(() => {
                            splashScreen.remove();
                            typeWriter(); 
                            startTelemetry();
                        }, 500);
                    }, 600);
                }
            }, 350); 
        });
    }

    // --- SWIPE DOWN COMMAND CONSOLE LOGIC ---
    let startY = 0;
    const consoleUI = document.getElementById('command-console');
    const cmdInput = document.getElementById('cmd-input');

    document.addEventListener('touchstart', e => {
        startY = e.touches[0].clientY;
    });

    document.addEventListener('touchend', e => {
        let endY = e.changedTouches[0].clientY;
        if (startY < 80 && endY > startY + 60) { 
            consoleUI.style.top = '0'; 
            cmdInput.focus();
        }
    });

    // Handle Secret Codes (Fixed for mobile keyboards)
    cmdInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            // Strip out spaces and make it lowercase to prevent mobile keyboard typos
            const code = this.value.toLowerCase().replace(/\s+/g, '');
            
            if (code === 'efect.lit') {
                const secretCard = document.getElementById('secret-fps-card');
                secretCard.style.display = 'flex';
                consoleUI.style.top = '-100px';
                this.value = '';
                this.blur();
                alert("EFECT FPS BOOSTER OVERRIDE ACCEPTED.");
            } 
            else if (code === 'color_override') {
                // Instantly changes the entire app's color scheme randomly
                const randomColorShift = Math.floor(Math.random() * 360);
                document.body.style.filter = `hue-rotate(${randomColorShift}deg)`;
                consoleUI.style.top = '-100px';
                this.value = '';
                this.blur();
            } 
            else {
                consoleUI.style.top = '-100px';
                this.value = '';
                this.blur();
            }
        }
    });

    // --- MODAL LOGIC (MACRO & FPS) ---
    const previewModal = document.getElementById('preview-modal');
    const fpsModal = document.getElementById('fps-modal');
    
    // Macro Buttons
    document.getElementById('btn-preview')?.addEventListener('click', (e) => {
        e.stopPropagation(); 
        sound1.currentTime = 0; sound1.play();
        previewModal.style.display = 'flex';
        setTimeout(() => { previewModal.style.opacity = '1'; }, 10);
        document.getElementById('macro-vid')?.play();
    });
    
    document.getElementById('close-modal')?.addEventListener('click', () => {
        previewModal.style.opacity = '0';
        setTimeout(() => { 
            previewModal.style.display = 'none'; 
            document.getElementById('macro-vid')?.pause();
        }, 300);
    });

    // FPS Buttons
    document.getElementById('btn-fps-preview')?.addEventListener('click', (e) => {
        e.stopPropagation(); 
        sound1.currentTime = 0; sound1.play();
        fpsModal.style.display = 'flex';
        setTimeout(() => { fpsModal.style.opacity = '1'; }, 10);
    });

    document.getElementById('close-fps-modal')?.addEventListener('click', () => {
        fpsModal.style.opacity = '0';
        setTimeout(() => { fpsModal.style.display = 'none'; }, 300);
    });

    // --- EASTER EGG (TAP HEADER) ---
    let headerClicks = 0;
    document.getElementById('typewriter')?.addEventListener('click', () => {
        headerClicks++;
        if (headerClicks === 5) {
            document.documentElement.style.setProperty('--neon-color', '#ff0000');
            const allGreenText = document.querySelectorAll('h1, h2, .neon-btn:not(#secret-fps-card .neon-btn), .icon-wrapper, .terminal-log, #live-ping');
            allGreenText.forEach(el => el.style.color = '#ff0000');
            document.querySelectorAll('.glass-card').forEach(card => card.style.borderColor = 'rgba(255, 0, 0, 0.4)');
            document.getElementById('terminal-log').innerText = "> SYSTEM OVERRIDE INITIATED...";
            alert("ACCESS GRANTED: DEVELOPER MODE UNLOCKED");
        }
    });

    // --- ROUTING ---
    document.getElementById('btn-hub')?.addEventListener('click', (e) => {
        e.stopPropagation(); sound2.currentTime = 0; sound2.play();
        setTimeout(() => { window.open('https://efectmacrosxtweaks.netlify.app/', '_blank'); }, 200);
    });

    document.getElementById('btn-maps')?.addEventListener('click', (e) => {
        e.stopPropagation(); sound1.currentTime = 0; sound1.play();
        setTimeout(() => { window.open('https://fortnite.gg/creator/efect.lit', '_blank'); }, 200);
    });
});

// --- GYROSCOPE & VISUALS ---
function handleGyro(event) {
    const x = event.gamma ? event.gamma / 1.5 : 0; 
    const y = event.beta ? (event.beta - 45) / 1.5 : 0; 
    const grid = document.querySelector('.background-grid');
    if(grid) grid.style.transform = `translate(${x}px, ${y}px)`;
}

function typeWriter() {
    if (i < text.length) {
        document.getElementById("typewriter").innerHTML += text.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
    } else { startTerminalLog(); }
}

function startTerminalLog() {
    const logElement = document.getElementById("terminal-log");
    if (!logElement) return;
    logElement.innerText = "> " + systemLogs[0];
    logIndex++;
    setInterval(() => {
        logElement.innerText = "> " + systemLogs[logIndex];
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

document.addEventListener('click', function(e) {
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
    for (let j = 0; j < 8; j++) createParticle(e.pageX, e.pageY);
});

function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    document.body.appendChild(particle);
    const angle = Math.random() * Math.PI * 2;
    const velocity = 30 + Math.random() * 50; 
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.setProperty('--tx', Math.cos(angle) * velocity + 'px');
    particle.style.setProperty('--ty', Math.sin(angle) * velocity + 'px');
    setTimeout(() => { particle.remove(); }, 600);
}
