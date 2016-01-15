'use strict';

module.exports = function(sequelize, DataTypes) {
  var Question = sequelize.define('question', {
    query: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Question.hasMany(models.Answer)
        Question.belongsToMany(models.User, {
              through: 'UserQuestion'
        });
      }
    }
  });

  return Question;
};
