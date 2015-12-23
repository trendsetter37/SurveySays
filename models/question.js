var Question = sequalize.define('question', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  question: {
    type: Sequelize.TEXT,
    allowNull: false
  }
}, {
  classMethods: {
    associate: function(models) {
      Question.hasMany(models.Answer);
    }
  }
});
