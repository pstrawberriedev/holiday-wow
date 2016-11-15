var express = require('express');
var router = express.Router();


// Set up global object
var global = {
  
  title:"ponie.club",
  desc: "a place for the modern peoples"
  
};

/* GET wow (home page) */
router.get('/', function(req, res) {
	
  res.render('content/wow', { 
    page: 'WoW character lookup',
    global: global
  });
  
});

module.exports = router;