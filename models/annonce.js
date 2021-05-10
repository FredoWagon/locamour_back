const mongoose = require('mongoose');

const annonceSchema = mongoose.Schema({
  city: { type: String, required: true },
  adress: { type: String, required: true },
  imageUrl: { type: String, required: true },
  annonceUrl: { type: String, required: true },
  rentPrice: { type: String, required: true },
  chargePrice: {type: String},
  ownerName: {type: String},
  contactEmail: {type: String},
  contactPhone: {type: String},
  codeUrl: {type: String}


});

module.exports = mongoose.model('Annonce', annonceSchema);
