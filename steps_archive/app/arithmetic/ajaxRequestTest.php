<?php

require 'connection.php';

$keys = array_keys($_POST);
foreach($keys as $key){
    $value = $_POST[$key];
    if(is_array($value)) $value = json_encode($value);
    echo "$key : $value <br>";
}

?>