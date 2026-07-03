const { sendMessage } = require('../utils/telegram');

module.exports = async function handleStart(token, org, message) {
  const userName = message.from?.first_name || 'Mehmon';
  const text = org.telegramBot?.welcomeText
    || `👋 Salom, <b>${userName}</b>!\n\n<b>${org.name}</b> ga xush kelibsiz!\n\nQuyidagi tugmani bosib do'konimizga kiring 👇`;

  const storefrontUrl = org.telegramBot?.storefrontUrl;

  await sendMessage(token, message.chat.id, text, {
    reply_markup: {
      inline_keyboard: [[
        {
          text: "🛍 Do'konni ochish",
          web_app: { url: storefrontUrl },
        },
      ]],
    },
  });
};
