import {Game} from "../../../src/Game.js";
import {EVENT_CLICK, EVENT_DRAG_OVER} from "../../../src/view/View.js";

const gameSpecification = {
    actions: [{
        name: "deal",
        action: function () {
            const deck = this.deck("red");
            const pile = this.pile("left").model;

            let i = 0;
            while (i < 7) {
                i++;
                pile.add(deck.cards.pop());
            }
            pile.inspect().turn();
        },
        allowed: true
    }],
    decks: [{
        color: "red",
        jokers: false
    }],
    piles: [{
        name: "left",
        position: {
            x: 10,
            y: 10
        }
    }, {
        name: "right",
        position: {
            x: 210,
            y: 10
        }
    }]
};
const svgElt = document.getElementById("table");
const game = new Game(gameSpecification);
svgElt.appendChild(game.table.element);


let piles = ["left", "right"];
game.table.on(EVENT_CLICK, () => {
    const [sourcePile, destinationPile] = piles;

    game.pile(destinationPile).model.add(game.pile(sourcePile).model.take());

    if (game.pile(sourcePile).model.isEmpty()) {
        piles = [destinationPile, sourcePile];
    }
});

game.start();
