/* global $, solution, focusIndex */

$(document).ready(function(){
    
    var foci = [
            $('#solution-integer').text(''),
            $('#solution-numerator').text(''),
            $('#solution-denominator').text('')
        ];
    
    var focusIndex = 0;
    
    function setFocus(){
        //prev focus
        $('.focus').removeClass('focus').css({
            borderColor: 'black',
            backgroundColor: '#dbdbdb'
        });
        
        //new focus
        foci[focusIndex].addClass('focus').css({
            borderColor: 'blue',
            backgroundColor: '#9998ff'
        });
        
    }
    $('#new-problem').click(function(){
        /*
            a -> first fraction
            b -> second fraction
            c -> third fraction
            s -> solution fraction
            1 -> integer
            2 -> numerator
            3 -> denominator
            op1 -> operator 1
            op2 -> operator 2
        */
        
        $('#solution-integer').html('');
        $('#solution-numerator').html('');
        $('#solution-denominator').html('');
        
        var qType = randomInt(1000000) % 4;
        qType = 3;
        var a1, a2, a3, b1, b2, b3, c1, c2, c3, s1, s2, s3, op1, op2;
        var denom = a3 = b3 = c3 = s3 = randomInt(7, 3);
        
        if(qType == 0){ // + + 
            b1 = randomInt(4); 
            c1 = randomInt(4);
            a1 = randomInt(10, b1 + c1 + 1)

            a2 = randomInt(denom);
            b2 = randomInt(denom);
            c2 = randomInt(denom);
            
            op1 = 0; 
            op2 = 0;
            
        } else if(qType == 1){ // + -
            a1 = randomInt(4);
            b1 = randomInt(4);
            c1 = randomInt(a1+b1);
            
            a2 = randomInt(denom);
            b2 = randomInt(denom);
            c2 = (a2 + b2 + 1)%denom;
        
            op1 = 0; 
            op2 = 1;
        } else if(qType == 2){ // - + 
            a1 = randomInt(6);
            b1 = randomInt(a1 - 1);
            c1 = randomInt(6);
            
            a2 = randomInt(denom);
            b2 = randomInt(denom, a2+1);
            c2 = randomInt(denom);
            
            op1 = 1; 
            op2 = 0;
        } else { // - -
            a1 = randomInt(10);
            b1 = randomInt(a1-1);
            c1 = randomInt(a1 - b1- 1);
            
            a2 = randomInt(denom);
            b2 = randomInt(denom);
            c2 = randomInt(denom);
            
            op1 = 1; 
            op2 = 1;
        }
        var improperDenom = getImproperDenom(a1, a2, b1, b2, c1, c2, denom, op1, op2);
        s1 = Math.floor(improperDenom / denom);
        s2 = improperDenom % denom;
        var hideZero = function(m){
            return (m == 0 ? '' : m);
        }
        $('#a1').text(hideZero(a1));
        $('#a2').text(hideZero(a2));
        $('#a3').text(a3);
        $('#operator1').html((op1 == 0 ? '&plus;' : '&minus;'));
        $('#b1').text(hideZero(b1));
        $('#b2').text(hideZero(b2));
        $('#b3').text(b3);
        $('#operator2').html((op2 == 0 ? '&plus;' : '&minus;'));
        $('#c1').text(hideZero(c1));
        $('#c2').text(hideZero(c2));
        $('#c3').text(c3);
        
        $('#solution-integer').data('val', s1);
        $('#solution-numerator').data('val', s2);
        $('#solution-denominator').data('val', s3);
        
        focusIndex = 0;
        setFocus();
    });
    
    $('#check').click(function(){
        var integer = $('#solution-integer').text();
        var numerator = $('#solution-numerator').text();
        var denominator = $('#solution-denominator').text();
        
        integer = integer || 0;
        numerator = numerator || 0;

        var match1 = integer == $('#solution-integer').data('val');
        var match2 = numerator == $('#solution-numerator').data('val');
        var match3 = denominator == $('#solution-denominator').data('val')
                || (numerator == 0 && denominator == '');

        if(match1 && match2 && match3){
            var input = confirm('Good job! Next question?');
            if(input){
                $('#wrong-responses').empty();
                $('#new-problem').click();  
            } 
        } else {
            // put the wrong answers in the corner or something
            var frac = $('#original-fraction').clone(true).removeAttr('id');
            frac.find('.integer').text(integer);
            frac.find('.numerator').text(numerator);
            frac.find('.denominator').text(denominator);
            
            $('#wrong-responses').append(frac);
            
            integer = $('#solution-integer').text('');
            numerator = $('#solution-numerator').text('');
            denominator = $('#solution-denominator').text('');
        }
    });
    
    $('.input').keydown(function(e){
        if(event.which == 13 || event.keyCode == 13){
            e.preventDefault();
            $('#check').click();
        }
    });
    
    $('.num-input').click(function(){
        var t = $('.focus').text();
        var n = $(this).text();
        $('.focus').text('' + t + n);
    });
    
    $('#num-next').click(function(){
        focusIndex++;
        focusIndex %= 3;
        setFocus();
    });
    
    $('#num-prev').click(function(){
        focusIndex--;
        focusIndex += 3;
        focusIndex %= 3;
        setFocus();
    });
    
    $('#num-del').click(function(){
       $('.focus').empty(); 
    });
    
    $('#new-problem').click();
});

var randomInt = function(max, min){
    min = min || 1;
    var range = max - min;
    var i = Math.random();
    return Math.floor(i * range) + min;
}

// if op == 0, then +. if op == 1, then -
function getImproperDenom(a1, a2, b1, b2, c1, c2, denom, op1, op2){
    var a = a1 * denom + a2;
    var b = b1 * denom + b2;
    var c = c1 * denom + c2;
    var temp = op1 == 0 ? a + b : a - b;
    temp = op2 == 0 ? temp + c : temp - c;
    return temp;
    
}