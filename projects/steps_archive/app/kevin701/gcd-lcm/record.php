<?php
if(
    isset($_POST['data']) && $_POST['data'] != ''
){
	$input = $_POST['data'];
	$path = "data.txt";
	$text = "$input,\n";
	file_put_contents($path, $text, FILE_APPEND);
	
	echo 1;
} else {
	if(isset($_POST['data'])){
		echo $_POST['data'];
	}
	var_dump($_POST);
}

?>