<?php

if(
    isset($_POST['resp']) && $_POST['resp'] != ''
    && isset($_POST['id']) && $_POST['id'] != ''
){
    $resp = $_POST['resp'];
    $id = $_POST['id'];
    if($id == 'q01' && $resp == 28){
        echo 1;
    } else if($id == 'q02' && $resp == 16){
        echo 1;
    } else {
        echo 0;
    }
} else {
    echo 0;
}

?>