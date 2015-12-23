(function() {
    'use strict';

    angular
        .module('myApp')
        .controller('OrganizationController', OrganizationController);

    OrganizationController.$inject = ['OrganizationService', '$stateParams', 'OrganizationDetail', '$scope', '$log', 'CommonService', '$timeout', 'toastr'];

    /* @ngInject */
    function OrganizationController(OrganizationService, $stateParams, OrganizationDetail, $scope, $log, CommonService, $timeout, toastr) {
        var vm = this,
            selected = null,
            previous = null,
            isLoaded = false,
            organizationId = 0,
            geocoder,
            map = null,
            marker,
            mapOptions = { //map option for google map
                zoom: 14
            };

        //\/\/\/\/\/\/\
        // vm.tabs = [];
        vm.isSearching = false;
        vm.tabTemplate = '';
        vm.tabData = {};
        vm.selectedSite = {};
        vm.people = [];


        //\/\/\\\//\ FUNCTIONS /\/\/\/\/\
        vm.onTabClicked = onTabClicked;
        vm.getCount = getCount;
        vm.renderMap = renderMap;
        vm.getSiteInfo = getSiteInfo;
        vm.onSelectedSite = onSelectedSite;
        // vm.onTabClicked = null;
        activate();

        ////////////////

        vm.tabs = [{
            Tab: ""
        }];
        vm.selectedIndex = 0;

        /**
         * Function activated on controller load
         * @return {mix}
         */
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
            geocoder = new google.maps.Geocoder();
        }

        /**
         * Get tab information from the api, it also switch the appropriate template
         * @param  {string} tabName name of the tab
         * @return {mix}
         */
        function getTabInfo(tabName) {
            switch (tabName) {
                case 'General':
                    vm.tabTemplate = 'app/views/partials/tab.general.html';
                    break;
                case 'Locations':
                    vm.tabTemplate = 'app/views/partials/tab.locations.html';
                    break;
                case 'Facilities':
                    vm.tabTemplate = 'app/views/partials/tab.facilities.html';
                    break;
                case 'Treatment':
                    vm.tabTemplate = 'app/views/partials/tab.treatment.html';
                    break;
                case 'Training':
                    vm.tabTemplate = 'app/views/partials/tab.training.html';
                    break;
                case 'Equipment':
                    vm.tabTemplate = 'app/views/partials/tab.equipment.html';
                    break;
                case 'People':
                    vm.tabTemplate = 'app/views/partials/tab.people.html';
                    break;
                case 'Physicians':
                    vm.tabTemplate = 'app/views/partials/tab.physicians.html';
                    break;
            }
            OrganizationDetail.getTabInfo(organizationId, tabName).then(function(successResponse) {
                vm.tabData = {};
                vm.tabData = successResponse.data;
                if (vm.tabData && vm.tabData.count) {
                    vm.tabData.count = getCount(vm.tabData.count);
                    if (tabName === 'Locations' && vm.tabData.count >= 1) {
                        if (vm.tabData.count === 1) {
                            vm.selectedLocation = vm.tabData.location;
                        } else {
                            vm.selectedLocation = vm.tabData.location[0];
                        }
                        $timeout(function() {
                            renderMap(vm.selectedLocation);
                        }, 100);
                    }
                }
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

        /**
         * Set the selected tab
         * @return {mix}
         */
        function onTabClicked(tab) {
            getTabInfo(tab.Tab);
        }

        /**
         * Count the number of element
         * @param  {string} value
         * @return {integer}
         */
        function getCount(value) {
            if (value) {
                return parseInt(value);
            }
            return 0;
        }

        /**
         * Returns an array of object literal locations
         * @param data
         * @returns {Array}
         */
        function getLatLng(lat, lng) {
            return new google.maps.LatLng(lat, lng);
        }

        /**
         * Return the site label for select
         * @param  {integer} index
         * @return {string}
         */
        function getSiteInfo(index) {
            index = parseInt(index) + 1;
            return 'Site ' + index;
        }

        /**
         * Set the selected site
         * @param  {object} site
         * @return {mix}
         */
        function onSelectedSite(site) {
            vm.people = [];
            var personCount = parseInt(site.personCount);
            if (personCount > 1) {
                angular.forEach(site.person, function(item) {
                    vm.people.push(item);
                });
            } else {
                vm.people.push(site.person);
            }
        }

        /**
         * Render the map
         * @param  {object} info
         * @return {mix}
         */
        function renderMap(info) {
            var latLng;
            map = new google.maps.Map(document.getElementById('map-canvas'),
                mapOptions);
            if (info.latitude && info.latitude !== "" && info.latitude !== 'null') {
                latLng = getLatLng(info.latitude, info.longitude);
                map.setCenter(latLng);
                setMapMarker(latLng);
            } else { //if the latitude and longitude are not provided we try using the google geocoder service
                var address = info.address1 + ', ' + info.city + ', ' + info.state;
                geocoder.geocode({
                    'address': address
                }, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        latLng = results[0].geometry.location;
                        map.setCenter(latLng);
                        setMapMarker(latLng);
                    } else {
                        toastr.warning("Geocode was not successful for the following reason: " + status);
                    }
                });
            }
            // Add a new marker at the new plotted point on the polyline.
        }

        /**
         * Display marker on the map
         * @param {mix} latLng
         */
        function setMapMarker(latLng) {
            var marker = new google.maps.Marker({
                position: latLng,
                map: map
            });
        }
    }
})();
