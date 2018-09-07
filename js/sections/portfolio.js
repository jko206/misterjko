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
      desc: `
        This is an aggregate of my work. Level and quality of work is directly
        proportional to how long ago I completed the work. Code for all of them
        can be found on my GitHub. Some of them may have been edited for demo.
      `,
    },
    {
      title: 'Algorithms & ADT',
      link: 'projects/algorithm/index.html',
      desc: `
        This is a collection of ADTs and algorithms I have implemented in 
        JavaScript. Currently I am practicing implementing them in Java, just as
        I have learned them in college. Algorithms cover various problems ranging
        from Binary Search Tree and Dynamic Programming to interview question preps
        for big tech companies. 
      `,
    },
    {
      title: 'Profile Search',
      link: 'projects/profile-search/search.html',
      desc: `
        This is a two-page site that demos searching and viewing of profiles for
        a network of professional developers. Only the front-end is imlemented.
        Loading/searching delay is merely simulated. Promise object is used to 
        resolve the delayed responses. 
        `,
    },
    {
      title: 'Steps Education',
      link: 'projects/steps_archive/homework/index.html',
      desc: `
        Steps Education was created to provide intuitive and rewarding learning
        environment for students, ease of grading and managing for teachers, and
        ease of communication with teachers for parents. The following is a demo
        of what student sees when she logs in.
      `,
    },
    {
      title: 'Knight\'s Tour',
      link: 'projects/KnightsTour/index.html',
      desc: `
        A knight starts from a position on a chess board and visits every cell.`,
    },
    {
      title: 'KenKen Solver',
      link: 'projects/KenKen/index.html',
      desc: `
        KenKen is a type of puzzle similar to Sudoku, but with arithmetic. For a 
        given n x n size puzzle, each and every column and row must have numbers
        1 through n, inclusive, and satisfy the arithmetic condition given for
        each cage, outlined in bold line.
      `,
    },
    {
      title: 'Game of Life',
      link: 'projects/GameOfLife/index.html',
      desc: 'Game of life.',
    },
  ];
  $('.category').click(function(){
    $('#portfolio').addClass('show-desc');
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
      $('#portfolio .right-arrow').show();
    } else {
      $('#portfolio .right-arrow').hide();
    }
  });
  
  $('.close').click(function(){
    $('#portfolio').removeClass('show-desc');
  });
  $('#portfolio .right-arrow').click(function(){
    let link = portfolioState.navLink;
    if(link){
      window.location = link;
    }
  })
});