var start = "Waterloo, ON";
var end = "Toronto, ON";

var routes = [
  ["Guelph, ON", "Milton, ON"],
  ["Hamilton, ON"]
];

function initMap() {
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 6,
    center: {
      lat: 43.4667,
      lng: -80.5167
    }
  });
  directionsDisplay.setMap(map);

  $("#go").click(function() {
    calculateAndDisplayRoute(directionsService, directionsDisplay);
  });

}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
  var waypts = [];
  var stops = routes[parseInt($("#route").val())];
  for (var i = 0; i < stops.length; i++) {
    waypts.push({
      location: stops[i],
      stopover: true
    });
  }

  console.log(waypts);

  directionsService.route({
    origin: start,
    destination: end,
    waypoints: waypts,
    optimizeWaypoints: true,
    travelMode: google.maps.TravelMode.DRIVING
  }, function(response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}