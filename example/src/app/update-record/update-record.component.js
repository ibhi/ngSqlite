(function() {
    'use strict';
    var options = {
    	bindings: {
            table: '='
    	},
    	controller: UpdateRecordController,
    	controllerAs: 'vm',
    	templateUrl: 'src/app/update-record/update-record.template.html'
    };

    angular
        .module('app')
        .component('updateRecord', options);

    UpdateRecordController.$inject = ['cache'];

    /* @ngInject */
    function UpdateRecordController(cache) {
        var vm = this;
   
        activate();

        ////////////////
        
        vm.upsertRecord = function(row) {
            console.log(row);
            cache.update(vm.table.name, row, [vm.table.keyField]).then(function(result) {
                cache.selectAll(vm.table.name).then(function(result) {
                    console.log(result);
                    vm.table.data = result;
                }, function(error) {
                    console.log(error);
                });
            });
        };

        vm.deleteRecord = function(row) {
            cache.delete(vm.table.name, row, [vm.table.keyField]).then(function(result) {
                cache.selectAll(vm.table.name).then(function(result) {
                    console.log(result);
                    vm.table.data = result;
                }, function(error) {
                    console.log(error);
                });
            });
        }
        

        function activate() {
        }


    }

    

    
})();