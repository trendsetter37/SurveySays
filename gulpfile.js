var gulp = require('gulp');
var exec = require('child_process').exec;
var Promise = require('bluebird');
var path = require('path');
var fs = require('fs');
var env = process.env.NODE_ENV || 'test'

gulp.task('generate-data', function (callback) {
  if (fs.statSync(path.resolve('fixtures/', 'answers.json')).isFile()) {
    console.log('datas exists already');
    callback();
  } else {
    exec('node fixtures/generate-data-json.js', function (err) {
      if (err) return callback(err);
      callback(); // task is finished
    });
  }

});

gulp.task('init-db', ['generate-data'], function (callback) {
  exec(`sequelize db:migrate --env ${env}`, function (err) {
    if (err) return callback(err);
    callback(); // task is finished
  });
});

gulp.task('seed-test-db', ['generate-data', 'init-db'], function (callback) {
  exec(`sequelize db:seed:all --env ${env}`, function (err) {
    if (err) return callback(err);
    callback(); // task is finished
  });
});

gulp.task('default', ['seed-test-db'], function () {
  /* Default gulp task here */
  exec('npm start');
});
