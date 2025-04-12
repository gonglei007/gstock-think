// 这是一个nodejs脚本。

// 加载一个excel表格。表格在"../data/"目录下，名字是"stock.xlsx", 表格中，第一行是标题栏，第一列是股票代码。

// 遍历表格行，拉取计算A列股票（中国A股股票代码）的当日成交量/市值，填入E列（交易比例）。

// 从这个服务获取股票信息：https://qt.gtimg.cn/

// 回写存储Excel表格。

const ExcelJS = require('exceljs');
const fetch = require('node-fetch');
const path = require('path');

async function processStockData() {
  // 1. 初始化工作簿
  const workbook = new ExcelJS.Workbook();
  const filePath = path.resolve(__dirname, '../data/stock.xlsx');

  try {
    // 2. 读取Excel文件
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.worksheets[0];

    // 3. 遍历行数据（从第2行开始）
    for (let rowIndex = 2; rowIndex <= worksheet.rowCount; rowIndex++) {
      const row = worksheet.getRow(rowIndex);
      const stockCode = row.getCell(1).value?.toString().trim();
      const stockName = row.getCell(2).value?.toString().trim(); // 股票名称

      // 跳过无效代码
      if (!stockCode || !/^[0|3|6]\d{5}$/.test(stockCode)) {
        row.getCell(5).value = '无效代码';
        continue;
      }

      try {
        // 4. 获取股票数据
        const prefix = stockCode.startsWith('6') ? 'sh' : 'sz';
        const response = await fetch(`https://qt.gtimg.cn/q=${prefix}${stockCode}`, {
          headers: { Referer: 'https://gu.qq.com/' }
        });
        
        const dataText = await response.text();
        const segments = dataText.split('~');

        // 5. 解析关键数据
        if (segments.length < 40) {
          throw new Error('数据字段不足');
        }

        // 在解析数据时增加
        //const stockName = segments[1]; // 股票名称

        const price = segments[3]; // 最新价
        const volume = parseFloat(segments[6]) * 10000 * 100;  // 万手→股
        const marketCap = parseFloat(segments[45]) * 1e4;       // 亿→万
//        const volume = parseFloat(segments[38]) * 10000 * 100;  // 万手→股
        // const marketCap = parseFloat(segments[39]) * 1e4;       // 亿→万
        // 成交额 = 成交量 * 最新价
        const turnover = parseFloat(segments[57]); // 万
        // const turnover = volume * price / 10000; // 成交额(万)
        // 日涨跌比
        const dRatio = parseFloat(segments[32]); // 日涨跌比

        //console.log(`[${stockCode}-${stockName}] 成交价: ${price}, 成交量（股）: ${volume}，成交额（万）: ${turnover}, 市值（万）: ${marketCap}`);
        
        // 6. 计算并写入
        if (marketCap > 0) {
          const ratio = (turnover / marketCap).toFixed(6);
          row.getCell(5).value = parseFloat(ratio);
        } else {
          row.getCell(5).value = '市值无效';
        }
        // 四舍五入到小数点后两位
        // row.getCell(5).value = parseFloat(row.getCell(5).value).toFixed(2);
        

        console.log(`[${stockCode}-${stockName}] 成交价: ${price}, 成交比例: ${(row.getCell(5).value*100).toFixed(2)}%，单日涨跌幅: ${dRatio}%\n`);

      } catch (error) {
        console.error(`[${stockCode}] 处理失败:`, error.message);
        row.getCell(5).value = '数据错误';
      }

      // 7. 请求延迟（防止频率限制）
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // 8. 保存修改后的文件
    await workbook.xlsx.writeFile(filePath);
    console.log('处理完成，文件已保存');

  } catch (error) {
    console.error('全局错误:', error);
  }
}

// 执行主函数
processStockData();