define('Instrument',function(){
    return function Instrument(id,name,loLimit,hiLimit) {
    	this.id = id;
    	this.name = name;
    	this.loLimit = loLimit;
    	this.hiLimit = hiLimit;
    	this.value = 0.0;
    };
});