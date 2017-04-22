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
/**
 * CardRenderEngine is an abstract base class as an interface to various card render engines, such as
 * an unicode font based one, an image based one, or a SVG based one.
 */
class CardRenderEngine {
    /**
     * Create a new render engine
     */
    constructor() {
    }

    /**
     * Represent a card as a SVG element.
     *
     * @param {Card} card - the card model to represent;
     *
     * @return {SVGElement} A SVG representation of the card.
     */
    createCard() {
    }

    /**
     * Represent a card's base, its circumference, as a SVG Element.
     *
     * @return {SVGElement} A SVG representation of a card's circumference
     */
    createBase() {
    }

    /**
     * Represent a suit as a SVG Element
     *
     * @param {string} suit - the suit to represent.
     *
     * @return {SVGElement} A SVG representation of the suit.
     */
    createSuit() {
    }

}


export {CardRenderEngine};
