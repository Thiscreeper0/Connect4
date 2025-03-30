
let COLUMN_COUNT = 7 //make this dynamic
let ROW_COUNT = 6 // this too
document.documentElement.style.setProperty('--COLUMN_COUNT', COLUMN_COUNT);
document.documentElement.style.setProperty('--ROW_COUNT', ROW_COUNT);
let no_move_solution
// make event listener for the garbage button
document.getElementById("trash-Icon")?.addEventListener('click', clearStorage);
let alreadyPlayed = JSON.parse(localStorage.getItem('alreadyPlayed')) || {}; //high up please (nomovefunc and fetchinfo)
function clearStorage() {
    // Resets history and clears storage
    HistoryOfMoves = "";
    oldHistoryOfMoves = "";
    sessionStorage.clear();
    updateGridBasedOnHistoryOfMoves(); 
}
solutionContainer = document.getElementById('solutionContainer');
for(let i = 0; i < COLUMN_COUNT; i++) {
    newElement = document.createElement("div");
    newElement.classList.add("solution");
    newElement.innerHTML = "-";
    newElement.classList.add("filledColumn")
    solutionContainer.appendChild(newElement)
}



noMoveFunction = (poss, output) => {
    if (typeof(no_move_solution) == "undefined" || no_move_solution == null || no_move_solution == false) {
        if (poss == "") {
            no_move_solution = output
        }else {
             no_move_solution = getValueForEmptyKey(alreadyPlayed)
        }
         
     }
     return no_move_solution
}
//chatgpt generated lol
const getValueForEmptyKey = obj => obj[""] || false;

//  Output of the fetch. 
async function fetchInfo(poss) {
    console.log("fetch");
    const response = await fetch('http://localhost:3000/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            position: poss,
            height: ROW_COUNT,
            width: COLUMN_COUNT
         }),
    });

    let output = (await response.text())
        .split(' ')
        .map(Number)
        .slice(1);
    console.log(output)

    returnThis = output.length ? output : Array(COLUMN_COUNT).fill(-1000)
    no_move_solution = noMoveFunction(poss, output) //find out 0 move solution
    //if no_move_solution is false that means that the user hasnt used the engine yet. 
    if (no_move_solution == false) {
        console.log("whhwaof9a big eror omg what a big error :squidward ass:")
    }
    return  returnThis;
}
noMoveFunction("not needed", "this one also not needed lllsa")

//declare setting variable
set = localStorage.getItem('set') || '00000'; 
let openAlready = false
let pauseOrNot = false
let isRunning = false; // Flag to check if the function is running
let isPaused = false;  // Flag to check if the function is paused
const Numbers = "ABCDEFG"

let solution 
let checking = false
let oldSolution 
let isSwitchOn = false
let isShiftPressed = false;
let isAltPressed = false;
let isCPressed = false;
let currentPlayer = 1;
let HistoryOfMoves = "";
const canvas = document.querySelector('.canvas');
const context = canvas.getContext('2d')
let lines = [];
let gamePosition = "";
const inputField = document.getElementById('inputField');
inputField.setAttribute('pattern', `[1-${COLUMN_COUNT}]`);
const container = document.getElementById("Container");
const movesContainer = document.getElementById('movesContainer');
//audio
let audio = new Audio();
let audioWin = new Audio();
audioWin.src = "sound/soundEffectWin.wav"
audioWin.volume = 0.2
audio.src = "sound/soundEffectClick.wav"
audio.volume = 0.2
let oldHistoryOfMoves = ""
let board = 
    [[0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]]
let playedColumn = null
let newBoard
let oldLength = COLUMN_COUNT * ROW_COUNT
if (!sessionStorage.getItem('oldLength')) {
    sessionStorage.setItem('oldLength', COLUMN_COUNT * ROW_COUNT);
}   else {
    oldLength = sessionStorage.getItem('oldLength')
};
let isGameFinished = false

//coordinates for the cell start
let startRow
let startCol
//right click mouse down for the canvas
function onMouseDown(event) {
    const target = event.target.classList.contains('grid-item') ? event.target : event.target.parentElement;
    startRow = target.dataset.row;
    startCol = target.dataset.col;
}
//coordinates for the cell end
let endRow
let endCol
// 
//right click mouse up for the canvas
function onMouseUp(event) {
    if (event.button !== 2) return; // Only handle right-click

    const target = event.target.classList.contains('grid-item') ? event.target : event.target.parentElement;
    endRow = target.dataset.row;
    endCol = target.dataset.col;

    if (startRow && startCol && (startRow !== endRow || startCol !== endCol)) {
        updateCanvas(startRow, startCol, endRow, endCol);
        startRow = startCol = null; // Reset start positions
    } else if (startRow && startCol) {
        toggleGrayscaleFilter(event);
    }
}
let NANDNADNoldlength
let NANDNADNoldlength2
function updateCanvas(startRow, startCol, endRow, endCol, bol) {
    const items = document.querySelectorAll('.grid-item');
    if (items.length !== COLUMN_COUNT * ROW_COUNT) {; return;}
    let color
    if (bol) {
        color = 2
    }else if (isShiftPressed) {
        color = 0
    }else {
        color = 1;
    }
    let itemRect = items[0].getBoundingClientRect();
    let itemWidth = itemRect.width;
    let itemHeight = itemRect.height;
    
    ratio1 = (itemWidth / NANDNADNoldlength)
    ratio2 = (itemHeight / NANDNADNoldlength2)

    let startX = (itemWidth * startCol) + (itemWidth / 2);
    let startY = (itemHeight * startRow) + (itemHeight / 2);
    let endX = (itemWidth * endCol) + (itemWidth / 2);
    let endY = (itemHeight * endRow) + (itemHeight / 2);

    const newLine = { startX, startY, endX, endY, color };
    // Check if the line already exists (either direction)
    lines.forEach(line => {
        line.startX *= ratio1;
        line.startY *= ratio2;
        line.endX *= ratio1;
        line.endY *= ratio2;
      });
    NANDNADNoldlength = itemWidth
    NANDNADNoldlength2 = itemHeight
    const existingLineIndex = lines.findIndex(line =>
        (line.startX === newLine.startX && line.startY === newLine.startY &&
         line.endX === newLine.endX && line.endY === newLine.endY) ||
        (line.startX === newLine.endX && line.startY === newLine.endY &&
         line.endX === newLine.startX && line.endY === newLine.startY) //check if the exact same line exists in both ways. Left to right and right to left
    );
    const existingLine = lines[existingLineIndex];
    // If the line already exists, remove it
    if (existingLineIndex !== -1) {
        // Remove the existing line
        lines.splice(existingLineIndex, 1);
    } else {
        // Add the new line
        lines.push(newLine);
    }
    try{
        if ((existingLine.color !== newLine.color) && (color !== 2)) {
            lines.push(newLine);
    }}
    catch(e){}
    // Redraw all lines
    redrawLines();
}
function redrawLines() {
    canvas.width = canvas.clientWidth; //canvas is the .canvas element.
    canvas.height = canvas.clientHeight;
    context.clearRect(0, 0, canvas.width, canvas.height);
    let wid = canvas.height/40
    context.lineWidth = wid;
    lines.forEach(line => {
        context.beginPath();
        if (line.color === 1) {
            context.strokeStyle = 'rgb(255, 99, 71)'
        }else if (line.color === 0) {
            context.strokeStyle = 'rgb(18, 18, 18)';
        }else if (line.color === 2) {
            context.strokeStyle = 'rgb(48, 148, 9)';
        }
        context.moveTo(line.startX, line.startY);
        context.lineTo(line.endX, line.endY);
        context.stroke();
        
        context.beginPath();
        context.arc(line.startX, line.startY, 4, 0, 2 * Math.PI);
        context.stroke();

        context.beginPath();
        context.arc(line.endX, line.endY, 4, 0, 2 * Math.PI);
        context.stroke();
    });
}
function eraseCanvas() {
    // Clear the lines array
    if (isGameFinished) lines = lines.filter(line => line.color === 2);
    else lines = [];
    // Redraw the canvas
    redrawLines();    
}
if (!sessionStorage.getItem('HistoryOfMoves')) {
    sessionStorage.setItem('HistoryOfMoves', "");
    }   else {
        HistoryOfMoves = sessionStorage.getItem('HistoryOfMoves')
    }
