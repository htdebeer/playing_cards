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
 * Utilities for handling SVG.
 *
 * @module
 */

const SVGNS = "http://www.w3.org/2000/svg";
const XLINKNS = "http://www.w3.org/1999/xlink";

let doc = undefined;
/**
 * SVG is a utility class to create and work with SVG elements.
 */
class SVG {
    /**
     * Create a new SVG object with the document to use to create SVG
     * elements.
     */
    constructor() {
    }

    /**
     * Create a SVG element with name and attributes.
     *
     * @param {string} name - the name of the element to create.
     * @param {object} [attributes = {}] - the attributes to set on the
     * created element.
     */
    create(name, attributes = {}) {
        const elt = document.createElementNS(SVGNS, name);
        
        Object
            .entries(attributes)
            .forEach((attribute, value) => elt.setAttribute(attribute, value));

        return elt;
    }

    /**
     * Create a USE element with url and attributes.
     *
     * @param {string} url - the URL to the object to use.
     * @param {object} [attributes = {}] - the attributes to set.
     */
    use(url, attributes = {}) {
        const use = create("use", attributes);
        use.setAttributeNS(XLINKNS, "xlink:href", url);
        return use;
    }


}

export default new SVG();
