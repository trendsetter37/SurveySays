/*jslint node: true*/
"use strict";

module.exports = function (sequelize, DataTypes) {
    var Question = sequelize.define('question', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        question: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        classMethods: {
            associate: function (models) {
                Question.hasMany(models.Answer);
            }
        }
    });
    return Question;
};
