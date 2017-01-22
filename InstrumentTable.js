define('InstrumentTable',['FOInstrumentStore','FOInstrument','jquery'], function(foInstrumentStore,foInstrument,$) {
	var profitOrLoss = function(action,type,strikePrice,currentPrice,price,lotSize) {
		console.log('i am here');
		if(type == 'Future') {
			if(action == 'Buy') {
				return (currentPrice - price) * lotSize;
			} else if(action == 'Sell') {
				return (price - currentPrice) * lotSize;
			}
		} else if(type == 'Call Option') {
			if(action == 'Buy') {
				if(currentPrice <= strikePrice)
					return - price * lotSize;
				else
					return ((currentPrice - strikePrice) - price) * lotSize;
			} else if(action == 'Sell') {
				if(currentPrice <= strikePrice)
					return price * lotSize;
				else
					return (price - (currentPrice - strikePrice)) * lotSize;
			}
		} else if(type == 'Put Option') {
			if(action == 'Buy') {
				if(currentPrice >= strikePrice)
					return - price * lotSize;
				else
					return ((strikePrice - currentPrice) - price) * lotSize;
			} else if(action == 'Sell') {
				if(currentPrice >= strikePrice)
					return price * lotSize;
				else
					return (price - (strikePrice - currentPrice)) * lotSize;
			}
		}
	};
	var numberFormatter = function (num, digits) {
		var si = [
			{ value: 1E18, symbol: "E" },
			{ value: 1E15, symbol: "P" },
			{ value: 1E12, symbol: "T" },
			{ value: 1E9,  symbol: "B" },
			{ value: 1E6,  symbol: "M" },
			{ value: 1E3,  symbol: "k" }
			], rx = /\.0+$|(\.[0-9]*[1-9])0+$/, i;
		for (i = 0; i < si.length; i++) {
			if (Math.abs(num) >= si[i].value) {
				return '₹ ' + (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
			}
		}
		return '₹ ' + num.toFixed(digits).replace(rx, "$1");
	};
	return {
		'show' : function() {
			var foArray = foInstrumentStore.getArray();
			console.log('instrument array length is ' + foArray.length);
			var rowDiv = '';
			$('#instrumentTable').remove();
			for(var i=0; i < foArray.length; i++) {
				var foInstrument = foArray[i];
				rowDiv += '<tr>'
					+ '<td>'
					+ (i+1)
					+ '</td>'
					+ '<td>'
					+ foInstrument.type
					+ '</td>'
					+ '<td>'
					+ foInstrument.strikePrice
					+ '</td>'
					+ '<td>'
					+ foInstrument.action
					+ '</td>'
					+ '<td>'
					+ foInstrument.price
					+ '</td>'
					+ '<td>'
					+ '<a id="delete" data-key="' + foInstrument.id + '" href="#"><span class="glyphicon glyphicon-trash"></span></a>'
					+ '</td>'
					+ '</tr>';
			}
			tableDiv = '<table id="instrumentTable"\
				class="table table-bordered table-condensed table-striped">\
				<thead>\
				<tr class="info">\
				<th>No.</th>\
				<th>Instrument Type</th>\
				<th>Strike Price</th>\
				<th>Action</th>\
				<th>Instrument Price</th>\
				<th>Delete</th>\
				</tr>\
				</thead>\
				<tbody>' +
				rowDiv +
				'</tbody>\
				</table>';
			console.log('table DIV is ' + tableDiv);
			$('#instrumentReference').append(tableDiv);
		},
		'compute' : function() {
			var foArray = foInstrumentStore.getArray();
			if(foArray.length == 0)
				return;
			$('#outputTable').remove();
			var array = foInstrumentStore.getArray();
			var foFirstInst = array[0];
			var centralStrike = foFirstInst.centralStrike;
			var down20Percent = Math.round(centralStrike - centralStrike * 20 / 100);
			var twoPercent =  Math.round(centralStrike * 2 / 100);
			var rowDiv = '';
			var currentPrice = down20Percent;
			for(var i=0; i < 20; i++) {
				var cellDiv = '';
				var total = 0;
				for(var j=0; j < array.length; j++) {
					var pfLoss = profitOrLoss(array[j].action,array[j].type,array[j].strikePrice,currentPrice,array[j].price,array[j].lotSize);
					total += pfLoss;
					cellDiv += '<td class="text-right">'
						+ numberFormatter(pfLoss,2)
						+ '</td>';
				}
				rowDiv += '<tr>'
					+ '<td class="text-right">'
					+ currentPrice
					+ '</td>'
					+ cellDiv
					+ '<td class="text-right">'
					+ numberFormatter(total,2)
					+ '</td>'
					+ '</tr>';
				currentPrice += twoPercent;
			}
			var headDiv = '';
			for(var k=0; k < array.length; k++) {
				headDiv += '<th class="text-center">' + 'Item ' + (k+1) + '</th>';
			}
			tableDiv = '<table id="outputTable"\
				class="table table-bordered table-condensed table-striped">\
				<thead>\
				<tr class="info">\
				<th class="text-center">Price</th>' +
				headDiv +
				'<th class="text-center">Total</th>' +
				'</tr>\
				</thead>\
				<tbody>' +
				rowDiv +
				'</tbody>\
				</table>';
			$('#outputReference').append(tableDiv);
		}
	};
});