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

import {CardSupplier} from "../card_supplier/CardSupplier.js";
import {EVENT_CLICK, EVENT_DRAG_START, EVENT_DRAG_END, EVENT_DRAG, View} from "./View.js";


/**
 * View representing a pile
 *
 * @extends View
 */
class Pile extends View {
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
    }

    /**
     * Rending this pile at (x, y)
     *
     * @param {float} [x = 0] - the x coordinate
     * @param {float} [y = 0] - the y coordinate
     */
    render(x = 0, y = 0) {
    }


}

export {
    Pile
};
