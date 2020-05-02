function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('API Menu')
      .addItem('Import CJ Products','getCJProducts')
      .addToUi();
}

function getCJProducts() {
  var output = [];
  
  // Get CJ Products
  
  // Write to Google Sheets
               
  // Authentication
  var cjAuthenticationToken = "7n2qy7a10660seaf3d810dakkz";
  var pid = '9210517';
  
  // Brand identifiers
  var hudsonJeans = '4909284';
  
  // URL
  var url = 'https://product-search.api.cj.com/v2/product-search'
  + '?website-id=' + pid
  + '&advertiser-ids=4909284'
  + '&keywords=jeans'
  + 'serviceable-area=us'
  + 'records-per-page=100';
  
  // Headers
  var headers = {
    "Authorization": "Bearer" + " " + cjAuthenticationToken
  };

  // Options
  var options = {
    "headers" : headers,
    "method" : "GET",
  };
  
  // Fetch
  var xml = UrlFetchApp.fetch(url, options).getContentText();
  
  // Parse
  var document = XmlService.parse(xml); //parse
    
  // Nav to part of tree and get values
  var products = document.getRootElement().getChild("products").getChildren();
  
  for (var i = 0; i < products.length; i++) {
    // Create object and extract attribute values
    var product = {
      "fields" : {
      "name": products[i].getChild("name").getValue(),
      "slug": products[i].getChild("name").getValue().replace(/\s+/g, '-').replace(/,/g, '').toLowerCase(),
      "_archived": false,
      "_draft": false,
      "price" : products[i].getChild("price").getValue(),
      "buy" : products[i].getChild("buy-url").getValue(),
      "image" : products[i].getChild("image-url").getValue()
      }
    }
    // Push current object to output array
    output.push(product);
 }
    
 // Headings in the column order that you wish the table to appear.
 var headings = ['item-id', 'name', 'price', 'buy', 'image'];
 var outputRows = [];

 // Loop through each member
 output.forEach(function(output) {
   // Add a new row to the output mapping each header to the corresponding member value.
   outputRows.push(headings.map(function(heading) {
     return output['fields'][heading] || '';
   }));
 });
  
 // Write to sheets
 if (outputRows.length) {
   // Add the headings - delete this next line if headings not required
   outputRows.unshift(headings);
   SpreadsheetApp.getActiveSheet().getRange(1, 1, outputRows.length, outputRows[0].length).setValues(outputRows);
 } 
}


// Will need to handle getting all data from Google Sheets
function createWebflowItem() {
  // Post new products to Webflow
  // Prepare to post to Webflow
 var webflowAuthenticationToken = "5fe4061500bb0c723f15518546b6e9d3c5ee5ea6e5b32d84f7d607371353c68a";
 var productCollectionId = "5eab44282ae07d9d2a95cfe4";
 
 // URL
 var webflowPostProduct = 'https://api.webflow.com/collections/'
 + productCollectionId
 + '/items'
 var webflowGetProduct = 'https://api.webflow.com/collections/' + productCollectionId
 
 // Headers
 var webflowHeaders = {
    "Authorization": "Bearer" + " " + webflowAuthenticationToken,
    "accept-version": "1.0.0",
    "Content-Type": "application/json"
 }
 
 // Options
 var getWebflowOptions = {
   "headers" : webflowHeaders,
   "method" : "get",
   "muteHttpExceptions" : true
 }
 
// Logger.log(UrlFetchApp.fetch(webflowGetProduct, getWebflowOptions));

// Loop through payload to post to Webflow then retrieve newly created id and write to correct row in Google Sheet
for (var i = 0; i < output.length; i++) {
  var postWebflowOptions = {
    "headers" : webflowHeaders,
    "method" : "post",
    "payload" : JSON.stringify(output[i]),
    "muteHttpExceptions" : true
   };
 
 var webflowItem = UrlFetchApp.fetch(webflowPostProduct, postWebflowOptions);
 var productId = JSON.parse(webflowItem)["_id"];
 var buy = JSON.parse(webflowItem)["buy"];
                                 
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

function updateWebflowItem() {
  // Update products in Webflow
  
}

function deleteWebflowItem() {
 // Delete products in Webflow
  
}


function clearData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Data');
  
  // clear out the matches and output sheets
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2,1,lastRow-1,1).clearContent();
  }
}


//ScriptApp.newTrigger('getGoogleAnalyticsReport')
//  .timeBased()
//  .atHour(1)
//  .everyDays(1) // Frequency is required if you are using atHour()
//  .create();




