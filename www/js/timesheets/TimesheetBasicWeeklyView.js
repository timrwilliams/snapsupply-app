var TimesheetBasicWeeklyView = function(timesheet){

	this.initialize = function(){
		console.log("init basic weekly view for ",timesheet.employer);
		var html = "";
		var $ul = $("#timesheet-data-list");
		for (var i = 0, len = daysOfWeek.length; i < len; i++) {
            var day = daysOfWeek[i].capitalize();
            if (timesheet.data.days[day]) {
                var preview = day + " " + timesheet.data.days[day];
                html += '<li>'+preview+'</li>';
            }
        };
		$ul.html(html);
		$ul.listview( "refresh" );
        $ul.trigger( "updatelayout");

        $("#employer-label").html(timesheet.employer);

        $("#time-range-label").html(timesheet.time_range);

        $statusUl = $("#timesheet-status-list");
        html = "<li>";
        html += selectStatusIcon(timesheet.workflow_state);
        html += timesheet.workflow_state;
        html +="</li>"
        $statusUl.html(html)
        $statusUl.listview( "refresh" );
        $statusUl.trigger( "updatelayout");

	}	

	this.initialize();
}

selectStatusIcon = function(status){
		var icon = "";
		switch(status)
		{
			case "Pending Approval":
				icon = "<i class='icon-time'></i>"
				break;
			case "Approved":
				icon = "<i class='icon-ok'></i>"
				break;
			case "Rejected":
				icon = "<i class='icon-exclamation'></i>"
				break;
		}
		return icon+" ";
	}