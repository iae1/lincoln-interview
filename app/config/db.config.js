// const env = require('./env')
const Sequelize = require('sequelize');
// const sequelize = new Sequelize(env.database, env.username, env.password, {
//   host: env.host,
//   dialect: env.dialect,
//   operatorsAliases: false,
 
//   pool: {
//     max: env.max,
//     min: env.pool.min,
//     acquire: env.pool.acquire,
//     idle: env.pool.idle
//   }
// });

const pkg = require('../../package.json')

const databaseName = pkg.name + (process.env.NODE_ENV === 'test' ? '-test' : '')

let config

if (process.env.DATABASE_URL) {
  config = {
    logging: false,
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
} else {
  config = {
    logging: false,
  }
}

const sequelize = new Sequelize(
  process.env.DATABASE_URL || `postgres://localhost:5432/${databaseName}`,
  config
)
 
const db = {};
 
db.Sequelize = Sequelize;
db.sequelize = sequelize;
 
db.Donation = require('../models/donation.model.js')(sequelize, Sequelize);
 
module.exports = db;

// const env = require('./env.js');
 
// const Sequelize = require('sequelize');
// const sequelize = new Sequelize(env.database, env.username, env.password, {
//   host: env.host,
//   dialect: env.dialect,
//   operatorsAliases: false,
 
//   pool: {
//     max: env.max,
//     min: env.pool.min,
//     acquire: env.pool.acquire,
//     idle: env.pool.idle
//   }
// });
 
// const db = {};
 
// db.Sequelize = Sequelize;
// db.sequelize = sequelize;
 
// db.Donation = require('../models/donation.model.js')(sequelize, Sequelize);
 
// module.exports = db;