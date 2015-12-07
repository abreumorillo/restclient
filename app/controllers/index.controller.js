(function() {
    'use strict';

    angular
        .module('myApp')
        .controller('IndexController', IndexController);

    IndexController.$inject = ['$q', 'OrganizationService', '$timeout'];

    /* @ngInject */
    function IndexController($q, OrganizationService, $timeout) {
        var vm = this;

        //\/\/\/\\/
        vm.organization = {};
        vm.isSearching = false;
        vm.isSuccessResponse = false;
        vm.isErrorResponse = false;

        vm.organizationType = [];
        vm.states = [];
        vm.cities = [];

        //\/\/\/\/\/\ FUNCTIONS /\/\/\/\/\
        vm.clearForm = clearForm;
        vm.search = search;
        vm.getCitiesByState = getCitiesByState;

        activate();

        ////////////////

        function activate() {

            console.log('Index Controller', OrganizationService);
            showLoadingIndicator();
            $q.all([getOrganizationType(), getStates()]).then(function() {
                hideLoadingIndicator();
            });
        }

        /**
         * Reset form and also initialize control variables.
         * @param  {mix} form form object from view
         * @return {mix}
         */
        function clearForm(form) {
            vm.organization = {};
            form.$setPristine();
            vm.isSearching = false;
            vm.isSuccessResponse = false;
            vm.isErrorResponse = false;
        }

        /**
         * Search for organization
         * @return {array}
         */
        function search() {
            console.log(vm.organization);
            console.log('searching');
        }

        /**
         * Get organization type
         * @return {array}
         */
        function getOrganizationType() {

            OrganizationService.getOrganizationType().then(function(successResponse) {
                if (successResponse.status === 200) {
                    vm.organizationType = successResponse.data;
                }
            }, handleErrorResponse);

        }

        function getStates() {
            OrganizationService.getStates().then(function(successResponse) {
                if (successResponse.status === 200) {
                    vm.states = successResponse.data;
                }
            }, handleErrorResponse);
        }

        function getCitiesByState(state) {
            showLoadingIndicator();
            OrganizationService.getCitiesByState(state).then(function(successResponse) {
                if (successResponse.status === 200) {
                    vm.cities = successResponse.data;
                    hideLoadingIndicator();
                }
            }, handleErrorResponse);
        }

        function handleErrorResponse(errorResponse) {
            vm.isSearching = false;
            console.log(errorResponse);
        }

        function showLoadingIndicator () {
            vm.isSearching = true;
        }

        function hideLoadingIndicator () {
            $timeout(function  () {
                vm.isSearching = false;
            }, 600);
        }
    }
})();
