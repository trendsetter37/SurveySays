'use strict';

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('user', {
    ident: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        User.belongsToMany(models.Question, {
          foreignKey: 'ident',
          through: 'UserQuestion'
        });
        User.belongsToMany(models.Answer, {through: 'UserAnswer'});
      }
    }
  });

  return User;
};
