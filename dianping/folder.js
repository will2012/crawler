let fs = require("fs");
let cheerio = require('cheerio');
let request = require('request');
var path = require('path');
const fse = require('fs-extra')
function mkdirSync(url,mode,cb){
    var path = require("path"), arr = url.split("/");
    // noinspection JSAnnotator
    mode = mode || 0755;
    cb = cb || function(){};
    if(arr[0]==="."){//处理 ./aaa
        arr.shift();
    }
    if(arr[0] == ".."){//处理 ../ddd/d
        arr.splice(0,2,arr[0]+"/"+arr[1])
    }
    function inner(cur){
        if(!fs.existsSync(cur)){//不存在就创建一个
            fs.mkdirSync(cur, mode)
        }
        if(arr.length){
            inner(cur + "/"+arr.shift());
        }else{
            cb();
        }
    }
    arr.length && inner(arr.shift());
}

// fs.readFile(__dirname + "/city_urls.txt", "utf8", function(err, data){
//     if (err) {
//         console.log(err);
//         return;
//     }
//     rows = data.split("\n");
//     (async function(){
//         for (let i = 0; i < rows.length; i++){
//             //华南地区|广西|象州县|http://www.dianping.com/xiangzhou
//             let row = rows[i];
//             let area = row.split("|")[0];
//             let province = row.split("|")[1];
//             let city = row.split("|")[2];
//             let url = row.split("|")[3];
//             console.log("city/" + province + "/" + city);
//             mkdirSync("city/" + area + "/" + province );
//         }
//     })();
// });

fs.readFile(__dirname + "/jiansheng_urls_bak.txt", "utf8", function(err, data){
    if (err) {
        console.log(err);
        return;
    }
    rows = data.split("\n");
    (async function(){
        for (let i = 0; i < rows.length; i++){
            // if (i >= 1) {
            //     break;
            // }
            //华南地区|广西|象州县|http://www.dianping.com/xiangzhou
            let row = rows[i];
            let area = row.split("|")[0];
            let province = row.split("|")[1];
            let city = row.split("|")[2];
            let url = row.split("|")[3];

            var fileName = city;
            var folder = path.join(__dirname, "city");
            var destPath = path.join(__dirname, "city", area ,province, fileName + ".txt");
            var sourceFile = path.join(folder, fileName + ".txt");
            if(fs.existsSync(sourceFile)){
                console.log(sourceFile);
                console.log(destPath);
                // var readStream = fs.createReadStream(sourceFile);
                // var writeStream = fs.createWriteStream(destPath);
                // readStream.pipe(writeStream);
                // console.log(sourceFile + " 移动完成")
                try {
                    fse.copySync(sourceFile, destPath)
                    console.log('success!')
                } catch (err) {
                    console.error(err)
                }
            }
        }
    })();
});