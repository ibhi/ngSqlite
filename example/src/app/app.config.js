(function() {
	'use strict';
	angular.module('app')
		.config(appConfig);

	appConfig.$inject = ['cacheProvider'];

	function appConfig(cacheProvider) {
		var cfg = {
		    dbName: 'app',
		    dbLocation:'default'
	    }
		cacheProvider.config(cfg);
	}
})()