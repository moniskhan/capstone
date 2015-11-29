'use strict';


var factories = angular.module('ChillFlix.factories', ['ngResource']);

factories.factory('userFactory', ['$resource', 'config', function($resource, config) {
    return $resource(config.ENDPOINT.api + '/' + config.ENDPOINT.users + '/:id');
}]);


factories.factory('showFactory', ['$resource', 'config', function($resource, config) {
    return $resource(config.ENDPOINT.api + '/' + config.ENDPOINT.shows + '/:id');
}]);


factories.factory('locationFactory', ['$resource', 'config', function($resource, config) {
    return $resource(config.ENDPOINT.api + '/' + config.ENDPOINT.locations + '/:id');
}]);


factories.factory('interestFactory', ['$resource', 'config', function($resource, config) {
    return $resource(config.ENDPOINT.api + '/' + config.ENDPOINT.interests + '/:id');
}]);


factories.factory('eventFactory', ['$resource', 'config', function($resource, config) {
    return $resource(config.ENDPOINT.api + '/' + config.ENDPOINT.events + '/:id');
}]);

