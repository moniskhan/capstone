

Template.addShowForm.rendered = function(){
    $('#datetimepicker12').datetimepicker({
    	inline: true,
    	sideBySide: true
    });
};

// Template.addShowForm.events({
//     'change #datetimepicker12': function () {
//       // Get the selected start date
//       var picked_date = $("#datetimepicker12").data("DateTimePicker").getDate();
//       console.log(picked_date);
//     }
//   });

Template.addShowForm.events({
	"submit form": function () {
		// prevent default
		event.preventDefault();

		var showName = event.target.showName;
		var showTimeInput = event.target.showTime;
		
		// returns a moment object
		var test = $("#datetimepicker12").data("DateTimePicker").date();

		console.log(showName.value);
		
		Meteor.call('newShow', {
          nameShow: showName.value,
          timestamp: test.valueOf()
        });
	}
})