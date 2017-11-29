/**
 * 打印出携程旅游每个城市的旅游景点
 * http://you.ctrip.com/sight/hangzhou14.html
 */

let fs = require("fs");
let request = require("request");
let cheerio = require("cheerio");

fs.readFile(__dirname + "/city.txt", "utf8", function(err, data){
    if (err) {
        console.log(err);
        return;
    }
    let rows = data.split("\n");
    (async function(){
        for (let i = 0; i < rows.length; i++){
            let row = rows[i];
            let cityName = row.split("|")[0];
            let cityEnName = row.split("|")[1];
            let cityID = row.split("|")[2];
            await getTour(cityName, cityEnName, cityID, 1);        
        }
    })();
});

function getTour(cityName, cityEnName,  cityID, pageId){
    return new Promise(function(resolve, reject){
        let url = "http://you.ctrip.com/sight/" + cityID + "/s0-p" + pageId + ".html";
        console.log(url);
        let options = {
            url: url,
            headers: {
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Host": "you.ctrip.com",
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36 Name"
            }
        }
        request.get(options, function(err, response, html){
            if (err){
                reject(err);
                return;
            }
            let $ = cheerio.load(html);
            let tourNodes = $(".list_wide_mod2 .list_mod2");
            if (tourNodes.length > 0){
                (async function(){
                    for (let i = 0; i < tourNodes.length; i++){
                        let tourNode = tourNodes[i];
                        let tourName = $(tourNode).find("dt a").text();
                        let address = $(tourNode).find("dl .ellipsis").text().replace(/\s/g, "");
                        address= address.replace(/(\r\n|\n|\r)/gm,"")
                        let jd = $(tourNode).find("dl dd").text().replace(/\s/g, "");
                        jd= jd.replace(/(\r\n|\n|\r)/gm,"")
                        if (jd.split("|").length > 1) {
                            jd = jd.split("|")[0];
                        } else {
                            jd = "";
                        }
                        let tourId;
                        $(tourNode).find("dt a").attr("href").replace(/\/(\d+)\.html/, function(match, p1){
                            tourId = p1;
                        })
                        let rank = "";
                        $(tourNode).find("dt s").text().replace(/(\d+)/, function(match, p1){
                            if (p1){
                                rank = p1;
                            }
                        });
                        //let str = cityName + "|" + cityEnName + "|" + cityID + "|" + tourName + "|" + tourId + "|" + rank + "|" + address + "|" + jd +"\n";
                        let str = cityName + "|"  + tourName + "|" + address + "|" + jd +"\n";
                        console.log(str);
                        fs.writeFile(__dirname + '/tour.txt', str, {flag: 'a'}, function (err) {
                            if(err) {
                                console.error(err);
                            } else {
                                //console.log('写入成功');
                            }
                        });
                    }
                    pageId++;
                    await getTour(cityName, cityEnName, cityID, pageId);
                    resolve();
                })();
            } else {
                resolve();
            }
        })
    })
}