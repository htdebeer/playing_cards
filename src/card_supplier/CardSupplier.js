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

import {svg} from "../svg.js";

/**
 * CardSupplier base class as an interface to various card suppliers, such as
 * a font based one, an image based one, or a SVG based one.
 */
class CardSupplier {
    /**
     * Create a new supplier
     */
    constructor() {
    }

    /**
     * Represent a card as an SVG element.
     *
     * @param {Card} card - the card model to represent;
     *
     * @return {SVGElement} An SVG representation of the card.
     */
    createCard(card) {
        const attributes = {};

        let color;
        if (card.isFacingUp()) {
            color = card.isRed() ? "red" : "black";
        } else {
            color = card.backColor;
        }

        attributes.fill = color;

        const text = svg.create("text", attributes);
        text.textContent = card.toString();

        if (card.isRed() && card.isJoker()) {
            // The red joker unicode symbol looks off compared to the other
            // card symbols. Therefore, instead of red joker symbol, use the
            // black joker symbol (but color it red).
            text.textContent = String.fromCodePoint(0x1F0CF);
        }
        
        return text;
    }

}

export {CardSupplier};
