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
				return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
			}
		}
		return num.toFixed(digits).replace(rx, "$1");
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
					+ foInstrument.name
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
				<th>Instrument</th>\
				<th>Type</th>\
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
			// Form the table header - start
			var headerArray = [];
			var headerInstrument = '';
			for (var h1 = 0; h1 < foArray.length; h1++) {
				if(headerInstrument != foArray[h1].name) {
					headerArray.push('Price');
					headerInstrument = foArray[h1].name;
					headerArray.push(foArray[h1].name);
				}
			}
			headerArray.push('Total');
			// Form the table header - end

			// Fill the profit and loss values - start
			var valueArray = [];
			for(var h3 = 0; h3 < 20; h3++) {
				var rowArray = [];
				headerInstrument = '';
				var centralStrike,down20Percent,twoPercent,currentPrice;
				var totalPL = 0,grandTotal = 0;
				for (var h2 = 0; h2 < foArray.length; h2++) {
					if(headerInstrument != foArray[h2].name) {
						centralStrike = foArray[h2].centralStrike;
						down20Percent = centralStrike - centralStrike * 20 / 100;
						twoPercent =  centralStrike * 2 / 100;
						currentPrice = down20Percent + twoPercent * h3;
						if(headerInstrument != '')
							rowArray.push(totalPL);
						rowArray.push(currentPrice);
						totalPL = 0;
						headerInstrument = foArray[h2].name;
					}
					totalPL += profitOrLoss(foArray[h2].action,foArray[h2].type,foArray[h2].strikePrice,currentPrice,foArray[h2].price,foArray[h2].lotSize);
					grandTotal += totalPL;
				}
				rowArray.push(totalPL);
				rowArray.push(grandTotal);
				valueArray.push(rowArray);
			}
			var headDiv = '';
			for(var k=0; k < headerArray.length; k++) {
				headDiv += '<th class="text-center">' + headerArray[k] + '</th>';
			}
			var rowDiv = '';
			for(var m=0; m < valueArray.length; m++) {
				var cellDiv = '';
				var lineArray = valueArray[m];
				for(var n=0; n < lineArray.length; n++) {
					cellDiv += '<td class="text-right">'
						+ lineArray[n]
						+ '</td>';
				}
				rowDiv += '<tr>' + cellDiv + '</tr>';
			}
			tableDiv = '<table id="outputTable"\
				class="table table-bordered table-condensed table-striped">\
				<thead>\
				<tr class="info">' +
				headDiv +
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