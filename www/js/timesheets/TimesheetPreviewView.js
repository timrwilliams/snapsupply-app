var daysOfWeek=new Array("monday","tuesday","wednesday","thursday","friday","saturday","sunday");

var TimesheetPreviewView = function() {    

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
        $("#preview-employer-label").html(tsForm.school);
        $("#preview-time-range-label").html(tsForm.timeRangeName);
        $("#data-preview").listview('refresh');
    };

    var onSuccess  = function(createdId){
        console.log("Moving to success page");
        selectedTimesheetId= createdId;
        $.mobile.changePage('timesheet.html', {
          transition: "none"
        });    
    };

    var onFailure = function(){
        alert("Unable to create timesheet");
    };

     this.onCreate = function(event, ui) {
		event.preventDefault();
        createdId = new TimesheetCreator().submit(onSuccess,onFailure);		
		return false;
     }

     this.onCancel = function(event, ui) {
		event.preventDefault();
		console.log("Cancelling timesheet...");
        resetFormData();
        $.mobile.changePage('../index.html', {
          transition: "none"
        });
		return false;
     }

     this.initialize();
}