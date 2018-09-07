/* global $ */

$(document).ready(function(){
  function showPage(){
    let card = storyNavState.currCard;
    let isSmallScreen = window.innerWidth < 500;
    let left;
    if(card === 0){
      left = 0;
    } else if(isSmallScreen){
      left = card * -100 + '%';
    } else {
      left = card * -500;
    }
    $('#my-story .event').css('left', left);
  }
  let storyNavState = {
    currCard: 0,
    lastCard: $('#my-story .event').length - 2
  }
  $('.story-nav .left-arrow').click(function(){
    let {currCard} = storyNavState;
    currCard = currCard > 0 ? currCard - 1 : 0;
    storyNavState.currCard = currCard;
    showPage();
  }).click();
  $('.story-nav .right-arrow').click(function(){
    let {currCard, lastCard} = storyNavState;
    currCard = currCard < lastCard ? currCard + 1 : lastCard;
    storyNavState.currCard = currCard;
    showPage();
  });
  $(window).resize(function(){
    showPage();
  });
});