if (!sessionStorage.getItem('oldHistoryOfMoves')) {
    sessionStorage.setItem('oldHistoryOfMoves', "");
}   else {
    oldHistoryOfMoves = sessionStorage.getItem('oldHistoryOfMoves')
}

if (!sessionStorage.getItem('isSwitchOn')) {
    sessionStorage.setItem('isSwitchOn', "true");
}   else {
    isSwitchOn = sessionStorage.getItem('isSwitchOn')
    //json object to boolean
    isSwitchOn = JSON.parse(isSwitchOn)
};

flipOn()

async function flipOn() {
    if (!isSwitchOn) return;

    document.querySelector(".computerTop").classList.add("active");
    const switchImg = document.querySelector("#switch img");
    switchImg.classList.add("active");
    switchImg.src = "svg/on.svg";
    updateText();
}


function checkString(str) { //check first 1, 2, 3 and return true if first character is 4 (middle) 5, 6, or 7.
    const middle = Math.ceil(COLUMN_COUNT / 2); // Calculate the middle number
    let allMiddle = true; // Flag to check if all numbers are the middle number

    for (let i = 0; i < str.length; i++) {
        const char = str.charAt(i);

        if (char === String(middle)) {
            continue; // If it's the middle number, just continue
        }

        allMiddle = false; // If we encounter any number not equal to the middle, update the flag

        if (parseInt(char) >= 1 && parseInt(char) < middle) {
            return false; // Return false if any number less than the middle number appears
        } else if (parseInt(char) > middle && parseInt(char) <= COLUMN_COUNT) {
            return true; // Return true if any number greater than the middle number appears
        }
    }

    // If all numbers are the middle number, return false
    return allMiddle ? false : false;
}




function evaluateMove(arr, num, originalArr, mate) {
    let character = "";
    theNumber = arr[num - 1]
    if (arr.filter(val => !Number.isNaN(val)).length === 1) {
        character = "➧";
    }else if (theNumber === 1) {
      if (arr.filter(val => val === 1).length === COLUMN_COUNT && set[2] == 0) {
        character = "+"
      } else if (!(arr.includes(0)) && (arr.filter(val => val === -1 || isNaN(val)).length == ROW_COUNT) && set[1] == 0) {
        character = "!!"
      } else if ((arr.filter(val => val === 1).length === 1)) {
        character = "!"
      }
    } else if (theNumber === 0) {
      if ((arr.includes(1) === false) && arr.filter(val => val === 0).length === 1) {
        character = "!"
      } else if (arr.includes(1)) {
        character = "?"
      } else if (arr.filter(val => val === 0).length === COLUMN_COUNT) {
        character = "="
      }
    } else if (theNumber === -1) {
      if (arr.includes(1)) {
        character = "??"
      } else if (arr.includes(0)) {
        character = "?"
      } else if (set[0] == 0) {
        character = "-"
      }
    } 
    if (mate) {
        character += "#" // Add "#" symbol for mate
    }
    return character
}
if (set[4] ==1) {
    movesContainer.setAttribute('grid', 'no')

}

// Check if the alreadyPlayed data is not already present in localStorage
if (!localStorage.getItem('alreadyPlayed')) {
    // If it's not present, add it with an empty array as its value
    localStorage.setItem('alreadyPlayed', JSON.stringify({alreadyPlayed}));
}

async function playDropSound() {
    audio.pause();
    audio.currentTime = 0;
    await audio.play();
}
async function playWinSound() {
    audioWin.pause();
    audioWin.currentTime = 0;
    await audioWin.play();
}


function convertVariable(variable) {
    let newvar = String(variable); // Convert variable to a string
    let convert = false;
    let result = ''; // This will store the new string
    const validNumbers = Array.from({ length: COLUMN_COUNT }, (_, i) => String(i + 1)); // Generate valid numbers ['1', '2', ..., 'COLUMN_COUNT']
    const middleNumber = String(Math.ceil(COLUMN_COUNT / 2)); // Middle number for odd/even COLUMN_COUNT

    for (let i = 0; i < newvar.length; i++) {
        if (convert) {
            result += String(COLUMN_COUNT + 1 - Number(newvar[i])); // Convert using COLUMN_COUNT logic
        } else if (validNumbers.includes(newvar[i])) {
            if (newvar[i] === middleNumber) {
                result += middleNumber; // Keep the middle number as is
            } else if (Number(newvar[i]) < Number(middleNumber)) { // Check if the number is less than the middle
                result = variable; // Return the original variable if it contains lower numbers
                break;
            } else {
                convert = true; // Start conversion from this point
                result += String(COLUMN_COUNT + 1 - Number(newvar[i])); // Convert the current character
            }
        } else {
            result += newvar[i]; // Append other characters unchanged
        }
    }
    return result; // Output the result
}   

