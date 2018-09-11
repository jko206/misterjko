<?PHP
require 'connection.php';


function getFile($conn, $name, $assnID){
$query = "SELECT file FROM homework WHERE name='$name' and assnID = '$assnID'";
//echo $query . '<br>'; 
$result = $conn->query($query);
return $result;
}
$conn = makeConnection();

if(isset($_POST['name']) && isset($_POST['assnID'])){
	$name = $_POST['name'];
	$assnID = $_POST['assnID'];
	
	$file = getFile($conn, $name, $assnID);
	$file = $file->fetch_all();
	//echo json_encode($file);
	$file = "homework-files/" . $file[0][0];

	$myfile = fopen($file, "r") or die("Unable to open file: ");
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


?>