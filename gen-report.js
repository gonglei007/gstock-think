/**
 * Created by gonglei on 18/1/29.
 */

var Excel = require('exceljs');
var fs = require('fs');
var async = require('async');
var dateFormat = require('dateformat');
var industry = require('./model/industry');

var genReport = module.exports;

/**
 * 生成行业市值变化报告。
 * */
genReport.generateMoneyReport = function(){
    var reportData = [];    //example: [['日期', '分类A', '市值A', '分类B', '市值B']]
    industry.eachStocksForAll(
        function(stock, callback){
            var code = stock['symbol'];
            var stockDataPath = './data/csv/stocks/' + code + '.csv';
            var tableSheets = xlsx.parse(stockDataPath);
            if(tableSheets != null && tableSheets.length > 1){
                var sheet = tableSheets[0];
                var sheetData = sheet['data'];
                for(var rowIndex in sheetData){
                    // 算当月市值平均值；或者选取一天的随机值。
                }
            }
            process.nextTick(function(){
                callback(null);
            });
        },
        function(err){
            if(err != null){
                console.log(err);
            }
            var buffer = xlsx.build([{name: '资金走向分析', data: reportData}]); // returns a buffer
            fs.writeFile('./data/xlsx/industry.xlsx', buffer, function(err){
                if(err){
                    console.log(err);
                }
                console.log('==== Finish ==== ');
            });
        }
    );
}

// 按日期存储
var statisticData = {}; // {date1:{tag1: value, tag2: value}, date2:{tag1: value, tag2: value}}

/**
 * 生成行业统计数据。
 * 字段：时间，股票，Tag（行业），市值。
 * */
genReport.genIndustryStatistic = function(){
    var headData = ['日期'];
    // 遍历行业
    industry.eachIndustries(
        function(industryItem, icallback){
            var tagName = industry.getIndustryNameByTag(industryItem);
            console.log(industryItem + ':' + tagName);
            headData.push(tagName);
            // 先统计一个行业中的所有数据。
            industry.eachStocksByIndustry(
                industryItem,
                function(stock, callback){
                    // 获取股票数据：时间、股票、市值
                    process.nextTick(function(){
                        var code = stock['symbol'];
                        var stockDataPath = './data/csv/stocks/20180101-20180201/' + code + '.csv';
                        console.log(stockDataPath);
                        var workbook = new Excel.Workbook();
                        workbook.csv.readFile(stockDataPath)
                            .then(function(worksheet) {
                                for(var rowIndex =2; rowIndex <= worksheet.rowCount; ++rowIndex){
                                    var sDate = worksheet.getCell('A'+rowIndex).value;
                                    //console.log(sDate);
                                    var date = new Date(sDate);
                                    sDate = dateFormat(date, "yyyy-mm-dd");
                                    //console.log(sDate);
                                    if(statisticData[sDate] == null || statisticData[sDate] == undefined){
                                        statisticData[sDate] = {};
                                    }
                                    if(statisticData[sDate][industryItem] == null || statisticData[sDate][industryItem] == undefined){
                                        statisticData[sDate][industryItem] = 0;
                                    }
                                    var sValue = Number(worksheet.getCell('N'+rowIndex).value) / 100000000;
                                    statisticData[sDate][industryItem] += sValue;
                                    //console.log(statisticData[sDate][industryItem]);
                                }
                                // use workbook
                                //var tableSheets = xlsx.readFile(stockDataPath);
                                //var tableSheets = xlsx.parse(fs.readFileSync(stockDataPath));
                                /*
                                worksheet.forEach(function(row){
                                    //statisticData[]
                                    console.log(row.value);
                                    //console.log(worksheet.getCell('A2').value);
                                });
                                */
                                callback(null);
                            }
                        );
                    });
                },
                function(err){

                    icallback(err);
                }
            );
        }, function(err){
            if(err){
                console.log(err);
            }
            var options = {
                filename: './StockStatistic.xlsx',
                useStyles: true,
                useSharedStrings: true
            };
            //var workbook = new Excel.stream.xlsx.WorkbookWriter(options);
            var workbook = new Excel.Workbook();
            var worksheet = workbook.addWorksheet('StockStatistic');
            worksheet.addRow(headData);
            for(var sDate in statisticData){
                var rowData = [];
                rowData.push(sDate);
                var stockData = statisticData[sDate];
                var yAxis = 0;
                for(var tag in stockData){
                    var sValue = stockData[tag];
                    //rowData.push(yAxis);
                    rowData.push(sValue);
                    yAxis += 10;
                }
                worksheet.addRow(rowData);
            }
            //worksheet.commit();
            workbook.xlsx.writeFile('StockStatistic-201801.xlsx', {});
            console.log(statisticData);
        }
    );
}

genReport.genReportByDate = function(){
    var reportData = [['日期']];
    var year = startYear = 2008;
    var endYear = 2018;
    async.whilst(
        function() { return year >= startYear && year <= endYear; },
        function(callback) {

            var month = 1;
            async.whilst(
                function() { return month <= 12; },
                function(callback) {

                    setTimeout(function() {
                        var stockDate = new Date(year + '-' + month);
                        reportData.push([stockDate]);
                        console.log(stockDate);
                        month++;
                        callback(null, month);
                    }, 10);
                },
                function (err, n) {
                    // 5 seconds have passed, n = 5
                    year++;
                    callback(null, year);
                }
            );
        },
        function (err, n) {
            // 5 seconds have passed, n = 5
            var buffer = xlsx.build([{name: '资金走向分析', data: reportData}]); // returns a buffer
            fs.writeFile('./data/xlsx/final.xlsx', buffer, function(err){
                if(err){
                    console.log(err);
                }
                console.log('==== Finish ==== ');
            });
        }
    );
}

//genReport.genReportByDate();
genReport.genIndustryStatistic();
/*
var options = {
    filename: './StockStatistic.csv',
    useStyles: true,
    useSharedStrings: true
};
var workbook = new Excel.Workbook();
//var workbook = new Excel.Workbook();
var worksheet = workbook.addWorksheet('StockStatistic');
var rowData1 = ['2011-08-08', 'slxs', 999292];
var rowData2 = ['2011-08-09', 'slx2', 999266];
worksheet.addRow(rowData1);
worksheet.addRow(rowData2);
//worksheet.commit();
workbook.xlsx.writeFile('StockStatistic.xlsx', {});
*/