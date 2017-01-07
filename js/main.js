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
				clearPhotoSelected();
    }
}

var downloadPhotosList = function() {
	console.log("downloadPhotosList() called");

	var url = base_url + endpoints.photos;
	var params = { client_id: client_id };

	$.get(url, params).done(function(data) {
		var template = $("#template").html();
		var i = 1;
		var total = data.length;
		var activeSet = false;
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

			if (getCurrentUser() == undefined && i == 1 && !activeSet) {
				params.active = "active";
				activeSet = true;
			} else if (params.username == getCurrentUser() && !activeSet) {
				params.active = "active";
				activeSet = true;
				if (getPhotoSelected() != undefined) {
					params.image = getPhotoSelected();
				}
			}
			i++;

			var rendered = Mustache.render(template, params);
			$("#carousel").append(rendered);
		});
	});
}

var downloadProfileUser = function(username) {
	console.log("downloadProfileUser(" + username + ") called");

	var url_profile = base_url + endpoints.users + "/" + username;
	var url_photos = url_profile + "/" + endpoints.photos;
	var params = { client_id: client_id };

	$.get(url_profile, params).done(function(data) {
		console.log(data);

		var template = $("#userInformationTemplate").html();
		params_ = {
			image: data.profile_image.large,
			username: data.username,
			name: data.name,
			posts: data.total_photos,
			followers: data.followers_count,
			following: data.following_count
		}

		var rendered = Mustache.render(template, params_);
		$("#userInformation").append(rendered);
	});

	params.per_page = 8;
	$.get(url_photos, params).done(function(data) {
		var template = $("#userPostsTemplate").html();

		var i = 1;
		data.forEach(function(photo) {
			console.log(photo);

			params_ = {
				image: photo.urls.small,
				focusInit: "false",
				focused: ""
			}

			if (i == 1) {
				params_.focusInit = "true";
				params_.focused = "focused";
			}
			i++;

			var rendered = Mustache.render(template, params_);
			$("#userPosts").append(rendered);
		});
	});
}

var downloadData = function () {
	if (currentPage === "index") {
		downloadPhotosList();
	} else if (currentPage === "profile_tv") {
		downloadProfileUser(getCurrentUser());
	}
}

var currentPage;

var getCurrentPage = function () {
	var arr = window.location.pathname.split("/");
	var file = arr[arr.length-1];

	return file.split(".")[0];
}

var getCurrentUser = function () {
	return localStorage.getItem("currentUser");
}

var saveCurrentUser = function () {
	var currentUser = $(".item.active").find("#username").html();
	localStorage.setItem("currentUser", currentUser);
}

var saveMusicState = function (state) {
	localStorage.setItem("musicState", state);
}

var getMusicState = function () {
	return localStorage.getItem("musicState");
}

var saveCurrentSong = function () {
	localStorage.setItem("currSong", currSong);
}

var getCurrentSong = function () {
	return localStorage.getItem("currSong");
}

var saveNewPhoto = function (new_photo) {
	localStorage.setItem("photoSelected", new_photo);
}

var getPhotoSelected = function () {
	return localStorage.getItem("photoSelected");
}

var clearPhotoSelected = function () {
	localStorage.removeItem("photoSelected");
}

var songs = [
             "Lost Frequencies ft. Janieck Devy -  Reality.mp3",
             "Coldplay - Adventure Of A Lifetime.mp3",
             "Adam Levine & R. City - Locked Away Lyrics.mp3",
             "Gabriela Richardson ft. Y'ALL - Hundred Miles.mp3",
             "Otto Knows - Next to Me.mp3"
             ];
var currSong;
var audio = new Audio();

var playSong = function () {
	console.log("play", songs[currSong]);
	audio.src = 'music/' + songs[currSong];
	audio.onended = function() {
	    nextSong();
	};
	audio.play();
}

var prevSong = function () {
	n = currSong - 1;
	m = songs.length;
	currSong = ((n % m) + m) % m;
	saveCurrentSong();
	playSong();
}

var nextSong = function () {
	currSong = (currSong + 1) % songs.length;
	saveCurrentSong();
	playSong();
}

var initMusic = function () {
	if (getCurrentSong() == undefined) {
		currSong = 0;
	}else {
		currSong = getCurrentSong();
	}
	playSong();

	if (getMusicState() == "pause") {
		audio.pause();
	}
}

//Initialize function
var init = function () {
    // register once
    if ( backEventListener !== null ) {
        return;
    }

    // TODO:: Do your initialization job
    console.log("init() called");
    currentPage = getCurrentPage();
    downloadData();
    initMusic();

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
