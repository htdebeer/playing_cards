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

const WIDTH = 169.075;
const HEIGHT = 244.64;

const SUIT_WIDTH = 15.42;
const SUIT_HEIGHT = 15.88;

const _url = new WeakMap();

/**
 * PNGCardsCardRenderEngine is a CardRenderEngine that uses PNG files renderings of {@link https://github.com/htdebeer/SVG-cards|SVG Cards}
 * to supply cards.
 *
 * @extends CardRenderEngine
 */
class PNGCardsCardRenderEngine extends CardRenderEngine {

    /** 
     * Create a PNGCardsCardsRenderEngine. Specify the URL to the directory with
     * PNG files to get the cards from.
     *
     * @param {string} [url = "/png"] - the URL to the directory with PNG
     * to get the cards from.
     */
    constructor(url = "/png") {
        super();
        _url.set(this, url);
    }

    /**
     * The URL to the directory with PNG files to get the cards from;
     */
    get url() {
        return _url.get(this);
    }

    /**
     * Represent a card as an SVG IMAGE element, using cards defined in {@link https://github.com/htdebeer/SVG-cards| SVG Cards}.
     *
     * @param {CardModel} card - the card model to represent;
     *
     * @return {SVGImageElement} An SVG representation of the card.
     */
    createCard(card) {
        let id = "back";

        if (card.isFacingUp()) {
            if (card.isJoker()) {
                id = `${card.isRed() ? "red" : "black"}_joker`;
            } else {
                let [rank, suit] = card.name.split(" of ");
                if (card.isPipsCard()) {
                    rank = card.pips;
                }
                id = `${rank}_${suit.slice(0, -1)}`;
            }
        } else {
            id = `${id}-${card.backColor}`;
        }


        return svg.image(`${this.url}/${id}.png`, 0, 0, WIDTH, HEIGHT);
    }
    
    /**
     * Represent a card's base, its circumference, as a SVG Element.
     *
     * @return {SVGElement} A SVG representation of a card's circumference
     */
    createBase() {
        return svg.image(`${this.url}/card-base.png`, 0, 0, WIDTH, HEIGHT);
    }

    /**
     * Represent a suit as a SVG Element
     *
     * @param {string} suit - the suit to represent.
     *
     * @return {SVGElement} A SVG representation of the suit.
     */
    createSuit(suit) {
        return svg.image(`${this.url}/suit-${suit}.png`, 0, 0, SUIT_WIDTH, SUIT_HEIGHT);
    }
}

export {PNGCardsCardRenderEngine};
