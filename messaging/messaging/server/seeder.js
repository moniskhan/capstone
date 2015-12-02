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

  Factory.define('show', Shows, {
    user: Meteor.users.findOne()._id,
    nameShow: "Dr. Who",
    counter: 0,
    latitude: 43.4667,
    longitude: -80.5167,
    timestamp: Date.now()
  });

  // Add this if you want to remove all messages before seeding
  Messages.remove({});
  Shows.remove({});

  if (Messages.find({}).count() === 0) {
    _(10).times(function(n) {
      Factory.create('message');
    });
  }

  if (Shows.find({}).count() === 0) {
    _(10).times(function(n) {
      Factory.create('show');
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