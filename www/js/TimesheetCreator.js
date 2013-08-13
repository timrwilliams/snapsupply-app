var TimesheetCreator = function() {

	this.initialize = function() {
        this.el = $('<div/>');
        $( "#ts-create-btn" ).bind( "click", this.onCreate);
        $( "#ts-cancel-btn" ).bind( "click", this.onCancel);
        $( "#create-ts-form input[type='radio']").bind( "change", function(event, ui) {
        	tsForm.type = $(this).val();
        	console.log($(this).attr('id'));
        	tsForm.typeId = $(this).attr('id');
	});
    };

     this.onCreate = function(event, ui) {
		event.preventDefault();
		if(tsForm.type=="hourly"){
			console.log("Creating hourly timesheet...");
			console.log(tsForm);
		}
		else{
			console.log("Creating weekly timesheet...");
			console.log(tsForm);
			$.mobile.changePage("timesheet-weekly.html", {transition: "none"});
		}		
		return false;
     }

     this.onCancel = function(event, ui) {
		event.preventDefault();
		console.log("Cancelling timesheet...");
		return false;
     }

     this.submit = function () {
     	console.log("Submitting...");
     	console.log(tsForm);
     }

     this.initialize();
}