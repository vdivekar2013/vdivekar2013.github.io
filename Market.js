define('Market',['InstrumentStore','jquery'],function(InstrumentStore,$) {
	this.logResults = function(json) {
		console.log('In callback ' + JSON.stringify(json));
	};
	return {
		'call' : function() {
			var array = InstrumentStore.getArray();
			var url = "https://www.google.com/finance/info?q=";
			for ( var i = 0; i < array.length; i++)
				url = url.concat(array[i].id + ',');
			$.ajax({
				url : url,
				dataType : "jsonp",
				async : false,
				jsonpCallback : "logResults",
				// Work with the response
			    success: function( data ) {
			    	console.log('In Success ' + JSON.stringify(data)); // server response
					var array = InstrumentStore.getArray();
					if (data != undefined && data instanceof Array) {
						for ( var i = 0; i < data.length; i++) {
							var id = data[i].e.concat(':').concat(data[i].t);
							console.log('id = ' + id);
							for ( var j = 0; j < array.length; j++) {
								if (array[j].id.toUpperCase() == id.toUpperCase()) {
									array[j].value = data[i].l_fix;
									console.log('value = ' + array[j].value);
									break;
								}
							}
						}
						InstrumentStore.loadArray(array);
					}
			    }
			});
		}
	};
});
