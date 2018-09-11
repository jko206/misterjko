$('document').ready(function(){
	var video = window.location.search;
	if(docCookies.hasItem(video)){
		var t = docCookies.getItem(video); 
		if(t > 600) window.close();
	}
	$('video').on('timeupdate', function(){
		var currTime = $(this).prop('currentTime');
		docCookies.setItem(video, currTime, 180);
	});
});