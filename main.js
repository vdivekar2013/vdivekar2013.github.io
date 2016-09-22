require.config({
    baseUrl: '.',
    paths: {
         jquery: 'jquery-3.1.0.min',
         metro: 'MetroJs'	 
    },
    shim: {
        'metro': { 
            deps:['jquery']
        }
    }
});

define('main',function(){
	return undefined;
});