require("jsdom-global")();
import {Deck} from "../../../src/Deck.js";
import {SVGCardsCardRenderEngine} from "../../../src/card_render_engine/SVGCardsCardRenderEngine.js";

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


describe("SVGCardsCardRenderEngine", function () {
    const deck = new Deck("skyblue", true);
    const supplier = new SVGCardsCardRenderEngine();

    describe("#createCard(card)", function () {
        it("should create a USE element pointing to the card to show in the svg-cards.svg file", function () {
            for (const card of deck.cards) {
                checkCard(card, supplier);
            }
        });
    });
    
    describe("#createBase()", function () {
        it("should create a transparent base card", function () {
            const base = supplier.createBase();
            assert.isTrue(base.getAttribute("xlink:href").startsWith("/svg-cards.svg"));
            assert.isTrue(base.getAttribute("xlink:href").endsWith("card-base"));
            assert.isTrue(base.hasAttribute("fill"));
            assert.equal(base.getAttribute("fill"), "silver");
            assert.isTrue(base.hasAttribute("fill-opacity"));
            assert.equal(base.getAttribute("fill-opacity"), 0.2);
            assert.isTrue(base.hasAttribute("stroke-opacity"));
            assert.equal(base.getAttribute("stroke-opacity"), 0.2);
        });
    });

    describe("#createSuit()", function () {
        it("should create a SVG representation for each of the four suits with the correct color", function () {
            for (const suit of ["club", "spade", "heart", "diamond"]) {
                const suitElt = supplier.createSuit(suit);
                assert.isTrue(suitElt.getAttribute("xlink:href").startsWith("/svg-cards.svg"));
                assert.isTrue(suitElt.getAttribute("xlink:href").endsWith(`suit-${suit}`));
            }
        });
    });
});
