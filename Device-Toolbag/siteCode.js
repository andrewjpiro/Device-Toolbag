pageCounter.staticCounter = 1;

var urlString = "https://www.ifixit.com/api/2.0/categories";
var obj = JSON.parse(httpGet(urlString));

var numImgShown = 5;
var array = (getLastKeys(obj)).split(",");
var imageArray = [];                              
var totalPages = (array.length/numImgShown); //possibly +1 if remainder...
var total = document.createTextNode(totalPages);
document.getElementById("total").appendChild(total);

loadPage(1);

var draggableOptions={
	droppables: $('gearbag'),
	
        onDrop:function(elem, droppable, event)
	{
		if(droppable)
		     droppable.addClass('dropped');
	},

	onEnter: function(elem, droppable)
	{
		droppable.addClass('blue');
	},

	onLeave: function(elem, droppable)
	{
		droppable.removeClass('blue');
	},
	onComplete: function(elem)
	{
		elem.dispose();
	}
};


function makeListDraggable()
{
	$$('.draggable').each(function(item){
 
	item.addEvent('mousedown', function(event) {
		event.stop();
 
		var clone = this.clone()
			.setStyles(this.getCoordinates())
	       		.setStyles({'position': 'absolute'})	
			.inject(document.body);
 
 
		var drag = clone.makeDraggable(draggableOptions); 
 
		drag.start(event); // start the event manual
	});
     });
}


function goToPage()
{
    var page = parseInt(document.getElementById("page").value);
    loadPage(page);
}

function nextPage()
{
   
    loadPage(pageCounter.staticCounter+1);
}

function prevPage()
{
    if(pageCounter.staticCounter > 1)
    	loadPage(pageCounter.staticCounter-1);
}


function loadPage(page)
{
    pageCounter.staticCounter = page;	
    $("page").value=page;	 

    $$('div.draggable').each(function(image)
	{
	   image.dispose();
        });

    var start = (page-1) * numImgShown;
    var end = start + numImgShown;

    for(var i=start; i<array.length && i<end; i++)
    {
        imageArray[i-start] = new ImageObject(array[i], urlString);        
    } 

    createImageList(imageArray, "imageDiv");
    makeListDraggable();
}

////////////////////////////////////
////////Objects/"Classes"///////////
////////////////////////////////////

/* ImageObject
 * - Takes a category name and base url as args.
 * - Makes appropriate api call with args. 
 * - Stores thumbnail url in public variable imageUrl.
 */

function ImageObject(catName, url)
{
      var obj = JSON.parse(httpGet(url + '/' + catName));
      this.catName = catName;
      this.imageUrl = obj.image.thumbnail;     
}
function pageCounter()
{
}


/////////////////////////////////////
//////Stand alone funtions///////////
/////////////////////////////////////

/* createImageList
 * - Takes an array of ImageObjects & divId.
 * - Creates html img element for each ImageObject.
 * - Appends list of elements to desired div.
 */

function createImageList(array, divId)
{
  
    var listDiv = document.getElementById(divId);


    for(var i=0; i<array.length; i++)
    {  
       var des =  document.createTextNode(array[i].catName);
		    
       var img = document.createElement("img");
       img.src = array[i].imageUrl;

       
       var div = document.createElement("div");
       div.addClass("draggable");

       div.appendChild(des);
       div.appendChild(img);

       listDiv.appendChild(div);
    }
}

/* getLastKeys
 * -Takes a JSON object.
 * -Returns the keys from key-value pairs only if the value is not
 *  another JSON object with more key-value pairs.
 * -Essentially only returns names of objects within categories & not 
 *  the general categories themselves.
 */

function getLastKeys(object)
{
    var result = "";
    for(var key in object)
    {
	if(object.hasOwnProperty(key))
	{ 
	     
	     if(!getKeys(object[key]))
	     {
		    result += key + ",";
	     }
	     else
             { 
		 result += getLastKeys(object[key]);
	     }     
	}
    }
    return result;
}

/* getKeys()
 * - Takes a JSON object as an argument.
 * - Returns all keys for key-value pairs.
 * - Returns 0 if no key-value pairs exist.   
 */


function getKeys(object)
{
    var i = 0;
    var result = "";
    for(var key in object)
    {
	    i++;
	    if(object.hasOwnProperty(key))
	        result += key;
    }
    if(i == 0)
	   return 0;
    else
	   return result;
}

/* httpGet
 * - Takes url as an argument.
 * - Returns response for calling GET on url.
 */

function httpGet(theUrl)
{
	var xmlHttp = null;

	xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", theUrl, false);
	xmlHttp.send(null);
	return xmlHttp.responseText;
}


