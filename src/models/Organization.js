const mongoose = require('mongoose');

const orgSchema = new mongoose.Schema({
  name:    String,
  slug:    String,
  telegramBot: {
    token:       { type: String, default: null },
    isActive:    { type: Boolean, default: false },
    webhookUrl:  { type: String, default: null },
    storefrontUrl: { type: String, default: null },
    botUsername: { type: String, default: null },
    welcomeText: { type: String, default: null },
    menuButtonText: { type: String, default: 'Menu' },
    openButtonText: { type: String, default: "🛍 Do'konni ochish" },
  },
}, { strict: false });

module.exports = mongoose.models.Organization || mongoose.model('Organization', orgSchema);
