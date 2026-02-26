const mineflayer = require('mineflayer');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// --- ⚙️ KONFIGURASI UTAMA ---
const settings = {
  host: 'kalwi.id',
  password: process.env.BOT_PASSWORD || 'parjoafk099', // Rekomendasi: Gunakan Secrets Replit
  version: '1.21.11'
};

//const listUtama = Array.from({ length: 20 }, (_, i) => 'Parjoimut' + (i + 17));
const listTambahan = ['Parjoimut31','Parjoimut32','Parjoimut33','Parjoimut34','Parjoimut35','Parjoimut36'];
const botAccounts = [/*...listUtama, */...listTambahan];

const activeBots = {};

// --- 🤖 UPTIMEROBOT SUPPORT ---
app.get('/uptime', (req, res) => {
  res.send('👸 HANCOCK V7 IS ALIVE! Bots: ' + Object.keys(activeBots).length);
});

// --- 🌐 DASHBOARD WEB (FRONTEND - ASLI DARI KAMU) ---
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
        <title>👸 HANCOCK V7 - SUPREME</title>
        <script src="/socket.io/socket.io.js"></script>
        <style>
          * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; margin: 0; padding: 0; }
          @keyframes rainbow-move { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
          @keyframes border-rainbow { 0% { border-color: #ff0000; box-shadow: 0 0 8px #ff0000; } 20% { border-color: #ffff00; box-shadow: 0 0 8px #ffff00; } 40% { border-color: #00ff00; box-shadow: 0 0 8px #00ff00; } 60% { border-color: #00ffff; box-shadow: 0 0 8px #00ffff; } 80% { border-color: #ff00ff; box-shadow: 0 0 8px #ff00ff; } 100% { border-color: #ff0000; box-shadow: 0 0 8px #ff0000; } }
          .rainbow-text { background: linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8b00ff); background-size: 400% 400%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: rainbow-move 5s linear infinite; font-weight: bold; display: inline-block; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); }
          body { background: url('https://a.top4top.io/p_37051cv4c0.jpeg') no-repeat center center fixed !important; background-size: cover !important; color: #ff3e3e; font-family: 'Consolas', monospace; padding: 8px; height: 100vh; width: 100vw; overflow: hidden; display: flex; flex-direction: column; }
          .header, #bot-sidebar, #terminal, .controls { background: rgba(0, 0, 0, 0.3) !important; border: 2px solid #ff0000; border-radius: 12px; animation: border-rainbow 6s linear infinite; }
          .header { display: flex; justify-content: space-between; align-items: center; padding: 10px; margin-bottom: 6px; flex-shrink: 0; }
          #main-layout { display: flex; flex-direction: row; flex-grow: 1; gap: 6px; overflow: hidden; height: 60vh; }
          #bot-sidebar { width: 135px; overflow-y: auto; padding: 4px; flex-shrink: 0; }
          #terminal { flex-grow: 1; padding: 10px; font-size: 10px; overflow-y: auto; }
          .bot-card { padding: 8px 5px; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer; font-size: 9px; color: #fff; }
          .bot-card.selected { background: rgba(255, 255, 255, 0.15); border-radius: 8px; font-weight: bold; border: 1px solid #fff; }
          .server-badge { color: #00ff41; font-size: 8px; display: block; font-weight: bold; margin-top: 2px; }
          .log { margin-bottom: 4px; border-bottom: 1px solid rgba(255,255,255,0.03); padding-bottom: 3px; word-break: break-all; }
          .time { color: #fff; opacity: 0.6; font-size: 8px; }
          .controls { display: flex; gap: 5px; padding: 12px; margin-top: 6px; flex-shrink: 0; }
          input { flex-grow: 1; background: rgba(255,255,255,0.1); color: #fff; border: 1px solid #ff3e3e; padding: 10px; border-radius: 8px; outline: none; font-size: 14px; }
          button { color: #fff; border: none; cursor: pointer; border-radius: 8px; font-weight: bold; font-size: 14px; min-width: 45px; }
          .btn-fire { background: #ff3e3e; }
          .btn-dc { background: #555; border: 1px solid #ff3e3e; }
          .btn-rc { background: #00ff41; color: #000; }
          .btn-clear { background: rgba(255, 255, 255, 0.1); border: 1px solid #ff3e3e; }
          #botCount { background:#ff3e3e; color:#fff; padding:2px 10px; border-radius:10px; font-size:10px; font-weight:bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="rainbow-text" style="font-size: 15px; margin: 0;">👸 HANCOCK V7 SUPREME</h1>
          <div id="botCount">0 ON</div>
        </div>
        <div id="main-layout">
          <div id="bot-sidebar"><div id="list-container"></div></div>
          <div id="terminal"></div>
        </div>
        <div class="controls">
          <input type="text" id="cmdInput" placeholder="Ketik perintah..." onkeydown="if(event.key==='Enter') send()">
          <button class="btn-fire" onclick="send()">🚀</button>
          <button class="btn-dc" onclick="quickCmd('!dc')">OFF</button>
          <button class="btn-rc" onclick="quickCmd('!rc')">ON</button>
          <button class="btn-clear" onclick="document.getElementById('terminal').innerHTML = ''">🗑️</button>
        </div>
        <script>
          const socket = io();
          const term = document.getElementById('terminal');
          const listCont = document.getElementById('list-container');
          let selectedBot = null;
          socket.on('update-list', function(bots) {
            let onlineCount = 0;
            listCont.innerHTML = '<div class="bot-card ' + (!selectedBot ? 'selected' : '') + '" onclick="selectBot(null)"><span>🎯 MASS CONTROL</span></div>';
            botAccountsStatic.forEach(name => {
              const div = document.createElement('div');
              div.className = 'bot-card ' + (selectedBot === name ? 'selected' : '');
              const statusText = bots[name] || '🔴 OFFLINE';
              if(statusText !== '🔴 OFFLINE') onlineCount++;
              div.innerHTML = '<span>' + name + '</span> <span class="server-badge">' + statusText + '</span>';
              div.onclick = function() { selectedBot = name; socket.emit('request-update'); };
              listCont.appendChild(div);
            });
            document.getElementById('botCount').innerText = onlineCount + ' ON';
          });
          const botAccountsStatic = ${JSON.stringify(botAccounts)};
          socket.on('log', function(data) {
            const div = document.createElement('div');
            div.className = 'log';
            div.innerHTML = '<span class="time">[' + data.time + ']</span> <b style="color:#ff3e3e">[' + data.user + ']</b> ' + data.msg;
            term.appendChild(div);
            if(term.childNodes.length > 15) term.removeChild(term.firstChild);
            term.scrollTop = term.scrollHeight;
          });
          function send() {
            const input = document.getElementById('cmdInput');
            if(!input.value) return;
            socket.emit('execute-command', { target: selectedBot, cmd: input.value });
            input.value = '';
          }
          function quickCmd(command) { socket.emit('execute-command', { target: selectedBot, cmd: command }); }
        </script>
      </body>
    </html>
  `);
});

// --- 🤖 BOT CORE LOGIC ---

function logWeb(user, msg) {
  const time = new Date().toLocaleTimeString();
  io.emit('log', { time: time, user: user, msg: msg });
}

function updateWebList() {
  const data = {};
  botAccounts.forEach(name => {
    if (activeBots[name]) {
      const loc = activeBots[name].location || 'Lobby';
      const timer = activeBots[name].timerAFK ? " [⏳ " + activeBots[name].timerAFK + "]" : '';
      const shards = activeBots[name].afkShards || 0;
      data[name] = loc + timer + ' | 💎 ' + shards;
    } else {
      data[name] = '🔴 OFFLINE';
    }
  });
  io.emit('update-list', data);
}

function createBot(username, index) {
  if (activeBots[username]) return;

  const bot = mineflayer.createBot({
    host: settings.host,
    username: username,
    version: settings.version,
    checkTimeoutInterval: 90000,
    hideErrors: true 
  });

  bot.afkShards = 0;
  bot.timerAFK = "";

  // ✨ ASLI DARI KAMU: ANTI-KICK TELEPORT
  bot.on('forcedMove', () => {
    bot.physicsEnabled = false; 
    setTimeout(() => { if(bot.physicsEnabled !== undefined) bot.physicsEnabled = true; }, 1000);
  });

  bot.location = 'Handshake...';
  bot.isAllowedToReconnect = true;

  bot.on('messagestr', (chat) => {
    const chatLow = chat.toLowerCase();

    // 💎 FITUR BARU: DETEKSI AFK SHARDS
    const shardMatch = chat.match(/(\d+)\s*(?:AFK\s*)?Shards/i);
    if (shardMatch) {
      const jumlah = parseInt(shardMatch);
      bot.afkShards += jumlah;
      logWeb(username, `💎 <span style="color:#00ffff"><b>+${jumlah} AFK Shards</b></span> (Total: ${bot.afkShards})`);
      updateWebList();
      return; 
    }

    // ✨ ASLI DARI KAMU: TRACK SERVER MATCH
    if (chatLow.includes('welcome') || chatLow.includes('server') || chatLow.includes('connecting') || chatLow.includes('menuju')) {
      const serverMatch = chat.match(/(sv\d+|srpg|oneblock|skyblock|lobby|hub)/i);
    if (serverMatch && serverMatch[0]) { 
      bot.location = serverMatch[0].toUpperCase(); // Tambahkan [0] untuk mengambil teksnya
      updateWebList(); 
    }
    }

    // ✨ ASLI DARI KAMU: DETEKSI CAPTCHA
    const match = chat.match(/\d{4,6}/);
    if (match && (chatLow.includes('captcha') || chatLow.includes('verifikasi'))) {
       logWeb(username, '🧩 <b>Captcha: <span style="color:#00ff41">' + match + '</span></b>');
       return;
    }

    // 🔇 FITUR BARU: FILTER CHAT (WHITELIST)
    const whitelist = ['admin', 'banned', 'kick', 'login', 'berhasil', 'error'];
    if (whitelist.some(word => chatLow.includes(word))) logWeb(username, chat);
  });

  // ⏳ FITUR BARU: DETEKSI TIMER ACTION BAR (TIMER 5 MENIT)
  bot.on('actionBar', (jsonMsg) => {
    const text = jsonMsg.toString();
    const timerMatch = text.match(/(\d{1,2}:\d{2})/);
    if (timerMatch) { bot.timerAFK = timerMatch[1]; updateWebList(); }
  });

  bot.once('spawn', () => {
    activeBots[username] = bot;
    bot.location = 'Lobby';
    setTimeout(updateWebList, 1500); 
    logWeb(username, '✨ <b>Joined Server!</b>');
    
    // ✨ ASLI DARI KAMU: AUTO LOGIN
    setTimeout(() => { if (activeBots[username]) bot.chat('/login ' + settings.password); }, 3000);
    
    // ✨ ASLI DARI KAMU: AUTO SV2 & LARI 15 DETIK (DITAMBAH DELAY JEDA LOGIN)
    setTimeout(() => { 
      if (activeBots[username]) { 
        bot.chat('/sv2'); 
        bot.location = 'SV2'; 
        updateWebList(); 

        setTimeout(() => {
          if (activeBots[username]) {
            logWeb(username, '🏃 <b>Lari maju (Anti-AFK)...</b>');
            bot.setControlState('forward', true); bot.setControlState('sprint', true);
            setTimeout(() => { if (activeBots[username]) { bot.setControlState('forward', false); bot.setControlState('sprint', false); logWeb(username, '🛑 <b>Berhenti.</b>'); } }, 5000); 
          }
        }, 20000); 
      } 
    }, 5000 + (index % 10 * 2000));

    // ✨ FIX BOT NYANGKUT DI LOBBY (Auto-Retry SV2)
    setTimeout(() => { if (activeBots[username] && (bot.location === 'LOBBY' || bot.location === 'Handshake...')) { bot.chat('/sv2'); bot.location = 'SV2'; updateWebList(); } }, 10000);
  });

  // ✨ ASLI DARI KAMU: AUTO RESPAWN
  bot.on('death', () => { logWeb(username, '💀 <b>Mati! Mencoba Respawn...</b>'); bot.respawn(); });
  
  // ✨ ASLI DARI KAMU: AUTO RECONNECT
  bot.once('end', () => {
    const reconnectDulu = bot.isAllowedToReconnect;
    delete activeBots[username];
    updateWebList();
    if (reconnectDulu) {
      logWeb(username, '📡 <b>RC dalam 15 detik...</b>');
      setTimeout(() => { if (!activeBots[username]) createBot(username, index); }, 15000);
    }
  });

  bot.on('error', () => { if (bot.isAllowedToReconnect) bot.quit(); });
}

// --- 🎮 SOCKET CONTROL ---
io.on('connection', (socket) => {
  updateWebList();
  socket.on('request-update', () => updateWebList());
  
  socket.on('execute-command', (data) => {
    const { target, cmd } = data;
    const cmdLow = cmd.toLowerCase().trim();

    const sendCmd = (botName) => {
      const b = activeBots[botName];
      if (!b && cmdLow !== '!rc') return;

      if (cmdLow === '!dc') { if (b) { b.isAllowedToReconnect = false; b.quit(); } return; }
      if (cmdLow === '!rc') { logWeb(botName, '🔄 <b>Starting...</b>'); createBot(botName, botAccounts.indexOf(botName)); return; }

      if (b) {
        b.chat(cmd);
        // ✨ ASLI DARI KAMU: TRACK LOKASI MANUAL
        const cmdParts = cmdLow.split(' ');
        const firstWord = cmdParts[0].replace('/', '').toUpperCase(); 
        if (firstWord.startsWith('SV')) b.location = firstWord;
        else if (cmdLow.includes('srpg')) b.location = 'SRPG';
        else if (cmdLow.includes('oneblock')) b.location = 'ONEBLOCK';
        else if (cmdLow.includes('skyblock')) b.location = 'SKYBLOCK';
        else if (cmdLow.includes('hub') || cmdLow.includes('lobby')) b.location = 'LOBBY';

        // ✨ ASLI DARI KAMU: TPTOGGLE STATUS
        if (cmdLow === '/tptoggle enable') b.location = b.location.split(' ')[0] + ' 🟢';
        else if (cmdLow === '/tptoggle disable') b.location = b.location.split(' ')[0] + ' ⚔️';
        updateWebList();
      }
    };

    if (target) sendCmd(target);
    else botAccounts.forEach((name, i) => { setTimeout(() => sendCmd(name), i * 2000); });
  });
});

// --- 🚀 INITIALIZATION (OFF BY DEFAULT) ---
server.listen(3000, () => {
  console.log('✅ HANCOCK V7 SUPREME ONLINE');
});
