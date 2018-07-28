<?php


if ($_SERVER['REQUEST_METHOD'] === 'POST'
		&& isset($_POST['username'])
		&& isset($_POST['password'])){
	require 'connection.php';
	$conn = makeConnection();
	$username = $_POST['username'];
	$password = $_POST['password'];
	$query = "SELECT userID FROM user_profile WHERE name='$username' AND password='$password'"; 
	$result = $conn->query($query);	
	$userID = 'a';
	$arr = $result->fetch_array(MYSQLI_NUM);
	if(count($arr) > 0){
		$userID = $arr[0];
	} else {
		header('Location: login.html');
		//print_r($arr);
	}
} else {
	header('Location: login.html');
}

?>


<!DOCTYPE html>
<!-- HTML5 Hello world by kirupa - http://www.kirupa.com/html5/getting_your_feet_wet_html5_pg1.htm -->
<html lang="en-us">

<head>
<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1, maximum-scale=1" />
<meta charset="utf-8">
<title>산수 연습</title>
<script>
var userID = <?=$userID?>;
var user = {
	addLevel : 1,
	subLevel : 1,
	multiLevel : 1,
	addRecord: Infinity,
	subRecord: Infinity,
	multiRecord: Infinity,
	points: 0,
	coins: 0,
	pointsPerCoin: 30,
	updatePoints: function(p){
		this.points += p;
		if(this.points >= this.pointsPerCoin){
			this.coins++;
			this.points = this.points - this.pointsPerCoin;
		}
		if(this.points < 0) this.points = 0; // can't go negative points
	},
	getPoints : function(){
		return this.points;
	}
}

</script>
<script src="jquery-3.1.0.js"></script>
<script src="script.js"></script>
<script src="https://code.jquery.com/ui/1.12.0/jquery-ui.js"></script>
<link rel="stylesheet" href="style.css"></style>

</head>

<body>
<div id="mainContent">
	<div id="buttons">
		<div class="button" id="videos-button">
			VIDEOS
			<span id="coins"></span>
		</div>
		<div class="button" id="progress-button">PROGRESS</div>
	</div>
	<div id="video-list-container">
		<div class="close-button">&#215;</div>
		<div id="message">동전이 부족합니다! 점수를 더 얻은 다음 동전을 얻으세요.</div>
	</div>
	<div id="video-viewing-window">
		<div class="close-button">&#215;</div>
		<!--<video id="video" class="video-js" controls preload="auto" width="640" height="264"
			poster="MY_VIDEO_POSTER.jpg" data-setup="{}">
			<source src="videos/SpongeBob SquarePants/S01/101 Help Wanted.mp4" type='video/mp4'>
			<source src="MY_VIDEO.webm" type='video/webm'>
			<p class="vjs-no-js">
				To view this video please enable JavaScript, and consider upgrading to a web browser that
				<a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>
			</p>
		</video>-->
		<video id="video" class="video-js"></video>
	</div>
	<div id="progress">
		<div class="close-button">&#215;</div>
		#progress
	</div>
	<div id="arithmetic">
		<div class="row" id="row1">##</div>
		<div id="row2">
			<div id="symbol">&#215;</div>
			<div id="number">#</div>
		</div>
		<div class="row" id="line"></div>
		<input type="number" class="row" id="row3">
	</div>
	<div id="points">
		<div class="point">1</div>
	</div>
	<div id="timer">
		#timer
	</div>
	<div id="timeFreeze">
		#timer
	</div>
	<div id="record-countdown">
		<div id="countdown"></div>
		<div id="record">#record</div>
	</div>
	<div id="ajax">
	
	</div>
	<div id="controls">
		<div class="close-button">&#215;</div>
		#controls
		-clear cookie
		-set levels
	</div>
	<div id='virtualKeyboard'>
		<div id="numerals">
			<button class="numkey" value="7">7</button>
			<button class="numkey" value="8">8</button>
			<button class="numkey" value="9">9</button>
			<button class="numkey" value="4">4</button>
			<button class="numkey" value="5">5</button>
			<button class="numkey" value="6">6</button>
			<button class="numkey" value="1">1</button>
			<button class="numkey" value="2">2</button>
			<button class="numkey" value="3">3</button>
			<button class="numkey zeroKey" value="0">0</button>
			<button class="numkey"></button>
		</div>
		<button class="clear-button">&#215;</button>
		<button class="enter-button">&crarr;</button>
	</div>
</div>
</body>
</html>
