var SchoolSelect = function() {
  $("#school-list").on("listviewbeforefilter", function(e,data) {
    var $ul = $( this ),
    $input = $( data.input ),
    html ="",
    value = $input.val();
    $ul.html( "" );

    if ( value && value.length > 2 ) {
          $ul.html( "<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>" );
          $ul.listview( "refresh" );
          $.ajax({
            url: "http://lvh.me:3000/employers/typeahead.jsonp",
            dataType: "jsonp",
            crossDomain: true,
            data: {
              query: $input.val()
            }
          })
          .then( function ( response ) {
            $.each( response.options, function ( i, val ) {
              html += "<li><a href=\"#"+val.id+ "\">" + val.label + "</a></li>";
            });
            $ul.html( html );
            $('#school-list a').on('click', function(e) {
              e.preventDefault();
              tsForm.selectedSchool = this.text;
              tsForm.selectedSchoolId = $(this).prop("hash").substring(1);
              $.mobile.changePage('timesheet-create.html', {
                reverse: false, changeHash: false,transition: "none"
              });
            });
            $ul.listview( "refresh" );
            $ul.trigger( "updatelayout");
          });
        }
  });    

};