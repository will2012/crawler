var http = require("https");
var request = require("request")
var cheerio = require("cheerio");
var fs = require('fs');
var replaceall = require("replaceall");
var total = 1000;
var current = 1;
// var categories = JSON.parse(fs.readFileSync('./getAllCategories.json', 'utf8')).categories;
// console.log(categories);
// for (let i = 0; i < categories.length; i++) {
//     var item = categories[i];
//     var print_str = item[0] + "&&" + item[1] + "&&" + item[2] + "&&" + item[3] + "\n";
//     fs.writeFileSync(__dirname + '/getAllCategories.txt', print_str, {flag: 'a'});
// }



// it should be read from a json in the end
// var config = {
//     nameId: ,
//     pageUrlHead: ,
//     pageUrlTail: ,
//     rankUrlHead: ,
//     rankUrlTail: ,
// }

// Utility function that downloads a URL and invokes
// callback with the data.
function download(url, callback) {
    console.log(current + "||" + total);
    if (current > total) {
        return;
    }
    http.get(url, function(res) {
        var data = "";
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on("end", function() {
            callback(data);
        });
    }).on("error", function() {
        callback(null);
    });
}
var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

var callback = function(data) {
    if (data) {
        var $ = cheerio.load(data);
        var $li = $(".s-result-list li");
        if( $li.length > 0) {
            for (let i = 0; i < $li.length; i++) {
                var $item = $($li[i]);
                var title = $item.find(".s-color-twister-title-link h2").text();
                var url = $item.find(".a-link-normal").attr("href");
                var price = 0;
                var discount = 0;
                if ($item.find(".a-color-price").length == 1) {
                    price =  $item.find(".a-color-price").text();
                } else {
                    price = $item.find(".a-color-price").eq(0).text();
                    discount = $item.find(".a-color-price").eq(1).text();
                }
                price = replaceall("￥", "1", price);
                var print_str = title + "&&" + price + "&&" + discount + "&&" + url + "\n";
                console.log(print_str)
                console.log("================");
                if (discount != 0 && discount < 10) {
                    fs.writeFileSync(__dirname + '/book_info.txt', print_str, {flag: 'a'});
                }
            }
            current++;
        }

        cra();
    } else {
        console.log("error")
    };
};


var cra = function () {
    var url = config.pageUrlHead + current + config.pageUrlTail;
    console.log(url);
    download(url, callback);
}

cra();







