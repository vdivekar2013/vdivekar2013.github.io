define('FOInstrumentStore',['FOInstrument','Firebase'], function(FOInstrument,firebase) {
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
		'load' : function(self,callback) {
			/*if(typeof(Storage) != undefined && localStorage != undefined && localStorage.getItem('foinstrumentFile') != undefined) {
				var array = JSON.parse(localStorage.getItem('foinstrumentFile'));
				console.log(array.length + ' no foinstrumentFile records loaded');
				console.log('Objects loaded are ' + localStorage.getItem('foinstrumentFile'));
				if(array instanceof Array) {
					for(var key in this)
						if(this[key] instanceof FOInstrument)
							delete this[key];
					for(var i = 0; i < array.length; i++)
						if(array[i] instanceof Object) {
							this[array[i].id] = new FOInstrument(array[i].exchange,array[i].id,array[i].name,array[i].type,array[i].strikePrice,array[i].action,array[i].price,array[i].lotSize,array[i].centralStrike,array[i].active,array[i].tickSize);
						}
				}
			}*/
			var userId = firebase.auth().currentUser.uid;
			firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
				var array = snapshot.val();
				if(array != null) {
					console.log(array.length + ' no foinstrumentFile records loaded');
					console.log('Objects loaded are ' + JSON.stringify(array));
					if(array instanceof Array) {
						for(var key in self)
							if(self[key] instanceof FOInstrument)
								delete self[key];
						for(var i = 0; i < array.length; i++)
							if(array[i] instanceof Object) {
								self[array[i].id] = new FOInstrument(array[i].exchange,array[i].id,array[i].name,array[i].type,array[i].strikePrice,array[i].action,array[i].price,array[i].lotSize,array[i].centralStrike,array[i].active,array[i].tickSize);
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
					if(this[key] instanceof FOInstrument) {
						array[count] = this[key];
						count++;
					}
				}
				console.log(array.length + ' no records saved in foinstrumentFile');
				console.log('foinstrumentFile saved object is ' + JSON.stringify(array));
				var user = firebase.auth().currentUser;
				var userId = user.uid;
				var database = firebase.database();
				database.ref('users/' + userId).set(array);
				//localStorage.setItem('foinstrumentFile',JSON.stringify(array));
			}
		},
		'length' : function() {
			return Object.keys(this).length - 8;
		}
	};
});