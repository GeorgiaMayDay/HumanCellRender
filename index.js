window.addEventListener("resize", adjustSpeechBubble, false);

addEventListener("load", adjustSpeechBubble);

function adjustSpeechBubble() {
    let mascot = document.getElementById('Mascot');
    let bubble = document.getElementById('speech bubble');

    const mascotRect = mascot.getBoundingClientRect();
    const bubbleRect = bubble.getBoundingClientRect();

    if (bubbleRect.top > 100) {
        bubble.className = "speech up-left";
    } else {
        bubble.className = "speech left";
    }

}