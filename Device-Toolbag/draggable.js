/* draggable.js
 *
 * This file contains all the code needed for the drag and
 * drop funcitonality of the device list.
 */

function makeListDraggable()
{
	$$('.draggable').each(function(item){
 
	item.addEvent('mousedown', function(event) {
		event.stop();
 		var item = this;
		var clone = this.clone()
			.setStyles(this.getCoordinates())
	       		.setStyles({'position': 'absolute', 'opacity': 0.7})	
			.inject(document.body);
 
		var drag = clone.makeDraggable({
			droppables: $('gearbag'),
	
        		onDrop:function(elem, droppable, event)
			{
			  if(droppable)
			  {	
		     	      droppable.addClass('dropped');
			      var inBag = false;
			      droppable.getChildren().each(function(dev)
		                {
				    var child = dev.getFirst();
				    if(child)
			      	    {
					if(child.src == elem.getFirst().src)
						      inBag = true;
				    }
			        });

			      if(!inBag)
			      {
			        var deviceName = item.id;
				var deviceUrl = item.getFirst().src;
				addToDatabase(deviceName, deviceUrl);
				var  itemClone = item.clone();
				itemClone.removeClass('draggable');
		     	        itemClone.inject(droppable, 'bottom');
			      }
			  } 
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
			   $('gearbag').removeClass('blue');
			},
			onCancel: function(elem)
			{
			   elem.dispose();
			}
		}); 
 
		drag.start(event);
	});
     });
}
