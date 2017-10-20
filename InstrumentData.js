define('InstrumentData',['Firebase'],function(firebase) {
	var lastUpdate;
	var cache = {};
	return {
		'getInstrument' : function(instrument,callback) {
			if(instrument == '' || instrument == undefined)
				return;
			if(lastUpdate == undefined)
				lastUpdate = new Date();
			var now = new Date();
			if((now.getTime() - lastUpdate.getTime()) > 3600000) {
				cache = {};
				lastUpdate = new Date();
			}
			if(cache[instrument] != undefined) {
				callback(cache[instrument]);
				console.log(instrument + ' data, got it from cache');
			}
			firebase.database().ref('/instruments/value/' + instrument + '/').once('value').then(function(snapshot) {
				cache[instrument] = snapshot.val();
				callback(snapshot.val());
			});
		}
	}
});
