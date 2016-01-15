'use strict';

var models = require('../models');
console.log(models);
module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable(models.Question.tableName, models.Question.attributes)
      .then(function () {
        return queryInterface.createTable(models.Answer.tableName, models.Answer.attributes);
      })
      .then(function () {
        return queryInterface.createTable(models.User.tableName, models.User.attributes);
      });
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.query('SET FOREIGN_KEY_CHECKS = 0', {raw: true})
      .then(function () {
        return queryInterface.dropAllTables();
      });
  }
};
