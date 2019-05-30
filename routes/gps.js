var express = require('express')
var router = express.Router()
var fs = require('fs')

// DATABASE SETTING
var connection = require('../configurations/dbConnection');

//LOGGER SETTING
const logger = require('../configurations/logConfiguration');
//FILEUPLOAD SETTING
const fileUpload = require('../configurations/fileUploadConfiguration');

//gps 가져옴
router.get('/', function (req, res, next) {
    logger.info("/gps GET");
    var sql="";
    //쿼리스트링 존재안할 시 전체데이터 가져옴
    if(Object.keys(req.query).length==0)
        sql='select * from gps'
    else{//UserID와 UserPassword에 맞는 user 가져옴
        sql='select * from gps where id=' +req.query.id;
    }
    var query = connection.query(sql,
        function (err, rows) {
            if (err) {
                res.send('err : ' + err);
            }
            if (rows[0]) {
                res.send(rows[0])
            } else {
                res.send('no rows in db');
            }
        })
})

//gps의 id로 marker 정보 가져옴
router.get('/marker', function (req, res, next) {
    logger.info("/gps/marker GET");
    var sql="";
    sql='select marker.* from gps,marker where gps.id=marker.gpsId AND id=' +req.query.id;
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

//gps의 id로 dogwalkerPosition 정보 가져옴
router.get('/dogwalkerPosition', function (req, res, next) {
    logger.info("/gps/dogwalkerPosition GET");
    var sql="";
    sql='select dogwalker_position.* from gps,dogwalker_position where gps.id=dogwalker_position.gpsId AND id=' +req.query.id;
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


//markerId에 해당하는 이미지 파일 가져오기
router.get('/marker/image', function (req, res, next) {
    logger.info("/gps/marker/image GET : "+JSON.stringify(req.body));
    connection.query("select * from marker where markerId=" + req.query.markerId, function (err, rows) {
        if (err)
            res.send('err : ' + err);
        if (rows[0]) {
            logger.info(rows[0]);
            var fileName = rows[0].PhotoURL;
            var fileNameExtension = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length);
            fs.readFile(fileName,              //파일 읽기
                function (err, data) {
                    if (err)
                        res.send('err : ' + err);
                    else {
                        //http의 헤더정보를 클라이언트쪽으로 출력
                        //write 로 보낼 내용을 입력
                        res.writeHead(200, {"Context-Type": "image/" + fileNameExtension});//보낼 헤더를 만듬
                        res.write(data);   //본문을 만들고
                        res.end();  //클라이언트에게 응답을 전송한다
                    }
                }
            );
            // res.download(fileName);
        } else
            res.send("no rows in db");
    });
})


router.post('/', function (req, res) {
    logger.info("/gps POST : " + JSON.stringify(req.body));
    var body = req.body;
    var gps = {
        'gpsId': req.body.gpsId,
        'dogwalkerLatitude': req.body.dogwalkerLatitude,
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
        function (error, result, fields) {

            var resultMsg = {};

            if (error) {
                //에러 발생시
                resultMsg["result"] = 0;
                res.json(resultMsg);
                logger.error(error);
            } else {
                //execution success
                resultMsg["result"] = 1;
                resultMsg["id"] = result.insertId;
                res.json(resultMsg);
                logger.info(JSON.stringify(gps) + " insertion success");
            }
        })
})

router.post('/marker', fileUpload.single('fileUpload'), function (req, res) {
    logger.info("/gps/marker POST : " + JSON.stringify(req.body));
    logger.info("/gps/marker POST file: " + JSON.stringify(req.file));
    var body = req.body;
    var marker = {
        'markerId': req.body.markerId,
        'PhotoURL': req.file.path,
        'photoLatitude': req.body.photoLatitude,
        'photoLongitude': req.body.photoLongitude,
        'gpsId': req.body.gpsId
    };
    //execute sql
    connection.query("INSERT INTO marker set ?", marker,
        function (error, result, fields) {

            var resultMsg = {};

            if (error) {
                //에러 발생시
                resultMsg["result"] = 0;
                res.json(resultMsg);
                logger.error(error);
            } else {
                //execution success
                resultMsg["result"] = 1;
                resultMsg["id"] = result.insertId;
                res.json(resultMsg);
                logger.info(JSON.stringify(marker) + " insertion success");
            }
        })
})

router.post('/dogwalkerPosition', function (req, res) {
    logger.info("/gps/dogwalkerPosition POST : " + JSON.stringify(req.body));
    var body = req.body;
    var dogwalkerPosition = {
        'dogwalkerLatitude': req.body.dogwalkerLatitude,
        'dogwalkerLongitude': req.body.dogwalkerLongitude,
        'gpsId': req.body.gpsId
    };
    //execute sql
    connection.query("INSERT INTO dogwalker_position set ?", dogwalkerPosition,
        function (error, result, fields) {

            var resultMsg = {};

            if (error) {
                //에러 발생시
                resultMsg["result"] = 0;
                res.json(resultMsg);
                logger.error(error);
            } else {
                //execution success
                resultMsg["result"] = 1;
                resultMsg["id"] = result.insertId;
                res.json(resultMsg);
                logger.info(JSON.stringify(dogwalkerPosition) + " insertion success");
            }
        })
})

module.exports = router;
