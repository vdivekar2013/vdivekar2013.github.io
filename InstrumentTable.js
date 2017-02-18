define('InstrumentTable',['StoreArray','FOInstrumentStore','FOInstrument','chartjs','jquery'], function(storeArray,foInstrumentStore,foInstrument,Chart,$) {
	var profitOrLoss = function(action,type,strikePrice,currentPrice,price,lotSize) {
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
	var roundPrice = function(price) {
		return Math.round(price);
	}
	var roundTick = function(tick) {
		var tickArray = [ 0.25,0.5,0.75,1.0,2.5,5,7.5,10,25,50,75,100,250,500,750,1000,2500,5000,7500,10000];
		for(var i = 0; i < tickArray.length; i++)
			if(tick <= tickArray[i]) {
				return (i == 0 || (tickArray[i-1] - tick) > (tick - tickArray[i])) ? tickArray[i] : tickArray[i-1];
			}
		return tick;
	}

	return {
		'show' : function(panelId) {
			var foStore = storeArray.get(panelId);
			var foArray = foStore.getArray();
			console.log('instrument array length is ' + foArray.length);
			var rowDiv = '';
			$('#table-' + panelId).remove();
			for(var i=0; i < foArray.length; i++) {
				var foInstrument = foArray[i];
				var checkStr = foArray[i].active == true ? 'checked' : '';
				rowDiv += '<tr>'
					+ '<td>'
					+ (i+1)
					+ '</td>'
					+ '<td>'
					+ '<input type="checkbox" id="active" data-id="' + foArray[i].id + '" ' + checkStr + '>'
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
				console.log('rowdiv - ' + rowDiv);
			}
			tableDiv = '<table id="table-' + panelId + '" \
				class="table table-bordered table-condensed table-striped insTable">\
				<thead>\
				<tr class="info">\
				<th>No.</th>\
				<th>Active</th>\
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
			$('#ref-' + panelId).append(tableDiv);
		},
		'compute' : function(panelId) {
			var foStore = storeArray.get(panelId);
			var foArray = foStore.getArray();
			var colorArray = ['blue','red','green','purple','black','teal','aqua','yellow','silver','FUCHSIA' ];
			$('#outputTable').remove();
			var myChart = $('#chart').data('chart');
			if(myChart != undefined)
				myChart.destroy();
			if(foArray.length == 0)
				return;
			// Form the table header - start
			var headerArray = [],legendArray = [];
			var headerInstrument = '';
			for (var h1 = 0; h1 < foArray.length; h1++) {
				if(headerInstrument != foArray[h1].name) {
					headerArray.push('Price');
					headerInstrument = foArray[h1].name;
					headerArray.push(foArray[h1].name);
				}
			}
			headerArray.push('Total');
			headerInstrument = '';
			for (h1 = 0; h1 < foArray.length; h1++) {
				if(foArray[h1].active == false)
					continue;
				if(headerInstrument != foArray[h1].name) {
					headerInstrument = foArray[h1].name;
					legendArray.push(foArray[h1].name);
				}
			}
			if(legendArray.length > 1)
				legendArray.push('Total');
			// Form the table header - end

			// Fill the profit and loss values - start
			var valueArray = [],graphArray = [ [],[],[],[],[],[],[],[],[],[],[] ];
			for(var h3 = 0; h3 < 20; h3++) {
				var rowArray = [],itemIndex=0;
				headerInstrument = '';
				var centralStrike,down20Percent,twoPercent,currentPrice;
				var totalPL = 0,grandTotal = 0,active=false;
				for (var h2 = 0; h2 < foArray.length; h2++) {
					if(headerInstrument != foArray[h2].name) {
						centralStrike = foArray[h2].centralStrike;
						var divisor = 1;
						do {
							down20Percent = centralStrike - 10 * foArray[h2].tickSize / divisor;
							twoPercent =  foArray[h2].tickSize / divisor;
							divisor *= 2;
						} while(down20Percent < 0);
						currentPrice = down20Percent + twoPercent * h3;
						if(headerInstrument != '') {
							grandTotal += totalPL;
							rowArray.push(totalPL.toFixed(2));
							if(active == true) {
								graphArray[itemIndex].push({ x: h3, y: parseFloat(totalPL.toFixed(2))});
								itemIndex++;
							}
						}
						rowArray.push(currentPrice.toFixed(2));
						totalPL = 0;
						active = false;
						headerInstrument = foArray[h2].name;
					}
					active |= foArray[h2].active;
					totalPL += foArray[h2].active == false ? 0 : profitOrLoss(foArray[h2].action,foArray[h2].type,foArray[h2].strikePrice,currentPrice,foArray[h2].price,foArray[h2].lotSize);
				}
				if(foArray.length != 0) {
					rowArray.push(totalPL.toFixed(2));
					grandTotal += totalPL;
					rowArray.push(grandTotal.toFixed(2));
					if(active != false)
						graphArray[itemIndex].push({ x: h3, y: parseFloat(totalPL.toFixed(2))});
					else
						itemIndex--;
					if(legendArray.length > 1)
						graphArray[itemIndex+1].push({ x: h3, y: parseFloat(grandTotal.toFixed(2))});
	
					valueArray.push(rowArray);
				}
			}
			var headDiv = '<tr class="info">';
			for(var k=0; k < headerArray.length; k++) {
				if(headerArray[k] == 'Price')
					continue;
				if(headerArray[k] == 'Total')
					headDiv	+= '<th class="text-center" colspan="1">' + headerArray[k] + '</th>';
				else
					headDiv	+= '<th class="text-center" colspan="2">' + headerArray[k] + '</th>';
			}
			headDiv += '</tr><tr class="info">';
			for(k=0; k < headerArray.length; k++) {
				if(headerArray[k] == 'Total')
					headDiv += '<th class="text-center"></th>';
				else if(headerArray[k] != 'Price')
					headDiv += '<th class="text-center">Subtotal</th>';
				else
					headDiv += '<th class="text-center">' + headerArray[k] + '</th>';
			}
			headDiv += '</tr>'
			var rowDiv = '';
			for(var m=0; m < valueArray.length; m++) {
				var cellDiv = '';
				var lineArray = valueArray[m];
				for(var n=0; n < lineArray.length; n++) {
					if(lineArray[n] < 0)
						cellDiv += '<td class="text-right danger">' + lineArray[n]	+ '</td>';
					else
						cellDiv += '<td class="text-right success">' + lineArray[n]	+ '</td>';
				}
				rowDiv += '<tr>' + cellDiv + '</tr>';
			}
			tableDiv = '<table id="outputTable"\
				class="table table-bordered table-condensed table-striped">\
				<thead>' +
				headDiv +
				'</thead>\
				<tbody>' +
				rowDiv +
				'</tbody>\
				</table>';
			$('#outputReference').append(tableDiv);
			var ctx = $('#chart');
			console.log('graphArray - ' + JSON.stringify(graphArray));
			var dataSetArray = [];
			for(var k=0; k < legendArray.length && k < 10; k++) {	
				dataSetArray.push({
						label: legendArray[k],
						lineTension: 0.2,
						data: graphArray[k],
						borderColor: colorArray[k],
						backgroundColor: colorArray[k],
						fill: false,
						pointBackgroundColor: colorArray[k],
						pointRadius: 0
					});
				if(legendArray[k] != 'Total')
					dataSetArray[k].borderWidth = '1px';

			}
			myChart = new Chart(ctx, {
				type: 'line',
				data: {
					label: 'P and L',
					datasets: dataSetArray
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					legend: {
						display: true,
						fill: false
					},
					scales: {
						yAxes: [{
							display: true,
							ticks: {
								beginAtZero:false,
								fontSize: 12,
								maxTicksLimit:10
							},
							gridLines: {
								drawTicks: true,
								color: 'darkslategray',
								display: true
							}
						}],
						xAxes: [{
							display: true,
							ticks: {
								beginAtZero:false,
								fontSize: 12,
								maxTicksLimit:20
							},
							gridLines: {
								drawTicks: true,
								color: 'darkslategray',
								display: true,
								zeroLineWidth: 1
							},
							type: 'linear',
							position: 'bottom'
						}]
					}
				}
			});
			Chart.defaults.global.defaultFontFamily = '"Lucida Console", "Monaco", "monospace"';
			Chart.defaults.global.defaultFontColor = 'black';
			$('#chart').data('chart',myChart);
		}
	};
});