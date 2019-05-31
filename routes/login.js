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
    logger.info("/login GET");
    var sql="";
    //쿼리스트링 존재안할 시 전체데이터 가져옴
    if(Object.keys(req.query).length==0)
        sql='select * from user'
    else{//UserID와 UserPassword에 맞는 user 가져옴
        // sql='select UserID,UserPassword,UserName,UserEmail,UserGender,UserPhoneNumber,UserBigcity from user where UserID="' +req.query.UserID+'" AND UserPassword="'+req.query.UserPassword+'"';
        sql='select * from user where UserID="' +req.query.UserID+'" AND UserPassword="'+req.query.UserPassword+'"';
    }
    var query = connection.query(sql,
        function(err,rows){
            if(err){
                res.send('err : ' + err);
            }
            if(rows[0]){
                res.send(rows[0])
            }
            else{
                res.send('Incorret Id or Password');
            }
        })
})

//user 강아지 이미지 파일 가져오기
router.get('/image', function (req, res, next) {
    logger.info("/login/image GET : "+JSON.stringify(req.body));
    var sql='select * from user where UserID="' +req.query.UserID+'" AND UserPassword="'+req.query.UserPassword+'"';
    connection.query(sql, function (err, rows) {
        dbResultHandle.getImageResultHandling(req, res, rows, err, "dog_image");
    });
})

//user 정보 변경
router.post('/', fileUpload.single('dog_imagefile'),function(req, res){
    logger.info("/login POST : "+JSON.stringify(req.body));
    logger.info("/login POST file: " + JSON.stringify(req.file));
    var body = req.body;
    body["dog_image"] = req.file.path;
    //execute sql
    connection.query("UPDATE user SET ? WHERE UserID='"+body.UserID+"'", body,
        function (error, result, fields) {
            dbResultHandle.postResultHandling(req, res, error, result, "update","string");
        })
})


module.exports = router;