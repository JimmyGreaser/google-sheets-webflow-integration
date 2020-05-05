// GLOBAL VARIABLES --------------------------------

// Authentication
var cjToken = '7n2qy7a10660seaf3d810dakkz';
var pid = '9210517';
var webflowToken = '5fe4061500bb0c723f15518546b6e9d3c5ee5ea6e5b32d84f7d607371353c68a';
var webflowProductCollectionId = '5eab44282ae07d9d2a95cfe4';

// Keyword queries
var kQuery1 = '+jeans-denim';
var kQuery2 = '+jeans -size -shirt -hat -beanie';

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
  + '&records-per-page=10'
  + '&currency=usd'
  + '&high-sale-price=500'
  + '&low-sale-price=60'
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




// FUNCTIONS ---------------------------------------

// Create function menu on open
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('API Menu')
      .addItem('Import CJ Products','getCJProducts')
      .addSeparator()
      .addItem('Create Webflow Items', 'postSheetToWebflow')
      .addToUi();
}

// AFFILIATE MARKETPLACE IMPORTS ------------------

// Import products from CJ and write to Google Sheets. Query products through the global variable - cjGetUrl.
function getCJProducts() {
  
  // Product data array
  var output = [];
  
  // Fetch data
  var xml = UrlFetchApp.fetch(cjGetUrl, cjOptions).getContentText();
  
  Logger.log(xml);
    
  // Parse
  var document = XmlService.parse(xml); //parse
    
  // Nav to part of tree and get values
  var products = document.getRootElement().getChild("products").getChildren();
    
  // Filter duplicate products by image URL
  
  
  var productIterations = products.length;
  
  // Loop through values
  for (var i = 0; i < productIterations; i++) {
    // Create object and extract attribute values
    var product = {
      "fields" : {
      "item-id" : "not-in-webflow",
      "name": products[i].getChild("name").getValue(),
      "price" : products[i].getChild("price").getValue(),
      "buy" : products[i].getChild("buy-url").getValue(),
      "image" : products[i].getChild("image-url").getValue(),
      "gender" : "EDIT",
      }
    }
    // Push object to output array
    output.push(product);
 }
        
 // Headings in the column order that you wish the table to appear.
 var headings = ['item-id', 'name', 'price', 'buy', 'image', 'gender'];
 var outputRows = [];

 // Loop through each member
 output.forEach(function(output) {
   // Add a new row to the output mapping each header to the corresponding member value
   outputRows.push(headings.map(function(heading) {
     return output['fields'][heading] || '';
   }));
 });
  
 var outputIterations = outputRows.length;
    
 // Write to sheets at first blank row
 for (var i = 0; i < outputIterations; i++) {
   var ss = SpreadsheetApp.getActive();
   var sheet = ss.getSheetByName("product-sheet");
   sheet.appendRow(outputRows[i]);
 }
  
 Logger.log('Import successful');
  
};


// Pepperjam/Ascend import


// Impact import


// Update from affiliate market data







// WEBFLOW -------------------------------
 

// Post Google Sheets data to Weblow product collection
function postSheetToWebflow() {
  
  // Product data array
  var output = [];
  
 // Get sheet data
 var sheet = SpreadsheetApp.getActiveSheet().getDataRange().getValues();
 
 // Remove header
 sheet.splice(0,1);
  
 var spliceIterations = sheet.length;
  
  // Remove rows with item-id !== not-in-webflow
  // Any product with a valid item-id is already in Webflow and should be removed to avoid duplicates
  while(spliceIterations--) {
    
   if (sheet[spliceIterations][0] !== 'not-in-webflow') {
    sheet.splice(spliceIterations,1);
   }
    
  };
 
 var sheetIterations = sheet.length;
  
 // Loop through values
 // Webflow schema is name, slug, _archived, _draft, price, buy, image, gender, featured - will change if you update Webflow CMS
 for (var i = 0; i < sheetIterations; i++) {
   // Create object and extract attribute values
   var product = {
     "fields" : {
     "name": sheet[i][1],
     "slug": sheet[i][1].replace(/\s+/g, '-').replace(/,/g, '').toLowerCase(),
     "_archived": false,
     "_draft": false,
     "price" : sheet[i][2],
     "buy" : sheet[i][3],
     "image" : sheet[i][4],
     "gender" : sheet[i][5],
     "featured" : false
     }
   }
   // Push object to output array
   output.push(product);
 }
  
 Logger.log(output.length);
    
 var outputIterations = output.length;  
 var ss = SpreadsheetApp.getActiveSheet().getDataRange().getValues(); 
 ss.splice(0,1);
 var ssIterations = ss.length;

 // Loop through payload to post to Webflow then retrieve newly created id and write to correct row in Google Sheet
 for (var i = 0; i < outputIterations; i++) {
   var postWebflowOptions = {
    "headers" : webflowHeaders,
    "method" : "post",
    "payload" : JSON.stringify(output[i]),
    "muteHttpExceptions" : true
   };
  
   // Store new item data
   var product = UrlFetchApp.fetch(webflowPostUrl, postWebflowOptions);
   
   Logger.log(product);
   
   // Store product ID
   var productId = JSON.parse(product)["_id"];
   
   Logger.log(productId);
   
   // Find correct row and write product ID to first column
   
   var outputReference = i;
   
   for (j = 0; j < ssIterations; j++) {
     if(ss[j][3] == output[Math.trunc(outputReference)]['fields']['buy']){
       SpreadsheetApp.getActiveSheet().getRange('A' + (j+2)).setValue(productId);
     }
   }
 }
};









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