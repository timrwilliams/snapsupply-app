var PreferenceService = function() {
	 var storage = window.localStorage;
	 var LS_PREFERENCES_KEY = "prefs"
	 var DEFAULT_FEATURES = ["help","settings","location"];
   var shouldRefresh = false;

	 this.initialize = function() {	 
	 	$("ul").listview( "refresh" );
	 	var inBackground = true;
        if(this.getLocalPrefs()==null){        	        	
        	inBackground = false;
        }        
        else{
        	this.enableFeatures();
        }   
        this.refreshPreferences(inBackground); 
    };

    this.hardRefresh = function(){
      this.disableFeatures();
      this.refreshPreferences(false); 
    }

    this.enableFeatures = function(){
    	console.log("Enabling features");
      this.disableFeature("agency-selection");
      this.enableDefaultFeatures();
      var prefs = this.getLocalPrefs();
      if(prefs==null || prefs.clients == null || prefs.clients.length==0){
        this.enableFeature("agency-selection");
      }
      else{
    	  var clients = prefs.clients;
    	  for(i=0;i<clients.length;i++){
    	    var client = clients[i];
    	    var features = client.features;
    		  for(j=0;j<features.length;j++){    		
    			 this.enableFeature(features[j]);
    		  }
    	 }
      }
    	$("ul").listview( "refresh" );
    }

    this.disableFeatures = function(){
      $("ul").find("[data-feature]").hide();
    }

    this.disableFeature = function(feature){
      console.log("Disabling "+feature);
      $("ul").find("[data-feature='" + feature + "']").hide();
    }

    this.enableFeature = function(feature){
    	console.log("Enabling "+feature);
    	$("ul").find("[data-feature='" + feature + "']").show();
    }

    this.enableDefaultFeatures = function(){
        for(j=0;j<DEFAULT_FEATURES.length;j++){
          this.enableFeature(DEFAULT_FEATURES[j]);
        }
    }

    this.getLocalPrefs = function(){
      var prefs = storage.getItem(LS_PREFERENCES_KEY);
      if(prefs==null){
        return null;
      }
      else{
    	 return JSON.parse(prefs);
      }
    }

    this.refreshPreferences = function(inBackground){
      if(inBackground){
        showSpinner();
      }
      else{
        showModal();
      }
    	console.log("Refreshing preferences");
    	$("#home-info-bar").hide();
    	var self = this;      
		  $.ajax(
        NH.ajaxOptions("/prefs/index.jsonp")
        )
          .done( function ( response ) {
          	storage.setItem(LS_PREFERENCES_KEY,JSON.stringify(response));
          	self.enableFeatures();
          })
          .fail( function (){
          	if(!inBackground){
          		$("#home-info-bar").show();
          	}
			console.log("Unable to communicate with server");
          })
          .always( function (){
			if(inBackground){
          		hideSpinner();
          	}
          	else{
          		setTimeout(function(){hideModal()},500);	
          	}   
          });
    };

    this.isFeatureEnabled = function(feature){
    	prefs = JSON.parse(storage.getItem(LS_PREFERENCES_KEY));
    };

    this.getClients = function(){
      if(this.getLocalPrefs()==null){
        return null;      
      }      
    	return this.getLocalPrefs().clients;
    }

    this.updateLocation = function(lat,long,expiry_date){
      var prefs = this.getLocalPrefs();
      var location = prefs.location;
      if(!location){
        location = {};
      }
      location.latitude = lat;
      location.longitude = long;
      location.expiry_date = expiry_date;
      prefs.location = location;
      storage.setItem(LS_PREFERENCES_KEY,JSON.stringify(prefs));
    }
}

function showSpinner(){
	$("#header-spinner").show();
};

function hideSpinner(){
	$("#header-spinner").hide();
};

function showModal(){
  $("body").append('<div class="modalWindow"/>');
  $.mobile.loading( 'show', {
			text: 'Linking with agencies...',
			textVisible: true,
			theme: 'b',
			html: ""
		});
}

function hideModal(){
 $(".modalWindow").remove();
 $.mobile.loading( 'hide' )
}