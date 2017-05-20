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
/**
 * CardRenderEngine is an abstract base class as an interface to various card render engines, such as
 * an unicode font based one, an image based one, or a SVG based one.
 */
class CardRenderEngine {
    /**
     * Create a new render engine
     */
    constructor() {
    }

    /**
     * Represent a card as a SVG element.
     *
     * @param {CardModel} card - the card model to represent;
     *
     * @return {SVGElement} A SVG representation of the card.
     */
    createCard() {
    }

    /**
     * Represent a card's base, its circumference, as a SVG Element.
     *
     * @return {SVGElement} A SVG representation of a card's circumference
     */
    createBase() {
    }

    /**
     * Represent a suit as a SVG Element
     *
     * @param {string} suit - the suit to represent.
     *
     * @return {SVGElement} A SVG representation of the suit.
     */
    createSuit() {
    }

}

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

const SUITS = {
    "club": {
        codePoint: 0x2663,
        color: "black"
    },
    "spade": {
        codePoint: 0x2660,
        color: "black"
    },
    "heart": {
        codePoint: 0x2665,
        color: "red"
    },
    "diamond": {
        codePoint: 0x2666,
        color: "red"
    }
};

/**
 * UnicodeCardRenderEngine renders cards and suits as unicode SVG TEXT elements.
 *
 * @extends CardRenderEngine
 */
class UnicodeCardRenderEngine extends CardRenderEngine {
    /**
     * Create a new Unicode font based render engine.
     */
    constructor() {
        super();
    }

    /**
     * Represent a card as a SVG element.
     *
     * @param {CardModel} card - the card model to represent;
     *
     * @return {SVGElement} A SVG representation of the card.
     */
    createCard(card) {
        const attributes = {};

        let color;
        if (card.isFacingUp()) {
            color = card.isRed() ? "red" : "black";
        } else {
            color = card.backColor;
        }

        attributes.fill = color;

        const text = svg.text(card.toString(), attributes);

        if (card.isRed() && card.isJoker() && card.isFacingUp()) {
            // The red joker unicode symbol looks off compared to the other
            // card symbols. Therefore, instead of red joker symbol, use the
            // black joker symbol (but color it red).
            text.textContent = String.fromCodePoint(0x1F0CF);
        }
        
        return text;
    }

    /**
     * Represent a card's base, its circumference, as a SVG Element.
     *
     * @return {SVGElement} A SVG representation of a card's circumference
     */
    createBase() {
        return svg.text(String.fromCodePoint(0x1F0A0), {
            fill: "silver",
            "fill-opacity": 0.2
        });
    }

    /**
     * Represent a suit as a SVG Element
     *
     * @param {string} suit - the suit to represent.
     *
     * @return {SVGElement} A SVG representation of the suit.
     */
    createSuit(suit) {
        return svg.text(String.fromCodePoint(SUITS[suit].codePoint), {
            fill: SUITS[suit].color
        });
    }

}

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

const _engine = new WeakMap();

/**
 * CardSupplier is a singleton that renders cards. The engine to render cards
 * can be configured.
 *
 * @extends CardRenderEngine
 */
const CARD_SUPPLIER = new class extends CardRenderEngine {
    /**
     * Create a new supplier
     *
     */
    constructor() {
        super();
        _engine.set(this, new UnicodeCardRenderEngine());
    }

    /**
     * Get the configured card render engine.
     *
     * @returns {CardRenderEngine}
     */
    get engine() {
        return _engine.get(this);
    }

    /**
     * Set the card render engine.
     *
     * @param {CardRenderEngine} engine - the engine to use.
     */
    set engine(engine) {
        _engine.set(this, engine);
    }

    /**
     * Represent a card as a SVG element.
     *
     * @param {CardModel} card - the card model to represent;
     *
     * @return {SVGElement} A SVG representation of the card.
     */
    createCard(card) {
        return this.engine.createCard(card);
    }

    /**
     * Represent a card's base, its circumference, as a SVG Element.
     *
     * @return {SVGElement} A SVG representation of a card's circumference
     */
    createBase() {
        return this.engine.createBase();
    }

    /**
     * Represent a suit as a SVG Element
     *
     * @param {string} suit - the suit to represent.
     *
     * @return {SVGElement} A SVG representation of the suit.
     */
    createSuit(suit) {
        return this.engine.createSuit(suit);
    }

};

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
const _url = new WeakMap();

/**
 * SVGCardsCardRenderEngine is a CardRenderEngine that uses {@link https://github.com/htdebeer/SVG-cards|SVG Cards}
 * to supply cards.
 *
 * @extends CardRenderEngine
 */
class SVGCardsCardRenderEngine extends CardRenderEngine {

    /** 
     * Create a SVGCardsCardsRenderEngine. Specify the URL to the SVG file to get
     * the cards from.
     *
     * @param {string} [url = "/svg-cards.svg"] - the URL to the SVG file to
     * get the cards from.
     */
    constructor(url = "/svg-cards.svg") {
        super();
        _url.set(this, url);
    }

    /**
     * The URL to the SVG file to get the cards from;
     */
    get url() {
        return _url.get(this);
    }

    /**
     * Represent a card as an SVG USE element, using cards defined in {@link https://github.com/htdebeer/SVG-cards| SVG Cards}.
     *
     * @param {CardModel} card - the card model to represent;
     *
     * @return {SVGElement} An SVG representation of the card.
     */
    createCard(card) {
        const attributes = {};
        let id = "back";
        if (card.isFacingUp()) {
            if (card.isJoker()) {
                id = `${card.isRed() ? "red" : "black"}_joker`;
            } else {
                let [rank, suit] = card.name.split(" of ");
                if (card.isPipsCard()) {
                    rank = card.pips;
                }
                id = `${rank}_${suit.slice(0, -1)}`;
            }
        } else {
            // Color the back
            attributes.fill = card.backColor;
        }

        // rendering the back takes a long time: to render 52 backs, it needs
        // about 2 seconds to render about 50000! elements. For now, a simpler
        // back is used.
        if ("back" === id) {
            attributes.rx = 5;
            attributes.ry = 5;
            attributes.stroke = "black";
            return svg.rectangle(0, 0, 169.075, 244.64, attributes);
        } else {
            return svg.use(`${this.url}/#${id}`, attributes);
        }
    }
    
    /**
     * Represent a card's base, its circumference, as a SVG Element.
     *
     * @return {SVGElement} A SVG representation of a card's circumference
     */
    createBase() {
        return svg.use(`${this.url}/#card-base`, {
            fill: "navy",
            "fill-opacity": 0.2,
            "stroke-opacity": 0.2
        });
    }

