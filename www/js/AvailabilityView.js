var AvailabilityView = function() {

    this.initialize = function() {
        // Define a div wrapper for the view. The div wrapper is used to attach events.
        this.el = $('<div/>');
        this.el.on('click', '#createCal', this.createCal);
    };

    this.render = function() {    	
        this.el.html(AvailabilityView.template()); 
        return this;
    };

	this.postRender = function(){
    	$('#multiInlinePicker').datepick({ 
        	multiSelect: 99, monthsToShow: 1, monthsToStep: 1, 
        	onSelect: showDate, yearRange: '-1:+1'}); 
    	$('#multiInlinePicker').datepick('setDate', selectedDates); 
    }

	this.initialize();

	function showDate(date){	
		/*$('#dateDisplay').empty();	
        $('#dateDisplay').append('<ul>');
        for (var i=0;i<date.length;i++){
        	$('#dateDisplay').append('<li>'+date[i]+'</li>')
        };
        $('#dateDisplay').append('</ul>');*/
	};

	var selectedDates = [new Date(2013, 4,27),new Date(2013, 4, 15)];

};


AvailabilityView.template = Handlebars.compile($("#availability-tpl").html());