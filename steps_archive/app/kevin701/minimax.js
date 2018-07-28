/* global $ */
/*
    To do:
        -On focus, highlight the border or something
        -make tabbing sequence
        -next problem button
*/

let level = 0;
let minMaxCorrCount = 0; // once it reaches 6, num3 should become input
let currOp;

$(document).ready(function(){
    $('.input').prop('contenteditable', true);
    $('body').on('focus', '.input', function(){
        $(this).addClass('highlight');
    }).on('blur', '.input', function(){
        $(this).removeClass('correct incorrect');
        let answer = $(this).data('answer'); 
        let input = $(this).text().trim();
        if(input && answer == input){
            $(this).addClass('correct');
            minMaxCorrCount++;
        } else if(input){
            $(this).addClass('incorrect');
        }

        if(minMaxCorrCount == 6){
            $('#num3').prop('contenteditable', true)
                .addClass('input')
                .focus();        
        }
    });
    
    $('#num3-max').focus(function(){
        if(currOp == 0){ // plus op
            $('.max-plus-line').addClass('highlight');
        } else {
            $('.max-minus-line').addClass('highlight');
        }
    }).blur(function(){
        $('.max-plus-line .max-minus-line').removeClass('highlight');
    });
    
    
    $('#num3-min').focus(function(){
        if(currOp == 0){ // plus op
            $('.min-plus-line').addClass('highlight');
        } else {
            $('.min-minus-line').addClass('highlight');
        }
    }).blur(function(){
        $('.highlight').removeClass('highlight');
    });
    
    $('body').on('keydown', '.input', function(e){
        let key = e.keyCode;
        if(key == 27 || key == 8 || key == 46){
            $(this).text('');
        } else if(key == 13){
            e.preventDefault();
            return;
        }
        let id = $(this).attr('id');
        let input = $(this).text().trim();
        let answer = $(this).data('answer');
        if(id == 'num3' && input == answer){
            $('#button').show();
        }
    });
    
    $('#button').click(()=>{newProblem()});
    
    newProblem();
});


function newProblem(){
    $('#button').hide();
    $('.input').text('').removeClass('correct incorrect');
    $('#num3').prop('contenteditable', false)
        .removeClass('input');
    minMaxCorrCount = 0;
    
    
    currOp = Math.floor(Math.random() * 2);
    let po10 = Math.pow(10, level + 2); // power of 10; the upper limit of each number
    let roundTo  = 10;
    
    let n1 = Math.ceil(Math.random() * po10);
    let n2 = Math.ceil(Math.random() * po10);
    let op = currOp == 0 ? '+' : '&#8722;';
    
    
    //if subtraction op, then bigger num should come first
    if(currOp == 1){ 
        let temp = n1;
        n1 = Math.max(n1, n2);
        n2 = Math.min(temp, n2);
    }
    
    let n1_min = Math.floor(n1 / roundTo) * roundTo;
    let n1_max = Math.ceil(n1 / roundTo) * roundTo;
    let n2_min = Math.floor(n2 / roundTo) * roundTo;
    let n2_max = Math.ceil(n2 / roundTo) * roundTo;
    
    let n3, n3_min, n3_max;
    if(currOp == 0){
        n3_min = n1_min + n2_min;
        n3 = n1 + n2;
        n3_max = n1_max + n2_max;
        $('.plus-line').show();
        $('.minus-line').hide();
    } else {
        n3_min = n1_min - n2_max;
        n3 = n1 - n2;
        n3_max = n1_max - n2_min;
        $('.plus-line').hide();
        $('.minus-line').show();
    }
    
    $('#num1-min').data('answer', n1_min);
    $('#num1-max').data('answer', n1_max);
    $('#num2-min').data('answer', n2_min);
    $('#num2-max').data('answer', n2_max);
    $('#num3-min').data('answer', n3_min);
    $('#num3-max').data('answer', n3_max);
    $('#sign').html(op);
    $('#num1').text(n1);
    $('#num2').text(n2);
    $('#num3').data('answer', n3);
    
}