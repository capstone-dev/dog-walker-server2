var express = require('express')
var router = express.Router()

// DATABASE SETTING
var connection = require('../configurations/dbConnection');

//LOGGER SETTING
const logger = require('../configurations/logConfiguration');
//dbResultHandling SETTING
const dbResultHandle = require('../configurations/dbResultHandling');

router.get('/', function (req, res, next) {
    logger.info("/signUp GET");

    var query = connection.query('select * from user',
        function (err, rows) {
            dbResultHandle.getResultHandling(req,res,rows,err,"array")
        })
})

//UserID를 통해 token정보 가져옴
router.get('/token', function (req, res, next) {
    logger.info("/signUp/token GET");
    var query = connection.query('select token from user where UserID="'+req.query.UserID+'"',
        function (err, rows) {
            dbResultHandle.getResultHandling(req,res,rows,err,"Not array")
        })
})

//요청 보낼 때 필드: UserID, UserName,UserEmail, UserPhoneNumber, UserGender, UserBigcity, UserPassword, token
router.post('/', function (req, res) {
    logger.info("/signUp POST : " + JSON.stringify(req.body));
    var body = req.body;
    //execute sql
    connection.query("INSERT INTO user set ?", body,
        function (error, result, fields) {
            dbResultHandle.postResultHandling(req, res, error, result, "insert","string");
        })
})

//요청 보낼 때 필드: UserID, UserName,UserEmail, UserPhoneNumber, UserGender, UserBigcity
router.put('/', function (req, res) {
    logger.info("/signUp PUT : " + JSON.stringify(req.body));
    var body = req.body;
    //execute sql
    connection.query("UPDATE user SET ? WHERE UserID='" + body.UserID + "'", body,
        function (error, result, fields) {
            dbResultHandle.postResultHandling(req, res, error, result, "update","string");
        })
})


module.exports = router;