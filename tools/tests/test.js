var dateFormat = require('dateformat');

var date = new Date('Thu Dec 28 2017 00:00:00 GMT+0800 (CST)');
var dateFormat = dateFormat(date, "yyyy-mm-dd");
console.log(date.getFullYear() + '-' + date.getMonth() + '-' + date.getDay());
console.log(dateFormat);