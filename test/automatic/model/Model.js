import {EVENT_MODEL_CHANGE, Model} from "../../../src/model/Model.js";
import {assert} from "chai";

const OTHER_EVENT = Symbol("event:other");

describe("Model", function () {
    describe("#emit(OTHER_EVENT)", function () {
        const model = new Model([OTHER_EVENT]);
        let other = -1;
        model.on(OTHER_EVENT, function (n) {
            other = -1 * n;
        });
            
        let change = -1;
        model.on(EVENT_MODEL_CHANGE, function (model, originalEvent, originalParameters) {
            change = originalParameters[0];
        });
            
        model.emit(OTHER_EVENT, 5);

        it("should emit OTHER_EVENT", function () {
            assert.equal(other, -5);
        });

        it("should also emit EVENT_MODEL_CHANGE", function () {
            assert.equal(change, 5);
        });
    });
});
