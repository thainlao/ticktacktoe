// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
if (!BOT_TOKEN || !CHAT_ID) {
  console.warn('WARN: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set in env.');
}

app.post('/api/send-result', async (req, res) => {
  try {
    const { result, code } = req.body;
    const text =
      result === "win"
        ? `Победа! Промокод выдан: ${code}`
        : "Проигрыш";

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    const response = await axios.post(url, {
      chat_id: CHAT_ID,
      text,
    });

    res.json({ ok: true, data: response.data });
  } catch (err) {
    console.error("Telegram error:", err.response?.data || err);
    res.status(500).json({ error: "Telegram request failed" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
