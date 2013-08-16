var TimesheetStore = function(successCallback, errorCallback) {
	var lib = new localStorageDB("timesheets", window.localStorage);

	this.initialize =  function(){
		if( lib.isNew() ) {
			console.log("Creating timesheets database");
			lib.createTable("timesheets", ["external_id", "workflow_state", "client","employer", "type", "updated_at","time_range","start_date","data","total_suffix"]);
			lib.commit();
		}
		else{
			this.findAll();
		}
	}

	// Used to simulate async calls. This is done to provide a consistent interface with stores (like WebSqlStore)
    // that use async data access APIs
    var callLater = function(callback, data) {
        if (callback) {
            setTimeout(function() {
                callback(data);
            });
        }
    }

    this.createOrUpdate = function(timesheet){
        console.log("Inserting new timesheet with id: "+timesheet.id);
    	lib.insertOrUpdate("timesheets",{external_id: timesheet.id}, 
    		{external_id: timesheet.id, workflow_state: timesheet.workflow_state, client: timesheet.client, 
    			employer: timesheet.employer, type: timesheet.type, updated_at: timesheet.updated_at, 
    			time_range: timesheet.time_range, start_date: timesheet.start_date,data: timesheet.data,total_suffix: timesheet.total_suffix });
    	lib.commit();
    }

    this.findAll = function(){
    	console.log("Querying timesheets...");
    	results = lib.query("timesheets");
   		return this.sortByDate(results);
    }

    this.sortByDate = function(arr){
    	return arr.sort(function(a, b) {
			a = new Date(a.start_date);
    		b = new Date(b.start_date);
    		return a>b ? -1 : a<b ? 1 : 0;
		});
    }

    this.findByExternalId = function(external_id){
       return lib.query("timesheets", {external_id: external_id});
    }

    this.initialize();
    callLater(successCallback);
}