var OffersView = function(store) {

    this.initialize = function() {
        // Define a div wrapper for the view. The div wrapper is used to attach events.
        this.el = $('<div/>');
    };

    this.render = function() {
        this.el.html(OffersView.template());        
        return this;
    };

	this.postRender = function(){
        var start = new Date(2013,04,29,20,00);    
        var timerId =            
        countdown(                        
            start, 
                function(ts) {
                if($('#pageTimer').length!=0){                        
                    document.getElementById('pageTimer').innerHTML = ts.toString().replace(/,([^,]*)$/,'$1');
            } else {
                window.clearInterval(timerId);
            }
        },  
    countdown.HOURS|countdown.MINUTES|countdown.SECONDS,2);

	};
	
    this.initialize();

}

OffersView.template = Handlebars.compile($("#offers-tpl").html());