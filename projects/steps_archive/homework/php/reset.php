<?php
$data = '{"points":202,"coins":0,"wrongCount":0}';
$file = '../../users/8/points.txt';
file_put_contents($file, $data);

$data = '[{"exercise":"DecAddSub","settings":{"level":5},"requirements":{"consCorrect":10,"totalCorrect":15}},
{"exercise":"FracAddSub","settings":{"level":2},"requirements":{"totalCorrect":10,"consCorrect":10}},
{"exercise":"BasicArithmetic","settings":{"level":54},"requirements":{"totalCorrect":30,"consCorrect":20}},
{"exercise":"DistBtwnPt","requirements":{"totalCorrect":20,"consCorrect":10}}]';
$file = '../../users/8/homework.txt';
file_put_contents($file, $data);

?>
