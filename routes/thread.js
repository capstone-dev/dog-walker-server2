var express = require('express')
var router = express.Router()

// DATABASE SETTING
var connection = require('../configurations/dbConnection');

//LOGGER SETTING
const logger = require('../configurations/logConfiguration');


router.get('/', function (req, res, next) {
    logger.info("/thread GET");
    var sql = "";
    if (Object.keys(req.query).length == 0) {
        sql = 'select * from thread';
    } else {
        logger.info("/thread GET queryString: " + JSON.stringify(req.query));
        var fieldName = Object.keys(req.query)[0];
        var fieldValue = req.query[fieldName];
        sql = 'select * from thread WHERE ' + fieldName + '="' + fieldValue + '"';
    }
    var query = connection.query(sql,
        function (err, rows) {
            if (err) {
                res.send('err : ' + err);
            }
            if (rows[0]) {
                res.send(rows)
            } else {
                res.send('no rows in db');
            }
        })

})

router.post('/', function (req, res) {
    logger.info("/thread POST : " + JSON.stringify(req.body));
    var body = req.body;
    var userThread = {
        'threadTitle': req.body.threadTitle,
        'userLocation': req.body.userLocation,
        'threadNumber': req.body.threadNumber,
        'threadContent': req.body.threadContent,
        'chatroomUserName': req.body.chatroomUserName,
        'threadWalkDate': req.body.threadWalkDate,
        'user_UserID': req.body.user_UserID
    };
    //execute sql
    connection.query("INSERT INTO thread set ?", userThread,
        function (error, result, fields) {

            var resultMsg = {};

            if (error) {
                //에러 발생시
                resultMsg["result"] = 0;
                resultMsg["error"] = error;
                // res.json(resultMsg);
                res.send('err : ' + error)
            } else {
                //execution success
                resultMsg["result"] = 1;
                resultMsg["id"] = result.insertId;
                // res.json(resultMsg);
                res.send('success create userThread');
                logger.info(JSON.stringify(userThread) + " insertion success");
            }
        })
})


module.exports = router;