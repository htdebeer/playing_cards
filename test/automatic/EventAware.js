import EventAware from "../../src/EventAware.js";
import {assert} from "chai";

const EVENT_ONE = Symbol("event:one");
const EVENT_TWO = Symbol("event:two");
const eventHandler = function () {};

describe("EventAware", function () {
    describe("#new()", function () {
        it("should throw an error when trying to install an event handler for a non-registered event", function () {
            assert.throw(function (){
                const eventAware = new EventAware();
                eventAware.on(EVENT_ONE, eventHandler);
            }, 
            Error);
        });
        it("should not throw an error when trying to install an event handler for registered events", function () {
            assert.doesNotThrow(
                    () => {
                        const eventAware = new EventAware([EVENT_ONE, EVENT_TWO]);
                        eventAware.on(EVENT_ONE, eventHandler);
                        eventAware.on(EVENT_TWO, eventHandler);
                    },
                    Error, /The EventAware object/);
        });
    });


    describe("#on(EVENT, eventHandler)", function () {
        it("should throw an error when trying to install an event handler for an event this EventAware object does not emit", function () {
            const eventAware = new EventAware([EVENT_ONE]);
            assert.throws(() => eventAware.on(EVENT_TWO, eventHandler), Error, /The EventAware object/);
        });
    });

    describe("#off(EVENT, [eventHandler])", function () {
        it("should throw an error when trying to uninstall an event handler for an event this EventAware object does not emit", function () {
            const eventAware = new EventAware([EVENT_ONE]);
            assert.throws(() => eventAware.off(EVENT_TWO, eventHandler), Error, /The EventAware object/);
        });

        it("should remove all event handlers for event 'EVENT'", function () {
            const eventAware = new EventAware([EVENT_ONE]);
            let result1 = 0;
            eventAware.on(EVENT_ONE, function (n) {
                result1 = n;
            });
            let result2 = 0;
            eventAware.on(EVENT_ONE, function (n) {
                result2 = n;
            });
            eventAware.off(EVENT_ONE);
            eventAware.emit(EVENT_ONE, 1);
            assert.equal(result1, 0);
            assert.equal(result2, 0);
        });

        it("should throw an error when trying to uninstall an event handler for an event this EventAware object does not emit", function () {
            const eventAware = new EventAware([EVENT_ONE]);
            assert.throws(() => eventAware.off(EVENT_TWO, eventHandler), Error, /The EventAware object/);
        });
    });


    describe("#emit(EVENT, parameters)", function () {
        it("should emit event 'EVENT' and call handler with no arguments", function () {
            const eventAware = new EventAware([EVENT_ONE]);
            let result = 0;
            eventAware.off(EVENT_ONE);
            eventAware.on(EVENT_ONE, function () {
            });
            eventAware.emit(EVENT_ONE);
            assert.equal(result, 0);
        });

        it("should emit event 'EVENT' and call handler with one argument", function () {
            const eventAware = new EventAware([EVENT_ONE]);
            let result = 0;
            eventAware.off(EVENT_ONE);
            eventAware.on(EVENT_ONE, function (n) {
                result = n;
            });
            eventAware.emit(EVENT_ONE, 1);
            assert.equal(result, 1);
        });

        it("should emit event 'EVENT' and call handler with multiple arguments", function () {
            const eventAware = new EventAware([EVENT_ONE]);
            let result = 0;
            eventAware.off(EVENT_ONE);
            eventAware.on(EVENT_ONE, function (n, m, o) {
                result = n + m + o;
            });
            eventAware.emit(EVENT_ONE, 1, 3, 5);
            assert.equal(result, 9);
        });
    });
});
