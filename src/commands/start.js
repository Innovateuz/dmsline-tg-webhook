const { sendMessage, setChatMenuButton } = require('../utils/telegram');
const { translate } = require('../lib/i18n');

module.exports = async function handleStart(token, org, message, locale) {
  const userName = message.from?.first_name || translate(locale, 'guest');

  // The merchant's own welcome text wins when they set one — it is their
  // wording in their chosen language, so we never translate over it.
  const text = org.telegramBot?.welcomeText
    || translate(locale, 'welcome', { name: userName, org: org.name });

  const storefrontUrl = org.telegramBot?.storefrontUrl;

  await setChatMenuButton(token, message.chat.id, storefrontUrl, org.telegramBot?.menuButtonText || 'Menu').catch(() => {});

  await sendMessage(token, message.chat.id, text, {
    reply_markup: {
      inline_keyboard: [[
        {
          text: org.telegramBot?.openButtonText || translate(locale, 'openStore'),
          web_app: { url: storefrontUrl },
        },
      ]],
    },
  });
};
