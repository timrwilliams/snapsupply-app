var LocationView = function(store) {
    var latitude, longitude;

    this.initialize = function() {
        $( "#location-btn" ).bind( "click", this.updateLocation);
        navigator.geolocation.getCurrentPosition(this.onSuccess, this.onError);
    };
    
    // Display `Position` properties from the geolocation
    this.onSuccess = function(position) {
        console.log("Successful GPS");        
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        document.getElementById('map').src="https://maps.googleapis.com/maps/api/staticmap?zoom=13&size=300x300&maptype=roadmap&markers=color:red%7Ccolor:red%7Clabel:C%7C"+position.coords.latitude+","+position.coords.longitude+"&sensor=false";
    }

    // Show an alert if there is a problem getting the geolocation
    this.onError = function() {
        $("#location-alert").html("Unable to get your location. Please go back and try again when you have network ");
        $("#location-alert").show();
    }   

    this.updateLocation = function(event, ui) {
        console.log('Updating location...'+latitude +","+longitude);
        var expiry_period = $("#week-select").val()
        event.preventDefault();
        $('.alert').hide();
        $.ajax({
		    url: getBaseUrl()+'/users/location.jsonp',
		    dataType: 'jsonp',
            jsonp: 'callback',
            crossDomain: true,
		    timeout: 2500,
		    data : {
                user : {
            	     auth_token: storage.getItem('auth_token')
            		},
                latitude: latitude,
                longitude: longitude,
                expiry: expiry_period
            },
		    success: function(data, status) {
                expiry_date = data.expiry_date;

                $("#location-alert").html("Your location has been updated until "+moment(expiry_date).format('MMMM Do YYYY, h:mm a'));
                $("#location-alert").show();
		    },
		    error: function(x, t, m){
              $("#location-alert").html("Unable to communicate with server, please try again.");
		      $("#location-alert").show();
	    	}
	    });
        return false;
    };

    this.initialize();

}