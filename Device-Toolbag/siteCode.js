//////////////////////////////////////
///////Main Site Code/////////////////
//////////////////////////////////////

var urlString = "https://www.ifixit.com/api/2.0/categories";
var numImgShown = 28;

var obj = JSON.parse(httpGet(urlString)); //Get categories JSON
var array = (getLastKeys(obj)).split(","); //Make array of category names

var totalPages = Math.ceil((array.length/numImgShown));
$("total").appendChild(document.createTextNode(totalPages));

var currentPage = 1;

window.addEvent('domready', function() 
{
    startUpDB();
    loadPage(currentPage);
});

////////////////////////////////////////
//////////Paginating Functions//////////
////////////////////////////////////////

function loadPage(page)
{
    if(page < 1 || page > totalPages)
	    return;

    currentPage = page;    
    $("page").value=page; 

    $$('div.draggable').each(function(image)
	{
	   image.dispose();
        });

    var start = (page-1) * numImgShown;
    var end = start + numImgShown;
    var imageArray = [];

    for(var i=start; i<(array.length-1) && i<end; i++)
    {
        imageArray[i-start] = new ImageObject(array[i], urlString);        
    } 
    
    createImageList(imageArray, "imageDiv");
    makeListDraggable();
}


function goToPage()
{
    var page = parseInt(document.getElementById("page").value);
    loadPage(page);
}

function nextPage()
{
   
   if(currentPage < totalPages)
    loadPage(currentPage+1);
}

function prevPage()
{
    if(currentPage > 1)
    	loadPage(currentPage-1);
}
///////////////////////////////////////
///////////Objects/////////////////////
///////////////////////////////////////

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

/////////////////////////////////////
//////API Functions//////////////////
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
       img.addClass("deviceImage");

       var div = document.createElement("div");
       div.addClass("draggable");

       div.appendChild(img);       
       div.appendChild(des);
       div.id = array[i].catName;
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

//////////////////////////////////////////
///////Fullscreen functions///////////////
//////////////////////////////////////////

var fullscreen = false;

document.addEventListener("keyup", function(e) {
  if (e.keyCode == 13) {
    toggleFullscreen();
  }
}, false);

function toggleFullscreen()
{
     if(fullscreen)
     {
	exitFullscreen();
	fullscreen = false;
     }
     else
     {
	launchIntoFullscreen(document.documentElement);
	fullscreen = true;
     }	
}

function launchIntoFullscreen(element) {
  if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

function exitFullscreen() {
  if(document.exitFullscreen) {
    document.exitFullscreen();
  } else if(document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if(document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}