    /**
     * Represent a suit as a SVG Element
     *
     * @param {string} suit - the suit to represent.
     *
     * @return {SVGElement} A SVG representation of the suit.
     */
    createSuit(suit) {
        return svg.use(`${this.url}/#suit-${suit}`);
    }
}

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

const initialize = function (layout, specification) {
};

/**
 * @module
 */

/**
 * Layout describes a playing table with game elements, such as piles,
 * labels, and the like.
 *
 * @extends GameElement
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

const _game = new WeakMap();
const _name = new WeakMap();

/**
 * GameElement represent elements in a card game such as a pile, player, deck,
 * action, or label.
 */
class GameElement {
    /**
     * Create a new GameElement with name.
     *
     * @param {Game} game - the game this element belongs to.
     * @param {string} name - the name of this game element.
     */
    constructor(game, name) {
        _game.set(this, game);
        _name.set(this, name);
    }

    /**
     * Get this element's game.
     *
     * @return {Game} this element's game
     */
    get game() {
        return _game.get(this);
    }

    /**
     * Get this game element's name.
     *
     * @return {string} the name of this game element.
     */
    get name() {
        return _name.get(this);
    }

}

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

const initializeEventHandlers = function (events = []) {
    return events.reduce((handlers, event) => {
        handlers[event] = [];
        return handlers;
    }, {});
};

// Private properties of an EventAware class
const _eventHandlers = new WeakMap();

/**
 * EventAware is a base class for event aware object. EventAware objects can
 * emit events. For each emittable event an event handler can be installed or
 * uninstalled.
 */
class EventAware {

    /**
     * Create an EventAware object.
     *
     * @param {symbol[]} [emitableEvents = []] - the list of events this object can emit.
     */
    constructor(emitableEvents = []) {
        _eventHandlers.set(this, initializeEventHandlers(emitableEvents));
    }

    /**
     * @callback eventHandler
     *
     * @param {...*} parameters - an eventHandler can have zero (0) or more
     * parameters of any kind.
     */

    /**
     * Install an event handler.
     *
     * @param {symbol} event - the event to listen for.
     * @param {eventHandler} eventHandler - the event handler to install; when this EventAware
     * object emits the event this event handler will be executed.
     *
     * @throws {Error} An event handler can only be installed for an event
     * this EventAware object can emit.
     */
    on(event, eventHandler) {
        if (_eventHandlers.get(this).hasOwnProperty(event)) {
            _eventHandlers.get(this)[event].push(eventHandler);
        } else {
            throw new Error(`The EventAware object '${this}' does not emit event '${event.toString()}'.`);
        }
    }

    /**
     * Remove an event handler.
     *
     * @param {symbol} event - the event to stop listen for.
     * @param {eventHandler} [eventHandler] - the event handler to uninstall; when this
     * EventAware object emits the event this event handler will not be
     * executed anymore.
     *
     * If the eventHandler is not supplied, all event handlers for this event
     * will be uninstalled.
     *
     * @throws {Error} An event handler can only be uninstalled for an event
     * this EventAware object can emit. 
     */
    off(event, eventHandler = undefined) {
        if (_eventHandlers.get(this).hasOwnProperty(event)) {
            if (undefined === eventHandler) {
                // remove all event handlers for this event
                _eventHandlers.get(this)[event] = [];
            } else {
                const index = _eventHandlers.get(this)[event].indexOf(eventHandler);

                if (0 <= index) {
                    _eventHandlers.get(this)[event].splice(index, 1);
                }
            }
        } else {
            throw new Error(`The EventAware object '${this}' does not emit event '${event.toString()}'.`);
        }
    }

    /**
     * Emit an event.
     *
     * @param {symbol} event - the event to emit by this EventAware object.
     * @param {...*} parameters - a list of parameters that are applied to the
     * installed event handlers as parameters.
     */
    emit(event, ...parameters) {
        const handleEvent = function () {
            return function (eventHandler) {
                eventHandler.call(this, ...parameters);
            };
        };

        _eventHandlers.get(this)[event].forEach(handleEvent());
    }
}

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
/**
 * General event to denote that a model has been changed;
 */
const EVENT_MODEL_CHANGE = Symbol("event:model:change");

/**
 * Model is the base class for all models for concepts in the domain of
 * playing cards, such as cards, piles, decks, and the game.
 *
 * @extends EventAware
 */
class Model extends EventAware {

    /**
     * Construct a new Model.
     *
     * @param {symbol[]} [emitableEvents = []] - the list of events this object can emit.
     */
    constructor(emitableEvents = []) {
        if (!emitableEvents.includes(EVENT_MODEL_CHANGE)) {
            emitableEvents.push(EVENT_MODEL_CHANGE);
        }
        super(emitableEvents);
    }

    /** 
     * Emit an event. This method overrides the EventAware's emit method to
     * emit the EVENT_MODEL_CHANGE event whenever any other event is emitted
     * to signal to all subscribers that the model has been changed.
     *
     * In case of an EVENT_MODEL_CHANGE event, this model, the original event,
     * and the original parameters are passed as parameters to any installed
     * listener to EVENT_MODEL_CHANGE.
     *
     * @param {symbol} event - the event to emit by this EventAware object.
     * @param {...*} parameters - a list of parameters that are applied to the
     * installed event handlers as parameters.
     */
    emit(event, ...parameters) { 
        super.emit(event, ...parameters);

        if (EVENT_MODEL_CHANGE !== event) {
            const originalEvent = event;
            const originalParameters = parameters;
            this.emit(EVENT_MODEL_CHANGE, this, originalEvent, originalParameters);
        }
    }
}

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
const BACK = 0x1F0A0;
const HEX = 16;

/**
 * EVENT_CARD_TURN is emitted when a card is turned.
 */
const EVENT_CARD_TURN = Symbol("event:card:turn");

/**
 * A red card.
 */
const RED = Symbol("red");

/**
 * A black card.
 */
const BLACK = Symbol("black");

/**
 * The two colors of a card: red and black.
 *
 * @enum {symbol}
 */
const COLOR = [RED, BLACK];

/**
 * The suit clubs.
 */
const CLUBS = Symbol("clubs");

/**
 * The suit diamonds.
 */
const DIAMONDS = Symbol("diamonds");

/**
 * The suit hearts.
 */
const HEARTS = Symbol("hearts");

/**
 * The suit spades.
 */
const SPADES = Symbol("spades");

/**
 * The four suits: spades, hearts, diamonds, and clubs.
 *
 * @enum {symbol}
 */
const SUIT = [SPADES, HEARTS, DIAMONDS, CLUBS]; // Note. order of these suits matter, they are used by #fromUnicode to determine the suit.

/**
 * The rank ace.
 */
const ACE = Symbol("ace");

/**
 * The rank two.
 */
const TWO = Symbol("two");

/**
 * The rank three.
 */
