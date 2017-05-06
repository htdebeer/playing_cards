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

import {Layout} from "./layout/Layout.js";
import {Pile} from "./pile/Pile.js";
import {Deck} from "./Deck.js";
import {Action} from "./action/Action.js";

/**
 * @module
 */

const _layout = new WeakMap();
const _piles = new WeakMap();
const _decks = new WeakMap();
const _actions = new WeakMap();
const _labels = new WeakMap();

/**
 * Game 
 */
class Game {
    /**
     * Create a new game.
     *
     * @param {object} [specification = {}] - the initial specification of
     * this game.
     */
    constructor(specification = {}) {
        // Handle specification

        _layout.set(this, specification.layout || new Layout());
        _piles.set(this, specification.piles || {});
        _decks.set(this, specification.decks || new Deck());
        _actions.set(this, specification.actions || {});
    }

    /**
     * Get layout of this game's playing table.
     *
     * return {Layout}
     */
    get layout() {
        return _layout.get(this);
    }



}

export {
    Game
}
