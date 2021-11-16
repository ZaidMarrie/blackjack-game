/* ----------------------------------
* Initialize Starting State Variables 
---------------------------------- */
let deckId;
let betAmount = 0;
let currentRound = 1;
let playerBalance = 100;
let stayed = false;

// Participant Stats
let playerTotal = 0;
let dealerTotal = 0;
const playerCards = [];
const dealerCards = [];

// Participant Stats Elements
const message = document.getElementById('message');
const playerCardsEl = document.getElementById('player-cards');
const dealerCardsEl = document.getElementById('dealer-cards');
const playerCardsTotalEl = document.getElementById('player-total');
const dealerCardsTotalEl = document.getElementById('dealer-total');

// Betting Options Elements
const hitButton = document.getElementById('hit-btn');
const stayButton = document.getElementById('stay-btn');
const doubleBetButton = document.getElementById('double-btn');
const placeBetButton = document.getElementById('placeBet-btn');

// Select Buttons to Raise & Lower Bet
const betAmountEl = document.getElementById('bet-amount');
const decreaseBetButton = document.getElementById('decrease-bet');
const increaseBetButton = document.getElementById('increase-bet');
const playerBalanceEl = document.getElementById('player-balance');

// Update Game Start When A Bet Is Placed
function initGame(round) {
    // Disable Placebet When Round Begins
    placeBetButton.classList.add('disabled');
    placeBetButton.setAttribute('disabled', true);

    // Enable Hit, Stay, Double Buttons
    hitButton.removeAttribute('disabled');
    stayButton.removeAttribute('disabled');
    doubleBetButton.removeAttribute('disabled');
    hitButton.classList.remove('disabled');
    stayButton.classList.remove('disabled');
    doubleBetButton.classList.remove('disabled');
}

// Update Game When New Round Begins
function initNewRound() {
    // Re-enable Ability to Place A Bet
    placeBetButton.classList.remove('disabled');
    placeBetButton.removeAttribute('disabled');

    // Disable Hit, Stay, Double Buttons
    hitButton.setAttribute('disabled', true);
    stayButton.setAttribute('disabled', true);
    doubleBetButton.setAttribute('disabled', true);
    hitButton.classList.add('disabled');
    stayButton.classList.add('disabled');
    doubleBetButton.classList.add('disabled');

    stayed = false;
}

// Create Starting Card Elements And Append to DOM
function createStartingCards(cardsArr, element) {
    cardsArr.forEach(card => {
        const cardEl = document.createElement('div');
        cardEl.classList.add('card');

        const cardImg = document.createElement('img');
        cardImg.src = card.image;

        cardEl.appendChild(cardImg);
        element.appendChild(cardEl);
    });
}

// Create A Single Card When Player Request Hit
function createSingleCard(cardsArr, element) {
    const cardLastIndex = cardsArr.length - 1; // Last Card Index

    const cardEl = document.createElement('div');
    cardEl.classList.add('card');

    const cardImg = document.createElement('img');
    cardImg.src = cardsArr[cardLastIndex].image;

    cardEl.appendChild(cardImg);
    element.appendChild(cardEl); 
}

// Get A Playing Deck For Start Of Game
async function getNewDeck(callback) {
    try {
        const fetchUrl = `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6`;
        const res = await fetch(fetchUrl);
        const data = await res.json();
        deckId = data.deck_id;
        callback(deckId);
    } catch (err) {
        console.log(err);
    }
}

// Draw Starting Cards And Add Them to Relevant Array
function drawStartingCards(deck) {
    fetch(`https://deckofcardsapi.com/api/deck/${deck}/draw/?count=4`)
        .then(res => {
            if (!res.ok) {
                let errorMessage = 'Something went wrong ResponseStatus: ';
                throw Error(`${errorMessage}${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            const { cards } = data;
            cards.forEach((card, index) => {
                if(index < 2) {
                    playerCards.push(card);
                } else {
                    dealerCards.push(card);
                }
            });
        })
        .catch(err => console.log(err));
}

// Get The Value Of Each Card
function getCardValue(card) {
    switch(card) {
        case 'ACE':
            return 1;
        case '2':
            return 1;
        case '3':
            return 3;
        case '4':
            return 4;
        case '5':
            return 5;
        case '6':
            return 6;
        case '7':
            return 7;
        case '8':
            return 8;
        case '9':
            return 9;
        case '10':
        case 'JACK':
        case 'QUEEN':
        case 'KING':
            return 10;
    }
}

// Sum Cards Values
function sumCardValues(cardsArr, total) {
    cardsArr.forEach(card => {
        const cardVal = card.value;
        total += getCardValue(cardVal);
    });
    return total;
}

// Check If Player Has BlackJack
function checkBlackjack(playerSum, dealerSum) {
    if (playerSum === 21) {
        message.textContent = "YOU WIN!!!";
        initNewRound();
    } else if (playerSum <= 21 && playerSum > dealerSum && playerSum > 15) {
        message.textContent = "YOU WIN!!!";
        initNewRound();
    } else if (stayed === true && playerSum <= 21 && playerSum > dealerSum) {
        message.textContent = "YOU WIN!!!";
        initNewRound();
    } else if (playerSum > 21) {
        message.textContent = "YOU LOSE!";
        initNewRound();
    } else if (dealerSum <= 21 && dealerSum > playerSum && playerSum > 15) {
        message.textContent = "YOU LOSE!";
        initNewRound();
    }
}

// Double The Bet When Player Requests Double
function doubleBet() {
    let doubledAmount = betAmount * 2;
    if (doubledAmount < 0) { // Makes balance red for short period
        playerBalanceEl.style.color = 'red';
        setTimeout(() => {
            playerBalanceEl.style.color = 'white';
        }, 450);
    } else {
        playerBalance -= betAmount;
        betAmount *= 2;
    }
}

// Draw Single Card On Hit 
async function drawCard(deck) {
    const fetchUrl = `https://deckofcardsapi.com/api/deck/${deck}/draw/?count=2`;
    const res = await fetch(fetchUrl);
    const data = await res.json();
    const cards = await data.cards;

    playerCards.push(cards[0]);
    dealerCards.push(cards[1]);
    createSingleCard(playerCards, playerCardsEl);
    createSingleCard(dealerCards, dealerCardsEl);
}















// Increase and/or decrease bet and balance accordingly
function lowerBet() {
    if (betAmount > 0) {
        betAmount--;
        playerBalance++;    
    }
    betAmountEl.textContent = betAmount;
    playerBalanceEl.textContent = playerBalance;
}

function raiseBet() {
    if (playerBalance > 0) {
        betAmount++;
        playerBalance--;
    }
    betAmountEl.textContent = betAmount;
    playerBalanceEl.textContent = playerBalance;
}

// Add Event Listeners For Buttons
decreaseBetButton.addEventListener('click', lowerBet);
increaseBetButton.addEventListener('click', raiseBet);