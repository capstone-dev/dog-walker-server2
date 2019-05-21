var express = require('express')
var router = express.Router()

// DATABASE SETTING
var connection=require('../configurations/dbConnection');

//LOGGER SETTING
const logger=require('../configurations/logConfiguration');


router.get('/',function(req, res, next) {
    var query = connection.query('select * from thread',
        function (err, rows) {
            if (err) {
                res.send('err : ' + err);
                throw err;
            }
            if (rows[0]) {
                res.send(rows)
            } else {
                res.send('no rows in db');
            }
        })

})

    router.post('/', function(req, res){
        var body = req.body;
        var userThread = {
            'userId' : req.body.userId,
            'threadTitle' : req.body.threadTitle,
            'userLocation' : req.body.userLocation,
            'threadNumber' : req.body.threadNumber,
            'threadContent' : req.body.threadContent,
            'chatroomUserName' : req.body.chatroomUserName,
            'threadWalkDate': req.body.threadWalkDate
        };
        //execute sql
        connection.query("INSERT INTO thread set ?", userThread,
            function (error, result, fields){

                var resultMsg={};

                if(error){
                    //에러 발생시
                    resultMsg["result"]=0;
                    res.json(resultMsg);
                    throw error;
                }
                else {
                    //execution success
                    resultMsg["result"]=1;
                    resultMsg["id"]=result.insertId;
                    res.json(resultMsg);
                    logger.info(JSON.stringify(userThread)+" insertion success");
                }
            })
    })



module.exports = router;