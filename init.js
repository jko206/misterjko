'use strict';

/*
	global $, KnightHop2, KenKen, KenKenGUI, KnightsTourGUI, hljs
*/

KenKenGUI.initGUI($('#kk-gui-cont'));

KnightsTourGUI('#knight-gui-cont');

$(document).ready(function() {
  $('#menu-toggle').click(function() {
    $(this).toggleClass('toggle close');
    $('.menu').toggleClass('hidden');
    let $menuToggle = $(this);
    $(document).scroll(function(){
      $(this).off('scroll');
      $menuToggle.removeClass('close').addClass('toggle');
      $('.menu').addClass('hidden');
    });
  });

  $('button.popup-launcher').click(function() {
    $('#menu-toggle').addClass('hidden');
    const toLaunch = $(this).data('launch');
    $(toLaunch).removeClass('hidden');
    $('body').addClass('no-scroll');
    
    if(!$('.menu').hasClass('hidden')){
      $('#menu-toggle').click();
    }
  });
  
  $('.close-popup').click(function(){
    $(this).closest('.popup').addClass('hidden');
    $('#menu-toggle').removeClass('hidden');
    $('body').removeClass('no-scroll');
  });
  
  $('#resume-ui-wrap').click(function() {
    $(this).toggleClass('active');
    let resumeUI = $(this);
    let autoClose = setTimeout(function() {
      resumeUI.removeClass('active');
    }, 5000);
    $('body').click(function(e) {
      const isClickedOutside = !$(e.target).closest(resumeUI).length;
      if (isClickedOutside) {
        $(this).off('click');
        resumeUI.removeClass('active');
        clearTimeout(autoClose);
      }
    });
    $(document).scroll(function(){
      $(this).off('scroll');
      resumeUI.removeClass('active');
      clearTimeout(autoClose);
    })
  });
  
  $('pre code').each(function(i, block){
    hljs.highlightBlock(block);
  });
});
