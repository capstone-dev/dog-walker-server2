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


router.post('/', function(req, res){
    logger.info("/dogwalkerRealTimeService POST : "+JSON.stringify(req.body));
    var body = req.body;
    var dogwalkerRealTimeService = {
        'DogwalkerID': req.body.DogwalkerID,
        'DogwalkerBigcity': req.body.DogwalkerBigcity,
        'DogwalkerSmallcity': req.body.DogwalkerSmallcity,
        'selected': req.body.selected,
        'DogWalkerGender': req.body.DogwalkerGender
    };
    //execute sql
    connection.query("INSERT INTO comment set ?", dogwalkerRealTimeService,
        function (error, result, fields){
            var resultMsg={};

            if(error){
                //에러 발생시
                resultMsg["result"]=0;
                resultMsg["error"]=error;
                // res.json(resultMsg);
                res.send('err : ' + error)
            }
            else {
                //execution success
                resultMsg["result"]=1;
                resultMsg["id"]=result.insertId;
                // res.json(resultMsg);
                res.send('success create dogwalkerRealTimeService');
                logger.info(JSON.stringify(dogwalkerRealTimeService)+" insertion success");
            }
        })
})

router.put('/', function (req, res) {
    logger.info("/dogwalkerRealTimeService PUT : " + JSON.stringify(req.body));
    var body = req.body;
    //execute sql
    connection.query("UPDATE dogwalkerRealTimeService SET ? WHERE DogwalkerID='" + body.DogwalkerID + "'", body,
        function (error, result, fields) {
            dbResultHandle.postResultHandling(req, res, error, result, "update", "string");
        })
})

module.exports = router;
                                
