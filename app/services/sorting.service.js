(function () {
    'use strict';

    angular
        .module('myApp')
        .factory('SortingService', SortingService);

    SortingService.$inject = ['$filter'];

    function SortingService($filter)
    {
        var orderBy = $filter('orderBy');
        var service = {
            sortByField: _sortByField
        };

        return service;

        ////////////////
        /**
         * Execute the angular orderBy out of box filter
         * @param data, array of data to be filtered
         * @param options, it contains the predicate as well as the order
         * @returns {array}
         * @private
         */
        function _sortByField(data, options) {
            return orderBy(data, options.predicate, options.reverse);
        }
    }
})();