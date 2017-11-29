/**
 * http://www.dianping.com/[city]
 */
let fs = require("fs");
let cheerio = require('cheerio');
let request = require('request');
let rows = null;
let idx = 427;

let city_size = 0;
let current_page = 1;

let city_rows = null;
let city_idx = 0;
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
    //         if (url) {
    //             await  getJiansheng(area, province, city, url);
    //         } else {
    //             console.log(row);
    //         }
    //         break;
    //     }
    // })();
});

function getJiansheng() {
    if (idx >= rows.length) {
        return;
    }

    //中部西部|贵州|榕江县|篮球场|http://www.dianping.com/search/category/1790/45/g146
    console.log("idx:" + idx);
    current_page = 1;
    let row  = rows[idx];
    let area = row.split("|")[0];
    let province = row.split("|")[1];
    let city = row.split("|")[2];
    let url = row.split("|")[3] + "/hotel/f4001";
    let options = {
        url: url,
        headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
        }
    }

    request.get(options, function(err, response, html){
        let str = "";
        let row  = rows[idx];
        let area = row.split("|")[0];
        let province = row.split("|")[1];
        let city = row.split("|")[2];
        let prefix = area + "|" + province + "|" + city ;
        if (err) {
            str = prefix + "|||||||||" +err + "\n";
            fs.writeFileSync(__dirname + '/city/' + city + '.txt', str, {flag: 'a'});
            getJianshengPage();
        } else if (response.statusCode !== 200){
            str = prefix + "|||||||||" + response.statusCode + "\n";
            fs.writeFileSync(__dirname + '/city/' + city + '.txt', str, {flag: 'a'});
            getJianshengPage();
        } else {
            let $ = cheerio.load(html);
            let $nodes =$('.page')
            let $page = $($nodes).find("a")
            let size = $page.length;
            if (size == 0) {
                city_size = 1;
            } else {
                city_size = $($page[size - 2]).attr("data-ga-page")
            }
            getJianshengPage();
        }

    });
}

function getJianshengPage() {
    if (current_page > city_size) {
        idx++;
        getJiansheng();
        return;
    }

    let row  = rows[idx];
    let url = row.split("|")[3] + "/hotel/f4001";

    let options = {
        url: url + "p" + current_page,
        headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
        }
    }

    request.get(options, function(err, response, html){
        let row  = rows[idx];
        let area = row.split("|")[0];
        let province = row.split("|")[1];
        let city = row.split("|")[2];
        let category = row.split("|")[3];
        let url = row.split("|")[4];

        let prefix = area + "|" + province + "|" + city + "|" + category;
        let str = null;
        if (err) {
            // console.log(err);
            str = prefix + "|||||||||" +err + "\n";
            fs.writeFileSync(__dirname + '/city/' + city + '.txt', str, {flag: 'a'});
        } else if (response.statusCode !== 200){
            // console.log("statusCode: ", response.statusCode);
            // console.log(url + "|" + response.statusCode);
            // return;
            str = prefix +  "|||||||||" + response.statusCode + "\n";
            fs.writeFileSync(__dirname + '/city/' + city + '.txt', str, {flag: 'a'});
        } else {
            let $ = cheerio.load(html);
            let $terms = $($('.hotelshop-list .hotel-block'));
            for (let i = 0; i < $terms.length; i++){
                let $item =  $($terms[i]);
                let link = $item.find(".hotel-name a").attr("href");
                let title = $item.find(".hotel-name a").attr("title").trim();
                let place = $item.find(".place a").text().trim();
                let walk_dist = $item.find(".place span").text().trim();
                var hotel_tags = $item.find(".hotel-tags *").contents().map(function() {
                    return (this.type === 'text') ? $(this).text() : '';
                }).get().join('&');
                let price = $item.find(".price").text().trim();
                let rank = $item.find(".item-rank-ctn span").attr("class");
                if (rank) {
                    rank = rank.split(" ");
                    if (rank && rank.length > 1) {
                        rank =  rank[1];
                    }
                }
                if (!rank) {
                    rank = "";
                }
                str = prefix  + "|" + title + "|" + link + "|" + place + "|" + walk_dist + "|" + hotel_tags + "|" + price + "|" + rank + "\n";
                console.log(str);
                fs.writeFileSync(__dirname + '/city/' + city + '.txt', str, {flag: 'a'});
                str = "";
            }
        }
        if (current_page <= city_size) {
            current_page++;
            getJianshengPage();
        }
    });
}



