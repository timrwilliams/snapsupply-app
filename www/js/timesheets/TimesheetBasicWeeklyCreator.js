var TimesheetBasicWeeklyCreator= function(timesheet){

	this.initialize = function(){
		console.log("Init weekly creator");
 		$("#weekly-create-employer-label").html(tsForm.school);
        $("#weekly-create-time-range-label").html(tsForm.timeRangeName);
	}	

	this.initialize();
}