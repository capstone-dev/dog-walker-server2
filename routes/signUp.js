var express = require('express')
var router = express.Router()

// DATABASE SETTING
var connection = require('../configurations/dbConnection');

//LOGGER SETTING
const logger = require('../configurations/logConfiguration');
//dbResultHandling SETTING
const dbResultHandle = require('../configurations/dbResultHandling');

router.get('/', function (req, res, next) {
    logger.info("/singUP GET");
    var query = connection.query('select * from user',
        function (err, rows) {
            dbResultHandle.getResultHandling(req,res,rows,err,"array")
        })
})

router.post('/', function (req, res) {
    logger.info("/singUp POST : " + JSON.stringify(req.body));
    var body = req.body;
    //execute sql
    connection.query("INSERT INTO user set ?", body,
        function (error, result, fields) {
            dbResultHandle.postResultHandling(req, res, error, result, "insert","string");
        })
})

router.put('/', function (req, res) {
    logger.info("/singUp PUT : " + JSON.stringify(req.body));
    var body = req.body;
    //execute sql
    connection.query("UPDATE user SET ? WHERE UserID='" + body.UserID + "'", body,
        function (error, result, fields) {
            dbResultHandle.postResultHandling(req, res, error, result, "update","string");
        })
})


module.exports = router;