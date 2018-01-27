/**
 * Created by gonglei on 18/1/27.
 */
var xlsx = require('node-xlsx');
var fs = require('fs');
var stock = require('tushare').stock;
var async = require('async');

var requestInterval = null;
var industryData = require('./data/json/S_Finance_bankuai_sinaindustry.json');
var stockXlsxData = [];
var industryXlsxData = [['tag', 'value']];

async.eachSeries(
    Object.keys(industryData),
    function(industry, callback){
        var industryRowData = [industry, industryData[industry]];
        industryXlsxData.push(industryRowData);
        stockXlsxData.push({name:industry, data: []});
        requestInterval = setInterval(function(){
            //
            clearInterval(requestInterval);
            console.log('request data:' + industry);
            ///*
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
            //*/
        }, 1000);
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

