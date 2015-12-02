Meteor.methods({
  newMessage: function (message) {
    message.timestamp = Date.now();
    message.user = Meteor.userId();
    Messages.insert(message);
  },

  newEvent: function (occurence) {
  	var num = Math.random(); // this will get a number between 0 and 1.
	  num *= Math.floor(Math.random()*2) == 1 ? 1 : -1; // this will add minus sign in 50% of cases
	
    occurence.timestamp = Date.now();
    occurence.user = Meteor.userId();
    occurence.nameShow = "Dr. Who";
    occurence.counter = 0;
    occurence.latitude = 43.4667 + num;
    occurence.longitude = -80.5167 + num;
    Shows.insert(occurence);
  }
});
