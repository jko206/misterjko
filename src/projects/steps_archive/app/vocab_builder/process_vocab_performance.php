<?php
 //header('Content-type: application/json');
//echo implode($_POST);
//echo json_encode($_POST);
if (isset($_POST['word_list'])){

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

    echo "success";
    $words_list = $_POST['word_list'];
    $set_name = $_POST['set_name'];
    foreach($words_list as $word){
        $w = $word['word'];
        $def = $word['def'];

        // insert words
        $query = "insert into word_list values('$w', '$def', '$set_name')";
        $result = $conn->query($query);
        //echo $result;
    }
    $conn->close();


/**/
} else {
    echo "failed jquery";
}
?>