function removeUntilNoSevenRepeats(str) {//simple, checking if someone cheats with input
    // Function to check if any character appears COLUMN_COUNT or more times
    function hasSevenRepeats(s) {
      const count = {};
      for (let char of s) {
        if (count[char]) {
          count[char]++;
        } else {
          count[char] = 1;
        }
        if (count[char] === COLUMN_COUNT) return true;
      }
      return false;
    }
  
    // Remove last character until no character is repeated COLUMN_COUNT times
    while (hasSevenRepeats(str)) {
      str = str.slice(0, -1);
    }
  
    return str;
}
// Add an event listener for input event
inputField.addEventListener('input', async function() {
    let inputValue = inputField.value;
    inputValue = removeUntilNoSevenRepeats(inputValue);
    inputValue = inputValue.replace(new RegExp(`[^1-${COLUMN_COUNT}]`, 'g'), ''); // Ensures only valid column numbers are entered
    inputField.value = inputValue; // Update the input field

    if (inputValue.length !== 0) {
        HistoryOfMoves = String(inputValue);
    } else {
        HistoryOfMoves = "";
    }
    await updateGridBasedOnHistoryOfMoves();
});
async function updateGridBasedOnHistoryOfMoves(ev) {
    // Reset the board before updating moves
    board = [[0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0]];
    // Repopulate the board based on the history of moves
    
    
    for (let i = 0; i < HistoryOfMoves.length; i++) {
        const clickedCol = parseInt(HistoryOfMoves[i]) - 1;
        for (let row = ROW_COUNT - 1; row >= 0; row--) {
            if (board[row][clickedCol] === 0) {
                board[row][clickedCol] = (i % 2 === 0) ? 1 : 2; // Alternate between players
                break;
            }
        }
        checkFinished();// Check if the game has finished after updating
        currentPlayer = (i % 2 === 1) ? 1 : 2;
        if(HistoryOfMoves.length !==ROW_COUNT*COLUMN_COUNT && isGameFinished) {
            HistoryOfMoves = HistoryOfMoves.substring(0, i + 1)//remove the last move and end the loop cuz the game is over.
            break;
        }   
        
    }
    await updateGrid(ev); // Redraw the grid based on the new board state
}

function updateSolutionElements(numbersArray) { //updates the elements using the solution array given as parameter.
    /** if(numbersArray==null) { 
     * @todo {fix this}
        numbersArray = [-2, -1, 0, 1, 0, -1, -2]
    }*/
    const solutionElements = document.querySelectorAll('.solution');
    if (solutionElements.length !== numbersArray.length) {
        console.log(solutionElements.length, numbersArray)
        console.error('Number of elements does not match the length of the array');
        return;
    }

    solutionElements.forEach((element, index) => {
        // Update innerHTML with the corresponding number
        element.classList.remove('winMove', 'loseMove', 'drawMove', 'filledColumn');
        if (numbersArray[index] ==-1000) {
            element.classList.add('filledColumn');
            element.innerHTML = "-";
        }else {
            element.innerHTML = numbersArray[index];
            // Add class based on the sign of the number
            if (numbersArray[index] > 0) {
                element.classList.add('winMove');
            } else if (numbersArray[index] < 0) {
                element.classList.add('loseMove');
            } else {
                element.classList.add('drawMove');
            }
        }
    });
}

function constructBoard(moves) {
    
    let board2 = [[0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0]];
    for (let i = 0; i < moves.length; i++) {
        const clickedCol = parseInt(moves[i]) - 1;
        for (let row = ROW_COUNT - 1; row >= 0; row--) {
            if (board2[row][clickedCol] === 0) {
                board2[row][clickedCol] = (i % 2 === 0) ? 1 : 2; // Alternate between players
                break;
            }
        }
    }
    return board2
}


async function updateGamePosition(bol) {
    if(checking) { //checking if already running. Dont bother it.
        return
    }
    if (!isSwitchOn) { //if switch off, run without computer.
        updateGamePositionNoComputer(bol) 
        return 
    }
    try {
        let tempboard = constructBoard(oldHistoryOfMoves)
        let isWinningAtEnd = Boolean(Boolean(checkWin(tempboard, currentPlayer) ||Boolean(checkWin(tempboard, 3 - currentPlayer)))) // check for both player win return false if no win

        checking = true //make it true cuz now youre running the function lol
        oldSolution = [-2, -1, 0, 1, 0, -1, -2] //store the solution of the previous move here.
        gamePosition = ""; //string representing the game position. Is coded in HTML and includes a lot of html elements (moves)

        const columnCounts = Array.from({ length: COLUMN_COUNT }, () => 0); // Initialize an array to store the counts of each column [0, 0, 0, 0, 0, 0, 0]
        for (let i = 0; i < oldHistoryOfMoves.length; i++) {
            var updatedHOM = null //temp variable used for the iteration of the for loop 
            updatedHOM = oldHistoryOfMoves.substring(0, i+1); //updated based on the current move in "for" loop. Not removed letter.
            converted = convertVariable(updatedHOM) //convert 567 to 123 if it finds 567 first.
            let character = "" //Will append to gamePosition later.
            for (let index = 0; index <= 1; index++) {//run this code TWICE basically.
                if(index==1) { //if SECOND time
                    if (i < HistoryOfMoves.length) {
                        oldSolution = solution 
                    }
                    converted = converted.substring(0, converted.length - 1)//remove one letter so that the solution can be evaluated properly in updatedSolution
                    updatedHOM = updatedHOM.substring(0, updatedHOM.length - 1)
                }
                try {
                    solution = [...alreadyPlayed[converted]]
                    if (checkString(updatedHOM)) { //true if 567 first false if 123 first.
                        solution = [...solution].reverse()
                    }
                } catch (error) { //if there isnt any solution stored in alreadyPlayed
                    // Code that runs if an exception is thrown in the try block
                    solution = await fetchInfo(converted); //fetch the solution from the server, store it in alreadyPlayed
                    alreadyPlayed[converted] = solution;
                    if (checkString(updatedHOM)) { //reverse back to normal.
                        solution = [...solution].reverse()
                    }
                }
            }
            //implement -1000 rule here
            let updatedSolution = solution.map(num => num === -1000 ? NaN : num);
            updatedSolution = updatedSolution.map(number => Math.sign(number));
            const column = parseInt(oldHistoryOfMoves[i]) - 1; // Get the column number (subtract 1 since arrays are zero-indexed)
            columnCounts[column]++; // Increment the count for the current column
            const rowNumber = columnCounts[column]; // Row number is equal to the count of the current column
            const player = (i % 2 === 0) ? String.fromCharCode(65 + column).toUpperCase() : String.fromCharCode(65 + column).toLowerCase(); // Determine player and piece notation
            const moveNumber = i + 1; // Calculate move number
            const ask = (i % 2 === 0) ? "red-Text" : "black-Text";
            character = evaluateMove(updatedSolution, column+1, solution, isWinningAtEnd && (i == oldHistoryOfMoves.length-1));
            const moveNotation = `${(set[3] != 1) ? i + 1 + ". " : ""}${player}${rowNumber}`;
            
            gamePosition += `<span class="${ask} move-${moveNumber} moveText">${moveNotation}${character}</span>`; 
            movesContainer.innerHTML = gamePosition;
        }
        movesContainer.innerHTML = gamePosition;
        localStorage.setItem('alreadyPlayed', JSON.stringify(alreadyPlayed));
        let fun = document.querySelectorAll(".moveText")
        fun.forEach(text => text.addEventListener("mouseover", selectMove));
        fun.forEach(text => text.addEventListener("mouseout", removeMove));
        fun.forEach(text => text.addEventListener("click", playMove));
        fun.forEach(text => text.addEventListener("mousedown", rightClick));
    } catch(error) {console.log("error",error)}
    finally {
        checking = false //make it false so you can run it again ! yayyyy
    }
}

