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

import {CardRenderEngine} from "./card_render_engine/CardRenderEngine.js";
import {UnicodeCardRenderEngine} from "./card_render_engine/UnicodeCardRenderEngine.js";

const _engine = new WeakMap();

/**
 * CardSupplier is a singleton that renders cards. The engine to render cards
 * can be configured.
 *
 * @extends CardRenderEngine
 */
const CARD_SUPPLIER = new class extends CardRenderEngine {
    /**
     * Create a new supplier
     *
     */
    constructor() {
        super();
        _engine.set(this, new UnicodeCardRenderEngine());
    }

    /**
     * Get the configured card render engine.
     *
     * @returns {CardRenderEngine}
     */
    get engine() {
        return _engine.get(this);
    }

    /**
     * Set the card render engine.
     *
     * @param {CardRenderEngine} engine - the engine to use.
     */
    set engine(engine) {
        _engine.set(this, engine);
    }

    /**
     * Represent a card as a SVG element.
     *
     * @param {Card} card - the card model to represent;
     *
     * @return {SVGElement} A SVG representation of the card.
     */
    createCard(card) {
        return this.engine.createCard(card);
    }

    /**
     * Represent a card's base, its circumference, as a SVG Element.
     *
     * @return {SVGElement} A SVG representation of a card's circumference
     */
    createBase() {
        return this.engine.createBase();
    }

    /**
     * Represent a suit as a SVG Element
     *
     * @param {string} suit - the suit to represent.
     *
     * @return {SVGElement} A SVG representation of the suit.
     */
    createSuit(suit) {
        return this.engine.createSuit(suit);
    }

};

export {CARD_SUPPLIER};
