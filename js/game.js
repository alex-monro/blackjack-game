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
    let score = 0;
    this.hand.forEach((card) => {
      score = score + card.value();
    });
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
    for (let i = 2; i > 0; i--) {
      let card = this.deck.cards.pop();
      this.playerHand.addCard(card);
      card = this.deck.cards.pop();
      this.dealerHand.addCard(card);
    }
  }

  hit() {
    let card = this.deck.cards.pop();
    this.playerHand.addCard(card);

    let score = this.playerHand.score();
    let result = this.playerHand.checkBust();
    console.log(score, result);

    if (result === "busted") {
      console.log("YOU BUSTED!");
      this.reset();
    }
  }

  stand() {
    let card = this.deck.cards.pop();
    this.dealerHand.addCard(card);
  }

  reset() {
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
  introScrn.style.display = "none";
  gameContainer.style.pointerEvents = "auto";
  game = new Game(deck, playerHand, dealerHand);
  game.start();
  console.log(playerHand);
  console.log(deck);
});

hitBtn.addEventListener("click", () => {
  game.hit();
  console.log(playerHand);
});

standBtn.addEventListener("click", () => {
  game.stand();
  console.log(dealerHand);
});

playAgain.addEventListener("click", () => {
  playAgain.style.display = "none";
  hitBtn.disabled = false;
  standBtn.disabled = false;
  game.start();
});
