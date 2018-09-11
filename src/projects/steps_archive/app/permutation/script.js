$(document).ready(function(){
    $("#getPerm").click(function(){
        $('#results_container').html('');
        var text = $('#text').val();
        var len = $('#length').val();
        len = len ? len : text.length;
        if(text.length < len){
            $('#results_container').text('# of chars to use must be greater than the length of the text'); 
        } else {
            perm(text, '', len);    
        }
        $('.wrap').click(function(){
            var style = $(this).data('style');
            var family = $(this).data('family');
            $('.' + family).toggleClass(style);
        })
        $('#ghost_box').hide();
    })

    $('#getCombo').click(function(){
        $('#ghost_box').toggle();
    })
})

var getRandomStyle = function(){
    var arr1 = 'abcdef'.split('');
    var arr2 = '0123456789abcdef'.split('');
    var t = '';
    for(var i=0; i < 6; i++){
        var max = i == 0 ? 6 : 16;
        var k = Math.random() * max;
        k = Math.floor(k);
        if(i==0) t += arr1[k];
        else t += arr2[k];
    }
    return t;
}

var familyStyle = [];

function perm(str, parts, len){
    if(parts.length == len){
        //console.log(parts + str);
        var text = parts + str;
        text = text.slice(0, len);
        var wrap = $('<div></div>').text(text);
        wrap.addClass('wrap');
        var family = 'f_' + sortText(text);
        wrap.addClass(family);
        wrap.data('family', family);
        var style;
        if(familyStyle[family]){
            style = familyStyle[family];
        } else {
            style = getRandomStyle();
            familyStyle[family] = style;
            var div = $('<div></div>').addClass(style);
            div.css('display', 'block');
            div.text(family.substring(2));
            $('#ghost_box').append(div);
            $('html > head').append($(
                '<style>.' + style + '{' + 
                    'background-color : gray;' +
                    'color : white;' + 
                    'border : 3px solid #' + style +
                ';}</style>'
            ));
        }
        wrap.data('style', style);

        $('#results_container').append(wrap);
    } else {
        for(var i = 0; i < str.length; i++){
            var c = str.charAt(i);
            var front = str.slice(0,i);
            var back = str.slice(i+1);
            var temp1 = parts + c;
            var temp2= front + back;

            perm(temp2, temp1, len);
        }
    }
    if($('#results_container').html() == ''){
        $('#results_container').text('NO RESULTS'); 
    }
}

function sortText(t){
    return t.split('').sort().join(''); 
}