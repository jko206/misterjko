function rockPaperScissors(){
	var choice = prompt('Choose between Rock, Paper, or Scissors');
	var r = Math.random(), compChoice, winner;
	if(r < 0.33){
		compChoice = 'Rock';
		winner = choice == 'Scissors' ? 'computer' : 'you';
    } else if(r < 0.67){
		compChoice = 'Paper';
		winner = choice == 'Rock' ? 'computer' : 'you';
    } else {
		compChoice = 'Scissors';
		winner = choice == 'Paper' ? 'computer' : 'you';
    }
	console.log('Your choice: ' + choice);
	console.log('Comp choice: ' + compChoice);
	if(choice == compChoice) console.log('It\'s a tie!');
	else console.log('the winner is ' + winner);
}



//하나 빼기
var game = function(){
    
    console.log('In this game, you will choose rock, paper, or etc etc rule');
    
    var userChoice1 = prompt('Your first choice?');
    
    var userChoice2 = prompt('Your second choice?');
    
    var compChoice1 = randomChoice();
    
    var compChoice2 = randomChoice();

    var finalUserChoice = prompt('You chose: ' + userChoice1 + ' and ' + userChoice2
    	+ '\nComputer chose: ' + compChoice1 + ' and ' + compChoice2
    	+ '\nPick between your two choices: ' + userChoice1 + ', ' + userChoice2
    );
    
    var finalCompChoice = (function(){
    
        var r = Math.random() * 2;
        
        return Math.floor(r);
        
    }()) == 0 ? compChoice1 : compChoice2;
    
    var isWinner = function(userChoice, compChoice){
    	if(userChoice == compChoice){
    		return "It's a tie!";
    	} else if(
    		(userChoice == 'rock' && compChoice == 'paper')
    		|| (userChoice == 'paper' && compChoice == 'scissors')
    		|| (userChoice == 'scissors' && compChoice == 'rock')
    	){
			return 'Computer wins!';
    	} else {
    		return 'User wins!';
    	}
    };
    
    alert('You chose: ' + finalUserChoice 
		+ '\nComp chose: ' + finalCompChoice 
		+ '\n' + isWinner(finalUserChoice, finalCompChoice)
	);
    
    function randomChoice(){
    
        var r = Math.random();
        
        if(r < 0.33) return 'rock';
        
        else if(r < 0.67) return 'paper';
        
        else return 'scissors';
    
    }

};