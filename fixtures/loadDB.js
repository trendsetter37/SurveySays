
var sequelizeFixtures = require('sequelize-fixtures');
var models = {
  User: require('../models/user'),
  Answer: require('../models/answer'),
  Question: require('../models/question')
}

console.log(models);
sequelizeFixtures.loadFile('fixtures/*.json', models)
  .then(function () {
    console.log('Test database loaded.');
  });
