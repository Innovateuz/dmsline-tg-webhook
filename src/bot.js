const handleStart = require('./commands/start');

module.exports = async function handleUpdate(org, update) {
  const token = org.telegramBot?.token;
  if (!token) return;

  const message = update.message;
  if (!message) return;

  const text = message.text || '';

  if (text.startsWith('/start')) {
    await handleStart(token, org, message);
    return;
  }

  // Default: qayta /start yuboradi
  const { sendMessage } = require('./utils/telegram');
  await sendMessage(token, message.chat.id,
    "Do'konni ochish uchun /start buyrug'ini yuboring 👇"
  );
};
