Meteor.startup(function() {

  Meteor.users.remove({});
  Accounts.createUser({
    username: "test",
    email: "test@example.com",
    password: "testpass"
  });

  function randNum(min, max) {
    return Math.random() * (max - min) + min;
  }

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
    latitude: function() {
      return 43.4667 + randNum(-0.5, 0.5);
    },
    longitude: function() {
      return -80.5167 + randNum(-0.5, 0.5);
    },
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