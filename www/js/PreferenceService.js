var PreferenceService = function() {
	 var storage = window.localStorage;
	 var LS_PREFERENCES_KEY = "prefs"
	 var DEFAULT_FEATURES = ["help","settings"];

	 this.initialize = function() {	 
	 	$("ul").listview( "refresh" );
	 	var inBackground = true;
        if(this.getLocalPrefs()==null){        	        	
        	inBackground = false;
        	showModal();
        }        
        else{
        	showSpinner();
        	this.enableFeatures();
        }   
        this.refreshPreferences(inBackground); 
    };

    this.enableFeatures = function(){
    	console.log("Enabling features");
      this.enableDefaultFeatures();
    	var clients = this.getLocalPrefs().clients;
    	for(i=0;i<clients.length;i++){
    		var client = clients[i];
    		var features = client.features;
    		for(j=0;j<features.length;j++){    		
    			this.enableFeature(features[j]);
    		}
    	}
    	$("ul").listview( "refresh" );
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
    	return JSON.parse(storage.getItem(LS_PREFERENCES_KEY));
    }

    this.refreshPreferences = function(inBackground){
    	console.log("Refreshing preferences");
    	$("#home-info-bar").hide();
    	var self = this;
		$.ajax({
            url: getBaseUrl()+"/prefs/index.jsonp",
            dataType: "jsonp",
            crossDomain: true,
            timeout: 2500,
            data: {
              auth_token: storage.getItem('auth_token')
            }
          })
          .done( function ( response ) {                  	
          	storage.setItem(LS_PREFERENCES_KEY,JSON.stringify(response));
          	self.enableFeatures();          	       	
            console.log(response);
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
          		setTimeout(function(){hideModal()},1000);	
          	}   
          });
    };

    this.isFeatureEnabled = function(feature){
    	prefs = JSON.parse(storage.getItem(LS_PREFERENCES_KEY));
    };

    this.getClients = function(){
    	return this.getLocalPrefs().clients;
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