<?PHP
require 'connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
	$action = $_POST['action'];
	if($action == 'performance' 
			&& isset($_POST['data1'])
			 && isset($_POST['data2'])){
		$stat1= json_decode($_POST['data1'], true);
		$stat2= json_decode($_POST['data2'], true);
		//print_r($stat);
		
		$userID = $stat2['userID'];
		$addLevel = $stat1['addLevel'];
		$subLevel = $stat1['subLevel'];
		$multiLevel = $stat1['multiLevel'];
		$addRecord = $stat1['addRecord'] ? $stat1['addRecord'] : -1;
		$subRecord = $stat1['subRecord'] ? $stat1['subRecord'] : -1;
		$multiRecord = $stat1['multiRecord'] ? $stat1['multiRecord'] : -1;
		$points = $stat1['points'];
		$coins = $stat1['coins'];
		$pointsPerCoin = $stat1['pointsPerCoin'];
		$query = "UPDATE user_summary SET
				userID=$userID, addLevel=$addLevel, subLevel=$subLevel, 
				multiLevel=$multiLevel, addRecord=$addRecord, 
				subRecord=$subRecord, multiRecord=$multiRecord,
				points=$points, coins=$coins, pointsPerCoin=$pointsPerCoin
				WHERE userID = $userID";
		$conn = makeConnection();
		$result = $conn->query($query);
		if($result){
			echo 'success! stat1';
		} else {
			echo 'failed stat1';
			echo $query;
		}
		
		$type = $stat2['type'];
		$tLength = $stat2['tLength'];
		$level= $stat2['level'];
		$query = "INSERT INTO performance 
				(type, tLength, level, userID) 
				VALUES 
				($type, $tLength, $level, $userID)";
		$conn = makeConnection();
		$result = $conn->query($query);
		if($result){
			echo 'success! stat2';
		} else {
			echo 'failed stat2';
			echo $query;
		}
	}
} else if($_SERVER['REQUEST_METHOD'] === 'GET'){
	if(isset($_GET['request'])){ //http://localhost/jplus/speed-arithmetic/WIP/helper.php?request=getShowList
		$request = $_GET['request'];
		if($request == 'getShowList'){
			/*
				data format: 
				[{
					series : 'SpongeBob SquarePants',
					seasons : 2
					episodes: [
						[ // Season 01
							{
								title: ****,
								epiNo: ***,
								file: ***
							}, {
								title: ****,
								epiNo: ***,
								file: ***
							}
						], [ // Season 02
							{
								title: ****,
								epiNo: ***,
								file: ***
							}, {
								title: ****,
								epiNo: ***,
								file: ***
							}
						]
					]
				}]
			*/
			$obj = [];
			$dir    = 'videos/';
			$level1 = scandir($dir);
			for($i = 2; $i < count($level1); $i++){
				$series = (object)[];
				$seriesName = $level1[$i];
				$series->seriesName = $seriesName ;
				$dir2 = $dir . $seriesName  . '/';
				$level2 = scandir($dir2);
				$series->seasons = count($level2) - 2;
				$series->episodes = [];
				for($j = 2; $j < count($level2); $j++){
					$eps = [];
					$dir3 = $dir2 . $level2[$j] . '/';
					$level3 = scandir($dir3);
					for($k = 2; $k < count($level3); $k++){
						$ep = (object)[];
						$ep->file = $level3[$k];
						//$ep->epNo = preg_match_all('/\d+/', $ep->file);
						$path_parts = pathinfo($dir3 . $ep->file);
						$fileName = $path_parts['filename'];
						$ep->epTitle = $fileName;
						$ep->filePath = $dir3 . $ep->file;
						
						$eps[] = $ep;
					}
					$series->episodes[] = $eps;
				}
				$obj[] = $series;
			}
			//print_r($files1);
			echo json_encode($obj);
		} else if(false){
			/*
			$conn = makeConnection();	
			$query = "";
	
			$result = $conn->query($query);	
			if($result){
				echo $result;
			} else {
				echo 'request failed';
			}
			*/
		}
	}
}

/*	
	$query = "INSERT INTO $tableName "
			. "(qnum, name, response, isCorrect, timestamp) "
			. "VALUES "
			. "('$qnum', '$name', '$response', '$isCorrect', NOW())"; 
	$result = $conn->query($query);	
	echo $query;
*/

?>