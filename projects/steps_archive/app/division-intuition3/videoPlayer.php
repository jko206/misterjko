<?php
// This is a video player
	
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
     
} else if($_SERVER['REQUEST_METHOD'] === 'GET' 
		&& isset($_GET['play'])){
	
	$toPlay = '../../homework/' . $_GET['play'];
	
}
//echo $toPlay;
	
	
?>
<script 
  src="https://code.jquery.com/jquery-3.1.1.min.js"
  integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8="
  crossorigin="anonymous">
</script>
<script src="//vjs.zencdn.net/5.4.6/video.min.js"></script>
<script src="js/init.js"></script>
<script src="js/video.js"></script>
<video id="video" controls autoplay>
	<source src="<?= $toPlay ?>" type='video/mp4'>
	<p class="vjs-no-js">
		To view this video please enable JavaScript, and consider upgrading to a web browser that
		<a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>
	</p>
</video>