(function() {
    'use strict';

    angular
        .module('myApp')
        .controller('OrganizationController', OrganizationController);

    OrganizationController.$inject = ['OrganizationService', '$stateParams'];

    /* @ngInject */
    function OrganizationController(OrganizationService, $stateParams) {
        var vm = this;

        //\/\/\\\//\ FUNCTIONS /\/\/\/\/\
        activate();

        ////////////////

        function activate() {
            console.log('OrganizationController', $stateParams);
        }
    }
})();