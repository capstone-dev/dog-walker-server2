var express = require('express');
var router = express.Router();
var path=require('path');

//LOGGER SETTING
const logger=require('../configurations/logConfiguration');

router.get('/',function(req, res, next) {
    res.sendFile(path.join(path.resolve('.'),'/dog-walker-server2/views/main.html'))
});

module.exports = router;
