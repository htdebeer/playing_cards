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

const _elements = new WeakMap();

const PILE = Symbol("pile");
const LABEL = Symbol("label");

const TYPE = [
    PILE,
    LABEL
];

const initialize = function (layout, specification) {
};

/**
 * @module
 */

/**
 * Layout describes a playing table with game elements, such as piles,
 * labels, and the like.
 */
class Layout {

    /**
     * Create a new layout
     *
     * @param {object} [specification = {}] The initial specification
     */
    constructor(specification = {}) {
        _elements.set(this, {});

        initialize(this, specification);
    }

    /**
     * Add an element to this layout
     *
     * @Param {string} name - the name of the pile. This name should be unique
     * in the layout.
     * @param {object} element - the element to add to this layout.
     *
     * Note. If there already exist an element with this name in this layout, it
     * will be replaced by new element.
     */
    add(name, element) {
        _elements.get(this)[name] = element;
    }

    /**
     * Get an element by name.
     *
     * @param {string} name - the name of the element to get in this layout
     *
     * @return {object} the element associated by name; returns `undefined` if it
     * does not exist.
     */
    get(name) {
        return _elements.get(this)[name];
    }

    /**
     * Get all the element of TYPE of this layout;
     *
     * @return {TYPE} type - the type to filter
     * @return {object(name, element)} a map with all the elements of TYPE in this layout.
     */
    getElementsByType(type) {
        const elements = _elements.get(this);
        return Object
            .keys(elements)
            .filter((name) => elements[name].type === type)
            .reduce((elts, name) => {
                elts[name] = elements[name];
                return elts;
            }, {});
    }
}

export {
    Layout,
    TYPE,
    PILE,
    LABEL,
};