async function solutionFunction() {
    if(isSwitchOn==false){
        removeSolution()
        return
    }
    if (HistoryOfMoves == "") {
        iadhuidsah = [-2, -1, 0, 1, 0, -1, -2];
        alreadyPlayed[iadhuidsah] = [-2, -1, 0, 1, 0, -1, -2];
        updateSolutionElements(iadhuidsah);
        return
    }
    let solution1
    let updatedHOM1 = null
    let converted1 = null
    let i = HistoryOfMoves.length - 1
    updatedHOM1 = HistoryOfMoves.slice(0, i+1); //updated based on the current move in "for" loop. Not removed letter.
    converted1 = convertVariable(updatedHOM1) //convert the variable - check 123 and 567, convert to smallest start
    try {
        solution1 = [...alreadyPlayed[converted1]]
        if (checkString(updatedHOM1)) { //find out whether the string has a 5, 6, or 7 first (before 1, 2 or 3) in hom or not
            solution1 = [...solution1].reverse()
            }
    } catch (error) {
        // Code that runs if an exception is thrown in the try block
        console.log("solutionFunction")
        solution1 = await fetchInfo(converted1);
        if (solution1===null){
            movesContainer.innerHTML = "<div class='offline'>The server is offline</div>";
            return;
        }
        alreadyPlayed[converted1] = solution1;
        if (checkString(updatedHOM1)) { //find out whether the string has a 5, 6, or 7 first (before 1, 2 or 3) in hom or not
        solution1 = [...solution1].reverse()
        }
    }
    updateSolutionElements(solution1);

}
/*let variant = [1, 2, 3, [4], 2]
async function readVariant() {
    HistoryOfMoves = ""
    for(let i = 0; i < variant.length; i++) {
        if (typeof(variant[i]) == "number") {
            HistoryOfMoves += String(variant[i])
        }
        else {
            moveNum = i
            newVar = variant[i]

            for(let i = 0; i < newVar.length; i++) {
                if (typeof(newVar[i]) == "number") {
                    moves = HistoryOfMoves + String(newVar[i])
                    newBranch(moveNum, moves)
                }
            }
        }
    }
    updateGridBasedOnHistoryOfMoves()
}

function newBranch(moveNum, moves) {
    element = document.createElement("div")
    element.classList = "branch"
    element.classList = "branch-" + moveNum
}*/


function playMove(evt) { //click on element to play current move (from class name)
    const selectedMove = evt.target;
    let num = String(selectedMove.classList).match(/\d+/);
    num ? parseInt(num[0], 10)[0] : null;
    num = num[0]
    
    HistoryOfMoves = oldHistoryOfMoves.slice(0, num)
    updateGridBasedOnHistoryOfMoves();
}
async function updateGamePositionNoComputer(bol) {
    if(checking) {
        return
    }
    try {
        let tempboard = constructBoard(oldHistoryOfMoves)
        let isWinningAtEnd = Boolean(Boolean(checkWin(tempboard, currentPlayer) ||Boolean(checkWin(tempboard, 3 - currentPlayer)))) // check for both player win return false if no win

        checking = true
        gamePosition = "";
        const columnCounts = Array.from({ length: COLUMN_COUNT }, () => 0); // Initialize an array to store the counts of each column
        for (let i = 0; i < oldHistoryOfMoves.length; i++) {

            const column = parseInt(oldHistoryOfMoves[i]) - 1; // Get the column number (subtract 1 since arrays are zero-indexed)
            columnCounts[column]++; // Increment the count for the current column
            const rowNumber = columnCounts[column]; // Row number is equal to the count of the current column
            const player = (i % 2 === 0) ? String.fromCharCode(65 + column).toUpperCase() : String.fromCharCode(65 + column).toLowerCase(); // Determine player and piece notation
            const moveNumber = i + 1; // Calculate move number
            const ask = (i % 2 === 0) ? "red-Text" : "black-Text";
            const moveNotation = `${(set[3] != 1) ? i + 1 + " " : ""}${player}${rowNumber}`;
            //console.log(i, isGameFinished, HistoryOfMoves, HistoryOfMoves.length)
            if (isWinningAtEnd && (i == oldHistoryOfMoves.length-1)) {
                gamePosition += `<span class="${ask} move-${moveNumber} moveText">${moveNotation}#</span>`; // Add "#" symbol for mate
            } else {
                gamePosition += `<span class="${ask} move-${moveNumber} moveText">${moveNotation}</span>`;
            }
            movesContainer.innerHTML = gamePosition;
        }
        movesContainer.innerHTML = gamePosition;
        let fun = document.querySelectorAll(".moveText")
        fun.forEach(text => text.addEventListener("mouseover", selectMove));
        fun.forEach(text => text.addEventListener("mouseout", removeMove));
        fun.forEach(text => text.addEventListener("click", playMove));
        fun.forEach(text => text.addEventListener("mousedown", rightClick));
    } catch(error) {console.log("error",error)}
    finally {
        checking = false
    }
}

