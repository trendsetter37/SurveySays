/*jslint node: true*/
"use strict";

module.exports = function (sequelize, DataTypes) {
    var Question = sequelize.define('question', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        query: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        classMethods: {
            associate: function (models) {
                Question.hasMany(models.Answer);
                Question.belongsToMany(models.User, {
                  through: 'UserQuestion'
                });
            }
        }
    });
    return Question;
};
