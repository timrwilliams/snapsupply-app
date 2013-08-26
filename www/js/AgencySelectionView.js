var AgencySelectionView = function() {

      this.initialize = function() {
        var self = this;
        $( "#showBtn" ).bind( "click", function(event, ui) {
            event.preventDefault();         
            self.showSelectedNames();
            return false;
        });         
         self.getAvailableAgencies();
    };


        this.createCheckboxes = function(data){
         $("#createBtn").remove();
         $("#agency-list").html("");
         $("#agency-list").append('<fieldset  id="cbFieldSet" data-role="controlgroup">');
         var array = data.unlinked_clients
         var length = array.length;
         for(var i=0;i<length;i++){
            $("#cbFieldSet").append('<input data-theme="d" type="checkbox" name="cb-'+array[i].id+'" id="cb-'+array[i].id+'" value="'+array[i].name+'"/><label for="cb-'+array[i].id+'">'+array[i].name+'</label>');
         }

         $("#agency-list").trigger("create");
         $("#showBtn").css("visibility","visible");
        }

        this.showSelectedNames = function(){
            var count = $("#cbFieldSet input:checked").length;            
            var result = [];
            for(i=0;i<count;i++){
                result.push($("#cbFieldSet input:checked")[i].id.slice(3));
            }   
            this.showSpinner();         
            this.linkWithAgencies(result.join());
        }

    this.getAvailableAgencies = function(){
      console.log("Getting agency list");
      var self = this;
      self.showSpinner();
      var url = getBaseUrl()+"/users/link.jsonp";
      $.ajax({
            url: url,
            dataType: "jsonp",
            crossDomain: true,
            timeout: 2500,
            data: {
              auth_token: storage.getItem('auth_token')
            }
          })
          .done( function ( response ) {                          
            console.log(response);
            self.createCheckboxes(response);
          })
          .fail( function (){
              $("#home-info-bar").show();
              console.log("Unable to communicate with server at "+url);
          })
          .always( function (){            
              setTimeout(function(){self.hideSpinner()},100); 
          });
    };

        this.linkWithAgencies = function(client_ids){
          var self = this;
          self.showSpinner();
          var url = getBaseUrl()+"/users/link.jsonp";
          $("#agency-info-bar").hide();
          $.ajax({
            url: url,
            dataType: "jsonp",
            crossDomain: true,
            timeout: 2500,
            data: {
              auth_token: storage.getItem('auth_token'),
              client_ids: client_ids
            }
          })
          .done( function ( response ) {     
            $("#agency-info-bar").html("<h3>Succesfully linked with new agencies.</h3>")                     
            $("#agency-info-bar").show();
            self.getAvailableAgencies();
            console.log(response);            
          })
          .fail( function (){
              $("#agency-info-bar").show();
              console.log("Unable to communicate with server at "+url);
          })
          .always( function (){            
              setTimeout(function(){self.hideSpinner()},100); 
          });
    };

  this.showSpinner = function(){
  $("#agency-spinner").show();
};

this.hideSpinner = function(){
  $("#agency-spinner").hide();
};
  this.showModal = function(){
    $("body").append('<div class="modalWindow"/>');
    $.mobile.loading( 'show', {
      text: 'Finding agencies...',
      textVisible: true,
      theme: 'b',
      html: ""
    });
  };

 this.hideModal = function(){
    $(".modalWindow").remove();
    $.mobile.loading( 'hide' )
  };

};