generalSet = localStorage.getItem('generalSet') || '0'

async function createGrid(){
    for(let row = 0; row < ROW_COUNT; row++){
        for(let col = 0; col < COLUMN_COUNT; col++){
            const gridItem = document.createElement("div");
            gridItem.classList.add("grid-item");
            gridItem.setAttribute("data-row", row);
            gridItem.setAttribute("data-col", col);
            gridItem.addEventListener("click", dropPiece);
            gridItem.addEventListener('mousedown', onMouseDown);
            gridItem.addEventListener('mouseup', onMouseUp);
            /* gridItem.addEventListener("mouseenter", hoverColumn);
            gridItem.addEventListener("mouseleave", leaveColumn); */
            gridItem.classList.add("no-player");
            if (generalSet[0] === '1') { //if setting is on, show numbers
                if(col==0 && row==ROW_COUNT-1){
                    gridItem.innerHTML = '<div class="Col1">1</div><div class="Row1">A</div>'
                }else if (col===0){
                    gridItem.innerHTML = `<div class="Col1">${ROW_COUNT-row+1}</div>`
                }else if (row===ROW_COUNT-1){
                    gridItem.innerHTML = `<div class="Row1">${Numbers[col]}</div>`
                }
            }
                
            container.appendChild(gridItem);
        }
    }
}

function leaveColumn(ev) {
    const items = document.querySelectorAll(".grid-item");
    items.forEach(item => {
        item.classList.remove("blackBackground", "redBackground");
    });
}

async function hoverColumn(ev, col) {
    playedColumn = null
    if (ev===false){
        playedColumn = col
    } else {
        playedColumn = parseInt(ev.target.getAttribute("data-col"), 10);
    }
    const items = document.querySelectorAll(".grid-item");
    for (let row = ROW_COUNT-1; row >= 0; row--) {
        if (board[row][playedColumn] === 0 && !isGameFinished) {
            items.forEach(item => {
                item.classList.remove("blackBackground", "redBackground");
                if((item.getAttribute("data-row") == row) && (item.getAttribute("data-col") == playedColumn)) {
                    if(currentPlayer === 1) {
                        item.classList.add("redBackground");
                    }else {
                        item.classList.add("blackBackground");
                    }
                }
            });
        break;
        }
    }   
}
document.addEventListener('keydown', function(event) {
    if (event.key === 'Shift') {
        isShiftPressed = true;
    }  if (event.key === 'Alt') {
        isAltPressed = true;
    } if (event.key === 'c' || event.key === 'C') {
        isCPressed = true;
    }
});

document.addEventListener('keyup', function(event) {
    if (event.key === 'Shift') {
        isShiftPressed = false;
    }  if (event.key === 'Alt') {
        isAltPressed = false;
    } if (event.key === 'c' || event.key === 'C') {
        isCPressed = false;
    }
});

document.addEventListener("visibilitychange", function() {
    isAltPressed = false
    isCPressed = false
    isShiftPressed = false
});

container.addEventListener("contextmenu", (event) => event.preventDefault());

function toggleGrayscaleFilter(oldEvent) {
    let targetElement;
    // Determine the correct target element
    if (!oldEvent.target.classList.contains("grid-item")) {
        targetElement = oldEvent.target.parentElement;
    } else {
        targetElement = oldEvent.target;
    }
    // Prevent default context menu
    oldEvent.preventDefault();
    // Check if the grayscale filter is applied and toggle the class
    if (!oldEvent.ctrlKey && !isShiftPressed && !isAltPressed) {
        targetElement.classList.toggle("selected");
        return
    }
    removeElementsByClasses(targetElement, 'blackMajorThreat', 'redMajorThreat', 'blackMinorThreat', 'redMinorThreat', 'redCheck', 'blackCheck');
    if(oldEvent.ctrlKey && isAltPressed) {
        targetElement.innerHTML += '<div class="blackMinorThreat">t</div>'
    } else if (isShiftPressed && isCPressed) {
        targetElement.innerHTML += '<div class="redCheck">C</div>';
    } else if (oldEvent.ctrlKey && isCPressed) {
        targetElement.innerHTML += '<div class="blackCheck">C</div>';
    } else if (isShiftPressed && isAltPressed) {
        targetElement.innerHTML += '<div class="redMinorThreat">t</div>';
    } else if (isShiftPressed) {
        targetElement.innerHTML += '<div class="redMajorThreat">T</div>';
    } else if(oldEvent.ctrlKey) {
        targetElement.innerHTML += '<div class="blackMajorThreat">T</div>';
    } else if (isAltPressed) {
        targetElement.innerHTML += '';
    }
    
}

function removeElementsByClasses(container, ...classNames) {
    classNames.forEach(className => {
        const elements = container.querySelectorAll(`.${className}`);
        elements.forEach(element => element.remove());
    });
}

document.addEventListener('click', function(event) {
    if (!event.target.closest('[onclick]')) {
      // Run your JavaScript function here
      removeSelections();
    }
});
document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
});
function displayMove(move) {
    const children = movesContainer.children;
        // Loop over each child element
        for (let i = 0; i < children.length; i++) {
            children[i].classList.remove('fay')
            if (children[i].classList.contains(`move-${move}`)) {
                children[i].classList.add('fay')
        }
    }
}
pppClickedElement = null
document.getElementById('textContainer').addEventListener('contextmenu', function (event) {
    event.preventDefault();
    
});
let numberer
let contextMenu = document.getElementsByClassName("moveText-context-menu")[0];
let deleteMenu = document.getElementById("deleteButtContext")
let branchMenu = document.getElementById("branchButtContext")
function rightClick(e) {
    e.preventDefault(); // Prevent the default context menu
    if (e.button === 2) { // Right-click check

        // Store the reference of the clicked item
        pppClickedElement = e.currentTarget;
        // Show the custom context menu
        contextMenu.classList.add("active");
        contextMenu.classList.remove("hidden");
        
        // Position the context menu at the click position
        contextMenu.style.top = `${e.clientY}px`;
        contextMenu.style.left = `${e.clientX}px`;
        for(let i = 0; i < movesContainer.children.length+1; i++) {
            if (e.target.classList.contains("move-" + i)) {
                numberer = i
            
            }
        }
    }
}
deleteMenu.addEventListener("click", (event) => {
    oldHistoryOfMoves = oldHistoryOfMoves.slice(0, numberer-1)
    HistoryOfMoves = HistoryOfMoves.slice(0, numberer-1)
    updateGridBasedOnHistoryOfMoves()
})
branchMenu.addEventListener("click", (event) => {

    navigator.clipboard.writeText(oldHistoryOfMoves.slice(0, numberer));
    
})

