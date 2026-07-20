// Bot messages in uz / ru / en. Mirrors the dictionary shape used by
// dmsline-frontend and dmsline-e-commerce so all three stay easy to compare.
//
// Only the bot's own fallback texts live here. Anything the merchant types in
// the admin panel (welcomeText, menu/open button labels) is used verbatim —
// it is their wording, not ours, so it is never overridden by a translation.

const LOCALES = ['uz', 'ru', 'en'];
const DEFAULT_LOCALE = 'uz';

const dict = {
  'guest':        { uz: 'Mehmon',            ru: 'Гость',              en: 'Guest' },
  'welcome':      {
    uz: "👋 Salom, <b>{name}</b>!\n\n<b>{org}</b> ga xush kelibsiz!\n\nQuyidagi tugmani bosib do'konimizga kiring 👇",
    ru: '👋 Здравствуйте, <b>{name}</b>!\n\nДобро пожаловать в <b>{org}</b>!\n\nНажмите кнопку ниже, чтобы открыть магазин 👇',
    en: '👋 Hello, <b>{name}</b>!\n\nWelcome to <b>{org}</b>!\n\nTap the button below to open our store 👇',
  },
  'openStore':    { uz: "🛍 Do'konni ochish", ru: '🛍 Открыть магазин', en: '🛍 Open the store' },
  'sendStart':    {
    uz: "Do'konni ochish uchun /start buyrug'ini yuboring 👇",
    ru: 'Отправьте команду /start, чтобы открыть магазин 👇',
    en: 'Send /start to open the store 👇',
  },
};

function translate(locale, key, vars) {
  const entry = dict[key];
  let str = entry?.[locale] ?? entry?.[DEFAULT_LOCALE] ?? key;
  if (vars) for (const [k, v] of Object.entries(vars)) str = str.replaceAll(`{${k}}`, v);
  return str;
}

// Telegram sends language_code like "ru", "ru-RU" or "en-GB" — keep the base tag
// and only accept the three we support.
function fromTelegramCode(code) {
  if (!code) return null;
  const base = String(code).toLowerCase().split('-')[0];
  return LOCALES.includes(base) ? base : null;
}

module.exports = { LOCALES, DEFAULT_LOCALE, dict, translate, fromTelegramCode };
