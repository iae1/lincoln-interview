let express = require('express');
const { Donation } = require('../config/db.config.js');
let router = express.Router();
let upload = require('../config/multer.config.js');
const { Op } = require("sequelize")
 
const csvWorker = require('../controllers/csv.controller.js');

let path = __basedir + '/public/';

router.get('/', (req,res) => {
    console.log("__basedir" + __basedir);
    res.sendFile(path + "index.html");
});

// POST api/donations (post a new CSV of donations)
router.post('/api/donations', upload.single("file"), csvWorker.uploadFile);

// GET api/donations get all donations
router.get('/api/donations', async (req, res, next)=> {
  try {
    const allDonations = await Donation.findAll()
    res.json(allDonations)
  } catch (error) {
    next(error)
  }
})

// GET api/knowndonations get all non-anonymous donations
router.get('/api/knownDonations', async (req, res, next) => {
  try {
    const knownDonations = await Donation.findAll({
      where: {
        donor_name: { [Op.not]: "" },
        donor_email: { [Op.not]: "" },
        donor_gender: { [Op.not]: "" },
        donor_address: { [Op.not]: "" },
      }
    })
    res.json(knownDonations)
  } catch (error) {
    next(error)
  }
})
module.exports = router;