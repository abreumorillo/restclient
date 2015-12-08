(function() {
    'use strict';

    angular
        .module('myApp')
        .controller('IndexController', IndexController);

    IndexController.$inject = ['$q', 'OrganizationService', '$timeout', 'toastr', 'SortingService', '$state'];

    /* @ngInject */
    function IndexController($q, OrganizationService, $timeout, toastr, SortingService, $state) {
        var vm = this,
            predicate = 'type',
            reverse = true;

        //\/\/\/\\/
        vm.organization = {};
        vm.organizations = [];
        vm.isSearchResult = false;
        vm.isSearching = false;
        vm.isSuccessResponse = false;
        vm.isErrorResponse = false;

        vm.organizationType = [];
        vm.states = [];
        vm.cities = [];
        vm.isShowSearch = true;

        //\/\/\/\ Sorting option /\/\/\/\
        vm.sortingOption = {
            predicate: predicate,
            reverse: reverse
        };
        vm.sortByField = sortByField;

        //\/\/\/\/\/\ FUNCTIONS /\/\/\/\/\
        vm.clearForm = clearForm;
        vm.search = search;
        vm.getCitiesByState = getCitiesByState;
        vm.showSearch = showSearch;
        vm.getOrganizationDetails = getOrganizationDetails;

        //Pagination options
        vm.totalItems = 0;
        vm.currentPage = 1;
        vm.itemPerPage = 8;
        vm.paginate = paginate;
        vm.pageChanged = pageChanged;
        vm.isPaging = false;
        /***
         * Function execute every time we interact with the pagination control
         */
        function pageChanged() {
            vm.isPaging = true;
            $timeout(function() {
                vm.isPaging = false;
            }, 600);
        }

        function paginate(value) {
            var begin, end, index;
            begin = (vm.currentPage - 1) * vm.itemPerPage;
            end = begin + vm.itemPerPage;
            index = vm.organizations.indexOf(value);
            return (begin <= index && index < end);
        }

        activate();

        ////////////////

        function activate() {
            showLoadingIndicator();
            //execute all promises
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
            vm.isSearchResult = false;
        }

        /**
         * Search for organization
         * @return {array}
         */
        function search() {
            vm.organizations = [];
            showLoadingIndicator();
            OrganizationService.searchOrganization(vm.organization).then(function(successResponse) {
                if (successResponse.status === 200) {
                    if (successResponse.data.length > 0) {
                        var data = successResponse.data;
                        vm.totalItems = successResponse.data.length;
                        vm.organizations = successResponse.data;
                        vm.isSearchResult = true;
                        vm.isShowSearch = false;
                    } else {
                        vm.isSearchResult = false;
                        vm.isShowSearch = true;
                    }

                }
                hideLoadingIndicator();
            }, handleErrorResponse);
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

        /**
         * Get the list of state
         * @return {array}
         */
        function getStates() {
            OrganizationService.getStates().then(function(successResponse) {
                if (successResponse.status === 200) {
                    vm.states = successResponse.data;
                }
            }, handleErrorResponse);
        }

        /**
         * Get cities by a given state
         * @param  {string} state abbr name of the state
         * @return {array}
         */
        function getCitiesByState(state) {
            showLoadingIndicator();
            OrganizationService.getCitiesByState(state).then(function(successResponse) {
                if (successResponse.status === 200) {
                    vm.cities = successResponse.data;
                    hideLoadingIndicator();
                }
            }, handleErrorResponse);
        }

        /**
         * Handle response error
         * @param  {[mix} errorResponse
         * @return {mix}
         */
        function handleErrorResponse(errorResponse) {
            vm.isSearching = false;
            toastr.error('An error has occurred');
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

        /**
         * Wheather to show or not the search widget
         * @return {[type]} [description]
         */
        function showSearch() {
            vm.isShowSearch = !vm.isShowSearch;
        }

        /**
         * Sort shock data
         * @param fieldName
         */
        function sortByField(fieldName) {
            reverse = !reverse;
            setSortingOption(fieldName, reverse);
            vm.organizations = SortingService.sortByField(vm.organizations, vm.sortingOption);
        }

        /**
         * Set the sorting options. The properties of this objects are also passed to the custom widget directive.
         * The directive is ptSortOrder {{sortoder.directive.js}}
         * @param predicate string
         * @param reverse boolean
         */
        function setSortingOption(predicate, reverse) {
            vm.sortingOption = {
                predicate: predicate,
                reverse: reverse
            };
        }

        /**
         * Get details for an organization
         * @param  {strin} organizationId
         * @return {mix}
         */
        function getOrganizationDetails(organizationId) {
            $state.go('organization', {
                id: organizationId
            });
        }
    }
})();
