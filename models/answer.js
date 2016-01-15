'use strict';

module.exports = function(sequelize, DataTypes) {
  var Answer = sequelize.define('answer', {
    choice: DataTypes.STRING,
    picked: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        Answer.belongsToMany(models.User, {through: 'UserAnswer'});
        Answer.belongsTo(models.Question);

      }
    }
  });
  return Answer;
};
