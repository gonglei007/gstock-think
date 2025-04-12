/**
 * Created by gonglei on 18/1/27.
 */

var http = require('http');
var fs = require('fs');

var httpUtil = module.exports;

/**
 * http get request
 * */
httpUtil.httpGet = function(host, port, path, cb){

    var options = {
        hostname: host,
        port: port,
        path: path,
        method: 'GET'
    };

    //console.log(options);
    var timeoutEventId;
    var req = http.request(options, function(res) {
        //console.log("statusCode: ", res.statusCode);
        //console.log("headers: ", res.headers);

        var str = '';
        res.on('data', function (chunk) {
            clearTimeout(timeoutEventId);
            //console.log('BODY:: ' + chunk);
            str += chunk;
        });

        res.on('end', function(){
            //console.log(str);
            if(cb != null){
                cb(null, str);
            }
        });
    });

    req.end();

    req.on('error', function(e) {
        clearTimeout(timeoutEventId);
        console.log('problem with request: ' + e.message);
        if(cb != null){
            cb(e, null);
        }
    });

    req.on('timeout', function(e) {
        req.abort(e);
    })

    req.on('end', function () {

    });

    timeoutEventId = setTimeout(function(){
        req.emit('timeout',{message:'have been timeout...'});
    },3000);
};

httpUtil.httpPost = function(host, port, path, msg, cb){
    var reqdata = msg;
    var msgBuffer;
    if (typeof (reqdata) == 'object'){
        reqdata = JSON.stringify(msg);
        msgBuffer = new Buffer(JSON.stringify(msg));
    } else {
        msgBuffer = new Buffer(msg);
    }

    var options = {
        hostname: host,
        port: port,
        path: '/'+path+'?',
        method: 'POST',
        headers: {
            "Content-Type":'application/json',
            "Content-Length":msgBuffer.length
        }
    };
    var timeoutEventId;
    //console.log('options::', JSON.stringify(options), reqdata);
    var request = http.request(options, function(response){
        //console.log('STATUS: ' + response.statusCode);
        response.setEncoding('utf8');

        var rspdata='';
        response.on('data', function(chunk){
            //console.log('chunk::', chunk);
            rspdata += chunk;
        });

        response.on('end', function(){
            clearTimeout(timeoutEventId);
            //console.log('http请求返回结果:', rspdata);
            //rspdata = JSON.parse(rspdata);
            if(cb != null){
                cb(null, rspdata);
            }
        });
    });

    request.write(reqdata, 'utf8');
    request.end();

    request.on('error', function(err){
        clearTimeout(timeoutEventId);
        console.log('problem with request: ', err.message, JSON.stringify(options));
        if(cb != null){
            cb(err, JSON.stringify({code: 500, msg: "http post error:" + path}));
        }
        throw err;
    });

    request.on('timeout', function(e) {
        request.abort(e);
    });

    timeoutEventId = setTimeout(function(){
        request.emit('timeout',{message:'have been timeout...'});
    },3000);

};

//
httpUtil.download = function(url, path, cb){
    http.get(url, function(res){
        var file = fs.createWriteStream(path);
        var stream = res.pipe(file);
        stream.on('finish', function () {
            if(cb != null){
                cb(null);
            }
        });
    });}
