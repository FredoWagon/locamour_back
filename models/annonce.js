const mongoose = require('mongoose');
const { DateTime } = require("luxon");


const annonceSchema = mongoose.Schema({
  city: { type: String, required: true },
  adress: { type: String, required: true },
  imageUrl: { type: String },
  annonceUrl: { type: String, required: true},
  rentPrice: { type: String, required: true, default: "0" },
  chargePrice: {type: String},
  ownerName: {type: String},
  contactEmail: {type: String},
  contactPhone: {type: String},
  codeUrl: {type: String},
  visited: {type: Number, default: 0},
  downloaded: {type: Number, default: 0},
  houseSurface: {type: String, default: "inconnu"},
  gardenSurface: {type: String, default: "inconnu"},
  cloudinary_url: {type: String},
  date: { type: String, default: DateTime.now().setLocale('fr').toLocaleString(DateTime.DATE_FULL)},
  archived: {type: Boolean, default: false},
  autorized: {type: Boolean, default: false},
  autorizedEmailSent: {type: Boolean, default: false},
  note: {type: String},
  siteName: {type: String},
  chatMessage: {type: Boolean}
},{ timestamps: true });




annonceSchema.statics.availables = function () {
  return this.find({ archived: false }).sort({ createdAt: -1 });
};

annonceSchema.statics.archived = function () {
  return this.find({ archived: true }).sort({ createdAt: -1 });
};


annonceSchema.statics.visited = function () {
  return this.find({ visited: { $gt: 0 } }).sort({ createdAt: -1 });
};

annonceSchema.statics.complete = function () {
  return this.find({ downloaded: { $gt: 0 } }).sort({ createdAt: -1 });
};

annonceSchema.statics.uncomplete = function () {
  return this.find({ archived: false, downloaded: 0 }).sort({ createdAt: -1 });
};





module.exports = mongoose.model('Annonce', annonceSchema);
