//Starting Screen
const introScrn = document.querySelector(".intro-screen");
const playBtn = document.getElementById("play-btn");
const gameContainer = document.querySelector(".game-container");
const hitBtn = document.getElementById("hit-btn");
const standBtn = document.getElementById("stand-btn");
const playAgain = document.getElementById("play-again");

let deck;
let playerHand;
let dealerHand;
let game;

//game
class Card {
  constructor(suit, rank) {
    this.suit = suit;
    this.rank = rank;
  }

  value() {
    if (this.rank === "Jack" || this.rank === "Queen" || this.rank === "King") {
      return 10;
    } else if (this.rank === "Ace") {
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
    const suits = ["♥", "♦", "♣", "♠"];
    const ranks = ["Ace", 2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King"];

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
      if (card.rank === "Ace") {
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
    for (let i = 2; i > 0; i--) {
      let card = this.deck.cards.pop();
      this.playerHand.addCard(card);
      card = this.deck.cards.pop();
      this.dealerHand.addCard(card);
    }
    console.log("Player score:", this.playerHand.score());
    console.log("Dealer score:", this.dealerHand.score());
  }

  hit() {
    console.log("HIT");
    let card = this.deck.cards.pop();
    this.playerHand.addCard(card);

    let score = this.playerHand.score();
    let result = this.playerHand.checkBust();
    console.log("Player score:", score, result);

    if (result === "busted") {
      console.log("YOU BUSTED!");
      this.reset();
    }
  }

  stand() {
    console.log("STAND - Dealer's turn");
    while (this.dealerHand.score() < 17) {
      let card = this.deck.cards.pop();
      this.dealerHand.addCard(card);
    }
    let score = this.dealerHand.score();
    let result = this.dealerHand.checkBust();
    console.log("Dealer final score:", score);

    if (result === "busted") {
      console.log("Dealer Busted, you win!");
      this.reset();
    } else {
      this.results();
    }
  }

  results() {
    let playerScore = this.playerHand.score();
    let dealerScore = this.dealerHand.score();
    console.log("RESULTS - Player:", playerScore, "Dealer:", dealerScore);

    if (playerScore > dealerScore) {
      console.log("Player wins!");
    } else if (dealerScore > playerScore) {
      console.log("Dealer wins!");
    } else {
      console.log("Push!");
    }
    this.reset();
  }

  reset() {
    console.log("RESET");
    this.playerHand.hand = [];
    this.dealerHand.hand = [];
    this.deck = new Deck();
    this.deck.createDeck();

    hitBtn.disabled = true;
    standBtn.disabled = true;
    playAgain.style.display = "block";
  }
}

// Initialize game
deck = new Deck();
deck.createDeck();

playerHand = new Hand();
dealerHand = new Hand();

// Event listeners
playBtn.addEventListener("click", () => {
  console.log("=== PLAY CLICKED ===");
  introScrn.style.display = "none";
  gameContainer.style.pointerEvents = "auto";
  game = new Game(deck, playerHand, dealerHand);
  game.start();
});

hitBtn.addEventListener("click", () => {
  game.hit();
});

standBtn.addEventListener("click", () => {
  game.stand();
});

playAgain.addEventListener("click", () => {
  console.log("=== PLAY AGAIN CLICKED ===");
  playAgain.style.display = "none";
  hitBtn.disabled = false;
  standBtn.disabled = false;
  game.start();
});
