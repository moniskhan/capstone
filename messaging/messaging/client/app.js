// Get messages
Template.messages.helpers({
  messages: Messages.find({})
});

// User registration requires username and email
Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_EMAIL'
});

Template.registerHelper('currentChannel', function () {
	return Session.get('channel');
});

// Get username
Template.registerHelper("usernameFromId", function (userId) {
    var user = Meteor.users.findOne({_id: userId});
    if (typeof user === "undefined") {
        return "Anonymous";
    }

    // TODO: change to facebook
    if (typeof user.services.github !== "undefined") {
        return user.services.github.username;
    }
    return user.username;
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

Meteor.subscribe('messages'); // Get messages
Meteor.subscribe('allUsernames'); // get usernames associated with messages