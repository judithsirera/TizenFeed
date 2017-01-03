var client_id = '8bfcebcf6813621ce65546b27b5853927f1098ec47803457e69248f1c1187f1a';
var base_url = 'https://api.unsplash.com/';
var endpoints = {
	photos: 'photos',
	users: 'users'
};

var backEventListener = null;

var unregister = function() {
    if ( backEventListener !== null ) {
        document.removeEventListener( 'tizenhwkey', backEventListener );
        backEventListener = null;
        window.tizen.application.getCurrentApplication().exit();
    }
}

var downloadPhotosList = function() {
	console.log("downloadPhotosList() called");
	
	var url = base_url + endpoints.photos;
	var params = { client_id: client_id };

	$.get(url, params).done(function(data) {
		console.log(data);
		var template = $("#template").html();
		var i = 1;
		data.forEach(function(photo) {
			params = {
					active: "",
					image: photo.urls.regular,
					profile: photo.user.profile_image.large,
					username: photo.user.username,
					location: photo.user.location,
					date: photo.created_at.split("T")[0],
					likes: photo.likes					
			};
			 
			
			if (i == 1) {
				params.active = "active";
			}
			console.log(photo.color);
			i++;
			
			var rendered = Mustache.render(template, params);
			$("#carousel").append(rendered);
			
		});
	});
}

//Initialize function
var init = function () {
    // register once
    if ( backEventListener !== null ) {
        return;
    }
    
    // TODO:: Do your initialization job
    console.log("init() called");
    downloadPhotosList();
    
    var backEvent = function(e) {
        if ( e.keyName == "back" ) {
            try {
                if ( $.mobile.urlHistory.activeIndex <= 0 ) {
                    // if first page, terminate app
                    unregister();
                } else {
                    // move previous page
                    $.mobile.urlHistory.activeIndex -= 1;
                    $.mobile.urlHistory.clearForward();
                    window.history.back();
                }
            } catch( ex ) {
                unregister();
            }
        }
    }
    
    // add eventListener for tizenhwkey (Back Button)
    document.addEventListener( 'tizenhwkey', backEvent );
    backEventListener = backEvent;
	document.addEventListener( 'keydown', setFocusElement );
};

$(document).bind( 'pageinit', init );
$(document).unload( unregister );
