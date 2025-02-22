// Check Web Speech API Support
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    alert("Your browser does not support Speech Recognition. Try using Google Chrome.");
} else {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    // Game Variables
    let playerHealth = 100;
    let enemyHealth = 100;
    let gameActive = true;
    const log = document.getElementById("game-log");
    const playerSprite = document.getElementById("player");
    const enemySprite = document.getElementById("enemy");

    const actions = {
        "hit": "attack",
        "jump": "dodge",
        "shield": "block"
    };

    function startListening() {
        if (!gameActive) return;
        log.textContent = "Listening... Say hit, jump, or shield!";
        recognition.start();
    }

    recognition.onresult = (event) => {
        let spokenWord = event.results[0][0].transcript.toLowerCase().trim();
        log.textContent = `You said: ${spokenWord}`;
        processAction(spokenWord);
    };

    recognition.onerror = (event) => {
        log.textContent = "⚠️ Mic Error: " + event.error;
        console.error("Speech Recognition Error:", event.error);
    };

    function processAction(word) {
        if (actions[word]) {
            executeAction(actions[word]);
        } else {
            log.textContent += " (Invalid command!)";
        }
    }

    function executeAction(action) {
        let enemyMove = Object.values(actions)[Math.floor(Math.random() * 3)];
        log.textContent += ` | Enemy did: ${enemyMove}`;

        if (action === "attack") {
            animateAttack(playerSprite, enemySprite);
            if (enemyMove !== "block") {
                enemyHealth -= 20;
            }
        } else if (action === "block" && enemyMove === "attack") {
            animateBlock(playerSprite);
            playerHealth -= 10;
        } else if (action === "dodge" && enemyMove === "attack") {
            animateDodge(playerSprite);
            log.textContent += " (Dodged successfully!)";
        } else {
            playerHealth -= 10;
        }

        updateHealth();
    }

    function updateHealth() {
        document.getElementById("player-health").textContent = `Player Health: ${playerHealth}`;
        document.getElementById("enemy-health").textContent = `Enemy Health: ${enemyHealth}`;

        if (playerHealth <= 0 || enemyHealth <= 0) {
            gameActive = false;
            log.textContent += playerHealth <= 0 ? " You Lost!" : " You Won!";
        }
    }

    function animateAttack(player, enemy) {
        player.classList.add("attack");
        setTimeout(() => player.classList.remove("attack"), 500);
        enemy.classList.add("hit");
        setTimeout(() => enemy.classList.remove("hit"), 500);
    }

    function animateBlock(player) {
        player.classList.add("block");
        setTimeout(() => player.classList.remove("block"), 500);
    }

    function animateDodge(player) {
        player.classList.add("dodge");
        setTimeout(() => player.classList.remove("dodge"), 500);
    }

    window.onload = () => {
        document.getElementById("start-btn").addEventListener("click", startListening);
    };
}
