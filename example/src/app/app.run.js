(function() {
	'use strict';
	angular.module('app')
		.run(appRun);

	appRun.$inject = ['cache'];
	
	function appRun(cache) {
		cache.init();
	}
})()