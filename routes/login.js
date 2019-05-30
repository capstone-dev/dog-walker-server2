var express = require('express')
var router = express.Router()
var fs = require('fs')

// DATABASE SETTING
var connection=require('../configurations/dbConnection');
//LOGGER SETTING
const logger=require('../configurations/logConfiguration');
//FILEUPLOAD SETTING
const fileUpload=require('../configurations/fileUploadConfiguration');

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
        if (err)
            res.send('err : ' + err);
        if (rows[0]) {
            logger.info(rows[0]);
            var fileName = rows[0].dog_image;
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

//user 정보 변경
router.post('/', fileUpload.single('dog_imagefile'),function(req, res){
    logger.info("/login POST : "+JSON.stringify(req.body));
    logger.info("/login POST file: " + JSON.stringify(req.file));
    var body = req.body;
    var user = {
        'dog_name' : req.body.dog_name,
        'dog_species' : req.body.dog_species,
        'dog_age' : req.body.dog_age,
        'dog_image' : req.file.path
    };
    //execute sql
    connection.query("UPDATE user SET ? WHERE UserID='"+body.UserID+"'", user,
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
                res.json(resultMsg);
                logger.info(JSON.stringify(user) + " modification success");
            }
        })
})


module.exports = router;