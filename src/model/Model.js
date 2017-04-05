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
import EventAware from "../EventAware.js";

/**
 * General event to denote that a model has been changed;
 */
const EVENT_MODEL_CHANGE = Symbol("event:model:change");

/**
 * Model is the base class for all models for concepts in the domain of
 * playing cards, such as cards, piles, decks, and the game.
 *
 * @extends EventAware
 */
class Model extends EventAware {

    /**
     * Construct a new Model.
     *
     * @param {symbol[]} [emitableEvents = []] - the list of events this object can emit.
     */
    constructor(emitableEvents = []) {
        if (!emitableEvents.includes(EVENT_MODEL_CHANGE)) {
            emitableEvents.push(EVENT_MODEL_CHANGE);
        }
        super(emitableEvents);
    }

    /** 
     * Emit an event. This method overrides the EventAware's emit method to
     * emit the EVENT_MODEL_CHANGE event whenever any other event is emitted
     * to signal to all subscribers that the model has been changed.
     *
     * In case of an EVENT_MODEL_CHANGE event, this model, the original event,
     * and the original parameters are passed as parameters to any installed
     * listener to EVENT_MODEL_CHANGE.
     *
     * @param {symbol} event - the event to emit by this EventAware object.
     * @param {...*} parameters - a list of parameters that are applied to the
     * installed event handlers as parameters.
     */
    emit(event, ...parameters) { 
        super.emit(event, ...parameters);

        if (EVENT_MODEL_CHANGE !== event) {
            const originalEvent = event;
            const originalParameters = parameters;
            this.emit(EVENT_MODEL_CHANGE, this, originalEvent, originalParameters);
        }
    }
}

export {EVENT_MODEL_CHANGE, Model};
