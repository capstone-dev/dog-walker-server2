var express = require('express')
var router = express.Router()

// DATABASE SETTING
var connection=require('../configurations/dbConnection');

//LOGGER SETTING
const logger=require('../configurations/logConfiguration');
//dbResultHandling SETTING
const dbResultHandle = require('../configurations/dbResultHandling');

router.get('/',function(req, res, next) {
    logger.info("/walkingService GET");
    var sql = "";
    if (Object.keys(req.query).length == 0) {
        sql = 'select * from walking_service';
    } else {
        logger.info("/walking_service GET queryString: " + JSON.stringify(req.query));
        var fieldName = Object.keys(req.query)[0];
        var fieldValue = req.query[fieldName];
        sql = 'select * from walking_service WHERE ' + fieldName + '="' + fieldValue + '"';
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

router.post('/', function(req, res){
    logger.info("/walkingService POST : "+JSON.stringify(req.body));
    var body = req.body;
    var walkingService = {
        'user_UserID' : req.body.user_UserID,
        'user_DogwalkerID' : req.body.user_DogwalkerID,
        'price' : req.body.price,
        'walkingTime' : req.body.walkingTime,
        'serviceLocation' : req.body.serviceLocation,
        'peopleNumber' : req.body.peopleNumber
    };
    //execute sql
    connection.query("INSERT INTO walking_service set ?", walkingService,
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
                res.send('success create walkingService');
                logger.info(JSON.stringify(walkingService)+" insertion success");
            }
        })
})

router.delete('/', function (req, res) {
    logger.info("/walkingService DELETE queryString: " + JSON.stringify(req.query));
    var body = req.body;
    var sqlColumnValueArray = [req.query.id];
    //execute sql
    connection.query("DELETE FROM walking_service WHERE id=?", sqlColumnValueArray,
        function (error, result, fields) {
            dbResultHandle.deleteResultHandling(req, res, error, result, "string");
        })
})

module.exports = router;