const THREE = Symbol("three");

/**
 * The rank four.
 */
const FOUR = Symbol("four");

/**
 * The rank five.
 */
const FIVE = Symbol("five");

/**
 * The rank six.
 */
const SIX = Symbol("six");

/**
 * The rank seven.
 */
const SEVEN = Symbol("seven");

/**
 * The rank eight.
 */
const EIGHT = Symbol("eight");

/**
 * The rank nine.
 */
const NINE = Symbol("nine");

/**
 * The rank ten.
 */
const TEN = Symbol("ten");

/**
 * The rank JACK.
 */
const JACK = Symbol("jack");

/**
 * The rank KNIGHT.
 */
const KNIGHT = Symbol("knight");

/**
 * The rank queen.
 */
const QUEEN = Symbol("queen");

/**
 * The rank king.
 */
const KING = Symbol("king");

/**
 * The various ranks: ace, two, three, four, five, six, seven, eight, nine,
 * ten, jack, knight, queen, and king.
 *
 * @enum {symbol}
 */
const RANK = [ACE, TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT, NINE, TEN, JACK, KNIGHT, QUEEN, KING];

const check = function (type, value) {
    if (type.includes(value)) {
        return value;
    } else {
        throw new Error(`Value "${value}" not in ${type}`);
    }
};

// Private properties of a Card
const _rank = new WeakMap();
const _suit = new WeakMap();
const _color$1 = new WeakMap();
const _deck = new WeakMap();
const _faceUp = new WeakMap();

/**
 * A Card models a playing card.
 *
 * @extends Model
 */
class CardModel extends Model {

    /** 
     * Create a CardModel based on a specification in terms of suit, rank, and the
     * deck it belongs to. Optionally, you can indicate if the card should be
     * face up initially or not. By default a card faces down. Based on this
     * specification the card's color is determined.
     *
     * Note. You cannot create a joker card using this constructor. Us the
     * static @see joker method to create a joker card.
     *
     * @param {Object} specification - the card's specification
     * @param {symbol} specification.suit - the suit of the card
     * @param {symbol} specification.rank - the rank of the card
     * @param {Deck} deck - the deck the card belongs to. Each card belongs to
     * a deck.
     * @param {boolean} [faceUp = false] - is the card facing up initially or
     * not?
     */
    constructor(specification, deck, faceUp = false) {
        super([EVENT_CARD_TURN]);

        _suit.set(this, check(SUIT, specification.suit));
        _rank.set(this, check(RANK, specification.rank));
        _color$1.set(this, [DIAMONDS, HEARTS].includes(specification.suit) ? RED : BLACK);
        _deck.set(this, deck);
        _faceUp.set(this, faceUp);
    }

    /**
     * Create a joker card. Joker cards are special cards. Joker cards have no
     * suit nor rank. A joker does have a color, belongs to a deck, and, like
     * cards, they can be optionally created to face up.
     *
     * @param {symbol} color This joker's color.
     * @param {Deck} deck The deck this joker belongs to.
     * @param {boolean} [faceUp = false] - is the joker card facing up
     * initially or not?
     *
     * @returns {CardModel} The newly created joker card.
     */
    static joker(color, deck, faceUp = false) {
        const card = new CardModel({suit: SPADES, rank: ACE}, deck, faceUp);
        _rank.set(card, undefined);
        _suit.set(card, undefined);
        _color$1.set(card, check(COLOR, color));
        return card;
    }

    /**
     * Get the rank of this card. A joker card has rank undefined.
     *
     * @returns {symbol} The rank of this card.
     */
    get rank() {
        return _rank.get(this);
    }

    /**
     * Get the suit of this card. A joker card has suit undefined.
     *
     * @returns {symbol} The suit of this card.
     */
    get suit() {
        return _suit.get(this);
    }

    /**
     * Get the color of this card.
     *
     * @returns {symbol} The color of the card.
     */
    get color() {
        return _color$1.get(this);
    }

    /**
     * Get the deck this card belongs to.
     *
     * @returns {Deck} The deck this card belongs to.
     */
    get deck() {
        return _deck.get(this);
    }

    /**
     * Get the number of pips on this card. If this card is a joker card or a
     * face card, this property is 0.
     *
     * @returns {number} The number of pips of this card.
     */
    get pips() {
        const rankIndex = RANK.indexOf(_rank.get(this));
        return 0 <= rankIndex && rankIndex < 10 ? rankIndex + 1 : 0;
    }

    /**
     * Get the name of this card, which follows the pattern "rank of suit" or
     * "color joker".
     *
     * @return {string} The name of this card.
     */
    get name() {
        let name = "";
        if (this.isJoker()) {
            name = `${symbolToString(this.color)} joker`;
        } else {
            name = `${symbolToString(this.rank)} of ${symbolToString(this.suit)}`;
        }
        return name;
    }

    /**
     * Is this a joker card?
     *
     * @return {Boolean} True if this card is a joker card, false otherwise.
     */
    isJoker() {
        return undefined === this.rank || undefined === this.suit;
    }

    /**
     * Is this card a jack?
     *
     * @returns {Boolean} True if this card is a jack, false otherwise.
     */
    isJack() {
        return JACK === this.rank;
    }

    /**
     * Is this card a knight?
     *
     * @return {Boolean} True is this card is a knight, false otherwise.
     */
    isKnight() {
        return KNIGHT === this.rank;
    }

    /**
     * Is this card a queen?
     *
     * @return {Boolean} True if this card is a queen, false otherwise.
     */
    isQueen() {
        return QUEEN === this.rank;
    }

    /**
     * Is this card a king?
     *
     * @return {Boolean} True if this card is a king, false otherwise.
     */
    isKing() {
        return KING === this.rank;
    }

    /**
     * Is this card an ace?
     *
     * @return {Boolean} True if this card is an ace, false otherwise.
     */
    isAce() {
        return ACE === this.rank;
    }

    /**
     * Is this a face card? 
     *
     * @return {Boolean} True if this card is a jack, knight, queen or king,
     * false otherwise. 
     *
     * Note. In some card games the ace is also considered a face card.
     */
    isFaceCard() {
        return this.isJack() || 
            this.isKnight() ||
            this.isQueen() ||
            this.isKing();
    }

    /**
     * Is this a pips card?
     *
     * @return {Boolean} True if this card has 1 — 10 pips, false otherwise.
     * 
     * Note. In some card games the ace is not considered a pips card.
     */
    isPipsCard() {
        return 0 < this.pips;
    }

    /**
     * Belongs this card to the spades?
     *
     * @return {Boolean} True if this card's suit is spades, false otherwise.
     */
    isSpades() {
        return SPADES === this.suit;
    }

