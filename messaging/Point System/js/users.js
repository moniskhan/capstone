'use strict';

var currentID = 0;
var ranks = ['rank1', 'rank2', 'rank3', 'rank4', 'rank5', 'rank6', 'rank7']

var User = function(user_name) {
	this.userName = user_name;
	this.id = currentID++;
	this.rank = 0;
	this.exp = 0;
};

_.extend(User.prototype, {
	gainExp: function() {
		this.rank = Math.floor(this.exp/10);
		this.exp++;
	},

	getExp: function() {
		return this.exp;
	},

	getID: function() {
		return this.id;
	},

	getName: function()  {
		return this.userName;
	},

	getRank: function() {
		return ranks[this.rank];
	}

});