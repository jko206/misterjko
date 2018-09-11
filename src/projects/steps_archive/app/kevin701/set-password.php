<?php
$servername = "StepsMath.db.10533082.hostedresource.com";
$mysqllogin = "StepsMath";
$mysqlpassword = "JK0l0f7l4evr!";
$dbName = "StepsMath";

$conn = new mysqli($servername, $mysqllogin, $mysqlpassword, $dbName)
		or die("<html><script language='JavaScript'>alert('Unable to connect to database! Please try again later.'),history.go(-1)</script></html>");

if($conn->connect_error){
    die ("connection failed: " . $conn->connect_error);
    echo "failure";
}

$password = md5('coolpokemario');
$query = "INSERT INTO login VALUES ('$password', 'ben', 2)";
$result = $conn->query($query);

$password = md5('checkonben');
$query = "INSERT INTO login VALUES ('$password', 'Jina', 3)";
$result = $conn->query($query);

$password = md5('dlfdlrhdtka');
$query = "INSERT INTO login VALUES ('$password', 'me', 1)";
$result = $conn->query($query);

?>