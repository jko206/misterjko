<?php

if(
    isset($_POST['resp']) && $_POST['resp'] != ''
    && isset($_POST['id']) && $_POST['id'] != ''
){
    $resp = $_POST['resp'];
    $id = $_POST['id'];
    if($id == 'q1' && $resp == 216){
        echo 1;
    } else if($id == 'q2' && $resp == 30){
        echo 1;
    }
} else {
    echo 0;
}

?>