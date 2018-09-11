/* global $ */



$(document).ready(function(){
    $('#command').change(function(){
        var text = $(this).val();
        testAjax(text);
    });
	testAjax('Robin');
});

var getHW = function(name){
    $.ajax({
		url : 'getHW.php',
		type : 'POST',
		data : {'name' : name},
		success : function(response){
			$('#ajax').text(response);
		},
		error: function(jqXHR, textStatus, errorThrown){
		    var text = 'jqXHR.responseText:  ' + jqXHR.responseText
		            +'<br>jqXHR.responseXML :  ' + jqXHR.responseXML
			        +'<br>textStatus:   ' +  textStatus
        			+'<br>errorThrown:   ' + errorThrown;
			$('#ajax').html(text);
		},
		dataType : 'json' //expected data type
	});
}

