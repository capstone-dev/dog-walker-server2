var express = require('express')
var router = express.Router()
var fs = require('fs')
var multer = require('multer')

// DATABASE SETTING
var connection=require('../configurations/dbConnection');

//LOGGER SETTING
const logger=require('../configurations/logConfiguration');

//파일 저장위치와 파일이름 설정
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/home/ubuntu/deploy/uploads/images')
    },
//파일이름 설정
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)
    }
})
//파일 업로드 모듈
var upload = multer({storage: storage})

router.get('/',function(req, res, next) {
    var query = connection.query('select * from gps',
        function (err, rows) {
            if (err) {
                res.send('err : ' + err);
            }
            if(rows[0]){
                res.send(rows[0])
            } else {
                res.send('no rows in db');
            }
        })

})

    router.post('/', upload.single('fileUpload'),function(req, res){

        var body = req.body;
        var gps = {
            'gpsId' : req.body.gpsId,
            'markerId' : req.body.markerId,
            'photoData' : req.file.path,
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
        connection.query("INSERT INTO gps set ?", gps,
            function (error, result, fields){

                var resultMsg={};

                if(error){
                    //에러 발생시
                    resultMsg["result"]=0;
                    res.json(resultMsg);
			logger.error(error);
                }
                else {
                    //execution success
                    resultMsg["result"]=1;
                    resultMsg["id"]=result.insertId;
                    res.json(resultMsg);
                    logger.info(JSON.stringify(gps)+" insertion success");
                }
            })
    })



module.exports = router;