    /**
     * Belongs this card to the hearts?
     *
     * @return {Boolean} True if this card's suit is hearts, false otherwise.
     */
    isHearts() {
        return HEARTS === this.suit;
    }

    /**
     * Belongs this card to the diamonds?
     *
     * @return {Boolean} True if this card's suit is diamonds, false
     * otherwise.
     */
    isDiamonds() {
        return DIAMONDS === this.suit;
    }

    /**
     * Belongs this card to the clubs?
     *
     * @return {Boolean} True if this card's suit is clubs, false otherwise.
     */
    isClubs() {
        return CLUBS === this.suit;
    }

    /**
     * Is this card facing up?
     *
     * @return {Boolean} True if this card is facing up, false if it is facing
     * down.
     */
    isFacingUp() {
        return _faceUp.get(this);
    }

    /**
     * Is this card facing down?
     *
     * @return {Boolean} True if this card is facing down, false if it is
     * facing up.
     */
    isFacingDown() {
        return !this.isFacingUp();
    }

    /**
     * Turn this card around.
     *
     * @fires EVENT_CARD_TURN
     */
    turn() {
        _faceUp.set(this, !_faceUp.get(this));
        this.emit(EVENT_CARD_TURN);
    }

    /**
     * Is this a red card?
     *
     * @return {Boolean} True true if this card belongs to the hearts or
     * diamonds, or is the red joker.
     */
    isRed() {
        return RED === this.color;
    }

    /**
     * Is this a black card?
     *
     * @return {Boolean} True if this card belongs to the spades or clubs, or
     * is the black joker.
     */
    isBlack() {
        return BLACK === this.color;
    }

    /**
     * The background of this card is the color of the deck this card belongs
     * to. 
     *
     * @return {string} ["black"] A string representation of a color, such as a HTML
     * name, like "red" or a hexadecimal number like "#ff00ae".
     */
    get backColor() {
        return this.deck.color;
    }

    /**
     * Is this card the same card as another card? For two cards to be equal,
     * they need to have the same suit, rank, color, and should be part of the
     * same deck.
     *
     * @param {Card} other - The other card to compare with this card.
     *
     * @returns {Boolean} True if this card and the other card are the same,
     * false otherwise.
     */
    equals(other) {
        return this.suit === other.suit &&
            this.rank === other.rank &&
            this.color === other.color &&
            this.deck === other.deck;
    }

    /**
     * Return a string representation of this card. The difference with
     * #toUnicode() is that is returns the "back" unicode character when this
     * card is facing down.
     *
     * @returns {string} This card's string representation.
     */
    toString() {
        return this.isFacingDown() ? String.fromCodePoint(BACK) : this.toUnicode();
    }

    /**
     * Convert this card to a unicode symbol. See {@link https://en.wikipedia.org/wiki/Playing_cards_in_Unicode|the wikipedia page on playing cards in Unicode} for more information.
     *
     * @return {string} The unicode symbol representation of this card.
     */
    toUnicode() {
        let codePoint = 0;

        if (this.isJoker()) {
            codePoint = this.isRed() ? 0x1F0BF : 0x1F0CF;
        } else {
            codePoint = 0x1F0A0 + SUIT.indexOf(this.suit) * HEX + RANK.indexOf(this.rank) + 1;
        }

        return String.fromCodePoint(codePoint);
    }
  
    /**
     * Create a new card based on a unicode representation, the deck it belongs
     * to and if it should initially be facing up. See {@link https://en.wikipedia.org/wiki/Playing_cards_in_Unicode|the wikipedia page on playing cards in Unicode} for more information.
     *
     * @param {String} cardChar A single unicode character representing a card.
     * @param {Deck} deck The deck this card belongs to.
     * @param {Boolean} faceUp This card is facing up.
     *
     * @returns {CardModel} The card corresponding to the unicode representation of
     * a card.
     *
     * @throws {Error} When the unicode representation is not exactly one
     * character
     * @throws {Error} When the unicode representation cannot be converted to
     * a card.
     */
    static fromUnicode(cardChar, deck, faceUp = false) {
        if (1 !== [...cardChar].length) {
            // Got the idea to check for unicode length via array from
            // https://mathiasbynens.be/notes/javascript-unicode
            throw new Error(`Expected one character, but got ${cardChar.length} characters instead: "${cardChar}"`);
        }

        // The unicode card symbols contain two bytecodes: combine them to one
        // codepoint.
        const codePoint = cardChar.codePointAt(0);
        const rankPart = codePoint % HEX;
        const suitPart = Math.trunc(codePoint / HEX);

        if (0xF === rankPart && (0x1F0B === suitPart || 0x1F0C === suitPart)) {
            return CardModel.joker(0x1F0B === suitPart ? RED : BLACK, deck, faceUp);
        } else if (0 < rankPart && rankPart < 0xF && 0x1F0A <= suitPart && suitPart <= 0x1F0D) {
            const rank = RANK[rankPart - 1];
            const suit = SUIT[suitPart - 0x1F0A];
            return new CardModel({rank, suit}, deck, faceUp);
        } else {
            throw new Error(`Unable to convert character with code point ${codePoint.toString(HEX)} to a card.`);
        }
    }

}

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

const createDeck = function (deck, jokers = false) {
    const createCard = function (codePoint) {
        return CardModel.fromUnicode(String.fromCodePoint(codePoint), deck);
    };

    const cards = [
        createCard(0x1F0A1), // ace of spades
        createCard(0x1F0A2), // two of spades
        createCard(0x1F0A3), // three of spades
        createCard(0x1F0A4), // four of spades
        createCard(0x1F0A5), // five of spades
        createCard(0x1F0A6), // six of spades
        createCard(0x1F0A7), // seven of spades
        createCard(0x1F0A8), // eight of spades
        createCard(0x1F0A9), // nine of spades
        createCard(0x1F0AA), // ten of spades
        createCard(0x1F0AB), // jack of spades
        createCard(0x1F0AD), // queen of spades
        createCard(0x1F0AE), // king of spades

        createCard(0x1F0B1), // ace of hearts
        createCard(0x1F0B2), // two of hearts
        createCard(0x1F0B3), // three of hearts
        createCard(0x1F0B4), // four of hearts
        createCard(0x1F0B5), // five of hearts
        createCard(0x1F0B6), // six of hearts
        createCard(0x1F0B7), // seven of hearts
        createCard(0x1F0B8), // eight of hearts
        createCard(0x1F0B9), // nine of hearts
        createCard(0x1F0BA), // ten of hearts
        createCard(0x1F0BB), // jack of hearts
        createCard(0x1F0BD), // queen of hearts
        createCard(0x1F0BE), // king of hearts

        createCard(0x1F0C1), // ace of diamonds
        createCard(0x1F0C2), // two of diamonds
        createCard(0x1F0C3), // three of diamonds
        createCard(0x1F0C4), // four of diamonds
        createCard(0x1F0C5), // five of diamonds
        createCard(0x1F0C6), // six of diamonds
        createCard(0x1F0C7), // seven of diamonds
        createCard(0x1F0C8), // eight of diamonds
        createCard(0x1F0C9), // nine of diamonds
        createCard(0x1F0CA), // ten of diamonds
        createCard(0x1F0CB), // jack of diamonds
        createCard(0x1F0CD), // queen of diamonds
        createCard(0x1F0CE), // king of diamonds

        createCard(0x1F0D1), // ace of clubs
        createCard(0x1F0D2), // two of clubs
        createCard(0x1F0D3), // three of clubs
        createCard(0x1F0D4), // four of clubs
        createCard(0x1F0D5), // five of clubs
        createCard(0x1F0D6), // six of clubs
        createCard(0x1F0D7), // seven of clubs
        createCard(0x1F0D8), // eight of clubs
        createCard(0x1F0D9), // nine of clubs
        createCard(0x1F0DA), // ten of clubs
        createCard(0x1F0DB), // jack of clubs
        createCard(0x1F0DD), // queen of clubs
        createCard(0x1F0DE), // king of clubs
    ];

    if (jokers) {
        cards.push(createCard(0x1F0CF)); // black joker
        cards.push(createCard(0x1F0BF)); // red joker
    }

    return cards;
};


