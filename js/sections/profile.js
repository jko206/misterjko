/* global $*/

$(document).ready(function(){
  function showCard(page){
    let {currPage} = profileViewState;
    let classesToRemove = 'show-card-0 show-card-1 show-card-2 show-card-3 show-card-4';
    let $profilePositioner = $('.profile-positioner');
    $profilePositioner.removeClass(classesToRemove);
    if(page === 0){
      $profilePositioner.removeClass('open');
      // console.log(page);  
    } else {
      $profilePositioner.addClass('open');
      $profilePositioner.addClass('show-card-' + page);
      // console.log(page);  
    }
  }
  const profileViewState = {
    currPage: 0,
    cardCount: $('#profile .item').length,
  };
  $('.profile-nav .prev').click(function(){
    let page = profileViewState.currPage;
    if(page > 0){
       page--;
    } else {
      page = 0;
    }
    profileViewState.currPage = page;
    showCard(page);
  });
  $('.profile-nav .next').click(function(){
    let page = profileViewState.currPage;
    if(page < profileViewState.cardCount){
       page++;
    } else {
      page = profileViewState.cardCount;
    }
    let {innerWidth, innerHeight} = window;
    let isBigScreen = innerWidth > 600 && innerHeight > 440;
    if(page == profileViewState.cardCount && isBigScreen){
      page--;
    }
    profileViewState.currPage = page;
    showCard(page);
  });
});