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
 * General utility functions
 *
 * @module
 */

/**
 * Convert a symbol to a string representation without the "Symbol(...)" in
 * it.
 *
 * @param {symbol} symbol - the symbol to convert to a string.
 *
 * @returns {string} The string representation of the symbol.
 */
const symbolToString = function (symbol) {
    return symbol.toString().match(/Symbol\(([a-z]+)\)/)[1];
};


export {symbolToString};