const _color = new WeakMap();
const _hasJokers = new WeakMap();
const _cards$1 = new WeakMap();

/**
 * A Deck is a {@link https://en.wikipedia.org/wiki/Standard_52-card_deck|standard 52-card deck} 
 * and, optionally, with two joker cards.
 *
 * @extends GameElement
 */
class Deck extends GameElement {

    /**
     * Construct a new Deck. The deck's color is also its name.
     *
     * @param {string} [color = "red"] - the background color of this deck.
     * @param {Boolean} [jokers = false] - should this deck include joker
     * cards or not?
     */
    constructor(game, color = "red", jokers = false) {
        super(game, color);
        _color.set(this, color);
        _hasJokers.set(this, jokers);
        _cards$1.set(this, createDeck(this, jokers));
    }

    /**
     * This deck's card's back-side color.
     *
     * @return {string} the color of the back of the cards of this deck.
     */
    get color() {
        return _color.get(this);
    }

    /**
     * Does this deck contain jokers?
     *
     * @return {Boolean} true if this deck contains joker cards, false
     * otherwise.
     */
    get hasJokers() {
        return _hasJokers(this);
    }

    /**
     * Get the cards of this deck.
     *
     * @return {Card[]} the cards of this deck.
     */
    get cards() {
        return _cards$1.get(this);
    }
}

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
/**
 * PileInvariantError is thrown when a PileModel's invariant is invalidated.
 */
const PileInvariantError = class extends Error {
};

/**
 * PileIndexOutOfBoundsErrow is thrown when a CardModel outside a PileModel's
 * bounds is being accessed.
 */
const PileIndexOutOfBoundsError = class extends Error {
};

/**
 * @function PILE_ACTIONS.INSERT
 * Insert card in cards at index
 *
 * @param {CardModel[]} cards - list of cards
 * @param {CardModel} card - the card to insert
 * @param {Integer} index - the place in cards to insert the card
 *
 * @return {CardModel[]} the list of cards with card inserted at index
 */
const insert = function (cards, card, index) {
    cards.splice(index, 0, card);
    return cards;
};

/**
 * @function PILE_ACTIONS.ADD
 * Add card to the top of cards.
 *
 * @param {CardModel[]} cards - list of cards
 * @param {CardModel} card - the card to add to the list of cards
 *
 * @return {CardModel[]} the list of cards with card added to it
 */
const add = function (cards, card) {
    return insert(cards, card, cards.length);
};

/**
 * @function PILE_ACTIONS.PICK
 * Pick a card at random from cards
 *
 * @param {CardModel[]} cards - list of cards
 *
 * @return {Array} an array with the list of card minus the picked card, and
 * the picked card.
 */
const pick = function (cards) {
    const RANDOM_INDEX = Math.floor(Math.random() * cards.length);
    const rest = cards;
    const picked = rest.splice(RANDOM_INDEX, 1)[0];
    return [rest, picked];
};

/**
 * @function PILE_ACTIONS.TAKE
 * Take a card from list of cards
 *
 * @param {CardModel[]} cards - list of cards
 * @param {integer} index - the index of the card to take
 *
 * @return {Array} an array with the list of card minus the taken card, and
 * the taken card.
 */
const take = function (cards, index = cards.length - 1) {
    const rest = cards;
    const taken = rest.splice(index, 1)[0];
    return [rest, taken];
};

/**
 * @function PILE_ACTIONS.MERGE
 * Merge other lists of cards with a list of cards
 *
 * @param {CardModel[]} cards - list of cards
 * @Param {cardModel[][]} others - list of lists of cards
 *
 * @return {CardModel[]} list with all lists of cards merged into one list
 */
const merge = function (cards, others) {
    return cards.concat(...others);
};

/**
 * @function PILE_ACTION.SHUFFLE
 * Shuffle a list of cards
 *
 * @param {CardModel[]} cards - list of cards
 *
 * @return {CardModel[]} shuffled list of cards
 */
const shuffle = function (cards) {
    return cards.sort(() => Math.random() - 0.5);
};

const TAUTOLOGY$1 = function (pile) { return true; };

const _cards = new WeakMap();
const _invariant = new WeakMap();

// Check the Array with cards newCards against the pile's invariant. If it
// succeeds, set the newCards as the pile's list of cards, otherwise throw a
// PileInvariantError with errorMessage.
const checkInvariant = function (pile, newCards, errorMessage = "") {
    if (!pile.invariant(newCards)) {
        throw new PileInvariantError(`${errorMessage}.\n\t${pile.invariant}`);
        return false;
    }

    _cards.set(pile, newCards);
    return true;
};

// Create a copy of this pile's cards as an Array;
const copy = function (pile) {
    return _cards.get(pile).slice();
};

/**
 * A pile of cards. 
 *
 * @extends Model
 */
class PileModel extends Model {
    /**
     * Create an empty pile and set its data invariant. This data invariant
     * should always hold.
     *
     * @param {Function} [invariant = TAUTOLOGY] - the data invariant for this
     * pile.
     * @param {CardModel[]|Deck} [initial = []] - create a pile from a list of cards
     *
     * @throw {PileInvariantError} Invariant invalidated by adding this card
     */
    constructor(invariant = TAUTOLOGY$1, initial = []) {
        super();
        _invariant.set(this, invariant);

        let initialCards = initial instanceof Deck ? initial.cards : initial;
        initialCards = Array.isArray(initialCards) ? initialCards : [];

        checkInvariant(
            this, 
            initialCards,
            `Initial cards does not fullfill data invariant`
        );
    }

