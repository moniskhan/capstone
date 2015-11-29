'use strict';


var controllers = angular.module('ChillFlix.controllers', []);

controllers.controller('mapsController', ['$scope', 'userFactory', 'eventFactory', 
    function($scope, userFactory, eventFactory) {

        $scope.geoLocation = null;

        $scope.users = [];
        $scope.events = [];

        $scope.map = {
            center: {
                latitude: 43.4667,
                longitude: -80.5167
            },
            options: {
                zoom: 12,
                disableDoubleClickZoom: true,
                disableDefaultUI: true
            }, 
            bounds: {},
            markerOptions: {

            },
            clusterOptions: {
                gridSize: 70,
                maxZoom: 15,
                ignoreHidden: true,
                averageCenter: true,
                minimumClusterSize: 4
            },
            markerResults: []
        };

        $scope.init = function() {
            
            
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(pos) {
                    $scope.$apply(function() {
                        $scope.geoLocation = {
                            lat: 43.4667, //pos.coords.latitude,
                            lng: -80.5167 //pos.coords.longitude
                        };
                    });
                });
            }
            
            

            /*
            $scope.geoLocation = {
                latitude: 43.4667,
                longitude: -80.5167
            };
            */


            userFactory.query(function(userList) {
                $scope.users = userList;
                eventFactory.query(function(eventList) {
                    $scope.events = eventList;
                });
            });
        };

        $scope.clickMarker = function() {
            console.log("CLicked");
        };


        // search
        $scope.slider = {
            value: 100,
            options: {
                floor: 10,
                ceil: 100
            }
        };

        $scope.search = function() {
            if ($scope.search) {
                var show = $scope.search.show;
                var genre = $scope.search.interest;
                var searchOptions = {};
                if (show != null && show != '') searchOptions['show.name'] = show;
                //magni modi repellendus
                eventFactory.query(searchOptions, function(eventList) {
                    $scope.events = eventList;
                });
                
            }
        };

}]);




