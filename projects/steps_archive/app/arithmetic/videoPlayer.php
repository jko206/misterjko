<?php
// This is a video player
	
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
     
} else if($_SERVER['REQUEST_METHOD'] === 'GET' 
		&& isset($_GET['play'])){
	
	$toPlay = $_GET['play'];
	
}
//echo $toPlay;
	
	
?>
<script src="//vjs.zencdn.net/5.4.6/video.min.js"></script>
<video id="video" controls autoplay>
	<source src="<?= $toPlay ?>" type='video/mp4'>
	<p class="vjs-no-js">
		To view this video please enable JavaScript, and consider upgrading to a web browser that
		<a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>
	</p>
</video>