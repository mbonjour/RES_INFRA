$(function() {
	console.log("Loading beer");
	function loadBeer() {
		$.getJSON( "api/beer", function( beer ) {
			console.log(beer);  
			var items = [];
			$.each( beer, function( key, val ) {
			      	items.push( "<li id='" + key + "'>" + val + "</li>" );
			});
		 	var message = "No beer loaded";
			
			message = beer.name + ", first brewed : " + beer.first_brewed;	
			
			$(".test").text(message);
		});
	};
	loadBeer();
	setInterval(loadBeer, 2000);
})
