/* global Vue $ */

let page = {
  width: 0,
  height: 0,
  docHeight: 0,
  progressHeight: 0,
};

let nav;
function registerDimensions(){
  function getDocHeight(){
    const body = document.body
      , html = document.documentElement;
    
    return Math.max(
      body.scrollHeight, 
      body.offsetHeight, 
      html.clientHeight, 
      html.scrollHeight, 
      html.offsetHeight,
    );
  }
  page.width = Math.max(window.innerWidth, window.outerWidth);
  
  let docHeight = getDocHeight();
  let height = Math.max(window.innerHeight, window.outerHeight);
  page.docHeight = docHeight;
  page.height = height;
  page.progressHeight = docHeight - height;
}
function scrollBasedAnimation(){
  function loop(){
    let currScrollY = window.scrollY;
    if(currScrollY !== prevScrollY){
      animation();
      currScrollY = prevScrollY;
    }
    raf(loop);
  }
  function animation(){
    let scrollY = window.scrollY;
    let pageHeight = window.innerHeight;
    let pageWidth = window.innerWidth;
    if(scrollY < pageHeight && pageWidth < 600){
      $('.nav-wrap').addClass('hide-nav');
      return;
    } else {
      $('.nav-wrap').removeClass('hide-nav');
    }
    let navTrackHeight = nav.trackStyle.height;
    let {progressHeight} = page;
    let progress = (progressHeight && scrollY / progressHeight);
    progress = progress > 1 ? 1 : progress < 0 ? 0 : progress;
    let result = 20 + navTrackHeight * progress;
    trackCircle.style.top = result +'px';
    // nav.trackCircleStyle.top = result;
    let epsilon = 0.01;
    let pageBreakInterval = page.breakInterval;
    let progressDistanceToPageBreak = progress%pageBreakInterval;
    progressDistanceToPageBreak = progressDistanceToPageBreak > pageBreakInterval / 2 
      ? pageBreakInterval - progressDistanceToPageBreak : progressDistanceToPageBreak;
    if(progressDistanceToPageBreak < epsilon){
      nav.isWideCircle = true;
    } else {
      nav.isWideCircle = false;
    }
  }
  
  let raf = (window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame);
  
  let prevScrollY = undefined;
  let trackCircle = document.getElementsByClassName('track-circle')[0];
  
  if(raf){
    loop(raf);
  } else {
    window.onscroll = function(){
      animation();
    };
  }   
}

window.onload = function(){
  
  const menuItems = [
    {
      title: 'Home',
      section: '#landing'
    },
    {
      title: 'About Me',
      section: '#profile'
    },
    {
      title: 'My story',
      section: '#my-story'
    },
    {
      title: 'Porfolio',
      section: '#portfolio'
    },
    {
      title: 'Links',
      section: '#links'
    }
  ];
  const itemHeight = 70;
  nav = new Vue({
    el: '#nav-wrap',
    data(){
      const trackWrapHeight = itemHeight * menuItems.length
        , trackHeight = itemHeight * (menuItems.length - 1)
        , trackCircleTop = (itemHeight - 30) / 2; // 30 is the track width; track width is not dynamic
      page.breakInterval = 1 / (menuItems.length - 1);
      return {
        menuItems,
        itemHeight,
        isActive: false,
        
        trackWrapStyle: {
          height: trackWrapHeight,
        },
        trackStyle: {
          height: trackHeight,
          transform: 'scale(1)',
        },
        trackCircleStyle: {
          top: trackCircleTop,
          // borderColor: 'red',
        }, 
        isWideCircle: false,
      };
    },
    methods: {
      toggleActive(){
        this.isActive = !this.isActive;
      },
    }
  });
  registerDimensions();
  
  scrollBasedAnimation();
  
  
};

window.onresize = function(){
  registerDimensions();
};

