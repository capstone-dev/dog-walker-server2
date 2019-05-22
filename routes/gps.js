var express = require('express')
var router = express.Router()

// DATABASE SETTING
var connection=require('../configurations/dbConnection');

//LOGGER SETTING
const logger=require('../configurations/logConfiguration');


router.get('/',function(req, res, next) {
    var query = connection.query('select * from gps',
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
        var body = req.body;
        var gps = {
            'gpsId' : req.body.gpsId,
            'markerId' : req.body.markerId,
            'photoData' : req.body.photoData,
            'photoLatitude' : req.body.photoLatitude,
            'photoLongitude' : req.body.photoLongitude,
            'dogwalkerLatitude' : req.body.dogwalkerLatitude,
            'dogwalkerLongitude': req.body.dogwalkerLongitude,
            'startDogwalkerLatitude': req.body.startDogwalkerLatitude,
            'startDogwalkerLongitude': req.body.startDogwalkerLongitude,
            'endDogwalkerLatitude': req.body.endDogwalkerLatitude,
            'endDogwalkerLongitude': req.body.endDogwalkerLongitude,
            'walkDistance': req.body.walkDistance,
            'start_time': req.body.start_time,
            'end_time': req.body.end_time,
            'walkTime': req.body.walkTime
        };
        //execute sql
        connection.query("INSERT INTO thread set ?", gps,
            function (error, result, fields){

                var resultMsg={};

                if(error){
                    //에러 발생시
                    resultMsg["result"]=0;
                    res.json(resultMsg);
                    throw error;
                }
                else {
                    //execution success
                    resultMsg["result"]=1;
                    resultMsg["id"]=result.insertId;
                    res.json(resultMsg);
                    logger.info(JSON.stringify(userThread)+" insertion success");
                }
            })
    })



module.exports = router;