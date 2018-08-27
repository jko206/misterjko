/* global $ */

'use strict';

$(document).ready(function(){
  $('#index-html').on('click', '#connect', function(){
    $('#shadow-bg').removeClass('hide');
  });
  
  $('#shadow-bg').on('click', '.close-button, .message-box button', function(){
    $('#shadow-bg').addClass('hide');
  });
  
});