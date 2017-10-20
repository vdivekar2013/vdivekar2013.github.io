define('CoveredCallStrategy',['StoreArray','FOInstrumentStore','FOInstrument','Contract','InstrumentData','jquery'],function(storeArray,foInstrumentStore,foInstrument,contract,instrumentData,$) {
	var updateStrikeList = function(instrumentValue) {
		//console.log('instrument value is ' + JSON.stringify(instrumentValue));
		var expiryData = instrumentValue.futures.value[0].expiryDate;
		var settlementPrice = instrumentValue.futures.value[0].settlement;
		$('#strategy-content').find('input#price').val(settlementPrice);
		var callArray = instrumentValue.options.value[expiryData].CE;
		//console.log('array value is ' + JSON.stringify(callArray));
		console.log('length of call array is '+ callArray.length);
		$('#strategy-content').find('select#call-strike').empty();
		for(var i=callArray.length-1; i >= 0; i--) {
			$('#strategy-content').find('select#call-strike').append($('<option>', { 
		        value: callArray[i].strikePrice,
		        text : callArray[i].strikePrice 
		    }));
		}
		$('#strategy-content').find('select#put-strike').empty();
		for(var j=callArray.length-1; j >= 0; j--) {
			$('#strategy-content').find('select#put-strike').append($('<option>', { 
		        value: callArray[j].strikePrice,
		        text : callArray[j].strikePrice 
		    }));
		}
	};
	return {
		'show' : function() { 
			$('#strategy-content').empty();
			$('#strategy-content').html('<div class="form-group row">\
					<label class="sr-only">Buy Price:</label>\
					<div class="col-md-10">\
					<input type="number" class="form-control" id="price"\
					placeholder="Future buy price">\
					</div>\
					</div>\
					<div class="form-group row">\
					<label class="sr-only">Call Sell:</label>\
					<div class="col-md-5">\
					<select class="form-control" id="call-strike"\
					placeholder="Call Strike"/>\
					</div>\
					<div class="col-md-7">\
					<input type="number" class="form-control" id="call-value"\
					placeholder="Call Sell Price">\
					</div>\
					</div>\
					<div class="form-group row">\
					<label class="sr-only">Put Buy:</label>\
					<div class="col-md-5">\
					<select class="form-control" id="put-strike"\
					placeholder="Put Strike"/>\
					</div>\
					<div class="col-md-7">\
					<input type="number" class="form-control" id="put-value"\
					placeholder="Put Buy Price">\
					</div>\
			</div>');
		},
		'process' : function(foStore,exchange,id,name,lotSize,centralStrike,tickSize) {
			var callStrike = $('#strategy-content').find('select#call-strike').val();
			var putStrike = $('#strategy-content').find('select#put-strike').val();
			var callValue = $('#strategy-content').find('input#call-value').val();
			var putValue = $('#strategy-content').find('input#put-value').val();
			var futurePrice = $('#strategy-content').find('input#price').val();
			var foInst1 = new foInstrument(exchange,id,name,'Future','','Buy',futurePrice,lotSize,centralStrike,true,tickSize);
			foStore.add(id,foInst1);
			var foArray = foStore.getArray();
			var keyNo = 0, found = false;
			do {
				keyNo += 1;
				found = false;
				for(var i = 0; i < foArray.length; i++) {
					if(('key' + keyNo).localeCompare(foArray[i].id) == 0) {
						found = true;
						break;
					}
				}
			} while(found == true);
			var id2 = 'key' + keyNo;
			var foInst2 = new foInstrument(exchange,id2,name,'Call Option',callStrike,'Sell',callValue,lotSize,centralStrike,true,tickSize);
			foStore.add(id2,foInst2);
			foArray = foStore.getArray();
			keyNo = 0, found = false;
			do {
				keyNo += 1;
				found = false;
				for(var i = 0; i < foArray.length; i++) {
					if(('key' + keyNo).localeCompare(foArray[i].id) == 0) {
						found = true;
						break;
					}
				}
			} while(found == true);
			var id3 = 'key' + keyNo;
			var foInst3 = new foInstrument(exchange,id3,name,'Put Option',putStrike,'Buy',putValue,lotSize,centralStrike,true,tickSize);
			foStore.add(id3,foInst3);
		},
		'postProcess' : function(strageyType) {
		},
		'refresh' : function(instrument) {
			instrumentData.getInstrument(instrument,updateStrikeList);
		}
	}
});