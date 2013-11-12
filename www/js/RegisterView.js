var RegisterView = function(store) {

    this.initialize = function() {
        console.log("Init register");
        $( "#register_button" ).bind( "click", this.register);
    };
    
    this.register = function(event, ui) {
        console.log('Registering new user...');
        event.preventDefault();
        $('.alert').hide();
        clientId = i18n.prop('clientId');
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
            	},
                client_id : clientId
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
	    
    this.initialize();

}