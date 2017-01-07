var last_focus_index = 0;
var mainfocus = 0;
var item_count = 0;
var button_count = 3;

function setFocusElement(e) {
	console.log("setFocusElement : keyCode : " + e.keyCode);
	switch (e.keyCode) {
    case TvKeyCode.KEY_UP:
			break;
    case TvKeyCode.KEY_LEFT:
			$('.carousel').carousel('prev');
      break;
    case TvKeyCode.KEY_DOWN:
			break;
		case TvKeyCode.KEY_RIGHT:
		$('.carousel').carousel('next');
            break;
		case TvKeyCode.KEY_RED:
			if (currentPage === "index") {
				saveCurrentUser();
				window.location.href = "profile_tv.html";
			} else if (currentPage === "profile_tv") {
				window.location.href = "index.html";
			}
			break;
		case TvKeyCode.KEY_PAUSE:
			audio.pause();
			break;
		case TvKeyCode.KEY_PLAY:
			audio.play();
			break;
		case TvKeyCode.KEY_NEXT:
			nextSong();
			break;
		case TvKeyCode.KEY_PREVIOUS:
			prevSong();
			break;
    }
}

function showItem(index) {
	//$("#id" + index).addClass("ui-btn-active");
	//$("#id" + index).addClass("ui-focus");
	//$("#li" + index).addClass("ui-focus");
}

function hideItem(index) {
	//$("#id" + index).removeClass("ui-btn-active");
	//$("#id" + index).removeClass("ui-focus");
	//$("#li" + index).removeClass("ui-focus");
	//if((index == item_count - 1) && $(".ui-btn-active").attr("id") && parseInt($(".ui-btn-active").attr("id").substr(2,1)) > item_count - 1){
	//	$(".ui-btn-active").removeClass("ui-btn-active");
	//}
}

$(document).ready(function(){
     console.log("page load complete!!!");
	 item_count = $("ul[data-role='listview']").find("a").length;
	 console.log("li count = " + item_count);
	 showItem(0);
	 $(".ui-controlgroup-controls").attr("style", "width:50%");
});

//ui-btn-active km_focusable
