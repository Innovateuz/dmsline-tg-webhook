const axios = require('axios');

const api = (token) => `https://api.telegram.org/bot${token}`;

const call = async (token, method, data = {}) => {
  const res = await axios.post(`${api(token)}/${method}`, data);
  return res.data;
};

exports.sendMessage = (token, chatId, text, extra = {}) =>
  call(token, 'sendMessage', { chat_id: chatId, text, parse_mode: 'HTML', ...extra });

exports.setWebhook = (token, url) =>
  call(token, 'setWebhook', { url, allowed_updates: ['message', 'callback_query'] });

exports.deleteWebhook = (token) =>
  call(token, 'deleteWebhook', {});

exports.getMe = (token) =>
  call(token, 'getMe');

exports.setChatMenuButton = (token, chatId, url, text = 'Menu') =>
  call(token, 'setChatMenuButton', {
    chat_id: chatId,
    menu_button: { type: 'web_app', text, web_app: { url } },
  });
