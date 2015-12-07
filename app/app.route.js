(function() {
    'use strict';

    angular
        .module('myApp')
        .config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
            function($stateProvider, $urlRouterProvider) {
                // For any unmatched url, redirect to /index
                $urlRouterProvider.otherwise("/index");
                //$locationProvider.html5Mode(true).hashPrefix('!');
                // Now set up the states
                $stateProvider
                    .state('index', {
                        url: "/index",
                        controller: 'IndexController',
                        controllerAs: 'vm',
                        templateUrl: "app/views/index.html"
                    })
                    .state('organization', {
                        url: '/organization/:id',
                        controller: 'OrganizationController',
                        controllerAs: 'vm',
                        templateUrl: 'app/views/organization.html'
                    });
            }
        ]);
})();
