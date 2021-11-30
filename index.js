/* ----------------------------------
* Initialize Starting State Variables 
---------------------------------- */
let deckId;
let betAmount = 0;
let currentRound = 1;
let playerBalance = 100;
let stayed = false;
let hit = false;

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
function initGame() {
    betAmount = 0;
    currentRound = 1;
    playerBalance = 100;
    stayed = false;
    hit = false;
    playerTotal = 0;
    dealerTotal = 0;
    playerCards = [];
    dealerCards = [];
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
    hit = false;
    if (message.textContent === 'Its a draw') {
        playerBalance += betAmount;
        betAmount = 0;
        playerBalanceEl.textContent = playerBalance;
        betAmountEl.textContent = betAmount;
    } else if (message.textContent === "YOU WIN!!!") {
        let myBetAmountDoubled = betAmount * 2;
        playerBalance += myBetAmountDoubled;
        betAmount = 0;
        playerBalanceEl.textContent = playerBalance;
        betAmountEl.textContent = betAmount;
    } else if (message.textContent === "YOU LOSE!") {
        betAmount = 0;
        betAmountEl.textContent = betAmount;
    } else if (playerBalance <= 0) {
        initGame();
    }
}

// Create Starting Card Elements And Append to DOM
async function createStartingCards(cardsArr, element) {
    cardsArr.forEach(card => {
        const cardEl = document.createElement('div');
        cardEl.classList.add('card');

        const cardImg = document.createElement('img');
        cardImg.src = card.image;

        cardEl.appendChild(cardImg);
        element.appendChild(cardEl);
    });   
}

// Display Card totals
function displayCardTotal(participantTotal, element) {
    element.textContent = participantTotal;
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

/**
 * Get starting cards from new deck created by getNewDeck
 * Display those cards
 * Sum the total of those cards
 * Display the total
 */
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

            createStartingCards(playerCards, playerCardsEl);
            createStartingCards(dealerCards, dealerCardsEl);
            playerTotal = sumCardValues(playerCards, playerTotal);
            dealerTotal = sumCardValues(dealerCards, dealerTotal);
            displayCardTotal(playerTotal, playerCardsTotalEl);
            displayCardTotal(dealerTotal, dealerCardsTotalEl);
            checkBlackjack(playerTotal, dealerTotal);
        })
        .catch(err => console.log(err));
}

// Get The Value Of Each Card
function getCardValue(card) {
    switch(card) {
        case 'ACE':
            return 11;
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
function sumCardValues(cardsArr, participantTotal) {
    let total = 0;
    cardsArr.forEach(card => {
        const cardVal = card.value;
        total += getCardValue(cardVal);
    });
    participantTotal = total;
    /* 
    *The above line doesn't change the value of the variable passed as participantTotal, I'm *assuming it's due to the concepts of pass by reference and value 
    */
    return total;
}

// Check If Player Has BlackJack
function checkBlackjack(playerSum, dealerSum) {
    if (playerSum === dealerSum) {
        message.textContent = "Its a draw";
        initNewRound();
    } else if (playerSum === 21 && dealerSum !== 21) {
        message.textContent = "YOU WIN!!!";
        initNewRound();
    } else if (dealerSum === 21 && playerSum !== 21) {
        message.textContent = "YOU LOSE!"
        initNewRound();
    } else if (playerSum > 15 && playerSum > dealerSum && hit || stay && playerSum <= 21) {
        message.textContent = "YOU WIN!!!";
        initNewRound();
    } else if (dealerSum > 15 && dealerSum > playerSum && hit || stay && dealerSum <= 21) {
        message.textContent = "YOU LOSE!"
        initNewRound();
    } else if (playerSum <= 21 && playerSum > dealerSum && stay) {
        message.textContent = "YOU WIN!!!";
        initNewRound();
    } else if (dealerSum <= 21 && dealerSum > playerSum && stay) {
        message.textContent = "YOU LOSE!";
        initNewRound();
    } else if (playerSum <= 21 && playerSum > 18 && dealerSum <= 18) {
        message.textContent = "YOU WIN!!!";
        initNewRound();
    } else if (dealerSum <= 21 && dealerSum > 18 && playerSum <= 18) {
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
    playerTotal = sumCardValues(playerCards, playerTotal);
    dealerTotal = sumCardValues(dealerCards, dealerTotal);
    displayCardTotal(playerTotal, playerCardsTotalEl);
    displayCardTotal(dealerTotal, dealerCardsTotalEl);
    checkBlackjack(playerTotal, dealerTotal);
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

// Placebet button Event
placeBetButton.addEventListener('click', () => {
    if (betAmount === 0) {
        message.textContent = 'Cannot place a bet of 0';
    } else {
        message.textContent = '';

        const initialCards = document.querySelectorAll('.card-back');
        initialCards.forEach(element => {
            element.classList.add('hidden')
        });

        const previousCards = document.querySelectorAll('.card');
        previousCards.forEach(card => {
            card.remove();
        })

        if (currentRound === 1) {
            initGame();
        } else {
            initNewRound();
        }
        getNewDeck(drawStartingCards);
    }
})

// Stay Button Event 
stayButton.addEventListener('click', () => {
    stay = true;
    drawCard(deckId);
});

// Hit Button Event 
hitButton.addEventListener('click', () => {
    hit = true;
    drawCard(deckId);
});

// Double Button Event 
doubleBetButton.addEventListener('click', () => {
    doubleBet();
    hit = true;
    drawCard(deckId);
});