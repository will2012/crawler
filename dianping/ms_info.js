/**
 * http://www.dianping.com/[city]
 */
let fs = require("fs");
let cheerio = require('cheerio');
let request = require('request');
let rows = null;
let idx = 0;

let city_size = 0;
let current_page = 1;

let city_rows = null;
let city_idx = 0;


fs.readFile(__dirname + "/ms.txt", "utf8", function(err, data){
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
    // if (idx >= 2) {
    //     return;
    // }
    console.log("idx:" + idx);
    current_page = 1;
    let row  = rows[idx];
    let category = row.split("|")[1].replace(/(\r\n|\n|\r)/gm,"");;
    let url = row.split("|")[0].trim();
    let options = {
        url: url,
        headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
        }
    }

    request.get(options, function(err, response, html){
        let str = "";
        let row  = rows[idx];
        let url = row.split("|")[0];
        let category = row.split("|")[1].replace(/(\r\n|\n|\r)/gm,"");;
        let prefix = category;
        if (err) {
            str = prefix + "|||||" +err + "\n";
            fs.writeFileSync(__dirname + '/ms/' + category + '.txt', str, {flag: 'a'});
            getJianshengPage();
        } else if (response.statusCode !== 200){
            str = prefix + "|||||" + response.statusCode + "\n";
            fs.writeFileSync(__dirname + '/ms/' + category + '.txt', str, {flag: 'a'});
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
    let url = row.split("|")[0];
    let category = row.split("|")[1].replace(/(\r\n|\n|\r)/gm,"");;

    let options = {
        url: url + "p" + current_page,
        headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
        }
    }

    request.get(options, function(err, response, html){
        let row  = rows[idx];
        let url = row.split("|")[0];
        let category = row.split("|")[1].replace(/(\r\n|\n|\r)/gm,"");

        let prefix = category;
        let str = null;
        if (err) {
            // console.log(err);
            str = prefix + "|" +err + "\n";
            fs.writeFileSync(__dirname + '/ms/' + city + '.txt', str, {flag: 'a'});
        } else if (response.statusCode !== 200){
            // console.log("statusCode: ", response.statusCode);
            // console.log(url + "|" + response.statusCode);
            // return;
            str = prefix +  "|" + response.statusCode + "\n";
            fs.writeFileSync(__dirname + '/ms/' + category + '.txt', str, {flag: 'a'});
        } else {
            let $ = cheerio.load(html);
            let $terms = $($('.shop-list ul li'));
            for (let i = 0; i < $terms.length; i++){
                let $item =  $($terms[i]);
                let link = $item.find(".pic a").attr("href");
                let title = $item.find(".txt .tit a h4").text().trim();
                let atitle = $item.find(".txt .tit a").attr("title").trim();
                let addr = $item.find(".tag-addr .addr").text().trim();
                let tag = "";
                if ($item.find(".tag-addr a") && $item.find(".tag-addr a").length > 1) {
                    tag = $( $item.find(".tag-addr a")[1]).find(".tag").text().trim()
                }

                if (atitle) {
                    title = atitle;
                }

                let $comment = $($item.find(".comment"));


                let rank = $comment.find("span").attr("class");
                if (rank) {
                    rank = rank.split(" ");
                    if (rank && rank.length > 1) {
                        rank =  rank[1];
                    }
                }
                if (!rank) {
                    rank = "";
                }

                let review_num = $comment.find(".review-num b").text();
                if (!review_num) {
                    review_num = "";
                }
                let mean_price = $comment.find(".mean-price b").text();
                if (!mean_price) {
                    mean_price = "";
                }


                let $comment_list = $($item.find(".comment-list span"));
                let kw = "";
                let hj = "";
                let service = "";
                if ($comment_list.length > 0) {
                    kw = $($comment_list[0]).find("b").text();
                }

                if ($comment_list.length > 1) {
                    hj =  $($comment_list[1]).find("b").text();
                }

                if ($comment_list.length > 2) {
                    service = $($comment_list[2]).find("b").text();
                }


                str = prefix  + "|" + title + "|" + rank + "|" + review_num + "|" + mean_price + "|" + tag + "|" + addr + "|" + kw + "|" + hj + "|" + service + "|" + link + "|" + url + "\n";
                console.log(str)
                fs.writeFileSync(__dirname + '/ms/' + category + '.txt', str, {flag: 'a'});
                str = "";
            }
        }
        if (current_page <= city_size) {
            current_page++;
            getJianshengPage();
        }
    });
}



