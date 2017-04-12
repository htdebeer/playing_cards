require("jsdom-global")();
import {Card} from "../../../src/model/Card.js";
import {CardSupplier} from "../../../src/card_supplier/CardSupplier.js";

import {assert} from "chai";

const deck = {color: "purple"};
const makeCard = function (codePoint) {
    return Card.fromUnicode(String.fromCodePoint(codePoint), deck);
};

const ACE_OF_SPADES = makeCard(0x1F0A1);
const THREE_OF_DIAMONDS = makeCard(0x1F0C3);

const backCodePoint = 0x1F0A0;
const backUnicode = String.fromCodePoint(backCodePoint);

const checkCard = function (card, supplier) {
    let representation = supplier.createCard(card);
    assert.equal(representation.textContent, backUnicode);
    assert.isTrue(representation.hasAttribute("stroke"));
    assert.equal(representation.getAttribute("stroke"), card.backColor);
    card.turn();
    representation = supplier.createCard(card);
    assert.equal(representation.textContent, card.toUnicode());
    assert.isTrue(representation.hasAttribute("stroke"));
    assert.equal(representation.getAttribute("stroke"), card.isRed() ? "red" : "black"); 
};


describe("CardSupplier", function () {
    describe("#createCard(card)", function () {

        it("should create a SVGText node with the unicode representation in it", function () {
            const supplier = new CardSupplier();
            checkCard(ACE_OF_SPADES, supplier);
            checkCard(THREE_OF_DIAMONDS, supplier);
        });
    });
});
