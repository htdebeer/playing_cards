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
import {GView} from "./GView.js";
import {CARD_SUPPLIER} from "../CardSupplier.js";

/**
 * View of a card.
 *
 * @extends GView
 */
class CardView extends GView {
    /**
     * Create a new card view.
     *
     * @param {View} parent - the parent view
     * @param {CardModel} model - the card model this view represents
     * @param {float} [x = 0] - the x coordinate.
     * @param {float} [y = 0] - the y coordinate.
     * @param {object} [config = {}] - the configuration of this view. Set
     * property "cardSupplier" to choose a card supplier; defaults to the font
     * based card supplier.
     */
    constructor(parent, model, x = 0, y = 0, config = {}) {
        config.name = "card";
        super(parent, model, x, y, config);
        this.enableDragging();
        this.render();
    }

    /**
     * Render this card
     */
    render() {
        if (this.element.hasChildNodes()) {
            this.element.removeChild(this.element.lastChild);
        }
        this.element.appendChild(CARD_SUPPLIER.createCard(this.model));
    }
}

export {
    CardView
};
