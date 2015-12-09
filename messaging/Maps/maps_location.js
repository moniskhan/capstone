var baseLocation = {
  lat: 43.4667,
  lng: -80.5167
};

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function genRandMarkers(pos) {
  var markers = [];
  for (var i = 0; i < 100; i++)
    markers.push(new google.maps.Marker({
      position: {
        lat: pos.lat + rand(-0.05, 0.05),
        lng: pos.lng + rand(-0.05, 0.05)
      }
    }));
  return markers;
}

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

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: baseLocation,
    zoom: 14
  });

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {

      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      var marker = new google.maps.Marker({
        position: pos,
        map: map,
        title: 'Current Position!',
        icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
      });

      map.setCenter(pos);

      var otherMarkers = genRandMarkers(pos);

      var circle = new google.maps.Circle({
        map: map,
        radius: 1000,
      });
      circle.bindTo('center', marker, 'position');

      showMarkersInRange(otherMarkers, circle, map);

      // slider events
      $("#distance").on("input", function() {
        circle.setRadius(parseInt($("#distance").val(), 10));
        showMarkersInRange(otherMarkers, circle, map);
      });

    }, function() {
      handleLocationError(true, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, pos) {
  console.log(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
}