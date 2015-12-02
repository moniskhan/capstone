Meteor.startup(function() {

  Meteor.users.remove({});
  Accounts.createUser({
    username: "test",
    email: "test@example.com",
    password: "testpass"
  });

  Factory.define('message', Messages, {
    text: function() {
    	return Fake.sentence();
    },
    user: Meteor.users.findOne()._id,
    timestamp: Date.now(),
    channel: 'general'
  });

  Factory.define('event', Events, {
    user: Meteor.users.findOne()._id,
    name: function() {
      return Fake.word();
    },
    counter: 0,
    latitude: 43.4667,
    longitude: -80.5167,
    timestamp: Date.now()
  });

  // Add this if you want to remove all messages before seeding
  Messages.remove({});
  Events.remove({});

  if (Messages.find({}).count() === 0) {
    _(10).times(function(n) {
      Factory.create('message');
    });
  }

  if (Events.find({}).count() === 0) {
    _(10).times(function(n) {
      Factory.create('event');
    });
  }

  Channels.remove({});
  Channels.insert({
    name: "general"
  });

  Channels.insert({
    name: "random"
  });
});