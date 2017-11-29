/**
 * http://www.dianping.com/[city]
 */
let fs = require("fs");
let cheerio = require('cheerio');
let request = require('request');
var path = require('path');
//解析需要遍历的文件夹，我这以E盘根目录为例
var filePath = path.resolve(__dirname + '/city');
let rows = null;
let filePaths = new Array();
let idx = 0;
let fileIdx = 504;

let city_size = 0;
let current_page = 1;

let city_rows = null;
let city_idx = 0;

let chrome_version = 8.0;

fs.readdir(filePath,function(err,files){
    if(err){
        console.warn(err)
    }else{
        //遍历读取到的文件列表
        files.forEach(function(filename){
            //获取当前文件的绝对路径
            var filedir = path.join(filePath,filename);
            filePaths.push(filedir)
        });
        getJiansheng();

    }
});

function getJiansheng() {
    if (fileIdx >= filePaths.length || !filePaths[fileIdx]) {
        return;
    }
    console.log("fileIdx:" + fileIdx);
    var path = filePaths[fileIdx];
    fs.readFile(path, "utf8", function(err, data){
        if (err) {
            console.log(err);
            return;
        }
        console.log(path);
        rows = data.split("\n");
        let time = Math.random() * 10000;
        if (time > 3000) {
            time = time - 1000;
        }  if (time > 5000) {
            time = time - 2000;
        }  if (time > 7000) {
            time = time - 5000;
        }  if (time > 9000) {
            time = time - 7000;
        }
        console.log(time);
        setTimeout(getJianshengPage, time);
        fileIdx++;
        idx = 0;
    });
}


function getJianshengPage() {
    if (idx >= rows.length || !rows[idx]) {
        getJiansheng();
        return;
    }
    let row  = rows[idx];
    console.log(row);
    let url = "https://www.dianping.com" + row.split("|")[5];
    console.log(url);
    console.log(idx);
    let options = {
        url: url,
        headers: {
            'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Accept-Encoding':'gzip, deflate',
            'Accept-Language':'en-US,en;q=0.8,zh-CN;q=0.6,zh;q=0.4,zh-TW;q=0.2',
            'Connection':'keep-alive',
            'Cookie':'_lxsdk_cuid=15f7068fff6c8-089659126d9f74-5d153b16-1fa400-15f7068fff7c8; _lxsdk=15f7068fff6c8-089659126d9f74-5d153b16-1fa400-15f7068fff7c8; _hc.v=c1fb166c-b8b7-61a2-9101-55017a13bc14.1509419450; s_ViewType=1; JSESSIONID=BE96333A7C8915918F41DE9A067470FE; aburl=1; cye=haerbin; __mta=153950855.1510898065760.1510898461719.1510907642858.3; cy=79; _lxsdk_s=15fc910af83-07c-aa6-03d%7C%7C22',
            'DNT':1,
            'Host':'www.dianping.com',
            'Upgrade-Insecure-Requests':1,
            'User-Agent':'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/' + chrome_version + '.0.3163.79 Safari/537.36'
        }
    }

    request.get(options, function(err, response, html){
        let row  = rows[idx];
        console.log(row);
        let area = row.split("|")[0];
        let province = row.split("|")[1];
        let city = row.split("|")[2];
        let category = row.split("|")[3];
        let url = row.split("|")[4];
        console.log(options.url);
        let str = null;
        if (err) {
            //console.log(err);
            //str = row + "|" + err + "\n";
            //fs.writeFileSync(__dirname + '/city-info/' + city + '.txt', str, {flag: 'a'});
        } else if (response.statusCode !== 200){
            // console.log("statusCode: ", response.statusCode);
            // console.log(url + "|" + response.statusCode);
            // return;
            console.log(response.statusCode + "|" + city);
            console.log("================");
            //str = row + "|"  + response.statusCode + "\n";
            //fs.writeFileSync(__dirname + '/city-info/' + city + '.txt', str, {flag: 'a'});
            chrome_version++;
        } else {
            let $ = cheerio.load(html);
            let $main_detail = $($('.main-detail'));
            let hotel_address = $main_detail.find(".hotel-address").text().trim();
            let $sub_content = $($('.sub-content'));
            let info_value = '无'
            if ( $sub_content.find(".list-info li .info-value").length > 0) {
                info_value = $sub_content.find(".list-info li .info-value").eq(0).text().trim();
            }

            console.log(row + "|" + hotel_address + "|" + info_value);
            fs.writeFileSync(__dirname + '/city-info/' + city + '.txt', row + "|" + hotel_address + "|" + info_value + "\n", {flag: 'a'});
            idx++;
        }

        let time = Math.random() * 10000;
        if (time > 9000) {
            time = time - 7000;
        }
        if (time > 7000) {
            time = time - 5000;
        }
        if (time > 6000) {
            time = time - 4000;
        }
        if (time > 5000) {
            time = time - 3000;
        }
        if (time > 2000) {
            time = time - 2000;
        }
        if (time > 3000) {
            time = time - 1000;
        }
        console.log(time);
        setTimeout(getJianshengPage, time);

    });
}



