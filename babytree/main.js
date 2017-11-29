var http = require("http");
var request = require("request")
var cheerio = require("cheerio");
var fs = require('fs');
var replaceall = require("replaceall");
var total = 1000;
var current = 92;

function download(url, callback) {
    console.log(current + "||" + total);
    if (current > total) {
        return;
    }
    http.get(url, function (res) {
        var data = "";
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on("end", function () {
            callback(data);
        });
    }).on("error", function () {
        callback(null);
    });
}

var callback = function(data) {
    if (data) {
        //fs.writeFileSync(__dirname + '/html.txt', data, {flag: 'a'});
        var $ = cheerio.load(data);
        var $page_number = $(".page-number").text();

        var reg = /(页)/g;
        var res = '';
        var end = 0;
        res = $page_number.replace(reg, function($, $1 , $2) {
            end = $2;
            return  $;
        })

        total = $page_number.substring(1,end);
        var $search_item_area = $(".search_item_area .search_item");

        console.log(total);
        if( $search_item_area.length > 0) {
            for (let i = 0; i < $search_item_area.length; i++) {
                var $item = $($search_item_area[i]);
                var url = $item.find(".search_item_tit a").attr("href");
                var content = $item.find(".search_item_tit a span").text().trim();
                var search_item_cont = $item.find(".search_item_cont").text().trim();
                var $search_item_info = $($item.find(".search_item_info"));
                var search_category_href = "http://www.babytree.com/" + $search_item_info.find(".search_category").attr("href").trim();
                var search_category = $search_item_info.find(".search_category").text().trim();
                var user = $search_item_info.find("a").eq(1).text().trim();
                var user_href = $search_item_info.find("a").eq(1).attr("href").trim();

                var search_num = $search_item_info.find(".search_num").text().trim();
                var search_date = $search_item_info.find(".search_date").text().trim();


                var str_print = url + "&&" + content + "&&" + search_item_cont + "&&" + search_category + "&&" + search_category_href + "&&" + user + "&&" + user_href + "&&" + search_num + "&&" + search_date;

                console.log(str_print);
                console.log("=================");
                fs.writeFileSync(__dirname + '/类似母乳.txt', str_print + "\n", {flag: 'a'});
            }
            current++;
        }

        cra();
    } else {
        console.log("error")
    };
};


var cra = function () {
    var url = "http://www.babytree.com/s.php?q=%e7%b1%bb%e4%bc%bc%e6%af%8d%e4%b9%b3&c=ask&cid=0&range=&pg=" + current;
    console.log(url);
    download(url, callback);
}

cra();







