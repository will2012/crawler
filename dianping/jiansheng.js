/**
 * http://www.dianping.com/[city]
 */
let fs = require("fs");
let cheerio = require('cheerio');
let request = require('request');

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
    // (async function(){
    //     for (let i = 0; i < rows.length; i++){
    //         //华南地区|广西|象州县|http://www.dianping.com/xiangzhou
    //         let row = rows[i];
    //         let area = row.split("|")[0];
    //         let province = row.split("|")[1];
    //         let city = row.split("|")[2];
    //         let url = row.split("|")[3];
    //         console.log(row);
    //         await getJiansheng(area, province, city, url);
    //     }
    // })();
});

function getJiansheng() {
    if (idx >= rows.length) {
        return;
    }
    let row  = rows[idx];
    let area = row.split("|")[0];
    let province = row.split("|")[1];
    let city = row.split("|")[2];
    let url = row.split("|")[3];
    let options = {
        url: url,
        headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
        }
    }

    request.get(options, function(err, response, html){
        let href = "";
        let str = "";
        if (err) {
            console.log(err);
            let str = area + "|" + province + "|" + city + "|" + href + "\n";
        };
        if (response.statusCode !== 200){
            console.log("statusCode: ", response.statusCode);
        } else {
            let $ = cheerio.load(html);
            let $nodes =$('a[data-key=2636]')
            if ( $($nodes).attr("href")) {
                href = "http://www.dianping.com" + $($nodes).attr("href");
            }
            str = area + "|" + province + "|" + city + "|" + href + "\n";
        }

        console.log(str);
        fs.writeFileSync(__dirname + '/jiansheng_urls.txt', str, {flag: 'a'});
        idx++;
        getJiansheng();
    });
}



