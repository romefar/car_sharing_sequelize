const base = require('./src/models')
base.sequelize.sync({ force: true }).then(() => console.log('OK')).catch(err => console.log(err))
