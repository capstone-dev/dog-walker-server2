var express = require('express')
var router = express.Router()
var fs = require('fs')

// DATABASE SETTING
var connection = require('../configurations/dbConnection');

//LOGGER SETTING
const logger = require('../configurations/logConfiguration');
//FILEUPLOAD SETTING
const fileUpload = require('../configurations/fileUploadConfiguration');
//dbResultHandling SETTING
const dbResultHandle = require('../configurations/dbResultHandling');

//gps 가져옴
router.get('/', function (req, res, next) {
    logger.info("/gps GET");
    var sql = "";
    //쿼리스트링 존재안할 시 전체데이터 가져옴
    if (Object.keys(req.query).length == 0)
        sql = 'select * from gps'
    else {//UserID와 UserPassword에 맞는 user 가져옴
        logger.info("/gps GET queryString: " + JSON.stringify(req.query));
        sql = 'select * from gps where id=' + req.query.id;
    }
    var query = connection.query(sql,
        function (err, rows) {
            dbResultHandle.getResultHandling(req, res, rows, err, "Not array")
        })
})

//gps의 id로 marker 정보 가져옴
router.get('/marker', function (req, res, next) {
    logger.info("/gps/marker GET queryString: " + JSON.stringify(req.query));
    var sql = "";
    sql = 'select marker.* from gps,marker where gps.id=marker.gpsId AND id=' + req.query.id;
    var query = connection.query(sql,
        function (err, rows) {
            dbResultHandle.getResultHandling(req, res, rows, err, "array")
        })
})

//gps의 id로 dogwalkerPosition 정보 가져옴
router.get('/dogwalkerPosition', function (req, res, next) {
    logger.info("/gps/dogwalkerPosition GET queryString: " + JSON.stringify(req.query));
    var sql = "";
    sql = 'select dogwalker_position.* from gps,dogwalker_position where gps.id=dogwalker_position.gpsId AND id=' + req.query.id;
    var query = connection.query(sql,
        function (err, rows) {
            dbResultHandle.getResultHandling(req, res, rows, err, "array")
        })
})


//markerId에 해당하는 이미지 파일 가져오기
router.get('/marker/image', function (req, res, next) {
    logger.info("/gps/marker/image GET : " + JSON.stringify(req.body));
    connection.query("select * from marker where markerId=" + req.query.markerId, function (err, rows) {
        dbResultHandle.getImageResultHandling(req, res, rows, err, "PhotoURL");
    });
})

/*요청 보낼 때 필드: startDogwalkerLatitude, startDogwalkerLongitude, endDogwalkerLatitude, endDogwalkerLongitude, walkDistance,
start_time, end_time, walkTime, start_time, end_time, walkTime*/
router.post('/', function (req, res) {
    logger.info("/gps POST : " + JSON.stringify(req.body));
    var body = req.body;
    //execute sql
    connection.query("INSERT INTO gps set ?", body,
        function (error, result, fields) {
            dbResultHandle.postResultHandling(req, res, error, result, "insert", "json");
        })
})

//marker 정보 및 이미지 업로드
//요청 보낼 때 필드: fileUpload, markerId, photoLatitude, photoLongitude, gpsId
router.post('/marker', fileUpload.single('fileUpload'), function (req, res) {
    logger.info("/gps/marker POST : " + JSON.stringify(req.body));
    logger.info("/gps/marker POST file: " + JSON.stringify(req.file));
    var body = req.body;
    body["PhotoURL"] = req.file.path;
    //execute sql
    connection.query("INSERT INTO marker set ?", body,
        function (error, result, fields) {
            dbResultHandle.postResultHandling(req, res, error, result, "insert", "json");
        })
})

//요청 보낼 때 필드: dogwalkerLatitude, dogwalkerLongitude, gpsId
router.post('/dogwalkerPosition', function (req, res) {
    logger.info("/gps/dogwalkerPosition POST : " + JSON.stringify(req.body));
    var body = req.body;
    //execute sql
    connection.query("INSERT INTO dogwalker_position set ?", body,
        function (error, result, fields) {
            dbResultHandle.postResultHandling(req, res, error, result, "insert", "json");
        })
})

//marker 정보 및 이미지 수정
//요청 보낼 때 필드: fileUpload, markerId, photoLatitude, photoLongitude, gpsId
router.put('/marker', fileUpload.single('fileUpload'), function (req, res) {
    logger.info("/gps/marker POST : " + JSON.stringify(req.body));
    logger.info("/gps/marker POST file: " + JSON.stringify(req.file));
    var body = req.body;
    body["PhotoURL"] = req.file.path;
    //execute sql
    connection.query("UPDATE marker SET ? WHERE markerId=" + body.markerId, body,
        function (error, result, fields) {
            dbResultHandle.postResultHandling(req, res, error, result, "update", "json");
        })
})

module.exports = router;
