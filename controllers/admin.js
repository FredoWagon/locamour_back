const { catchAsync } = require('../lib/utils')
const Annonce = require('../models/annonce')
const { mail } = require('../lib/nodemailer');
const cloudinary = require('../config/cloudinaryConfig');
const Notification = require("../models/notifications");
const { DateTime } = require("luxon");
const Site = require('../models/site');




const dashboard = catchAsync(async (req, res, next) => {

  console.log(req.query)


  const allAnnonces = await Annonce.find({}).sort({ createdAt: -1 });



  //const visitedAnnonces = await Annonce.visited();
  const completeAnnonces = await Annonce.complete();
  const availablesAnnonces = await Annonce.availables();
  const archivedAnnoces = await Annonce.archived();
  const allNotifications = await Notification.find({}).sort({ createdAt: -1 });
  const unvalidated = await Annonce.uncomplete();
  const newNotif = await Notification.newNotif();
  const ratio = Math.round(await visitedRatio())

  const lesVisites = await Notification.averageVisit();
  const sites = await Site.find({});
  console.log("all sites");
  console.log(sites)



  //Date du jour
  const timeNow = DateTime.now().setLocale('fr').toLocaleString(DateTime.DATE_FULL)



  res.render('bureau', {
    availablesAnnonces: availablesAnnonces,
    allNotif: allNotifications,
    newNotif: newNotif,
    completeAnnoncesLength: completeAnnonces.length,
    archivedAnnoncesLength: archivedAnnoces.length,
    unvalidatedLength: unvalidated.length,
    allAnnonces: allAnnonces,
    time: timeNow,
    ratio: ratio,
    visitNumber: lesVisites,
    sites: sites


  })


});

const newAnnonce = catchAsync(async (req, res, next) => {
  console.log("LE BODY")
  console.log(req.body)
  console.log(req.body.texte)
  const emailText = req.body.texte
  const emailObject = req.body.mailObject
  const input = req.body
  const newSiteAnnonceUrl = req.body.site
  const newSiteName = req.body.site.split('.')[1];
  console.log("new site name")
  console.log(newSiteName)
  let newSite

  if (newSiteName != undefined) {
     newSite = new Site({
      name: newSiteName,
      url: newSiteAnnonceUrl
    })
    newSite.save();
    console.log("nouveau site")
    console.log(newSite)
  }






  if (req.file) {
    // Upload image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);
    input.cloudinary_url = process.env.CLOUDINARY_IMG_URL + result.public_id
  }

  const NouvelleAnnonce = new Annonce(input)
  await NouvelleAnnonce.save();

  console.log("Nouvelle annonce créé !")
  console.log(NouvelleAnnonce);
  console.log(input)

  const data = {
    annonce: NouvelleAnnonce,
    emailText: emailText,
    mailObject: emailObject

  }
  console.log(data)


  await mail(res, { data });

  res.status(200).json({ message: "Annonce rajouté avec succès!", data: NouvelleAnnonce, newSite: newSite })



})


const getTest = catchAsync(async (req, res, next) => {




  res.send('hello im the get test')

})

const updateNotif = catchAsync(async (req, res, next) => {

  const notifId = req.body.data;
  const notif = await Notification.findOne({ _id: notifId });
  notif.archived = true;
  notif.save();
  console.log("Notification archivé");

  res.json({ message: "Notif archivé", data: notif })
})


const updateAnnonce = catchAsync(async (req, res, next) => {
  console.log(req.body)
  const annonce = await Annonce.findOne({ _id: req.body.data });
  annonce.archived = true;
  annonce.save();

  res.json({ message: "Annonce archivé !", data: annonce })

})

const updatedAnnonce = catchAsync( async (req, res, next) => {

  console.log(req.body)
  const annonceId = req.body.annonceId
  const input = req.body


  if (req.file) {
    // Upload image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);
    input.cloudinary_url = process.env.CLOUDINARY_IMG_URL + result.public_id
  }

  await Annonce.findOneAndUpdate({ _id: annonceId }, input)


  const updatedAnnoce = await Annonce.findOne({_id: annonceId})
  console.log("L'annonce a été mise à jour !")
  console.log(updatedAnnoce)

  res.json({ updatedAnnonce: updatedAnnoce})



})


const giveAnnonceInfo = catchAsync( async (req, res, next) => {

  const annonceId = req.body.annonceId
  const annonce = await Annonce.findOne({_id: annonceId })

  res.json({annonce: annonce})

})


//tools

const visitedRatio = async () => {

  const allNotifLength = await Notification.annonceLength();
  console.log(allNotifLength);
  const allAnnonceLength = await Annonce.find({});
  console.log(allAnnonceLength.length)
  const ratio = allNotifLength / allAnnonceLength.length * 100;
  console.log(ratio)
  return ratio

}



module.exports = { dashboard, newAnnonce, getTest, updateNotif, updateAnnonce, giveAnnonceInfo, updatedAnnonce  }
