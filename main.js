/* global $ KenKenGUI KnightsTourGUI hljs*/
$(document).ready(function(){
  
  $('nav').click(function(){
    $(this).toggleClass('menu-view');
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
  
  // Scroll-driven animation (SDA)
  const SDA = {
    // top: distance from top of document to top of viewport
    windowH : undefined, 
    windowW : undefined,
    firstSectH : undefined,
    firstSectW : undefined,
    sectTop0: [], // section top 
    sectTop1: [], // sub-section1 top
    sectTop2: [], // sub-section2 top
    resize(reposition){
      this.windowH = $(window).height();
      this.windowW = $(window).width();
      this.firstSectH = $('.section').first().height();
      this.firstSectW = $('.section').first().width();
      reposition && this.positionElements();
    }, 
    init(){
      // find section breakpoints
      function getPosition(element) {
        // let xPosition = 0;
        let yPosition = 0;
      
        while(element) {
          // xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
          yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
          element = element.offsetParent;
        }
      
        // return { x: xPosition, y: yPosition };
        return yPosition;
      }
      function loop() {
          let scrollTop = $window.scrollTop();
          if (lastScrollTop === scrollTop) {
              raf(loop);
              return;
          } else {
              lastScrollTop = scrollTop;
              // fire scroll function if scrolls vertically
              SDA.positionElements();
              raf(loop);
          }
      }
      
      this.resize(false);
      
      let arr = this.sectTop0;
      $('.section').each(function(i, e){
        if(i != 0){
          let y = getPosition(e);
          arr.push(y - 40, y); // 40 is animation range
        }
      });
      arr = this.sectTop1;
      $('.sub-sect1-mark').each(function(i, e){
        let y = getPosition(e);
        arr.push(y - 40, y); // 40 is animation range
      });
      arr = this.sectTop2;
      $('.sub-sect2-mark').each(function(i, e){
        let y = getPosition(e);
        arr.push(y - 40, y); // 40 is animation range
      });
      
      
      this.positionElements();
      let raf = (window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame);
      let $window = $(window);
      
      let lastScrollTop = $window.scrollTop();
      
      
      if(raf){
          loop();
      } else {
        // console.log('.requestAnimationFrame not available');
        $(document).scroll(function(){
          SDA.positionElements();
        }).trigger('scroll');
      }
      
      window.onresize = function(){
        SDA.resize();
      }
      
      
    },
    
    positionElements(){
      const positionNavBar = (y, h) =>{
        if(y < h){
          $('nav').addClass('up-top');
        } else {
          $('nav').removeClass('up-top');
        }
      }
      // Given element is animated for range between
      // animationPoints[i] and animationPoints[i+1],
      // where i is even.
      let prevVal; 
      const moveNavDisplay = (y, $elem, animationPoints)=>{
        for(let i = 0; i < animationPoints.length; i ++){
          // [649, 689, 3405, 3445, 5552, 5592, 15347, 15387]
          let val = animationPoints[i];
          if(y < val){
            let top = -40 * Math.floor(i/2);
            if(i%2 == 1){
              top -= (y - prevVal);
              // console.log(prevVal, y);
            }
            $elem.css({top});
            return;
          }
          prevVal = val;
        }
      }
      
      let scrollY = window.scrollY;
      positionNavBar(scrollY, this.firstSectH);
      // get current position
      // if it's within 40px of any section breakpoints, move it
      
      let display0 = $('.nav__display0');
      let display1 = $('.nav__display1');
      let display2 = $('.nav__display2');
      moveNavDisplay(scrollY, display0, this.sectTop0);
      moveNavDisplay(scrollY, display1, this.sectTop1);
      moveNavDisplay(scrollY, display2, this.sectTop2);
    }
  };
  SDA.init();
  
  // Make display items appear compact
  (()=>{
    $('li[scoot-id]').each(function(i, e) {
       let width = $(e).css('display', 'inline').width();
       $(e).data('width', width);
       $(e).css('display', 'inherit');
    });
    $('li[scoot-to]').each(function(i,e){
      let scootTo = $(this).attr('scoot-to');
      let $target = $(`li[scoot-id="${scootTo}"]`);
      let $targetWidth = $target.data('width') >> 0;
      let $targetLeft = ($target.data('left') >> 0) || 0;
      let left = $targetWidth - 350 + $targetLeft;
      $(this).data('left', left);
      $(this).css('left', left);
    });
  })();
  
  // Linked in stuff
  let isLinkedIn = detectLinkedIn();
  if(isLinkedIn){
    // Go to the Algebra Basics section
    $('#linked-in-popup').removeClass('hidden');
  }
  $('.close-linked-in-popup').click(function(){
    $('#linked-in-popup').addClass('minimize');
  });
  
  $('#li-popup-opener').click(function(){
    let isMin = $('#linked-in-popup').hasClass('minimize');
    if(isMin){
      $('#linked-in-popup').removeClass('minimize');
    }
  });
  
  
  // Scroll to PrecisionJS
});



function detectLinkedIn(){
  let href = window.location.href.toLowerCase();
  let pattern = /\#sect-algebra-basics/;
  return pattern.test(href);
}