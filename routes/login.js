var express = require('express')
var router = express.Router()

// DATABASE SETTING
var connection=require('../configurations/dbConnection');
//LOGGER SETTING
const logger=require('../configurations/logConfiguration');

router.get('/',function(req, res, next) {

    var sql="";
    //쿼리스트링 존재안할 시 전체데이터 가져옴
    if(Object.keys(req.query).length==0)
        sql='select * from user'
    else{//threadId에 해당하는 comment 가져옴
        sql='select * from user where UserID="' +req.query.id+'" AND UserPassword="'+req.query.pw+'"';
    }
    var query = connection.query(sql,
        function(err,rows){
            if(err){
                res.send('err : ' + err);
                throw err;
            }
            if(rows[0]){
                res.send(rows)
            }
            else{
                res.send('Incorret Id or Password');
            }
        })
})



router.post('/', function(req, res){

})


module.exports = router;