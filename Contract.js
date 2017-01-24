define('Contract',['jquery'],function($) {
	this.logResults = function(json) {
		console.log((new Date()).toLocaleTimeString() + ' In callback ');
	};
	var successCallback = undefined;
	var self = this;
	return {
		'getValueArray' : function() {
	    	var array = new Array();
			var count = 0;
			for(var key in self) {
				if(self[key] instanceof Number) {
					array[count] = { 'Symbol' : key, 'LotSize' : self[key] };
					count++;
				}
			}
			return array;
		},
		'getKeyArray' : function() {
	    	var array = new Array();
			var count = 0;
			for(var key in self) {
				if(self[key] instanceof Number) {
					array[count] = key;
					count++;
				}
			}
			return array;
		},
		'delete' : function(key) {
			if(typeof(key) == 'string' && self[key] != undefined)
				delete this[key];
		},
		'get' : function(key) {
			if(typeof(key) == 'string' && self[key] != undefined)
				return self[key];
		},
		'call' : function(callback) {
			successCallback = callback;
			var url = "data/fo_mktlots.csv";
			$.ajax({
				url : url,
				type : 'GET',
				dataType : "text",
				async : false,
				jsonpCallback : "logResults",
				// Work with the response
			    success: function( data ) {
			    	var lineArray = data.split('\n');
			    	console.log('Line array length is ' + lineArray.length);
			    	for(var i = 0; i < lineArray.length; i++) {
			    		var fieldArray = lineArray[i].split(',');
			    		if(fieldArray.length < 3 || fieldArray[1].toUpperCase() == 'SYMBOL')
			    			continue;
			    		for(var j = 0; j < fieldArray.length; j++)
			    			if(!isNaN(fieldArray[j].trim()) && fieldArray[j].trim() != '') {
			    				self[fieldArray[1].trim()] = new Number(fieldArray[j].trim());
			    				break;
			    			}
			    	}
			    	if(successCallback != undefined)
			    		successCallback();
			    }
			});
		}
	};
});
