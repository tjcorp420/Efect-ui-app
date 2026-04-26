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

const bootSound = new Audio('efectboot.mp3');
const clickSound = new Audio('sound1.mp3');
bootSound.volume = 1.0;
clickSound.volume = 0.8;

function triggerClick() {
    clickSound.currentTime = 0;
    clickSound.play().catch(()=>{});
    if (navigator.vibrate) navigator.vibrate(15);
}

function showSysMsg(msg) {
    const noti = document.getElementById('sys-noti');
    noti.innerText = msg;
    noti.classList.add('show');
    setTimeout(() => noti.classList.remove('show'), 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    localStorage.removeItem('efect_monitor_unlocked');
    const savedScore = localStorage.getItem('efect_synergy_score');
    if (savedScore) document.getElementById('card-synergy-score').innerText = savedScore;

    const initBtn = document.getElementById('init-btn');
    const splashScreen = document.getElementById('splash-screen');
    const splashTerminal = document.getElementById('splash-terminal');
    const loaderBar = document.getElementById('loader-bar');

    if(initBtn) {
        initBtn.addEventListener('click', function(e) {
            // FIRE BOOT SOUND IMMEDIATELY
            bootSound.play().catch(err => console.log("Boot Sound Blocked", err));
            clickSound.play().then(() => { clickSound.pause(); clickSound.currentTime = 0; }).catch(()=>{});
            
            initBtn.style.display = 'none'; 
            document.getElementById('loader-wrapper').style.display = 'block';
            
            // ASK GYRO PERMISSION
            if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
                DeviceOrientationEvent.requestPermission().then(state => {
                    if (state === 'granted') window.addEventListener('deviceorientation', handleGyro);
                }).catch(console.error);
            } else {
                window.addEventListener('deviceorientation', handleGyro);
            }

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
                            splashScreen.style.display = 'none';
                            initLockScreen(); 
                        }, 500);
                    }, 600);
                }
            }, 300);
        });
    }

    // --- SECURE LOCK SCREEN LOGIC ---
    function initLockScreen() {
        const ls = document.getElementById('lock-screen');
        const savedPin = localStorage.getItem('efect_master_key');
        const btn = document.getElementById('lock-btn');
        const input = document.getElementById('lock-input');

        ls.style.display = 'flex';
        setTimeout(() => ls.style.opacity = '1', 10);

        if (!savedPin) {
            document.getElementById('lock-title').innerText = "INITIAL SETUP";
            document.getElementById('lock-subtitle').innerText = "Create a Master Key to encrypt your Hub.";
            btn.innerText = "REGISTER KEY";
        }

        btn.onclick = function() {
            const val = input.value.trim();
            if (!val) return;
            triggerClick();

            if (!savedPin) {
                localStorage.setItem('efect_master_key', val);
                unlockSystem();
            } else if (val === savedPin) {
                unlockSystem();
            } else {
                document.getElementById('lock-error').style.display = 'block';
                input.value = '';
            }
        };
    }

    function unlockSystem() {
        const ls = document.getElementById('lock-screen');
        ls.style.opacity = '0';
        setTimeout(() => {
            ls.style.display = 'none';
            typeWriter(); 
            initDiagnostics(); 
            startTelemetry(); 
            scheduleNextSale();
        }, 400);
    }

    // --- COMMAND CONSOLE LOGIC ---
    const consoleUI = document.getElementById('command-console');
    const cmdInput = document.getElementById('cmd-input');
    let startY = 0;

    document.addEventListener('touchstart', e => { startY = e.touches[0].clientY; });
    document.addEventListener('touchend', e => {
        if (startY < 300 && e.changedTouches[0].clientY > startY + 60) {
            consoleUI.style.top = '0';
            cmdInput.focus();
        }
    });

    consoleUI.addEventListener('submit', function (e) {
        e.preventDefault(); 
        triggerClick(); // PLAY SOUND ON SUBMIT
        const code = cmdInput.value.toLowerCase().replace(/\s+/g, '');
        
        if (code === 'efect.lit') {
            document.getElementById('secret-fps-card').style.display = 'flex';
            showSysMsg("> OVERRIDE: FPS BOOSTER UNLOCKED");
        } else if (code === '420') {
            const hwCard = document.getElementById('hw-monitor-card');
            const hwBtn = document.getElementById('btn-hw-monitor');
            hwCard.classList.remove('locked');
            document.getElementById('hw-status-badge').innerHTML = '<span class="dot"></span> ONLINE';
            document.getElementById('hw-status-badge').className = 'status online';
            hwBtn.classList.remove('disabled');
            hwBtn.removeAttribute('disabled');
            hwBtn.innerText = 'OPEN TELEMETRY';
            showSysMsg("> OVERRIDE: HARDWARE TELEMETRY UNLOCKED");
        } else {
            showSysMsg("> ERROR: UNKNOWN DIRECTIVE");
        }
        
        consoleUI.style.top = '-120px';
        cmdInput.value = '';
        cmdInput.blur();
    });

    // --- BUTTONS & MODALS ---
    const setupModal = (btnId, modalId, vidId = null) => {
        document.getElementById(btnId)?.addEventListener('click', (e) => {
            e.stopPropagation();
            triggerClick();
            const modal = document.getElementById(modalId);
            modal.style.display = 'flex';
            setTimeout(() => modal.style.opacity = '1', 10);
            if(vidId) document.getElementById(vidId).play();
        });
    };

    setupModal('btn-preview', 'preview-modal', 'macro-vid');
    setupModal('btn-fps-preview', 'fps-modal');
    setupModal('btn-synergy', 'synergy-modal');

    document.querySelectorAll('.close-hitbox, .close-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            triggerClick();
            const mod = this.closest('.modal-overlay');
            if(mod) {
                mod.style.opacity = '0';
                document.getElementById('macro-vid')?.pause();
                setTimeout(() => mod.style.display = 'none', 300);
            }
        });
    });

    document.getElementById('run-synergy-btn')?.addEventListener('click', function() {
        triggerClick();
        let score = Math.floor(Math.random() * (99 - 94) + 94);
        document.getElementById('syn-result').style.display = 'block';
        document.getElementById('syn-score-text').innerText = score;
        document.getElementById('card-synergy-score').innerText = score;
        localStorage.setItem('efect_synergy_score', score);
    });

    document.getElementById('btn-hub')?.addEventListener('click', () => { triggerClick(); window.open('https://efectmacrosxtweaks.netlify.app/', '_blank'); });
    document.getElementById('btn-maps')?.addEventListener('click', () => { triggerClick(); window.open('https://fortnite.gg/creator/efect.lit', '_blank'); });
    
    document.getElementById('share-btn')?.addEventListener('click', async () => {
        triggerClick();
        if (navigator.share) {
            try { await navigator.share({ title: 'EFECT Suite', text: 'Check out the EFECT Performance Hub.', url: window.location.href }); } catch (err) {}
        } else {
            navigator.clipboard.writeText(window.location.href);
            showSysMsg("Link Copied!");
        }
    });
});

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
        if (navigator.connection && navigator.connection.effectiveType) { netSpan.innerText = navigator.connection.effectiveType.toUpperCase(); } 
        else { netSpan.innerText = navigator.onLine ? 'ONLINE' : 'OFFLINE'; }
    };
    updateNet();
    window.addEventListener('online', updateNet);
    window.addEventListener('offline', updateNet);
}

