/**
 * http://www.dianping.com/[city]
 */
let fs = require("fs");
let cheerio = require('cheerio');
let request = require('request');
var path = require('path');

let options = {
    url: "http://www.dianping.com/bazhou",
    headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
    }
}

let rows = null;
let idx = 0;

fs.readFile(__dirname + "/city_urls.txt", "utf8", function(err, data){
    if (err) {
        console.log(err);
        return;
    }
    rows = data.split("\n");
    getJiansheng();
});

function mkdirSync(url,mode,cb){
    var path = require("path"), arr = url.split("\\");
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

function ceaate_dir() {
    //华南地区|广西|象州县|http://www.dianping.com/xiangzhou
    mkdirSync(get_dest_path());
}

function get_dest_path() {
    //华南地区|广西|象州县|http://www.dianping.com/xiangzhou
    let row  = rows[idx];
    let area = row.split("|")[0];
    let province = row.split("|")[1];
    let city = row.split("|")[2];
    let url = row.split("|")[3];

    var fileName = city;
    var destPath = path.join("city", area ,province, fileName);
    return destPath;
}

function getJiansheng() {
    if (idx >= rows.length) {
        return;
    }

    // if (idx >= 2) {
    //     return;
    // }
    ceaate_dir();

    let row  = rows[idx];
    let area = row.split("|")[0];
    let province = row.split("|")[1];
    let city = row.split("|")[2];
    let url = row.split("|")[3] + "/sports";
    let options = {
        url: url,
        headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
        }
    }

    request.get(options, function(err, response, html){
        let href = "";
        let str = "";
        console.log("idx:" + idx);
        console.log(url);
        if (err||!(response)) {
            console.log(err);
            let str = area + "|" + province + "|" + city + "||" + href + "\n";
            fs.writeFileSync(__dirname + '/jiansheng_urls.txt', str, {flag: 'a'});
        }else if (response.statusCode !== 200){
            console.log("statusCode: ", response.statusCode);
        } else {
            let $ = cheerio.load(html);
            let $nodes =$('.term-list .term-list-item')
            for (let i = 0; i < $nodes.length; i++) {
                let $item = $($nodes[i]);
                let title = $item.find("strong").text().trim();
                if ("运动分类:" == title) {
                    console.log(title);
                    let $categories = $($item.find("li"));
                    for (let j = 0; j < $categories.length; j++) {
                        let $category = $($categories[j]).find("a");
                        // console.log($category.attr("href").trim() + "," + $category.text().trim());
                        let category_href =  "http://www.dianping.com" +  $category.attr("href").trim();
                        let category_name = $category.text().trim();

                        str = area + "|" + province + "|" + city + "|" + category_name + "|" + category_href + "\n";
                        console.log(str)
                        fs.writeFileSync(__dirname + '/jiansheng_urls.txt', str, {flag: 'a'});
                    }

                }
            }
        }
        idx++;
        getJiansheng();
    });
}



