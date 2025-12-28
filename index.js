const TelegramBot = require("node-telegram-bot-api")
require("dotenv").config()

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true })

const CHANNEL_ID = "@CurhatanAnonim_id" // GANTI nanti

// simpan data user sementara
const users = {}

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id
  users[chatId] = {}

  bot.sendMessage(chatId,
    "Halo 🤍\nAku bot curhat anonim.\n\nApakah kamu mengizinkan username kamu ditampilkan agar orang bisa chat kamu?",
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "✅ Izinkan", callback_data: "allow_yes" }],
          [{ text: "❌ Tidak", callback_data: "allow_no" }]
        ]
      }
    }
  )
})

bot.on("callback_query", (q) => {
  const chatId = q.message.chat.id
  const data = q.data
  const user = users[chatId] || {}

  if (data === "allow_yes") {
    if (!q.from.username) {
      bot.sendMessage(chatId, "❌ Kamu belum punya username Telegram.\nBuat dulu di Settings → Username")
      return
    }
    user.username = q.from.username
    user.allow = true
  }

  if (data === "allow_no") {
    user.allow = false
  }

  if (data.startsWith("allow")) {
    users[chatId] = user
    bot.sendMessage(chatId, "Pilih jenis kelamin kamu:", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "👩 Perempuan", callback_data: "gender_f" }],
          [{ text: "👨 Laki-laki", callback_data: "gender_m" }]
        ]
      }
    })
  }

  if (data === "gender_f" || data === "gender_m") {
    user.gender = data === "gender_f" ? "Perempuan" : "Laki-laki"
    users[chatId] = user
    bot.sendMessage(chatId, "Silakan kirim curhatan kamu 🤍")
  }

  bot.answerCallbackQuery(q.id)
})

bot.on("message", (msg) => {
  const chatId = msg.chat.id
  const user = users[chatId]

  if (!user || !user.gender || msg.text.startsWith("/")) return

  const text = msg.text
  let caption = `
🕶️ Curhat Anonim
🚻 Gender: ${user.gender}

"${text}"
`

  const options = {}

  if (user.allow && user.username) {
    options.reply_markup = {
      inline_keyboard: [
        [{ text: "💬 Kirim Chat", url: `https://t.me/${user.username}` }]
      ]
    }
  }

  bot.sendMessage(CHANNEL_ID, caption, options)
  bot.sendMessage(chatId, "Terima kasih 🤍 curhatan kamu sudah dipost secara anonim.")

  delete users[chatId]
})

console.log("Bot curhat anonim running...")
