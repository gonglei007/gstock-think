var xlsx = require('node-xlsx');
var fs = require('fs');

/*
import { stock } from 'tushare';

stock.getTodayAll().then(({ data }) => {
	console.log(data);
});
*/

var stock = require('tushare').stock;
//console.log(stock);

/*
stock.getTodayAll().then(function({data}) {
	console.log(data);
});
*/

const options1 = {
	code: '600848',
	ktype: 'week'
};
var options = {
	code: '600000', 
	ktype: 'week'
};
/*
stock.getHistory(options).then(function(data){
    console.log(JSON.stringify(data));
});
*/
/*
stock.getSinaIndustryClassified().then(function(industriesData){
    var industries = JSON.parse(industriesData.data);
    //var industries = industriesData;
    //console.log(industries);
    for(var industry in industries){
        console.log(industry);
        var options = {
            tag: industry.tag
        };
        stock.getSinaClassifyDetails(options).then(function(data){
            //console.log(data);
        });
    }
});
*/
