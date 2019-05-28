var express = require('express')
var router = express.Router()

// DATABASE SETTING
var connection=require('../configurations/dbConnection');
//LOGGER SETTING
const logger=require('../configurations/logConfiguration');

router.get('/',function(req, res, next) {
    logger.info("/comment GET");
    var sql="";
    //쿼리스트링 존재안할 시 전체데이터 가져옴
    if(Object.keys(req.query).length==0)
        sql='select * from comment'
    else{//threadId에 해당하는 comment 가져옴
        sql='select * from comment where threadId=' +req.query.threadId;
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
                res.send('no rows in db');
            }
        })
})



    router.post('/', function(req, res){
        logger.info("/comment POST : "+JSON.stringify(req.body));
        var body = req.body;
        var userComment = {
            'commentContent' : req.body.commentContent,
            'threadId' : req.body.threadId,
            'user_UserID' : req.body.user_UserID
        };
        //execute sql
        connection.query("INSERT INTO comment set ?", userComment,
            function (error, result, fields){
                var resultMsg={};

                if(error){
                    //에러 발생시
                    resultMsg["result"]=0;
                    resultMsg["error"]=error;
                    // res.json(resultMsg);
                    res.send('err : ' + error)
                }
                else {
                    //execution success
                    resultMsg["result"]=1;
                    resultMsg["id"]=result.insertId;
                    // res.json(resultMsg);
                    res.send('success create userComment');
                    logger.info(JSON.stringify(userComment)+" insertion success");
                }
            })
    })


module.exports = router;