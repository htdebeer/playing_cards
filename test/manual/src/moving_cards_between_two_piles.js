import {Deck} from "../../../src/Deck.js";
import {CARD_SUPPLIER} from "../../../src/CardSupplier.js";
import {SVGCardsCardRenderEngine} from "../../../src/card_render_engine/SVGCardsCardRenderEngine.js";

import * as PileModel from "../../../src/model/Pile.js";
import * as PileView from "../../../src/view/Pile.js";
import * as TableModel from "../../../src/model/Table.js";
import * as TableView from "../../../src/view/Table.js";

CARD_SUPPLIER.engine = new SVGCardsCardRenderEngine("/SVG-cards/svg-cards.svg");


const deck = new Deck("Maroon");

const pile = new PileModel.Pile();
deck.addToPile(pile);

const table = new TableModel.Table();
const svgElt = document.getElementById("table");
const tableView = new TableView.Table(svgElt, table)
tableView.render(0,0);
const pileView = new PileView.Pile(tableView, pile);
console.log(pile.cards);
pileView.render(100, 100);

