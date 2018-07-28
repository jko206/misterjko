<?php
if(isset($_POST['username']) && isset($_POST['password']) 
		&& $_POST['username'] != '' && $_POST['password'] != ''){
	$username = $_POST['username'];
	$password = $_POST['password'];
	$file = fopen('../../users/users.txt', "r") or die('Unable to open file!');
	$users = fread($file, filesize('../../users/users.txt'));
	$user = json_decode($users, true)[$username];
	if($user['password'] == $password){
		$userID = $user['userID'];
		$lang = $user['language'];
		echo "[$userID, \"$lang\"]";
	} else {
		echo '-1';
	}
} else {
	echo '-1';
}


?>