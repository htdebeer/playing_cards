import {Pile} from "../../../src/model/Pile.js";
import {Deck} from "../../../src/Deck.js";

import {EVENT_MODEL_CHANGE} from "../../../src/model/Model.js";
import {assert} from "chai";


describe("Pile", function () {
    describe("constructor", function () {
        it("should create an empty pile", function () {
            const pile = new Pile();
            assert.isTrue(pile.isEmpty());
            assert.equal(pile.count, 0);
        });
    });

    describe("#add(card)", function () {
        const deck = new Deck("navy");
        const pile = new Pile();
        it("should add a card to a pile", function () {
            pile.add(deck.cards.pop());
            assert.isFalse(pile.isEmpty());
            assert.equal(pile.count, 1);

            const top = pile.inspect();
            pile.add(deck.cards.pop());
            assert.equal(pile.count, 2);
            assert.notEqual(pile.inspect(), top);
        });

        it("should insert a card in the pile", function () {
            const top = pile.inspect();
            pile.add(deck.cards.pop(), 0);
            assert.equal(pile.count, 3);
            assert.equal(pile.inspect(), top);
            pile.add(deck.cards.pop(), 3);
            assert.equal(pile.count, 4);
            assert.notEqual(pile.inspect(), top);
        });

        it("should emit EVENT_MODEL_CHANGE", function () {
            let result = 0;
            pile.on(EVENT_MODEL_CHANGE, function (p) {
                result = p.count;
            });

            pile.add(deck.cards.pop(), 0);
            assert.equal(pile.count, 5);
            assert.equal(result, 5);
        });

        it("should throw an index out of bounds error", function () {
            assert.throws(function () {
                pile.add(deck.cards.pop(), 100);
            });
            assert.throws(function () {
                pile.add(deck.cards.pop(), -9);
            });
        });
    });

    describe("#inspect()", function () {
        const deck = new Deck("navy");
        const pile = new Pile();

        it("should return undefined when trying to inspect a card in an empty pile", function () {
            assert.isTrue(pile.isEmpty());
            assert.equal(pile.inspect(), undefined);
            assert.equal(pile.inspect(19), undefined);
        });
        
        it("should return undefined when trying to inspect a card on an index that is out of bounds", function () {
            deck.addToPile(pile);
            assert.isFalse(pile.isEmpty());
            assert.equal(pile.inspect(100), undefined);
        });

        it("should return the card on index without changing the pile", function () {
            const count = pile.count;
            const card = pile.inspect(12);
            assert.isTrue(card.isKing() && card.isSpades());
            assert.equal(pile.count, count);
        });

        it("should return the card on top when no index is supplied", function () {
            const card = pile.inspect();
            assert.equal(pile.take(), card);
        });
    });

    describe("#isEmpty()", function () {
        const deck = new Deck("navy");
        const pile = new Pile();

        it("should return true when a pile has no cards", function () {
            assert.isTrue(pile.isEmpty());
            pile.add(deck.cards.pop());
            pile.take();
            assert.isTrue(pile.isEmpty());
        });

        it("should return false when a pile has cards", function () {
            assert.isTrue(pile.isEmpty());
            pile.add(deck.cards.pop());
            assert.isFalse(pile.isEmpty());
        });
    });

    describe("#merge()", function () {
        const deck = new Deck("navy");
        const pile1 = new Pile();
        const pile2 = new Pile();

        it("should merge two empty piles resulting in two empty piles", function () {
            assert.isTrue(pile1.isEmpty());
            assert.isTrue(pile2.isEmpty());
            pile1.merge(pile2);
            assert.isTrue(pile1.isEmpty());
            assert.isTrue(pile2.isEmpty());
        });

        it("should merge one pile with cards with another with cards into one containing all the cards, and the other is empty", function () {
            pile1.add(deck.cards.pop());
            pile1.add(deck.cards.pop());
            pile1.add(deck.cards.pop());

            pile2.add(deck.cards.pop());
            pile2.add(deck.cards.pop());

            assert.isFalse(pile1.isEmpty());
            assert.isFalse(pile2.isEmpty());
            const pile1Count = pile1.count;
            const pile2Count = pile2.count;

            pile1.merge(pile2);

            assert.isFalse(pile1.isEmpty());
            assert.isTrue(pile2.isEmpty());
            assert.equal(pile1.count, pile1Count + pile2Count);
        });

        it("should merge one pile with cards with another, keeping the order in both, placing the other cards after the first one's", function () {

            pile2.add(deck.cards.pop());
            pile2.add(deck.cards.pop());

            assert.isFalse(pile1.isEmpty());
            assert.isFalse(pile2.isEmpty());
            const pile1Count = pile1.count;
            const pile2Count = pile2.count;
            const pile1Cards = pile1.cards;
            const pile2Cards = pile2.cards.slice(); // copy

            pile1.merge(pile2);

            assert.isFalse(pile1.isEmpty());
            assert.isTrue(pile2.isEmpty());

            let i = 0;
            while (i < pile1Count) {
                assert.equal(pile1.inspect(i), pile1Cards[i]);
                i++;
            }
            while (i < pile1Count + pile2Count) {
                assert.equal(pile1.inspect(i), pile2Cards[i - pile1Count]);
                i++;
            }
            assert(i, pile1.count);
        });
    });
});
