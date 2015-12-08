(function() {
    'use strict';

    angular
        .module('myApp')
        .factory('OrganizationDetail', OrganizationDetail);

    OrganizationDetail.$inject = ['$http', '$q', 'appConfig', 'CommonService'];

    /* @ngInject */
    function OrganizationDetail($http, $q, appConfig, CommonService) {

        var service = {
                getTabs: getTabs,
                getTabInfo: _getTabInfo
            },
            url = appConfig.serviceUrl;
        return service;

        ////////////////

        function getTabs(organizationId) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: url,
                params: {
                    path: "/Application/Tabs?orgId=" + organizationId
                },
                responseType: 'document'
            }).success(function(data, status) {
                var result = CommonService.parseXml(data, true);
                deferred.resolve({
                    data: result,
                    status: status
                });
            }).error(function(error, status) {
                deferred.reject({
                    error: error,
                    status: status
                });
            });
            return deferred.promise;
        }

        /**
         * Get the information related to a tab
         * @param  {string} organizationId  id of the organization
         * @param  {string} tabName        name of the organization
         * @return {object}                information related to the selected tab
         */
        function _getTabInfo(organizationId, tabName) {
            // path=/2370/General
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: url,
                params: {
                    path: '/' + organizationId + '/' + tabName
                },
                responseType: 'document'
            }).success(function(data, status) {
                var result = CommonService.xmlToJson(data);
                deferred.resolve({
                    data: result.data,
                    status: status
                });
            }).error(function(error, status) {
                deferred.reject({
                    error: error,
                    status: status
                });
            });
            return deferred.promise;
        }



    }
})();
