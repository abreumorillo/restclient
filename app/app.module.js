(function() {
    'use strict';

    angular
        .module('myApp', [
            'ngAnimate',
            'ngMessages',
            'ui.router',
            'ngTouch',
            'ngAria',
            'ngSanitize',
            'toastr'
        ])
        .config(['$compileProvider', function($compileProvider) {
            $compileProvider.debugInfoEnabled(false); //Call this method to enable/disable various debug runtime information in the compiler such as adding binding information and a reference to the current scope on to DOM elements.
        }])
        .config(function(toastrConfig) {
            angular.extend(toastrConfig, {
                allowHtml: true,
                positionClass: "toast-bottom-right",
                maxOpened: 1,
                preventDuplicates: true,
                preventOpenDuplicates: true,
            });
        });
})();
