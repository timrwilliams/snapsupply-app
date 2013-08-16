    var selectedDates = new Array();
    var LS_CALENDAR_KEY = 'calendar.dates';
    var LS_PENDING_KEY = 'calendar.pending';

var AvailabilityView = function() {

    this.initialize = function() {
        // Define a div wrapper for the view. The div wrapper is used to attach events.
         $( "#save_button" ).bind( "click", this.onSync);
         $( "#cancel_button" ).bind( "click", this.onCancel);
        initLocalStorage();
    };
    
    this.onSync = function(event,ui) {
        event.preventDefault();
        sync();
        return false;
    };

    this.onCancel = function(event,ui) {
        event.preventDefault();
        cancelChanges();
        return false;
    };

    this.render = function() {    	
        this.el.html(AvailabilityView.template()); 
        return this;
    };

	this.postRender = function(){
    	$('#multiInlinePicker').datepick({ 
        	defaultDate:null,multiSelect: 99, monthsToShow: 1, monthsToStep: 1,
        	onMultiSelect:onDateChange, yearRange: '-1:+1',changeMonth: false,
            prevText:'<', nextText:'>'});

        dateSync();
        setCalendarFromStorage();
        
    	$('#multiInlinePicker').datepick({defaultDate: null});
    };

	this.initialize();
}
    function parseJSONDates(dates){
         parsedDates = new Array();
            var length = dates.length,
            element = null;
            for (var i = 0; i < length; i++) {
                element = dates[i];
                if(element!=null){
                    parsedDates.push(new Date(element));
                }
            }
            return parsedDates;
    }

    function initLocalStorage(){
        if(!localStorage.getItem(LS_CALENDAR_KEY)){
            localStorage.setItem(LS_CALENDAR_KEY,JSON.stringify([]));
        }
    }
    function  saveDateChange(dates) {
        console.log("Sending data to server");
        //var dateStr = date.toJSON().substring(0,10);
        var packaged_data = {};
        packaged_data.auth_token = localStorage.getItem('auth_token');
        var entries = []
        for(index in dates){
            var date = dates[index].date;
            var direction = dates[index].direction;
            var dateStr = date.substring(0,10);
            var diary_entry = {'date': dateStr ,'direction': direction,'entry_type':1};
            entries.push(diary_entry);            
        }
        packaged_data.entries = entries;
        $.ajax({
            url: getBaseUrl()+'/diaries/2/diary_entries/sync.jsonp',
            dataType: 'jsonp',
            jsonp: 'callback',
            crossDomain: true,
            timeout: 25000,
            data : packaged_data,
            success: function(data, status) {
                $('#calendar_status').text("Changes saved");
                console.log("succesfully saved",data);
                var length = data.length,
                element = null;
                for (var i = 0; i < length; i++) {
                    element = JSON.parse(data[i]);
                    if(element.status=='ok'){
                        console.log('Ok to delete',element.date);
                        completePendingChange(element.date);
                    }
                    else{
                        console.log('Something went wrong with',element.date);   
                    }
                }
                flagSyncComplete();
            },
            error: function(){
                $('#calendar_status').text("Problem saving dates, please try again");
            }
        });
    
    };

    function localDateSave(direction,date){        
        diaryEntry = new DiaryEntry(direction,date);
        pendingChanges = JSON.parse(localStorage.getItem(LS_PENDING_KEY));        
        console.log("At start",pendingChanges);
        if(pendingChanges){
            entryFound = pendingChanges[diaryEntry.key()];
            if(entryFound){
                 if(entryFound.direction==diaryEntry.direction){
                    console.log('Trying to redo a pending change. no action taken');
                 }
                 else{
                    console.log('Undoing a pending save');  
                    delete pendingChanges[diaryEntry.key()];
                    localStorage.setItem(LS_PENDING_KEY,JSON.stringify(pendingChanges));

                 }
            }
            else{
                console.log("No entry present, adding");
                addDiaryEntryToLocalStorage(pendingChanges, diaryEntry);                
            }
        }
        else{            
            pendingChanges = {};
            addDiaryEntryToLocalStorage(pendingChanges, diaryEntry);
        }        
        console.log("AT END",pendingChanges);   

    };

    function addDiaryEntryToLocalStorage(pendingChanges, diaryEntry)
    {
        pendingChanges[diaryEntry.key()] = diaryEntry;            
        localStorage.setItem(LS_PENDING_KEY,JSON.stringify(pendingChanges));
    }

    function DiaryEntry(direction,date)
    {
        this.direction = direction;
        this.date = date;
        this.entry_type= 1;

        this.key = function(){
            return date.getTime();
        }
        
    };

    function onDateChange(direction,date){
        $('#calendar_status').text("Saving changes...");
        if(direction=="ADD"){
            localDateSave(direction,date);
            //addDate(date);
        }
        else{
            localDateSave(direction,date);
            //removeDate(date);
        }
        $('#calendar_status').removeClass('alert-success');
        $('#calendar_status').removeClass('alert-info');
        $('#calendar_status').addClass('in');
        $('#calendar_status').text(countPendingChanges()+" unsaved changes");

	};

    function completePendingChange(dateStr){
        var date = new Date(dateStr);
        var selectorDate = new Date(dateStr);
        date.setHours(12);
        console.log(date.getTime());
        var pendingChanges = JSON.parse(localStorage.getItem(LS_PENDING_KEY));        
        var ts = date.getTime();
        if(pendingChanges){
            console.log("COmpleting pending change ",date);
            entryFound = pendingChanges[ts];
            if(entryFound){
                if(entryFound.direction=="ADD"){
                    addDate(date);
                }
                else{
                    removeDate(date);
                }
                delete pendingChanges[ts];
                localStorage.setItem(LS_PENDING_KEY,JSON.stringify(pendingChanges));
            }
            
        }
    };

    function countPendingChanges(){
        storedDates =JSON.parse(localStorage.getItem(LS_PENDING_KEY));
        if(storedDates){
            return Object.keys(storedDates).length
        }
        else{
            return 0;
        }
    }

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
        diaryId = localStorage.getItem('user_diary');
        $.ajax({
                url: getBaseUrl()+'/diaries/'+diaryId+'/diary_entries.jsonp',
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
                   updateLocal(data.entries);
                },
                error: function(){
                	$('#calendar_status').text("Problem syncing data, please try again.");
                }
            });
    };

    function loadDates(){        
        if(localStorage.getItem(LS_CALENDAR_KEY)){
            storedDates =JSON.parse(localStorage.getItem(LS_CALENDAR_KEY));
            selectedDates = parseJSONDates(storedDates);
        }
        else{
            localStorage.setItem(LS_CALENDAR_KEY,JSON.stringify(selectedDates));
        }
        return selectedDates;
    }

    function updateLocal(data){
        parsedDates = new Array();
        var length = data.length,
        element = null;
        for (var i = 0; i < length; i++) {
            element = data[i];
            if(element!=null){
                var date = new Date(element.date);
                date.setHours(12);
                parsedDates.push(date);
            }
        }
        storeLocalData(parsedDates);
        setCalendarFromStorage();
    };

    function setCalendarFromStorage(){
        $('#multiInlinePicker').datepick('setDate', loadDates());
    }

    function storeLocalData(dates){
        localStorage.setItem(LS_CALENDAR_KEY,JSON.stringify(dates));        
    };

    function sync(){
        var pendingChanges=getPendingChanges();
        if(!pendingChanges || $.isEmptyObject(pendingChanges)){
            return;
        }
        else{
            $('#multiInlinePicker').datepick('disable');
            $('#sync').button('loading');
            $('#calendar_status').text("Saving changes...");
            var pendingChanges=getPendingChanges();
            saveDateChange(pendingChanges);        
        }
    };

    function fakeSync(){
        console.log('syncing...');
        $('#multiInlinePicker').datepick('disable');
        $('#sync').button('loading');
        $('#calendar_status').text("Saving changes...");
        setTimeout(flagSyncComplete, 4000);
    };

    function flagSyncComplete(){
        $('#sync').button('reset');
        $('#multiInlinePicker').datepick('enable');
        $('#calendar_status').removeClass('alert-info');  
        $('#calendar_status').addClass('alert'); 
        $('#calendar_status').addClass('alert-success'); 
        $('#calendar_status').addClass('in');         
        $('#calendar_status').text("Last saved: "+moment().calendar());
        setTimeout(clearMessage, 3000);
    };

    function cancelChanges(){
        console.log('clearing changes...');
        clearPendingChanges();
    };

    function clearMessage(){
        $('#calendar_status').addClass('alert-info');
        $('#calendar_status').removeClass('alert-success');    
        $('#calendar_status').removeClass('fade'); 
    };

    function getPendingChanges(){
         return JSON.parse(localStorage.getItem(LS_PENDING_KEY));        
    };

    function clearPendingChanges(){
        if(isCalendarStored()){
            storedDates =JSON.parse(localStorage.getItem(LS_CALENDAR_KEY));
            $('#multiInlinePicker').datepick('setDate', parseJSONDates(storedDates));
        }
        else{
            $('#multiInlinePicker').datepick('clear');
        }
        localStorage.removeItem(LS_PENDING_KEY); 
        $('#calendar_status').removeClass('alert-info');  
        $('#calendar_status').addClass('alert'); 
        $('#calendar_status').addClass('alert-success'); 
        $('#calendar_status').addClass('in');         
        $('#calendar_status').text("Changes cleared");
    };