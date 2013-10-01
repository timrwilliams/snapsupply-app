var AgencySelectionView = function() {

      this.initialize = function() {
        var self = this;
        $( "#linkBtn" ).bind( "click", function(event, ui) {
            event.preventDefault();         
            self.onLinkButton();
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
         if(length==0){
            $("#agency-info-bar").html("<h3>No eligible agencies available to link with. Please read the Help if this is unexpected.")
            $("#agency-info-bar").show();
            $("#home-btn").show();
         }
         else{
          for(var i=0;i<length;i++){
            $("#cbFieldSet").append('<input data-theme="d" type="checkbox" name="cb-'+array[i].id+'" id="cb-'+array[i].id+'" value="'+array[i].name+'"/><label for="cb-'+array[i].id+'">'+array[i].name+'</label>');
         }
         $("#agency-list").trigger("create");
         $("#linkBtn").show();
        }        
        }

        this.onLinkButton = function(){
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
      var ajaxOptions = NH.ajaxOptions("/users/link.jsonp");
      $.ajax( ajaxOptions)
          .done( function ( response ) {                          
            console.log(response);
            self.createCheckboxes(response);
          })
          .fail( function (){
              $("#agency-info-bar").html("<h3>Unable to link you with any agencies. Please check your internet connection and try again or click Help for more assistance.</h3>");
              $("#agency-info-bar").show();
              console.log("Unable to communicate with server at "+ajaxOptions.url);
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
          var data = { client_ids: client_ids }
          var ajaxOptions = NH.ajaxOptions("/users/link.jsonp",data);
          $.ajax( ajaxOptions )
          .done( function ( response ) {     
            $("#agency-info-bar").html("<h3>Succesfully linked with new agencies.</h3>")                     
            $("#agency-info-bar").show();
            self.getAvailableAgencies();
            prefs.shouldRefresh = true;
            console.log(response);            
          })
          .fail( function (){
              $("#agency-info-bar").show();
              console.log("Unable to communicate with server at "+ajaxOptions.url);
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