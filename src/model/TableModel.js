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

import {Model} from "./Model.js";
import {Layout} from "../layout/Layout.js";


const _layout = new WeakMap();

/**
 * Table a card game is played on.
 *
 * @extends Model
 */
class TableModel extends Model {
    
    /**
     * Create a new Table model.
     *
     * @param {Layout} [layout = new Layout] - the initial layout of the table.
     */
    constructor(layout = new Layout()) {
        super([]);
        _layout.set(this, layout);
    }

    /**
     * Get this table's layout.
     *
     * @return {Layout} this table's layout.
     */
    get layout() {
        return _layout.get(this);
    }
    
}

export {
    TableModel
};
