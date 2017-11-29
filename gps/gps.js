/**
 * http://www.dianping.com/[city]
 */
let fs = require("fs");
let cheerio = require('cheerio');
let request = require('request');
var googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyAz_ZGrYRaCFiSZvvxw0I7_vg_cMudf0uQ'
});

let rows = null;
let idx = 0;

fs.readFile(__dirname + "/gps.txt", "utf8", function(err, data){
    if (err) {
        console.log(err);
        return;
    }
    rows = data.split("\n");
    getGPS();
});

function getGPS() {
    if (idx >= rows.length) {
        return;
    }
    let row  = rows[idx];
    let addr = row.split("|")[0];
    addr = addr.replace(/\s/g, "");
    addr = encodeURIComponent(addr);

    googleMapsClient.geocode({
        address: addr
    }, function(err, response) {
        if (!err) {
            console.log(response.json.results);
        }
    });
}



