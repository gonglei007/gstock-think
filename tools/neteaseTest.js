/**
 * Created by gonglei on 18/1/27.
 */
var neteaseApi = require('./neteaseApi');
var fs = require('fs');

var code = '600000';//'0601398';
/*
neteaseApi.requestHistory(code, 20160101, 20160110, function(err, data){
    fs.writeFile('test.csv', data, {encoding: 'utf8'}, function(err){
        console.log(err);
        console.log(data);
    });
});
*/
neteaseApi.downloadHistory(code, 20160101, 20160110, function(err){
    console.log(err);
});