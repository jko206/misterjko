

$(document).ready(function(){
    $('.button').click(function(){
        let id = $(this).closest('.question').attr('id');
        let resp = $(this).siblings('input[type="text"]').val();
        let wrongs = $(this).siblings('.wrongs');
        $.ajax({
            url : 'check.php',
    		crossDomain : true,
    		//type : 'post',
    		data : {id, resp},
    		success : function(response){
    			if(response == 1){
        		    alert('correct!');
    			} else {
        		    alert('wrong');
                    wrongs.append(`<div class="wrong">${resp}</div>`);
    			}
    		},
    		method: 'POST',
    		//async: false,
    		error: function(jqXHR, textStatus, errorThrown){
    		    var text = 'jqXHR.responseText:  ' + jqXHR.responseText
    		            +'<br>jqXHR.responseXML :  ' + jqXHR.responseXML
    			        +'<br>textStatus:   ' +  textStatus
            			+'<br>errorThrown:   ' + errorThrown;
    			console.log(text);
    			if(o.errorHandler) o.errorHandler(jqXHR, textStatus, errorThrown);
    		},
    		dataType : ('text') //expected data type to be returned from server
    	});
    });
    
    $('input').keydown(function(e){
        let key = e.which;
        if(key == 13){
            $(this).siblings('.button').trigger('click');
        }
    });
    
    $('.q-num').each(function(i){
        $(this).html(i + 1);
        console.log('hi' + i);
    });
    
});

