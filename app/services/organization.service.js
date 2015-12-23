(function() {
    'use strict';

    angular
        .module('myApp')
        .factory('OrganizationService', OrganizationService);

    OrganizationService.$inject = ['$http', '$q', 'appConfig', 'CommonService'];

    /* @ngInject */
    function OrganizationService($http, $q, appConfig, CommonService) {
        var service = {
                getOrganizationType: _getOrganizationType,
                getCitiesByState: _getCitiesByState,
                getStates: _getStates,
                searchOrganization: _searchOrganization
            },
            url = appConfig.serviceUrl;
        return service;

        ////////////////

        function _getOrganizationType() {

            var deferred = $q.defer();

            $http({
                method: 'GET',
                url: url,
                params: {
                    path: '/OrgTypes'
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

        function _getCitiesByState(state) {
            state = state || "NY"; //path: "/Cities?state=" + state
            var deferred = $q.defer();

            $http({
                method: 'GET',
                url: url,
                params: {
                    path: "/Cities?state=" + state
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

        function _getStates() {
            var deferred = $q.defer();

            $http({
                method: 'GET',
                url: url,
                params: {
                    path: '/States'
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

        function _searchOrganization(searchCriteria) {

            var deferred = $q.defer();
            var query = CommonService.buildQuery(searchCriteria);
            $http({
                method: 'GET',
                url: url,
                params: {
                    path: "/Organizations?" + query
                },
                responseType: 'document'
            }).success(function(data, status) {
                //var result = CommonService.parseXml(data, true);
                var result = CommonService.xmlToJson(data);
                deferred.resolve({
                    data: result.data.row,
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


// function getOrgTypes(callback) {
//     $.ajax({
//         type: "GET", //default is get
//         async: true, //default
//         cache: false, //default
//         url: url,
//         data: { path: "/OrgTypes" }, //path only because I'm sending it to the proxy`,
//         dataType: "xml", //default to contents type
//         success: function (data, status) {
//             var opts = "";

//             if ($(data).find("error").length !== 0) {
//                 console.log("AJAX error");
//             } else {
//                 opts += "<option value=''> All Organizations Types</option>";
//                 $("row", data).each(function () {
//                     opts += "<option value = ' " + $(this).find("type").text() + "'>" +
//                     $(this).find("type").text() + "</option>";
//                 });
//             }

//             $("#orgType").html(opts);
//         }
//     });
// }

// function getCities(state) {
//     // Ideally... show information to the user
//     state = state || "NY";

//     $.ajax({
//         type: "GET", //default is get
//         async: true, //default
//         cache: false, //default
//         url: url,
//         data: { path: "/Cities?state=" + state }, //path only because I'm sending it to the proxy`,
//         dataType: "xml", //default to contents type
//         success: function (data, status) {

//             var opts = "<select id='town' name='town'>";
//             if ($(data).find("error").length !== 0) {
//                 console.log("AJAX error");
//             }
//             else if ($(data).find("row").length === 0) {
//                 $("#orgCitySearch").html("There are not cities in " + state);
//                 return;
//             } else {
//                 opts += "<option value=''> All States Cities</option>";
//                 $("row", data).each(function () {
//                     opts += "<option value = '" + $(this).find("city").text() + "'>" +
//                     $(this).find("city").text() + "</option>";
//                 });
//             }
//             opts += "</select>";
//             $("#orgCitySearch").html(opts);
//         }
//     });
// }

// function showResults() {

//     $.ajax({
//         type: "GET", //default is get
//         async: true, //default
//         cache: false, //default
//         url: url,
//         data: { path: "/Organizations?" + $("#searchForm").serialize() }, //path only because I'm sending it to the proxy`,
//         dataType: "xml", //default to contents type
//         success: function (data, status) {
//             var x = "";
//             if ($(data).find('error').length !== 0) {
//                 console.error('AJAX error');
//             } else {
//                 x = "<table id='resultTable' class='tablesorter'>";
//                 x += "<thead>";
//                 x += "<tr>";
//                 x += "<th>ID</th>";
//                 x += "<th>Type</th>";
//                 x += "<th>Name</th>";
//                 x += "<th>Email</th>";
//                 x += "<th>City</th>";
//                 x += "<th>County</th>";
//                 x += "<th>State</th>";
//                 x += "<th>Zip</th>";
//                 x += "</tr>";
//                 x += "</thead>";
//                 x += "<tbody>";

//                 $('row', data).each(function () {
//                     x += "<tr>";
//                     x += "<td>" + $('OrganizationID', this).text() + "</td>";
//                     x += "<td>" + $('type', this).text() + "</td>";
//                     x += "<td>" + $('Name', this).text() + "</td>";
//                     x += "<td>" + $('Email', this).text() + "</td>";
//                     x += "<td>" + $('city', this).text() + "</td>";
//                     x += "<td>" + $('CountyName', this).text() + "</td>";
//                     x += "<td>" + $('State', this).text() + "</td>";
//                     x += "<td>" + $('zip', this).text() + "</td>";
//                     x += "</tr>";
//                 });
//                 x += "</tbody>";
//                 x += "</table>";
//             }

//             $("#tableOutput").html(x); //replaceWith | html
//             $("#resultTable").tablesorter();
//         }
//     });
// }

// function getTabs(id) {
//     $("#tabs").html();
//     $.ajax({
//         type: "GET", //default is get
//         async: true, //default
//         cache: false, //default
//         url: url,
//         data: { path: "/Application/Tabs?orgId=" + id }, //path only because I'm sending it to the proxy`,
//         dataType: "xml", //default to contents type
//         success: function (data, status) {
//             // console.log('data', data);
//             var tabs = '';
//             tabs += "<div id='tabs'>";
//             var tabsContent = '';

//             tabs += '<ul>';
//             if ($(data).find("error").length !== 0) {
//                 console.log("AJAX error");
//             }
//             else if ($(data).find("row").length === 0) {
//                 console.log('Organization does not exist');
//                 return;
//             } else {

//                 $("row", data).each(function (data, index) {
//                     var tabInfo = $(this).find("Tab").text();
//                     tabs += "<li><a href='#" + tabInfo + "'>" + tabInfo + "</a></li>";
//                     tabsContent += "<div id='" + tabInfo + "'>" + tabInfo + "</div>";
//                 });

//                 tabs += "</ul>";
//                 tabs += tabsContent;
//                 tabs += '<div>';
//                 $('#tabContent').html(tabs);
//                 $("#tabs").tabs();
//             }

//         }
//     });
// }

// self.getUsers = function () {
//     $http.get(url, {responseType: "document"}).success(self.handleResponse);

//     setTimeout( function () {
//         self.getUsers();
//     }, 5000);
// };

// self.handleResponse = function (xmlDoc) {
//         self.removeUsers();
//         var whoTags = xmlDoc.getElementsByTagName("who");
//         for (var i = 0; i < whoTags.length; i++) {
//             self.addUser(whoTags[i].firstChild.data);
//         }
// };
