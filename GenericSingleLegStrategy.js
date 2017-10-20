define('GenericSingleLegStrategy',['StoreArray','FOInstrumentStore','FOInstrument','Contract','Firebase','jquery'],function(storeArray,foInstrumentStore,foInstrument,contract,firebase,$) {
	return {
		'show' : function() { 
			$('#strategy-content').empty();
			$('#strategy-content').html('<div class="form-group row">\
					<label class="sr-only" for="type">Instrument Type:</label>\
					<div class="col-md-10">\
					<select class="form-control" id="type">\
					<option id="future" value="Future">Future</option>\
					<option id="call" value="Call Option">Option ( Call\
					)</option>\
					<option id="put" value="Put Option">Option ( Put )</option>\
					</select>\
					</div>\
					</div>\
					<div class="form-group row">\
					<label class="sr-only" for="strike">StrikePrice:</label>\
					<div class="col-md-6">\
					<input type="number" class="form-control" id="strike"\
					placeholder="Strike price">\
					</div>\
					</div>\
					<div class="form-group">\
					<label class="radio-inline"><input title="Buy" id="buy"\
					type="radio" name="optradio" checked>Buy</label> <label\
					class="radio-inline"><input title="Sell" id="sell"\
					type="radio" name="optradio">Sell</label>\
					</div>\
					<div class="form-group row">\
					<label class="sr-only" for="price">Price:</label>\
					<div class="col-md-8">\
					<input type="number" class="form-control" id="price"\
					placeholder="Instrument price">\
					</div>\
			</div>');
			$('#strategy-content').on('change','select#type',function() {
				var str = "";
				$("select#type option:selected").each(function() {
					str = $(this).val();
				});
				if (str == 'Future') {
					$('#strike').hide();
					$('#strike').val('100');
				} else {
					$('#strike').show();
					$('#strike').val('');
					$('#addButton').attr('disabled', 'disabled');
				}
			});
			$('#strategy-content').find('select#type').trigger('change');
		},
		'process' : function(foStore,exchange,id,name,lotSize,centralStrike,tickSize) {
			var type;
			$("select#type option:selected").each(function() {
				type = $(this).val();
			});
			var strike = type != 'Future' ? $('#strategy-content').find('input#strike').val() : '';
			var price = $('#strategy-content').find('input#price').val();
			var action;
			if ($('#strategy-content').find("#buy").prop('checked') == true)
				action = 'Buy';
			else
				action = 'Sell';
			var foInst = new foInstrument(exchange,id,name,type,strike,action,price,lotSize,centralStrike,true,tickSize);
			foStore.add(id,foInst);
		},
		'postProcess' : function(strageyType) {
			$('#strategy-content').find('input#strike').val('100');
			$('#strategy-content').find('input#strike').hide();
		},
		'refresh' : function(instrument) {
			
		}
	}
});