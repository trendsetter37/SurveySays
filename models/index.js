/*jslint node: true*/
/*jslint nomen: true*/
"use strict";

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'test';
var config    = require(__dirname + '/../config/config.json')[env];
var db        = {};
var sequelize = new Sequelize('mysql://test_user:testypass@104.131.203.140:3306/surveysays_test');

// only three models
db.Question = sequelize.import(path.join(__dirname + "/question.js"));
db.Answer = sequelize.import(path.join(__dirname + "/answer.js"));
db.User = sequelize.import(path.join(__dirname + "/user.js"));

db.Question.associate(db);
db.Answer.associate(db);
db.User.associate(db);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
