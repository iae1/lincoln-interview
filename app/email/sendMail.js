const nodemailer = require('nodemailer')
const { ModuleFilenameHelpers } = require('webpack')
require('dotenv').config()

const sendMail = (req, res, next) => {
  // Initialize email body
  try {
    const emailBody = {
      newUploads: req.donorData.length,
    }
  
    // Total Value of New Uploads/Count Anon Donations
    let donationsAmounts = []
    let numAnonDonations = 0
    req.donorData.forEach(({dataValues}) => {
      donationsAmounts.push(parseFloat(dataValues.donation_amount))
      if (!dataValues.donor_name.length) {numAnonDonations++}
    })
    emailBody.totalValOfNewUploads = donationsAmounts.reduce((acc, cv) => acc+cv).toFixed(2)
  
    // percentAnon
    emailBody.percentAnon = parseInt((numAnonDonations/req.donorData.length)*100,10)
  
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL, 
            pass: process.env.PASSWORD
        }
    });
  
    let mailOptions = {
        from: 'isaeaston@gmail.com', // TODO: email sender
        to: 'isaaceastonwebdev@gmail.com', // TODO: email receiver
        subject: 'New Donations Upload',
        text: `- ${emailBody.newUploads} new donation records were added\n- We have received $${emailBody.totalValOfNewUploads}\n- ${emailBody.percentAnon} percent of the donations were made anonymously`
    };
  
    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            return console.log('Error occurs');
        }
        return console.log('Email sent!!!');
    });

    res.json(req.result)
  } catch (error) {
    console.log(error)
  }
}

module.exports = {sendMail}