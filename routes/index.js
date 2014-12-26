var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'HexmapWonder', homeActive:'active' });
});
router.get('/wander', function(req, res) {
  res.render('wander', { title: 'HexmapWonder', wanderActive:'active' });
});
router.get('/editor', function(req, res) {
  res.render('editor', { title: 'HexmapWonder', editorActive:'active' });
});
module.exports = router;
