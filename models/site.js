const mongoose = require('mongoose');
const { DateTime } = require("luxon");


const siteSchema = mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true }
});



siteSchema.statics.availables = function () {
  return this.find({ archived: false }).sort({ createdAt: -1 });
};




module.exports = mongoose.model('Site', siteSchema);
