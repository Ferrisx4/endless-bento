// these functions are executed when the buttons at the bottom of the puzzle are clicked.
// they set the color and shape of the tile that will get placed when the grid is clicked.
// additionally we can set to delete mode, and we have the function that sets that in here as well.

function setColor(color)
{
    // set previously selected button to grey
    var e;
    if(globalSelectedColor === 'x' && globalDeleteMode)
    {
        // Deselect the x button.
        e = document.getElementById("x");
        e.className = "game-button";

        // Select the new color.
        e = document.getElementById("c-" + color);
        e.className = "selected-game-button";
        globalSelectedColor = color;

        // Turn off delete mode.
        globalDeleteMode = 0;
    }
    // else if (globalSelectedColor === 'x')
    // {

    // }
    else if(!globalInitColorDone) // Initializing, don't set any colors
    {
        globalInitColorDone = 1;
    }
    else if(globalSelectedColor == -1) // Handles if we didn't have a color yet. 
    {
        globalSelectedColor = color;
        e = document.getElementById("c-" + color);
        e.className = "selected-game-button"
    }
    else if(globalSelectedColor == color) // same color selected, so deselect it
    {
        e = document.getElementById("c-" + color);
        e.className = "game-button"
        globalSelectedColor = 'x';
    }
    else // new color selected
    {
        // Unset the old color, unless it was x (at this point, we know we weren't in delete mode)
        if (globalSelectedColor !== 'x') 
        {
            e = document.getElementById("c-" + globalSelectedColor);
            e.className = "game-button";
        }
        // Set the new color
        globalSelectedColor = color;
        e = document.getElementById("c-" + color);
        e.className = "selected-game-button";
    }
   // e.className = "game-button";

    // set the new selected button and style it to highlighted
    //e = document.getElementById("c-" + globalSelectedColor);

    // if the previously selected button was the delete button we want to set the shape back too
    if(globalSelectedShape === 'x' && globalDeleteMode)
    {
        globalSelectedShape = globalOldSelectedShape;
        e = document.getElementById("s-" + globalSelectedShape);
        e.className = "selected-game-button";
        globalDeleteMode = 0;
    }
}


function setShape(shape)
{
    // set previously selected button to grey
    var e;
    if(globalSelectedShape === 'x' && globalDeleteMode)
    {        
        // Deselect the x button.
        e = document.getElementById("x");
        e.className = "game-button";

        // Select the new shape.
        e = document.getElementById("s-" + shape);
        e.className = "selected-game-button";
        globalSelectedShape = shape;

        // Turn off delete mode.
        globalDeleteMode = 0;
    }
    else if(!globalInitShapeDone) // Initializing, don't set any shapes
    {
        globalInitShapeDone = 1;
    }
    else if(globalSelectedShape == -1)
    {
        globalSelectedShape = shape;
        e = document.getElementById("s-" + shape);
        e.className = "selected-game-button"
    }
    else if(globalSelectedShape == shape) // same shape selected, so deselect it
    {
        e = document.getElementById("s-" + shape);
        e.className = "game-button"
        globalSelectedShape = 'x';
    }
    else // new shape selected
    {
        if (globalSelectedShape !== 'x')
        {
            e = document.getElementById("s-" + globalSelectedShape);
            e.className = "game-button";
        }
        globalSelectedShape = shape;
        e = document.getElementById("s-" + shape);
        e.className = "selected-game-button";
    }

    // if the previously selected button was the delete button we want to set the color back too
    if(globalSelectedColor === 'x' && globalDeleteMode)
    {
        globalSelectedColor = globalOldSelectedColor;
        e = document.getElementById("c-" + globalSelectedColor);
        e.className = "selected-game-button";
        globalDeleteMode = 0;
    }
}


function setDelete()
{
	// set previously selected color and shape to grey
    var e;
    if (globalSelectedColor != -1 && globalSelectedColor != 'x')
    {
        e = document.getElementById("c-" + globalSelectedColor);
        e.className = "game-button";
    }
    if (globalSelectedShape != -1 && globalSelectedShape != 'x')
    {
        var e = document.getElementById("s-" + globalSelectedShape);
        e.className = "game-button";
    }

	// set selected letter and number to x
	globalOldSelectedShape = globalSelectedShape;
	globalOldSelectedColor = globalSelectedColor;

	globalSelectedColor = 'x';
	globalSelectedShape = 'x';

	// set delete button to red
	e = document.getElementById('x');
	e.className = "selected-game-button";

    // Let other functions know we were intentionally in delete mode, not just
    // with color or shape set to x
    globalDeleteMode = 1;
}