document.addEventListener("click", () => {
    contextMenu.classList.remove("active");
    contextMenu.classList.add("hidden");
}, {capture: true});

async function updateGrid(ev){ //Based on board
    alreadyPlayed = JSON.parse(localStorage.getItem('alreadyPlayed')) || {};
    removeMove();
    newBoard = newBoardFromHistoryAndOldBoard(HistoryOfMoves);
    const gridItems = document.querySelectorAll(".grid-item")
    gridItems.forEach(item => {
        const row = item.getAttribute(("data-row"));
        const col = item.getAttribute("data-col"); //starts at top right.
        const player = board[row][col]; //not be confused, just selecting the current place in the board.
        const newPlayer = newBoard[row][col];
        item.querySelector('.abc123')?.remove(); 
        if (newPlayer!==0) {
            newElement = document.createElement("div");
            newElement.classList.add("abc123")
            newElement.innerHTML += `${newPlayer}`
            item.appendChild(newElement)
        }
        item.classList.remove("player1", "player2", "no-player", "blackBackground", "redBackground");
        item.classList.add(player === 1 ? "player1" : player === 2 ? "player2" : "no-player");

    });
    try{
        hoverColumn(false, parseInt(ev.target.getAttribute("data-col"), 10))
    }catch(error){
        hoverColumn(false, playedColumn)
    }
    if(oldHistoryOfMoves.slice(0, HistoryOfMoves.length) !== HistoryOfMoves){
        oldHistoryOfMoves = HistoryOfMoves
    }

    inputField.value = HistoryOfMoves // Update the input field
    await updateGamePosition()
    updateText()
    displayMove(HistoryOfMoves.length)
    await solutionFunction();
    removeSelections()
    storage();
};
async function addPuzzle(difficulty) {
    position = HistoryOfMoves.length
    puzzle = oldHistoryOfMoves.slice(0, position) + '0' + oldHistoryOfMoves.slice(position);
    console.log("addPuzzle");
    const response = await fetch('http://localhost:8080/puzzles', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "difficulty": difficulty, "puzzle": puzzle })
    });
    const output = await response.text();
}

function storage() {
    sessionStorage.clear();
    sessionStorage.setItem("HistoryOfMoves", HistoryOfMoves);
    sessionStorage.setItem("oldHistoryOfMoves", oldHistoryOfMoves);
    sessionStorage.setItem("isSwitchOn", isSwitchOn);
    sessionStorage.setItem("oldLength", oldLength);
}





function newBoardFromHistoryAndOldBoard(HistoryOfMovess) {

    
    let newBoards = [[0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]]
    let dummyBoard = [[0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]]
    const el = oldLength
    if (oldLength > HistoryOfMovess.length) {
        oldLength = HistoryOfMovess.length
    }
    for (let i = 0; i < ROW_COUNT * COLUMN_COUNT; i++) {
        try{let col = HistoryOfMovess[i] - 1;
        let row = ROW_COUNT - 1;
        while (newBoards[row][col] !== 0) {
            row -= 1;
        }
        newBoards[row][col] = i + 1;}catch(error){break}
    }
    if (oldLength !== 0) {
        for (let i = 0; i < oldLength; i++) {
        let col = HistoryOfMovess[i] - 1;
        let row = ROW_COUNT - 1;
        while (dummyBoard[row][col] !== 0) {
            row -= 1;
        }
        dummyBoard[row][col] = i + 1;
        newBoards[row][col] = 0
    }
    }
    
    oldLength = el
    return newBoards
}

async function dropPiece(evt) {
    let clickedCol
    if(!evt.target.classList.contains("grid-item")) {
        clickedCol =  parseInt(evt.target.parentElement.getAttribute("data-col"), 10);
    } else {
        clickedCol = parseInt(evt.target.getAttribute("data-col"), 10);
    }
    
    currentPlayer = (HistoryOfMoves.length % 2 === 1) ? 2 : 1;
    for (let row = ROW_COUNT-1; row >= 0; row--) {
        if (board[row][clickedCol] === 0 && !isGameFinished) {
            board[row][clickedCol] = currentPlayer;
            checkFinished();
            if (isGameFinished) {
                playWinSound();
            } else {
                playDropSound();
            }
            HistoryOfMoves += String(clickedCol + 1);
            currentPlayer = (HistoryOfMoves.length % 2 === 1) ? 2 : 1;
            await updateGrid(evt);
            break;
        }
    }
}

async function dropPieceNoEventListener(clickedCol) {
    for (let row = ROW_COUNT-1; row >= 0; row--) {
        if (board[row][clickedCol] === 0 && !isGameFinished) {
            playDropSound()
            board[row][clickedCol] = currentPlayer;
            HistoryOfMoves += String(clickedCol + 1);
            checkFinished();
            currentPlayer = (HistoryOfMoves.length % 2 === 1) ? 2 : 1;
            await updateGrid(evt);
            break;
        }
    }
}
function checkWin(board, piece) {
    // Horizontal
    for (let c = 0; c < COLUMN_COUNT - 3; c++) {
        for (let r = 0; r < ROW_COUNT; r++) {
            if (board[r][c] == piece && board[r][c + 1] == piece && board[r][c + 2] == piece && board[r][c + 3] == piece) {
                return { start: [r, c], end: [r, c + 3] };
            }
        }
    }

    // Vertical
    for (let c = 0; c < COLUMN_COUNT; c++) {
        for (let r = 0; r < ROW_COUNT - 3; r++) {
            if (board[r][c] == piece && board[r + 1][c] == piece && board[r + 2][c] == piece && board[r + 3][c] == piece) {
                return { start: [r, c], end: [r + 3, c] };
            }
        }
    }

    // Diagonal (top-left to bottom-right)
    for (let c = 0; c < COLUMN_COUNT - 3; c++) {
        for (let r = 0; r < ROW_COUNT - 3; r++) {
            if (board[r][c] == piece && board[r + 1][c + 1] == piece && board[r + 2][c + 2] == piece && board[r + 3][c + 3] == piece) {
                return { start: [r, c], end: [r + 3, c + 3] };
            }
        }
    }

    // Diagonal (bottom-left to top-right)
    for (let c = 0; c < COLUMN_COUNT - 3; c++) {
        for (let r = 3; r < ROW_COUNT; r++) {
            if (board[r][c] == piece && board[r - 1][c + 1] == piece && board[r - 2][c + 2] == piece && board[r - 3][c + 3] == piece) {
                return { start: [r, c], end: [r - 3, c + 3] };
            }
        }
    }

    return false; // No win found
}

