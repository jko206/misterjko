<?php

if(isset($_POST['exercise']) && $_POST['exercise'] != ''
		&& isset($_POST['response']) && $_POST['response'] != '' 
		&& isset($_POST['userID']) && $_POST['userID'] !='' 
		&& isset($_POST['date']) && $_POST['date'] !='' 
		&& isset($_POST['time']) && $_POST['time'] !='' 
		&& isset($_POST['duration']) && $_POST['duration'] !='' 
		&& isset($_POST['isCorrect']) && $_POST['isCorrect'] !=''
		&& isset($_POST['level']) && $_POST['level'] !=''
		&& isset($_POST['skillSet']) && $_POST['skillSet'] !=''){
	//unpack data
	$exercise = $_POST['exercise'];
	$response = $_POST['response'];
	$userID = $_POST['userID'];
	$date = $_POST['date']; 
	$time = $_POST['time'];
	$duration = $_POST['duration'];
	$isCorrect = $_POST['isCorrect'] ? 'true' : 'false';
	$level = $_POST['level'];
	$skillSet = $_POST['skillSet'];
	echo $skillSet;

	// log response
	$path = "../../users/$userID/resp/$exercise.log";
	$text = "$date \t $time \t $response \t $duration \t $isCorrect \t $level \t $skillSet \n";
	file_put_contents($path, $text, FILE_APPEND);
} else {
	echo "insufficient data to record response: " . json_encode($_POST);
}
?>