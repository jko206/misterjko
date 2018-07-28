<?php
    require_once('php-console-master/src/PhpConsole/__autoload.php');    
    /*
    It doesn't now, but in the future it should:
        -check for duplicates; (like kids with same parents or something)
        -sort put the new users into different login table for first time login
        -check for SQL injection
        -skip empty lines
        -Make sure birthday and names are in correct format;
        -throw exceptions;
    */
    if (isset($_POST['data']) && isset($_POST['userID'])){
        $data = $_POST['data'];
        $jsonData = json_decode($_POST['data'], true); 
        $userID = $_POST['userID'];
        
        //process the data
        $newStudents = $jsonData[0];
        $newTeachers = $jsonData[1];

        //connect to server
        $servername = "localhost";
        $mysqllogin = "root";
        $mysqlpassword = "";
        $dbName = "testdb";
        $conn = new mysqli($servername, $mysqllogin, $mysqlpassword, $dbName);

        if($conn->connect_error){
            die ("connection failed: " . $conn->connect_error);
            echo "connection failed.";
        }
        //deal with MySQL query
        //students first
        foreach($newStudents as $student){
            $name = $student['name'];
            $bday = $student['bday']; // YYYY-MM-DD format
            $parent = $student['parent']; 
            $parentBDay = $student['parentBDay']; // YYYY-MM-DD format
            $parentNumber = $student['parentNumber']; 
            $tempPassword = $bday; // change this part later
            
            //input new student
            $query = 'INSERT INTO login (username, user_type, password)'
                    . ' VALUES("' . $name . '", "3", "' . $tempPassword . '")';
            
            $result = $conn->query($query);
            if( $result === false){
                echo $query . '<br>';
                echo $conn->error;
            }
            // get the new student's ID
            $query = 'SELECT userID FROM login where username = "' . $name . '"';
            $studentID = $conn->query($query);
            if($studentID === false){
                echo $query . '<br> \n';
                echo $conn->error;
            } else {
                $studentID = $studentID->fetch_row()[0];
            }


            //input the new parent
            $query = 'INSERT INTO login (username, user_type, password)'
                    . ' VALUES("' .$parent . '", "4", "' . $parentBDay .'")';
            $result = $conn->query($query);
            
            //get the new parent's ID
            $query = 'SELECT userID FROM login where username = "' . $parent . '"';
            $parentID = $conn->query($query)->fetch_row()[0];
            
            //form relations
            $query = "INSERT INTO relations (userID, relatedTo, relatedIsType)
                    VALUES (" . $userID . "," . $studentID . ", " . 3 .");";
            $result = $conn->query($query);

            $query = "INSERT INTO relations (userID, relatedTo, relatedIsType)
                    VALUES (" . $userID . "," . $parentID . ", " . 4 .");";
            $result = $conn->query($query);

            $query = "INSERT INTO relations (userID, relatedTo, relatedIsType)
                    VALUES (" . $studentID . "," . $userID . ", " . 1 .");";
            $result = $conn->query($query);

            $query = "INSERT INTO relations (userID, relatedTo, relatedIsType)
                    VALUES (" . $studentID . "," . $parentID . ", " . 4 .");";
            $result = $conn->query($query);

            $query = "INSERT INTO relations (userID, relatedTo, relatedIsType)
                    VALUES (" . $parentID . "," . $userID . ", " . 1 .");";
            $result = $conn->query($query);

            $query = "INSERT INTO relations (userID, relatedTo, relatedIsType)
                    VALUES (" . $parentID . "," . $studentID . ", " . 3 .");";
            $result = $conn->query($query);

            if( $result === false){
                echo $query . '<br>';
                echo $conn->error;
            }
        }

        foreach($newTeachers as $teacher){
            $name = $teacher['name'];
            $bday = $teacher['bday']; // YYYY-MM-DD format
            $number = $teacher['phoneNumber'];
            $tempPassword = $bday; // change this part later
            
            $query = 'INSERT INTO login (username, user_type, password)'
                    . ' VALUES("' . $name . '", 2, "' . $tempPassword . '");';
            //echo $query;
            $result = $conn->query($query);
            if($result === false){
                echo 'result' . var_dump($result);
                echo 'fail';
            } else {
                echo "this worked";
            }
            

            $query = 'SELECT userID FROM login where username = "' . $name . '";';
            //echo $query;
            $teacherID = $conn->query($query);
            if($teacherID === false){
                echo "failed again";
            } else {
                $teacherID = $teacherID->fetch_row()[0];
            }
            $query = 'INSERT INTO relations (userID, relatedTo, relatedIsType)'
                    . 'VALUES (' . $teacherID . ', ' . $userID . ', 1);';
            $conn->query($query);
            $query = 'INSERT INTO relations (userID, relatedTo, relatedIsType)'
                    . 'VALUES (' . $userID . ', ' . $teacherID . ', 2);';
            $conn->query($query);
           /* */
        }  
        
        $conn->close();

    } else if(isset($_POST['reset'])){
        //connect to server
        $servername = "localhost";
        $mysqllogin = "root";
        $mysqlpassword = "";
        $dbName = "testdb";
        $conn = new mysqli($servername, $mysqllogin, $mysqlpassword, $dbName);

        if($conn->connect_error){
            die ("connection failed: " . $conn->connect_error);
            echo "connection failed.";
        }

        $query = "delete from relations; delete from login where userID > 1;";
        
        $data = 'data';
        if(isset($_POST['total_reset'])){
            $query .= "drop table login; create table login (userID int auto_increment, username
                    varchar(40), user_type int(1), password varchar(60), primary key(userID));";
            
            $query .= "insert into login (username, user_type, password) values ('admin1', 1, 'admin1');";
        }
        $data = '';
        $result = $conn->multi_query($query);
        if($result === false){
            echo $conn->error;
        } else {
            echo "reset";
        }
    } else {
        $response = '{"isSuccessful": "false"}';
    }
   
    $fh = fopen("testfile1.txt", 'w') or die("failed to create file");
    
    fwrite($fh, $data) or die("Could not write to file");
    fclose($fh);
?>