import EventAware from "../../src/EventAware.js";
import {assert} from "chai";

const EVENT_ONE = Symbol("event:one");
const EVENT_TWO = Symbol("event:two");
const eventHandler = function () {};

const numberOfEvents = function (obj) {
    return Object.getOwnPropertySymbols(obj).length;
};

describe("EventAware", function () {
    describe("#new()", function () {
        it("should create an EventAware object with no event handler lists when no emitable events are supplied", function () {
            const eventAware = new EventAware();
            assert.equal(numberOfEvents(eventAware.eventHandlers), 0);
        });
        it("should create an EventAware object with two event handler lists when two emitable events are supplied", function () {
            const eventAware = new EventAware([EVENT_ONE, EVENT_TWO]);
            assert.equal(numberOfEvents(eventAware.eventHandlers), 2);
        });
    });

    const eventAware = new EventAware([EVENT_ONE]);

    describe("#on(EVENT, eventHandler)", function () {
        it("should add event handler 'eventHandler' for event 'EVENT'", function () {
            eventAware.on(EVENT_ONE, eventHandler);
            assert.equal(numberOfEvents(eventAware.eventHandlers), 1);
            assert.equal(eventAware.eventHandlers[EVENT_ONE][0], eventHandler);
            assert.equal(eventAware.eventHandlers[EVENT_ONE].length, 1);
        });

        it("should throw an error when trying to install an event handler for an event this EventAware object does not emit", function () {
            assert.throws(() => eventAware.on(EVENT_TWO, eventHandler), Error, /The EventAware object/);
            assert.equal(numberOfEvents(eventAware.eventHandlers), 1);
        });
    });

    describe("#off(EVENT, [eventHandler])", function () {
        it("should remove event handler 'eventHandler' for event 'EVENT'", function () {
            eventAware.off(EVENT_ONE, eventHandler);
            assert.equal(numberOfEvents(eventAware.eventHandlers), 1);
            assert.equal(eventAware.eventHandlers[EVENT_ONE].length, 0);
        });
        
        it("should throw an error when trying to uninstall an event handler for an event this EventAware object does not emit", function () {
            assert.throws(() => eventAware.off(EVENT_TWO, eventHandler), Error, /The EventAware object/);
            assert.equal(numberOfEvents(eventAware.eventHandlers), 1);
        });
        
        it("should remove all event handlers for event 'EVENT'", function () {
            eventAware.on(EVENT_ONE, eventHandler);
            eventAware.on(EVENT_ONE, eventHandler);
            assert.equal(eventAware.eventHandlers[EVENT_ONE].length, 2);
            eventAware.off(EVENT_ONE);
            assert.equal(numberOfEvents(eventAware.eventHandlers), 1);
            assert.equal(eventAware.eventHandlers[EVENT_ONE].length, 0);
        });
        
        it("should throw an error when trying to uninstall an event handler for an event this EventAware object does not emit", function () {
            assert.throws(() => eventAware.off(EVENT_TWO, eventHandler), Error, /The EventAware object/);
            assert.equal(numberOfEvents(eventAware.eventHandlers), 1);
        });
    });


    describe("#emit(EVENT, parameters)", function () {
        it("should emit event 'EVENT' and call handler with no arguments", function () {
            let result = 0;
            eventAware.off(EVENT_ONE);
            eventAware.on(EVENT_ONE, function () {
            });
            eventAware.emit(EVENT_ONE);
            assert.equal(result, 0);
        });
        
        it("should emit event 'EVENT' and call handler with one argument", function () {
            let result = 0;
            eventAware.off(EVENT_ONE);
            eventAware.on(EVENT_ONE, function (n) {
                result = n;
            });
            eventAware.emit(EVENT_ONE, 1);
            assert.equal(result, 1);
        });
        
        it("should emit event 'EVENT' and call handler with multiple arguments", function () {
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
