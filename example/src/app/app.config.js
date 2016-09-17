(function() {
	'use strict';
	angular.module('app')
		.config(appConfig);

	appConfig.$inject = ['cacheProvider', '$stateProvider', '$urlRouterProvider'];

	function appConfig(cacheProvider, $stateProvider, $urlRouterProvider) {
		var cfg = {
		    dbName: 'app',
		    dbLocation:'default'
	    }
		cacheProvider.config(cfg);
		$urlRouterProvider.otherwise('/');
		$stateProvider.state('create', {
			url: '/',
			template: '<create-table table="vm.table"></create-table>'
		})
		.state('insert', {
			url: '/insert',
			template: '<insert-record table="vm.table"></insert-record>'
		})
		.state('update', {
			url: '/update',
			template: '<update-record table="vm.table"></update-record>'
		})


	}
})()