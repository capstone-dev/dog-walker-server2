const logger = require('./logConfiguration');
const fs = require('fs')

exports.getResultHandling = function (req, res, rows, err, isArray) {
    if (err) {
        res.send('err : ' + err);
    }
    if (rows[0]) {
        if (isArray == "array")
            res.send(rows)
        else
            res.send(rows[0])
    } else {
        res.send('no rows in db');
    }
}

exports.getImageResultHandling = function (req, res, rows, err, filePathColumn) {
    if (err)
        res.send('err : ' + err);
    if (rows[0]) {
        logger.info(rows[0]);
        var fileName = rows[0][filePathColumn];
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
}

exports.postResultHandling = function (req, res, error, result, queryType, responseType) {
    var resultMsg = {};
    if (error) {
        //에러 발생시
        resultMsg["result"] = "fail";
        resultMsg["error"] = error;

        if (responseType == "json")
            res.json(resultMsg);
        else if ((responseType == "string"))
            res.send('err : ' + error);

        logger.error(error);
    } else {
        //execution success
        resultMsg["result"] = "success";
        if (queryType == "insert") {
            resultMsg["id"] = result.insertId;
            logger.info(JSON.stringify(req.body) + " insertion success");
        } else if (queryType == "update") {
            logger.info(JSON.stringify(req.body) + " modification success");
        }

        if (responseType == "json")
            res.json(resultMsg);
        else if ((responseType == "string"))
            res.send('success create' + JSON.stringify(req.body));

    }
}

exports.putResultHandling = function (req, res, error, result, responseType) {
    var resultMsg = {};
    if (error) {
        //에러 발생시
        resultMsg["result"] = "fail";
        resultMsg["error"] = error;

        if (responseType == "json")
            res.json(resultMsg);
        else if ((responseType == "string"))
            res.send('err : ' + error);

        logger.error(error);
    } else {
        //execution success
        resultMsg["result"] = "success";
        logger.info(JSON.stringify(req.body) + " modification success");

        if (responseType == "json")
            res.json(resultMsg);
        else if ((responseType == "string"))
            res.send('success modify ' + JSON.stringify(req.body));
    }
}

exports.deleteResultHandling = function (req, res, error, result, responseType) {
    var resultMsg = {};
    if (error) {
        //에러 발생시
        resultMsg["result"] = "fail";
        resultMsg["error"] = error;

        if (responseType == "json")
            res.json(resultMsg);
        else if ((responseType == "string"))
            res.send('err : ' + error);

        logger.error(error);
    } else {
        //execution success
        resultMsg["result"] = "success";
        logger.info(JSON.stringify(req.query) + " deletion success");


        if (responseType == "json")
            res.json(resultMsg);
        else if ((responseType == "string"))
            res.send('success delete ' + JSON.stringify(req.query));
    }
}