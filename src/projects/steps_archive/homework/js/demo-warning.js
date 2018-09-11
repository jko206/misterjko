/* global $*/
'use strict';
$(document).ready(function(){
  $('#demo-warning .expand-msg').click(function(){
    $('#demo-warning').removeClass('concise');
    $('#demo-warning').addClass('expanded');
  });
  
  
  $('#demo-warning close-warning').click(function(){
    $('#demo-warning').hide();
  });
  
  $('#demo-warning').animate({
      backgroundColor : '#ff6363'
  }, 1000, 'swing', function(){
    $(this).animate({
      backgroundColor : 'gray'
      
    })
  });
});