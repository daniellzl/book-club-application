$(document).ready(function() {

    // when trade dropdown button clicked
    $('#trade').click(function() {
        
        // get user's books
        $.post("/user/books", function(data, status){

            // if no books available
            if (typeof data === 'string') {
                
                // notify user
                $("#dropdown").empty();
                $("#dropdown").append(data);
                
            // if books available
            } else {
            
                // populate dropdown with books
                var content = '';
                for (var i = 0, l = data.length; i < l; i++) {
                    content += '<li onclick="tradeBook(' + "'" + data[i]._id + "','" + data[i].title + "'" + ')"><a>' + data[i].title + '</a></li>';
                }
                $("#dropdown").empty();
                $("#dropdown").append(content);
            }
        });
    });
    
    // when add book button clicked
    $('#addBook').click(function() {
        
        // make sure there are no empty fields
        if ($('#title').val() === '' || $('#author').val() === '' || $('#imageURL').val() === '') {
            $('.modal-body').html("<h3>Title, author, and image URL are required!</h3>");
            return $('.modal').modal();
        }
            
        // save variables
        var object = {};
        object.title = $('#title').val();
        object.author = $('#author').val();
        object.imageURL = $('#imageURL').val();
        object.comments = $('#comments').val();
        
        // make request to post book
        $.post("/user/create", object, function(data, status){
            window.location.replace("/user");
        });
    });

    // when update button clicked
    $('#update').click(function() {
        
        // make sure there are no empty fields
        if ($('#name').val() === '' || $('#city').val() === '' || $('#state').val() === '' || $('#zip').val() === '') {
            $('.modal-body').html("<h3>All fields required to update profile information!</h3>");
            return $('.modal').modal();
        }
        
        // save variables
        var object = {};
        object.name  = $('#name').val();
        object.city = $('#city').val();
        object.state = $('#state').val();
        object.zip = $('#zip').val();
        
        // query database and update
        $.post("/user/update", object, function(data, status){
            window.location.replace("/user");
        });
    });
});

// trade book
function tradeBook(bookOfferedId, bookOfferedTitle) {

    // save variables
    var object = {
        bookRequested: $("#bookId").html(),
        bookWantedOwnerId: $("#ownerId").html(),
        bookWantedTitle: $("#bookWantedTitle").html(),
        bookOfferedId: bookOfferedId,
        bookOfferedTitle: bookOfferedTitle
    };
    
    // make trade request
    $.post("/books/trade", object, function(data, status) {
        $('.modal-body').html("<h3>" + data + "</h3>");
        return $('.modal').modal();
    });
}

// accept trade
function acceptTrade(bookWantedId, bookWantedOwnerId, bookOfferedId, bookOfferedOwnerId) {
    
    // save variables
    var object = {};
    object.bookWantedId = bookWantedId;
    object.bookWantedOwnerId = bookWantedOwnerId;
    object.bookOfferedId = bookOfferedId;
    object.bookOfferedOwnerId = bookOfferedOwnerId;
    
    // make accept trade request
    $.post("/user/acceptTrade", object, function(data, status) {
        window.location.replace("/user");
        $('.modal-body').html("<h3>" + data + "</h3>");
        return $('.modal').modal();
    });
}