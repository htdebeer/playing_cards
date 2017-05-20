import {Game} from "../../../src/Game.js";

const gameSpecification = {
    actions: [{
        name: "setup",
        action: function () {
            const pile = this.pile("left").model;
            for (const card of pile.each()) {
                card.turn();
            }

            pile.shuffle();
        }
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
        },
        deck: "red"
    }]
};
const svgElt = document.getElementById("table");
const game = new Game(gameSpecification);
svgElt.appendChild(game.table.element);

game.start();
