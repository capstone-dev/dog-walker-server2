var express = require('express')
var router = express.Router()

// DATABASE SETTING
var connection=require('../configurations/dbConnection');
//LOGGER SETTING
const logger=require('../configurations/logConfiguration');
//FILEUPLOAD SETTING
const fileUpload=require('../configurations/fileUploadConfiguration');

router.get('/',function(req, res, next) {
    var sql="";
    //쿼리스트링 존재안할 시 전체데이터 가져옴
    if(Object.keys(req.query).length==0)
        sql='select * from user'
    else{//threadId에 해당하는 comment 가져옴
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


//user 정보 변경
router.post('/', fileUpload.single('dog_imagefile'),function(req, res){
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