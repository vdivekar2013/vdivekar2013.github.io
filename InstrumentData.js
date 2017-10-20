define('InstrumentData',['Firebase'],function(firebase) {
	var lastUpdate;
	return {
		'getInstrument' : function(instrument,callback) {
			if(instrument == '' || instrument == undefined)
				return;
			firebase.database().ref('/instruments/value/' + instrument + '/').once('value').then(function(snapshot) {
				//console.log('Objects loaded are ' + JSON.stringify(snapshot.val()));
				callback(snapshot.val());
			});
		}
	}
});
