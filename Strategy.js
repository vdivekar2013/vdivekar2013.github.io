define('Strategy',['GenericSingleLegStrategy','CoveredCallStrategy'],function(genericSingleLegStrategy,coveredCallStrategy) {
	return {
		'show' : function(strategyType) { 
			if(strategyType == 'Generic-Single-leg') {
				genericSingleLegStrategy.show();
			} else if(strategyType == 'Covered-call') {
				coveredCallStrategy.show();
			}
		},
		'process' : function(strategyType,foStore,exchange,id,name,lotSize,centralStrike,tickSize) {
			if(strategyType == 'Generic-Single-leg') {
				genericSingleLegStrategy.process(foStore,exchange,id,name,lotSize,centralStrike,tickSize);
			} else if(strategyType == 'Covered-call') {
				coveredCallStrategy.process(foStore,exchange,id,name,lotSize,centralStrike,tickSize);
			}
		},
		'postProcess' : function(strategyType) {
			if(strategyType == 'Generic-Single-leg') {
				genericSingleLegStrategy.postProcess();
			} else if(strategyType == 'Covered-call') {
				coveredCallStrategy.postProcess();
			}
		},
		'refresh' : function(strategyType,instrument) {
			if(strategyType == 'Generic-Single-leg') {
				genericSingleLegStrategy.refresh(instrument);
			} else if(strategyType == 'Covered-call') {
				coveredCallStrategy.refresh(instrument);
			}
		}
	}
});