function handleGyro(e) {
    const grid = document.querySelector('.background-grid');
    if(grid) grid.style.transform = `translate(${e.gamma/1.5}px, ${(e.beta-45)/1.5}px)`;
}

function typeWriter() {
    if (i < text.length) {
        document.getElementById("typewriter").innerHTML += text.charAt(i);
        i++; setTimeout(typeWriter, speed);
    } else { startTerminalLog(); }
}

function startTerminalLog() {
    const log = document.getElementById("terminal-log");
    setInterval(() => {
        if (log) log.innerText = "> " + systemLogs[logIndex];
        logIndex = (logIndex + 1) % systemLogs.length;
    }, 2000);
}

function startTelemetry() {
    const pingElement = document.getElementById("live-ping");
    if (!pingElement) return;
    setInterval(() => { pingElement.innerText = `Simulated Latency: ${(Math.random() * 0.8 + 0.1).toFixed(2)}ms`; }, 120); 
}

// --- CYBER SALES ENGINE ---
function triggerRandomSale() {
    const toast = document.getElementById('sales-toast');
    const locs = ["Texas", "London", "Florida", "California"];
    const products = ["Efect Pro Elite", "Efect Macro Engine", "Efect FPS Booster"];
    const l = locs[Math.floor(Math.random() * locs.length)];
    const p = products[Math.floor(Math.random() * products.length)];
    const ip = `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*100)}.xx`;
    
    document.getElementById('sale-desc').innerHTML = `User from <strong>${l}</strong> secured <strong>${p}</strong><br><span style="color:#00ff00; font-family:monospace; text-shadow:0 0 8px #00ff00;">[IP: ${ip}]</span>`;
    
    toast.classList.add('show');
    triggerClick();
    setTimeout(() => { toast.classList.remove('show'); scheduleNextSale(); }, 6000); 
}
function scheduleNextSale() { setTimeout(triggerRandomSale, 25000); }

// --- LEGACY CLICK PARTICLES ---
document.addEventListener('click', e => {
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
    try { clickSound.play().catch(()=>{}); } catch(err){}
    for (let j = 0; j < 8; j++) {
        const p = document.createElement('div');
        p.classList.add('particle');
        document.body.appendChild(p);
        const angle = Math.random() * Math.PI * 2;
        const vel = 40 + Math.random() * 60;
        p.style.left = e.pageX + 'px';
        p.style.top = e.pageY + 'px';
        p.style.setProperty('--tx', Math.cos(angle) * vel + 'px');
        p.style.setProperty('--ty', Math.sin(angle) * vel + 'px');
        setTimeout(() => p.remove(), 600);
    }
});
