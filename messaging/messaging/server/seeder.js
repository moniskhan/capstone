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
    channel:function() {
      return "test" + Math.floor(Math.random()*100000);
    },
    counter: 0,
    loc: function() {
      // format [<longitude, latitude>]
      return [-80.5167 + randNum(-0.15, 0.15), 43.4667 + randNum(-0.15, 0.15)];
    },
    timestamp: Date.now()
  });

  // Add this if you want to remove all messages before seeding
  Messages.remove({});
  Shows.remove({});
  Channels.remove({});

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
  
  Channels.insert({
    name: "general"
  });

  Channels.insert({
    name: "random"
  });
});