// GLOBAL VARIABLES --------------------------------

// Authentication

// CJ
var cjToken = '7n2qy7a10660seaf3d810dakkz';
var pid = '9210517';

// Pepperjam
var pepperjamToken = 'e1deaf5846796c4dd695310fb106b90e88062719f020c91ca2294664ae232cae';
var pepperjamVersion = '20120402';

// Impact
var impactSid = 'IRAjuGMMVRyi2026594W9JpB9d758Fs5C1';
var impactToken = 'fyiCcwYGdiod6GZaLvEXF.cQ4Qb.geNt';

// Webflow
var webflowToken = '5fe4061500bb0c723f15518546b6e9d3c5ee5ea6e5b32d84f7d607371353c68a';
var webflowProductCollectionId = '5eab44282ae07d9d2a95cfe4';

// Keyword queries

// CJ
var blueCreamQuery = '+jeans -shirt -hat  -beanie -bag -shoes -sweater -pants -jacket -top -tee -blouse -jacket -outerwear';
var hudsonQuery = '+jean -jacket -shirt -mask -tee -short -skirt -jumpsuit';
var zafulQuery = '+jeans -bracelet -belt';
var sheinQuery = 'jeans';
var ssenseQuery = '+jeans -size -shirt -hat -bag -shoe';
var jeansQuery = '+jeans';

// Pepperjam
var pepperjamQuery = 'jeans -shirt -jacket';

// Impact
var impactQuery = 'jeans';

// Variables

// CJ
var hudsonJeans = '4909284';
var dlJeans = '3609731'; 
var blueCream = '4484982'; 
var shein = '3773223'; 
var ssense = '2125713'; 
var warpWeft = '5110321'; 
var zaful = '4777179'; 

// Pepperjam
var bebe = '9398';
var alloy = '8355';
var blankNyc = '5939';
var evisu = '8159';
var ingridIsabel = '8936';
var jachsNyc = '8898';
var joes = '6617';
var needSupply = '8682';
var peterMillar = '9397';
var prps = '9515';
var redone = '8914';
var unionBay = '6562';

// Impact
var silverJeans = '5514';
var goop = '2340';
var taylorStitch = '2881';
var bonobos = '5736';

// URLs

// CJ
var cjGetUrl = 'https://product-search.api.cj.com/v2/product-search'
  + '?website-id=' + pid
  + '&advertiser-ids=' + hudsonJeans
  + '&keywords=' + jeansQuery
  + '&records-per-page=999'
  + '&page-number=1'
  + '&currency=usd'
  // + '&low-sale-price=15'
  // + '&high-sale-price=500'
  + '&sort-by=price';

// Impact
// https://api.pepperjamnetwork.com/20120402/publisher/creative/product?apiKey=e1deaf5846796c4dd695310fb106b90e88062719f020c91ca2294664ae232cae&format=xml&programIds=9398&keywords=jeans
var pepperjamGetUrl = 'https://api.pepperjamnetwork.com/'
  + pepperjamVersion + '/'
  + 'publisher/creative/product'
  + '?apiKey=' + pepperjamToken
  + '&format=xml'
  + '&programIds=' + peterMillar;
  + '&keywords=jeans';

// Impact
var impactGetUrl = 'https://api.impact.com/'
  + 'Mediapartners/'
  +  impactSid
  + '/Catalogs/'
  + silverJeans
  + '/Items'
  + '?Name=' + impactQuery
  + '?StockAvailability=InStock';
  // + '&AfterId=g2wAAAABaANkACdkYmNvcmVAZGIzLmltcGFjdHJhZGl1czAwMy5jbG91ZGFudC5uZXRsAAAAAm4EAAAAAIBuBAD___-famgCRkADuWJAAAAAYgCraMNq';

// Webflow
var webflowPostUrl = 'https://api.webflow.com/collections/'
 + webflowProductCollectionId
 + '/items'
