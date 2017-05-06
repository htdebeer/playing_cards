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
import {PileModel} from "../model/PileModel.js";
import {PileView} from "../view/PileView.js";


const FAN_NONE = Symbol("fan:none");
const FAN_HORIZONTAL = Symbol("fan:horizontal");
const FAN_VERTICAL = Symbol("fan:vertical");
const FAN_ARC = Symbol("fan:arc");

const setFanning = function (pile, specification) {
    if (specification.fanning) {
        if (fanning === "horizontal") {
            _fanning.set(pile, FAN_HORIZONTAL);
        } else if (fanning === "vertical") {
            _fanning.set(pile, FAN_VERTICAL);
        } else if (fanning === "arc") {
            _fanning.set(pile, FAN_ARC);
        } else {
            _fanning.set(pile, FAN_NONE);
        }
    } else {
        _fanning.set(pile, FAN_NONE);
    }
};

/**
 * @module
 */
const _model = new WeakMap();
const _fanning = new WeakMap();

/**
 * A pile in a card game.
 *
 * @extends GameElement
 */
class Pile extends GameElement {
    constructor(name, specification = {}) {
        super(name);

        _model.set(this, new PileModel());
        setFanning(this, specification);
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



}

export {
    Pile,
    FAN_NONE,
    FAN_HORIZONTAL,
    FAN_VERTICAL,
    FAN_ARC,
};
