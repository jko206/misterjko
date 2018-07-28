<?php

if(isset($_GET['userID']) && $_GET['userID'] != ''){
	$userID = $_GET['userID'];
	$filename = '../../users/'. $userID .'/homework.txt';
	$file = fopen($filename, "r") or die('Unable to open file!');
	$homework = fread($file, filesize($filename));
	echo $homework;
} elseif(isset($_POST['userID']) && $_POST['userID'] != '' 
		&& $_POST['exercise'] && $_POST['exercise'] != ''){
	$userID = $_POST['userID'];
	$exercise = $_POST['exercise'];
	$lastProblem = $_POST['lastProblem'];
	
	$filename = '../../users/'. $userID .'/homework.txt';

	$file = fopen($filename, "r") or die('Unable to open file!');
	$homework = fread($file, filesize($filename));
	$homework = json_decode($homework, true);
	fclose($file);
	foreach($homework as $key => $obj){
		if($obj['exercise'] == $exercise){
			$obj['lastProblem'] = $lastProblem;
			$homework[$key] = $obj;
			$homework = json_encode($homework);
			$result = file_put_contents($filename, $homework);
		}
	}
	//write the $homework backinto file
	//echo "\$lastProblem: $lastProblem";
	//echo 'lastProblem updated successfully on server';
	//echo "$result";
	//echo "$homework";
} else {
	echo '-1';
}
?>