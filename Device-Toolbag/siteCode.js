pageCounter.staticCounter = 1;

var urlString = "https://www.ifixit.com/api/2.0/categories";
var obj = JSON.parse(httpGet(urlString));

var numImgShown = 5;
var array = (getLastKeys(obj)).split(",");
var imageArray = [];

loadPage(1);



function nextPage()
{
    var list = document.getElementById("ImageList");
    list.parentNode.removeChild(list);

    pageCounter.staticCounter++;
   
    loadPage(pageCounter.staticCounter);
}

function loadPage(page)
{
    var start = (page-1) * numImgShown;
    var end = start + numImgShown;

    for(var i=start; i<array.length && i<end; i++)
    {
        imageArray[i-start] = new ImageObject(array[i], urlString);        
    } 

    createImageList(imageArray, "imageDiv");
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
  
    var list = document.createElement("dl");
    list.id = "ImageList";

    for(var i=0; i<array.length; i++)
    {
       var img = document.createElement("img");
       img.src = array[i].imageUrl;

       var des =  document.createTextNode(array[i].catName);
       var term = document.createElement("dt")
       var elem = document.createElement("dd");

       term.appendChild(des);
       elem.appendChild(img);
       list.appendChild(term);
       list.appendChild(elem);
    }

    var listDiv = document.getElementById(divId);
    listDiv.appendChild(list);
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


