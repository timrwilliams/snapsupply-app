var TimesheetPreviewView = function() {
    var daysOfWeek=new Array("monday","tuesday","wednesday","thursday","friday","saturday","sunday");

	this.initialize = function() {
        $( "#ts-pv-submit-btn" ).bind( "click", this.onCreate);
        $( "#ts-pv-cancel-btn" ).bind( "click", this.onCancel);      
        for (var i = 0, len = daysOfWeek.length; i < len; i++) {
            var day = daysOfWeek[i];
            if (tsForm.days[day]) {
                var preview = day.capitalize() + " " + tsForm.days[day];
                $("#data-preview").append('<li>'+preview+'</li>');
            }
        };
        $("#data-preview").listview('refresh');
    };

     this.onCreate = function(event, ui) {
		event.preventDefault();
		console.log("Moving to success page");
       	$.mobile.changePage('timesheet-submitted.html', {
          transition: "none"
        });    
		return false;
     }

     this.onCancel = function(event, ui) {
		event.preventDefault();
		console.log("Cancelling timesheet...");
		return false;
     }

     this.initialize();
}