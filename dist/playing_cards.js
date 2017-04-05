/*
 * Copyright 2017 Huub de Beer <huub@heerdebeer.org>
 *
 * This file is part of playing_cards.
 *
 * playing_cards is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the Free
 * Software Foundation, either version 3 of the License, or (at your option)
 * any later version.
 *
 * playing_cards is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with playing_cards.  If not, see <http://www.gnu.org/licenses/>.
 * 
 */

/**
 * @module
 */

const initializeEventHandlers = function (events = []) {
    return events.reduce((handlers, event) => {
        handlers[event] = [];
        return handlers;
    }, {});
};

/**
 * EventAware base class for an event handling system. EventAware object can
 * emit events. For each emittable event an event handler can be installed or
 * uninstalled.
 */
class EventAware {

    /**
     * Create an EventAware object.
     *
     * @param {symbol} [emitableEvents = []] - the list of events this object can emit.
     */
    constructor(emitableEvents = []) {
        this.eventHandlers = initializeEventHandlers(emitableEvents);
    }

    /**
     * @callback eventHandler
     *
     * @param {...*} parameters - an eventHandler can have zero (0) or more
     * parameters of any kind.
     */

    /**
     * Install an event handler.
     *
     * @param {symbol} event - the event to listen for.
     * @param {eventHandler} eventHandler - the event handler to install; when this EventAware
     * object emits the event this event handler will be executed.
     *
     * @throws Error
     */
    on(event, eventHandler) {
        if (this.eventHandlers[event]) {
            this.eventHandlers[event].push(eventHandler);
        } else {
            throw new Error(`The EventAware object '${this}' does not emit event '${event}'.`);
        }
    }

    /**
     * Remove an event handler.
     *
     * @param {symbol} event - the event to stop listen for.
     * @param {eventHandler} eventHandler - the event handler to uninstall; when this
     * EventAware object emits the event this event handler will not be
     * executed anymore.
     */
    off(event, eventHandler) {
        const index = this.eventHandlers[event].indexOf(eventHandler);

        if (0 <= index) {
            this.eventHandlers[event].splice(index, 1);
        }
    }

    /**
     * Emit an event.
     *
     * @param {symbol} event - the event to emit by this EventAware object.
     * @param {...*} parameters - a list of parameters to call an bound action
     * with.
     */
    emit(event, ...parameters) {
        const handleEvent = function () {
            return function (eventHandler) {
                eventHandler.apply(this, parameters);
            };
        };

        this.eventHandlers[event].forEach(handleEvent());
    }
}

window.EventAware = EventAware;
