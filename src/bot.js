const handleStart = require('./commands/start');
const { sendMessage } = require('./utils/telegram');
const { translate } = require('./lib/i18n');
const { resolveLocale } = require('./lib/locale');

module.exports = async function handleUpdate(org, update) {
  const token = org.telegramBot?.token;
  if (!token) return;

  const message = update.message;
  if (!message) return;

  const text = message.text || '';
  const locale = await resolveLocale(org, message);

  if (text.startsWith('/start')) {
    await handleStart(token, org, message, locale);
    return;
  }

  // Default: qayta /start yuboradi
  await sendMessage(token, message.chat.id, translate(locale, 'sendStart'));
};
