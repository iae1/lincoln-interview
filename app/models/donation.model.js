module.exports = (sequelize, Sequelize) => {
	const Donation = sequelize.define("donation", {
        donor_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            validate: {
                notEmpty: true,
                notNull: true
            }
        },
        donor_name: {
            type: Sequelize.STRING
        },
        donor_email: {
            type: Sequelize.STRING
        },
        donor_gender: {
            type: Sequelize.STRING,
            validate: {
                isIn: [['Male', 'Female']]
            }
        },
        donor_address: {
            type: Sequelize.TEXT
        },
        donation_amount: {
            type: Sequelize.DECIMAL, 
            allowNull: false,
            validate: {
              notEmpty: true
            }
        }
    })
	
	return Donation;
}