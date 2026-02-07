import mineflayer

# Konfigurasi bot
HOST = 'kalwi.net'  # ganti dengan alamat IP atau nama domain server
PORT = 25565
USERNAME = 'altparjooo1'  # ganti dengan nama bot
PASSWORD = 'afkparjo69'  # ganti dengan password register dan login
SUB_SERVER = ''  # ganti dengan nama sub server

# Buat bot
bot = mineflayer.Bot({
    'host': HOST,
    'port': PORT,
    'username': USERNAME,
    'auth': 'offline',
    'version': '1.21.4'
})

# Event handler
@bot.event
def login():
    print('Bot login!')
    bot.chat('/register ' + PASSWORD + ' ' + PASSWORD)
    bot.chat('/login ' + PASSWORD)
    bot.chat('/sv2 ' + SUB_SERVER)

@bot.event
def chat(message):
    print(message)

@bot.event
def error(err):
    print('Error:', err)

@bot.event
def end():
    print('Bot disconnect!')

# Jalankan bot
bot.start()
