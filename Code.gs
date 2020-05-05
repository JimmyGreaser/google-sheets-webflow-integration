function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('API Menu')
      .addItem('Import CJ Products','getCJProducts')
      .addSeparator()
      .addItem('Create Webflow Items', 'createWebflowItem')
      .addSeparator()
      .addItem('Clear Sheet', 'clearData')
      .addToUi();
}
 
// GLOBAL VARIABLES --------------------------------

// Authentication
var cjToken = '7n2qy7a10660seaf3d810dakkz';
var pid = '9210517';
var webflowToken = '5fe4061500bb0c723f15518546b6e9d3c5ee5ea6e5b32d84f7d607371353c68a';
var webflowProductCollectionId = '5eab44282ae07d9d2a95cfe4';

// Keyword queries
var kQuery1 = '+jeans-denim';
var kQuery2 = '+jeans-size';

// CJ Variables
var hudsonJeans = '4909284'; // Working
var dlJeans = '3609731'; // Not working
var blueCream = '4484982'; // Working
var shein = '3773223'; // Working
var ssense = '2125713'; // Working
var warpWeft = '5110321'; // Not working
var zaful = '4777179'; // Working

// URLs
var cjGetUrl = 'https://product-search.api.cj.com/v2/product-search'
  + '?website-id=' + pid
  + '&advertiser-ids=' + ssense
  + '&keywords=' + kQuery2
  + '&serviceable-area=us'
  + '&records-per-page=100'
  + '&currency=usd'
  + '&high-sale-price=500'
  + '&sort-by=price';
var webflowPostUrl = 'https://api.webflow.com/collections/'
 + webflowProductCollectionId
 + '/items'
var webflowGetCollectionUrl = 'https://api.webflow.com/collections/' + webflowProductCollectionId

// Headers
var cjHeaders = {
  "Authorization": "Bearer" + " " + cjToken
};
var webflowHeaders = {
    "Authorization": "Bearer" + " " + webflowToken,
    "accept-version": "1.0.0",
    "Content-Type": "application/json"
}

// Options
var cjOptions = {
    "headers" : cjHeaders,
    "method" : "GET",
};
var webflowGetOptions = {
   "headers" : webflowHeaders,
   "method" : "get",
   "muteHttpExceptions" : true
}

// Product data array
var output = [];









// FUNCTIONS ---------------------------------------

// Import products from CJ and write to Google Sheets. Query products through the global variable - cjGetUrl.
function getCJProducts() {
  
  // Fetch data
  var xml = UrlFetchApp.fetch(cjGetUrl, cjOptions).getContentText();
    
  // Parse
  var document = XmlService.parse(xml); //parse
    
  // Nav to part of tree and get values
  var products = document.getRootElement().getChild("products").getChildren();
  
  // Loop through values
  for (var i = 0; i < products.length; i++) {
    // Create object and extract attribute values
    var product = {
      "fields" : {
      "item-id" : "replace",
      "name": products[i].getChild("name").getValue(),
      // "slug": products[i].getChild("name").getValue().replace(/\s+/g, '-').replace(/,/g, '').toLowerCase(),
      // "_archived": false,
      // "_draft": false,
      "price" : products[i].getChild("price").getValue(),
      "buy" : products[i].getChild("buy-url").getValue(),
      "image" : products[i].getChild("image-url").getValue(),
      "gender" : "EDIT",
      "advertiser" : products[i].getChild("advertiser-name").getValue()
      // "featured" : false
      }
    }
    // Push object to output array
    output.push(product);
 }
        
 // Headings in the column order that you wish the table to appear.
 var headings = ['item-id', 'name', 'price', 'buy', 'image', 'gender', 'advertiser'];
 var outputRows = [];

 // Loop through each member
 output.forEach(function(output) {
   // Add a new row to the output mapping each header to the corresponding member value.
   outputRows.push(headings.map(function(heading) {
     return output['fields'][heading] || '';
   }));
 });
    
 // Write to sheets at first blank row
 for (var i = 0; i < outputRows.length; i++) {
   // Add the headings - delete this next line if headings not required
   // outputRows[i].unshift(headings);
   Logger.log(outputRows[i]);
   var ss = SpreadsheetApp.getActive();
   var sheet = ss.getSheetByName("product-sheet");

   sheet.appendRow(outputRows[i]);
 }
  
 Logger.log('Import successful');
  
};


// Pepperjam/Ascend import


// Impact import


// Update from affiliate market data



 

// Post Google Sheets data to Weblow product collection
function postSheetToWebflow() {
  
 // Get sheet data
  

// Loop through payload to post to Webflow then retrieve newly created id and write to correct row in Google Sheet
for (var i = 0; i < dataArray.length; i++) {
  var postWebflowOptions = {
    "headers" : webflowHeaders,
    "method" : "post",
    "payload" : JSON.stringify(dataArray[i]),
    "muteHttpExceptions" : true
   };
 
  
 // Store new item data
 var product = UrlFetchApp.fetch(webflowPostUrl, postWebflowOptions);
  
 // Store product ID
 var productId = JSON.parse(product)["_id"];
  
 // Find correct row and write product ID to item-id column
                                 
 SpreadsheetApp.getActive
 var ss = SpreadsheetApp.getActiveSpreadsheet();
 var sheet = ss.getActiveSheet();
 var dataRange = sheet.getDataRange();
 var values = dataRange.getValues();

 for (var i = 0; i < values.length; i++) {
   var row = "";
   for (var j = 0; j < values[i].length; j++) {     
     if (values[i][j] == buy) {
       row = values[i][j+1];
       Logger.log(row);
       Logger.log(i); // This is your row number
    }
   }    
  }  
 };    
  // Copy new item-id to Google Sheet row
  
}









// Runs when a user changes the selection in a spreadsheet
function onEdit() {
  Logger.log('Hello');
}


function updateWebflowItem() {
  // Update products in Webflow
  
}

function deleteWebflowItem() {
 // Delete products in Webflow
  
}


function clearData() {
  
 var ss = SpreadsheetApp.getActiveSpreadsheet();
 var sheet = ss.getActiveSheet();
 var dataRange = sheet.getDataRange();
  
  Logger.log(ss);
  Logger.log(sheet);
  Logger.log(dataRange);
  
  // clear out the matches and output sheets
  var lastRow = ss.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2,1,lastRow-1,1).clearContent();
  }
}


//ScriptApp.newTrigger('getGoogleAnalyticsReport')
//  .timeBased()
//  .atHour(1)
//  .everyDays(1) // Frequency is required if you are using atHour()
//  .create();