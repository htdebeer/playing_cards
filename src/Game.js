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
import {CARD_SUPPLIER} from "./CardSupplier.js";
import {SVGCardsCardRenderEngine} from "./card_render_engine/SVGCardsCardRenderEngine.js";
import {UnicodeCardRenderEngine} from "./card_render_engine/UnicodeCardRenderEngine.js";

import {Layout} from "./layout/Layout.js";
import {Pile} from "./pile/Pile.js";
import {Deck} from "./Deck.js";
import {Action} from "./action/Action.js";
import {TableView} from "./view/TableView.js";

/**
 * @module
 */

CARD_SUPPLIER.engine = new SVGCardsCardRenderEngine("/SVG-cards/svg-cards.svg");
//CARD_SUPPLIER.engine = new UnicodeCardRenderEngine();

const findElement = function (iterable, name) {
    for (element of iterable) {
        if (element.name === name) {
            return element;
        }
    }
    return undefined;
};

const _layout = new WeakMap();
const _piles = new WeakMap();
const _decks = new WeakMap();
const _actions = new WeakMap();
const _labels = new WeakMap();
const _table = new WeakMap();

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

        _table.set(this, new TableView());
        _layout.set(this, specification.layout || new Layout());


        _decks.set(this, new Set());
        if (specification.hasOwnProperty("decks") && Array.isArray(specification.decks)) {
            specification
                .decks
                .forEach((deck) => this.decks.add(new Deck(this, deck.color || deck.name, deck.jokers || false)));
        }

        _piles.set(this, new Set());
        if (specification.hasOwnProperty("piles") && Array.isArray(specification.piles)) {
            specification
                .piles
                .forEach((pile) => this.piles.add(new Pile(this, pile)));
        }
       
        _actions.set(this, new Set());
        if (specification.hasOwnProperty("actions") && Array.isArray(specification.actions)) {
            specification
                .actions
                .forEach((action) => this.actions.add(new Action(this, action.name, action.action)))
        }
        
        const setup = this.action("setup");
        if (setup) {
            setup.run();
        }
    }

    /**
     * Start this game;
     */
    start() {
        console.log("Start!");
    }

    /**
     * Get this game's table view
     */
    get table() {
        return _table.get(this);
    }

    /**
     * Get the list of piles in this game.
     *
     * @return {Pile[]} the list of piles in this game.
     */
    get piles() {
        return _piles.get(this);
    }

    /**
     * Get a pile by name.
     *
     * @param {String} name - the name of the pile to get
     * @return {Pile} the pile with name or undefined if it is unknown in this
     * game.
     */
    pile(name) {
        return findElement(this.piles, name);
    }

    /**
     * Get the decks used in this game.
     *
     * @return {Deck[]} the list of decks used in this game.
     */
    get decks() {
        return _decks.get(this);
    }

    /**
     * Get a deck by name or color.
     *
     * @param {String} name - the name or color of the deck to get
     * @return {Deck} the deck with name or undefined if it is unknown in this
     * game.
     */
    deck(name) {
        return findElement(this.decks, name);
    }

    /**
     * Get the actions available in this game.
     *
     * @return {Action[]} the list of actions in this game.
     */
    get actions() {
        return _actions.get(this);
    }

    /**
     * Get an action by name.
     *
     * @param {String} name - the name of the action to get
     * @return {Action} the action with name or undefined if it is unknown in
     * this game.
     */
    action(name) {
        return findElement(this.actions, name);
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
