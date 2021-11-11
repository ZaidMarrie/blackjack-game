let playerBalance = 100;
const playerBalanceEl = document.getElementById('player-balance');

// Deck Elements
const dealerMessage = document.getElementById('dealer-message');
const playerMessage = document.getElementById('player-message');
const dealerCardsEl = document.getElementById('dealer-cards');
const playerCardsEl = document.getElementById('player-cards');

// Bet Elements & Amount
let betAmount = 0;
const betAmountEl = document.getElementById('bet-amount');
const decreaseBetButton = document.getElementById('decrease-bet');
const increaseBetButton = document.getElementById('increase-bet');

// Participants Cards On Start
const playerFirstCards = [];
const dealerFirstCards = [];

// Participant Stats
let dealerTotal = 0;
let playerTotal = 0;

// Create Card Element 
function createCard(cards) {
    const card = document.createElement('div');
    card.classList.add('card');
    dealerCardsEl.appendChild(card);
    
    for (let card of cards) {
        const img = document.createElement('img');
        img.src = 'images/table.png';
    }
}

// Get new deck of shuffled cards
// Draw 2 cards for each(player & dealer)
// Display cards
async function getDeckOfCards(callback) {
    let res = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6');

    let data = await res.json();
    console.log(data)
    const deckId = data.deck_id;
    console.log(deckId)

    callback(deckId)
}

getDeckOfCards(drawFirstCards)

function drawFirstCards(deck) {
    fetch(`https://deckofcardsapi.com/api/deck/${deck}/draw/?count=4`)
        .then(res => res.json())
        .then(data => {
            const { cards } = data;

            cards.forEach((card,index) => {
                if (index < 2) {
                    playerFirstCards.push(card)
                } else {
                    dealerFirstCards.push(card)
                }
            })
            console.log(playerFirstCards)
        });
}

function checkBlackjack(drawnCardsArray) {
    switch(drawnCardsArray) {
        case '':
            break;
    }
}