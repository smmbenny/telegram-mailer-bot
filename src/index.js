import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}`;

const CHAT_IDS = [
  -1001234567890, // замените на свои chat_id
  -1009876543210
];

async function broadcastMessage(text) {
  for (const chatId of CHAT_IDS) {
    try {
      await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: chatId,
        text,
        parse_mode: 'HTML'
      });
      console.log(`✅ Отправлено в ${chatId}`);
    } catch (err) {
      console.error(`❌ Ошибка при отправке в ${chatId}`, err.response?.data || err.message);
    }
  }
}

app.post('/send', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).send({ error: 'message не передан' });

  await broadcastMessage(message);
  res.send({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
