(function() {
    'use strict';
    var options = {
    	bindings: {
            table: '='
    	},
    	controller: RetrieveRecordController,
    	controllerAs: 'vm',
    	templateUrl: 'src/app/retrieve-record/retrieve-record.template.html'
    };

    angular
        .module('app')
        .component('retrieveRecord', options);

    RetrieveRecordController.$inject = ['cache'];

    /* @ngInject */
    function RetrieveRecordController(cache) {
        var vm = this;
   
        activate();

        ////////////////
        vm.tableData = {};
        vm.table.columns.forEach(function(column) {
            vm.tableData[column.name] = '';
        });

        vm.retrieveRecord = function() {
            console.log(vm.tableData);
            vm.errorMessage = null;
            var keyFields = Object.keys(vm.tableData).filter(function(key) {
                return (vm.tableData[key] !== '' || vm.tableData[key]);
            });
            console.log(keyFields)
            cache.select(vm.table.name, vm.tableData, keyFields).then(function(result) {
                if(result.length > 0) {
                    vm.tableData = result[0];
                    
                } else {
                    vm.errorMessage = "No record found";
                }
            }, function(error) {
                vm.errorMessage = "Error: " + error.message;
            })
        }

        vm.clear = function() {
            vm.table.columns.forEach(function(column) {
                vm.tableData[column.name] = '';
            });
            vm.errorMessage = null;
        }
        

        function activate() {
        }


    }

    

    
})();