import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static('public')); // для панели (если будет)

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// Ваш Telegram user_id (указали вы)
const ADMIN_IDS = [7346303154, 8091408914, 6339304222];

// Каналы, в которые бот будет рассылать (указанные вами)
const CHAT_IDS = [
  -1002519099533,
  -1002514933227  
];

// ✅ Рассылка через личное сообщение в Telegram
bot.on('message', async (msg) => {
  const fromId = msg.from.id;
  const text = msg.text;

  if (!ADMIN_IDS.includes(fromId)) {
    return bot.sendMessage(fromId, '❌ У вас нет доступа.');
  }

  for (const chatId of CHAT_IDS) {
    try {
      await bot.sendMessage(chatId, text, { parse_mode: 'HTML' });
    } catch (err) {
      console.error(`Ошибка при отправке в ${chatId}:`, err.message);
    }
  }

  bot.sendMessage(fromId, '✅ Сообщение разослано в каналы.');
});

// ✅ Дополнительно: REST API /send (через Postman или панель)
app.post('/send', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).send({ error: 'message не передан' });

  for (const chatId of CHAT_IDS) {
    try {
      await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      });
    } catch (err) {
      console.error(`Ошибка при отправке в ${chatId}:`, err.response?.data || err.message);
    }
  }

  res.send({ status: 'ok' });
});

// ✅ Запуск сервера на Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
