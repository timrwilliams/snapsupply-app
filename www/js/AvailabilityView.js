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


        	this.loadDates();
        	if(selectedDates.length>0){
    	        $('#multiInlinePicker').datepick('setDate', selectedDates);
    	        $('#multiInlinePicker').datepick({defaultDate: null});
    	    }
    }

    this.loadDates = function(){
        dateSync();
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
    }

	this.initialize();

    function  saveDateChange(direction,date) {
        console.log("Sending data to server");
        dateStr = date.toJSON().substring(0,10);
        $.ajax({
            url: baseUrl+'/diaries/2/diary_entries/create.jsonp',
            dataType: 'jsonp',
            jsonp: 'callback',
            crossDomain: true,
            timeout: 25000,
            data : {
                 auth_token : localStorage.getItem('auth_token'),
                 diary_entry : {
                    date: dateStr,
                    entry_type:1
                 }
             },
            success: function(data, status) {
               $('#calendar_status').text("Changes saved");
               console.log("succesfully saved");
            },
            error: function(){
            	alert('Oh no! not again.');
            }
        });
    };

    function  saveDateRemoval(date) {
            console.log("Sending removal data to server");
            dateStr = date.toJSON().substring(0,10);
            $.ajax({
                url: baseUrl+'/diaries/2/diary_entries/destroy.jsonp',
                dataType: 'jsonp',
                jsonp: 'callback',
                crossDomain: true,
                timeout: 25000,
                data : {
                     auth_token : localStorage.getItem('auth_token'),
                     diary_entry : {
                        date: dateStr,
                        entry_type:1
                     }
                 },
                success: function(data, status) {
                   $('#calendar_status').text("Changes saved");
                   console.log("Destroy successfully saved");
                },
                error: function(){
                	alert('Oh no! not again.');
                }
            });
        };

    function onDateChange(direction,date){
        $('calendar_status').text("Saving changes...");
        if(direction=="ADD"){
            saveDateChange(direction,date);
            addDate(date);
        }
        else{
            saveDateRemoval(date);
            removeDate(date);
        }
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

    function dateSync(){
        $.ajax({
                url: baseUrl+'/diaries/2/diary_entries.jsonp',
                dataType: 'jsonp',
                jsonp: 'callback',
                crossDomain: true,
                timeout: 25000,
                data : {
                     auth_token : localStorage.getItem('auth_token')
                 },
                success: function(data, status) {
                   console.log("succesfully retrieved json");
                   console.log(data.entries);
                },
                error: function(){
                	alert('Oh no! not again.');
                }
            });
    };

    var selectedDates = new Array();
    var LS_CALENDAR_KEY = 'calendar.dates';
    //baseUrl = "http://localhost:3000";
    baseUrl = "http://snapsupply.herokuapp.com";
};


AvailabilityView.template = Handlebars.compile($("#availability-tpl").html());