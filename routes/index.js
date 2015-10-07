var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('play', { title: 'Play' });
});

router.get('/admin', function(req, res, next) {
    res.render('admin', { title: 'Admin' });
});

module.exports = router;
