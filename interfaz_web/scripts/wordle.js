import { get_verbs } from './services/http.services.js';
import { eventManager } from '../einaudi/eventdelegationmanager.js';

const d = document;

const NUMBER_OF_GUESSES = 6;
let guesses_remainig    = NUMBER_OF_GUESSES;
let current_guess       = [];
let next_letter         = 0;
let word2guess          = undefined; 



// d.addEventListener('DOMContentLoaded', async () => {
//     const verbs_list = await get_verbs_temp();
//     word2guess = verbs_list[2].infinitive.split(" ")[1];
//     console.log(word2guess);
//     initBoard();
// });

const verbs_list = await get_verbs();
word2guess = verbs_list[2].infinitive.split(" ")[1];

eventManager.addEventListener('document','keyup', (e) => {
    e.preventDefault();

    if(guesses_remainig === 0){
        return;
    }

    let pressedKey = String(e.key);
    if(pressedKey === 'Backspace' && next_letter !== 0){
        deleteLetter();
        return
    }

    if(pressedKey === 'Enter'){
        checkGuess();
        return;
    }

    let found = pressedKey.match(/[a-z]/gi);
    if(!found || found.length > 1) {
        return
    } else {
        insertLetter(pressedKey);
    }
});

const initBoard = () => {
    const board = d.getElementById("game_board");
    for(let i=0; i< NUMBER_OF_GUESSES; i++){
        const row = d.createElement("div");
        row.className = "letter-row";

        for(let j=0; j < word2guess.length; j++){
            const box = d.createElement("div");
            box.className = "letter-box";
            row.appendChild(box);
        }
    board.appendChild(row);
    }
}

const insertLetter = (pressedKey) => {
    if(next_letter === word2guess.length){
        return
    }

    pressedKey = pressedKey.toLowerCase();

    const row = d.getElementsByClassName("letter-row")[6-guesses_remainig];
    const box = row.children[next_letter];
    box.textContent = pressedKey;
    box.classList.add("filled-box");
    current_guess.push(pressedKey);
    next_letter += 1;
}

const deleteLetter = () => {
    const row = d.getElementsByClassName("letter-row")[6-guesses_remainig];
    const box = row.children[next_letter - 1];
    box.textContent = '';
    box.classList.remove("fillex-box");
    current_guess.pop();
    next_letter -= 1;
}

const shadeKeyboard = (letter, color) => {
    const keyboard_key = d.getElementById(letter) || undefined;

    if(keyboard_key) {
        const old_color = keyboard_key.style.backgroundColor;
        if(old_color === 'green'){
            return
        }

        if(old_color === 'yellow' && color !== 'green'){
            return
        }

        keyboard_key.style.backgroundColor = color;
    }
}

const checkGuess = () => {
    const row = d.getElementsByClassName("letter-row")[6-guesses_remainig];
    console.log(row)
    let guess_string = '';
    const right_guess = Array.from(word2guess);

    for(const val of current_guess){
        guess_string += val;
    }

    if(guess_string.length != word2guess.length){
        alert('Not enough letters!');
    }

    //TO DO: Validacion en lista de palabras.
    // si no word en PalabrasArray:
    //     alert('Word not in list');
    //     return

    for(let i=0; i < word2guess.length; i++){
        let letter_color = '';
        const box = row.children[i];
        const letter = current_guess[i];

        let letter_position = right_guess.indexOf(current_guess[i]);
        // is letter in the correct guess
        if(letter_position === -1){
            letter_color = 'grey';
        } else {
            // if letter index and right guess index are the same
            //letters is in the right position
            if(current_guess[i] === right_guess[i]){
                letter_color = 'green';
            } else {
                letter_color = '#EBC934';
            }

            right_guess[letter_position] = '#';
        }

        const delay = 250 * i;

        setTimeout(()=> {
            box.style.backgroundColor = letter_color;
            shadeKeyboard(letter, letter_color);
        }, delay);
        
    }

    if(guess_string === word2guess){
        alert('You guessed right! Game Over!');
        guesses_remainig = 0;
        return;
    } else {
        guesses_remainig -= 1;
        current_guess = [];
        next_letter = 0;

        if(guesses_remainig === 0){
            alert(`You've run out of guesses! Game over!\nThe right word was: ${word2guess}`);

        }
    }




}

initBoard();
