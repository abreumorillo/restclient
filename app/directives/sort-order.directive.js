/**
 * This directive is used for showing the sorting widget, in order to perform its operation it needs
 * a sorting option object with the following information: predicate, isGValuePredicateActivated (this is used for the G Value calculated) and reverse
 * Also the sorting by field it is needed as well.
 * All the values are handle in the insolated scope of the directive
 */
(function() {
    'use strict';

    angular
        .module('myApp')
        .directive('ptSortOrder', sortOrder);

    sortOrder.$inject = [];

    /* @ngInject */
    function sortOrder() {
        var directive = {
            replace: true, //replace the content of the custom widget with the HTML markup
            restrict: 'AE',
            templateUrl: '/app/directives/templates/sort-order.html',
            scope: {
                sortingOption: '=',
                sortingBy: '@'
            },
            controller: ['$scope', function($scope) {
                $scope.isActivePredicate = function() {
                    if ($scope.sortingOption.predicate === $scope.sortingBy) {
                        return true;
                    }
                    return false;
                };
            }]
        };
        return directive;
    }
})();
