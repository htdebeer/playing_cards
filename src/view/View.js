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
import {EventAware} from "../EventAware.js";
import {EVENT_MODEL_CHANGE} from "../model/Model.js";
import {svg} from "../svg.js";

const EVENT_CLICK = Symbol("event:view:click");
const EVENT_DRAG = Symbol("event:view:drag");
const EVENT_DRAG_START = Symbol("event:view:drag-start");
const EVENT_DRAG_END = Symbol("event:view:drag-end");
const EVENT_DROP = Symbol("event:view:drop");

const _parent = new WeakMap();
const _model = new WeakMap();
const _config = new WeakMap();
const _element = new WeakMap();

/**
 * Base class of views.
 *
 * @extends EventAware
 */
class View extends EventAware {
    /**
     * Create a new view
     *
     * @param {View} parent - the parent view. Will be undefined for the root view.
     * @param {Model} model - the model this view represents
     * @param {object} [config = {}] - an (initial) configuration of this
     * view.
     */
    constructor(parent, model, config = {}) {
        super([EVENT_CLICK, EVENT_DRAG_START, EVENT_DRAG, EVENT_DRAG_END, EVENT_DROP]);
        _parent.set(this, parent);
        _model.set(this, model);
        _config.set(this, {});
        _element.set(this, undefined);
        
        this.configure(config);
        this.model.on(EVENT_MODEL_CHANGE, () => this.render());
    }

    /**
     * Get this view's parent view.
     */
    get parent() {
        return _parent.get(this);
    }

    /**
     * Get the table this view belongs to; each view belongs to a table or is
     * a table.
     */
    get table() {
        return this.isTable() ? this : this.parent.table();
    }

    /**
     * Get this view's model.
     */
    get model() {
        return _model.get(this);
    }

    /**
     * Get this view's configuration.
     */
    get config() {
        return _config.get(this);
    }

    /**
     * Get this view's SVG DOM element.
     */
    get element() {
        return _element.get(this);
    }

    /**
     * Set this view's SVG DOM element.
     *
     * @param {SVGElement} elt - the element to set
     */
    set element(elt) {
        _element.set(this, elt);
    }

    /**
     * Render this view. Has to be implemented for all subclasses of View.
     *
     * @param {float} [x = 0] - the x coordinate to render this view.
     * @param {float} [y = 0] - the y coordinate to render this view.
     */
    render(x = 0, y = 0) {
        this.element.setAttribute("transform", `translate(${x}, ${y})`);
    }

    /**
     * Is this view a table node?
     */
    isTable() {
        return false;
    }

    /**
     * Configure this view. Each subclass will override this method to handle
     * view specific configuration options.
     *
     * @param {object} [config = {}] - the configuration to set on this view.
     */
    configure(config = {}) {
        _config.set(this, Object.assign(_config.get(this), config));
    }

}

export {
    View,
    EVENT_CLICK,
    EVENT_DRAG,
    EVENT_DRAG_START,
    EVENT_DRAG_END,
    EVENT_DROP
};
