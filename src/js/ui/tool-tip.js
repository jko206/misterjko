/* global $ */
$(document).ready(function(){
  $('.tool-tip-trigger').click(function(){
    $(this).find('.tool-tip').toggleClass('active');
  });
  $(this).scroll(function(){
    $('.tool-tip').removeClass('active');
  });
});