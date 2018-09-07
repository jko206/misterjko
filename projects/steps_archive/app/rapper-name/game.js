/*global $*/

$(document).ready(function(){
	$('#start').click(function(){
		$.getScript('external.js', function(){
			game();
		});
	});
	
	$('body').bind('contextmenu', function(e){
		e.preventDefault();
		alert('don\'t even.');
		return false;
	})
});