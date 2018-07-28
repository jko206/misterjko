<?php

	if (isset($_POST['login_id']) && isset($_POST['password'])){
		$login_id = $_POST['login_id'];
		$password = $_POST['password'];
	} else {
		header('Location: login.html');
	}

	//if so, set username object and pass it to javascript
	//setcookie('set_name', $set_name);
    $servername = "StepsMath.db.10533082.hostedresource.com";
	$mysqllogin = "StepsMath";
	$mysqlpassword = "JK0l0f7l4evr!";
	$dbName = "StepsMath";
    $conn = new mysqli($servername, $mysqllogin, $mysqlpassword, $dbName);

    if($conn->connect_error){
        die ("connection failed: " . $conn->connect_error);
        echo "connection failed.";
    }
	//user_id: something the system assigned;
	//login_id: something the user defined for him/herself;
	//check if the username and password exist. 
	$query = "select user_id from user_profile where login_id = '{$login_id}' 
			and password = '{$password}'";
	$result = $conn->query($query);
	$rows = $result->fetch_row();
	//if not, redirect
	if(count($rows) < 1){
		header('Location: login.html');
	} elseif(count($rows) > 1){
		//error
	} else {
		$user_id = $rows[0];
	}
	
    //if so, get words
	$set_name = 'test_set';
	$query = "select word, definition from word_list where set_name = '$set_name' limit 0, 30";
	//$query = "select word, definition from word_list where set_name = 'test_set'";
	$result = $conn->query($query);
	$json =  json_encode($result->fetch_assoc());
	//echo $query . '<br>' . var_dump($result); 
    $conn->close();

	//echo var_dump($result->fetch_all());
	//$result = mysqli_fetch_array($result);
	
?>

<!DOCTYPE html>
<html lang="en"><head>
	<title>Steps Math: Vocab</title>
	<link rel="stylesheet" type="text/css" href="rsc/layout2.css" id="style-sheet">
	<link rel="stylesheet" type="text/css" href="rsc/jquery-ui.css">
	<link rel="stylesheet" type="text/css" href="rsc/jquery-ui.min.css">
	
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0">

	<!--  Scripts -->
	<script type="text/javascript" src="rsc/jquery-1.11.0.js"></script>
	<script type="text/javascript" src="rsc/jquery-migrate-1.2.1.min.js"></script>
	<script type="text/javascript" src="rsc/jquery-ui-1.10.4.custom.min.js"></script>
	<script type="text/javascript" src="rsc/jquery-ui.min.js"></script>
	<!--<script type="text/javascript" src="https://www.google.com/jsapi"></script>-->
	<script type="text/javascript" src="rsc/cookie.js"></script>
	<script type="text/javascript" src="rsc/script2.js"></script>
	<script type="text/javascript">
		var json = '<?= $json ?>';
		var word_list = JSON.parse(json);
		console.log(json);			//line 25
		function getUserId(){
			return '<?= $user_id ?>';
		}
		if(!getUserId()) window.location = 'login.html';
	</script>
	<!--
	<script src="http://code.highcharts.com/highcharts.js"></script>
	<script src="http://code.highcharts.com/highcharts-more.js"></script>
	<script src="http://code.highcharts.com/modules/exporting.js"></script>
	<!--  /Scripts -->
</head>
<body>
	<div id="left_panel">
		<div class="mini_profile">
			<!--<span id="username">{NAME}</span><br>-->
		</div>
		<!--
		<nav>
			<a href="#" id="pause_game">Pause</a>
			<a href="#" id="end_session">End Session</a>
		</nav>
		-->
	</div>
	<div id="main">
		<div id="word"></div>
		<div id="choices">
			<div id="definition" class="choice">1</div>
			<div class="decoy choice">2</div>
			<div class="decoy choice">3</div>
			<div class="decoy choice">4</div>
			<div class="decoy choice">5</div>
		</div>
	</div>
	<button id="button">randomize</button>
	<button id="save">Save&Quit</button>

</body></html>