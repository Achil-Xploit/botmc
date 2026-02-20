const mineflayer = require('mineflayer');

// Konfigurasi bot
const config = {
  host: 'kalwi.id', // alamat server Minecraft
  username: 'ParjoImut1', // nama bot
  version: '1.21.10', // versi Minecraft
};

// Buat bot
const bot = mineflayer.createBot(config);

// Event ketika bot login
bot.on('login', () => {
  console.log('Bot telah login!');
  /*bot.chat('/register passwordbot passwordbot');*/
});

// Event ketika bot bergabung ke server
bot.on('spawn', () => {
  console.log('Bot telah bergabung ke server!');
  bot.chat('/login parjoafk099');
  setTimeout(() => {
    bot.chat('/sv2');
  }, 5000);
});

// Event ketika bot error
bot.on('error', (err) => {
  console.log('Error:', err);
});
