LexiTour: Basic Brackets Tournament Site with nodeJs, Express, Jade and jQuery Bracket
=======================================================================
jQuery Bracket: http://www.aropupu.fi/bracket/
:
Run npm install in console to install dependencies:
:
All dependencies will be downloaded by `npm` to `node_modules` folder.
---
Run 'node app.js' to start server at port 3000.
:
Open `http://localhost:3000` to access Site.
---
ToDo:
    Add comments
    Make methods reusable
    Use .promises
    Move jQuery scripts to seperate folder
---
Caveats:
 Tournaments can be started by
    : Starting new and adding players manually
    : Loading a csv (comma separated values) from folder ./public/customlists
    : Loading a previously saved tournament from folder ./public/savedgames
 * A csv file example resides in 'customlists' folder.
 * All games are saved automaticly as json files soon as as a cell is edited 
    and can be loaded at any time for print or to be finished at a later time.
 * Games saved will have the tournamant name set as file name, If duplicate name
    exists It will be overwritten. Loaded tournaments will have filename set
    as tournament name and will be saved with that name.
 * Loaded csv games will have 'null' added accordingly to balance brackets and 
    randomized using a version of Fisher–Yates Shuffle. But there are no checks 
    for 'double null' values beacuse in some cases this can lead to infinite loops
    so some manual positionion may be required so a player does not go to the finals
    automatically.
