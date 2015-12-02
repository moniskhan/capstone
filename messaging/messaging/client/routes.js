Router.route('/:channel', function () {
	Session.set('channel', this.params.channel);
	this.layout('app');
	this.render('messages');
});


Router.route('/', function() {
	this.layout('landingTemplate');
	this.render('landing');
	
	
});