var webflowGetCollectionUrl = 'https://api.webflow.com/collections/' + webflowProductCollectionId

// Headers

// CJ
var cjHeaders = {
  "Authorization": "Bearer" + " " + cjToken
};

// Webflow
var webflowHeaders = {
    "Authorization": "Bearer" + " " + webflowToken,
    "accept-version": "1.0.0",
    "Content-Type": "application/json"
}

//Impact
impactHeaders = {
  "Authorization": "Basic" + " " + Utilities.base64Encode('IRAjuGMMVRyi2026594W9JpB9d758Fs5C1:fyiCcwYGdiod6GZaLvEXF.cQ4Qb.geNt'),
  "Accept": "application/json"
}

// Options

// CJ
var cjOptions = {
    "headers" : cjHeaders,
    "method" : "GET",
};

// Pepperjam
var pepperjamOptions = {
  "method" : "GET"
};

// Impact
var impactOptions = {
  "headers" : impactHeaders,
  "method" : "GET",
  "muteHttpExceptions" : true

};

// Webflow
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
      
  // Parse
  var document = XmlService.parse(xml); 
    
  // Nav to part of tree and get values
  var products = document.getRootElement().getChild("products").getChildren();
      
  var productIterations = products.length;
  
  // Loop through values
  for (var i = 0; i < productIterations; i++) {
    // Create object and extract attribute values
    var product = {
      "item-id" : "not-in-webflow",
      "name" : products[i].getChild("name").getValue().replace(/[,.']/g,'').replace('/','').replace('Mens', '').replace('Womens', '').replace('Girls', '').split(' | ')[0], // .split(' in ')[0] for blueCream // .split(' | ')[0] for dl1961
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
  var xml = UrlFetchApp.fetch(pepperjamGetUrl, pepperjamOptions).getContentText();
         
  // Parse
  var document = XmlService.parse(xml);
  
  Logger.log(document);
    
  var products = [];
        
  // Nav to part of tree and get values
  var products = document.getRootElement().getChild("data").getChildren; // xml
  // products = document.data.map(dataItem => {return dataItem}); // json

  Logger.log(products);
        
  var productIterations = products.length;
  
  // Loop through values
  for (var i = 0; i < productIterations; i++) {
    // Create object and extract attribute values
    var product = {
      "item-id" : "not-in-webflow",
      "name": products[i].name.replace(/[,.']/g,'').replace('/','').replace('Mens', '').replace('Womens', '').replace('Girls', '').replace('Joes', '').split(' in ')[0].split(' Size ')[0],
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
  var extraFilteredOutput = removeDuplicates (filteredOutput, "name");
            
 // Headings in the column order that you wish the table to appear.
 var headings = ['item-id', 'name', 'price', 'buy', 'image', 'gender'];
 var outputRows = [];

 // Loop through each member
 extraFilteredOutput.forEach(function(output) {
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
function getImpactProducts() {
  
  // Product data array
  var output = [];
  
  // Fetch data
  var json = UrlFetchApp.fetch(impactGetUrl, impactOptions).getContentText();
    
  // Parse
  var document = JSON.parse(json); //parse
  
  Logger.log(document);
  
  var products = [];
        
  // Nav to part of tree and get values
  products = document.Items.map(dataItem => {return dataItem});

  Logger.log(products);
        
  var productIterations = products.length;
  
  // Loop through values
  for (var i = 0; i < productIterations; i++) {
    // Create object and extract attribute values
    var product = {
      "item-id" : "not-in-webflow",
      "name": products[i].Name,
      "price" : products[i].CurrentPrice,
      "buy" : products[i]['Url'],
      "image" : products[i]['ImageUrl'],
      "gender" : products[i]['Gender'],
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
   var sheet = ss.getActiveSheet();
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
      
   // Check if rate limit has been hit
   if (product.message == 'Rate limit hit') {
     return
   }
   
   // Store product ID
   var productId = JSON.parse(product)["_id"];
      
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
