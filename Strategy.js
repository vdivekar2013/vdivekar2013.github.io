define('Strategy',['GenericSingleLegStrategy','CoveredCallStrategy','CallDiagonalCalendarSpreadStrategy'],function(genericSingleLegStrategy,coveredCallStrategy,callDiagonalCalendarSpreadStrategy) {
	return {
		'show' : function(strategyType) { 
			if(strategyType == 'Generic-Single-leg') {
				genericSingleLegStrategy.show();
			} else if(strategyType == 'Covered-call') {
				coveredCallStrategy.show();
			} else if(strategyType == 'Call-diagonal-calendar-spread') {
				callDiagonalCalendarSpreadStrategy.show();
			}
		},
		'process' : function(strategyType,foStore,exchange,id,name,lotSize,centralStrike,tickSize) {
			if(strategyType == 'Generic-Single-leg') {
				genericSingleLegStrategy.process(foStore,exchange,id,name,lotSize,centralStrike,tickSize);
			} else if(strategyType == 'Covered-call') {
				coveredCallStrategy.process(foStore,exchange,id,name,lotSize,centralStrike,tickSize);
			} else if(strategyType == 'Call-diagonal-calendar-spread') {
				callDiagonalCalendarSpreadStrategy.process(foStore,exchange,id,name,lotSize,centralStrike,tickSize);
			}
		},
		'postProcess' : function(strategyType) {
			if(strategyType == 'Generic-Single-leg') {
				genericSingleLegStrategy.postProcess();
			} else if(strategyType == 'Covered-call') {
				coveredCallStrategy.postProcess();
			} else if(strategyType == 'Call-diagonal-calendar-spread') {
				callDiagonalCalendarSpreadStrategy.postProcess();
			}
		},
		'refresh' : function(strategyType,instrument) {
			if(strategyType == 'Generic-Single-leg') {
				genericSingleLegStrategy.refresh(instrument);
			} else if(strategyType == 'Covered-call') {
				coveredCallStrategy.refresh(instrument);
			} else if(strategyType == 'Call-diagonal-calendar-spread') {
				callDiagonalCalendarSpreadStrategy.refresh(instrument);
			}
		}
	}
});