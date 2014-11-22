var sqlDB = new MooSQL({
	dbName: 'deviceLog',

        dbVersion: '1.0',

    	dbDesc:'Log for devices placed in gear bag'
});


function callback(t, r)
{
}

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

function emptyGearbag()
{
     $('gearbag').getChildren().each(function(dev)
      {
	      if(dev.getFirst())
	      	dev.dispose();
      });
}

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
		
	       storedDev.appendChild(des);
	       storedDev.appendChild(image);
	       storedDev.inject($('gearbag'), 'bottom');
           
	}
    }	    

}
