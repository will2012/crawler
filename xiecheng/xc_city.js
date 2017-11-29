/**
 * http://www.dianping.com/citylistguonei
 */

let fs = require("fs");
let cheerio = require('cheerio');
let request = require('request');


let options = {
    url: "http://www.dianping.com/citylistguonei",
    headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
    }
}


fs.readFile(__dirname + "/city.html", "utf8", function(err, data){
    if (err) {
        console.log(err);
        return;
    }
    let $ = cheerio.load(data);
    let $items = $("a");
    for (let i = 0; i < $items.length; i++){
        let $item = $($items[i]);
        let data = $item.attr("data");
        if (!data) {
            continue;
        }
        fs.writeFile(__dirname + '/city_data.txt', data + "\n", {flag: 'a'}, function (err) {
            if(err) {
                console.error(err);
            } else {
                //console.log('写入成功');
            }
        });
    }
});

