var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ASCENT' });
});
router.get('/privacypolicy', function(req, res, next){
  res.render('privacypolicy')
})
module.exports = router;
