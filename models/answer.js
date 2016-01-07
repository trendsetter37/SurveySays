/*jslint node: true*/
"use strict";

module.exports = function (sequelize, DataTypes) {
    var Answer = sequelize.define('answer', {
        picked: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        choice: {
            type: DataTypes.STRING,
            allowNull: false
        },
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        }
    }, {
        classMethods: {
            associate: function (models) {
                Answer.belongsTo(models.Question);
                Answer.belongsToMany(models.User, {through: 'UserAnswer'});
            }
        }
    });
    return Answer;
};
