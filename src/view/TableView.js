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

import {EVENT_DRAG_START, EVENT_DRAG_END, EVENT_DRAG, View} from "./View.js";

const _dragElement = new WeakMap();

/**
 * Table represents the table a card game is played on. All viewed elements
 * are on top of the table.
 *
 * @extends View
 */
class TableView extends View {

    constructor(svgElement, model, config = {}) {
        config.name = "table";
        super(undefined, model, config);

        svgElement.appendChild(svg.rectangle(0, 0, "100%", "100%", {
            "fill": config.fill || "green"
        }));
    } 

    /**
     * This view is a table view.
     */
    isTable() {
        return true;
    }
  
    /**
     * Start dragging a view over this table.
     *
     * @param {Event} event - the original event initialing the dragging;
     * @param {View} view - the view to drag
     *
     * @fire EVENT_DRAG_START
     */
    startDragging(event, view) {
        const svgRoot = view.element.ownerSVGElement;

        let point = svgRoot.createSVGPoint();
        point.x = event.clientX - document.body.scrollLeft;
        point.y = event.clientY - document.body.scrollTop;
        point = point.matrixTransform(view.element.getScreenCTM().inverse());

        const offset = {
            x: point.x,
            y: point.y
        };

        let transform = view.element.ownerSVGElement.createSVGTransform();
        let transformList = view.element.transform.baseVal;

        /**
         * Drag this view around
         *
         * @param {Event} event - the mouse event
         *
         * @fire EVENT_DRAG
         */
        _dragElement.set(this, (event) => {
            // Move card to table for dragging, only after starting moving, though
            if (view.element.parentNode !== this.element) {
                const elementToDrag = view.element.parentNode.removeChild(view.element);
                this.element.appendChild(elementToDrag);
            }

            // Get a point in viewport coordinates
            point = svgRoot.createSVGPoint();
            point.x = event.clientX - document.body.scrollLeft;
            point.y = event.clientY - document.body.scrollTop;

            // transfor the to user coordinates
            point = point.matrixTransform(view.element.getScreenCTM().inverse());

            // keep track of the offset so the element that is being dragged keeps
            // located under the cursor 
            point.x -= offset.x;
            point.y -= offset.y; 

            // set transform
            transform.setTranslate(point.x, point.y);
            transformList.appendItem(transform);
            transformList.consolidate();

            view.emit(EVENT_DRAG, view);
        });

        this.element.addEventListener("mousemove", _dragElement.get(this));
        view.emit(EVENT_DRAG_START, view);
    }

    /**
     * Stop dragging a view over this table.
     *
     * @param {View} view - the view that has been dragged.
     *
     * @fire EVENT_DRAG_END
     */
    stopDragging(view) {
        this.element.removeEventListener("mousemove", _dragElement.get(this));
        this.element.removeChild(view.element);
        view.emit(EVENT_DRAG_END, view);
    }

}

export {
    TableView
};
