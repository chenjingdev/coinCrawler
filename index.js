var sheet_ = SpreadsheetApp.getActiveSpreadsheet();
var price_sheet = sheet_.getSheetByName("price");

function exchangeRate() {
  var response = UrlFetchApp.fetch('https://quotation-api-cdn.dunamu.com/v1/forex/recent?codes=FRX.KRWUSD');
  var json = response.getContentText();
  var data = JSON.parse(json);
  var ratio = Number(data[0].basePrice);

  return ratio;
}

function upDateTime() {
  var date = Utilities.formatDate(new Date(), "GMT+9:00", "hh:mm:ss");

  return date;
}

function meta() {
  var data = getCoinData('https://api.metaverse2.com/api/v1.0/metatokenTrade/saleList?page=1&sale_price_sort=ASC');
  var price = data.data[0].sale_price;

  setCoinData(2,price);
}

function gst() {
  var data = getCoinData('https://www.mexc.com/api/platform/market/spot/deals?symbol=GST_USDT');
  var price = data.data.data[0].p;

  setCoinData(3,price);
}

function gmt() {
  var data = getCoinData('https://www.mexc.com/api/platform/market/spot/deals?symbol=STEPN_USDT');
  var price = data.data.data[0].p;

  setCoinData(4,price);
}

function sol() {
  var data = getCoinData('https://api.binance.com/api/v1/ticker/price');
  var price = '';
  
  for(var i=0; i < data.length; i++) {
    if(data[i].symbol === 'SOLUSDT') {
      price = data[i].price;
    }
  }

  if(price === '') {
    return
  }

  setCoinData(5,price);
}

function getCoinData(fetchUrl) {
  var response = UrlFetchApp.fetch(fetchUrl, {'muteHttpExceptions': true});
  var json = response.getContentText();
  return JSON.parse(json);
}

function setCoinData(line, price) {
  price_sheet.getRange('B'+line).setValue(parseFloat(price));
  price_sheet.getRange('C'+line).setValue(Number(price)*exchangeRate());
  price_sheet.getRange('D'+line).setValue(upDateTime());
}


function copyCoinData() {
  var history_sheet = sheet_.getSheetByName("history");
  var line = history_sheet.getRange("A1").getValue() + 3;

  if (line >= 4320) { 
    history_sheet.deleteRow(3); 
  }

  history_sheet.getRange('A'+line).setValue("=if(ISBLANK(B"+line+"),,1)")
  price_sheet.getRange('D2').copyTo(history_sheet.getRange('B'+line), SpreadsheetApp.CopyPasteType.PASTE_VALUES, false);
  price_sheet.getRange('B2').copyTo(history_sheet.getRange('C'+line), SpreadsheetApp.CopyPasteType.PASTE_VALUES, false);
  price_sheet.getRange('C2').copyTo(history_sheet.getRange('D'+line), SpreadsheetApp.CopyPasteType.PASTE_VALUES, false);
  price_sheet.getRange('B3').copyTo(history_sheet.getRange('E'+line), SpreadsheetApp.CopyPasteType.PASTE_VALUES, false);
  price_sheet.getRange('C3').copyTo(history_sheet.getRange('F'+line), SpreadsheetApp.CopyPasteType.PASTE_VALUES, false);
  price_sheet.getRange('B4').copyTo(history_sheet.getRange('G'+line), SpreadsheetApp.CopyPasteType.PASTE_VALUES, false);
  price_sheet.getRange('C4').copyTo(history_sheet.getRange('H'+line), SpreadsheetApp.CopyPasteType.PASTE_VALUES, false);
  price_sheet.getRange('B5').copyTo(history_sheet.getRange('I'+line), SpreadsheetApp.CopyPasteType.PASTE_VALUES, false);
  price_sheet.getRange('C5').copyTo(history_sheet.getRange('J'+line), SpreadsheetApp.CopyPasteType.PASTE_VALUES, false);
}

function reload() {
  meta();
  gst();
  gmt();
  sol();
  exchangeRate();
  copyCoinData();
}
