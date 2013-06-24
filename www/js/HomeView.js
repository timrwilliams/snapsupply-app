var HomeView = function(store) {

    this.initialize = function() {
        // Define a div wrapper for the view. The div wrapper is used to attach events.
        this.el = $('<div/>');
        this.el.on('click', '.login-btn', this.login);
            this.el.on('click', '.test-btn', this.testJq);
    };

    this.render = function() {
        this.el.html(HomeView.template());        
        return this;
    };
    this.testJq = function(event){
        console.log('Attempting jquery test');
        event.preventDefault();
        var request = new XMLHttpRequest();
            request.open("GET", "http://ip.jsontest.com", true);
            request.onreadystatechange = function(){
                if (request.readyState == 4) {
                    if (request.status == 200 || request.status == 0) {
                        console.log("*" + request.responseText + "*");
                    }
                }
            }
            request.send();
            console.log('Completed jquery test');
            return false;
    }

    this.testAjax = function(event) {
        console.log('Attempting ajax test');
        event.preventDefault();
        $.get("http://ip.jsontest.com",function(data,status){
            alert("Data: " + data + "\nStatus: " + status);
        });
        console.log('Ajax test completed');
        return false;
    };

    this.login = function(event) {
        event.preventDefault();
        $.ajax({
		    url: 'http://snapsupply.herokuapp.com/users/sign_in.jsonp',
		    dataType: 'jsonp',
            jsonp: 'callback',
            crossDomain: true,
		    timeout: 25000,
		    data : {
                user : {
            	    email : "tim@teachmatic.com", //$('input[name="email"]').val(),
            		password : "12345678"//$('input[name="password"]').val()
            		}
            },
		    success: function(data, status) {
			    alert(data.auth_token);
                localStorage.setItem('auth_token', data.auth_token);

		    },
		    error: function(){
    			alert('Oh no! not again.');
	    	}
	});
        return false;
    };

	this.postRender = function(){
	};
	
    this.initialize();

}

HomeView.template = Handlebars.compile($("#home-tpl").html());
$(function() {
  $.ajaxSetup({
    'beforeSend': function(xhr) {
    xhr.setRequestHeader("accept", "appplication/json");
    }
  });
});