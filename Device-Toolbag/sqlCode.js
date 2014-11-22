/* SQLCode.js
 *
 * This file contains all the functions and creates any objects
 * needed to run the sqlDatabase. This includes functions that
 * load or empty the gearbag.
 */

/////////////////////////////////
////Database Setup Functions/////
/////////////////////////////////

var sqlDB = new MooSQL({
	dbName: 'deviceLog',

        dbVersion: '1.0',

    	dbDesc:'Log for devices placed in gear bag'
});


function callback(t, r)
{
}

function startUpDB(){
	sqlDB.exec("CREATE TABLE IF NOT EXISTS deviceLog(deviceName TEXT, deviceURL, TEXT)", callback);

	sqlDB.findA('deviceLog', populateGearbag);
}

//////////////////////////////////
////Database 'Work' Functions/////
//////////////////////////////////

function addToDatabase(deviceName, deviceURL)
{
	var insertObject = {'deviceName' : deviceName, 
		'deviceURL' : deviceURL};
	

        sqlDB.insert('deviceLog', insertObject, callback);
	console.log(deviceName, "added to deviceLog");
}

function clearDatabase()
{
	sqlDB.exec("DELETE FROM deviceLog", callback);
        console.log("clearing database");
	emptyGearbag();	
}

//////////////////////////////////
//////Gearbag functions///////////
//////////////////////////////////

function populateGearbag(transaction, result)
{
    if(result)
    {
	for(var i = 0; i<result.rows.length; i++)
	{
	  
	   var storedDev = document.createElement('div');
	   var des = document.createTextNode(result.rows.item(i).deviceName); 
    	   var image = document.createElement('img');
	       image.src = result.rows.item(i).deviceURL;
	       image.addClass("deviceImage");
	       
	       storedDev.appendChild(image);	
	       storedDev.appendChild(des);
	       storedDev.inject($('gearbag'), 'bottom');
           
	}
    }	    

}

function emptyGearbag()
{
     $('gearbag').getChildren().each(function(dev)
      {
	      if(dev.getFirst())
	      	dev.dispose();
      });
}

