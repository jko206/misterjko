<?php

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
$text = json_encode($obj);



$myfile = fopen("videoList.txt", "w") or die("Unable to open file!");

fwrite($myfile, $text);
fclose($myfile);



?>