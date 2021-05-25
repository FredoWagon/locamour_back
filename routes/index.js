var express = require('express');
var router = express.Router();
const indexCtrl = require('../controllers/index')

/* GET home page. */
router.get('/', indexCtrl.loadIndex);
router.get('/index2', indexCtrl.loadIndex2)

router.get('/pdf', indexCtrl.sendPdf)

module.exports = router;
