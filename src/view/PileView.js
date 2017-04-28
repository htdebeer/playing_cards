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
import {CARD_SUPPLIER} from "../CardSupplier.js";
import {CardView} from "./CardView.js";
import {View} from "./View.js";

const CARD_OFFSET = 0.2;

/**
 * View representing a pile
 *
 * @extends View
 */
class PileView extends View {
    /**
     * Create a new pile view
     *
     * @param {View} parent - this view's parent
     * @param {Pile} model - the pile this view represents
     * @param {object} [config = {}] - initial configuration of this pile
     * view.
     */
    constructor(parent, model, config = {}) {
        config.name = "pile";
        super(parent, model, config);
        this.element.appendChild(CARD_SUPPLIER.createBase());
    }

    /**
     * Rending this pile at (x, y)
     *
     * @param {float} [x = 0] - the x coordinate
     * @param {float} [y = 0] - the y coordinate
     */
    render(x = 0, y = 0) {
        for (const cardElement of this.element.querySelectorAll("g.card")) {
            this.element.removeChild(cardElement);
        }

        let index = 0;
        for (const card of this.model.each()) {
            const cardElement = new CardView(this, card);
            cardElement.render(0, CARD_OFFSET * index);
            index++;
        }
        super.render(x, y);
    }

    /**
     * Configure this pile view. 
     *
     * @param {object} [config = {}] - the configuration to set on this view.
     */
    configure(config = {}) {
        if (!config.hasOwnProperty("offset")) {
            config.offset = CARD_OFFSET;
        }
        super.configure(config);
    }

}

export {
    PileView
};
