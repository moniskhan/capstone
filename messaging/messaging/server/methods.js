Meteor.methods({
  newMessage: function (message) {
    message.timestamp = Date.now();
    message.user = Meteor.userId();
    Messages.insert(message);
  },

  newShow: function (show) {
    var num = Math.random(); // this will get a number between 0 and 1.
    num *= Math.floor(Math.random()*2) == 1 ? 1 : -1; // this will add minus sign in 50% of cases
    show.user = Meteor.userId();
    show.counter = 0;
    show.channel = show.nameShow + Math.floor(Math.random()*100000);
    show.latitude = 43.4667 + num;
    show.longitude = -80.5167 + num;
    Shows.insert(show);
  }
});
