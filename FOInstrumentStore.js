define('FOInstrumentStore',['FOInstrument'], function(FOInstrument) {
	return {
		'add' : function(key,value) {
			if(typeof(key) == 'string' && value instanceof FOInstrument) {
				this[key] = value;
			}
		},
		'delete' : function(key) {
			if(typeof(key) == 'string' && this[key] != undefined)
				delete this[key];
		},
		'get' : function(key) {
			if(typeof(key) == 'string' && this[key] != undefined)
				return this[key];
		},
		'getArray' : function() {
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
		},
		'loadArray' : function(array) {
			if(array instanceof Array) {
				for(var key in this)
					if(this[key] instanceof FOInstrument)
						delete this[key];
				for(var i = 0; i < array.length; i++)
					if(array[i] instanceof FOInstrument)
						this[array[i].id] = array[i];
			} 
		},
		'load' : function() {
			if(typeof(Storage) != undefined && localStorage != undefined && localStorage.getItem('foinstrumentFile') != undefined) {
				var array = JSON.parse(localStorage.getItem('foinstrumentFile'));
				console.log(array.length + ' no foinstrumentFile records loaded');
				console.log('Objects loaded are ' + localStorage.getItem('foinstrumentFile'));
				if(array instanceof Array) {
					for(var key in this)
						if(this[key] instanceof FOInstrument)
							delete this[key];
					for(var i = 0; i < array.length; i++)
						if(array[i] instanceof Object) {
							this[array[i].id] = new FOInstrument(array[i].exchange,array[i].id,array[i].name,array[i].type,array[i].strikePrice,array[i].action,array[i].price,array[i].lotSize,array[i].centralStrike);
						}
				}
			}
		},
		'save' : function() {
			if(typeof(Storage) != undefined && localStorage != undefined) {
				var array = new Array();
				var count = 0;
				for(var key in this) {
					if(this[key] instanceof FOInstrument) {
						array[count] = this[key];
						count++;
					}
				}
				console.log(array.length + ' no records saved in foinstrumentFile');
				console.log('foinstrumentFile saved object is ' + JSON.stringify(array));
				localStorage.setItem('foinstrumentFile',JSON.stringify(array));
			}
		},
		'length' : function() {
			return Object.keys(this).length - 8;
		}
	};
});