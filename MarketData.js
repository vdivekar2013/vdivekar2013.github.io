define('MarketData',['FOInstrumentStore','jquery'],function(foInstrumentStore,$) {
	this.logResults = function(json) {
		console.log((new Date()).toLocaleTimeString() + ' In callback ' + JSON.stringify(json));
	};
	var legendArray = [];
	return {
		'call' : function() {
			var foArray = foInstrumentStore.getArray();
			if(foArray.length == 0)
				return;
			legendArray = [];
			var headerInstrument = '';
			for (var h1 = 0; h1 < foArray.length; h1++) {
				if(headerInstrument != foArray[h1].name) {
					headerInstrument = foArray[h1].name;
					legendArray.push(foArray[h1].name);
				}
			}
			var url = "https://www.google.com/finance/info?q=";
			for ( var i = 0; i < legendArray.length; i++)
				url = url.concat('NSE' + ':' + legendArray[i] + ',');
			$.ajax({
				url : url,
				dataType : "jsonp",
				async : false,
				jsonpCallback : "logResults",
				// Work with the response
			    success: function( data ) {
			    	console.log((new Date()).toLocaleTimeString() + ' In Success ' + JSON.stringify(data)); // server response
			    	var outputStr = '';
					if (data != undefined && data instanceof Array) {
						for ( var i = 0; i < data.length; i++) {
							var id = data[i].e.concat(':').concat(data[i].t);
							console.log('id = ' + id);
							for ( var j = 0; j < legendArray.length; j++) {
								var legend = 'NSE' + ':' + legendArray[j];	
								if (legend.toUpperCase() == id.toUpperCase()) {
								outputStr += legendArray[j] + ' : ' + data[i].l_fix + ' ';
									console.log('outputstr ----' + outputStr);
									break;
								}
							}
						}
					}
					$('#span1').text(outputStr);
					$('#span2').text(outputStr);
			    }
			});
		}
	};
});
