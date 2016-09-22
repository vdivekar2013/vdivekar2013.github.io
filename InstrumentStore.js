define('InstrumentStore',['Instrument'], function(Instrument) {
	return {
		'add' : function(key,value) {
			if(typeof(key) == 'string' && value instanceof Instrument) {
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
				if(this[key] instanceof Instrument) {
					array[count] = this[key];
					count++;
				}
			}
			return array;
		},
		'loadArray' : function(array) {
			if(array instanceof Array) {
				for(var key in this)
					if(this[key] instanceof Instrument)
						delete this[key];
				for(var i = 0; i < array.length; i++)
					if(array[i] instanceof Instrument)
						this[array[i].id] = array[i];
			}
		},
		'load' : function() {
			if(typeof(Storage) != undefined && localStorage != undefined && localStorage.getItem('instrumentFile') != undefined) {
				var array = JSON.parse(localStorage.getItem('instrumentFile'));
				console.log(array.length + ' no records loaded');
				if(array instanceof Array) {
					for(var key in this)
						if(this[key] instanceof Instrument)
							delete this[key];
					for(var i = 0; i < array.length; i++)
						if(array[i] instanceof Object) {
							this[array[i].id] = new Instrument(array[i].id,array[i].name,array[i].loLimit,array[i].hiLimit);
						}
				}
			}
		},
		'save' : function() {
			if(typeof(Storage) != undefined && localStorage != undefined) {
				var array = new Array();
				var count = 0;
				for(var key in this) {
					if(this[key] instanceof Instrument) {
						array[count] = this[key];
						count++;
					}
				}
				console.log(array.length + ' no records saved');
				localStorage.setItem('instrumentFile',JSON.stringify(array));
			}
		},
		'length' : function() {
			return Object.keys(this).length - 8;
		}
	};
});