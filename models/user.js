/*jslint node: true*/
"use strict";

module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        ident: {
          type: DataTypes.STRING, // Hash from fingerprint2js
          allowNull: false
        }
    }, {
        classMethods: {
            associate: function (models) {
                User.belongsToMany(models.Question, {
                  foreignKey: 'ident',
                  through: 'UserQuestion'
                });
            }
        }
    });
    return User;
};
