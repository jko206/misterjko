'use strict';

var TicTacToeLogic = (function(){
  // player1 => 0, player2 => 1
  let marks;
  let mark;
  let lastX;
  let lastY;
  let SIZE = 3;
  let chars = ['O', 'X'];
  
  function find3(mark){
    // diagonal1: left top to bottom right;
    function checkDiagonal1(){
      if(lastX === lastY){
        let points = 0;
        points += marks[0][0] === mark;
        points += marks[1][1] === mark;
        points += marks[2][2] === mark;
        return points === 3;
      } else {
        return false;
      }
    }
    // diagonal2;
    function checkDiagonal2(){
      if(lastX + lastY === SIZE - 1){
        let points = 0;
        points += marks[0][2] === mark;
        points += marks[1][1] === mark;
        points += marks[0][2] === mark;
        return points === 3;
      } else {
        return false;
      }
    }
    // horizontal 
    function checkHorizontal(){
      let row = marks[lastY];
      let points = 0;
      row.forEach(e=>{
        if(e === mark) points++;
      });
      return points === 3;
    }
    // vertical
    function checkVertical(){
      let points = 0;
      marks.forEach(row=>{
        let e = row[lastX];
        if(e === mark) points++;
      });
      return points === 3;
    }
    
    return checkDiagonal1() || checkDiagonal2() || checkHorizontal() || checkVertical();
  }
  return {
    reset(){
      marks  = [[,,,],[,,,],[,,,]];
      mark = 1;
      lastX = undefined;
      lastY = undefined;
    },
    mark(x, y){
      let winnerExists = false;
      if(marks[y][x] === undefined){
        // let marker = chars[mark];
        lastX = x;
        lastY = y;
        marks[y][x] = mark;
        let threeInARow = find3(mark);
        
        if(threeInARow){
          console.log(`${chars[mark]} wins!`);
          winnerExists = true;
        } else {
          console.log(`Player${mark+1}'s turn.`);
        }
        mark = (mark + 1)%2;
      } else {
        // throw new Error('Cell already marked');
        console.log(`Cell (${x}, ${y}) is already marked :(`);
      }
      this.print();
      if(winnerExists) this.reset();
    },
    print(){
      let str = '';
      marks.forEach((row,idx)=>{
        row = row.map(e=>{
          return e === undefined || e === null ? '-' : e;
        });
        str += row.join(' | ') + '\n';
        if(idx !== 2){
          str += '---+---+---\n';
        }
      });
      console.log(str);
    },
    /// Running the game;
    start(){
      this.reset();
      console.log(`Let's play some TicTacToe`);
      console.log(`To mark, type mark(X, Y), where X and Y are the coordinates you want to mark`);
    },
  }
}());

function mark(Y,X){
  TicTacToeLogic.mark(X,Y);
}