    /**
     * Get the data invariant for this pile
     *
     * @return {Function} the data invariant
     */
    get invariant() {
        return _invariant.get(this);
    }

    /**
     * The number of cards in this pile.
     *
     * @return {integer} The number of cards in this pile.
     */
    get count() {
        return _cards.get(this).length;
    }

    /**
     * Get a list of the cards in this pile.
     *
     * @return {Card[]} The cards in this pile as an array.
     */
    get cards() {
        return _cards.get(this);
    }

    /**
     * Is this pile empty?
     *
     * @return {Boolean} True if this pile has no cards, false otherwise.
     */
    isEmpty() {
        return 0 >= this.count;
    }

    /**
     * Inspect a card in this pile. The pile does not change.
     *
     * @param {integer} [index = top] - the index of the card to
     * inspect. Defaults to the top card
     *
     * @return {Card} the card to inspect.
     */
    inspect(index = this.count - 1) {
        return _cards.get(this)[index];
    }

    /**
     * Iterator over all cards of this pile.
     *
     * @return {iterator} 
     */
    *each() {
        for (const card of _cards.get(this)) {
            yield card;
        }
    }

    /**
     * Apply callback to each card in this pile.
     *
     * @param {Function} callback - the function to apply to each card in this
     * pile
     */
    forEach(callback) {
        _cards.get(this).forEach(callback);
    }

    /**
     * Add a card to this pile.
     *
     * @param {CardModel} card - the card to add.
     *
     * @return {PileModel} Return this pile.
     *
     * @fire EVENT_MODEL_CHANGE
     *
     * @throw {PileInvariantError} Invariant invalidated by adding this card
     */
    add (card) {
        const added = add(copy(this), card);
        const valid = checkInvariant(
            this,
            added,
            `Cannot add ${card.toUnicode()}`
        );
        
        if (valid) {
            this.emit(EVENT_MODEL_CHANGE, this);
        }

        return this;
    }
    
    /**
     * Insert a card in this pile.
     *
     * @param {CardModel} card - the card to add.
     * @param {integer} [index = pile.count] - the index to insert the card in
     * this pile. Defaults to the end of the pile.
     *
     * @return {PileModel} Return this pile.
     *
     * @fire EVENT_MODEL_CHANGE
     *
     * @throw {PileIndexOutOfBoundsError} Index out of bounds.
     * @throw {PileInvariantError} Invariant invalidated by inserting this card at this index
     */
    insert (card, index) {
        if (0 > index || index > this.count) {
            throw new PileIndexOutOfBoundsError();
        }

        const inserted = insert(copy(this), card, index);
        const valid = checkInvariant(
            this,
            inserted,
            `Cannot insert ${card.toUnicode()} at index ${index}`
        );
        
        if (valid) {
            this.emit(EVENT_MODEL_CHANGE, this);
        }

        return this;
    }

    /**
     * Pick a random card from this pile; the pile contains one card less
     * hereafter.
     *
     * @return {Card} the picked card.
     *
     * @fire EVENT_MODEL_CHANGE
     *
     * @throw {PileInvariantError} Invariant invalidated by picking a card
     * from this pile
     */
    pick() {
        const [rest, picked] = pick(copy(this));
        const valid = checkInvariant(
            this,
            rest,
            `Cannot pick ${picked.toUnicode()}`
        );
        
        if (valid) {
            this.emit(EVENT_MODEL_CHANGE, this);
        }

        return picked;
    }

    /**
     * Take a card from this pile. The pile contains one card less.
     *
     * @param {integer} [index = this.count -1] - the index of the card to
     * take. Defaults to the top card.
     *
     * @return {Card} the top card
     *
     * @fire EVENT_MODEL_CHANGE
     *
     * @throw {PileInvariantError} Invariant invalidated taking card from
     * index
     */
    take(index = this.count - 1) {
        const [rest, taken] = take(copy(this), index);
        const valid = checkInvariant(
            this,
            rest,
            `Cannot take ${taken.toUnicode()} from ${index}`
        );
        
        if (valid) {
            this.emit(EVENT_MODEL_CHANGE, this);
        }

        return taken;
    }

    /**
     * Shuffle this pile.
     *
     * @return {PileModel} this pile, shuffled.
     *
     * @fire EVENT_MODEL_CHANGE
     *
     * @throw {PileInvariantError} Invariant invalidated by shuffling pile
     */
    shuffle() {
        const valid = checkInvariant(
            this,
            shuffle(copy(this)),
            `Shuffling results in an invalid pile`
        );
        
        if (valid) {
            this.emit(EVENT_MODEL_CHANGE, this);
        }

        return this;
    }

    /**
     * Merge another pile with this pile. Other pile will be empty afterwards.
     *
     * @param {PileModel} other - the other pile to merge with this one.
     *
     * @return {PileModel} this pile.
     *
     * @fire EVENT_MODEL_CHANGE
     *
     * @throw {PileInvariantError} Invariant invalidated by merging the other
     * piles with this pile; or others' invariant invalidated by emptying them
     */
    merge(...others) {
        const merged = merge(copy(this), others.map((o) => _cards.get(o)));
        
        let valid = checkInvariant(
            this,
            merged,
            `Merge pile with ${others} is invalid`
        );

        valid = valid && others.every((otherPile) => checkInvariant(
            otherPile,
            [],
            `Empty pile is invalid`
        ));
        
        if (valid) {
            this.emit(EVENT_MODEL_CHANGE, this);
        }

        return this;
    }
}

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
const EVENT_CLICK = Symbol("event:view:click");
const EVENT_DRAG = Symbol("event:view:drag");
const EVENT_DRAG_START = Symbol("event:view:drag-start");
const EVENT_DRAG_END = Symbol("event:view:drag-end");
const EVENT_DRAG_OVER = Symbol("event:view:drag-over");
const EVENT_DROP = Symbol("event:view:drop");

