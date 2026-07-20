const Customer = require('../models/Customer');
const { DEFAULT_LOCALE, fromTelegramCode } = require('./i18n');

// Which language to answer this chat in.
//
// Order matters: a customer who picked a language in the storefront has stated
// a preference, and that must win over whatever their Telegram client is set
// to. Only when we have never seen them do we fall back to Telegram's hint.
async function resolveLocale(org, message) {
  const telegramId = message.from?.id;

  if (telegramId) {
    try {
      const customer = await Customer.findOne({ organization: org._id, telegramId }).select('language');
      if (customer?.language) return customer.language;
    } catch {
      // A lookup failure must not stop the bot from replying.
    }
  }

  return fromTelegramCode(message.from?.language_code) || DEFAULT_LOCALE;
}

module.exports = { resolveLocale };
