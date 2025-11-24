//Starting Screen
const introScrn = document.querySelector(".intro-screen");
const playBtn = document.getElementById("play-btn");
const gameContainer = document.querySelector(".game-container");
const hitBtn = document.getElementById("hit-btn");
const standBtn = document.getElementById("stand-btn");
const dealBtn = document.getElementById("deal-btn");
const dealerScore = document.querySelector(".dealer-total");
const playerScore = document.querySelector(".player-total");

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

  start() {
    console.log("START: dealing cards");
    document.querySelector(".player-cards").innerHTML = "";
    document.querySelector(".dealer-cards").innerHTML = "";
    dealBtn.disabled = true;
    hitBtn.disabled = false;
    standBtn.disabled = false;
    for (let i = 2; i > 0; i--) {
      let card = this.deck.cards.pop();
      this.playerHand.addCard(card);
      this.displayCard(card, "player");
      card = this.deck.cards.pop();
      this.dealerHand.addCard(card);
      this.displayCard(card, "dealer");
    }
    console.log("Player score:", this.playerHand.score());
    console.log("Dealer score:", this.dealerHand.score());
  }

  displayCard(card, handType) {
    let cardContainer;
    if (handType === "player") {
      cardContainer = document.querySelector(".player-cards");
      playerScore.innerHTML = `${this.playerHand.score()}`;
    } else {
      cardContainer = document.querySelector(".dealer-cards");
      if (this.dealerHand.hand.length === 2) {
        dealerScore.innerHTML = `${this.dealerHand.hand[1].value()}`;
      }
    }

    const cardWrapper = document.createElement("div");
    cardWrapper.classList.add("card-wrapper");

    const cardBack = document.createElement("img");
    cardBack.src = "assets/cards/card_back.png";
    cardBack.classList.add("card-back");

    const cardFront = document.createElement("img");
    cardFront.src = card.imageSrc;
    cardFront.classList.add("card-front");

    cardWrapper.appendChild(cardBack);
    cardWrapper.appendChild(cardFront);

    if (this.dealerHand.hand.length === 1 && handType === "dealer") {
      cardWrapper.classList.add("hidden-card");
    }

    cardContainer.appendChild(cardWrapper);
  }

  revealCard() {
    const hiddenCard = document.querySelector(".hidden-card");
    hiddenCard.classList.add("reveal");
    dealerScore.innerHTML = `${this.dealerHand.score()}`;
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
      dealerScore.innerHTML = `Bust`;
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
      dealerScore.innerHTML = `Score: ${this.dealerHand.score()}`;
      let card = this.deck.cards.pop();
      this.dealerHand.addCard(card);
      this.displayCard(card, "dealer");
      dealerScore.innerHTML = `Score: ${this.dealerHand.score()}`;
    }

    this.results();
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
      playerScore.innerHTML = "Bust";
      dealerScore.innerHTML = "Win";
    } else if (this.dealerHand.checkBust() === "busted") {
      console.log("Dealer busted! Player wins!");
      playerScore.innerHTML = "Win";
      dealerScore.innerHTML = "Bust";
    } else if (playerScoreValue > dealerScoreValue) {
      console.log("Player wins!");
      playerScore.innerHTML = "Win";
      dealerScore.innerHTML = "Lose";
    } else if (dealerScoreValue > playerScoreValue) {
      console.log("Dealer wins!");
      playerScore.innerHTML = "Lose";
      dealerScore.innerHTML = "Win";
    } else {
      console.log("Push!");
      playerScore.innerHTML = "Push";
      dealerScore.innerHTML = "Push";
    }
  }

  reset() {
    console.log("RESET");
    this.playerHand.hand = [];
    this.dealerHand.hand = [];
    this.deck = new Deck();
    this.deck.createDeck();
    playerScore.innerHTML = "";
    dealerScore.innerHTML = "";
    hitBtn.disabled = true;
    standBtn.disabled = true;
    dealBtn.disabled = false;
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
  gameContainer.style.pointerEvents = "auto";
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
    dealerScore.hidden = false;
    playerScore.hidden = false;
  } else {
    game.reset();
  }

  dealBtn.disabled = true;
  hitBtn.disabled = false;
  standBtn.disabled = false;
  game.start();
});
