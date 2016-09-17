(function() {
    'use strict';
    var options = {
    	bindings: {
            table: '='
    	},
    	controller: DropTableController,
    	controllerAs: 'vm',
    	templateUrl: 'src/app/drop-table/drop-table.template.html'
    };

    angular
        .module('app')
        .component('dropTable', options);

    DropTableController.$inject = ['cache'];

    /* @ngInject */
    function DropTableController(cache) {
        var vm = this;
        
        activate();

        ////////////////
        
        vm.errorMessage = null;

        vm.dropTable = function() {
            
            cache.drop(vm.tableName).then(function(result) {
                vm.errorMessage = 'Table deleted succuessfully';
                vm.tableName = '';
                vm.table = {};
                vm.table.columns = [{
                    name: 'Id',
                    type: 'TEXT',
                    primary: true,
                    unique: false,
                    notnull: false

                }];
                window.localStorage.removeItem('table');
            }, function(error) {
                vm.errorMessage = error.message;
            })
        }
        

        function activate() {
        }


    }

    

    
})();