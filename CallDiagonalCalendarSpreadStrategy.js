define('CallDiagonalCalendarSpreadStrategy',['StoreArray','FOInstrumentStore','FOInstrument','Contract','InstrumentData','jquery'],function(storeArray,foInstrumentStore,foInstrument,contract,instrumentData,$) {
	var instrumentValue;
	var manageValueFields = function() {
		if(instrumentValue == undefined) return;
		var nearIndex = $('#strategy-content').find('select#near-call-strike').prop('selectedIndex');
		var farIndex = $('#strategy-content').find('select#far-call-strike').prop('selectedIndex');
		var nearExpiryDate = instrumentValue.futures.value[0].expiryDate;
		var farExpiryDate = instrumentValue.futures.value[1].expiryDate;
		var nearCallArray = instrumentValue.options.value[nearExpiryDate].CE;
		var farCallArray = instrumentValue.options.value[farExpiryDate].CE;
		var nearCallValue = nearCallArray[nearCallArray.length-1-nearIndex].close;
		var farCallValue = farCallArray[farCallArray.length-1-farIndex].close;
		$('#strategy-content').find('input#near-call-value').val(nearCallValue);
		$('#strategy-content').find('input#far-call-value').val(farCallValue);
		console.log('near index ' + nearIndex + ' far index ' + farIndex + ' near value ' + nearCallValue + ' far value ' + farCallValue);
		if(nearCallValue != 0) {
			var ratio = (nearCallValue - farCallValue) / nearCallValue * 100;
			$('#strategy-content').find('input#ratio').val(ratio.toFixed(2));
		}
	};
	var updateStrikeList = function(value) {
		instrumentValue = value;
		//console.log('instrument value is ' + JSON.stringify(instrumentValue));
		var expiryData = instrumentValue.futures.value[0].expiryDate;
		var callArray = instrumentValue.options.value[expiryData].CE;
		//console.log('array value is ' + JSON.stringify(callArray));
		console.log('length of call array is '+ callArray.length);
		$('#strategy-content').find('select#near-call-strike').empty();
		for(var i=callArray.length-1; i >= 0; i--) {
			$('#strategy-content').find('select#near-call-strike').append($('<option>', { 
		        value: callArray[i].strikePrice,
		        text : callArray[i].strikePrice 
		    }));
		}
		$('#strategy-content').find('select#far-call-strike').empty();
		for(var j=callArray.length-1; j >= 0; j--) {
			$('#strategy-content').find('select#far-call-strike').append($('<option>', { 
		        value: callArray[j].strikePrice,
		        text : callArray[j].strikePrice 
		    }));
		}
		manageValueFields();
	};
	
	$('#strategy-content').on('change','select',function() {
		manageValueFields();
	});

	return {
		'show' : function() { 
			$('#strategy-content').empty();
			$('#strategy-content').html('<div class="form-group row">\
					<label class="sr-only">Call Sell:</label>\
					<div class="col-md-5">\
					<select class="form-control" id="near-call-strike"\
					placeholder="Near Call Strike"/>\
					</div>\
					<div class="col-md-7">\
					<input type="number" class="form-control" id="near-call-value"\
					placeholder="Call Sell Price">\
					</div>\
					</div>\
					<div class="form-group row">\
					<label class="sr-only">Call Buy:</label>\
					<div class="col-md-5">\
					<select class="form-control" id="far-call-strike"\
					placeholder="Far Call Strike"/>\
					</div>\
					<div class="col-md-7">\
					<input type="number" class="form-control" id="far-call-value"\
					placeholder="Call Buy Price">\
					</div>\
					</div>\
					<div class="form-group row">\
					<label class="col-md-5">Ratio:</label>\
					<div class="col-md-7">\
					<input type="number" class="form-control" id="ratio"\
					placeholder="Call Ratio" readonly>\
					</div>\
					</div>');
		},
		'process' : function(foStore,exchange,id,name,lotSize,centralStrike,tickSize) {
			var nearCallStrike = $('#strategy-content').find('select#near-call-strike').val();
			var farCallStrike = $('#strategy-content').find('select#far-call-strike').val();
			var nearCallValue = $('#strategy-content').find('input#near-call-value').val();
			var farCallValue = $('#strategy-content').find('input#far-call-value').val();
			var foInst1 = new foInstrument(exchange,id,name,'Call Option',nearCallStrike,'Sell',nearCallValue,lotSize,centralStrike,true,tickSize);
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
			var foInst2 = new foInstrument(exchange,id2,name,'Call Option',farCallStrike,'Buy',farCallValue,lotSize,centralStrike,true,tickSize);
			foStore.add(id2,foInst2);
		},
		'postProcess' : function(strageyType) {
		},
		'refresh' : function(instrument) {
			instrumentValue = undefined;
			instrumentData.getInstrument(instrument,updateStrikeList);
		}
	}
});