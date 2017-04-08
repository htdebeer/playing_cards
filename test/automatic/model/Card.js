import * as cardModel from "../../../src/model/Card.js";
import {EVENT_MODEL_CHANGE} from "../../../src/model/Model.js";
import {assert} from "chai";

const deck = {color: "red"}; // Deck is not yet implemented;

// Note. There are 58 cards in a full deck with jokers as there is also a
// knight card included per suit with the other 13 standard cards 1, 2, 3, 4,
// 5, 6, 7, 8, 9, 10, J, Q, K per suit.

const CARD_CHARS = [
    0x1F0A1, // Spades 1 - K
    0x1F0A2,
    0x1F0A3,
    0x1F0A4,
    0x1F0A5,
    0x1F0A6,
    0x1F0A7,
    0x1F0A8,
    0x1F0A9,
    0x1F0AA,
    0x1F0AB,
    0x1F0AC,
    0x1F0AD,
    0x1F0AE,
    0x1F0B1, // Hearts 1 - K
    0x1F0B2,
    0x1F0B3,
    0x1F0B4,
    0x1F0B5,
    0x1F0B6,
    0x1F0B7,
    0x1F0B8,
    0x1F0B9,
    0x1F0BA,
    0x1F0BB,
    0x1F0BC,
    0x1F0BD,
    0x1F0BE,
    0x1F0C1, // Diamonds 1 - K
    0x1F0C2,
    0x1F0C3,
    0x1F0C4,
    0x1F0C5,
    0x1F0C6,
    0x1F0C7,
    0x1F0C8,
    0x1F0C9,
    0x1F0CA,
    0x1F0CB,
    0x1F0CC,
    0x1F0CD,
    0x1F0CE,
    0x1F0D1, // Clubs 1 - K
    0x1F0D2,
    0x1F0D3,
    0x1F0D4,
    0x1F0D5,
    0x1F0D6,
    0x1F0D7,
    0x1F0D8,
    0x1F0D9,
    0x1F0DA,
    0x1F0DB,
    0x1F0DC,
    0x1F0DD,
    0x1F0DE,
    0x1F0BF, // Red joker
    0x1F0CF, // Black joker
];
const BACK_CHAR = 0x1F0A0; // The representation of the back of a card.

const codePointToCard = function (codePoint) {
    const cardChar = String.fromCodePoint(codePoint);
    return cardModel.Card.fromUnicode(cardChar, deck);
};

const CARDS = CARD_CHARS.map(codePointToCard);

const assertCountPerDeck = function (predicate, expectedCount) {
    const count = CARDS.reduce((sum, card) => {
        sum += predicate(card) ? 1 : 0;
        return sum;
    }, 0);
    it(`should return true only ${expectedCount} times when applied to each card in a deck`, function () {
        assert.equal(count, expectedCount);
    });

    const expectedFalseCount = CARDS.length - expectedCount;
    it(`should return false ${expectedFalseCount} times when applies to each card in a deck`, function () {
        assert.equal(CARDS.length - count, expectedFalseCount);
    });
};
    
const assertIsMethodForProperties = function (properties, trueCount) {
    properties.forEach(function (property) {
        const isPropertyMethodName = `is${property.slice(0,1).toUpperCase()}${property.slice(1)}`;

        describe(`#${isPropertyMethodName}()`, function () {
            assertCountPerDeck((card) => card[isPropertyMethodName](), trueCount);
        });
    });
};

const ACE_HEARTS = codePointToCard(0x1F0B1);
const ACE_CLUBS = codePointToCard(0x1F0D1);

describe("Card", function () {
    describe("#fromUnicode(char, deck)", function () {
        it("should create the correct card fiven any unicode card symbol", function () {
            for (let cardCodePoint of CARD_CHARS) {
                const cardChar = String.fromCodePoint(cardCodePoint);
                const card = cardModel.Card.fromUnicode(cardChar, deck);
                assert.equal(cardChar, card.toUnicode());
            }
        });
    });

    describe("#toUnicode()", function () {
        it("should return the correct unicode card symbol for each card", function () {
            CARDS.forEach((card, index) => 
                assert.equal(card.toUnicode(), String.fromCodePoint(CARD_CHARS[index])));
        });
    });

    describe("#equals(other)", function () {
        it("should return true when a card is compared to itself", function () {
            CARDS.forEach((card) => assert.isTrue(card.equals(card)));
        });
        it("should return false when a card is compared to a different card", function () {
            CARDS.forEach((card) => {
                if (card.equals(ACE_HEARTS)) {
                    assert.isFalse(card.equals(ACE_CLUBS));
                } else {
                    assert.isFalse(card.equals(ACE_HEARTS));
                }
            });
        });
    });
    
    assertIsMethodForProperties(["red", "black"], 29);
    assertIsMethodForProperties(["clubs", "hearts", "spades", "diamonds"], 14);
    assertIsMethodForProperties(["faceCard"], 16);
    assertIsMethodForProperties(["pipsCard"], 40);
    assertIsMethodForProperties(["jack", "knight", "queen", "king", "ace"], 4);
    assertIsMethodForProperties(["joker"], 2);
    assertIsMethodForProperties(["facingUp"], 0);
    assertIsMethodForProperties(["facingDown"], 58);

    describe("pips", function () {
        [1,2,3,4,5,6,7,8,9,10].forEach(function (pips) {
            it(`should be ${pips} for a card with ${pips} pips.`, function () {
                assertCountPerDeck((card) => card.pips === pips, 4);
            });
        });
        
        it("should be 0 for all face cards and jokers", function () {
            assertCountPerDeck((card) => card.pips === card.isFaceCard() ? 0 : -1, 22);
        });
    });

    describe("backColor", function () {
        it("should be the same as the deck's color", function () {
            assertCountPerDeck((card) => card.backColor === deck.color, 58);
        });
    });

    describe("#turn()", function () {
        const card = codePointToCard(0x1F0CA);

        it("should turn the card around", function () {

            assert.isTrue(card.isFacingDown());
            assert.isFalse(card.isFacingUp());
            assert.equal(String.fromCodePoint(BACK_CHAR), card.toString());
            
            card.turn();
            assert.isFalse(card.isFacingDown());
            assert.isTrue(card.isFacingUp());
            assert.notEqual(String.fromCodePoint(BACK_CHAR), card.toString());
            
            card.turn();
            assert.isTrue(card.isFacingDown());
            assert.isFalse(card.isFacingUp());
            
        });

        it("should emit EVENT_CARD_TURN", function () {
            let result = 0;
            card.on(cardModel.EVENT_CARD_TURN, function () {
                result = 1;
            });
            assert.equal(result, 0);
            card.turn();
            assert.equal(result, 1);
        });

        it("should emit EVENT_MODEL_CHANGE", function () {
            let result = 0;
            card.on(EVENT_MODEL_CHANGE, function () {
                result = 2;
            });
            assert.equal(result, 0);
            card.turn();
            assert.equal(result, 2);
        });
    });

    describe("#toString()", function () {
        CARDS.forEach((card) => {if (card.isFacingUp()) {card.turn();}});
        it("should return the back card if a card is facing down", function () {
            assertCountPerDeck((card) => card.toString() === String.fromCodePoint(BACK_CHAR), 58);
        });
        CARDS.forEach((card) => {if (card.isFacingDown()) {card.turn();}});
        it("should return the unicode representation of the card if a card is facing up", function () {
            assertCountPerDeck((card) => card.toString() === card.toUnicode(), 58);
        });
        CARDS.forEach((card) => {if (card.isFacingUp()) {card.turn();}});
    });


});
