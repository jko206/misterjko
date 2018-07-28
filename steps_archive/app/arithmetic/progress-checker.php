<?PHP
require 'connection.php';

$conn = makeConnection();
$query = "SELECT assnID FROM homework";
$result = $conn->query($query);
if($result){
	$result = $result->fetch_all();
	foreach($result as $assnID){
		$len = strlen($assnID[0]);
		if($len == 1){
			$assnTbl = '00' . $assnID[0];
		} elseif($len == 2){
			$assnTbl = '0' . $assnID[0];
		}
		$tableName = "assn" . $assnTbl;
		$query = "SELECT * from $tableName";
		$result2 = $conn->query($query);
		if($result2){
			echo "<h2> Assignment-$assnTbl </h2>";
			echo "<table id='assn-progress'>
					<tr>
						<th>qnum</th>
						<th>name</th>
						<th>response</th>
						<th>isCorrect</th>
						<th>timestamp</th>
						<th>tLength</th>
					</tr>";				
			$result2 = $result2->fetch_all();
			foreach ($result2 as $row){
				echo "<tr>"
						. "<td> $row[0] </td>" // qnum
						. "<td> $row[1] </td>" // name
						. "<td> $row[2] </td>" // response
						. "<td> $row[3] </td>" // isCorrect
						. "<td> $row[4] </td>" // timestamp
						. "<td> $row[5] </td>" // tLength
					. "</tr>";
			}
			echo "</table>";
			
			
		}
		
	}
}


/*

function getFile($conn, $name, $assnID){
$query = "SELECT file FROM homework WHERE name='$name' and assnID = '$assnID'";
//echo $query . '<br>'; 
$result = $conn->query($query);
return $result;
}

if(isset($_POST['name']) && isset($_POST['assnID'])){
	$name = $_POST['name'];
	$assnID = $_POST['assnID'];
	
	$file = getFile($conn, $name, $assnID);
	$file = $file->fetch_all();
	$file = "homework-files/" . $file[0][0];

	$myfile = fopen($file, "r") or die("Unable to open file!");
	$filesize = filesize($file);
	$json = fread($myfile, $filesize);
	fclose($myfile);

	echo json_encode($json);
} elseif(isset($_POST['name'])){
	$name = $_POST['name'];
	$query = "SELECT assnID, hw_name, date FROM homework WHERE name='$name'";
	$result = $conn->query($query);
	echo json_encode($result->fetch_all());
} else {
	echo json_encode('{"didnt" : "work"}');
}

*/
?>