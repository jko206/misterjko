/* global $ */
/*
To put in: 
ADT / Algo
  -trees
  -bunch of shit I did for amazon prep
  -mamtch making
  -coin change program

Projects
  -TopTal
  -Steps Math
  -[Integris]
  

Puzzles / Solver
  -KenKen
  -[Sudoku Solver]
  -Knight's Tour
  -[OTrio]
    -AI plays against person
  -Game of life
-->
*/

$(document).ready(function(){
  const portfolioState = {
    currActive: '',
    navLink: '',
  };
  const portfolioData = [
  
    {
      title: 'About',
      desc: 'This page has my stuff',
    },
    {
      title: 'Algorithms & ADT',
      desc: 'Algo and stuff',
      link: '#algo',
    },
    {
      title: 'Profile Search',
      desc: 'Toptal profile search',
      link: '#toptal',
    },
    {
      title: 'Steps Education',
      desc: 'Algo and stuff',
      link: '#',
    },
    {
      title: 'Knight\'s Tour',
      desc: 'Hopping around',
      link: '#',
    },
    {
      title: 'KenKen Solver',
      desc: 'Solves KenKen',
      link: '#',
    },
    {
      title: 'Game of Life',
      desc: 'This is all a game',
      link: '#',
    },
  ];
  $('.category').click(function(){
    $('#section-portfolio').addClass('show-desc');
    let id = $(this).attr('id');
    id = id.match(/\d+/);
    id = parseInt(id, 10);
    let data = portfolioData[id];
    let {
      title,
      desc,
      link,
    } = data;
    $('.desc-title').text(title);
    $('.desc').text(desc);
    portfolioState.navLink = link;
    if(link){
      $('.open-project').show();
    } else {
      $('.open-project').hide();
    }
  });
  
  $('.close-desc').click(function(){
    $('#section-portfolio').removeClass('show-desc');
  });
  $('.open-project').click(function(){
    let link = portfolioState.navLink;
    if(link){
      window.location = link;
    }
  })
});