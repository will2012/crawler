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


fs.readFile(__dirname + "/ms.html", "utf8", function(err, data){
    if (err) {
        console.log(err);
        return;
    }
    let $ = cheerio.load(data);
    let $root = $("a");
    for (let i = 0; i < $root.length; i++){
        let $item = $($root[i]);
        console.log($item.attr("href").trim() + "|" + $item.find("span").text());
    }
});

