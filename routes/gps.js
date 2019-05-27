var express = require('express')
var router = express.Router()
var fs = require('fs')

// DATABASE SETTING
var connection = require('../configurations/dbConnection');

//LOGGER SETTING
const logger = require('../configurations/logConfiguration');
//FILEUPLOAD SETTING
const fileUpload=require('../configurations/fileUploadConfiguration');


router.get('/', function (req, res, next) {
    var query = connection.query('select * from gps',
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

//gps 이미지 파일 가져오기
router.get('/image', function (req, res, next) {
    connection.query("select * from gps where id=" + req.query.id, function (err, rows) {
        if (err)
            res.send('err : ' + err);
        if (rows[0]) {
            logger.info(rows[0]);
            var fileName = rows[0].photoData;
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


router.post('/', fileUpload.single('fileUpload'), function (req, res) {
logger.info("/gps post : "+JSON.stringify(req.body));
    var body = req.body;
    var gps = {
        'gpsId': req.body.gpsId,
        'markerId': req.body.markerId,
        'photoData': req.file.path,
        'photoLatitude': req.body.photoLatitude,
        'photoLongitude': req.body.photoLongitude,
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


module.exports = router;
