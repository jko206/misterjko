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
  
  
  // About J section
  
	let windowW = $(window).width();
	let windowH = $(window).height();
	
  $(window).scroll(function(){
  	let {top} = $('#about-j')[0].getBoundingClientRect();
  	
  	let heightLimit = windowH * 2;
  	let widthLimit = windowW * 2;
  	let newTop = top * -1;
  	newTop = 
  		top > 0 ? 0 :
  		-top > heightLimit ? heightLimit :
  		-top;
  	let progress = newTop / heightLimit;
  	// DO STUFF HERE
  	let newRight = progress * widthLimit;
  	let subTitleTop = progress * -28 * 2;       //magic number
  	$('.carousel .sub-titles').css({top: subTitleTop});
  	$('.carousel').css({top: newTop});
  	$('.carousel .sub-section').css({
  		right: newRight,
  	});
  }).scroll(function(){
    let ballDiameer = 10;
    let {top, height} = $('.timeline-app')[0].getBoundingClientRect();
    let coverTop = -top + windowH / 4 * 3;
    let min = 0;
    let max = height - windowH / 4 + ballDiameer;
    coverTop = coverTop < 0 ? min :
      coverTop > max ? max :
      coverTop;
    let cover = $('.timeline-app .cover')
    cover.css({top: coverTop});
    if(coverTop === max){
      cover.hide();
    } else {
      cover.show();
    }
    
    ////////////////
    // experimental
    
    
  }).trigger('scroll');
  
  $('.portfolio__nav-btn').click(function(){
    let goto = $(this).data('goto') >> 0;
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
    
    let root = $(this).closest('.portfolio__item');
    root.children().each(function(i,e){
      if(i !== 0 && i !== goto) $(e).addClass('hidden');
      else $(e).removeClass('hidden');
    });
  });
  
  
  KenKenGUI.initGUI($('#kenken-app'));
  
  KnightsTourGUI('#knight-gui-cont');
  
  $('pre code').each(function(i, block){
    hljs.highlightBlock(block);
  });
});