'use strict';

// Declare app level module which depends on views, and components
angular.module('melissa', [
    'ngRoute',
    'melissa.train',
    'melissa.achievements'
]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/train'});
    }]);
