<?php

$NUM_OF_TIMES_TO_AVG = 5;

if(isset($_POST['exercise']) && $_POST['exercise'] != ''
		&& isset($_POST['isCorrect']) && $_POST['isCorrect'] != '' 
		&& isset($_POST['userID']) && $_POST['userID'] !='' 
		&& isset($_POST['date']) && $_POST['date'] !='' 
		&& isset($_POST['duration']) && $_POST['duration'] !=''
		&& isset($_POST['FIRST_TRY']) && $_POST['FIRST_TRY'] !=''){
			
			//FIRST_TRY
	//unpack data
	$exercise = $_POST['exercise'];
	$isCorrect = $_POST['isCorrect'];
	$userID = $_POST['userID'];
	$date = $_POST['date'];
	$FIRST_TRY = $_POST['FIRST_TRY'];
	$FIRST_TRY = filter_var($FIRST_TRY, FILTER_VALIDATE_BOOLEAN);
	$duration = intval($_POST['duration']);

	$totalResponses = 0; //intval() -->parse int
	$totalCorrect = 0;
	$consCorrect = 0;
	$timesToAvg = [];
	
	//assess whether today's requirements are met for the exercise
	$path = "../../users/$userID/states/$exercise.state";
	if(file_exists($path)) $reqState = file_get_contents($path);
	else $reqState = '{}';

	if(strlen($reqState) > 0){
		$reqState = json_decode($reqState, true); 
		if($reqState['date'] == $date){
			if(array_key_exists('totalResponses', $reqState)) $totalResponses = intval($reqState['totalResponses']);
			if(array_key_exists('totalCorrect', $reqState)) $totalCorrect = intval($reqState['totalCorrect']);
			if(array_key_exists('consCorrect', $reqState)) $consCorrect = intval($reqState['consCorrect']);
			if(array_key_exists('timesToAvg', $reqState)){
				$timesToAvg = $reqState['timesToAvg'];
				if(!is_array($timesToAvg)) $timesToAvg = [];
			} 
		}
	}
	
	$totalResponses++;
	if($isCorrect){
		$totalCorrect++;
		if(sizeof($timesToAvg) >= $NUM_OF_TIMES_TO_AVG){
			array_shift($timesToAvg);
		}
		array_push($timesToAvg, $duration);
		if($FIRST_TRY) $consCorrect++;
	} else {
		$consCorrect = 0;
	}
	
	$reqState['date'] = $date;
	$reqState['totalResponses'] = $totalResponses;
	$reqState['totalCorrect'] = $totalCorrect;
	$reqState['consCorrect'] = $consCorrect;
	$reqState['timesToAvg'] = $timesToAvg;
	$reqState = json_encode($reqState);
	echo $reqState;
	//save the state
	file_put_contents($path, $reqState);

} elseif(isset($_GET['date']) && $_GET['date'] !='' 
		&& isset($_GET['userID']) && $_GET['userID'] != ''
		&& isset($_GET['exercise']) && $_GET['exercise'] != '') {
	$userID = $_GET['userID'];
	$exercise = $_GET['exercise'];
	$date = $_GET['date'];
	$path = "../../users/$userID/states/$exercise.state";
	if(file_exists($path)) $reqState = file_get_contents($path);
	else $reqState = '{}';

	if(strlen($reqState) > 0 && json_decode($reqState, true)['date'] == $date){
		echo $reqState;
	} else {
		echo '{}';
	}
} else {
	echo "insufficient data to get requirements met";
	echo var_dump($_POST);
}




?>