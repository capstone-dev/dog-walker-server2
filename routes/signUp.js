var express = require('express')
var router = express.Router()

// DATABASE SETTING
var connection=require('../configurations/dbConnection');

//LOGGER SETTING
const logger=require('../configurations/logConfiguration');


router.get('/',function(req, res, next) {
    logger.info("/singUP GET");
    var query = connection.query('select * from user',
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

    router.post('/', function(req, res){
        logger.info("/singUp POST : "+JSON.stringify(req.body));
        var body = req.body;
        var signUp = {
            'UserID' : req.body.UserID,
            'UserName' : req.body.UserName,
            'UserEmail' : req.body.UserEmail,
            'UserPhoneNumber' : req.body.UserPhoneNumber,
            'UserGender' : req.body.UserGender,
            'UserBigcity' : req.body.UserBigcity,
            'UserPassword' : req.body.UserPassword,
            'token' : req.body.token
        };
        //execute sql
        connection.query("INSERT INTO user set ?", signUp,
            function (error, result, fields){

                var resultMsg={};

                if(error){
                    //에러 발생시
                    resultMsg["result"]=0;
                    resultMsg["error"]=error;
                    res.json(resultMsg);

                }
                else {
                    //execution success
                    resultMsg["result"]=1;
                    resultMsg["id"]=result.insertId;
                    res.json(resultMsg);

                    logger.info(JSON.stringify(signUp)+" insertion success");
                }
            })
    })

router.put('/', function(req, res){
    logger.info("/singUp PUT : "+JSON.stringify(req.body));
    var body = req.body;
    var signUp = {
        'UserID' : req.body.UserID,
        'UserName' : req.body.UserName,
        'UserEmail' : req.body.UserEmail,
        'UserPhoneNumber' : req.body.UserPhoneNumber,
        'UserGender' : req.body.UserGender,
        'UserBigcity' : req.body.UserBigcity,
    };
    //execute sql
    connection.query("UPDATE user SET ? WHERE UserID='"+body.UserID+"'", signUp,
        function (error, result, fields){

            var resultMsg={};

            if(error){
                //에러 발생시
                resultMsg["result"]=0;
                resultMsg["error"]=error;
                res.json(resultMsg);

            }
            else {
                //execution success
                resultMsg["result"]=1;
                res.json(resultMsg);
                logger.info(JSON.stringify(signUp)+" modification success");
            }
        })
})



module.exports = router;