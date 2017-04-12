require("jsdom-global")();
import {Card} from "../../../src/model/Card.js";
import {SVGCardsCardSupplier} from "../../../src/card_supplier/SVGCardsCardSupplier.js";

import {assert} from "chai";

const deck = {color: "purple"};
const makeCard = function (codePoint) {
    return Card.fromUnicode(String.fromCodePoint(codePoint), deck);
};

const ACE_OF_SPADES = makeCard(0x1F0A1);
const THREE_OF_DIAMONDS = makeCard(0x1F0C3);

const checkCard = function (card, name, supplier) {
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

        it("should create a USE element pointing to the card to show in the svg-cards.svg file", function () {
            const supplier = new SVGCardsCardSupplier();
            checkCard(ACE_OF_SPADES, "1_spade", supplier);
            checkCard(THREE_OF_DIAMONDS, "3_diamond", supplier);
        });
    });
});
