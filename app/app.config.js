(function() {
    'use strict';
    var appConfig = {
        serviceUrl:  "http://people.rit.edu/dmgics/754/23/proxy.php",
    };

    angular
        .module('myApp')
        .constant('appConfig', appConfig);
})();
