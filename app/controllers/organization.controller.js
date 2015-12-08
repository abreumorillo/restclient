(function() {
    'use strict';

    angular
        .module('myApp')
        .controller('OrganizationController', OrganizationController);

    OrganizationController.$inject = ['OrganizationService', '$stateParams', 'OrganizationDetail', '$scope', '$log'];

    /* @ngInject */
    function OrganizationController(OrganizationService, $stateParams, OrganizationDetail, $scope, $log) {
        var vm = this,
            selected = null,
            previous = null,
            isLoaded = false,
            organizationId = 0;

        //\/\/\/\/\/\/\
        // vm.tabs = [];
        vm.isSearching = false;

        //\/\/\\\//\ FUNCTIONS /\/\/\/\/\
        vm.onTabClicked = onTabClicked;
        // vm.onTabClicked = null;
        activate();

        ////////////////

        vm.tabs = [{
            Tab: ""
        }];
        vm.selectedIndex = 0;

        function activate() {

            organizationId = $stateParams.id;
            OrganizationDetail.getTabs(organizationId).then(function(successResponse) {
                    if (successResponse.status === 200) {
                        var tabs = successResponse.data;
                        if (tabs.length > 0) {
                            vm.tabs = tabs;
                            isLoaded = true;
                            vm.selectedIndex = 0;
                        }
                    }
                }, handleErrorResponse)
                .then(function() {
                    var tabName = vm.tabs[vm.selectedIndex].Tab;
                    getTabInfo(tabName);
                });
        }

        function getTabInfo(tabName) {
            OrganizationDetail.getTabInfo(organizationId, tabName).then(function(successResponse) {
                console.log('success', successResponse);
            }, handleErrorResponse);
        }


        /**
         * Handle response error
         * @param  {[mix} errorResponse
         * @return {mix}
         */
        function handleErrorResponse(errorResponse) {
            console.log(errorResponse);
            toastr.error('An error has occurred');
            isLoaded = false;
        }

        /**
         * Show loading indicator overlay
         * @return {[type]} [description]
         */
        function showLoadingIndicator() {
            vm.isSearching = true;
        }

        /**
         * Hide loading indicator overlay
         * @return {[type]} [description]
         */
        function hideLoadingIndicator() {
            $timeout(function() {
                vm.isSearching = false;
            }, 600);
        }

        function onTabClicked() {
            var tabName = vm.tabs[vm.selectedIndex].Tab;
            console.log(vm.selectedIndex, tabName);
            getTabInfo(tabName);
        }

    }
})();
