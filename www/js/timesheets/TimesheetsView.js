var TimesheetsView = function(){

	this.initialize = function(){
		var self = this;
		$( "#ts-list-refresh" ).bind( "click", function(event, ui) {
			self.showSpinner();
			self.refresh();
      		event.preventDefault();      		
      		return false;
     	});
     	this.refresh();
     	this.render();
	}

	this.render = function(){
		var timesheets = tsStore.findAll();
		var html = "";
		var $ul = $("#timesheets-list");
		for(i=0;i<timesheets.length;i++){
          	var timesheet = timesheets[i];
          	html += "<li name='"+timesheet.time_range+"'><a href='timesheet.html?id="+timesheet.external_id+"'><h3>"+timesheet.employer+"</h3>";
          	html += "<p><strong>" + timesheet.data.total +" "+timesheet.total_suffix + "</p></strong>";
          	html += "<p>" + selectStatusIcon(timesheet.workflow_state) + timesheet.workflow_state + " at "+moment(timesheet.updated_at).format('MMMM Do YYYY, h:mm a')+"</p>";
          	html +="</li>";
        }  
        $ul.html(html);
        $ul.listview({
    		autodividers: true,
    		autodividersSelector: function ( li ) {
        		var out = li.attr('name');
        		return out;
    		}
		});
        $ul.listview( "refresh" );
        $ul.trigger( "updatelayout");
        $("#timesheets-list a").bind("click",function(event,ui){
          event.preventDefault();
          selectedTimesheetId = this.search.match(/id=(\d+)/)[1] ;
           $.mobile.changePage('timesheet.html', {
              transition: "slide"
        });  
          return false;
        });
	}

	this.refresh = function(){
		console.log("Refreshing timesheets");
		var self = this;
		self.showSpinner();
		$.ajax({
            url: getBaseUrl()+"/timesheets.jsonp",
            dataType: "jsonp",
            crossDomain: true,
            timeout: 2500,
            data: {
              auth_token: storage.getItem('auth_token')
            }
          })
          .done( function ( response ) {
          	var timesheets = response.timesheets
          	for(i=0;i<timesheets.length;i++){
          		var timesheet = timesheets[i];
          		tsStore.createOrUpdate(timesheet);
          	}   
          	self.render();       	          	           
          })
          .fail( function (){          	
			     console.log("Unable to communicate with server");
          })
          .always( function (){
				self.hideSpinner();
          });
	}

	this.showSpinner = function(){
		console.log("Refreshing...");
      	$("a#ts-list-refresh span.ui-btn-inner span.ui-icon")
      	.removeClass("ui-icon-refresh")
      	.addClass("ui-icon-ajax");
	}

	this.hideSpinner = function(){
		$("a#ts-list-refresh span.ui-btn-inner span.ui-icon")
      	.addClass("ui-icon-refresh")
      	.removeClass("ui-icon-ajax");
	}

	this.initialize();

}