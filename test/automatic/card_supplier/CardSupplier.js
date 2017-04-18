require("jsdom-global")();
import {Deck} from "../../../src/Deck.js";
import {CardSupplier} from "../../../src/card_supplier/CardSupplier.js";

import {assert} from "chai";

const backCodePoint = 0x1F0A0;
const backUnicode = String.fromCodePoint(backCodePoint);

const checkCard = function (card, supplier) {
    let representation = supplier.createCard(card);
    assert.equal(representation.textContent, backUnicode);
    assert.isTrue(representation.hasAttribute("fill"));
    assert.equal(representation.getAttribute("fill"), card.backColor);
    card.turn();
    representation = supplier.createCard(card);
    if (card.isJoker() && card.isRed()) {
        assert.equal(representation.textContent, String.fromCodePoint(0x1F0CF));
    } else {
        assert.equal(representation.textContent, card.toUnicode());
    }
    assert.isTrue(representation.hasAttribute("fill"));
    assert.equal(representation.getAttribute("fill"), card.isRed() ? "red" : "black"); 
};

describe("CardSupplier", function () {
    describe("#createCard()", function () {

        const deck = new Deck("skyblue", true);
        const supplier = new CardSupplier();

        it("should create a SVGText node with the unicode representation in it", function () {
            for (const card of deck.cards) { 
                checkCard(card, supplier);
            }
        });
    });
});
