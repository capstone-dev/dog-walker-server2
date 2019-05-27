const mysql = require('mysql')
//LOGGER SETTING
const logger = require('./logConfiguration');

var db_config={
    host     : '13.125.0.94',
    port     : 3306,
    user     : 'root',
    password : 'teaming',
    database : 'capswdb',
    dateStrings:true
}

 // DATABASE SETTING
 var connection;

function handleDisconnect(){
    connection = mysql.createConnection(db_config);
    connection.connect(function(err){
        if(err){
            logger.error('mysql connection error :'+err);
            setTimeout(handleDisconnect, 2000);
        }
    });
    connection.on('error', function(err) {
        logger.error('db error: '+err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            handleDisconnect();                         // lost due to either server restart, or a
        }
    });
}
handleDisconnect();
module.exports=connection;