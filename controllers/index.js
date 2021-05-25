const { catchAsync } = require('../lib/utils');
const Annonce = require('../models/annonce')
const { DateTime } = require("luxon");
const Notification = require('../models/notifications');



const loadIndex = catchAsync(async (req, res, next) => {


  const params = req.query.page
  let annonce = ""

  if (params) {
    annonce = await Annonce.findOne({_id: params})
    console.log(annonce)
      annonce.visited += 1
      annonce.save();
    Notification.createVisitNotif(annonce);
  }

  res.render('index', { annonce: annonce });








});

const loadIndex2 = catchAsync( async(req, res, next) => {

  res.render('newindex')

})

const sendPdf = catchAsync( async (req, res, next) => {
  console.log(req.params)
  const file = './public/fichier.pdf'
  res.download(file)
})


module.exports = { loadIndex, sendPdf, loadIndex2 }
