var AvailabilityView = function() {

    this.initialize = function() {
        // Define a div wrapper for the view. The div wrapper is used to attach events.
        this.el = $('<div/>');
        //this.el.on('click', '#createCal', this.createCal);
    };

    this.render = function() {    	
        this.el.html(AvailabilityView.template()); 
        return this;
    };

	this.postRender = function(){
    	$('#multiInlinePicker').datepick({ 
        	defaultDate:null,multiSelect: 99, monthsToShow: 1, monthsToStep: 1,
        	onMultiSelect:onDateChange, yearRange: '-1:+1'});

        	if(localStorage.getItem(LS_CALENDAR_KEY)){
        	    storedDates =JSON.parse(localStorage.getItem(LS_CALENDAR_KEY));
        	    selectedDates = new Array();
        	    var length = storedDates.length,
                element = null;
                for (var i = 0; i < length; i++) {
                  element = storedDates[i];
                  if(element!=null){
                    selectedDates.push(new Date(element));
                  }
                }
        	}
        	else{
                localStorage.setItem(LS_CALENDAR_KEY,JSON.stringify(selectedDates));
        	}
        	if(selectedDates.length>0){
    	        $('#multiInlinePicker').datepick('setDate', selectedDates);
    	        $('#multiInlinePicker').datepick({defaultDate: null});
    	    }
    }

	this.initialize();

    function  saveDateChange(direction,date) {
        /*dateStr = date.toJSON().substring(0,10);
        baseUrl = http://localhost:3000/
                         $.ajax({
                 		    url: 'http://localhost:3000/diary.jsonp',
                 		    dataType: 'jsonp',
                            jsonp: 'callback',
                            crossDomain: true,
                 		    timeout: 25000,
                 		    data : {
                                 auth_token : localStorage.getItem('auth_token'),
                                 direction : direction,
                                 date: dateStr
                             },
                 		    success: function(data, status) {
                 			   alert(data);
                 		    },
                 		    error: function(){
                     			alert('Oh no! not again.');
                 	    	}
                 	});
*/
                     };

    function onDateChange(direction,date){
        $('calendar_status').text("Saving changes...");
        if(direction=="ADD"){
            addDate(date);
        }
        else{
            removeDate(date);
        }
        saveDateChange(direction,date);
        $('#calendar_status').text("Changes saved");
	};

    function addDate(date){
        console.log("Date addition detected: "+date);
        if(isCalendarStored()){
            storedDates =JSON.parse(localStorage.getItem(LS_CALENDAR_KEY));
            storedDates.push(date);
            localStorage.setItem(LS_CALENDAR_KEY,JSON.stringify(storedDates));
        }
        else{
            localStorage.setItem(LS_CALENDAR_KEY,[JSON.stringify(storedDates)]);
        }
    }

    function isCalendarStored(){
        return localStorage.getItem(LS_CALENDAR_KEY);
    }

    function removeDate(date){
        console.log("Date removal detected: "+date);
        dateToJson = JSON.parse(JSON.stringify(date));
        if(localStorage.getItem(LS_CALENDAR_KEY)){
           storedDates =JSON.parse(localStorage.getItem(LS_CALENDAR_KEY));
           elemIndex = storedDates.indexOf(dateToJson);
           if(elemIndex!=-1){
                storedDates.splice(elemIndex,1);
           }
           localStorage.setItem(LS_CALENDAR_KEY,JSON.stringify(storedDates));
        }
    }

    var selectedDates = new Array();
    var LS_CALENDAR_KEY = 'calendar.dates';
};


AvailabilityView.template = Handlebars.compile($("#availability-tpl").html());