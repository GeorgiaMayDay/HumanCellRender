import { first_question, answer_explain, answer_to_cell, explanation } from "./mascot_dialogue.js";

window.addEventListener("resize", adjustSpeechBubble, false);

addEventListener("load", adjustSpeechBubble);

function adjustSpeechBubble() {
    let bubble = document.getElementById('speech bubble');
    const bubbleRect = bubble.getBoundingClientRect();

    if (bubbleRect.top > 100) {
        bubble.className = "speech up-left";
    } else {
        bubble.className = "speech left";
    }

}

function nextText() {
    let mascot = document.getElementById('mascot-speech');
    mascot.innerText = first_question;

    let answer_box = document.getElementById('answer-space');
    answer_box.innerHTML = "<div class=col>" + answer_explain + "</div>" + "<div class=col>" + answer_to_cell + "</div>";

    document.querySelector("#explain-basic").onclick = function() {
        let mascot = document.getElementById('mascot-speech');
        mascot.innerText = explanation;
    }
}



document.querySelector("#forward-text").onclick = function() {
    nextText()
}