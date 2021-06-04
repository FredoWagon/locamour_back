const mongoose = require('mongoose');
const { DateTime } = require("luxon");


const notificationSchema = mongoose.Schema({
  annonceCity: { type: String, required: true },
  annonceAdress: { type: String, required: true },
  message: { type: String },
  annonceId: {type: String},
  date: { type: String, default: DateTime.now().setLocale('fr').toLocaleString(DateTime.DATE_FULL) },
  archived: { type: Boolean, default: false },
  annonceImgUrl: {type: String},
  notifNature: {type: String}
}, { timestamps: true });

notificationSchema.statics.createVisitNotif = async function (annonce) {
    const newNotification = new this({
      annonceCity: annonce.city,
      annonceAdress: annonce.adress,
      annonceId: annonce._id,
      data: DateTime.now().setLocale('fr').toFormat('d', 'MMMM'),
      message: `Cette annonce a été visité ${annonce.visited} fois !`,
      annonceImgUrl: annonce.cloudinary_url,
      notifNature: 'visit'
    })
    newNotification.save();
};

notificationSchema.statics.createDownloadNotif = async function (annonce) {
  const newNotification = new this({
    annonceCity: annonce.city,
    annonceAdress: annonce.adress,
    annonceId: annonce._id,
    data: DateTime.now().setLocale('fr').toFormat('d', 'MMMM'),
    message: `Le dossier a été téléchargé ${annonce.downloaded} fois !`,
    annonceImgUrl: annonce.cloudinary_url,
    notifNature: 'download'
  })
  newNotification.save();
};

notificationSchema.statics.annonceLength = async function () {
  const allNotif = await this.find({});
  const annonceIdList = await allNotif.map(notif => notif.annonceId)
  const uniqueAnnonceIdList = [...new Set(annonceIdList)];
  return uniqueAnnonceIdList.length
};

notificationSchema.statics.averageVisit = async function () {
  const allNotif = await this.find({});
  const annonceIdList = await allNotif.map(notif => notif.annonceId)

  const uniqueAnnonceIdList = [...new Set(annonceIdList)];

  const visitPerAnnonceList = uniqueAnnonceIdList.map( annonce => {
    return annonceIdList.filter(x => x == annonce).length
  })

  const averageVisit = (visitPerAnnonceList.reduce( (x,y) => x + y)) / uniqueAnnonceIdList.length;

  return Math.round(averageVisit * 100 ) / 100

};

notificationSchema.statics.newNotif = function () {
  return this.find({ archived: false }).sort({ createdAt: -1 });
};


module.exports = mongoose.model('Notification', notificationSchema);
