const { catchAsync } = require('../lib/utils');
const Annonce = require('../models/annonce')
const { DateTime } = require("luxon");
const Notification = require('../models/notifications');
const cookieParser = require('cookie-parser');



const loadIndex = catchAsync(async (req, res, next) => {


  const params = req.query.page
  let annonce = ""

  if (params && params.match(/^[0-9a-fA-F]{24}$/)) {
    annonce = await Annonce.findOne({_id: params})
    console.log(annonce)
      annonce.visited += 1
      annonce.save();
    Notification.createVisitNotif(annonce);
    res.render('index', { annonce: annonce });
  } else {
    if (params) {
      if (params == "bonjour") {
        res.render('testindex')
      }
      res.render('newindex', { errormessage: "Votre code d'accès n'est pas valide." })

    } else {
      res.render('newindex')

    }

  }
});

const checkAnnonce = catchAsync( async (req, res, next) => {
  const data = req.body.annonceId
  console.log(data)
  if (data === "frebite1234") {
    res.status(200).json({ message: "go admin" })
  } else {

    const annonce = await Annonce.findOne({ _id: data })

    res.status(200).json({ message: "c'est bon" })
  }


})

const loadIndex2 = catchAsync( async(req, res, next) => {

  res.render('newindex')

})

const sendPdf = catchAsync( async (req, res, next) => {
  const annonceId = req.query.annonce
  const annonce = await Annonce.findOne({_id: annonceId})
  const file = './public/fichier.pdf'
  if (annonce.downloaded >= 2) {
    annonce.downloaded += 1
    annonce.autorized = false
    annonce.save();
    Notification.createDownloadNotif(annonce);
    res.json({ message: "Limite de téléchargement atteinte." })
  } else {
    annonce.downloaded += 1
    annonce.save();
    Notification.createDownloadNotif(annonce);
    res.download(file)
  }
})


module.exports = { loadIndex, sendPdf, loadIndex2, checkAnnonce }
