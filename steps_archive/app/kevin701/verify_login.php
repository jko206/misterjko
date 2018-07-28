<?php // verify_login.php

if (isset($_POST['username'])) $username = $_POST['username'];
if (isset($_POST['password'])) $password = $_POST['password'];

$password = md5($password);

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

$query = "SELECT password, user_type FROM login WHERE user = '" . $username . "'";
$result = $conn->query($query);

$loginSuccess = false;

if($result->num_rows > 0){
    while($row = $result->fetch_assoc()){
        if($row['password'] == $password){
            $loginSuccess = true;
            $user_type = $row['user_type'];
            break;
        }
    }
}

//****************************************
//types: me-> 1,    ben -> 2,   Jina = 3
//****************************************
if($loginSuccess){
    //header and stuff
    ///*
    echo <<<_END
<!DOCTYPE html>
<html>
    <head>
        <title>Ben's Score</title>
        <link rel="stylesheet" type="text/css" href="layout.css" id="style-sheet">
        <script type="text/javascript" src="jquery-1.11.0.js"></script>
        <script type="text/javascript" src="script.js"></script>
        <script type="text/javascript">
            var userID = {$user_type};
        </script>
    </head>
    <body>
_END;
/**/

    //echo "still success! user_type: {$user_type}";
    $query = "SELECT * FROM score";
    $result = $conn->query($query);
    if($result){
        $text = $wedge = $button = $itemNo = '';
        if($user_type == 1 || $user_type == 3){
            $text = "<tr>
                <td><input type='text' placeholder='What did Ben do?' id='getReason'></td>
                <td><input type='number' placeholder='Pts' id='getPoint'></td>
                <td><button class='submit'> &rarr;</td>
            </tr>";
            $wedge = '<th>--</th>';
            $button = '<td><button class="delete-row"> X </button></td>';
        }
        echo "<table><thead><tr><th>Reason</th><th>Score</th> $wedge </tr></thead><tbody>";
        echo "<tr><td>Total:</td><td id='total'></td></tr>";
        while($row = $result->fetch_assoc()){
            $itemNo = 'data-itemNo= "' . $row['itemNo'] . '"';
            $points = $row['points'];
            $reason = $row['reason'];
            $byUser = $row['byUser'];
            if($byUser == 3){
                $color = 'rgb(255, 176, 176)';
            } else if ($byUser == 1){
                $color = 'rgb(176, 176, 255)';
            }
            echo "<tr style='background-color: $color' $itemNo>
                <td>$reason</td>
                <td class='points'>$points</td>
                $button;
            </tr>";
        }
        echo $text . "</tbody></table>";
        echo "</body></html>";
    }
} else {
    //header('Location: index.html');
}


$conn->close();
?>