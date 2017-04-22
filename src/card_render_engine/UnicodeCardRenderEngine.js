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
import {CardRenderEngine} from "./CardRenderEngine.js";

const SUITS = {
    "club": {
        codePoint: 0x2663,
        color: "black"
    },
    "spade": {
        codePoint: 0x2660,
        color: "black"
    },
    "heart": {
        codePoint: 0x2665,
        color: "red"
    },
    "diamond": {
        codePoint: 0x2666,
        color: "red"
    }
};

/**
 * UnicodeCardRenderEngine renders cards and suits as unicode SVG TEXT elements.
 *
 * @extends CardRenderEngine
 */
class UnicodeCardRenderEngine extends CardRenderEngine {
    /**
     * Create a new Unicode font based render engine.
     */
    constructor() {
        super();
    }

    /**
     * Represent a card as a SVG element.
     *
     * @param {Card} card - the card model to represent;
     *
     * @return {SVGElement} A SVG representation of the card.
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

        const text = svg.text(card.toString(), attributes);

        if (card.isRed() && card.isJoker() && card.isFacingUp()) {
            // The red joker unicode symbol looks off compared to the other
            // card symbols. Therefore, instead of red joker symbol, use the
            // black joker symbol (but color it red).
            text.textContent = String.fromCodePoint(0x1F0CF);
        }
        
        return text;
    }

    /**
     * Represent a card's base, its circumference, as a SVG Element.
     *
     * @return {SVGElement} A SVG representation of a card's circumference
     */
    createBase() {
        return svg.text(String.fromCodePoint(0x1F0A0), {
            fill: "silver",
            "fill-opacity": 0.2
        });
    }

    /**
     * Represent a suit as a SVG Element
     *
     * @param {string} suit - the suit to represent.
     *
     * @return {SVGElement} A SVG representation of the suit.
     */
    createSuit(suit) {
        return svg.text(String.fromCodePoint(SUITS[suit].codePoint), {
            fill: SUITS[suit].color
        });
    }

}

export {UnicodeCardRenderEngine};
