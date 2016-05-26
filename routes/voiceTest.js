var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('voiceTest', { title: 'MCR Sound Server | Voice Test' });
});

module.exports = router;
