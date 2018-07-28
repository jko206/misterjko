<?php

if(isset($_GET['userID']) && $_GET['userID'] != ''){
	$userID = $_GET['userID'];
	$filename = '../../users/'. $userID .'/points.txt';
	$file = fopen($filename, "r") or die('Unable to open file!');
	$points = fread($file, filesize($filename));
	
	$filename = '../../users/'. $userID .'/pointsConfig.txt';
	$file = fopen($filename, "r") or die('Unable to open file!');
	$pointsConfig = fread($file, filesize($filename));
	
	echo "[$points, $pointsConfig]";
} elseif( isset($_POST['userID']) && $_POST['userID'] != '' 
		&& isset($_POST['data']) && $_POST['data'] != ''){
	$userID = $_POST['userID'];
	$data = $_POST['data'];
	$file = '../../users/' . $userID . '/points.txt';
	file_put_contents($file, $data);
} else {
	echo '-1';
}
?>
