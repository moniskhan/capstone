// Get messages
Template.messages.helpers({
  messages: Messages.find({})
});

Template.shows.helpers({
    shows: function () {
        return Shows.find();
    }
});

// User registration requires username and email
Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_EMAIL'
});

Template.registerHelper('currentChannel', function () {
	return Session.get('channel');
});

Template.registerHelper("username", function () {
    var currentUser = Meteor.user();
    if(currentUser == null)    return "Anonymous";
    if(currentUser.username != null)   return currentUser.username;
    return currentUser.profile.name;
});

// Get username
Template.registerHelper("usernameFromId", function (userId) {
    var user = Meteor.users.findOne({_id: userId});
    if (typeof user === "undefined") {
        return "Anonymous";
    }

    // TODO: change to facebook
    if (typeof user.services.facebook !== "undefined") {
        return user.services.facebook.username;
    }
    return user.username;
});

Template.registerHelper("profilePicture", function () { //We should return image in the form of Base64 from db
    // if(Meteor.user().services.facebook) { 
    //     return "http://graph.facebook.com/" + Meteor.user().services.facebook.id + "/picture/?type=large";
    // }
    return "https://pbs.twimg.com/profile_images/378800000822867536/3f5a00acf72df93528b6bb7cd0a4fd0c.jpeg";
});

// Get time message was sent
Template.registerHelper("timestampToTime", function (timestamp) {
    var date = new Date(timestamp);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    return hours + ':' + minutes.substr(minutes.length-2) + ':' + seconds.substr(seconds.length-2);
});

Template.listings.helpers({
    channels: function () {
        return Channels.find();
    }
});

Template.channel.helpers({
	active: function () {
		if (Session.get('channel') === this.name) {
			return "active";
		} else {
			return "";
		}
	}
});

Meteor.subscribe('shows'); // Get messages
Meteor.subscribe('messages'); // Get messages
Meteor.subscribe('allUsernames'); // get usernames associated with messages