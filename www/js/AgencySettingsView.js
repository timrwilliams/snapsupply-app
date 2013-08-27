var AgencySettingsView = function() {

  this.initialize = function() {
    var self = this;
    $( "#agencySaveBtn" ).bind( "click", function(event, ui) {
      event.preventDefault();         
      return false;
    });         
    var client = dto.client;    
    self.populateFields(client);
  };


  this.populateFields = function(client){
    console.log("Initializing",client);
   $("#agency-name").html(client.name);
   $("#agency-status").html(client.status.capitalize());   
}

  this.initialize();

};