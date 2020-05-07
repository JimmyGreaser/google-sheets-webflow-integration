// GLOBAL VARIABLES --------------------------------

// Authentication
var cjToken = '7n2qy7a10660seaf3d810dakkz';
var pepperjamToken = 'e1deaf5846796c4dd695310fb106b90e88062719f020c91ca2294664ae232cae';
var pepperjamVersion = '20120402';
var pid = '9210517';
var webflowToken = '5fe4061500bb0c723f15518546b6e9d3c5ee5ea6e5b32d84f7d607371353c68a';
var webflowProductCollectionId = '5eab44282ae07d9d2a95cfe4';

// Keyword queries
var cjQuery1 = '+jeans-denim';
var cjQuery2 = '+jeans -size -shirt -hat -beanie';
var pepperjamQuery = 'jeans -size';

// CJ Variables
var hudsonJeans = '4909284'; // Working
var dlJeans = '3609731'; // Not working
var blueCream = '4484982'; // Working
var shein = '3773223'; // Working
var ssense = '2125713'; // Working
var warpWeft = '5110321'; // Not working
var zaful = '4777179'; // Working

// Pepperjam Variables
var bebe = '9398';

// URLs
var cjGetUrl = 'https://product-search.api.cj.com/v2/product-search'
  + '?website-id=' + pid
  + '&advertiser-ids=joined' // + zaful
  + '&keywords=' + cjQuery2
  + '&serviceable-area=us'
  + '&records-per-page=999'
  + '&page-number=6'
  + '&currency=usd'
  + '&high-sale-price=500'
  + '&low-sale-price=60'
  + '&sort-by=price';
var pepperjamGetUrl = 'https://api.pepperjamnetwork.com/'
  + pepperjamVersion + '/'
  + 'publisher/creative/product'
  + '?apiKey=' + pepperjamToken
  + '&format=json'
  // + '&programIds=' + bebe;
  + '&keywords=' + pepperjamQuery;
var impactGetUrl = '';
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
var pepperjamOptions = {
  "method" : "GET"
};
var webflowGetOptions = {
   "headers" : webflowHeaders,
   "method" : "get",
   "muteHttpExceptions" : true
};




// FUNCTIONS ---------------------------------------

// Create function menu on open
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('API Menu')
      .addItem('Import CJ Products','getCJProducts')
      .addSeparator()
      .addItem('Import Pepperjam Products', 'getPepperjamProducts')
      .addSeparator()
      .addItem('Import Impact Products', 'getImpactProducts')
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
      
  var productIterations = products.length;
  
  // Loop through values
  for (var i = 0; i < productIterations; i++) {
    // Create object and extract attribute values
    var product = {
      "item-id" : "not-in-webflow",
      "name": products[i].getChild("name").getValue().replace(/[,.]/g,'').replace('/',''),
      "price" : products[i].getChild("price").getValue(),
      "buy" : products[i].getChild("buy-url").getValue(),
      "image" : products[i].getChild("image-url").getValue(),
      "gender" : "EDIT",
    }
    // Push object to output array
    output.push(product);
 }
   
 // Filter duplicate products by image URL
 // Also consider filtering out products that share the first X characters
 var filteredOutput = removeDuplicates(output, "image");
          
 // Headings in the column order that you wish the table to appear.
 var headings = ['item-id', 'name', 'price', 'buy', 'image', 'gender'];
 var outputRows = [];

 // Loop through each member
 filteredOutput.forEach(function(output) {
   // Add a new row to the output mapping each header to the corresponding member value
   outputRows.push(headings.map(function(heading) {
     return output[heading] || '';
   }));
 });
  
 var outputIterations = outputRows.length;
    
 // Write to sheets at first blank row
 for (var i = 0; i < outputIterations; i++) {
   var ss = SpreadsheetApp.getActive();
   var sheet = ss.getSheetByName("product-sheet");
   sheet.appendRow(outputRows[i]);
 }  
};


