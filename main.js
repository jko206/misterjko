/* global $ KenKenGUI KnightsTourGUI hljs*/

// TODO: make this with VueJS
$(document).ready(function(){
  
  // Nav related
  $('.sub-nav-toggle').click(function(){
    let subNav = $(this).find('.sub-nav');
    if(subNav.is(':visible')){
      // hide;
      subNav.hide({
        effect: 'slide',
        direction: 'up',
      });
    } else {
      subNav.show({
        effect: 'slide',
        direction: 'up',
      });
    }
  });
  $('#nav-toggle').click(function(){
    let nav = $('nav');
    let screenSize = $('body').width();
    let direction = screenSize < 600 ? 'up' : 'left';
    let option = {
      effect: 'slide',
      direction,
      duration: 200,
    };
    if(nav.is(':visible')){
      nav.hide(option);
    } else {
      nav.show(option);
    }
  });
  
  // Resume toggle
  $('#resume-toggle').click(function(){
    $('.resume-files-wrap').toggleClass('open');
    if($('.resume-files-wrap').is('.open')){
      setTimeout(()=>{
        $('.resume-files-wrap').removeClass('open');
      }, 3000)
    }
  });
  $(document).scroll(function(){
    $('.resume-files-wrap').removeClass('open');
  });
  $('.resume-files-wrap a').click(function(){
    $('.resume-files-wrap').removeClass('open');
  });
  
  
  KenKenGUI.initGUI($('#kenken-app'));
  
  KnightsTourGUI('#knight-gui-cont');
  
  $('pre code').each(function(i, block){
    hljs.highlightBlock(block);
  });
  
});