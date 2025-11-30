//DOM elements
const introScrn = document.querySelector(".intro-screen");
const playBtn = document.getElementById("play-btn");
const gameContainer = document.querySelector(".game-container");
const hitBtn = document.getElementById("hit-btn");
const standBtn = document.getElementById("stand-btn");
const dealBtn = document.getElementById("deal-btn");
const dealerScoreEl = document.querySelector(".dealer-total");
const playerScoreEl = document.querySelector(".player-total");
const deckEl = document.querySelector(".deck");
const playerCardsContainer = document.querySelector(".player-cards");
const dealerCardsContainer = document.querySelector(".dealer-cards");

//Card Back Source
const cardBackSrc = "assets/cards/card_back.png";

//Game variables

let deck;
let playerHand;
let dealerHand;
let game;

//game
class Card {
  constructor(suit, rank) {
    this.suit = suit;
    this.rank = rank;
    this.imageSrc = `assets/cards/${rank.toString()}_of_${suit}.svg`;
  }

  value() {
    if (this.rank === "jack" || this.rank === "queen" || this.rank === "king") {
      return 10;
    } else if (this.rank === "ace") {
      return 11;
    } else {
      return this.rank;
    }
  }
}

class Deck {
  constructor() {
    this.cards = [];
  }

  createDeck() {
    const suits = ["hearts", "diamonds", "clubs", "spades"];
    const ranks = ["ace", 2, 3, 4, 5, 6, 7, 8, 9, 10, "jack", "queen", "king"];

    suits.forEach((suit) => {
      ranks.forEach((rank) => {
        this.cards.push(new Card(suit, rank));
      });
    });
    this.shuffle();
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const random = Math.floor(Math.random() * (i + 1));
      let temp = this.cards[i];
      this.cards[i] = this.cards[random];
      this.cards[random] = temp;
    }
  }
}

class Hand {
  constructor() {
    this.hand = [];
  }

  addCard(card) {
    this.hand.push(card);
  }

  score() {
    let aces = 0;
    let score = 0;

    this.hand.forEach((card) => {
      score = score + card.value();
      if (card.rank === "ace") {
        aces++;
      }
    });

    while (score > 21 && aces > 0) {
      score = score - 10;
      aces--;
    }
    return score;
  }

  checkBust() {
    let score = this.score();
    if (score > 21) {
      return "busted";
    }
    return "safe";
  }
}

class Game {
  constructor(deck, playerHand, dealerHand) {
    this.deck = deck;
    this.playerHand = playerHand;
    this.dealerHand = dealerHand;
  }

  async start() {
    playerCardsContainer.innerHTML = "";
    dealerCardsContainer.innerHTML = "";
    dealBtn.disabled = true;
    hitBtn.disabled = false;
    standBtn.disabled = false;
    for (let i = 2; i > 0; i--) {
      let card = this.deck.cards.pop();
      this.playerHand.addCard(card);
      this.displayCard(card, "player");
      await new Promise((r) => setTimeout(r, 400));
      card = this.deck.cards.pop();
      this.dealerHand.addCard(card);
      this.displayCard(card, "dealer");
      await new Promise((r) => setTimeout(r, 400));
    }
    console.log("Player score:", this.playerHand.score());
    console.log("Dealer score:", this.dealerHand.score());
  }

  hit() {
    console.log("HIT");
    let card = this.deck.cards.pop();
    this.playerHand.addCard(card);
    this.displayCard(card, "player");

    let score = this.playerHand.score();
    let result = this.playerHand.checkBust();
    console.log("Player score:", score, result);

    if (result === "busted") {
      dealerScoreEl.innerHTML = `Bust`;
      console.log("YOU BUSTED!");
      this.revealCard();
      hitBtn.disabled = true;
      standBtn.disabled = true;
      dealBtn.disabled = false;
      this.results();
    }
  }

  async stand() {
    this.revealCard();

    while (this.dealerHand.score() < 17) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      dealerScoreEl.innerHTML = `${this.dealerHand.score()}`;
      let card = this.deck.cards.pop();
      this.dealerHand.addCard(card);
      this.displayCard(card, "dealer");
      dealerScoreEl.innerHTML = `${this.dealerHand.score()}`;
    }

