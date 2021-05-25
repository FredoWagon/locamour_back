var express = require('express');
var router = express.Router();
const adminCtrl = require('../controllers/admin')
const upload = require('../middleware/multer');


/* GET home page. */
router.get('/', adminCtrl.dashboard);

router.post('/new', upload.single("image"), adminCtrl.newAnnonce)
router.post('/update', adminCtrl.updateNotif )
router.post('/archive', adminCtrl.updateAnnonce)
router.post('/getAnnonce', adminCtrl.giveAnnonceInfo)
router.post('/updateAnnonce', upload.single("image"), adminCtrl.updatedAnnonce)


// TEST

router.get('/gettest', adminCtrl.getTest)


module.exports = router;
