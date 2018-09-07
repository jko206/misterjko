/* global $ */

$(document).ready(function(){
  $('#show-objective').click(function(){
    $('#landing .objective').addClass('show');
  });
  $('#show-skills').click(function(){
    $('#landing .skill-set').addClass('show');
  });
  $('#landing .close-btn').click(function(){
    $(this).parent().removeClass('show');
  });
});