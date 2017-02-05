define('Config',[],function() {
	var testFacebookConfig = {
		    appId      : '1780528768937392', // '1384515718278362', //
		    cookie     : true,
		    xfbml      : true,
		    version    : 'v2.8'
		  };
	var prodFacebookConfig = {
		    appId      : '1384515718278362', //'1780528768937392', //
		    cookie     : true,
		    xfbml      : true,
		    version    : 'v2.8'
		  };
	var testFirebaseConfig = {
		    apiKey: "AIzaSyDoQlvIoE1WwQ3myq4fV8W6fLAHpkF8o5o",
		    authDomain: "testhub-1f083.firebaseapp.com",
		    databaseURL: "https://testhub-1f083.firebaseio.com",
		    storageBucket: "testhub-1f083.appspot.com",
		    messagingSenderId: "317348989103"
		  };
	var prodFirebaseConfig = {
		    apiKey: "AIzaSyAywQWorGwIG20HIvQ5vfcoG63NnKJXi0Q",
		    authDomain: "nitrohub-9226a.firebaseapp.com",
		    databaseURL: "https://nitrohub-9226a.firebaseio.com",
		    storageBucket: "nitrohub-9226a.appspot.com",
		    messagingSenderId: "611854173714"
		  };
	return {
		'mode' : 'prod',
		'getFacebookConfig' : function(type) {
			if(type == 'test')
				return testFacebookConfig;
			else if(type == 'prod')
				return prodFacebookConfig;
			return null;
		},
		'getFirebaseConfig' : function(type) {
			if(type == 'test')
				return testFirebaseConfig;
			else if(type == 'prod')
				return prodFirebaseConfig;
			return null;
		}
	};
});