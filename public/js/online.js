const socket = io()

const loginForm = document.getElementById("loginForm")
const login = document.getElementById("login")
const user = document.getElementById("username")
const playerUsername = document.getElementById("playerUsername")
const game = document.getElementById("online-game")
let usernameText;
loginForm.addEventListener("submit", e=>{
    e.preventDefault();
    usernameText = user.value
    socket.emit("new user", usernameText, function(data){
        if(data.ok){
            login.hidden = true;
            game.style.display = "flex";
            playerUsername.innerText = usernameText
        }else{
            Swal.fire({
                title: 'Error!',
                text: data.msg,
                icon: 'error',
              })
        }
    })
})

// Connection with friend

const connectionDiv = document.getElementById("friend-connection"); 
const friendForm = document.getElementById("friend-form");
const friendUser = document.getElementById("friend-username");
let friendNick;

friendForm.addEventListener("submit",e=>{
    e.preventDefault()
    friendNick = friendUser.value
    if(friendNick == usernameText){
        Swal.fire({
            title: 'Error!',
            text: "You can't play with yourself",
            icon: 'error',
          })
        return
    }
    socket.emit("friend connection",{player:usernameText,friend: friendNick}, function(data){
        if(data.ok){
            
        }else{
            Swal.fire({
                title: 'Error!',
                text: data.msg,
                icon: 'error',
              })
        }
    })
})
/* ACTUAL GAME*/
let friend;
let choice;

const stats = {
    wins: 0,
    loses: 0,
    rounds: 0,
}

let gameHtml = `<div class="buttons">
    <button class="choice-btn" onclick="handleClick('Rock')">Rock <img src="assets/images/cobblestone.png" alt="rock"/></button>
    <button class="choice-btn" onclick="handleClick('Paper')">Paper <img src="assets/images/paper.png" alt="paper"/></button>
    <button class="choice-btn" onclick="handleClick('Scissors')">Scissors <img src="assets/images/shears.png" alt="scissors"/></button>
    </div>
    <div id="results">
    </div>
    <div class="stats">
        Rounds: <span id="rounds">${stats.rounds}</span> Wins: <span id="wins">${stats.wins}</span> Loses: <span id="loses">${stats.loses}</span>
    </div>`

socket.on("game start", data => {
    connectionDiv.hidden = true;
    game.innerHTML = gameHtml;
    friend = data; // INDEX DEL AMIGO

})


socket.on("round end", data => {
    const {player, oponent} = data;
    console.log(data)
    result = play(player, oponent)
    refreshStats()
    switch(result){
        case "WIN":
            Swal.fire({
                title:"You won!",
                icon:"success"
            })
            break;
        case "LOST":
            Swal.fire({
                title:"You lost!",
                icon:"error"
            })
            break;
        case "TIE":
            Swal.fire({
                title:"It's a tie!",
                icon:"info"
            })
            break;
                
    }
    disableButtons(false);
})

function handleClick(chosen){
    choice = chosen;
    const data = {choice, friend, rounds}
    socket.emit("round choice", data)
    disableButtons(true)
}
function disableButtons(disabled){
    const choiceBtns = document.getElementsByClassName("choice-btn")
    for(let i = 0; i < choiceBtns.length; i++){
        choiceBtns[i].disabled = disabled;
    }
}

function play(player, oponent){
    stats.rounds+=1;
    if(player == oponent){
        return "TIE";
    }
    if(player == "Rock"){
        if(oponent == "Paper"){
            stats.loses+=1;
            return "LOST";
        }
        if(oponent == "Scissors"){
            stats.wins +=1;
            return "WIN";
        }
    }
    if(player == "Paper"){
        if(oponent == "Scissors"){
            stats.loses+=1;
            return "LOST";
        }
    
        if(oponent == "Rock"){
            stats.wins +=1;
            return "WIN";
        }
    }
    if(player == "Scissors"){
        if(oponent == "Rock"){
            stats.loses+=1;
            return "LOST";
        }
        if(oponent == "Paper"){
            stats.wins +=1;
            return "WIN";
        }
    }
}

function refreshStats(){
    document.getElementById("rounds").innerText = stats.rounds;
    document.getElementById("wins").innerText = stats.wins;
    document.getElementById("loses").innerText = stats.loses;
}