const mongoose = require('mongoose');

// Read-only view of the customers collection — the bot only needs the language
// the customer picked in the storefront. strict:false so this partial schema
// never drops fields written by the backend.
const customerSchema = new mongoose.Schema({
  organization: mongoose.Schema.Types.ObjectId,
  telegramId:   { type: Number, default: null },
  language:     { type: String, default: null },
}, { strict: false });

module.exports = mongoose.models.Customer || mongoose.model('Customer', customerSchema);
