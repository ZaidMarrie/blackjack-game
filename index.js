/* ----------------------------------
* Initialize Starting State Variables 
---------------------------------- */
let playerBalance = 100;
let deckId;

// Participant Stats
let playerTotal = 0;
let dealerTotal = 0;
const playerCards = [];
const dealerCards = [];

// Participant Stats Elements
const message = document.getElementById('message');
const dealerCardsEl = document.getElementById('dealer-cards');
const playerCardsEl = document.getElementById('player-cards');
const dealerCardsTotalEl = document.getElementById('dealer-total');
const playerCardsTotalEl = document.getElementById('player-total');

// Betting Options Elements
const hitButton = document.getElementById('hit-btn');
const stayButton = document.getElementById('stay-btn');
const doubleButton = document.getElementById('double-btn');
const placeBetButton = document.getElementById('placeBet-btn');

// Select Buttons to Raise & Lower Bet
let betAmount = 0;
const betAmountEl = document.getElementById('bet-amount');
const decreaseBetButton = document.getElementById('decrease-bet');
const increaseBetButton = document.getElementById('increase-bet');
const playerBalanceEl = document.getElementById('player-balance');

// Set Game Start State
function startGame() {
    hitButton.removeAttribute('disabled');
    stayButton.removeAttribute('disabled');
    hitButton.classList.remove('disabled');
    stayButton.classList.remove('disabled');
    doubleButton.removeAttribute('disabled');
    doubleButton.classList.remove('disabled');
    placeBetButton.classList.add('disabled');
    placeBetButton.setAttribute('disabled', true);
    decreaseBetButton.classList.add('disabled');
    increaseBetButton.classList.add('disabled');
    decreaseBetButton.setAttribute('disabled', true);
    increaseBetButton.setAttribute('disabled', true);
    getDeckOfCards(drawStartingCards);
}

// Get New Deck of shuffled Cards & Set DeckID
async function getDeckOfCards(callback) {
    try {
        const fetchUrl = 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6';
        const response = await fetch(fetchUrl);
        const deckData = await response.json();
        deckId = deckData.deck_id;

        callback(deckId)
    } catch (err) {
        console.error(err)
    }
}

// Draw 2 Cards for Each Participant(player & dealer)
function drawStartingCards(deck) {
    fetch(`https://deckofcardsapi.com/api/deck/${deck}/draw/?count=4`)
        .then(res => {
            if (!res.ok) {
                throw Error(`Could not retrieve data. Response-Status: ${res.status}`);
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

            updateGame();
        })
        .catch(err => console.error(err))
}

// Get Total of Card Values
function getCardsTotal(cardsArr, total) {
    cardsArr.forEach(card => {
        const cardVal = card.value;
        total += checkCardValues(cardVal, total);
    })
    return total;
}

// Check Card Values in Blackjack Context
function checkCardValues(value, sumVal) {
    switch(value) {
        case '2':
            return 1;
        case 'Ace':
            return 11;
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

// Update Game State
function updateGame() {
    playerTotal = getCardsTotal(playerCards, playerTotal);
    dealerTotal = getCardsTotal(dealerCards, dealerTotal);
    displayCards(playerCardsEl, playerCards);
    displayCards(dealerCardsEl, dealerCards);
    playerCardsTotalEl.textContent = playerTotal;
    dealerCardsTotalEl.textContent = dealerTotal;
}

// Display Cards For Each Participant
function displayCards(element, arr) {
    arr.forEach(arrEl => {
        const card = document.createElement('div');
        card.classList.add('card');

        const img = document.createElement('img');
        img.src = arrEl.image;

        card.appendChild(img)

        element.appendChild(card);
    })
}

// Check If Player Got Blackjack
function checkBlackjack() {
    if (playerTotal <= 21 && playerTotal > dealerTotal) {
        message.textContent = "YOU WIN!!!🎊🎉";
        playerBalance += (betAmount * 2);
    } else {
        message.textContent = "YOU LOSE!";
    }

    playerTotal = 0;
    dealerTotal = 0;
    betAmount = 0;
}

// Draw One Card on Hit
function drawSingleCard() {
    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
        .then(res => {
            if (!res.ok) {
                throw Error(`Could not retrieve data. Response-Status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            playerCards.push(data.cards[0]);
            dealerCards.push(data.cards[1]);
            updateHit();
        });
}

// Update Game on Hit
function updateHit() {
    createCard(playerCardsEl, playerCards);
    createCard(dealerCardsEl, dealerCards);

    playerTotal = getCardsTotal(playerCards, playerTotal);
    dealerTotal = getCardsTotal(dealerCards, dealerTotal);
    playerCardsTotalEl.textContent = playerTotal;
    dealerCardsTotalEl.textContent = dealerTotal;
}

function createCard(elem, arr) {
    const card = document.createElement('div');
    card.classList.add('card');

    const img = document.createElement('img');
    img.src = arr[arr.lenght - 1].image;

    card.appendChild(img);
    elem.appendChild(card);
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
placeBetButton.addEventListener('click', startGame);
stayButton.addEventListener('click', checkBlackjack);
hitButton.addEventListener('click', drawSingleCard)
decreaseBetButton.addEventListener('click', lowerBet);
increaseBetButton.addEventListener('click', raiseBet);