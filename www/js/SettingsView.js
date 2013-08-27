var SettingsView = function() {

    this.initialize = function() {
        $( "#sign_out_button" ).bind( "click", this.signOut);
        this.createClientSettings();        
    };

    this.createClientSettings = function(){
        var clients = prefs.getClients();
        var length = clients.length;
        var html = "";
        for(var i=0;i<length;i++){
            html += "<li data-theme='c'><a href='agency-settings.html#"+i+"'>"+clients[i].name+"</a></li>";
        }
        html += "<li data-theme='b'><a href='agency-selection.html' id='agency_selection_button' >Add Agency</a></li>";
        $ul = $("#agency-settings-list");
        $ul.html(html);
        $('#agency-settings-list a').on('click', function(e) {
          e.preventDefault();
          console.log(clients);
          var clientId  = $(this).prop("hash").substring(1);          
          console.log(clientId);
          dto.client = clients[clientId];
          console.log("Changing back to settings page...");
          $.mobile.changePage('agency-settings.html', {
            transition: "none"
        });
          return false;
      });

        $ul.listview( "refresh" );
        $ul.trigger( "updatelayout");
    }

    this.signOut = function(event, ui) {
        login.signOut();
    };
    /*
    this.register = function(event, ui) {
        console.log('Registering new user...');
        event.preventDefault();
        $('.alert').hide();
        $.ajax({
		    url: getBaseUrl()+'/users/create.jsonp',
		    dataType: 'jsonp',
            jsonp: 'callback',
            crossDomain: true,
		    timeout: 2500,
		    data : {
                user : {
            	    email : $('input[name="email"]').val(), //,"tim@teachmatic.com"
            		password : $('input[name="password"]').val(),//"12345678"
                    password_confirmation : $('input[name="password"]').val(),//"12345678"
                    first_name : $('input[name="first_name"]').val(),//"12345678"
                    last_name : $('input[name="last_name"]').val()
            		}
            },
		    success: function(data, status) {
			    $('.register-btn').button('reset');
                console.log(data);
                localStorage.setItem('auth_token', data.auth_token);
                localStorage.setItem('username', data.username);
                localStorage.setItem('user_diary', data.diary_id);
                console.log("re-routing");
                $.mobile.changePage("index.html", { reverse: false, changeHash: false, transition: "fade"});
		    },
		    error: function(x, t, m){
		        $(".alert").show();
	    	}
	    });
        return false;
    };

	this.postRender = function(){
	};
	*/    
    this.initialize();

}