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

// --- HARDWARE AUDIO & HAPTICS BYPASS (FIXED FILE PATHS) ---
const clickSound = new Audio('All%20other%20button%20clicks.wav'); 
const bootSound = new Audio('Initializesound.mp3');   
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
    const crt = document.createElement('div');
    crt.classList.add('crt-overlay');
    document.body.appendChild(crt);

    // --- PERSISTENT MEMORY LOADER ---
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

    // --- SECURE LOCK SCREEN LOGIC ---
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
        }, 400);
    }

    // --- NATIVE IOS SHARE BUTTON ---
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            triggerClick();
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
            } else if (code === 'color_override') {
                document.body.style.filter = `hue-rotate(${Math.floor(Math.random() * 360)}deg)`;
            } else if (code === 'matrix') {
                startMatrix();
            } else if (code === '420') {
                triggerBoot(); 
                unlockHardwareMonitor();
            }
            
            consoleUI.style.top = '-100px';
            cmdInput.value = '';
            cmdInput.blur();
        });
    }

    // --- MODALS ---
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

    document.getElementById('close-modal')?.addEventListener('click', () => {
        triggerClick();
        const pm = document.getElementById('preview-modal');
        if (pm) pm.style.opacity = '0';
        document.getElementById('macro-vid')?.pause();
        setTimeout(() => { if (pm) pm.style.display = 'none'; }, 300);
    });

    document.getElementById('close-fps-modal')?.addEventListener('click', () => {
        triggerClick();
        const fm = document.getElementById('fps-modal');
        if (fm) fm.style.opacity = '0';
        setTimeout(() => { if (fm) fm.style.display = 'none'; }, 300);
    });

    document.getElementById('close-synergy-modal')?.addEventListener('click', () => {
        triggerClick();
        const sm = document.getElementById('synergy-modal');
        if (sm) sm.style.opacity = '0';
        setTimeout(() => { if (sm) sm.style.display = 'none'; }, 300);
    });

    document.getElementById('btn-hub')?.addEventListener('click', () => {
        triggerClick();
        window.open('https://efectmacrosxtweaks.netlify.app/', '_blank');
    });

    document.getElementById('btn-maps')?.addEventListener('click', () => {
        triggerClick();
        window.open('https://fortnite.gg/creator/efect.lit', '_blank');
    });

    // --- SYNERGY CALCULATION LOGIC & AUTO-SAVE ---
    document.getElementById('run-synergy-btn')?.addEventListener('click', () => {
        triggerClick();
        
        const gpuName = document.getElementById('syn-gpu').value.toUpperCase() || "UNKNOWN GPU";
        const cpuName = document.getElementById('syn-cpu').value.toUpperCase() || "UNKNOWN CPU";
        const perName = document.getElementById('syn-per').value.toUpperCase() || "STANDARD GEAR";
        
        let gpuVal = 50;
        if (gpuName.includes('4090') || gpuName.includes('7900 XTX')) gpuVal = 100;
        else if (gpuName.includes('4080') || gpuName.includes('4070 TI') || gpuName.includes('7900 XT')) gpuVal = 95;
        else if (gpuName.includes('4070') || gpuName.includes('3090') || gpuName.includes('7800')) gpuVal = 88;
        else if (gpuName.includes('4060') || gpuName.includes('3080') || gpuName.includes('7700')) gpuVal = 82;
        else if (gpuName.includes('3070') || gpuName.includes('6700') || gpuName.includes('2080')) gpuVal = 75;
        else if (gpuName.includes('3060') || gpuName.includes('2070') || gpuName.includes('6600')) gpuVal = 65;
        else if (gpuName.includes('3050') || gpuName.includes('1660') || gpuName.includes('2060')) gpuVal = 45;

        let cpuVal = 50;
        if (cpuName.includes('14900') || cpuName.includes('7950X3D') || cpuName.includes('7800X3D')) cpuVal = 100;
        else if (cpuName.includes('14700') || cpuName.includes('13900') || cpuName.includes('7900X')) cpuVal = 95;
        else if (cpuName.includes('14600') || cpuName.includes('13700') || cpuName.includes('7700X')) cpuVal = 88;
        else if (cpuName.includes('13600') || cpuName.includes('12900') || cpuName.includes('5800X3D')) cpuVal = 82;
        else if (cpuName.includes('12700') || cpuName.includes('12600') || cpuName.includes('5700X')) cpuVal = 75;
        else if (cpuName.includes('12400') || cpuName.includes('11600') || cpuName.includes('5600')) cpuVal = 65;

        let perVal = 50;
        if (perName.includes('APEX PRO') || perName.includes('SUPERLIGHT') || perName.includes('WOOTING') || perName.includes('SCUF') || perName.includes('HEX')) perVal = 100;
        else if (perName.includes('PRO') || perName.includes('ESPORTS')) perVal = 85;
        
        const score = Math.floor((gpuVal * 0.45) + (cpuVal * 0.40) + (perVal * 0.15));
        
        const resultBox = document.getElementById('syn-result');
        const scoreText = document.getElementById('syn-score-text');
        const adviceText = document.getElementById('syn-advice');
        const cardScore = document.getElementById('card-synergy-score'); 
        
        resultBox.style.display = 'block';
        scoreText.innerText = "CALC...";
        adviceText.innerText = "Scanning exact hardware identifiers and simulating 1% low frame times...";
        
        setTimeout(() => {
            triggerClick(); 
            scoreText.innerText = score;
            
            localStorage.setItem('efect_synergy_score', score);
            if (cardScore) cardScore.innerText = `${score}/100`;
            
            let customFeedback = "";
            
            if (gpuVal < cpuVal - 15) {
                customFeedback += `BOTTLENECK: Your ${gpuName} is holding back the ${cpuName}. Recommend lowering 3D resolution. `;
            } else if (cpuVal < gpuVal - 15) {
                customFeedback += `BOTTLENECK: Your ${cpuName} is choking the ${gpuName}. Lock CPU cores with EFECT Optimizer. `;
            } else {
                customFeedback += `PERFECT SYNERGY: The ${cpuName} and ${gpuName} are flawlessly paired. `;
            }
            
            if (score >= 90) {
                customFeedback += `\n\nSTATUS: Elite Tier. You have raw 0-delay hardware. Inject EFECT Macros for absolute minimum input lag.`;
            } else if (score >= 70) {
                customFeedback += `\n\nSTATUS: Competitive Tier. Solid frame times. Ensure your peripheral polling rates are maxed to match the system.`;
            } else {
                customFeedback += `\n\nSTATUS: Casual Tier. Heavy optimizations required. Drop all Fortnite settings to Performance Mode.`;
            }
            
            adviceText.innerText = customFeedback;
        }, 1500);
    });

    // --- HARDWARE MONITOR JAILBREAK & TELEMETRY ENGINE ---
    function unlockHardwareMonitor() {
        const hwCard = document.getElementById('hw-monitor-card');
        const hwBtn = document.getElementById('btn-hw-monitor');
        const hwBadge = document.getElementById('hw-status-badge');
        
        if (hwCard && hwBtn && hwBadge) {
            hwCard.classList.remove('locked');
            hwBadge.className = 'status online';
            hwBadge.innerHTML = '<span class="dot"></span> ONLINE';
            hwBadge.style.color = '#00ff00';
            hwBadge.style.borderColor = '#00ff00';
            hwBadge.style.background = 'rgba(0,255,0,0.1)';
            
            hwBtn.classList.remove('disabled');
            hwBtn.removeAttribute('disabled');
            hwBtn.innerText = 'OPEN TELEMETRY';
            
            localStorage.setItem('efect_monitor_unlocked', 'true');
        }
    }

    if (localStorage.getItem('efect_monitor_unlocked') === 'true') {
        unlockHardwareMonitor();
    }

    document.getElementById('btn-hw-monitor')?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (document.getElementById('btn-hw-monitor').classList.contains('disabled')) return;
        
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

    document.getElementById('btn-force-cool')?.addEventListener('click', () => {
        triggerBoot(); 
        document.getElementById('tel-cpu-temp').innerText = '32°C';
        document.getElementById('tel-gpu-temp').innerText = '28°C';
        document.getElementById('tel-cpu-temp').style.color = '#00ffff'; 
        document.getElementById('tel-gpu-temp').style.color = '#00ffff'; 
        setTimeout(() => {
            document.getElementById('tel-cpu-temp').style.color = '#00ff00';
            document.getElementById('tel-gpu-temp').style.color = '#00ff00';
        }, 2000);
    });

    setInterval(() => {
        const tm = document.getElementById('telemetry-modal');
        if (tm && tm.style.opacity === '1') {
            
            document.getElementById('tel-cpu-temp').innerText = Math.floor(Math.random() * (65 - 40) + 40) + '°C';
            document.getElementById('tel-cpu-load').innerText = Math.floor(Math.random() * (45 - 10) + 10) + '%';
            document.getElementById('tel-gpu-temp').innerText = Math.floor(Math.random() * (55 - 35) + 35) + '°C';
            document.getElementById('tel-gpu-load').innerText = Math.floor(Math.random() * (35 - 5) + 5) + '%';
            
            const graph = document.getElementById('ping-graph');
            if (graph) {
                const bar = document.createElement('div');
                const ping = Math.floor(Math.random() * (25 - 0) + 5); 
                
                bar.style.width = '8px';
                bar.style.flexShrink = '0';
                bar.style.backgroundColor = ping > 20 ? '#ff3333' : '#00ff00'; 
                bar.style.height = (ping * 3) + '%'; 
                bar.style.transition = 'height 0.2s ease';
                
                graph.appendChild(bar);
                
                if (graph.children.length > 50) {
                    graph.removeChild(graph.firstChild);
                }
            }
        }
    }, 600); 
});

// --- GITHUB API LIVE FETCH (CACHED & SAFE) ---
async function fetchGitHubUpdates() {
    const ghUpdateElement = document.getElementById('gh-update');
    if (!ghUpdateElement) return;

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
        
        if (lastPush) {
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
    if (battSpan) {
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                const updateBatt = () => { battSpan.innerText = `${Math.round(battery.level * 100)}% ${battery.charging ? '⚡' : ''}`; };
                updateBatt();
                battery.addEventListener('levelchange', updateBatt);
                battery.addEventListener('chargingchange', updateBatt);
            }).catch(() => { battSpan.innerText = "SECURED"; });
        } else { battSpan.innerText = "HIDDEN"; }
    }

    const netSpan = document.getElementById('net-status');
    if (netSpan) {
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

// --- LIQUID RIPPLES AND PARTICLES ---
document.addEventListener('click', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'OPTION') return;

    const ripple = document.createElement('div');
    ripple.classList.add('ripple');
    ripple.style.left = e.pageX + 'px';
    ripple.style.top = e.pageY + 'px';
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600); 

    if (e.target.tagName === 'BUTTON') return;
    
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
