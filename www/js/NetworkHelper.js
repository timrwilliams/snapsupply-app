function NetworkHelper(baseUrl) {
	this.baseUrl = baseUrl;

	this.ajaxOptions = function(destination,extraData,options){
		console.log("Generating AJAX options");
		extraData = typeof extraData !== 'undefined' ? extraData : {};
    options = typeof options !== 'undefined' ? options : {};
		var email = storage.getItem('username');
		var authToken = storage.getItem('auth_token');
		var data = {
              user_email: email,
              auth_token: authToken
        };
        var mergedData = $.extend({}, data, extraData);  
		var baseOptions = {
            url: getBaseUrl()+destination,
            dataType: "jsonp",
            crossDomain: true,
            timeout: 2500,
            data: mergedData
         }
    var mergedOptions =  $.extend({}, baseOptions, options);  
    return mergedOptions;
	}
}