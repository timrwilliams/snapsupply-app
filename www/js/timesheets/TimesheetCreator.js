var TimesheetCreator = function() {

	this.initialize = function() {
        $( "#ts-create-btn" ).bind( "click", this.onCreate);
        $( "#ts-cancel-btn" ).bind( "click", this.onCancel);
        $( "#create-ts-form input[type='radio']").bind( "change", function(event, ui) {
        	tsForm.type = $(this).val();
        	tsForm.typeId = $(this).attr('id');
		});
		this.populateAgencyList();
    };

    this.populateAgencyList = function(){
    	var agencyDiv = $("#agency-field");    	
    	var clients = prefs.getClients();
    	if(clients.length==1){
    		this.setClient(clients[0].name,clients[0].id);
    	}
    	else{
    		if(!tsForm.clientName){
    			this.setClient(clients[0].name,clients[0].id);
    		};
    		var options = "";
    		var selectedHtml = "";
    		for(i = 0;i<clients.length;i++){
    			var client =clients[i] 
    			if(client.id==tsForm.clientId){
    				selectedHtml = "selected='selected'";
    			}
    			options +="<option "+selectedHtml+" value='"+client.id+"'>"+client.name+"</option>";
    			selectedHtml = "";
    		}
    		$("#select-agency").html(options).selectmenu('refresh', true);
    		agencyDiv.show();
    	}
    }

    this.setClient = function(name,id){
    	tsForm.clientName = name;
    	tsForm.clientId = id;
    }

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
        resetFormData();
        $.mobile.changePage('../index.html', {
          transition: "none"
        });
    return false;
     }

     this.submit = function (successCallback,failureCallback) {
     	console.log("Submitting...");
     	var data = {
              auth_token: window.localStorage.getItem('auth_token'),
              client_id: tsForm.clientId,
              employer_id: tsForm.schoolId,
              timesheet_type: tsForm.type,
              time_range: 27
            };
        for (var i = 0, len = daysOfWeek.length; i < len; i++) {
            var day = daysOfWeek[i];
            if (tsForm.days[day]) {
                data[day] = tsForm.days[day];
            }
        };
        console.log(data);
        var createdId = -1;
     	$.ajax({
            url: getBaseUrl()+"/timesheets/create.jsonp",
            dataType: "jsonp",
            crossDomain: true,
            timeout: 2500,
            data: data
          })
          .done( function(response){
            console.log("Received a response from server");
            console.log(response);
            tsStore.createOrUpdate(response.timesheet);
            createdId = response.timesheet.id;
            successCallback(createdId);
          })
          .fail( function (){
			       console.log("Unable to communicate with server");
             failureCallback();
          })
          .always( function (){
          });
          return createdId;
     }

     this.initialize();
}