function removePieceFromColumn(column, boar) { //NO CHANGE
    for (let row = 0; row <= ROW_COUNT-1; row++) {
        if (boar[row][column] !== 0) {
            boar[row][column] = 0;
            break;
        }
    }

    // Return the modified board
    return boar; //update board
}

function removeSelections() {
    const gridItems = document.querySelectorAll(".grid-item");
    gridItems.forEach(item => item.classList.remove("selected"));
    removeElementsByClasses(container, "redMajorThreat", "blackMajorThreat", "blackMinorThreat", "redMinorThreat", "redCheck", "blackCheck");
    eraseCanvas();
}
document.body.addEventListener("keydown", (ev)=>{
    if (ev.key == "ArrowLeft"){
        removePiece()
    }
})
document.body.addEventListener("keydown", (ev)=>{
    if (ev.key == "ArrowUp"){
        resetGame()
    }
})
document.body.addEventListener("keydown", (ev)=>{
    if (ev.key == "ArrowDown"){
        forwardPlus()
    }
})
document.body.addEventListener("keydown", (ev)=>{
    if (ev.key == "ArrowRight"){
        forward()
    }
})
function removeMove() {
    const gridItems = document.querySelectorAll(".grid-item");
    gridItems.forEach(item => item.classList.remove("selectedHover"));
    playedColumn = null
}
async function selectMove(evt) {
    cell = evt.target.innerHTML;
    const letterMatch = cell.match(/[a-zA-Z]/);
    if (!letterMatch) {
        throw new Error("No valid column letter found");
    }
    const letterIndex = cell.indexOf(letterMatch[0]);

    // Ensure there is a character immediately after the letter
    if (letterIndex === cell.length - 1) {
        throw new Error("No character after column letter");
    }

    // Get the letter and the character after it
    const columnPart = cell[letterIndex].toLowerCase();
    const rowPart = ROW_COUNT-cell[letterIndex + 1];

    // Convert column letter to number
    const columnNumber = columnPart.charCodeAt(0) - 'a'.charCodeAt(0);

    document.querySelectorAll(".grid-item").forEach(el => {
        if (el.getAttribute("data-col") == columnNumber && el.getAttribute("data-row") == rowPart) {
            el.classList.add("selectedHover");
        }
    })
}

async function switchFunc(ev) {
    if (isSwitchOn==false){isSwitchOn = true
        ev.target.parentElement.parentElement.classList.add("active")
        ev.target.src = "svg/on.svg"
        await updateGamePosition(true)
        updateText()
        solutionFunction();
    }else {
        removeSolution()
        ev.target.parentElement.parentElement.classList.remove("active")
        ev.target.style.color = "black"
        isSwitchOn = false
        ev.target.src = "svg/off.svg"
        document.getElementById('computerTopText').innerHTML = ""
        await updateGamePosition(true)
        
    }
    storage();
}
document.getElementById("switch").addEventListener("click", switchFunc);
async function updateText() {
    let text = document.getElementById("computerTopText")
    if(isSwitchOn) {
        var message;
        let moves = HistoryOfMoves.split("")
        let solution2
        let updatedHOM2 = null
        let converted2 = null
        let i = HistoryOfMoves.length - 1
        updatedHOM2 = HistoryOfMoves.slice(0, i+1); //updated based on the current move in "for" loop. Not removed letter.
        converted2 = convertVariable(updatedHOM2) //convert the variable - check 123 and 567, convert to smallest start
        try {
            solution2 = [...alreadyPlayed[converted2]]
            if (checkString(updatedHOM2)) { //find out whether the string has a 5, 6, or 7 first (before 1, 2 or 3) in hom or not
                solution2 = [...solution2].reverse()
                }
        } catch (error) {
            // Code that runs if an exception is thrown in the try block
            solution2 = await fetchInfo(converted2);
            if (solution2===null){
                movesContainer.innerHTML = "<div class='offline'>The server is offline</div>";
            }
            alreadyPlayed[converted2] = solution2;
            if (checkString(updatedHOM2)) { //find out whether the string has a 5, 6, or 7 first (before 1, 2 or 3) in hom or not
            solution2 = [...solution2].reverse()
            }
        }

        let best = Math.max(...solution2.filter(num => num !== -1000 && !isNaN(num)));
        if (best == 0) message = "[1] draws" 
        else if(best > 0) {
            var nb_moves = (Math.floor(((45 - moves.length)/2)) - best)*2-1 + moves.length;
            if (isGameFinished) message=`${3 -currentPlayer} Won`;
            else if(nb_moves > 1) message = "[1] wins with disc [2]".replace("[2]", nb_moves);
            else message = "[1] wins with disc 1";
        }
        else if(best < 0) {
            var nb_moves = (Math.floor((44 - moves.length)/2) + best)*2 +moves.length;
            if (isGameFinished) message=`${3 -currentPlayer} Won`;
            else if(nb_moves > 1) message = "[1] loses with disc [2]".replace("[2]", nb_moves);
            else message = "[1] loses with disc 1";
        }
        if (currentPlayer == 1){ text.innerHTML = message.replace("[1]", "Player 1")}else {text.innerHTML = message.replace("[1]", "Player 2")}
        
    }
}
function removeSolution() {
    elements = document.querySelectorAll(".solution")
    elements.forEach(element => {
        element.innerHTML = "-"
        element.classList.remove("winMove", "loseMove", "drawMove", "filledColumn")
        element.classList.add("filledColumn")
    })
}
async function autoPlayMoves() {
    toggleSVGs(true);
    
    if (isRunning) {
        isPaused = !isPaused;
        return;
    }

    isRunning = true;
    isPaused = false;

    if (HistoryOfMoves === oldHistoryOfMoves) {
        HistoryOfMoves = "";
    }

    while (HistoryOfMoves.length < oldHistoryOfMoves.length) {
        if (isPaused) {
            await new Promise(resolve => {
                const checkPaused = setInterval(() => {
                    if (!isPaused) {
                        clearInterval(checkPaused);
                        resolve();
                    }
                }, 1);
            });
        }
        
        HistoryOfMoves = oldHistoryOfMoves.slice(0, HistoryOfMoves.length + 1);
        await updateGridBasedOnHistoryOfMoves();
        
        await playAppropriateSound();

        if (HistoryOfMoves.length !== oldHistoryOfMoves.length) {
            await wait(300);
        }
    }

    toggleSVGs(false);
    currentMoveIndex = 0;
    isRunning = false;
}

