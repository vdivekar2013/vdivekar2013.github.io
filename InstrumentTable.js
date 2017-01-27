define('InstrumentTable',['FOInstrumentStore','FOInstrument','chartjs','jquery'], function(foInstrumentStore,foInstrument,Chart,$) {
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
		'show' : function() {
			var foArray = foInstrumentStore.getArray();
			console.log('instrument array length is ' + foArray.length);
			var rowDiv = '';
			$('#instrumentTable').remove();
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
			tableDiv = '<table id="instrumentTable"\
				class="table table-bordered table-condensed table-striped">\
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
			$('#instrumentReference').append(tableDiv);
		},
		'compute' : function() {
			var foArray = foInstrumentStore.getArray();
			var colorArray = ['blue','red','green','purple','black','teal','aqua','yellow','silver','FUCHSIA' ];
			if(foArray.length == 0)
				return;
			$('#outputTable').remove();
			// Form the table header - start
			var headerArray = [],legendArray = [];
			var headerInstrument = '';
			for (var h1 = 0; h1 < foArray.length; h1++) {
				if(headerInstrument != foArray[h1].name) {
					headerArray.push('Price');
					headerInstrument = foArray[h1].name;
					headerArray.push(foArray[h1].name);
					legendArray.push(foArray[h1].name);
				}
			}
			headerArray.push('Total');
			// Form the table header - end

			// Fill the profit and loss values - start
			var valueArray = [],graphArray = [ [],[],[],[],[],[],[],[],[],[],[] ];
			for(var h3 = 0; h3 < 20; h3++) {
				var rowArray = [],itemIndex=0;
				headerInstrument = '';
				var centralStrike,down20Percent,twoPercent,currentPrice;
				var totalPL = 0,grandTotal = 0;
				for (var h2 = 0; h2 < foArray.length; h2++) {
					if(headerInstrument != foArray[h2].name) {
						centralStrike = foArray[h2].centralStrike;
						down20Percent = roundPrice(centralStrike - centralStrike * 25 / 100);
						twoPercent =  roundTick(centralStrike * 2 / 100);
						currentPrice = down20Percent + twoPercent * h3;
						if(headerInstrument != '') {
							rowArray.push(totalPL.toFixed(2));
							graphArray[itemIndex].push({ x: h3, y: parseFloat(totalPL.toFixed(2))});
							itemIndex++;
						}
						rowArray.push(currentPrice.toFixed(2));
						totalPL = 0;
						headerInstrument = foArray[h2].name;
					}
					totalPL += foArray[h2].active == false ? 0 : profitOrLoss(foArray[h2].action,foArray[h2].type,foArray[h2].strikePrice,currentPrice,foArray[h2].price,foArray[h2].lotSize);
					grandTotal += totalPL;
				}
				rowArray.push(totalPL.toFixed(2));
				rowArray.push(grandTotal.toFixed(2));
				graphArray[itemIndex].push({ x: h3, y: parseFloat(totalPL.toFixed(2))});
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
			var ctx = $('#chart');
			console.log('graphArray - ' + JSON.stringify(graphArray));
			var dataSetArray = [];
			for(var k=0; k < legendArray.length && k < 10; k++) {
				dataSetArray.push({
						label: legendArray[k],
						lineTension: 0,
						data: graphArray[k],
						borderColor: colorArray[k],
						backgroundColor: 'white',
						fill: false,
						borderWidth: '1px',
						pointBackgroundColor: colorArray[k],
						pointRadius: 0
					});
			}
			var myChart = new Chart(ctx, {
				type: 'line',
				data: {
					label: 'P and L',
					datasets: dataSetArray
				},
				options: {
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
		}
	};
});