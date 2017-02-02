define('ContractData',function(){
    return function ContractData(symbol,lotSize,centralStrike,tickSize,settlementPrice) {
	    	this.symbol = symbol;
	    	this.lotSize = lotSize;
	    	this.centralStrike = centralStrike;
	    	this.tickSize = tickSize;
	    	this.settlementPrice = settlementPrice;
    	}
});