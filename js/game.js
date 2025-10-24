//CARD VALUES

const ranks = [
  "Ace",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "Jack",
  "Queen",
  "King",
];
const suits = ["hearts", "diamonds", "clubs", "spades"];

//CREATE DECK

const deck = [];

//PLAYER AND DEALER HANDS
const playerHand = [];
const dealerHand = [];

//INITIAL DECK
for (let i = 8; i > 0; i--) {
  suits.forEach((suit) => {
    ranks.forEach((rank) => {
      deck.push(rank + " of " + suit);
    });
  });
}

console.log("Deck before shuffle:", deck);

//SHUFFLE FUNCTION

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const random = Math.floor(Math.random() * (i + 1));

    let temp = array[i];
    array[i] = array[random];
    array[random] = temp;
  }
}

//SHUFFLE DECK

shuffle(deck);
console.log("Deck after shuffle:", deck);

//DEAL CARDS

function deal(hand, deck) {
  for (let i = 2; i > 0; i--) {
    let card = deck.pop();
    hand.push(card);
  }
}

deal(playerHand, deck);
deal(dealerHand, deck);

console.log("PlayerHand", playerHand);
console.log("Dealer hand:", dealerHand);
