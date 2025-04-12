/**
 * Created by gonglei on 18/1/27.
 */
var httpUtil = require('./httpUtil');
var http = require('http');
var fs = require('fs');
var utf8 = require('utf8');

var neteaseApi = module.exports;

var requestUrl = 'http://quotes.money.163.com';///service/chddata.html';


//http://quotes.money.163.com/service/chddata.html?code=0000001&start=19901219&end=20150911&fields=TCLOSE;HIGH;LOW;TOPEN;LCLOSE;CHG;PCHG;VOTURNOVER;VATURNOVER
//    这里0000001指的是上证指数。注意这串数字要分0和000001两部分看。0代表sh，1代表sz。

function pad(num, n) {
    var len = num.toString().length;
    while(len < n) {
        num = "0" + num;
        len++;
    }
    return num;
}

neteaseApi.downloadHistory = function(code, start, end, path, cb){
    code = code.replace(/\D/g,'');  // 去掉非数字字符
    var url = requestUrl + '/service/chddata.html?'
        + 'code=' + pad(Number(code), 7) +  // 为了适应网易api，7位补零。
        '&start=' + start +
        '&end=' + end;// +
    httpUtil.download(url, path, cb);
}

// 请求历史数据
neteaseApi.requestHistory = function(code, start, end, cb){
    /*
    var path = '/service/chddata.html?'
        + 'code=' + code +
        '&start=' + start +
        '&end=' + end +
        'fields=MCAP';
    httpUtil.httpGet(requestUrl, 80, path, cb);
    */
    var url = requestUrl + '/service/chddata.html?'
        + 'code=' + pad(Number(code), 7) +  // 为了适应网易api，7位补零。
        '&start=' + start +
        '&end=' + end;// +
        //'fields=MCAP';
    //var file = fs.createWriteStream("test.csv");
    //url = 'http://quotes.money.163.com/service/chddata.html?code=0601398&start=20000720&end=20150508';
    console.log(url);
    http.get(url, function(res){
        console.log('STATUS: '+ res.statusCode);
        console.log('HEADERS: '+ JSON.stringify(res.headers));
        res.setEncoding('utf8');
        //console.log(response.status);
        //console.log(response.data);
        //response.pipe(file);
        //res.contentType('text');
        var rawData = '';
        res.on('data', function (chunk) {
            //console.log('BODY:: ' + chunk);
            rawData += chunk;
        });

        res.on('end', function(){
            //console.log(rawData);
            //rawData = new Buffer(rawData, 'utf8');
            //var rawData = Buffer.concat(buffer);
            if(cb != null){
                cb(null, rawData);
            }
        });
    });
}