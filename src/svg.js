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
      
        Object.keys(attributes).forEach(key => elt.setAttribute(key, attributes[key]));
        
        return elt;
    }

    /**
     * Create a TEXT element with content and attributes
     *
     * @param {string} content - the text to show
     * @param {object} [attributes = {}] - the attributes to set.
     */
    text(content, attributes = {}) {
        const text = this.create("text", attributes);
        text.textContent = content;
        return text;
    }

    /**
     * Create a USE element with url and attributes.
     *
     * @param {string} url - the URL to the object to use.
     * @param {object} [attributes = {}] - the attributes to set.
     */
    use(url, attributes = {}) {
        const use = this.create("use", attributes);
        use.setAttributeNS(XLINKNS, "xlink:href", url);
        return use;
    }

    /**
     * Create a GROUP element with attributes.
     *
     * @param {object} [attributes = {}] - the attributes to set.
     */
    group(attributes = {}) {
        return this.create("g", attributes);
    }

    /**
     * Create a RECT
     *
     * @param {float} x - the upper left corner, x coordinate
     * @param {float} y - the upper left corner, y coordinate
     * @param {float} width - the width of the rectangle
     * @param {float} height - the heigt of the rectangle
     * @param {attributes} [attributes = {}] - other attributes
     */
    rectangle(x, y, width, height, attributes = {}) {
        const rect = this.create("rect", attributes);
        rect.setAttribute("x", x);
        rect.setAttribute("y", y);
        rect.setAttribute("width", width);
        rect.setAttribute("height", height);
        return rect;
    }

}

const svg = new SVG();
export {svg, SVGNS, XLINKNS};
