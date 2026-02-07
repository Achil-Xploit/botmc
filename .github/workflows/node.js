const mineflayer = require('mineflayer');

const bot = mineflayer.createBot({
  host: 'kalwi.id', // ganti dengan alamat IP atau nama domain server
  port: 25565,
  username: 'altparjo69', // ganti dengan nama bot
  auth: 'offline', // auth offline
  version: '1.18.2' // ganti dengan versi Minecraft
});

bot.on('login', () => {
  console.log('Bot login!');
  bot.chat('/register password password'); // ganti dengan password register
  setTimeout(() => {
    bot.chat('/login password'); // ganti dengan password login
  }, 1000);
  setTimeout(() => {
    bot.chat('/sv2'); // ganti dengan nama sub server
  }, 2000);
});

bot.on('chat', (username, message) => {
  console.log(`${username}: ${message}`);
});

bot.on('error', (err) => {
  console.log('Error:', err);
});

bot.on('end', () => {
  console.log('Bot disconnect!');
});
