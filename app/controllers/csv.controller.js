const stream = require('stream');
const awai = require('await')
const fs = require('fs');
const path = require('path');

const db = require('../config/db.config.js');
const Donation = db.Donation;

const csv = require('fast-csv');
const Json2csvParser = require('json2csv').Parser;

/**
 * Upload Single CSV file/ and Import data to MySQL/PostgreSQL database
 * @param {*} req 
 * @param {*} res 
 */
exports.uploadFile = (req, res) => {
    try{
        let donations = [];
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
                console.log("ENDS!!!!")
                Donation.bulkCreate(donations).then(() => {
                    const result = {
                        status: "ok",
                        filename: req.file.originalname,
                        message: "Upload Successfully!",
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

/** 
 * Upload multiple Excel Files
 *  
 * @param {*} req 
 * @param {*} res 
 */
exports.uploadMultipleFiles = async (req, res) => {
    const messages = [];
    
	for (const file of req.files) {
        try{
            // Parsing CSV Files to data array objects
            const csvParserStream = fs.createReadStream(__basedir + "/uploads/" + file.filename)
                        .pipe(csv.parse({ headers: true }));

            var end = new Promise(function(resolve, reject) {
                let donations = [];

                csvParserStream.on('data', object => {
                    donations.push(object);
                    console.log(object);
                });
                csvParserStream.on('end', () => {
                    resolve(donations);
                });
                csvParserStream.on('error', error => {
                    console.error(error);
                    reject
                }); // or something like that. might need to close `hash`
            });
            
            await (async function() {
                let donations = await end;

                // save donations to MySQL/PostgreSQL database
                await Donation.bulkCreate(donations).then(() => {
                    const result = {
                        status: "ok",
                        filename: file.originalname,
                        message: "Upload Successfully!",
                    }
    
                    messages.push(result);
                }); 
            }());
        }catch(error){
            console.log(error);

            const result = {
                status: "fail",
                filename: file.originalname,				
                message: "Error -> " + error.message
            }
            messages.push(result);
        }
	}

	return res.json(messages);
}


exports.downloadFile = (req, res) => {
    Donation.findAll({attributes: ['donor_id', 'donor_name', 'donor_email', 'donor_gender', 'donor_address', 'donation_amount']}).then(objects => {
        const jsonDonations = JSON.parse(JSON.stringify(objects));
        const csvFields = ['donor_id', 'donor_name', 'donor_email', 'donor_gender', 'donor_address', 'donation_amount'];
        const json2csvParser = new Json2csvParser({ csvFields });
        const csvData = json2csvParser.parse(jsonDonations);

        res.setHeader('Content-disposition', 'attachment; filename=donations.csv');
        res.set('Content-Type', 'text/csv');
        res.status(200).end(csvData);
    });
}
