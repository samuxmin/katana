import { play, refreshStats, loadGame } from "./game.js";
console.log("abre")

export function handleClick(player){
    const choices = ["Rock", "Paper", "Scissors"];
    let index = Math.floor(Math.random() * choices.length);
    let computer = choices[index];
    const element = document.getElementById("results")

    const round = play(player, computer);
    let text = ""
    switch (round) {
        case "LOST":
            text = "You LOST"
            break;
        case "WIN":
            text = "You WON";
            break;
        case "TIE":
            text = "It's a TIE";
            break;
    }
    element.innerText = `Computer choose ${computer} - ${text}`
    refreshStats()
}
window.handleClick = handleClick;

document.getElementById("play_button").addEventListener("click", ()=> {
    loadGame();
    const title = document.getElementsByClassName("title")[0];
    title.innerHTML = "";
    document.getElementById("game").classList += "playing";

})
