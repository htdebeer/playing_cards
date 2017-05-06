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
import {GameElement} from "../GameElement.js";

/**
 * An action in a card game.
 *
 * @extends GameElement
 */
class Action extends GameElement {

    /**
     * Create a new action.
     *
     * @param {string} name - the name of this action.
     */
    constructor(name) {
        super(name);
    }
}

export {
    Action
}
