(function() {
	'use strict';
	angular.module('app')
		.controller('AppController', AppController);
	AppController.$inject = ['cache'];
	function AppController(cache) {
		var vm = this;

		var tableName = 'accounts';

		vm.table = {};
		vm.table.name = 'demo'; 
		vm.table.data = [];

		vm.table.columns = [{
        	name: 'Id',
        	type: 'TEXT',
        	primary: true,
        	unique: false,
        	notnull: false

        }];

        if(window.localStorage.getItem('table')) {
        	vm.table = JSON.parse(window.localStorage.getItem('table'));
        }

        cache.selectAll(vm.table.name).then(function(result) {
            console.log(result);
            vm.table.data = result;
        }, function(error) {
            console.log(error);
        });
		
	}
})()