async function playAppropriateSound() {
    // Stop any currently playing sounds
    try {
        dropSound.pause();
        await dropSound.load(); // Ensure the sound is fully paused and reloaded
    } catch (e) {
        console.error("Error stopping drop sound:", e);
    }
    
    try {
        winSound.pause();
        await winSound.load(); // Ensure the sound is fully paused and reloaded
    } catch (e) {
        console.error("Error stopping win sound:", e);
    }

    try {
        if (isGameFinished) {
            await playWinSound()
        } else {
            await playDropSound()
        }
    } catch (e) {
        console.error("Error playing sound:", e);
    }
}



function changeCSSVariable(name, value) {
    document.documentElement.style.setProperty(name, value);
}

// Mutation Observer callback
function handleMutations(mutations) {
    mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
            updateBoardHeight();
        }
    });
}

function updateBoardHeight() {
    // Get the height and width of the viewport
    let docHeight = document.documentElement.clientHeight;
    let docWidth = document.documentElement.clientWidth;
    let height = (docHeight / 1.35 < docWidth / 1.3) ? docHeight / 1.35 : docWidth / 1.3;
    let sideHeight = height * 2 / 1.5
    // Change the CSS variable for board height
    if (docHeight/docWidth <1 && docWidth < 1200) height = height- 80; else height -= 20
    if ((docWidth < 950) && (docWidth/docHeight > 2)) height = height/1.1
    let width = height * COLUMN_COUNT / ROW_COUNT
    
    if (docHeight/docWidth > 1 && oldLength != ROW_COUNT * COLUMN_COUNT) {
        oldLength = ROW_COUNT * COLUMN_COUNT
        newBoard = newBoardFromHistoryAndOldBoard(HistoryOfMoves)
        const gridItems = document.querySelectorAll(".grid-item")
        gridItems.forEach(item => {
            const row = item.getAttribute(("data-row"))
            const col = item.getAttribute("data-col"); //starts at top right.
            const newPlayer = newBoard[row][col];
        item.querySelector('.abc123')?.remove(); 
        if (newPlayer!==0) {
            newElement = document.createElement("div");
            newElement.classList.add("abc123")
            newElement.innerHTML += `${newPlayer}`
            item.appendChild(newElement)
        }
        })
        
    }

    changeCSSVariable('--sideHeight', sideHeight + 'px');
    changeCSSVariable('--boardHeight', height + 'px');

    // Change the CSS variable for board height
    changeCSSVariable('--boardWidth', (width) + 'px');
}

document.getElementById('resetNumber').addEventListener('mousedown', removeNumbers);

function resetNumber() {
    oldLength = HistoryOfMoves.length
    updateGrid();
}
function removeNumbers(event) {
    event.preventDefault();
    if (event.button==2)  {
        oldLength = COLUMN_COUNT * ROW_COUNT
        updateGrid();
    }
    
}



document.getElementById('buttons').addEventListener('contextmenu', function (event) {
    event.preventDefault();
})

//window resize observer
new MutationObserver(handleMutations).observe(document, { childList: true, subtree: true });

window.addEventListener('resize', updateBoardHeight);

// Initial update
updateBoardHeight();

  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

async function toggleSVGs(bool) {
    var svg1 = document.getElementsByClassName("line-md--pause-to-play-transition")[0];
    var svg2 = document.getElementsByClassName("line-md--play-to-pause-transition")[0];
    var button = document.getElementById("customPosButt")
    if (button.classList.contains("customPosButt--Active") || (bool === false)) {
        svg1.style.display = "block";
        svg2.style.display = "none";
        pauseOrNot = false
        button.classList.remove("customPosButt--Active")
    } else {
        pauseOrNot = true
        button.classList.add("customPosButt--Active")
        svg1.style.display = "none";
        svg2.style.display = "block";
    }
}


container.addEventListener('wheel', function (event) { //scroll wheel
    if (event.deltaY > 0) {
        forward()
    } else {
        removePiece()
    }
}, {passive: true})

async function forwardPlus() /* Button */{
HistoryOfMoves = oldHistoryOfMoves
await updateGridBasedOnHistoryOfMoves()
}
async function forward() { /* Button */
    if (oldHistoryOfMoves!==HistoryOfMoves){
        HistoryOfMoves = oldHistoryOfMoves.slice(0, HistoryOfMoves.length + 1)
        await playAppropriateSound()
        await updateGridBasedOnHistoryOfMoves()
    }
}
function removePiece() { /* Button */
    if (HistoryOfMoves === "" && inputField.value === "") {
        return false; // No moves to undo
    }
    const lastMove = parseInt(HistoryOfMoves[(HistoryOfMoves.length - 1)], 10); // Get the column of the last move
    HistoryOfMoves = HistoryOfMoves.substring(0, HistoryOfMoves.length - 1); // Remove the last move from history
    board = removePieceFromColumn(lastMove - 1, board); // Remove the last piece from the board
    currentPlayer = (HistoryOfMoves.length % 2 === 0) ? 1 : 2; // Update the current player based on the length of history
    checkFinished();
    updateGrid(); // Update the grid to reflect the changes
}

function changePositionButton(){
    if (openAlready == false) {
        openAlready = true
        document.getElementById("customPosForm").style.visibility = "visible";
    } else {
        openAlready = false
        document.getElementById("customPosForm").style.visibility = "hidden";
    }
    return 1
}

function resetGame(evt) /*button*/{
    isRunning = true;
    isPaused = false;
    HistoryOfMoves = ""
    inputField.value = ""
    isGameFinished = false
    updateGridBasedOnHistoryOfMoves(evt) //evt is storing the variable of the hover thing.
}



createGrid();
redrawLines();



solutionFunction()
updateGridBasedOnHistoryOfMoves();


async function checkFinished() {
    let win = checkWin(board, currentPlayer);
    if (win) {
        startCol = win.start[1];
        startRow = win.start[0];
        endCol = win.end[1];
        endRow = win.end[0];
        await wait(1) 
        updateCanvas(startRow, startCol, endRow, endCol, true);
    }
    if (HistoryOfMoves.length === ROW_COUNT * COLUMN_COUNT || win) {
        isGameFinished = true;
        return true
    }else{
        isGameFinished = false; return false
    }
}