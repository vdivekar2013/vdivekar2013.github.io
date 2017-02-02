define('Contract',['ContractData','jquery'],function(ContractData,$) {
	this.logResults = function(json) {
		console.log((new Date()).toLocaleTimeString() + ' In callback ');
	};
	var successCallback = undefined;
	var self = this;
	var getBhavCopy = function() {
		var url = "data/fo_bhav.csv";
		$.ajax({
			url : url,
			type : 'GET',
			dataType : "text",
			async : false,
			jsonpCallback : "logResults",
			// Work with the response
		    success: function( data ) {
		    	var lineArray = data.split('\n');
		    	console.log('bhavcopy Line array length is ' + lineArray.length);
		    	var symbol = '',firstStrike,tickSize;
		    	for(var i = 0; i < lineArray.length; i++) {
		    		var fieldArray = lineArray[i].split(',');
		    		if(fieldArray.length < 15 || fieldArray[1].toUpperCase() == 'SYMBOL')
		    			continue;
		    		var conData = self[fieldArray[1].trim()];
		    		if(fieldArray[0].trim() == 'OPTIDX' || fieldArray[0].trim() == 'OPTSTK') {
	    				if((conData.centralStrike == null) && (conData.settlementPrice < Number(fieldArray[3].trim())))
	    					conData.centralStrike = Number(fieldArray[3].trim());
		    			if(symbol == fieldArray[1].trim()){
		    				if(tickSize == 0) {
		    					tickSize = Number(fieldArray[3].trim()) - firstStrike;
		    					conData.tickSize = tickSize;
		    				}
		    			} else {
		    				symbol = fieldArray[1].trim();
		    				firstStrike = Number(fieldArray[3].trim());
		    				tickSize = 0;
		    			}
		    		}
	    			if(!isNaN(fieldArray[9].trim()) && (fieldArray[0].trim() == 'FUTIDX' || fieldArray[0].trim() == 'FUTSTK')) {
	    				var settlementPrice = Number(fieldArray[9].trim());
	    				if(conData.settlementPrice == null)
	    					conData.settlementPrice = settlementPrice;
	    			}
		    	}
		    	if(successCallback != undefined)
		    		successCallback();
		    }
		});
	}
	return {
		'getValueArray' : function() {
	    	var array = new Array();
			var count = 0;
			for(var key in self) {
				if(self[key] instanceof Object) {
					array[count] = self[key];
					count++;
				}
			}
			return array;
		},
		'getKeyArray' : function() {
	    	var array = new Array();
			var count = 0;
			for(var key in self) {
				if(self[key] instanceof Object) {
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
			    				self[fieldArray[1].trim()] = new ContractData(fieldArray[1].trim(),Number(fieldArray[j].trim()),null,null,null);
			    				break;
			    			}
			    	}
			    	getBhavCopy();
			    }
			});
		}
	};
});
