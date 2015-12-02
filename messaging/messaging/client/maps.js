
if (Meteor.isClient) {

  Template.maps.onRendered(function() {
    GoogleMaps.load({ 
      v: '3', 
      key: 'AIzaSyCQRRbcGrszCYCTU0qiKErSr__zBbfS5iw', 
      libraries: 'geometry' });
    GoogleMaps.loadUtilityLibrary('//google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/src/infobox.js');
    GoogleMaps.loadUtilityLibrary('//google-maps-utility-library-v3.googlecode.com/svn/trunk/markerwithlabel/src/markerwithlabel.js');
    GoogleMaps.loadUtilityLibrary('//google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/src/markerclusterer.js');
    GoogleMaps.loadUtilityLibrary('//google-maps-utility-library-v3.googlecode.com/svn/trunk/richmarker/src/richmarker-compiled.js');

    console.log("GOING TO MAPS");

  });

  function randNum(min, max) {
    return Math.random() * (max - min) + min;
  }

  var baseLocation = {
    lat: 43.4667,
    lng: -80.5167
  };

  var eventsList = [];

  var markers = [];
  var markerEvents = [];

  var objList = [];
  var myLocation = null;
  var myLocationMarker = null;
  var markerCluster = null;

  var directionsService = null;
  var directionsDisplay = null;

  Template.googlemapscontainer.helpers({
    exampleMapOptions: function() {
      console.log("Template.googlemapscontainer helper")
      // Make sure the maps API has loaded
      if (GoogleMaps.loaded()) {
        console.log("GoogleMaps.loaded()");
        // Map initialization options
        return {
          center: new google.maps.LatLng(baseLocation.lat, baseLocation.lng),
          zoom: 12,
          disableDefaultUI: true
        };
      }
    }
  });

  function generateList() {
      var list = [];
      for (var i = 0; i < 100; i++) {
          list.push({
            location: {
              lng: baseLocation.lng + randNum(-0.05, 0.05),
              lat: baseLocation.lat + randNum(-0.05, 0.05)
            }
        });
      }
      return list;
  }

  function searchEvents(query) {
    showsList = Shows.find();
    var list = [];

    showsList.observe({
      added: function (doc) {
        list.push({
            location: {
              lng: doc.longitude,
              lat: doc.latitude
            }
        });
        // Add code to refresh heat map with the updated airportArray
      }
    });
    
    return list;
  }


  Template.body.events({
    "submit .new-task": function (event) {
      // Prevent default browser form submit
      event.preventDefault();
 
      // Get value from form element
      var text = event.target.text.value;
    
      eventsList = searchEvents(text);
      updateMap();

      // Clear form
      event.target.text.value = "";
    }
  });



  // map functions
  // --------------------------------------------------------
  function addToMarkers(object) {
      var labelContent = '<span class="fa-stack fa-lg">'+
                          '<i class="fa fa-circle-thin fa-stack-2x"></i>'+
                          '<i class="fa fa-flag fa-stack-1x"></i>'+
                          '</span>';
      
      console.log(object.location);

      var options = {
          position: new google.maps.LatLng(object.location.lat, object.location.lng),
          map: GoogleMaps.maps.exampleMap.instance,
          content: labelContent,
          shadow: '0'
      };

      var marker = new RichMarker(options);
      var clickEvent = google.maps.event.addListener(marker, 'click', function() {
              // TODO
        markerSelected(object);
      });

      markerEvents.push(clickEvent);
      markers.push(marker);
  }


  function addToCluster(list) {
      for (var i = 0; i < list.length; i++) {
        addToMarkers(list[i]);
      }
      markerCluster.addMarkers(markers);
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


  function meLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(pos) {
            myLocation = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
            if (myLocationMarker != null) myLocationMarker.remove();
            myLocationMarker = new google.maps.Marker({
              position: myLocation,
              map: GoogleMaps.maps.exampleMap.instance
            });
        });
    }
  }

  function routeTo(origin, dest) {
      directionsService.route({
          origin: origin,
          destination: dest,
          optimizeWaypoints: true,
          travelMode: google.maps.TravelMode.DRIVING
      }, function(response, status) {
          if (status === google.maps.DirectionsStatus.OK) {
              directionsDisplay.setDirections(response);
          } 
      });
  }

  function markerSelected(obj) {
    function windowContent(object, position) {
        var container = document.createElement('div');
        var event = document.createElement('div');
        event.innerHTML = '<b>Event: </b>' + '<br/>';
        var owner = document.createElement('div');
        owner.innerHTML = '<b>Owner: </b>' + '<br/>';
        var particients = document.createElement('div');
        particients.innerHTML = '<b>Particients: </b> 99 <br/>';
        var route = document.createElement('button');
        route.innerHTML = 'Route';

        route.onclick = function() {
            routeTo(myLocation, position);
        }

        container.appendChild(event);
        container.appendChild(owner);
        container.appendChild(particients);
        container.appendChild(route);

        return container;

    }

    var position = new google.maps.LatLng(
        obj.location.lat,
        obj.location.lng
    );

    var infoBox = new google.maps.InfoWindow({
        content: windowContent(obj, position)
    });

    infoBox.setPosition(position);
    infoBox.open(GoogleMaps.maps.exampleMap.instance);
  }

  function updateMap() {
      clearMarkers();
      addToCluster(eventsList);
  }


  Template.googlemapscontainer.onCreated(function() {
    // We can use the `ready` callback to interact with the map API once the map is ready.
    console.log("Template.googlemapscontainer.onCreated");
    GoogleMaps.ready('exampleMap', function(map) {
      console.log("GoogleMaps.ready");
      meLocation();

      markerCluster = new MarkerClusterer(map.instance, [], {
          gridSize: 70,
          maxZoom: 15,
          ignoreHidden: true,
          averageCenter: true,
          minimumClusterSize: 4
      });

      directionsService = new google.maps.DirectionsService;
      directionsDisplay = new google.maps.DirectionsRenderer;
      directionsDisplay.setMap(map.instance);      

      map.instance.addListener('idle', function() {
        clearMarkers();
        addToCluster(eventsList);
      });


      eventsList = searchEvents();
      updateMap();

    });
  });


}