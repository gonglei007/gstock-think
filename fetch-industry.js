var xlsx = require('node-xlsx');
var fs = require('fs');
var stock = require('tushare').stock;

var industryData = require('./S_Finance_bankuai_sinaindustry.json');
var industryXlsxData = [['tag', 'value']];
for(var industry in industryData){
    console.log(industry);
    var industryRowData = [industry, industryData[industry]];
    industryXlsxData.push(industryRowData);
    var options = {
        tag: industry.tag
    };
    stock.getSinaClassifyDetails(options).then(function(data){
        //console.log(data);
    });
}
//var data = [[1,2,3],[true, false, null, 'sheetjs'],['foo','bar',new Date('2014-02-19T14:30Z'), '0.3'], ['baz', null, 'qux']];
var buffer = xlsx.build([{name: "行业分类", data: industryXlsxData}]); // returns a buffer
fs.writeFile('industry.xlsx', buffer, function(err){
    if(err){
        console.log(err);
    }
});
