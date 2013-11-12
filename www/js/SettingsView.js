var SettingsView = function() {

    this.initialize = function() {
        $( "#sign_out_button" ).bind( "click", this.signOut);
        this.createClientSettings();        
    };

    this.createClientSettings = function(){
        var clients = prefs.getClients();
        var html = "";
        if(clients!=null){
            var length = clients.length;        
            for(var i=0;i<length;i++){
                html += "<li data-theme='c'><a class='concrete-agency' href='agency-settings.html#"+i+"'>"+clients[i].name+"</a></li>";
            }
        }
        //html += "<li data-theme='b'><a href='agency-selection.html' id='agency_selection_button' >Add Agency</a></li>";
        $ul = $("#agency-settings-list");
        $ul.html(html);
        $('#agency-settings-list a.concrete-agency').on('click', function(e) {
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

    this.initialize();

}