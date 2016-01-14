'use strict';
var fs = require('fs');
var answers = require('../fixtures/answers.json');
var questions = require('../fixtures/questions.json');
var users = require('../fixtures/users.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

    return queryInterface.bulkInsert('Question', questions)
      .then(function () {
        return queryInterface.bulkInsert('Answer', answers);
      })
      .then(function () {
        return queryInterface.bulkInsert('User', users);
      });
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
