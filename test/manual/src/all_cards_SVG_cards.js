import {Deck} from "../../../src/Deck.js";
import {SVGCardsCardSupplier} from "../../../src/card_supplier/SVGCardsCardSupplier.js";

const card_supplier = new SVGCardsCardSupplier("/SVG-cards/svg-cards.svg");
const deck = new Deck("navy", true);

const WIDTH = 170;
const HEIGHT = 245;
const SUIT_WIDTH = 12 * WIDTH;

const svg = document.getElementById("table");
svg.setAttribute("width", SUIT_WIDTH + WIDTH);
svg.setAttribute("height", 5 * HEIGHT);
svg.style["font-size"] = `${WIDTH}px`;

let x = 0;
let y = 0;

const renderCard = function (card, x, y) {
    const cardElt = card_supplier.createCard(card);
    cardElt.setAttribute("transform", `translate(${x}, ${y})`);
    svg.appendChild(cardElt);
}

for (const card of deck.cards) {
    if (x > SUIT_WIDTH) {
        x = 0;
        y += HEIGHT;
    }

    // Render the front of the cards
    card.turn();
    renderCard(card, x, y);

    x += WIDTH;
}

// Render back as well.
const card = deck.cards[0];
card.turn()
renderCard(card, x, y);

// Render base of a card
x += WIDTH;
const base = card_supplier.createBase();
base.setAttribute("transform", `translate(${x},${y})`);
svg.appendChild(base);

// Render each of the four suits separately
x += WIDTH;
["club", "spade", "heart", "diamond"].forEach(suit => {
    const suitElt = card_supplier.createSuit(suit);
    suitElt.setAttribute("transform", `translate(${x}, ${y + HEIGHT / 2})`);
    svg.appendChild(suitElt);
    x += 20;
});

