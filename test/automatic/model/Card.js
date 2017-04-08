import * as cardModel from "../../../src/model/Card.js";
import {assert} from "chai";

const deck = null; // Deck is not yet implemented;

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

const ACE_HEARTS = codePointToCard(0x1F0B1);
const KING_SPADES = codePointToCard(0x1F0AE);
const ACE_CLUBS = codePointToCard(0x1F0D1);
const TEN_DIAMONDS = codePointToCard(0x1F0CA);

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

    describe("isAce()", function () {
        it("should return true for an ace of hearts", function () {
            assert.isTrue(ACE_HEARTS.isAce());
        });
        it("should return false for a ten of diamonds", function () {
            assert.isFalse(TEN_DIAMONDS.isAce());
        });

        assertCountPerDeck((card) => card.isAce(), 4);
    });

});
