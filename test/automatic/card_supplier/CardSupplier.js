require("jsdom-global")();
import {Card} from "../../../src/model/Card.js";
import {CardSupplier} from "../../../src/card_supplier/CardSupplier.js";

import {assert} from "chai";

const codePoint = 0x1F0D5;
const backCodePoint = 0x1F0A0;
const unicode = String.fromCodePoint(codePoint);
const backUnicode = String.fromCodePoint(backCodePoint);
const card = Card.fromUnicode(unicode);


describe("CardSupplier", function () {
    describe("#createCard(card)", function () {

        it("should create a SVGText node with the unicode representation in it", function () {
            const supplier = new CardSupplier();
            let representation = supplier.createCard(card);
            assert.equal(representation.textContent, backUnicode);
            card.turn();
            representation = supplier.createCard(card);
            assert.equal(representation.textContent, unicode);
        });
    });
});
