var faker = require('faker');
var _ = require('underscore');

/*
    users
        - id
        - name
        - email

    shows 
        - id
        - name
        - description
        - type

    locations
        - id
        - address
        - city
        - long
        - lat

    interests
        - id
        - type

    events
        - id
        - start date
        - end date
        - owner
        - particients
        - show
        - location
*/

function rand(min, max) {
  return Math.random() * (max - min) + min;
}


module.exports = function() {
  var data = { 
    users: [], 
    shows: [],
    locations: [],
    events: [],
    interests: []   // maybe not?
  };

  var numOfUsers = 1000;
  var numOfShows = 50;
  var numOfInterests = 50;
  var numOfLocations = 1000;
  var numOfEvents = 100;



  // create interests
  for (var i = 0; i < numOfInterests; i++) {
    data.interests.push({
        id: i + 1, 
        type: _.sample(["action", "animation", "comedy", "documentry", 
            "family", "film-noir", "horror", "musical", "romance", 
            "sport", "war", "adventure", "biography", "crime", "drama",
            "fantasy", "history", "music", "mystery", "sci-fi", "thriller",
            "western"])
    });
  }

  // create shows
  for (var i = 0; i < numOfShows; i++) {
    data.shows.push({
        id: i + 1,
        name: faker.Lorem.sentence(),
        description: faker.Lorem.paragraph(),
        type: [data.interests[_.random(0, numOfInterests-1)]]
    });
  }

  // create location
  var baseLocation = {
    lat: 43.4667,
    lng: -80.5167
  };

  for (var i = 0; i < numOfLocations; i++) {
    data.locations.push({
        id: i + 1,
        address: faker.Address.streetAddress(),
        city: "Waterloo",
        lng: baseLocation.lng + rand(-0.05, 0.05),
        lat: baseLocation.lat + + rand(-0.05, 0.05)
    });
  }

  // Create users
  for (var i = 0; i < numOfUsers; i++) {
    data.users.push({
     id: i + 1, 
     name: faker.Name.findName(),
     email: faker.Internet.email(),
     location: _.sample(data.locations)
    });
  }

  // create event
  for (var i = 0; i < numOfEvents; i++) {
    var date1 = new Date();
    date1.setDate(date1.getDate() + 2);
    var date2 = new Date();
    date2.setDate(date2.getDate() + 30);

    data.events.push({
        id: i + 1,
        date: faker.Date.between(date1, date2),
        owner: _.sample(data.users),
        particients: _.sample(data.users, _.random(1, 5)),
        show: _.sample(data.shows),
        location: _.sample(data.locations)
    });
  }

  return data;
}
