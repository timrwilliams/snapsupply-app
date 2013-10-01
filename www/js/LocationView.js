var LocationView = function(store) {
    var latitude, longitude;

    this.initialize = function() {
        $( "#location-btn" ).bind( "click", this.updateLocation);
        $( "#clear-location-btn" ).bind( "click", this.clearLocation);
        var self = this;
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    };
    
    // Display `Position` properties from the geolocation
    var onSuccess = function(position) {
        console.log("Successful GPS");        
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        var location_prefs = prefs.getLocalPrefs();
        if(location_prefs && location_prefs.location){
            var location = location_prefs.location;
            var stored_lat = location.latitude;
            var stored_long = location.longitude;
            var expiry_date = location.expiry_date;            
            generateMap(stored_lat,stored_long);
            if(expiry_date){
                var html = "Your current location expires "+moment(expiry_date).fromNow();
                $("#location-alert").html(html);
                $("#location-alert").show();
                $("#clear-location-btn").show();
            }
        }        
    }

    generateMap = function(lat,long){
        document.getElementById('map').src="https://maps.googleapis.com/maps/api/staticmap?zoom=12&size=300x300&maptype=roadmap&markers=color:red%7Ccolor:red%7Clabel:C%7C"+lat+","+long+"&sensor=false";
    }

    // Show an alert if there is a problem getting the geolocation
    var onError = function() {
        $("#location-alert").html("Unable to get your location. Please go back and try again when you have network ");
        $("#location-alert").show();
    }   

    this.updateLocation = function(event, ui) {
        console.log('Updating location...'+latitude +","+longitude);
        var expiry_period = $("#week-select").val()
        event.preventDefault();
        var self = this;
        $('.alert').hide();
        var data = {
            latitude: latitude,
            longitude: longitude,
            expiry: expiry_period
        }
        $.ajax(NH.ajaxOptions("/users/mylocation.jsonp",data))
		    .done( function(data, status) {
                var location = data.location;
                expiry_date = location.expiry_date;
                generateMap(location.latitude,location.longitude);
                prefs.updateLocation(location.latitude,location.longitude,expiry_date);
                $("#location-alert").html("Your location has been updated until "+moment(expiry_date).format('MMMM Do YYYY, h:mm a'));
                $("#location-alert").show();
                 $("#clear-location-btn").show();
		    })
		    .fail(function(x, t, m){
              $("#location-alert").html("Unable to communicate with server, please try again.");
		      $("#location-alert").show();
	    	})
            ;
        return false;
    };

     this.clearLocation = function(event, ui) {        
        event.preventDefault();
        console.log('Clearing location...');
        var self = this;
        $('.alert').hide();
        var data = {
            _method: "delete"
        }
        $.ajax(NH.ajaxOptions("/users/mylocation.jsonp",data))
        .done(function(data, status) {
                var location = data.location;
                expiry_date = location.expiry_date;
                generateMap(location.latitude,location.longitude);
                prefs.updateLocation(location.latitude,location.longitude,expiry_date);
                $("#location-alert").html("Your location has been reset");
                $("#location-alert").show();
                $("#clear-location-btn").hide();
            })
        .fail( function(x, t, m){
              $("#location-alert").html("Unable to communicate with server, please try again.");
              $("#location-alert").show();              
            }
        );
        return false;
    };

    this.initialize();

}