/**
 * Created by gonglei on 18/1/28.
 */

var xlsx = require('node-xlsx');
var fs = require('fs');
var stock = require('tushare').stock;
var async = require('async');
var industry = require('./model/industry');
var neteaseApi = require('./neteaseApi');

// 通过本地的股票代码数据，拉取股票历史市值。
var fetchRemoteData = function(){
    industry.eachStocksForAll(
        function(stock, callback){
            var code = stock['symbol'];
            var stockDataPath = './data/csv/stocks/' + code + '.csv';
            var start = 20080101;
            var end = 20180101;
            ///*
            neteaseApi.downloadHistory(code, start, end, stockDataPath, function(err){
                if(err != null){
                    console.log(err);
                }
                console.log("download:" + code + ' to:' + stockDataPath);
                callback(err);
            });
            //*/
            /*
            console.log('download:' + code + ' to:' + stockDataPath + ' start:' + start + ' end:' + end);
            process.nextTick(function(){
                callback(null);
            });
            */
        },
        function(err){
            if(err != null){
                console.log(err);
            }
            console.log('==== Finish ==== ');
        }
    );
}

/*
 neteaseApi.downloadHistory('600105', 20080101, 20180101, 'test.csv', function(err){
     console.log(err);
 });
*/

fetchRemoteData();