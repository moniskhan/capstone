Meteor.publish('messages', function (channel) {
    return Messages.find({channel: channel});
});

Meteor.publish("allUsernames", function () {
  return Meteor.users.find({}, {fields: {
    "username": 1,
    "services.facebook.username": 1
  }});
});

Meteor.publish('channels', function () {
    return Shows.find({}, {fields: {
    "channel": 1
  }});
  // return Channels.find();
});

Meteor.publish('shows', function () {
    return Shows.find();
});