<?php

if(isset($_POST['data'])){
	$text = $_POST['data'];
		
	$myfile = fopen("../responses/response.txt", "a") or die("Unable to open file!");
	
	fwrite($myfile, "\n" . $text);
	fclose($myfile);
	echo $text;
} 




?>