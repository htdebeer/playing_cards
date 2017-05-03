

Default Klondike layout:

    [PPSPPPP]
    [-------]
    [PPPPPPP]

With P a pile and S a horizontal separator and - a vertical separator. Between
piles is also a small separation, of course.

The top piles are one card high/wide

The bottom piles's height = 1 + N * SEP, with N in {1-7}

This works fine for a grid-like layout. But what about something like
grandfathers clock?


         P1
       P2  P3
     P       P
    P         P
     P       P
       P   P
         P

      PPPPPPPP

The bottom row has height 1 + 4 * SEP

The clock shape's piles are all one card 

-   The layout can be relative? Thus place P1, and then P2 to the bottom-left, P3
    to the bottom-right?

-   Or the layout could be coordinate based, but then the dimensions of the
    card should be known beforehand. This would interfere with using different
    card render engines.

-   Or we could use parts of a row. Thus, P1 on row 0, P2 and P3 on row 0.2

Do note that some clock patience variants use rotation of the cards as well,
creating a more circular shape than the above "discrete" rendering.

Other forms might use a combination of shapes, like a circle with a cross, for
example.


             P
             P     
             P
           P P P
         P   P   P
      PPPPPPPPPPPPPPP
         P   P   P
           P P P
             P
             P
             P
      P
       
   
In these cases, a coordinate based layout system becomes more and more
convenient, even though this interferes with render engines. 

A possible alternative is using shape based layouts, that have their own way
of specifying what element goes where. If layouts can also contain layout,
something like:

    VerticalLayout[
        HorizontalLayout[CircleLayout[PPPPPPPP]]
        HorizontalLayout[PPPPPP]
    ]

Then elements can be selected by pointing to the hierarchy, so the second hour
of the circlelayout could be V[0][0][2]. More meaningful naming would be
convenient, though.


On the other hand, when adding a layout editor, for users it would make more
sense to just drag, drop, rotate, and configure the elements. That would
suggest a coordinate based layout. Of course, I could standardize the width
and height of the cards in the Card Render Engines. It being SVG, it can
always be scaled to whatever size makes sense. 

If I go this way, each element
needs a unique name, thouhg, to point to it. But some elements can have more
names? For example, in the clock, it could make sense to select all clock
elements, or have the "second" clock element.

Each element then has a 
- name
- type (pile, label)
- group (clock, bases, ...)
- model (for pile, at least)
- some extra configuration (like faceup/facedown, fanning horizontal/vertical,
  max number of cards, invariant, initial contents

Object inspector / editor: tree

    Layout: [
    -   clock: [
        -   {
            name: one
            x: 230,
            y: 22,
            r: 75
            fan: none
            faceup: true
        }
        -   two
        -   ...
        -   twelve
        ]
    -   bases: [
        -   base_1
        -   base_2
        ]
    ]

group: list of group | elements
element: (x, y), rotation, name, type, specification

Layout can be flattened (unique name is group.group.group...group.name)

Or maybe forgo groups? There is already:

game
- layout (+ table?)
- piles
- labels
- decks
- actions: (when are they allowed, if at all?)
  - start / initialisation
  - restart
  - redeal
  - new
  - ...
- config (like auto play, hints, ...)

(could also be rendered as tabs, I suppose).

                GAME EDITOR

    +-------------------------+-----------+
    |                         |           |
    |                         |   groups  |
    |                         |           |
    |                         +-----------+
    |                         |           |
    |                         | Object    |
    |    Layout               |           |
    |        Editor           | Inspector |
    |                         |           |
    |                         |           |
    |                         |           |
    |                         |           |
    |                         |           |
    |                         |           |
    |                         |           |
    +-------------------------+-----------+

Selecting an element in the object inspector, selects it on the editor as
well.

Multi selection would be great for dragging a bunch of elements around. Maybe
to delete a bunch of things in one go.

In the layout editor, an element can be dragged around, rotated, and deleted. Double
clicking opens it in the Object Inspector?


Elements:

-   Pile: {PileModel, PileView, extra config options}
-   Label: {config options; way to set / update content of label}

GameEditor
    LayoutEditor
    ObjectInspector: also to setup pile invariants, configure table (like
    background color), configure decks, and the like.
    InitialisationScriptEditor
    Game settings

In this way, the layout (or rather table?) would only have 

    {
        x: X
        y: Y
        r: R
        type: pile | label
        name: N
    }

(Do we want scale as well?)

With type pointing to the piles / labels in the game.

This would mean that the GameController needs to inject the piles/labels into
the TableView, somehow. Like TableView.render(gamecontroller)
