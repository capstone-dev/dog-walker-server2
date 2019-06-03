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

//myPet 정보 가져오기
router.get('/',function(req, res, next) {
    logger.info("/myPet GET");
    var sql="";
    //쿼리스트링 존재안할 시 전체데이터 가져옴
    if(Object.keys(req.query).length==0)
        sql='select * from MyPet'
    else{//UserID와 UserPassword에 맞는 user 가져옴
        logger.info("/myPet GET queryString: " + JSON.stringify(req.query));
        sql='select * from MyPet WHERE UserID="' +req.query.UserID+'"';
    }
    var query = connection.query(sql,
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

//user 강아지 이미지 파일 가져오기
router.get('/image', function (req, res, next) {
    logger.info("/myPet/image GET : "+JSON.stringify(req.body));
    var sql='select * from MyPet where UserID="' +req.query.UserID+'" AND dog_name= "'+req.query.dog_name+'"';
    connection.query(sql, function (err, rows) {
        dbResultHandle.getImageResultHandling(req, res, rows, err, "dog_imagefile_path");
    });
})

//user 정보 생성
//요청 보낼 때 필드: dog_imagefile(파일), UserID, dog_name, dog_species, dog_age
router.post('/', fileUpload.single('dog_imagefile'),function(req, res){
    logger.info("/myPet POST : "+JSON.stringify(req.body));
    logger.info("/myPet POST file: " + JSON.stringify(req.file));
    var body = req.body;
    body["dog_imagefile_path"] = req.file.path;
    //execute sql
    connection.query("INSERT INTO MyPet SET ?", body,
        function (error, result, fields) {
            dbResultHandle.postResultHandling(req, res, error, result, "insert","string");
        })
})


module.exports = router;