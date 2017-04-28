import {Deck} from "../../../src/Deck.js";
import {CARD_SUPPLIER} from "../../../src/CardSupplier.js";
import {SVGCardsCardRenderEngine} from "../../../src/card_render_engine/SVGCardsCardRenderEngine.js";

import {PileModel} from "../../../src/model/PileModel.js";
import {PileView} from "../../../src/view/PileView.js";
import {TableModel} from "../../../src/model/TableModel.js";
import {TableView} from "../../../src/view/TableView.js";

CARD_SUPPLIER.engine = new SVGCardsCardRenderEngine("/SVG-cards/svg-cards.svg");


const deck = new Deck("Maroon");

const pile = new PileModel();
deck.addToPile(pile);

const table = new TableModel();
const svgElt = document.getElementById("table");
const tableView = new TableView(svgElt, table)
tableView.render(0,0);
const pileView = new PileView(tableView, pile);
console.log(pile.cards);
pileView.render(100, 100);

