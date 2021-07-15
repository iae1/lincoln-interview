const stream = require('stream');
const await = require('await')
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
require('dotenv').config()
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey('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')
const db = require('../config/db.config.js');
const Donation = db.Donation;

const csv = require('fast-csv');


/**
 * Upload Single CSV file/ and Import data to MySQL/PostgreSQL database
 * @param {*} req 
 * @param {*} res 
 */
exports.uploadFile = (req, res) => {
    try{
        let donations = [];
        console.log('HITT')
        fs.createReadStream(__basedir + "/uploads/" + req.file.filename)
            .pipe(csv.parse({ headers: true }))
            .on('error', error => {
                console.error(error);
                throw error.message;
            })
            .on('data', row => {
                donations.push(row);
                console.log(row);
            })
            .on('end', () => {
                // Save donations to MySQL/PostgreSQL database
                console.log('end!!!')
                Donation.bulkCreate(donations).then((data) => {

                    // Initialize email body
                    const emailBody = {
                      newUploads: data.length,
                    }

                    // Total Value of New Uploads/Count Anon Donations
                    let donationsAmounts = []
                    let numAnonDonations = 0
                    data.forEach(({dataValues}) => {
                      donationsAmounts.push(parseFloat(dataValues.donation_amount))
                      if (!dataValues.donor_name.length) {numAnonDonations++}
                    })
                    emailBody.totalValOfNewUploads = donationsAmounts.reduce((acc, cv) => acc+cv).toFixed(2)

                    // percentAnon
                    emailBody.percentAnon = parseInt((numAnonDonations/data.length)*100,10)

                    const msg = {
                      to: 'isaaceastonwebdev@gmail.com', // Change to your recipient
                      from: 'isaeaston@gmail.com', // Change to your verified sender
                      subject: 'New Donations Uploaded',
                      text: 'and easy to do anywhere, even with Node.js',
                      html: `<h4>- ${emailBody.newUploads} new donation records were added</h4><h4>- We have received $${emailBody.totalValOfNewUploads}</h4><h4>- ${emailBody.percentAnon} percent of the donations were made anonymously</h4>`,
                    }
                    sgMail
                      .send(msg)
                      .then(() => {
                        console.log('Email sent')
                      })
                      .catch((error) => {
                        console.error(error)
                      })

                    const result = {
                        status: "ok",
                        filename: req.file.originalname,
                        message: "uploaded successfully!",
                    }
                    
                    res.json(result);
                });    
            });
    }catch(error){
        const result = {
            status: "fail",
            filename: req.file.originalname,
            message: "Upload Error! message = " + error.message
        }
        res.json(result);
    }
}

