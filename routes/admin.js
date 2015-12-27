var express = require('express');
var router = express.Router();

/* Admin page */
router.get('/', function(req, res, next) {
    res.render('admin', {title: 'Admin page'});
});

module.exports = router;
