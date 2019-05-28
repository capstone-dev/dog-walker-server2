var fs = require('fs')
var multer = require('multer')

//파일 저장위치와 파일이름 설정
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //aws 서버용
        // cb(null, '/home/ubuntu/deploy/uploads/images')
        // 과제노트북 테스트용
        // cb(null, 'C:\\Users\\kyeongjun\\캡스톤 프로젝트\\uploads\\images')
        // 집 테스트용
        cb(null, 'C:\\Users\\kyeongjun\\capdProject\\uploads\\images')
    },
//파일이름 설정
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)
    }
})
//파일 업로드 모듈
var fileUpload = multer({storage: storage})


module.exports=fileUpload;
