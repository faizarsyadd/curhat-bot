const TelegramBot = require("node-telegram-bot-api")
require("dotenv").config()

const bot = new TelegramBot(process.env.TOKEN, { polling: true })

const ADMIN_ID = 123456789 // ganti id kamu

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id,
    "💔 Selamat datang di CurhatBot\n\nKamu bisa curhat di sini tanpa identitas.\nKetik pesanmu sekarang."
  )
})

bot.on("message", (msg) => {
  if (msg.text.startsWith("/")) return

  // kirim ke admin
  bot.sendMessage(ADMIN_ID,
    `💌 Curhat baru:\n\n${msg.text}`
  )

  bot.sendMessage(msg.chat.id,
    "💖 Curhatmu sudah terkirim.\nTerima kasih sudah berbagi."
  )
})
