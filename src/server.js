require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Organization = require('./models/Organization');
const handleUpdate = require('./bot');
const { setWebhook, deleteWebhook } = require('./utils/telegram');

const app = express();
app.use(express.json());

let WEBHOOK_BASE = (process.env.WEBHOOK_BASE_URL || 'https://tgwebhook.dmsline.uz').replace(/\/$/, '');
if (WEBHOOK_BASE && !WEBHOOK_BASE.startsWith('http')) {
  WEBHOOK_BASE = `https://${WEBHOOK_BASE}`;
}

// Telegram → POST /webhook/:slug
app.post('/webhook/:slug', async (req, res) => {
  res.sendStatus(200);
  try {
    const org = await Organization.findOne({
      slug: req.params.slug,
      'telegramBot.isActive': true,
    });
    if (!org) return;
    await handleUpdate(org, req.body);
  } catch (err) {
    console.error(`[${req.params.slug}] Webhook error:`, err.message);
  }
});

// Backend → POST /register/:slug  (webhook o'rnatish)
app.post('/register/:slug', async (req, res) => {
  try {
    const org = await Organization.findOne({ slug: req.params.slug });
    if (!org) return res.status(404).json({ ok: false, message: 'Org topilmadi' });

    const token = org.telegramBot?.token;
    if (!token) return res.status(400).json({ ok: false, message: "Token yo'q" });

    if (!WEBHOOK_BASE) return res.status(500).json({ ok: false, message: "WEBHOOK_BASE_URL .env da yo'q" });

    const url = `${WEBHOOK_BASE}/webhook/${org.slug}`;
    const result = await setWebhook(token, url);

    await Organization.findByIdAndUpdate(org._id, {
      'telegramBot.webhookUrl': url,
    });

    res.json({ ok: true, webhookUrl: url, telegram: result });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// Backend → POST /unregister/:slug  (webhook o'chirish)
app.post('/unregister/:slug', async (req, res) => {
  try {
    const org = await Organization.findOne({ slug: req.params.slug });
    if (!org?.telegramBot?.token) return res.json({ ok: true });
    await deleteWebhook(org.telegramBot.token).catch(() => {});
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'dms-bot', webhookBase: WEBHOOK_BASE || 'NOT SET' });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    const PORT = process.env.PORT || 5005;
    app.listen(PORT, () => {
      console.log(`DMS Bot webhook server ${PORT}-portda ishga tushdi`);
      console.log(`Webhook base: ${WEBHOOK_BASE || "⚠️  WEBHOOK_BASE_URL .env da yo'q!"}`);
    });
  })
  .catch(err => {
    console.error('MongoDB ulanmadi:', err.message);
    process.exit(1);
  });
