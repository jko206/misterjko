/*global $*/

$(document).ready(function(){
	$.getScript('external.js');
	$('#start').click(function(){
		var length = $('#length').val();
		var limit = $('#limit').val()

		var msg = game(length, limit);
		$('#display').text(msg);
		console.log(msg);
	});
	
	$('body').on('contextmenu', function(e){
		e.preventDefault();
		alert('don\'t even.');
		return false;
	})
});