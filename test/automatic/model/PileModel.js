import {
    PileModel, 
    TAUTOLOGY, 
    PileInvariantError, 
    PileIndexOutOfBoundsError
} from "../../../src/model/PileModel.js";
import {Deck} from "../../../src/Deck.js";

import {EVENT_MODEL_CHANGE} from "../../../src/model/Model.js";
import {assert} from "chai";


describe("Pile", function () {
    describe("constructor", function () {
        it("should create an empty pile", function () {
            const pile = new PileModel();
            assert.isTrue(pile.isEmpty());
            assert.equal(pile.count, 0);
            assert.equal(pile.invariant, TAUTOLOGY);
        });

        it("should create an empty pile with an invariant", function () {
            const inv = function (pile) {return pile.length < 60;};
            const pile = new PileModel(inv);
            assert.isTrue(pile.isEmpty());
            assert.equal(pile.count, 0);
            assert.equal(pile.invariant, inv);
        });

        it("should throw PileInvariantError when invariant is not valid", function () {
            const inv = function () {return false;};
            assert.throws(function () {
                new PileModel(inv);
            }, PileInvariantError);

        });

        it("should create a new pile from a deck", function () {
            const deck = new Deck("red");
            const pile = new PileModel(TAUTOLOGY, deck);
            assert.isFalse(pile.isEmpty());
            assert.equal(pile.count, deck.cards.length);
        });
    });

    describe("#each()", function () {
        const deck = new Deck("navy");
        const pile = new PileModel(TAUTOLOGY, deck);

        it("should create an iterator over all cards", function () {
            let i = 0;
            for (const card of pile.each()) {
                assert.isTrue(card.equals(pile.cards[i]));
                i++;
            }
            assert.equal(i, pile.count);
        });
    });

    describe("#add(card)", function () {
        const deck = new Deck("navy");
        const pile = new PileModel();
        it("should add a card to a pile", function () {
            pile.add(deck.cards.pop());
            assert.isFalse(pile.isEmpty());
            assert.equal(pile.count, 1);

            const top = pile.inspect();
            pile.add(deck.cards.pop());
            assert.equal(pile.count, 2);
            assert.notEqual(pile.inspect(), top);
        });

        it("should emit EVENT_MODEL_CHANGE", function () {
            let result = 0;
            pile.on(EVENT_MODEL_CHANGE, function (p) {
                result = p.count;
            });

            pile.add(deck.cards.pop());
            assert.equal(pile.count, 3);
            assert.equal(result, 3);
        });
        
        it("should throw PileInvariantError when invariant is not valid", function () {
            const inv = function (pile) {return pile.length < 1;};
            const pile = new PileModel(inv);
            assert.throws(function () {
                pile.add(deck.cards.pop());
            }, PileInvariantError);

        });
    });


    describe("#insert(card, index)", function () {
        const deck = new Deck("navy");
        const pile = new PileModel();

        it("should insert a card in the pile at index", function () {
            pile.insert(deck.cards.pop(), 0);
            assert.equal(pile.count, 1);
            const top = pile.inspect();
            pile.insert(deck.cards.pop(), 1);
            assert.equal(pile.count, 2);
            assert.notEqual(pile.inspect(), top);
        });

        it("should emit EVENT_MODEL_CHANGE", function () {
            let result = 0;
            pile.on(EVENT_MODEL_CHANGE, function (p) {
                result = p.count;
            });

            pile.insert(deck.cards.pop(), 0);
            assert.equal(pile.count, 3);
            assert.equal(result, 3);
        });

        it("should throw an index out of bounds error", function () {
            assert.throws(function () {
                pile.insert(deck.cards.pop(), 100);
            }, PileIndexOutOfBoundsError);
            assert.throws(function () {
                pile.insert(deck.cards.pop(), -9);
            }, PileIndexOutOfBoundsError);
        });
        
        it("should throw PileInvariantError when invariant is not valid", function () {
            const inv = function (pile) {return pile.length < 1;};
            const pile = new PileModel(inv);
            assert.throws(function () {
                pile.insert(deck.cards.pop(), 0);
            }, PileInvariantError);

        });
    });

    describe("#inspect()", function () {
        const deck = new Deck("navy");
        let pile = new PileModel();

        it("should return undefined when trying to inspect a card in an empty pile", function () {
            assert.isTrue(pile.isEmpty());
            assert.equal(pile.inspect(), undefined);
            assert.equal(pile.inspect(19), undefined);
        });
        
        it("should return undefined when trying to inspect a card on an index that is out of bounds", function () {
            pile = new PileModel(TAUTOLOGY, deck);
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
        const pile = new PileModel();

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
        const pile1 = new PileModel();
        const pile2 = new PileModel();
            

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

        it("should emit EVENT_MODEL_CHANGE", function () {
            const currentCount = pile1.count;
            let result = 0;
            pile1.on(EVENT_MODEL_CHANGE, function (p) {
                result = p.count;
            });
            
            pile2.add(deck.cards.pop());
            pile2.add(deck.cards.pop());

            pile1.merge(pile2);

            assert.equal(result, currentCount + 2);
        });

        it("should throw PileInvariantError when invariant is not valid", function () {
            const inv = function (pile) {return pile.length < 1;};
            const pile = new PileModel(inv);
            assert.throws(function () {
                pile.merge(pile1);
            }, PileInvariantError);
        });

    });
    
    describe("#pick()", function () {
        const deck = new Deck("navy");
        const pile = new PileModel(TAUTOLOGY, deck);

        it("should pick a card from the pile", function () {
            const numberOfCards = pile.count;
            const card = pile.pick();
            assert.equal(pile.count + 1, numberOfCards);
            assert.equal(pile.cards.filter((c) => c.equals(card)).length, 0);
        });

        it("should emit EVENT_MODEL_CHANGE", function () {
            const currentCount = pile.count;
            let result = 0;
            pile.on(EVENT_MODEL_CHANGE, function () {
                result = 1;
            });
            
            pile.pick();

            assert.equal(result, 1);
            assert.equal(pile.count + 1, currentCount);
        });

        it("should throw PileInvariantError when invariant is not valid", function () {
            const inv = function (p) {return p.length < pile.count ;};
            const pile2 = new PileModel(inv);
            assert.throws(function () {
                pile2.pick();
            }, PileInvariantError);
        });
    });
    
    describe("#shuffle()", function () {
        const deck = new Deck("navy");
        const pile = new PileModel(TAUTOLOGY, deck);

        const deck2 = new Deck("maroon");
        const pile2 = new PileModel(TAUTOLOGY, deck2);

        const pileToString = function (pile) {
            return pile.cards.map((c) => c.toUnicode()).join(" ");
        };

        it("should reorder the cards randomly", function () {
            // Note, it is possible that the shuffle method returns the same
            // order as before, albeit a small chance.
            pile2.shuffle();
            assert.notEqual(pileToString(pile), pileToString(pile2));
        });

        it("should emit EVENT_MODEL_CHANGE", function () {
            let result = 0;
            pile.on(EVENT_MODEL_CHANGE, function () {
                result = 1;
            });
            
            pile.shuffle();

            assert.equal(result, 1);
        });

        it("should throw PileInvariantError when invariant is not valid", function () {
            // Theoretically, all three piles could have the same order,
            // albeit unlikely.
            const inv = function (p) {return p.every((card, index) => pile2.inspect(index) === card);};
            const pile3 = new PileModel(inv, pile2.cards);
            assert.throws(function () {
                pile3.shuffle();
            }, PileInvariantError);
        });
    });
    
    describe("#take()", function () {
        const deck = new Deck("navy");
        const pile = new PileModel(TAUTOLOGY, deck);

        it("should take the top card from the pile", function () {
            const numberOfCards = pile.count;
            const card = pile.take();
            assert.equal(pile.count + 1, numberOfCards);
            assert.equal(pile.cards.filter((c) => c.equals(card)).length, 0);
        });
        
        it("should take a card from the pile", function () {
            const theCard = pile.cards[5];
            const numberOfCards = pile.count;
            const card = pile.take(5);
            assert.equal(pile.count + 1, numberOfCards);
            assert.equal(pile.cards.filter((c) => c.equals(card)).length, 0);
            assert.equal(card, theCard);            
        });

        it("should emit EVENT_MODEL_CHANGE", function () {
            const currentCount = pile.count;
            let result = 0;
            pile.on(EVENT_MODEL_CHANGE, function () {
                result = 1;
            });
            
            pile.take(3);

            assert.equal(result, 1);
            assert.equal(pile.count + 1, currentCount);
        });

        it("should throw PileInvariantError when invariant is not valid", function () {
            const inv = function (p) {return p.length < pile.count ;};
            const pile2 = new PileModel(inv);
            assert.throws(function () {
                pile2.take();
            }, PileInvariantError);
        });
    });
});
