define('Strategy',['GenericSingleLegStrategy'],function(genericSingleLegStrategy) {
	return {
		'show' : function(strageyType) { 
			if(strageyType == 'Generic-Single-leg') {
				genericSingleLegStrategy.show();
			}
		},
		'process' : function(strageyType,foStore,exchange,id,name,lotSize,centralStrike,tickSize) {
			if(strageyType == 'Generic-Single-leg') {
				genericSingleLegStrategy.process(foStore,exchange,id,name,lotSize,centralStrike,tickSize);
			}
		},
		'postProcess' : function(strageyType) {
			if(strageyType == 'Generic-Single-leg') {
				genericSingleLegStrategy.postProcess();
			}
		}
	}
});