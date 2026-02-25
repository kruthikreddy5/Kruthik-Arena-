// CONFIGURATION
const GH_TOKEN = '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';

// 1. BINARY RAIN ENGINE
const canvas = document.getElementById('binary-canvas');
const ctx = canvas.getContext('2d');
let width, height, columns;
const fontSize = 14;
const binary = "01";
let drops = [];

function initBinary() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    columns = Math.floor(width / fontSize);
    drops = Array(columns).fill(1);
}

function drawBinary() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#ffffff"; // White binary for cleaner look
    ctx.font = fontSize + "px monospace";
    for (let i = 0; i < drops.length; i++) {
        const text = binary[Math.floor(Math.random() * binary.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    }
}
window.addEventListener('resize', initBinary);
initBinary();
setInterval(drawBinary, 60);

// 2. DRAWER & THEME
function toggleDrawer() { document.getElementById('workspace').classList.toggle('open'); }

// 3. TODO LOGIC
function addTodo() {
    const input = document.getElementById('todo-in');
    const list = document.getElementById('todo-list');
    if (input.value.trim()) {
        const li = document.createElement('li');
        li.className = "flex items-center gap-3 cursor-pointer hover:opacity-100 transition-opacity";
        li.innerHTML = `<input type="checkbox" class="accent-white"> <span>${input.value}</span>`;
        list.appendChild(li);
        input.value = "";
    }
}

// 4. TIMER LOGIC
let timeLeft = 1500;
let timerObj = null;

function setTimer(m) { timeLeft = m * 60; updateDisplay(); }
function updateDisplay() {
    let m = Math.floor(timeLeft / 60), s = timeLeft % 60;
    let timeStr = `${m}:${s < 10 ? '0' : ''}${s}`;
    document.getElementById('d-time').innerText = timeStr;
    document.getElementById('p-time').innerText = timeStr;
}

function startFocus() {
    document.getElementById('portal').style.display = 'flex';
    timerObj = setInterval(() => {
        if(timeLeft > 0) { timeLeft--; updateDisplay(); }
        else { stopFocus(); }
    }, 1000);
}

function stopFocus() {
    clearInterval(timerObj);
    document.getElementById('portal').style.display = 'none';
}

// 5. GITHUB AI (Researcher)
async function askAI() {
    const input = document.getElementById('ai-in');
    const resBox = document.getElementById('ai-res');
    if (!input || !input.value.trim()) return;

    const query = input.value;
    input.value = "";
    resBox.innerHTML = "[ ACCESSING GITHUB MODELS... ]";

    try {
        // We use the direct endpoint. Ensure GH_TOKEN has no "Bearer" prefix in the variable itself.
        const response = await fetch('https://models.inference.ai.azure.com/chat/completions', {
            method: 'POST',
            // No custom headers other than these two, to keep Safari happy
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + GH_TOKEN.trim()
            },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: "You are a concise Class 11 Physics tutor." },
                    { role: "user", content: query }
                ],
                model: "gpt-4o"
            })
        });

        // Check if Safari blocked the response
        if (!response.ok) {
            const errorBody = await response.json();
            resBox.innerHTML = `[GATEWAY REJECTED]: ${errorBody.error?.message || response.status}`;
            return;
        }

        const data = await response.json();
        resBox.innerHTML = data.choices[0].message.content.replace(/\n/g, '<br>');

    } catch (e) {
        // If it hits here, it's a browser-level block
        resBox.innerHTML = "[CONNECTION REFUSED: Check Safari/Network Settings]";
        console.error("Uplink failed:", e);
    }
}
