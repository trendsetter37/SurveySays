var User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  ident: {
    type: Sequelize.STRING // Hash representing users fingerprint
  }
}, {
  classMethods: {
    associate: function(models) {
      User.hasMany(models.Question);
    }
  }
});
