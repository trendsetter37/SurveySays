var gulp = require('gulp');
var exec = require('child_process').exec;
var Promise = require('bluebird');
var path = require('path');
var fs = require('fs');

gulp.task('generate-data', function (callback) {
  exec('node fixtures/generate-data-json.js', function (err) {
    if (err) return callback(err);
    callback(); // task is finished
  });
});

gulp.task('init-db', ['generate-data'], function (callback) {
  exec('sequelize db:migrate --env test', function (err) {
    if (err) return callback(err);
    callback(); // task is finished
  });
});

gulp.task('seed-test-db', ['generate-data', 'init-db'], function (callback) {
  exec('sequelize db:seed:all --env test', function (err) {
    if (err) return callback(err);
    callback(); // task is finished
  });
});

gulp.task('default', ['seed-test-db'], function () {
  /* Default gulp task here */
  console.log('This the last task');
});
