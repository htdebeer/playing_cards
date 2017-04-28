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
import {View, 
    EVENT_CLICK, 
    EVENT_DRAG, EVENT_DRAG_START, EVENT_DRAG_END, EVENT_DROP } from "./View.js";
import {svg} from "../svg.js";

const createClickableAndDraggableElement = function (view, name = "") {
    const group = svg.group({
        "class": name
    });

    let dragging = false;
    let moving = false;

    group.addEventListener("mousedown", (event) => {
        event.stopPropagation();
        dragging = true;
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
        if (dragging) {
            event.stopPropagation();
            dragging = false;
            if (moving) {
                moving = false;
                view.table.stopDragging(view);
            } else {
                view.emit(EVENT_CLICK, this);
            }
        }
    });

    return group;
};

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
     * @param {object} [config = {}] - an (initial) configuration of this
     * view.
     */
    constructor(parent, model, config = {}) {
        super(parent, model, config);

        this.element = createClickableAndDraggableElement(this, config.name || "");

        // Append the view to the parent unless it is a table. The table has
        // to be appended to an SVG element that is not part of a view.
        if (!this.isTable()) {
            this.parent.element.appendChild(this.element);
        }
    }
}

export {
    GView,
};
