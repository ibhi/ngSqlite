(function() {
    'use strict';

    angular
        .module('app')
        .directive('sqlTable', sqlTable);

    sqlTable.$inject = [];

    /* @ngInject */
    function sqlTable() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: Controller,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            scope: {
            	data: '='
            },
            templateUrl: 'src/app/table.template.html'
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }
    Controller.$inject = ['$scope'];
    /* @ngInject */
    function Controller($scope) {
    	var vm=this;
        // TODO: Temporary hack, need to fix this
        $scope.$watch('vm.data', function() {
            if(vm.data && vm.data.length > 0) {
    	       vm.columns = Object.keys(vm.data[0]);
            }
        })

    }
})();
