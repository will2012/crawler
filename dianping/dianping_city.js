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


fs.readFile(__dirname + "/cities.html", "utf8", function(err, data){
    if (err) {
        console.log(err);
        return;
    }
    let $ = cheerio.load(data);
    let $root = $(".root");
    for (let i = 0; i < $root.length; i++){
        let $item = $($root[i]);
        let vocabulary = $item.find(".vocabulary").text();
        let $terms = $($item.find(".terms-open"));
        for (let j = 0; j < $terms.length; j++){
            let $province = $($terms[j]);
            let province = $province.find("dt").text();

            let $cities = $($province.find("dd a"))
            for(let k = 0; k < $cities.length; k++){
                let $city = $($cities[k]);
                let href ="http://www.dianping.com" + $city.attr("href").trim();
                let name =$city.text().trim();
                if ('更多' === name) {
                    continue;
                }
                //let str = vocabulary + "|" + province + "|" + href + "|" + name;
                //console.log(str);
                let str = vocabulary + "|" + province + "|" + name + "|" + href + "\n";
                fs.writeFile(__dirname + '/city_urls.txt', str, {flag: 'a'}, function (err) {
                    if(err) {
                        console.error(err);
                    } else {
                        //console.log('写入成功');
                    }
                });
            }
        }
    }
});

