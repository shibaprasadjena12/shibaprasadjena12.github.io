let randomNumber = Math.floor(Math.random() * 100) + 1;

function checkGuess() {
    const userGuess = document.getElementById('guess').value;
    const result = document.getElementById('result');

    if (userGuess == randomNumber) {
        result.textContent = 'Congratulations! You guessed the correct number!';
        result.style.color = 'green';
    } else if (userGuess > randomNumber) {
        result.textContent = 'Too high! Try again.';
        result.style.color = 'red';
    } else {
        result.textContent = 'Too low! Try again.';
        result.style.color = 'red';
    }
}

function castSpell() {
    const spellEffect = document.getElementById('spell-effect');
    spellEffect.innerHTML = '<div class="sparkle"></div>';
    setTimeout(() => {
        spellEffect.innerHTML = '';
    }, 1000);
}

function mixPotion() {
    const ingredient1 = document.getElementById('ingredient1').value;
    const ingredient2 = document.getElementById('ingredient2').value;
    const potionResult = document.getElementById('potion-result');

    potionResult.textContent = `You mixed ${ingredient1} and ${ingredient2} to create a magical potion!`;
    potionResult.style.color = 'purple';
}