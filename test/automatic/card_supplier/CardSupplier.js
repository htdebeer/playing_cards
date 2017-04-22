require("jsdom-global")();
import {Deck} from "../../../src/Deck.js";
import {CardSupplier} from "../../../src/card_supplier/CardSupplier.js";

import {assert} from "chai";

const BACK = 0x1F0A0;
const JOKER = 0x1F0CF;

const backUnicode = String.fromCodePoint(BACK);

const checkCard = function (card, supplier) {
    let representation = supplier.createCard(card);
    assert.equal(representation.textContent, backUnicode);
    assert.isTrue(representation.hasAttribute("fill"));
    assert.equal(representation.getAttribute("fill"), card.backColor);
    card.turn();
    representation = supplier.createCard(card);
    if (card.isJoker() && card.isRed()) {
        assert.equal(representation.textContent, String.fromCodePoint(JOKER));
    } else {
        assert.equal(representation.textContent, card.toUnicode());
    }
    assert.isTrue(representation.hasAttribute("fill"));
    assert.equal(representation.getAttribute("fill"), card.isRed() ? "red" : "black"); 
};

describe("CardSupplier", function () {
    const deck = new Deck("skyblue", true);
    const supplier = new CardSupplier();
    
    describe("#createCard()", function () {
        it("should create a SVGText node with the unicode representation in it", function () {
            for (const card of deck.cards) { 
                checkCard(card, supplier);
            }
        });
    });

    describe("#createBase()", function () {
        it("should create a transparent base card", function () {
            const base = supplier.createBase();
            assert.equal(base.textContent, String.fromCodePoint(BACK));
            assert.isTrue(base.hasAttribute("fill"));
            assert.equal(base.getAttribute("fill"), "silver");
            assert.isTrue(base.hasAttribute("fill-opacity"));
            assert.equal(base.getAttribute("fill-opacity"), 0.2);
        });
    });

    describe("#createSuit()", function () {
        it("should create a SVG representation for each of the four suits with the correct color", function () {
            const SUITS = {
                "club": {
                    codePoint: 0x2663,
                    color: "black"
                },
                "spade": {
                    codePoint: 0x2660,
                    color: "black"
                },
                "heart": {
                    codePoint: 0x2665,
                    color: "red"
                },
                "diamond": {
                    codePoint: 0x2666,
                    color: "red"
                }
            };

            for (const suit of Object.keys(SUITS)) {
                const suitElt = supplier.createSuit(suit);
                assert.equal(suitElt.textContent, String.fromCodePoint(SUITS[suit].codePoint));
                assert.isTrue(suitElt.hasAttribute("fill"));
                assert.equal(suitElt.getAttribute("fill"), SUITS[suit].color);
            }
        });
    });
});
