(function() {
    'use strict';
    var options = {
    	bindings: {
    		table: '='
    	},
    	controller: CreateTableController,
    	controllerAs: 'vm',
    	templateUrl: 'src/app/create-table/create-table.template.html'
    };

    angular
        .module('app')
        .component('createTable', options);

    CreateTableController.$inject = ['cache'];

    /* @ngInject */
    function CreateTableController(cache) {
        var vm = this;
    
                
		window.localStorage.setItem('table', JSON.stringify(vm.table));
        function prepare(columns) {
        	var fieldSpec = {};
        	columns.forEach(function(column) {
        		var name = column.name;
        		// delete column.name;
        		fieldSpec[name] = column;
        	});
        	return fieldSpec
        }

        vm.create = function() {
        	console.log(vm.table.columns);
            vm.table.keyField = null;
            vm.table.columns.forEach(function(column) {
                
                if(column.primary) {
                    vm.table.keyField = column.name;
                }
            });
        	window.localStorage.setItem('table', JSON.stringify(vm.table));
        	var fieldSpec = prepare(vm.table.columns);
        	cache.createTable(vm.table.name, fieldSpec)
        	.then(function(result) {
			    console.log(result);
			}, function(error) {
			    console.log(error);
			});
        }

        vm.addColumn = function() {
        	vm.table.columns.push({
        		name: '',
	        	type: 'TEXT',
	        	primary: false,
	        	unique: false,
	        	notnull: false
        	});
        	window.localStorage.setItem('table', JSON.stringify(vm.table));
        }
        activate();

        ////////////////

        function activate() {
        }


    }

    

    
})();