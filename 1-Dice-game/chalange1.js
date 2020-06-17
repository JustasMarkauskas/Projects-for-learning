/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/


var scores, roundScores, activePlayer, gamePlaying, playerValueInput, winningScore;

init();

var lastDice;
winningScore = 100;

document.querySelector('.btn-roll').addEventListener('click', function(){
    if(gamePlaying){
        //1. ranom number
        var dice =Math.floor(Math.random()*6)+1;
        
        
        
        //2. display the result
        var diceDOM = document.querySelector('.dice');
        diceDOM.style.display = 'block';
        diceDOM.src = 'dice-'+dice+'.png';   
                
        //3. Update the round score if the rolled number was not a 1
        if(dice === 6 && lastDice === 6){
            //player lose ALL score
            scores[activePlayer]=0;
            document.querySelector('#score-'+activePlayer).textContent = 0;
            nextPlayer();
        }else if(dice!==1){
            //add to score
            roundScores += dice;
            document.querySelector('#current-' + activePlayer).textContent = roundScores;                    
        } else{
            nextPlayer();
        }
        lastDice = dice;
        console.log(lastDice);
    }
    
});


document.querySelector('.btn-hold').addEventListener('click', function(){
    if(gamePlaying){
        
        // add current score to global score
        scores[activePlayer] += roundScores;
        // update the UI
        document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];
    
    //check if player won the game
        if(scores[activePlayer] >=winningScore){
                document.querySelector('#name-'+activePlayer).textContent = 'WINNER !!!'
                document.querySelector('.dice').style.display = 'none';
                document.querySelector('.player-'+activePlayer+'-panel').classList.add('winner');
                document.querySelector('.player-'+activePlayer+'-panel').classList.remove('active');
                gamePlaying = false;
        }else{
            nextPlayer();
        }
    }
    
})


document.querySelector('.btn-set').addEventListener('click', function(){
    playerValueInput = document.getElementById('scoreValue').value;
    winningScore = playerValueInput;
    init();
    
})

document.querySelector('.btn-new').addEventListener('click', init);




function nextPlayer(){
    activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
    roundScores = 0;
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    document.querySelector('.player-0-panel').classList.toggle('active');        
    document.querySelector('.player-1-panel').classList.toggle('active');
    document.querySelector('.dice').style.display = 'none';
}

function init(){
    scores = [0,0];
    roundScores = 0;
    activePlayer = 0;
    gamePlaying = true;
    

    document.querySelector('.dice').style.display = 'none';

    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';
    
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    
    document.getElementById('name-0').textContent = 'PLAYER 1';
    document.getElementById('name-1').textContent = 'PLAYER 2';
    
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('active');
    
    document.querySelector('.player-0-panel').classList.add('active');
}


// Game changed to follow these rules:
// 1. A player looses his ENTIRE score when he rolls two 6 in a row. After that, it's the next player's turn.
// 2. Add an input field to the HTML where players can set the winning score, so that they can change the predefined score of 100. 






































































