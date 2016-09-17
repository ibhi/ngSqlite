(function() {
    'use strict';
    var options = {
    	bindings: {
            table: '='
    	},
    	controller: InsertRecordController,
    	controllerAs: 'vm',
    	templateUrl: 'src/app/insert-record/insert-record.template.html'
    };

    angular
        .module('app')
        .component('insertRecord', options);

    InsertRecordController.$inject = ['cache'];

    /* @ngInject */
    function InsertRecordController(cache) {
        var vm = this;
   
        activate();

        ////////////////
        vm.tableData = {};
        vm.table.columns.forEach(function(column) {
            vm.tableData[column.name] = '';
        });

        vm.insertRecord = function() {
            console.log(vm.tableData);
            cache.upsert(vm.table.name, vm.tableData).then(function(result) {
                vm.table.columns.forEach(function(column) {
                    vm.tableData[column.name] = '';
                });
                cache.selectAll(vm.table.name).then(function(result) {
                    console.log(result);
                    vm.table.data = result;
                }, function(error) {
                    console.log(error);
                });
            })
        }
        

        function activate() {
        }


    }

    

    
})();