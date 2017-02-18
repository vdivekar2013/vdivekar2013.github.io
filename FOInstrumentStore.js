define('FOInstrumentStore',['FOInstrument','Firebase'], function(FOInstrument,firebase) {
	function FOInstrumentStore() {
		
	}
	FOInstrumentStore.prototype.add = function(key,value) {
			if(typeof(key) == 'string' && value instanceof FOInstrument) {
				this[key] = value;
			}
		};
		
		FOInstrumentStore.prototype.delete = function(key) {
			if(typeof(key) == 'string' && this[key] != undefined)
				delete this[key];
		};
		
		FOInstrumentStore.prototype.get = function(key) {
			if(typeof(key) == 'string' && this[key] != undefined)
				return this[key];
		};
		
		FOInstrumentStore.prototype.getArray = function() {
			var array = new Array();
			var count = 0;
			for(var key in this) {
				if(this[key] instanceof FOInstrument) {
					array[count] = this[key];
					count++;
				}
			}
			array.sort(function(a,b) {
				return a.name.localeCompare(b.name); 
			});
			return array;
		};
		
		FOInstrumentStore.prototype.loadArray = function(array) {
			if(array instanceof Array) {
				for(var key in this)
					if(this[key] instanceof FOInstrument)
						delete this[key];
				for(var i = 0; i < array.length; i++)
					if(array[i] instanceof FOInstrument)
						this[array[i].id] = array[i];
			} 
		};
		
		FOInstrumentStore.prototype.length = function() {
			console.log('length = ' + Object.keys(this).length);
			return Object.keys(this).length;
		};
		
		return FOInstrumentStore;
});