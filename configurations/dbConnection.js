const mysql = require('mysql')

var db_config={
    host     : '13.125.0.94',
    port     : 3306,
    user     : 'root',
    password : 'teaming',
    database : 'capswdb',
    dateStrings:true
}

 // DATABASE SETTING
 var connection = mysql.createConnection(db_config);

function handleDisconnect(){
    connection = mysql.createConnection(db_config);
    connection.connect(function(err){
        if(err){
            logger.error('mysql connection error :'+err);
            setTimeout(handleDisconnect, 2000);
        }
    });
    connection.on('error', function(err) {
        logger.error('db error', err);
        setTimeout(handleDisconnect, 2000);
    });
}
handleDisconnect();
module.exports=connection;