var OfferView = function(employee) {

    this.initialize = function() {
        this.el = $('<div/>');
        this.el.on('click', '.accept-btn', this.acceptOffer);
        this.el.on('click', '.reject-btn', this.rejectOffer);
    };

    this.render = function() {
        this.el.html(OfferView.template(employee));        
        return this;
    };

    this.acceptOffer = function(event) {
        event.preventDefault();
        showConfirm('Accept');
        return false;
    };

    this.rejectOffer = function(event) {
        event.preventDefault();
        showConfirm('Reject');
        return false;
    };

    this.postRender = function(){
    };

    this.initialize();

}

OfferView.template = Handlebars.compile($("#offer-tpl").html());
// process the confirmation dialog result
    function onButton(button) {
        //alert('You selected button ' + button);
    };

   function showConfirm(msg) {
        navigator.notification.confirm(
            'Are you sure you want to '+msg.toLowerCase()+' this job?',  // message
            onButton,              // callback to invoke with index of button pressed
            msg+' job?',            // title
            'Confirm,Cancel'          // buttonLabels
        );
    }

    
    