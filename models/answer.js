var Answer = sequelize.define('answer', {
  choice: {
    type: Sequelize.STRING,
    allowNull: false
  },
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  }
}, {
  classMethods: {
    associate: function(models) {
      Answer.belongsTo(models.Question);
    }
  }
});
