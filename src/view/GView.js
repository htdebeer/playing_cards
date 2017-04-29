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
import {View, EVENT_CLICK } from "./View.js";
import {svg} from "../svg.js";

const createClickableAndDraggableElement = function (view) {
    const group = svg.group({
        "class": view.config.name || ""
    });

    // Disable click event;
    group.addEventListener("click", (event) => event.stopPropagation());

    let dragging = false;
    let moving = false;

    group.addEventListener("mousedown", (event) => {
        event.stopPropagation();
        if (view.isDraggable()) {
            dragging = true;
        }
    });

    group.addEventListener("mousemove", (event) => {
        if (dragging) {
            if (!moving) {
                moving = true;
                view.table.startDragging(event, view);
                event.stopPropagation();
            }
        }
    });

    group.addEventListener("mouseup", (event) => {
        if (view.isDraggable()) {
            if (dragging) {
                event.stopPropagation();
                dragging = false;
                if (moving) {
                    moving = false;
                    view.table.stopDragging(view);
                } else {
                    view.emit(EVENT_CLICK, view);
                }
            }
        } else {
            event.stopPropagation();
            view.emit(EVENT_CLICK, view);
        }
    });

    return group;
};

const _element = new WeakMap();
const _x = new WeakMap();
const _y = new WeakMap();
const _draggable = new WeakMap();

/**
 * Base class of SVG G element based views.
 *
 * @extends View
 */
class GView extends View {
    /**
     * Create a new gview
     *
     * @param {View} parent - the parent view. Will be undefined for the root view.
     * @param {Model} model - the model this view represents
     * @param {float} [x = 0] - the x coordinate
     * @param {float} [y = 0] - the y coordinate
     * @param {object} [config = {}] - an (initial) configuration of this
     * view.
     */
    constructor(parent, model, x = 0, y = 0, config = {}) {
        super(parent, model, config);
        this.x = x;
        this.y = y;

        _element.set(this, createClickableAndDraggableElement(this));

        // Append the view to the parent unless it is a table. The table has
        // to be appended to an SVG element that is not part of a view.
        if (!this.isTable()) {
            this.parent.element.appendChild(this.element);
        }
        
        this.element.setAttribute("transform", `translate(${this.x}, ${this.y})`);
    }
    
    /**
     * Get this view's SVG DOM element.
     */
    get element() {
        return _element.get(this);
    }

    /**
     * Enable dragging of this view.
     */
    enableDragging() {
        _draggable.set(this, true);
    }

    /**
     * Disable dragging of this view.
     */
    disableDragging() {
        _draggable.set(this, false);
    }

    /**
     * Is this view draggable?
     *
     * @return {Boolean} true when this view is draggable.
     */
    isDraggable() {
        return _draggable.get(this);
    }

    /**
     * Get the x coordinate.
     *
     * @return {float} the x coordinate.
     */
    get x() {
        return _x.get(this);
    }

    /**
     * Set the x coordinate.
     *
     * @param {float} newX - the new x coordinate.
     */
    set x(newX) {
        _x.set(this, newX);
    }

    /**
     * Set the y coordinate.
     *
     * @param {float} newY - the new y coordinate.
     */
    set y(newY) {
        _y.set(this, newY);
    }

    /**
     * Get the y coordinate.
     *
     * @return {float} the y coordinate.
     */
    get y() {
        return _y.get(this);
    }
    
    /**
     * Get the table this view belongs to; each view belongs to a table or is
     * a table.
     */
    get table() {
        return this.isTable() ? this : this.parent.table;
    }
    
    /**
     * Is this view a table node?
     */
    isTable() {
        return false;
    }

}

export {
    GView,
};
