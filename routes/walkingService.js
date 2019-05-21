var express = require('express')
var router = express.Router()

// DATABASE SETTING
var connection=require('../configurations/dbConnection');

//LOGGER SETTING
const logger=require('../configurations/logConfiguration');


router.get('/',function(req, res, next) {
    var query = connection.query('select * from walking_service',
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
    var body = req.body;
    var walkingService = {
        'userId' : req.body.userId,
        'dogwalkerId' : req.body.dogwalkerId,
        'price' : req.body.price,
        'walkingTime' : req.body.walkingTime
    };
    //execute sql
    connection.query("INSERT INTO walking_service set ?", walkingService,
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
                logger.info(JSON.stringify(walkingService)+" insertion success");
            }
        })
})



module.exports = router;