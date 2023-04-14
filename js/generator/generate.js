// main puzzle generation function
// here's basically how it works:
// we have a two step loop that repeats until the puzzle is generated
// the first step randomly generates clues
// the second step tries to solve the puzzle, and fills in the solution grid
// we repeat these two steps until the puzzle has been solved and the full solution grid has been filled in
function generatePuzzle()
{
    var clueWidth = GRID_SIZE_W;
    var clueHeight = GRID_SIZE_H;
    
    
    // first step, make sure the grid size hasn't been changed before generating the puzzle
    if(GRID_SIZE_W != globalPlayerGrid.length || GRID_SIZE_H != globalPlayerGrid[0].length)
    {
        setupGrid();
        setupButtons();
    }

    // fill the grid and clear clues
    generateFillGrid();
    globalClues = [];
    
    
    // create the first clue    
    var rand = Math.random();
    switch(DIFFICULTY)
    {
        // easy mode always has a full size clue
        case 0:
            generateClue(clueWidth, clueHeight);
            break;
            
        // medium mode has them 40% of the time
        case 1:
            if(rand < 0.4)
            {
                generateClue(clueWidth, clueHeight);
            }
            break;
            
        // hard mode has them 5% of the time
        case 2:
            if(rand < 0.05)
            {
                generateClue(clueWidth, clueHeight);
            }
            break;
    }
    
    
    // create the second clue
    rand = Math.random();
    switch(DIFFICULTY)
    {
        // easy mode always has a full size clue
        case 0:
            if(rand < 0.1)
            {
                rand = Math.random();
                if(rand < 0.5)
                {
                    clueWidth--;
                }
                else
                {
                    clueHeight--;
                }
            }
            else
            {
                clueWidth--;
                clueHeight--;
            }
            break;
            
        // medium mode has them 40% of the time
        case 1:
            if(rand < 0.4)
            {
                rand = Math.random();
                if(rand < 0.5)
                {
                    clueWidth--;
                }
                else
                {
                    clueHeight--;
                }
            }
            else
            {
                clueWidth--;
                clueHeight--;
            }
            break;
            
        // hard mode has them 5% of the time
        case 2:
            if(rand < 0.2)
            {
                rand = Math.random();
                if(rand < 0.5)
                {
                    clueWidth--;
                }
                else
                {
                    clueHeight--;
                }
            }
            else
            {
                clueWidth--;
                clueHeight--;
            }
            break;
    }
    
    generateClue(clueWidth, clueHeight);
    
    
    // the rest of the clues are generated in a loop
    // the random constants will be adjusted with testing to generate more fun puzzles
    initSolver();
    _l:
    while(!solverStep(0))
    {
        rand = Math.random();
        if(rand < 0.2)
        {
            rand = Math.random();
            if(rand < 0.3)
            {
                rand = Math.random();
                if(rand < 0.5)
                {
                    clueWidth--;
                }
                else
                {
                    clueHeight--;
                }
            }
            else
            {
                clueWidth--;
                clueHeight--;
            }
            
            if(clueWidth * clueHeight < 2)
            {
                clueWidth = 2;
                clueHeight = 2;
            }
        }
        
        if(clueWidth > GRID_SIZE_W)
        {
            clueWidth = GRID_SIZE_W;
        }
        if(clueWidth > GRID_SIZE_H)
        {
            clueWidth = GRID_SIZE_H;
        }
        
        generateClue(clueWidth, clueHeight);
        
        // safety
        if(globalClues.length > 10)
        {
            break _l;
            return -1;
        }
    }
    
    // once we escape this loop we have a solveable puzzle
    clearClues();
    for(let i = 0; i < globalClues.length; i++)
    {
        drawClue(globalClues[i]);
    }
}


// this function fills the solution grid randomly
function generateFillGrid()
{
    globalSolutionGrid = initArray([GRID_SIZE_W, GRID_SIZE_H]);
    
    // first get a list of all the possibilities
    var ALL_POSSIBILITIES = initArray([GRID_SIZE_W * GRID_SIZE_H]);

    let index = 0;
    for(let i = 0; i < GRID_SIZE_W; i++)
    {
        for(let j = 0; j < GRID_SIZE_H; j++)
        {
            ALL_POSSIBILITIES[index] = i + '-' + j;
            index++;
        }
    }
    
    for(let gridX = 0; gridX < GRID_SIZE_W; gridX++)
    {
        for(let gridY = 0; gridY < GRID_SIZE_H; gridY++)
        {
            let n = Math.floor(Math.random() * ALL_POSSIBILITIES.length);
            globalSolutionGrid[gridX][gridY] = ALL_POSSIBILITIES[n];
            ALL_POSSIBILITIES.splice(n, 1);
        }   
    }
}


// this function generates individual clues
function generateClue(w, h)
{
    var newClue = initArray([w, h]);
    var goodClue = false;

    // we need to pick a location for the clue
    var locationX = Math.floor(Math.random() * (GRID_SIZE_W - w + 1));
    var locationY = Math.floor(Math.random() * (GRID_SIZE_H - h + 1));
    
    // now we need to decide how many squares the clue will actually have filled in.
    // this is random and also depends on the difficulty and puzzle size
    var squares = 0;
    var maxSquares;
    var rand;
    switch(DIFFICULTY)
    {
        case 0:
            maxSquares = Math.ceil(GRID_SIZE_W * GRID_SIZE_H / 2);
            break;
            
        case 1:
            maxSquares = Math.floor(GRID_SIZE_W * GRID_SIZE_H / 2);
            break;
            
        case 2:
            maxSquares = Math.ceil(GRID_SIZE_W * GRID_SIZE_H / 3);
            break;
    }
    
    for(let clueX = 0; clueX < w; clueX++)
    {
        for(let clueY = 0; clueY < h; clueY++)
        {
            newClue[clueX][clueY] = "x-x";
            rand = Math.random();
            if(rand < 0.6 && squares <= maxSquares)
            {
                rand = Math.random();
                switch(DIFFICULTY)
                {
                    case 0:
                        if(rand < 0.5)
                        {
                            rand = Math.random();
                            if(rand < 0.5)
                            {
                                newClue[clueX][clueY] = "x-" + globalSolutionGrid[locationX + clueX][locationY + clueY].charAt(2);
                                goodClue = true;
                            }
                            else
                            {
                                newClue[clueX][clueY] = globalSolutionGrid[locationX + clueX][locationY + clueY].charAt(0) + "-x";
                                goodClue = true;
                            }
                        }
                        else
                        {
                            newClue[clueX][clueY] = globalSolutionGrid[locationX + clueX][locationY + clueY];
                            goodClue = true;
                        }
                        break;
                        
                    case 1:                        
                    case 2:
                        if(rand < 0.35)
                        {
                            rand = Math.random();
                            if(rand < 0.5)
                            {
                                newClue[clueX][clueY] = "x-" + globalSolutionGrid[locationX + clueX][locationY + clueY].charAt(2);
                                goodClue = true;
                            }
                            else
                            {
                                newClue[clueX][clueY] = globalSolutionGrid[locationX + clueX][locationY + clueY].charAt(0) + "-x";
                                goodClue = true;
                            }
                        }
                        else
                        {
                            newClue[clueX][clueY] = globalSolutionGrid[locationX + clueX][locationY + clueY];
                            goodClue = true;
                        }
                        break;
                }
            }
        }
    }
    
    if(goodClue)
    {
        globalClues.push(newClue);
    }
}
