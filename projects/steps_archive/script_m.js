/*
	make <h1> fixed to the top while the next <h1> is not in viewport. 
	when the next one shows up, make it static again. 
	fixed background for rather long subslides

*/

var WINDOW_HEIGHT = 0;
var WINDOW_WIDTH = 0;

var mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

var FONT_SIZES = [];

$(document).ready(function(){
	animateLevel();
	titlePhrase = (function(){
		var i = parseInt(Math.random()*100);
		var phrases = [
			"Let's Take Steps",
			"Step in Right Direction",
			"Step by Step",
			"Small Steps at a Time"
		];
		return phrases[i%4];
	}) || "Let's take Steps";
	
	$('title').text(titlePhrase);

	//menu animation
	$('.main-menu-item').click(function(){
		$(this).siblings('ul').removeClass('sub-menu');
		$('.sub-menu').slideUp();
		$(this).siblings('ul').addClass('sub-menu');
		$(this).siblings('ul').slideDown();
	});

	$('.set-english').click(function(){
		$('.korean').hide();
		$('.english').show();
	});
	$('.set-korean').click(function(){
		$('.korean').show();
		$('.english').hide();
	});
	
	$('.subslide').hide();
	$('.open-subset').click(function(){
		var subset = "." + $(this).data('subset');
		$('.slide').hide();
		$(subset).show();
		
	});
	$('.close-button').click(function(){
		$('.slide').show();
		$('.subslide').hide();
	});
	$('.main-menu-item').click(function(){
		$('.slide').show();
		$('.subslide').hide();
	});
	
	$('#lang-choice').click(function(){
		//$('body').scrollTo('#about-us', {duration: 500, easing: 'easeOutQuad'});
		$('.intro-container').hide({duration: 500, easing: 'easeOutQuad'});
		//$('.side-pane').show('slide', {easing: 'easeOutQuad'}, 500);
	});
	
	//$(window).scroll(function(){})
	
	//$('#font-medium').click();
	//$('#kor-switch').click();
		
	$('#accordion').accordion({
		active: false,
		collapsible: true,
		animated: "easeOutQuad",
		fillSpace: true
	});
});

function animateLevel(){
	$('#level').delay(500).animate(
		{color : "#777777", bottom: "10px"}, 
		1000, 
		"easeOutQuad",
		function(){
			$('#lang-choice').fadeIn(500);
		}
	);
}