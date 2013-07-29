var TimesheetPreviewView = function() {

	this.initialize = function() {
        $( "#ts-pv-submit-btn" ).bind( "click", this.onCreate);
        $( "#ts-pv-cancel-btn" ).bind( "click", this.onCancel);        
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