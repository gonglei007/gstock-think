/**
 * Created by gonglei on 18/1/27.
 */
var xlsx = require('node-xlsx');
var fs = require('fs');
var stock = require('tushare').stock;
var async = require('async');

var requestInterval = null;
var industryData = require('./data/json/S_Finance_bankuai_sinaindustry.json');

///远程拉取（延迟1s，免得被开放平台认为是爬虫）
var fetchRemoteData = function(){
    async.eachSeries(
        Object.keys(industryData),
        function(industry, callback){
            requestInterval = setInterval(function(){
                //
                clearInterval(requestInterval);
                console.log('request data:' + industry);
                var options = {
                    tag: industry
                };
                stock.getSinaClassifyDetails(options).then(function(data){
                    //console.log(data);
                    fs.writeFile('./data/json/stocks/'+industry + '.json', JSON.stringify(data), function(err){
                        if(err){
                            console.log(err);
                        }
                        callback(err);
                    });
                });
            }, 1000);
        },
        function(err){
            if(err){
                console.log(err);
            }
            else{
            }
        }
    );
}

var stockXlsxData = [];
//var industryXlsxData = [['tag', 'stock', 'name']];

// 从本地数据生成数据表
var fetchLocalData = function(){
    async.eachSeries(
        Object.keys(industryData),
        function(industry, callback){
            var industryData = require('./data/json/stocks/'+industry+'.json');
            //console.log(industryData.data);
            var stockData = [['stock', 'name']];
            async.eachSeries(
                industryData.data,
                function(stock, callback){
                    //console.log(stock);
                    var stockRow = [stock['symbol'], stock['name']];
                    stockData.push(stockRow);
                    /*
                     var industryRowData = [industry, industryData[industry]];
                     industryXlsxData.push(industryRowData);
                     */
                    callback(null);
                },
                function(err){
                    stockXlsxData.push({name:industry, data: stockData});
                    callback(err);
                }
            );

        },
        function(err){
            if(err){
                console.log(err);
            }
            else{
                var buffer = xlsx.build(stockXlsxData); // returns a buffer
                fs.writeFile('./data/xlsx/stocks.xlsx', buffer, function(err){
                    if(err){
                        console.log(err);
                    }
                });
            }
        }
    );

}

//fetchRemoteData();
fetchLocalData();

