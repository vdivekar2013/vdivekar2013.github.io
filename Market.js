define('Market',['InstrumentStore','jquery'],function(InstrumentStore,$) {
	return {
		'call' : function() {
			var array = InstrumentStore.getArray();
			for(var i = 0; i < array.length; i++) {
				var url = "https://www.google.com/finance/info?q=" + array[i].id;
				$.ajax({ url: url, 
						 dataType: "jsonp",
						 async: false,
						 jsonpCallback: function(json) {
							 if(json == undefined) {
								 alert('data is undefined');
							 }
							 alert(JSON.stringify(json));
							 if(json instanceof Array) {
								 array[i].value = json[0].l_fix;
							 }
						 },
						 error: function(xhr, ajaxOptions, thrownError) {
							 alert('i am here 4');
							 console.log(thrownError);
						 },
						 complete: function() {
							 alert('completed');
						 }
					});
			}
			InstrumentStore.loadArray(array);
		}};
});