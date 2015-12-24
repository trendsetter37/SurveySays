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
            type: DataTypes.STRING,  // Hash from fingerprint2
            allowNull: false
        }
    }, {
        classMethods: {
            associate: function (models) {
                User.hasMany(models.Question);
            }
        }
    });
    return User;
};
