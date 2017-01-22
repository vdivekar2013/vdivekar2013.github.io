define('FOInstrument',function(){
    return function FOInstrument(exchange,id,name,type,strikePrice,action,price,lotSize,centralStrike) {
    	this.exchange = exchange;
    	this.id = id;
    	this.name = name;
    	this.type = type;
    	this.strikePrice = strikePrice;
    	this.action = action;
    	this.price = price;
    	this.lotSize = lotSize;
    	this.centralStrike = centralStrike;
    };
});