// Import products from Pepperjam and write to Google Sheets. Query products through the global variable - pepperjamGetUrl.
function getPepperjamProducts() {
  
  // Product data array
  var output = [];
  
  // Fetch data
  var json = UrlFetchApp.fetch(pepperjamGetUrl, pepperjamOptions).getContentText();
        
  // Parse
  var document = JSON.parse(json); //parse
  
  var products = [];
        
  // Nav to part of tree and get values
  products = document.data.map(dataItem => {return dataItem});

  Logger.log(products);
        
  var productIterations = products.length;
  
  // Loop through values
  for (var i = 0; i < productIterations; i++) {
    // Create object and extract attribute values
    var product = {
      "item-id" : "not-in-webflow",
      "name": products[i].name.replace(/[,.]/g,'').replace('/',''),
      "price" : products[i].price,
      "buy" : products[i]['buy_url'],
      "image" : products[i]['image_url'],
      "gender" : "EDIT",
    }
    // Push object to output array
    output.push(product);
 }
   
 // Filter duplicate products by image URL
 // Also consider filtering out products that share the first X characters
 var filteredOutput = removeDuplicates(output, "image");
  
 Logger.log(filteredOutput.length);
          
 // Headings in the column order that you wish the table to appear.
 var headings = ['item-id', 'name', 'price', 'buy', 'image', 'gender'];
 var outputRows = [];

 // Loop through each member
 filteredOutput.forEach(function(output) {
   // Add a new row to the output mapping each header to the corresponding member value
   outputRows.push(headings.map(function(heading) {
     return output[heading] || '';
   }));
 });
  
 var outputIterations = outputRows.length;
    
 // Write to sheets at first blank row
 for (var i = 0; i < outputIterations; i++) {
   var ss = SpreadsheetApp.getActive();
   var sheet = ss.getSheetByName("product-sheet");
   sheet.appendRow(outputRows[i]);
 }
};

// Import products from Impact and write to Google Sheets. Query products through the global variable - impactGetUrl
// WAITING ON DEVELOPER ACCOUNT REVIEW
function getImpactProducts() {
  
  // Product data array
  var output = [];
  
  // Fetch data
  var json = UrlFetchApp.fetch(pepperjamGetUrl, pepperjamOptions).getContentText();
        
  // Parse
  var document = JSON.parse(json); //parse
  
  var products = [];
        
  // Nav to part of tree and get values
  products = document.data.map(dataItem => {return dataItem});

  Logger.log(products);
        
  var productIterations = products.length;
  
  // Loop through values
  for (var i = 0; i < productIterations; i++) {
    // Create object and extract attribute values
    var product = {
      "item-id" : "not-in-webflow",
      "name": products[i].name,
      "price" : products[i].price,
      "buy" : products[i]['buy_url'],
      "image" : products[i]['image_url'],
      "gender" : "EDIT",
    }
    // Push object to output array
    output.push(product);
 }
   
 // Filter duplicate products by image URL
 // Also consider filtering out products that share the first X characters
 var filteredOutput = removeDuplicates(output, "image");
          
 // Headings in the column order that you wish the table to appear.
 var headings = ['item-id', 'name', 'price', 'buy', 'image', 'gender'];
 var outputRows = [];

 // Loop through each member
 filteredOutput.forEach(function(output) {
   // Add a new row to the output mapping each header to the corresponding member value
   outputRows.push(headings.map(function(heading) {
     return output[heading] || '';
   }));
 });
  
 var outputIterations = outputRows.length;
    
 // Write to sheets at first blank row
 for (var i = 0; i < outputIterations; i++) {
   var ss = SpreadsheetApp.getActive();
   var sheet = ss.getSheetByName("product-sheet");
   sheet.appendRow(outputRows[i]);
 }
};



// WEBFLOW -------------------------------
 

// Not able to upload more than about 80 products it seems. It's a problem because it erases the item-id for all of the products it doesn't upload
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
      
   if (product.message == 'Rate limit hit') {
     return
   }
   
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


// Edit Webflow Item
function specialOnEdit(e) {
  
  // Get row and column that edit occurred on
  var row = e.range.getRow();
  var col = e.range.getColumn();
  
  // Get array of row where edit occurred
  var sht = SpreadsheetApp.getActiveSheet();
  var rng = sht.getRange(row, 1, 1, 6)
  var rangeArray = rng.getValues();
  
  var product = {
     "fields" : {
     "name": rangeArray[0][1],
     "slug": rangeArray[0][0].replace(/\s+/g, '-').replace(/,/g, '').toLowerCase(),
     "_archived": false,
     "_draft": false,
     "price" : rangeArray[0][2],
     "buy" : rangeArray[0][3],
     "image" : rangeArray[0][4],
     "gender" : rangeArray[0][5],
     "featured" : false
     }
   }
  
  // Check for item-id and post to Webflow
  if (rangeArray[0][0] !== 'not-in-webflow') {
     // Post to active cell value to Webflow
     var webflowPutUrl = 'https://api.webflow.com/collections/' + webflowProductCollectionId + '/items/' + rangeArray[0][0];
     var webflowPutOptions = {
       "headers" : webflowHeaders,
       "method" : "get",
       "payload" : JSON.stringify(product[0]),
       "muteHttpExceptions" : true
     };
     Logger.log(UrlFetchApp.fetch(webflowPutUrl, webflowPutOptions));
  }
}


// Delete is not possible, no trigger
function deleteWebflowItem() {
 // Delete products in Webflow
  
}







// ASSIST FUNCTIONS -----------------------------------

function removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
}
