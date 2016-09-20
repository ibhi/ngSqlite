(function() {
    'use strict';
    var options = {
    	bindings: {
            table: '='
    	},
    	controller: UpsertRecordController,
    	controllerAs: 'vm',
    	templateUrl: 'src/app/upsert-record/upsert-record.template.html'
    };

    angular
        .module('app')
        .component('upsertRecord', options);

    UpsertRecordController.$inject = ['cache'];

    /* @ngInject */
    function UpsertRecordController(cache) {
        var vm = this;
        
        activate();

        ////////////////
        vm.tableData = {};
        vm.table.columns.forEach(function(column) {
            vm.tableData[column.name] = '';
        });

        vm.errorMessage = null;

        vm.upsertRecord = function() {
            console.log(vm.tableData);
            cache.upsert(vm.table.name, vm.tableData).then(function(result) {
                vm.errorMessage = null;
                vm.table.columns.forEach(function(column) {
                    vm.tableData[column.name] = '';
                });
                cache.selectAll(vm.table.name).then(function(result) {
                    console.log(result);
                    vm.table.data = result;
                }, function(error) {
                    console.log(error);

                });
            }, function(error) {
                vm.errorMessage = error.message;
            })
        }
        

        function activate() {
        }


    }

    

    
})();