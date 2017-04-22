require("jsdom-global")();
import {Deck} from "../../src/Deck.js";
import {CARD_SUPPLIER} from "../../src/CardSupplier.js";
import {UnicodeCardRenderEngine} from "../../src/card_render_engine/UnicodeCardRenderEngine.js";
import {SVGCardsCardRenderEngine} from "../../src/card_render_engine/SVGCardsCardRenderEngine.js";

import {assert} from "chai";

const BACK = 0x1F0A0;
const JOKER = 0x1F0CF;

const backUnicode = String.fromCodePoint(BACK);

const checkCard = function (card) {
    let representation = CARD_SUPPLIER.createCard(card);
    assert.equal(representation.textContent, backUnicode);
    assert.isTrue(representation.hasAttribute("fill"));
    assert.equal(representation.getAttribute("fill"), card.backColor);
    card.turn();
    representation = CARD_SUPPLIER.createCard(card);
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

    describe("#engine", function () {
        it("should initially be a unicode render engine", function () {
            assert.instanceOf(CARD_SUPPLIER.engine, UnicodeCardRenderEngine);
        });
    });

    describe("#engine = ", function () {
        it("should change the render engine", function () {
            assert.instanceOf(CARD_SUPPLIER.engine, UnicodeCardRenderEngine);
            CARD_SUPPLIER.engine = new SVGCardsCardRenderEngine();
            assert.instanceOf(CARD_SUPPLIER.engine, SVGCardsCardRenderEngine);
        });
    });
            

    describe("#createCard()", function () {
        it("should create a SVGText node with the unicode representation in it", function () {
            CARD_SUPPLIER.engine = new UnicodeCardRenderEngine();
            for (const card of deck.cards) { 
                checkCard(card);
            }
        });
    });

    describe("#createBase()", function () {
        it("should create a transparent base card", function () {
            CARD_SUPPLIER.engine = new UnicodeCardRenderEngine();
            const base = CARD_SUPPLIER.createBase();
            assert.equal(base.textContent, String.fromCodePoint(BACK));
            assert.isTrue(base.hasAttribute("fill"));
            assert.equal(base.getAttribute("fill"), "silver");
            assert.isTrue(base.hasAttribute("fill-opacity"));
            assert.equal(base.getAttribute("fill-opacity"), 0.2);
        });
    });

    describe("#createSuit()", function () {
        it("should create a SVG representation for each of the four suits with the correct color", function () {
            CARD_SUPPLIER.engine = new UnicodeCardRenderEngine();
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
                const suitElt = CARD_SUPPLIER.createSuit(suit);
                assert.equal(suitElt.textContent, String.fromCodePoint(SUITS[suit].codePoint));
                assert.isTrue(suitElt.hasAttribute("fill"));
                assert.equal(suitElt.getAttribute("fill"), SUITS[suit].color);
            }
        });
    });
});
