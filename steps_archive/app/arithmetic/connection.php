<?php
function makeConnection(){
	//connect to server
	$servername = "StepsMath.db.10533082.hostedresource.com";
	$mysqllogin = "StepsMath";
	$mysqlpassword = "JK0l0f7l4evr!";
	$dbName = "StepsMath";
	$conn = new mysqli($servername, $mysqllogin, $mysqlpassword, $dbName);

	if($conn->connect_error){
		die ("connection failed: " . $conn->connect_error);
		echo "connection failed.";
	}
	return $conn;
}

function closeConn($conn){
$conn->close();
}


?>