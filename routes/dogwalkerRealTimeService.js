var express = require('express')
var router = express.Router()

// DATABASE SETTING
var connection = require('../configurations/dbConnection');
//LOGGER SETTING
const logger = require('../configurations/logConfiguration');
//dbResultHandling SETTING
const dbResultHandle = require('../configurations/dbResultHandling');

router.get('/', function (req, res, next) {

    var sql = "";
    //쿼리스트링 존재안할 시 전체데이터 가져옴
    if (Object.keys(req.query).length == 0)
        sql = 'select * from dogwalkerRealTimeService'
    else {//threadId에 해당하는 comment 가져옴
        sql = 'select * from dogwalkerRealTimeService where DogWalkerID=' + req.query.DogwalkerID;
    }
    var query = connection.query(sql,
        function (err, rows) {
            if (err) {
                res.send('err : ' + err);
                throw err;
            }
            if (rows[0]) {
                res.send(rows)
            } else {
                res.send('no rows in db');
            }

        })


})


router.post('/', function (req, res) {
    logger.info("/dogwalkerRealTimeService post : " + JSON.stringify(req.body));
    var body = req.body;
    var dogwalkerRealTimeService = {
        'DogwalkerID': req.body.DogwalkerID,
        'DogwalkerBigcity': req.body.DogwalkerBigcity,
        'DogwalkerSmallcity': req.body.DogwalkerSmallcity,
        'DogwalkerGender': req.body.DogwalkerGender,
        'selected': req.body.selected

    };
    //execute sql
    connection.query("INSERT INTO dogwalkerRealTimeService set ?", dogwalkerRealTimeService,
        function (error, result, fields) {
            if (error) {
                //에러 발생시
                res.send('err : ' + error);
                throw err;
            } else {
                //execution success
                res.send('success create dogwalkerRealTimeService');
                logger.info(JSON.stringify(dogwalkerRealTimeService) + " insertion success");
            }
        })
})

router.put('/', function (req, res) {
    var sql = "";
    //쿼리스트링 존재안할 시 전체데이터 가져옴
    logger.info("/dogwalkerRealTimeService PUT : " + JSON.stringify(req.body));
    var body = req.body;
    var sqlColumnValueArray = [];
    if (Object.keys(req.query).length == 0)
        sqlColumnValueArray = [body, req.body.DogwalkerID];
    else {
        sqlColumnValueArray = [body, req.query.DogwalkerID];
    }
    //execute sql
    connection.query("UPDATE dogwalkerRealTimeService SET ? WHERE DogwalkerID=?", sqlColumnValueArray,
        function (error, result, fields) {
            dbResultHandle.postResultHandling(req, res, error, result, "update", "string");
        })
})

router.delete('/', function (req, res) {
    logger.info("/dogwalkerRealTimeService DELETE queryString: " + JSON.stringify(req.query));
    var body = req.body;
    var sqlColumnValueArray = [req.query.DogwalkerID];
    //execute sql
    connection.query("DELETE FROM dogwalkerRealTimeService WHERE DogwalkerID=?", sqlColumnValueArray,
        function (error, result, fields) {
            dbResultHandle.deleteResultHandling(req, res, error, result, "string");
        })
})

module.exports = router;