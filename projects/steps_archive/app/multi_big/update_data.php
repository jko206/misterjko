<?php
 //header('Content-type: application/json');
//echo implode($_POST);
//echo json_encode($_POST);
if (isset($_POST['date'])){
    $date = $_POST['date'];
    $attempts = $_POST['attempts'];
    $success = $_POST['success'];
    $duration = $_POST['duration'];
    echo $date . ' ' . $attempts . '  ' . $success . '  ' . $duration;
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
    // verify user
    $query = "insert into multi values('$date', $attempts, $success, $duration)";
    $result = $conn->query($query);
    $conn->close();
    echo $result;

/**/
} else {
    echo "failed jquery";
}
?>
