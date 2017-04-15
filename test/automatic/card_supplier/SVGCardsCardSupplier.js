require("jsdom-global")();
import {Deck} from "../../../src/Deck.js";
import {SVGCardsCardSupplier} from "../../../src/card_supplier/SVGCardsCardSupplier.js";

import {assert} from "chai";

const checkCard = function (card, supplier) {

    let name = "back";
    if (card.isJoker()) {
        name = `${card.isRed() ? "red" : "black"}_joker`;
    } else {
        let [rank, suit] = card.name.split(" of ");
        if (card.isPipsCard()) {
            rank = card.pips;
        }
        name = `${rank}_${suit.slice(0, -1)}`;
    }

    let representation = supplier.createCard(card);
    assert.equal(representation.tagName, "use");
    assert.isTrue(representation.hasAttribute("fill"));
    assert.equal(representation.getAttribute("fill"), card.backColor);
    assert.isTrue(representation.getAttribute("xlink:href").startsWith("/svg-cards.svg"));
    assert.isTrue(representation.getAttribute("xlink:href").endsWith("back"));
    card.turn();
    representation = supplier.createCard(card);
    assert.equal(representation.tagName, "use");
    assert.isTrue(representation.getAttribute("xlink:href").endsWith(`#${name}`));
};


describe("SVGCardsCardSupplier", function () {
    describe("#createCard(card)", function () {

        const deck = new Deck("skyblue", true);
        const supplier = new SVGCardsCardSupplier();

        it("should create a USE element pointing to the card to show in the svg-cards.svg file", function () {
            for (const card of deck.cards) {
                checkCard(card, supplier);
            }
        });
    });
});
