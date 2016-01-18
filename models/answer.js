'use strict';

module.exports = function(sequelize, DataTypes) {
  var Answer = sequelize.define('answer', {
    choice: DataTypes.STRING,
    picked: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    }
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
