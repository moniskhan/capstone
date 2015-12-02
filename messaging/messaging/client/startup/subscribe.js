Meteor.subscribe('shows');
Meteor.subscribe('channels');
Meteor.subscribe('allUsernames');

Template.messages.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('messages', Session.get('channel'));
  });
});

Template.shows.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('shows');
  });
});