    this.results();
  }

  displayCard(card, handType) {
    let cardContainer;

    if (handType === "player") {
      cardContainer = playerCardsContainer;
      playerScoreEl.innerHTML = `${this.playerHand.score()}`;
    } else {
      cardContainer = dealerCardsContainer;
      if (this.dealerHand.hand.length === 2) {
        dealerScoreEl.innerHTML = `${this.dealerHand.hand[1].value()}`;
      }
    }

    const cardWrapper = document.createElement("div");
    cardWrapper.classList.add("card-wrapper");

    const cardBack = document.createElement("img");
    cardBack.src = cardBackSrc;
    cardBack.classList.add("card-back", "card-img");

    const cardFront = document.createElement("img");
    cardFront.src = card.imageSrc;
    cardFront.classList.add("card-front", "card-img");

    cardWrapper.appendChild(cardBack);
    cardWrapper.appendChild(cardFront);

    if (this.dealerHand.hand.length === 1 && handType === "dealer") {
      cardWrapper.classList.add("hidden-card");
    }

    cardContainer.appendChild(cardWrapper);
    this.animateCard(cardWrapper);
  }

  animateCard(cardWrapper) {
    const deckLocation = deckEl.getBoundingClientRect();
    const cardLocation = cardWrapper.getBoundingClientRect();

    const xDistance = deckLocation.left - cardLocation.left;
    const yDistance = deckLocation.top - cardLocation.top;
    cardWrapper.style.transform = `translate(${xDistance}px, ${yDistance}px)`;
    cardWrapper.getBoundingClientRect();

    if (cardWrapper.classList.contains("hidden-card")) {
      requestAnimationFrame(() => {
        cardWrapper.style.transition = "transform .4s ease-out";
        cardWrapper.style.transform = `translate(0, 0) rotateY(0deg)`;
      });
    } else {
      requestAnimationFrame(() => {
        cardWrapper.style.transition = "transform .4s ease-out";
        cardWrapper.style.transform = "translate(0, 0) rotateY(180deg)";
      });
    }
  }

  revealCard() {
    const hiddenCard = document.querySelector(".hidden-card");
    hiddenCard.classList.add("reveal");
    dealerScoreEl.innerHTML = `${this.dealerHand.score()}`;
  }

  results() {
    this.revealCard();
    hitBtn.disabled = true;
    standBtn.disabled = true;
    dealBtn.disabled = false;

    let playerScoreValue = this.playerHand.score();
    let dealerScoreValue = this.dealerHand.score();

    if (this.playerHand.checkBust() === "busted") {
      console.log("Player busted! Dealer wins!");
      playerScoreEl.innerHTML = "Bust";
      dealerScoreEl.innerHTML = "Win";
    } else if (this.dealerHand.checkBust() === "busted") {
      console.log("Dealer busted! Player wins!");
      playerScoreEl.innerHTML = "Win";
      dealerScoreEl.innerHTML = "Bust";
    } else if (playerScoreValue > dealerScoreValue) {
      console.log("Player wins!");
      playerScoreEl.innerHTML = "Win";
      dealerScoreEl.innerHTML = "Lose";
    } else if (dealerScoreValue > playerScoreValue) {
      console.log("Dealer wins!");
      playerScoreEl.innerHTML = "Lose";
      dealerScoreEl.innerHTML = "Win";
    } else {
      console.log("Push!");
      playerScoreEl.innerHTML = "Push";
      dealerScoreEl.innerHTML = "Push";
    }
    if(playerScoreEl.innerHTML==="Win" || playerScoreEl.innerHTML==="blackjack"){
      playerScoreEl.style.borderColor="green";
      dealerScoreEl.style.borderColor="red";
    }else if(playerScoreEl.innerHTML==="Lose" || playerScoreEl.innerHTML==="Bust" ){
      playerScoreEl.style.borderColor="red";
      dealerScoreEl.style.borderColor="green";
    }else{
      playerScoreEl.style.borderColor="yellow";
      dealerScoreEl.style.borderColor="yellow";
    }
  }

  reset() {
    console.log("RESET");
    this.playerHand.hand = [];
    this.dealerHand.hand = [];
    this.deck = new Deck();
    this.deck.createDeck();
    playerScoreEl.innerHTML = "";
    dealerScoreEl.innerHTML = "";
    hitBtn.disabled = true;
    standBtn.disabled = true;
    dealBtn.disabled = false;
    playerScoreEl.style.borderColor="#FFFFFF33";
    dealerScoreEl.style.borderColor="#FFFFFF33";
  }
}

// Initialize game
deck = new Deck();
deck.createDeck();

playerHand = new Hand();
dealerHand = new Hand();

// Event listeners
playBtn.addEventListener("click", () => {
  introScrn.style.display = "none";
  introScrn.style.pointerEvents = "none";
  gameContainer.style.pointerEvents = "auto";
  gameContainer.style.display = "block";
  hitBtn.disabled = true;
  standBtn.disabled = true;
   playerScoreEl.innerHTML = "Player";
      dealerScoreEl.innerHTML = "Dealer";
});

hitBtn.addEventListener("click", () => {
  game.hit();
});

standBtn.addEventListener("click", () => {
  game.stand();
});

dealBtn.addEventListener("click", () => {
  if (!game) {
    game = new Game(deck, playerHand, dealerHand);
    dealerScoreEl.hidden = false;
    playerScoreEl.hidden = false;
  } else {
    game.reset();
  }

  dealBtn.disabled = true;
  hitBtn.disabled = false;
  standBtn.disabled = false;
  game.start();
});
