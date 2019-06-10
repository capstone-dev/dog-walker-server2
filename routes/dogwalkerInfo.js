var express = require('express')
var router = express.Router()
var fs = require('fs')

// DATABASE SETTING
var connection=require('../configurations/dbConnection');
//LOGGER SETTING
const logger=require('../configurations/logConfiguration');
//FILEUPLOAD SETTING
const fileUpload=require('../configurations/fileUploadConfiguration');
//dbResultHandling SETTING
const dbResultHandle = require('../configurations/dbResultHandling');

router.get('/',function(req, res, next) {
    logger.info("/dogwalkerInfo GET");
    var sql='';
    var sqlColumnValueArray;
    //쿼리스트링 존재안할 시 전체데이터 가져옴
    if(Object.keys(req.query).length==0)
        sql='select * from user';
    else{//UserID와 UserPassword에 맞는 user 가져옴
        logger.info("/dogwalkerInfo GET queryString: " + JSON.stringify(req.query));
        // sql='select * from user where UserID="' +req.query.UserID+'" AND UserPassword="'+req.query.UserPassword+'"';
        sql='select * from user where ?';
        sqlColumnValueArray = [req.query];
    }
    var query = connection.query(sql,sqlColumnValueArray,
        function(err,rows){
            if(err){
                res.send('err : ' + err);
            }
            if(rows[0]){
                res.send(rows)
            }
            else{
                res.send('Incorret Id or Password');
            }
        })
})

//도그워커 프로필 사진 가져오기
router.get('/image', function (req, res, next) {
    logger.info("/dogwalkerInfo/image GET : "+JSON.stringify(req.body));
    var sql='select * from user where UserID="' +req.query.UserID+'" AND UserPassword="'+req.query.UserPassword+'"';
    connection.query(sql, function (err, rows) {
        dbResultHandle.getImageResultHandling(req, res, rows, err, "Dogwalkerphoto");
    });
})

//user 정보 변경
//요청 보낼 때 필드: fileUpload, UserID, userBigcity, UserSmallcity, UserTime, UserInfo
// UserMonth, Userdate, UserDay
router.post('/'
    // ,fileUpload.single('fileUpload')
    ,function(req, res){
    var body = req.body;
    logger.info("/dogwalkerInfo POST : "+JSON.stringify(body));
    // logger.info("/dogwalkerInfo POST file: " + JSON.stringify(req.file));
    var sqlColumnValueArray = [body, body.UserID];
    // body["Dogwalkerphoto"] = req.file.path;
    //execute sql
    connection.query("UPDATE user SET ? WHERE UserID=?", sqlColumnValueArray,
        function (error, result, fields) {
            dbResultHandle.postResultHandling(req, res, error, result, "update","string");
        })
})


module.exports = router;