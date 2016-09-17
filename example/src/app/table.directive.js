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

    /* @ngInject */
    function Controller() {
    	var vm=this;

    	vm.columns = Object.keys(vm.data[0]);
    }
})();
