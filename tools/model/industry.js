/**
 * Created by gonglei on 18/1/29.
 */
var async = require('async');

var industry = module.exports;

var industryData = require('../data/json/S_Finance_bankuai_sinaindustry.json');

industry.getIndustryNameByTag = function(tag){
    if(industryData[tag] == null || industryData[tag] == undefined){
        return "Unknown";
    }
    var values = industryData[tag].split(',');
    //console.log(values);
    if(values[1] == null || values[1] == undefined){
        return 'Error';
    }
    return values[1]

}

/**
 * 遍历行业分类
 * */
industry.eachIndustries = function(onIndustry, cb){
    async.eachSeries(
        Object.keys(industryData),
        function(industry, callback){
            if(onIndustry != null){
                onIndustry(industry, callback);
            }
            else{
                process.nextTick(function(){
                    callback(null);
                });
            }
        },
        function(err){
            if(err){
                console.log(err);
            }
            if(cb != null){
                cb(err);
            }
        }
    );

}

/**
 * 按行业遍历股票
 * */
industry.eachStocksByIndustry = function(industry, onStock, cb){
    var industryData = require('../data/json/stocks/'+industry+'.json');
    async.eachSeries(
        industryData.data,
        function(stock, callback){
            //console.log(stock);
            var stockRow = [stock['symbol'], stock['name']];
            if(onStock != null){
                onStock(stock, callback);
            }
            else{
                process.nextTick(function(){
                    callback(null);
                });
            }
        },
        function(err){
            if(err){
                console.log(err);
            }
            if(cb != null){
                cb(err);
            }
        }
    );
}

industry.eachStocksForAll = function(onStock, cb){
    industry.eachIndustries(
        function(industryItem, icallback){
            industry.eachStocksByIndustry(
                industryItem,
                function(stock, callback){
                    if(onStock != null){
                        onStock(stock, callback);
                    }
                    else{
                        callback(null);
                    }
                },
                function(err){
                    icallback(err);
                }
            );
        }, function(err){
            if(err){
                console.log(err);
            }
            if(cb != null){
                cb(err);
            }
        }
    );
}