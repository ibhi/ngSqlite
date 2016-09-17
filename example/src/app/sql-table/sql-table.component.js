(function() {
    'use strict';

    var options = {
        bindings: {
            table: '='
        },
        controller: SqlTableController,
        controllerAs: 'vm',
        templateUrl: 'src/app/sql-table/sql-table.template.html'
    };

    angular
        .module('app')
        .component('sqlTable', options);

    
    SqlTableController.$inject = ['$scope'];
    /* @ngInject */
    function SqlTableController($scope) {
    	var vm=this;
        // TODO: Temporary hack, need to fix this
        // $scope.$watch('vm.table.data', function() {
        //     if(vm.table.data && vm.table.data.length > 0) {
    	   //     vm.columns = Object.keys(vm.data[0]);
        //     }
        // });
    }
})();
