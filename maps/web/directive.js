'use strict';


var directives = angular.module('ChillFlix.directives', []);

directives.directive('mapsDirective', function() {
    return {
        scope: { 
            users: '=userModel',
            events: '=eventModel',
            center: '=',
            bounds: '=',
            mapOptions: '=',
            clusterOptions: '=',
            markerOptions: '=',
            selectUser: '=',
            selectEvent: '=',
            mapObject: '=',
            meLocation: '=',
            meProximity: '='
        },
        restrict: 'A',
        controller: [
            '$scope',
            function($scope) {
                $scope.selectedMarker = null;
                var _map = null;
                var _directionService = null;
                var _directionDisplay = null;

                var _my_location = null;

                $scope.setSelected = this.setSelected = function(marker) {
                    $scope.$apply(function() {
                        $scope.selectedMarker = marker;
                    });
                };

                $scope.getSelected = this.getSelected = function() {
                    return $scope.selectedMarker;
                };

                $scope.setCurrentMap = this.setCurrentMap = function(map) {
                    $scope.mapObject = map;
                    _map = map;
                };

                $scope.getMap = this.getMap = function() {
                    return _map;
                };

                $scope.setDirectionService = this.setDirectionService = function(service, display) {
                    _directionService = service;
                    _directionDisplay = display;
                };


                $scope.routeTo = this.routeTo = function(origin, dest) {
                    _directionService.route({
                        origin: origin,
                        destination: dest,
                        optimizeWaypoints: true,
                        travelMode: google.maps.TravelMode.DRIVING
                    }, function(response, status) {
                        if (status === google.maps.DirectionsStatus.OK) {
                            _directionDisplay.setDirections(response);
                        } 
                    });
                };

                $scope.setMyLocation = this.setMyLocation = function(location) {
                    _my_location = location;
                };
                
                $scope.getMyLocation = this.getMyLocation = function() {
                    return _my_location;
                }

            }
        ],
        link: function(scope, element, attrs) {

            function latLngLocation(location) {
                return new google.maps.LatLng(location.latitude, location.longitude);
            }
            function latLngPair(lat, lng) {
                return new google.maps.LatLng(lat, lng);
            }

            if (!scope.mapOptions) scope.mapOptions = {};
            angular.extend(scope.mapOptions, {center: latLngLocation(scope.center)});
            var map = new google.maps.Map(element[0], scope.mapOptions);
            scope.setCurrentMap(map);

            // Set initial bounds
            if (scope.bounds && scope.bounds.south && scope.bounds.north &&
                  scope.bounds.east && scope.bounds.west) {
                var sw = latLngPair(scope.bounds.south, scope.bounds.west);
                var ne = latLngPair(scope.bounds.north, scope.bounds.east);
                map.fitBounds(new google.maps.LatLngBounds(sw, ne));
            }

            // markers
            var markers = [];
            var markerEvents = [];
            var markerCluster = new MarkerClusterer(map, [], scope.clusterOptions);
            var myMarker = null;

            function insertMarker(objType, object, showOnMap) {
                var labelContent = '';

                if (objType == 'user') {
                    labelContent = '<div class="circle"><span class="glyphicon glyphicon-user"></span></div>';
                } else if (objType == 'event') {
                    labelContent = '<div class="circle"><span class="glyphicon glyphicon-flag"></span></div>';
                }
                
                var options = {
                    position: latLngLocation({latitude: object.location.lat, longitude: object.location.lng}),
                    map: map,
                    content: labelContent,
                    shadow: '0'
                };
                
                angular.extend(options, scope.markerOptions);

                var marker = new RichMarker(options);

                if (showOnMap) {
                    //marker.setMap(map);

                    var clickEvent = google.maps.event.addListener(marker, 'click', function() {
                        if (objType == 'user') {
                            scope.selectUser(object);
                        } else if (objType == 'event') {
                            scope.selectEvent(object);
                        }
                        scope.setSelected(object);
                    });

                    markerEvents.push(clickEvent);
                }
                markers.push(marker);
            }
            
            function addDetailedMarkers(listType, list) {
                angular.forEach(list, function(item, index) {
                    insertMarker(listType, item, true);
                });
            }

            function addClusteredMarkers(listType, list) {
                angular.forEach(list, function(item, index) {
                    insertMarker(listType, item, true);
                });
                markerCluster.addMarkers(markers);
            }


            function addMarkers(listType, list) {
                addClusteredMarkers(listType, list);
            }

            function clearMarkers() {
                markerCluster.clearMarkers();
                for (var i = 0; i < markers.length; i++) { markers[i].setMap(null); }
                for (var j = 0; j < markerEvents.length; j++) {
                    markerEvents[j].remove();
                }
                markers.length = 0;
                markerEvents.length = 0;
            }

            // routing
            var directionsService = new google.maps.DirectionsService;
            var directionsDisplay = new google.maps.DirectionsRenderer;
            directionsDisplay.setMap(map);
            scope.setDirectionService(directionsService, directionsDisplay);


            // zoom in one level when double clicked
            google.maps.event.addListener(map, 'dblclick', function(event) {
                map.setCenter(event.latLng);
                if (map.getZoom() + 1) {
                    map.setZoom(map.getZoom() + 1);
                }
            });

            scope.$watchCollection('events', function(newEvents, oldEvents, scope) {
                if (newEvents == null) return;
                clearMarkers();
                addMarkers('event', newEvents);
            });

            scope.$watch('meLocation', function(newValue, oldValue) {
                                console.log("ME LOCATION")
                console.log(newValue);
                if (newValue == null) return;
                var pos = latLngPair(newValue.lat, newValue.lng);
                scope.setMyLocation(pos);

                if (myMarker != null) myMarker.remove();
                var options = {
                    position: pos,
                    map: map,
                    content: '<div class="me"><span class="glyphicon glyphicon-home"></span></div>',
                    shadow: '0'
                };
                
                angular.extend(options, scope.markerOptions);

                myMarker = null;
                myMarker = new RichMarker(options);
                myMarker.setZIndex(9999);
                myMarker.setMap(map);

            }, false);

            /*
            var circle = null;
            scope.$watch('meProximity', function(newValue, oldValue) {

                function withinRadius(circle, latLng) {
                    return circle.getBounds().contains(latLng) && google.maps.geometry.spherical.computeDistanceBetween(circle.getCenter(), latLng) <= circle.getRadius();
                }

                function showMarkersInRange(markers, circle, map) {
                    // only show markers within the circle
                    for (var i = 0; i < markers.length; i++) {
                        if (withinRadius(circle, markers[i].getPosition())) {
                            if (markers[i].getMap() == null) markers[i].setMap(map);
                        } else {
                            if (markers[i].getMap() != null) markers[i].setMap(null);
                        }
                    }
                }

                if (circle == null) {
                    circle = new google.maps.Circle({
                        map: map,
                        radius: 1000,
                    });
                    circle.bindTo('center', myMarker, 'position');
                }
                
                circle.setRadius(newValue * 100);
                showMarkersInRange(markers, circle, map);
            });
            */
        }
    };
});




