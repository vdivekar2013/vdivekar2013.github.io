define('StoreArray',['FOInstrumentStore','FOInstrument','Firebase'], function(FOInstrumentStore,FOInstrument,firebase) {
	return {
		'add' : function(key,value) {
			if(typeof(key) == 'string' && value instanceof FOInstrumentStore) {
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
				if(this[key] instanceof FOInstrumentStore) {
					array[count] = { 'key' : key, 'value' : this[key] };
					count++;
				}
			}
			array.sort(function(a,b) {
				return a.key.localeCompare(b.key); 
			});
			return array;
		},
		'loadArray' : function(array) {
			if(array instanceof Array) {
				for(var key in this)
					if(this[key] instanceof FOInstrumentStore)
						delete this[key];
				for(var i = 0; i < array.length; i++)
						this[array[i].key] = array[i].value;
			} 
		},
		'load' : function(self,callback) {
			var userId = firebase.auth().currentUser.uid;
			firebase.database().ref('/users/' + userId + '/strategies/').once('value').then(function(snapshot) {
				var array = snapshot.val();
				if(array != null) {
					console.log('Objects loaded are ' + JSON.stringify(array));
					if(array instanceof Array) {
						for(var key in self)
							if(self[key] instanceof FOInstrumentStore)
								delete self[key];
						for(var i = 0; i < array.length; i++) {
							if(array[i] instanceof Object) {
								var key2 = array[i].key;
								var valueArray = array[i].value;
								var foStore = new FOInstrumentStore();
								self[key2] = foStore;
								if(valueArray != undefined)
									for(var j=0; j < valueArray.length; j++)
										foStore[valueArray[j].id] = new FOInstrument(valueArray[j].exchange,valueArray[j].id,valueArray[j].name,valueArray[j].type,valueArray[j].strikePrice,valueArray[j].action,valueArray[j].price,valueArray[j].lotSize,valueArray[j].centralStrike,valueArray[j].active,valueArray[j].tickSize);
							}
						}
					}
				}
				callback();
			});
		},
		'save' : function() {
			if(typeof(Storage) != undefined && localStorage != undefined) {
				var array = new Array();
				var count = 0;
				for(var key in this) {
					if(this[key] instanceof FOInstrumentStore) {
						array[count] = { 'key' : key, 'value' : this[key].getArray() };
						count++;
					}
				}
				console.log(array.length + ' no records saved in foinstrumentFile');
				console.log('foinstrumentFile saved object is ' + JSON.stringify(array));
				var user = firebase.auth().currentUser;
				var userId = user.uid;
				var database = firebase.database();
				database.ref('users/' + userId  + '/strategies/').set(array);
				//localStorage.setItem('foinstrumentFile',JSON.stringify(array));
			}
		},
		'length' : function() {
			return Object.keys(this).length - 8;
		}
	};
});