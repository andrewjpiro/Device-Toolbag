var draggableOptions={
	droppables: $('gearbag'),
	
        onDrop:function(elem, droppable, event)
	{
		if(droppable)
		{
		     droppable.addClass('dropped');
	             var deviceName = elem.getFirst().id;
		     elem.clone().inject(droppable, 'top');
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
	}
};


function makeListDraggable()
{
	$$('.draggable').each(function(item){
 
	item.addEvent('mousedown', function(event) {
		event.stop();
 		var item = this;
		var clone = this.clone()
			.setStyles(this.getCoordinates())
	       		.setStyles({'position': 'absolute'})	
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
		     	        item.clone().inject(droppable, 'bottom');
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
			}
		}); 
 
		drag.start(event); // start the event manual
	});
     });
}