directives.directive('mapsWindow', function() {
    return {
        scope: {
            events: '='
        },
        require: '^mapsDirective',
        link: function mapsWindow(scope, element, attrs, controller) {
            scope.$watchCollection(controller.getSelected, function(marker) {
                if (marker == null) return;


                function windowContent(marker, position) {
                    var container = document.createElement('div');
                    var event = document.createElement('div');
                    event.innerHTML = '<b>Event: </b>' + marker.show.name + '<br/>';
                    var owner = document.createElement('div');
                    owner.innerHTML = '<b>Owner: </b>' + marker.owner.name + '<br/>';
                    var particients = document.createElement('div');
                    particients.innerHTML = '<b>Particients: </b>' + marker.particients.length + '<br/>';
                    var route = document.createElement('button');
                    route.innerHTML = 'Route';

                    route.onclick = function() {
                        controller.routeTo(controller.getMyLocation(),position);
                    }

                    container.appendChild(event);
                    container.appendChild(owner);
                    container.appendChild(particients);
                    container.appendChild(route);

                    return container;

                }

                var position = new google.maps.LatLng(
                    marker.location.lat,
                    marker.location.lng
                );

                var infoBox = new google.maps.InfoWindow({
                    content: windowContent(marker, position)
                });


                infoBox.setPosition(position);
                infoBox.open(controller.getMap());
            });

        }
    };
});