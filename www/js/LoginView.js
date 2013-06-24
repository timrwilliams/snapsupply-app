var LoginView = function(store) {

    this.initialize = function() {
        // Define a div wrapper for the view. The div wrapper is used to attach events.
        this.el = $('<div/>');
        this.el.on('click', '.login-btn', this.login);
        $('.login-btn').button()
    };

    this.render = function() {
        this.el.html(LoginView.template());
        return this;
    };

    this.login = function(event) {
        event.preventDefault();
        $('.login-btn').button('loading');
        $('.alert').hide();
        $.ajax({
		    url: 'http://snapsupply.herokuapp.com/users/sign_in.jsonp',
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
                app.route();
		    },
		    error: function(x, t, m){
		        $('.login-btn').button('reset');
		        $(".alert").show();
	    	}
	    });
        return false;
    };

	this.postRender = function(){
	};
	
    this.initialize();

}

LoginView.template = Handlebars.compile($("#login-tpl").html());
$(function() {
  $.ajaxSetup({
    'beforeSend': function(xhr) {
    xhr.setRequestHeader("accept", "appplication/json");
    }
  });
});