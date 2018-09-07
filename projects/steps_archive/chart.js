

google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(drawChart);
function drawChart() {
	/*	attp = attempt
	[
		['Question', 'last', 'avg.'],
		['Q1',  		60,     80],
		['Q2',  		90,     80],
		['Q3', 			110,	90],
		['Q4',  		120,    150]
	]
	*/
	var durationsChart = myGlobal.durationsChart;
	var data = google.visualization.arrayToDataTable(durationsChart);
	
	var options = {
		title: 'Average Time',
		hAxis: {title: 'Questions', titleTextStyle: {color: 'gray'}},
		vAxis: {title: 'Seconds', titleTextStyle: {color: 'gray'}}
	};

	var timeChart = new google.visualization.ColumnChart(document.getElementById('timeChart'));
	timeChart.draw(data, options);
	/***************/
	
	var chartCorrectData = myGlobal.attemptsChart;
	var data2 = google.visualization.arrayToDataTable(chartCorrectData);
	var options2 = {
		title: '# of Attempts',
		hAxis: {title: 'Questions', titleTextStyle: {color: 'gray'}},
		vAxis: {title: 'Percentage', titleTextStyle: {color: 'gray'}}
	}
	
	var correctChart = new google.visualization.ColumnChart(document.getElementById('correctChart'));
	correctChart.draw(data2, options2);
}