const _parent = new WeakMap();
const _model$1 = new WeakMap();
const _config = new WeakMap();

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
        super([EVENT_CLICK, EVENT_DRAG_START, EVENT_DRAG, EVENT_DRAG_END, EVENT_DRAG_OVER, EVENT_DROP]);
        _parent.set(this, parent);
        _model$1.set(this, model);
        _config.set(this, {});
        
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
     * Get this view's model.
     */
    get model() {
        return _model$1.get(this);
    }

    /**
     * Get this view's configuration.
     */
    get config() {
        return _config.get(this);
    }

    /**
     * Render this view. Has to be implemented for all subclasses of View.
     *
     * @param {float} [x = 0] - the x coordinate to render this view.
     * @param {float} [y = 0] - the y coordinate to render this view.
     */
    render() {}


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
const createClickableAndDraggableElement = function (view) {
    const group = svg.group({
        "class": `view ${view.config.name || ""}`
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
const _x$1 = new WeakMap();
const _y$1 = new WeakMap();
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
        return _x$1.get(this);
    }

    /**
     * Set the x coordinate.
     *
     * @param {float} newX - the new x coordinate.
     */
    set x(newX) {
        _x$1.set(this, newX);
    }

    /**
     * Set the y coordinate.
     *
     * @param {float} newY - the new y coordinate.
     */
    set y(newY) {
        _y$1.set(this, newY);
    }

    /**
     * Get the y coordinate.
     *
     * @return {float} the y coordinate.
     */
    get y() {
        return _y$1.get(this);
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
/**
 * View of a card.
 *
 * @extends GView
 */
class CardView extends GView {
    /**
     * Create a new card view.
     *
     * @param {View} parent - the parent view
     * @param {CardModel} model - the card model this view represents
     * @param {float} [x = 0] - the x coordinate.
     * @param {float} [y = 0] - the y coordinate.
     * @param {object} [config = {}] - the configuration of this view. Set
     * property "cardSupplier" to choose a card supplier; defaults to the font
     * based card supplier.
     */
    constructor(parent, model, x = 0, y = 0, config = {}) {
        config.name = "card";
        super(parent, model, x, y, config);
        this.enableDragging();
        this.render();
    }

    /**
     * Render this card
     */
    render() {
        if (this.element.hasChildNodes()) {
            this.element.removeChild(this.element.lastChild);
        }
        this.element.appendChild(CARD_SUPPLIER.createCard(this.model));
    }
}

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
const CARD_OFFSET = 0.2;

/**
 * View representing a pile
 *
 * @extends GView
 */
class PileView extends GView {
    /**
     * Create a new pile view
     *
     * @param {View} parent - this view's parent
     * @param {Pile} model - the pile this view represents
     * @param {float} [x = 0] - the x coordinate.
     * @param {float} [y = 0] - the y coordinate.
     * @param {object} [config = {}] - initial configuration of this pile
     * view.
     */
    constructor(parent, model, x = 0, y = 0, config = {}) {
        config.name = "pile";
        super(parent, model, x, y, config);
        this.disableDragging();
        this.element.appendChild(CARD_SUPPLIER.createBase());

        this.render();
    }

    /**
     * Rending this pile
     */
    render() {
        for (const cardElement of this.element.querySelectorAll("g.card")) {
            this.element.removeChild(cardElement);
        }

        let index = 0;
        for (const card of this.model.each()) {
            new CardView(this, card, 0, CARD_OFFSET * index);
            index++;
        }
    }

    /**
     * Configure this pile view. 
     *
     * @param {object} [config = {}] - the configuration to set on this view.
     */
    configure(config = {}) {
        if (!config.hasOwnProperty("offset")) {
            config.offset = CARD_OFFSET;
        }
        super.configure(config);
    }

}

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
// Fan types
const FAN_NONE = Symbol("fan:none");
const FAN_UP = Symbol("fan:up");
const FAN_DOWN = Symbol("fan:down");
const FAN_LEFT = Symbol("fan:left");
const FAN_RIGHT = Symbol("fan:right");
const FAN_ARC = Symbol("fan:arc");
const FAN_TYPES = [FAN_NONE, FAN_UP, FAN_DOWN, FAN_LEFT, FAN_RIGHT, FAN_ARC];
        
/**
 * @module
 */
const _view = new WeakMap();
const _model = new WeakMap();
const _fanning = new WeakMap();

const _x = new WeakMap();
const _y = new WeakMap();
const _rotation = new WeakMap();

/**
 * A pile in a card game.
 *
 * @extends GameElement
 */
class Pile extends GameElement {
    constructor(game, specification = {}) {
        if (!specification.hasOwnProperty("name")) {
            throw new Error("No name specified in pile");
        }

        super(game, specification.name);


        let cards = [];
        if (specification.hasOwnProperty("deck")) {
            const deck = game.deck(specification.deck);
            if (deck) {
                cards = deck.cards;
            }
        }

        _model.set(this, new PileModel(specification.invariant, cards));

        _fanning.set(this, specification.fanning || FAN_NONE);

        const position = specification.position || {x: 0, y: 0};
        _x.set(this, parseFloat(position.x) || 0);
        _y.set(this, parseFloat(position.y) || 0);

        _rotation.set(this, parseFloat(specification.rotation || 0));

        _view.set(this, new PileView(this.game.table, this.model, this.x, this.y));
    }

    /**
     * Update this pile's view.
     */
    updateView() {
        if (this.view) {
            this.view.x = _x.get(this);
            this.view.y = _y.get(this);
            this.view.render();
        }
    }

    /**
     * Get this pile's underlying model.
     *
     * @return {PileModel} the underlying model.
     */
    get model() {
        return _model.get(this);
    }

    /**
     * Get this pile's view.
     *
     * @return {PileView} this pile's view
     */
    get view() {
        return _view.get(this);
    }

    /**
     * get the fan type of this pile.
     *
     * @return {symbol} this pile's fan type.
     */
    get fanning() {
        return _fanning.get(this);
    }

    /**
     * Is this pile fanned?
     *
     * @return {Boolean} true if this pile is fanned, false otherwise.
     */
    isFanned() {
        return !this.isSquared();
    }
    
    /**
     * Is this pile squared?
     *
     * @return {Boolean} true if this pile is squared, false otherwise.
     */
    isSquared() {
        return FAN_NONE === this.fanning;
    }

    /**
     * Set the fanning for this pile.
     *
     * @param {Symbol|string} [fanType = FAN_NONE] - the fan type
     */
    set fanning(fanType = FAN_NONE) {
        let type = FAN_NONE;
        if (typeof fanType === "string" || fanType instanceof String) {
            if (fanType === "left") {
                type = FAN_LEFT;
            } else if (fanType === "right") {
                type = FAN_RIGHT;
            } else if (fanType === "up") {
                type = FAN_UP;
            } else if (fanType === "down") {
                type = FAN_DOWN;
            } else if (fanType === "arc") {
                type = FAN_ARC;
            }
        } else if (FAN_TYPES.includes(fanType)) {
                type = fanType;
        }

        _fanning.set(this, type);
        this.updateView();
    }

    /**
     * Get the fanning of this pile.
     *
     * @return {symbol} the fanning type of this pile.
     */
    get fanning() {
        return _fanning.get(this);
    }


    /**
     * Set the x coordinate of this pile.
     *
     * @param {float} newX - the new x coordinate.
     */
    set x(newX) {
        _x.set(this, newX);
        this.updateView();
    }

    /**
     * Get the x coordinate of this pile.
     *
     * @return {float} the x coordinate fo this pile.
     */
    get x() {
        return _x.get(this);
    }

    /**
     * Set the y coordinate of this pile.
     *
     * @param {float} newY - the new y coordinate.
     */
    set y(newY) {
        _y.set(this, newY);
        this.updateView();
    }

    /**
     * Get the y coordinate of this pile.
     *
     * @return {float} the y coordinate fo this pile.
     */
    get y() {
        return _y.get(this);
    }

    /**
     * Set the rotation of this pile.
     *
     * @param {float} newRotation - the new rotation in degrees
     */
    set rotation(newRotation) {
        _rotation.set(this, newRotation);
        this.updateView();
    }

    /**
     * Get the rotation of this pule.
     *
     * @return {float} the rotation of this pile in degrees
     */
    get rotation() {
        _rotation.get(this);
    }

}

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
const _action = new WeakMap();

/**
 * An action in a card game.
 *
 * @extends GameElement
 */
class Action extends GameElement {

    /**
     * Create a new action.
     *
     * @param {Game} game - the game this action belongs to.
     * @param {string} name - the name of this action.
     * @param {Function} action - the actial action to perform.
     */
    constructor(game, name, action) {
        super(game, name);
        _action.set(this, action);
    }

    

    /**
     * Run this action.
     */
    run(...args) {
        _action.get(this).apply(this.game, args);
    }
}

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

const _layout$1 = new WeakMap();

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
        _layout$1.set(this, layout);
    }

    /**
     * Get this table's layout.
     *
     * @return {Layout} this table's layout.
     */
    get layout() {
        return _layout$1.get(this);
    }
    
}

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
const _dragElement = new WeakMap();

/**
 * Table represents the table a card game is played on. All viewed elements
 * are on top of the table.
 *
 * @extends GView
 */
class TableView extends GView {

    /**
     *  Create a new playing table.
     *
     *  @param {TableModel} model - the table model.
     *  @param {float} [x = 0] - the x coordinate.
     *  @param {float} [y = 0] - the y coordinate.
     *  @param {Object} [config = {}] - the initial configuration.
     */
    constructor(model = new TableModel(), x = 0, y = 0, config = {}) {
        config.name = "table";
        super(undefined, model, x, y, config);
        this.element.appendChild(svg.rectangle(0, 0, "100%", "100%", {
            "fill": config.fill || "green"
        }));
        this.render();
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
        view.parent.render();
    }

}

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

CARD_SUPPLIER.engine = new SVGCardsCardRenderEngine("/SVG-cards/svg-cards.svg");
//CARD_SUPPLIER.engine = new UnicodeCardRenderEngine();

const findElement = function (iterable, name) {
    for (element of iterable) {
        if (element.name === name) {
            return element;
        }
    }
    return undefined;
};

const _layout = new WeakMap();
const _piles = new WeakMap();
const _decks = new WeakMap();
const _actions = new WeakMap();
const _table = new WeakMap();

/**
 * Game 
 */
class Game {
    /**
     * Create a new game.
     *
     * @param {object} [specification = {}] - the initial specification of
     * this game.
     */
    constructor(specification = {}) {
        // Handle specification

        _table.set(this, new TableView());
        _layout.set(this, specification.layout || new Layout());


        _decks.set(this, new Set());
        if (specification.hasOwnProperty("decks") && Array.isArray(specification.decks)) {
            specification
                .decks
                .forEach((deck) => this.decks.add(new Deck(this, deck.color || deck.name, deck.jokers || false)));
        }

        _piles.set(this, new Set());
        if (specification.hasOwnProperty("piles") && Array.isArray(specification.piles)) {
            specification
                .piles
                .forEach((pile) => this.piles.add(new Pile(this, pile)));
        }
       
        _actions.set(this, new Set());
        if (specification.hasOwnProperty("actions") && Array.isArray(specification.actions)) {
            specification
                .actions
                .forEach((action) => this.actions.add(new Action(this, action.name, action.action)));
        }
        
        const setup = this.action("setup");
        if (setup) {
            setup.run();
        }
    }

    /**
     * Start this game;
     */
    start() {
        console.log("Start!");
    }

    /**
     * Get this game's table view
     */
    get table() {
        return _table.get(this);
    }

    /**
     * Get the list of piles in this game.
     *
     * @return {Pile[]} the list of piles in this game.
     */
    get piles() {
        return _piles.get(this);
    }

    /**
     * Get a pile by name.
     *
     * @param {String} name - the name of the pile to get
     * @return {Pile} the pile with name or undefined if it is unknown in this
     * game.
     */
    pile(name) {
        return findElement(this.piles, name);
    }

    /**
     * Get the decks used in this game.
     *
     * @return {Deck[]} the list of decks used in this game.
     */
    get decks() {
        return _decks.get(this);
    }

    /**
     * Get a deck by name or color.
     *
     * @param {String} name - the name or color of the deck to get
     * @return {Deck} the deck with name or undefined if it is unknown in this
     * game.
     */
    deck(name) {
        return findElement(this.decks, name);
    }

    /**
     * Get the actions available in this game.
     *
     * @return {Action[]} the list of actions in this game.
     */
    get actions() {
        return _actions.get(this);
    }

    /**
     * Get an action by name.
     *
     * @param {String} name - the name of the action to get
     * @return {Action} the action with name or undefined if it is unknown in
     * this game.
     */
    action(name) {
        return findElement(this.actions, name);
    }

    /**
     * Get layout of this game's playing table.
     *
     * return {Layout}
     */
    get layout() {
        return _layout.get(this);
    }

}

const gameSpecification = {
    actions: [{
        name: "setup",
        action: function () {
            const deck = this.deck("red");
            const pile = this.pile("left").model;

            let i = 0;
            while (i < 7) {
                i++;
                pile.add(deck.cards.pop());
            }
            pile.inspect().turn();
        }
    }],
    decks: [{
        color: "red",
        jokers: false
    }],
    piles: [{
        name: "left",
        position: {
            x: 10,
            y: 10
        }
    }, {
        name: "right",
        position: {
            x: 210,
            y: 10
        }
    }]
};
const svgElt = document.getElementById("table");
const game = new Game(gameSpecification);
svgElt.appendChild(game.table.element);


let piles = ["left", "right"];
game.table.on(EVENT_CLICK, () => {
    const [sourcePile, destinationPile] = piles;

    game.pile(destinationPile).model.add(game.pile(sourcePile).model.take());

    if (game.pile(sourcePile).model.isEmpty()) {
        piles = [destinationPile, sourcePile];
    }
});

game.start();
