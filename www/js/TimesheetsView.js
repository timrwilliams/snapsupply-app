$(document).delegate( "#timesheet-page","pageinit",  function( e ) {    
      $( "#ts-list-refresh" ).bind( "click", function(event, ui) {
      event.preventDefault();
      console.log("Refreshing...");
      $("a#ts-list-refresh span.ui-btn-inner span.ui-icon")
      .removeClass("ui-icon-refresh")
      .addClass("ui-icon-ajax");
      return false;
     });  
   }); 