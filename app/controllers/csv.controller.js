const stream = require('stream');
const await = require('await')
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer')
require('dotenv').config()

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

                    let transporter = nodemailer.createTransport({
                        service: 'gmail',
                        host: 'smtp.gmail.com',
                        port: 465,
                        secure: true,
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

