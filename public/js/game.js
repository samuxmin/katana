console.log("the game")
let stats = {
    rounds:0,
    wins:0,
    loses:0,
}
if(localStorage.getItem("stats")){
    stats = JSON.parse(localStorage.getItem("stats"));
}else{
    localStorage.setItem("stats", JSON.stringify(stats))
}

export function play(player, computer){
    stats.rounds+=1;
    if(player == computer){
        return "TIE";
    }
    if(player == "Rock"){
        if(computer == "Paper"){
            stats.loses+=1;
            return "LOST";
        }
        if(computer == "Scissors"){
            stats.wins +=1;
            return "WIN";
        }
    }
    if(player == "Paper"){
        if(computer == "Scissors"){
            stats.loses+=1;
            return "LOST";
        }
    
        if(computer == "Rock"){
            stats.wins +=1;
            return "WIN";
        }
    }
    if(player == "Scissors"){
        if(computer == "Rock"){
            stats.loses+=1;
            return "LOST";
        }
        if(computer == "Paper"){
            stats.wins +=1;
            return "WIN";
        }
    }
}

export function refreshStats(){
    const {rounds, wins, loses} = stats;
    localStorage.setItem("stats", JSON.stringify(stats));
    document.getElementById("rounds").innerText = rounds;
    document.getElementById("wins").innerText = wins;
    document.getElementById("loses").innerText = loses;
}

export function loadGame(){
    let {rounds, wins, loses} = stats;
    let gameHtml = 
    `<div class="buttons">
    <button class="choice-btn" onclick="handleClick('Rock')">Rock <img src="assets/images/cobblestone.png" alt="rock"/></button>
    <button class="choice-btn" onclick="handleClick('Paper')">Paper <img src="assets/images/paper.png" alt="paper"/></button>
    <button class="choice-btn" onclick="handleClick('Scissors')">Scissors <img src="assets/images/shears.png" alt="scissors"/></button>
    </div>
    <div id="results">
    </div>
    <div class="stats">
        Rounds: <span id="rounds">${rounds}</span> Wins: <span id="wins">${wins}</span> Loses: <span id="loses">${loses}</span>
    </div>
    `
    let box = document.getElementById("game");
    box.innerHTML = gameHtml;
}