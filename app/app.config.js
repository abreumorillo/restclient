(function() {
    'use strict';
    var appConfig = {
        serviceUrl:  "http://people.rit.edu/dmgics/754/23/proxy.php",
        statusCode: {
            HTTP_OK: 200,
            HTTP_NOT_FOUND: 404,
            HTTP_SERVER_ERROR: 500
        }
    };

    angular
        .module('myApp')
        .constant('appConfig', appConfig);
})();
