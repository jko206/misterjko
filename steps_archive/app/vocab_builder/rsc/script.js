/*
	-make the work/stats save-able then upload
	
*/

var WINDOW_HEIGHT = 0;
var WINDOW_WIDTH = 0;

var mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

var FONT_SIZES = [];
 
var user_data;
var loggedIn;
$(document).ready(function(){
	$('#add_row').click(function(){
		var clone = $(this).closest('table').find('#original_row').clone(true);
		clone.find('input').each(function(){
			$(this).val('');
		})
		clone.removeAttr('id');
		$(this).closest('tr').before(clone);
	})
	$('.delete_row').click(function(){
		if(!$(this).closest('tr').is('#original_row')){
			$(this).closest('.delete_target').remove();	
		}
	})
	$('#add_row').focus(function(){
		$(this).click();
		$(this).closest('tr').prev().find('input').first().focus();
	});
	
	$('#submit').click(function(){
		var arr = [];
		$('#word_rows').find('tr').each(function(){
			if(!$(this).is('#last_row')){
				var word = $(this).find('.word').val();
				var def = $(this).find('.definition').val();
				arr.push({
					'word' : word,
					'def' : def
				})
			}
		})
		$.ajax({
			url : 'process_vocab_input.php',
			type : 'POST', 
			data: {
				'word_list' : arr,
				'set_name' : (function(){
					return $('#set_name').val();
				}())
			},
			success: function(response){
				console.log(response);
			},
			error: function(jqXHR, textStatus, errorThrown){
				console.log('jqXHR.responseText:  ' + jqXHR.responseText);
				console.log('jqXHR.responseXML :  ' + jqXHR.responseXML);
				console.log('textStatus:   ' +  textStatus);
				console.log('errorThrown:   ' + errorThrown);
			},
			dataType : 'text' //type that I'm expecting back
		})
	})
});

