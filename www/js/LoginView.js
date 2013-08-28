var LoginHelper = function() {

    this.isLoggedIn = function(){
        console.log("Auth token: "+localStorage.getItem('auth_token'));
        if(!localStorage.getItem('auth_token')) {
            return false;
        }
        return true;
    };    

    this.signOut = function(){
        console.log("Signing out...");
        localStorage.removeItem('auth_token');
        $.mobile.changePage("login.html", { reverse: false, changeHash: false, transition: "none"});
    }

};

var LoginView = function(store) {

    this.initialize = function() {
        $( "#login_button" ).bind( "click", this.login);
    };
    
    this.login = function(event, ui) {
        console.log('Signing in...');
        event.preventDefault();
        $('.alert').hide();
        $.ajax({
		    url: getBaseUrl()+'/users/sign_in.jsonp',
		    dataType: 'jsonp',
            jsonp: 'callback',
            crossDomain: true,
		    timeout: 2500,
		    data : {
                user : {
            	    email : $('input[name="email"]').val(), //,"tim@teachmatic.com"
            		password : $('input[name="password"]').val()//"12345678"
            		}
            },
		    success: function(data, status) {
			    $('.login-btn').button('reset');
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