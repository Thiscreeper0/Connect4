let isSolutionFound = false

let COLUMN_COUNT = 7
let ROW_COUNT = 6


let a = 0;

let output
async function fetchInfo(poss) {
    console.log("fetch")
    const response = await fetch('http://localhost:3000/solve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ position: poss })
    });
     output = await response.text(); // Use response.text() to get the plain text response
     output = output.split(' ').map(Number).slice(1)
     if (output.length == 0) {
        output = [-1000, -1000, -1000, -1000, -1000, -1000, -1000]
     }
     return output

}

async function fetchPuzzle(diff) {
    try {
        const response = await fetch(`http://localhost:8080/puzzles/random?difficulty=${diff}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        return data.puzzle; // Returning the puzzle string directly
    } catch (error) {
        console.error("Failed to fetch puzzle:", error);
        return null; // Return null or handle error accordingly
    }
}



let gamePositionHistory = "";
let gamePositionHistory1 = "";
set = localStorage.getItem('set') || '00000';
// Assume this is part of your frontend JavaScript code
// Select the node that will be observed for mutations
const targetNode = document.querySelector('.container');
// Create an observer instance linked to the callback function
const observer2 = new MutationObserver(handleMutations);
let oldRow
let openAlready = false
let pauseOrNot = false
let isRunning = false; // Flag to check if the function is running
let isPaused = false;  // Flag to check if the function is paused
const Numbers = "ABCDEFG"
let alreadyPlayed = JSON.parse(localStorage.getItem('alreadyPlayed')) || {};
let solution = [-2, -1, 0, 1, 0, -1, -2]
let checking = false
let oldSolution = [-2, -1, 0, 1, 0, -1, -2]
let isSwitchOn = false
let isShiftPressed = false;
let isAltPressed = false;
let isCPressed = false;
let currentPlayer = 1;
let HistoryOfMoves
let a1291SolutionToPuzzle
let puzzlePlayer
async function getHistoryOfMoves() {
    let full = await fetchPuzzle(2);
    HistoryOfMoves = full.slice(0, full.indexOf('0'));
    oldHistoryOfMoves = full.slice(0, full.indexOf('0'));
    a1291SolutionToPuzzle = full.slice(full.indexOf('0')+1, full.length);
    puzzlePlayer = HistoryOfMoves.length%2
    console.log(puzzlePlayer+1) 
    createGrid();
    updateGridBasedOnHistoryOfMoves();
    console.log(a1291SolutionToPuzzle)
}


function checkPuzzleSolution() {
    if (oldHistoryOfMoves.at(-1) == a1291SolutionToPuzzle.at(0)) {
        isSolutionFound = true
        solutionWasFound()
    }
}

function removeElementsByClass(className) {
    let elements = document.getElementsByClassName(className);
    while(elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}

function solutionWasFound() {
    if (isSolutionFound && document.getElementById("textContainer").querySelector(".foundSolution") === null) {
        newelement = document.createElement("div");
        newelement.classList.add("foundSolution");
        newelement.innerHTML = "Solution was found";
        newelement.addEventListener("click", function() {
            getHistoryOfMoves();
            updateGridBasedOnHistoryOfMoves();
            removeElementsByClass("foundSolution");
            isSolutionFound = false
            console.log(isSolutionFound)
        })
        document.getElementById("textContainer").appendChild(newelement);

    }
}


getHistoryOfMoves(); // Call the function to execute
const canvas = document.querySelector('.canvas');
const context = canvas.getContext('2d')
const lines = [];
let gamePosition = "";
const inputField = document.getElementById('inputField');
const container = document.getElementById("Container");
let audio = new Audio();
let audioWin = new Audio();
audioWin.src = "sound/soundEffectWin.wav"
audioWin.volume = 0.2
audio.src = "sound/soundEffectClick.wav"
audio.volume = 0.2
let oldHistoryOfMoves = ""
let checkOrNot = true
let board = 
    [[0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]]
let playedColumn = null
let newBoard
let oldLength = ROW_COUNT * COLUMN_COUNT
let isGameFinished = false
function onMouseDown(event) {
    if (event.target.classList.contains('grid-item')) {
        startRow = event.target.dataset.row;
        startCol = event.target.dataset.col;
    }else {
        startRow = event.target.parentElement.dataset.row;
        startCol = event.target.parentElement.dataset.col;
    }
}
function onMouseUp(event) {
    if (event.button === 2) { // Right mouse button
        if (event.target.classList.contains('grid-item')) {
            endRow = event.target.dataset.row;
            endCol = event.target.dataset.col;
        }else {
            endRow = event.target.parentElement.dataset.row;
            endCol = event.target.parentElement.dataset.col;
        }
        
        if ((startRow !== null && startCol !== null) && !(startRow == endRow && startCol == endCol)) {
            updateCanvas(startRow, startCol, endRow, endCol);
            // Reset start positions
            startRow = null;
            startCol = null;
        } else if (startRow !== null && startCol !== null) {
            toggleGrayscaleFilter(event);
        }
    }
}
function updateCanvas(startRow, startCol, endRow, endCol, bol) {
    const items = document.querySelectorAll('.grid-item');
    if (items.length !== ROW_COUNT * COLUMN_COUNT) return;
    let colors
    if (bol) {
        colors = 1
    }else if (isShiftPressed) {
        colors = 0
    }else {
        colors = 1;
    }
    const itemRect = items[0].getBoundingClientRect();
    const itemWidth = itemRect.width;
    const itemHeight = itemRect.height;

    const startX = (itemWidth * startCol) + (itemWidth / 2);
    const startY = (itemHeight * startRow) + (itemHeight / 2);
    const endX = (itemWidth * endCol) + (itemWidth / 2);
    const endY = (itemHeight * endRow) + (itemHeight / 2);

    const newLine = { startX, startY, endX, endY, colors };
    // Check if the line already exists (either direction)
    const existingLineIndex = lines.findIndex(line =>
        (line.startX === newLine.startX && line.startY === newLine.startY &&
         line.endX === newLine.endX && line.endY === newLine.endY) ||
        (line.startX === newLine.endX && line.startY === newLine.endY &&
         line.endX === newLine.startX && line.endY === newLine.startY)
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
        if (existingLine.colors !== newLine.colors) {
            lines.push(newLine);
    }}
    catch(e){}
    // Redraw all lines
    redrawLines();
}
function redrawLines() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    context.clearRect(0, 0, canvas.width, canvas.height);
    let wid = 17
    context.lineWidth = wid;
    lines.forEach(line => {
        context.beginPath();
        if (line.colors === 1) {
            context.strokeStyle = 'rgb(255, 99, 71)'
        }else if (line.colors === 0) {
            context.strokeStyle = 'rgb(18, 18, 18)';
        }else if (line.colors === 2) {
            context.strokeStyle = 'rgb(255, 0, 255)';
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
function resizeCanvas() {
    redrawLines();
}
if (!sessionStorage.getItem('HistoryOfMoves')) {
    sessionStorage.setItem('HistoryOfMoves', "");
    }   else {
    }
if (!sessionStorage.getItem('oldHistoryOfMoves')) {
    sessionStorage.setItem('oldHistoryOfMoves', "");
}   else {
    oldHistoryOfMoves = sessionStorage.getItem('oldHistoryOfMoves')
}


if (!sessionStorage.getItem('oldLength')) {
    sessionStorage.setItem('oldLength', ROW_COUNT * COLUMN_COUNT);
}   else {
    oldLength = sessionStorage.getItem('oldLength')
};

isSwitchOn = JSON.parse(isSwitchOn)
if (isSwitchOn) {
    flipOn();
}




function checkString(str, COLUMN_COUNT) {
    const falseNumbers = new Set();
    for (let i = 1; i < COLUMN_COUNT; i++) {
        falseNumbers.add(i.toString());
    }

    const trueNumbers = new Set();
    for (let i = COLUMN_COUNT; i <= 50; i++) { // Adjust the upper limit if necessary
        trueNumbers.add(i.toString());
    }

    for (let i = 0; i < str.length; i++) {
        const char = str.charAt(i);
        if (falseNumbers.has(char)) {
            return false; // Return false for numbers less than COLUMN_COUNT
        } else if (trueNumbers.has(char)) {
            return true; // Return true for numbers greater than or equal to COLUMN_COUNT
        }
    }

    return false; // If no match is found, return false
}

function evaluateMove(arr, num, originalArr, bool) {
    let character = "";
    theNumber = arr[num - 1]
    if (arr.filter(val => !Number.isNaN(val)).length === 1) {
        character = "➧";
    }else if (theNumber === 1) {
      if (arr.filter(val => val === 1).length === 7 && set[2] == 0) {
        character = "+"
      } else if (!(arr.includes(0)) && (arr.filter(val => val === -1 || isNaN(val)).length == 6) && set[1] == 0) {
        character = "!!"
      } else if ((arr.filter(val => val === 1).length === 1)) {
        character = "!"
      }
    } else if (theNumber === 0) {
      if ((arr.includes(1) === false) && arr.filter(val => val === 0).length === 1) {
        character = "!"
      } else if (arr.includes(1)) {
        character = "?"
      } else if (arr.filter(val => val === 0).length === 7) {
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
    if (bool) {
        character += "#" // Add "#" symbol for mate
    }
    return character
}
if (set[4] ==1) {
    const movesContainer = document.getElementById('movesContainer');
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
    let newvar = String(variable); // Copy variable to a new string
    let convert = false;
    let result = ''; // This will store the new string
    for (let i = 0; i < newvar.length; i++) {
        if (convert) {
            result += String(8 - Number(newvar[i])); // Subtract from 8 and append to result
        } else if (['5', '6', '7'].includes(newvar[i])) {
            convert = true; // Start conversion from this point
            result += String(8 - Number(newvar[i])); // Also convert the current character
        } else if (['1', '2', '3'].includes(newvar[i])) {
            result = variable; // if 123 has been found, return the original variable
            break
        } else if (newvar[i] == '4') {
            result += '4'; // Keep '4' as is
        } else {
            result += newvar[i]; // Append other characters unchanged
        }
    }
    return result; // Output the result
}

function removeUntilNoSevenRepeats(str) {
    // Function to check if any character appears 7 or more times
    function hasSevenRepeats(s) {
      const count = {};
      for (let char of s) {
        if (count[char]) {
          count[char]++;
        } else {
          count[char] = 1;
        }
        if (count[char] === 7) return true;
      }
      return false;
    }
  
    // Remove last character until no character is repeated 7 times
    while (hasSevenRepeats(str)) {
      str = str.slice(0, -1);
    }
  
    return str;
}
// Add an event listener for input event
inputField.addEventListener('input', async function() {
    let inputValue = inputField.value;
    inputValue = removeUntilNoSevenRepeats(inputValue);
    inputValue = inputValue.replace(/[^1-7]/g, ''); // Ensures only valid column numbers are entered
    inputField.value = inputValue; // Update the input field

    if (inputValue.length !== 0) {
        HistoryOfMoves = String(inputValue);
    } else {
        HistoryOfMoves = "";
    }
    await updateGridBasedOnHistoryOfMoves();
});
async function updateGridBasedOnHistoryOfMoves() {
    // Reset the board before updating moves
    board = [[0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0]];
    // Repopulate the board based on the history of moves
    len = HistoryOfMoves.length
    
    for (let i = 0; i < len; i++) {
        const clickedCol = parseInt(HistoryOfMoves[i]) - 1;
        for (let row = ROW_COUNT - 1; row >= 0; row--) {
            if (board[row][clickedCol] === 0) {
                board[row][clickedCol] = (i % 2 === 0) ? 1 : 2; // Alternate between players
                break;
            }
        }
        checkFinished();// Check if the game has finished after updating
        currentPlayer = (i % 2 === 1) ? 1 : 2;
        if(len !==ROW_COUNT*COLUMN_COUNT && isGameFinished) {
            HistoryOfMoves = HistoryOfMoves.substring(0, i + 1)
            break;
        }   
        
    }
    await updateGrid(); // Redraw the grid based on the new board state
}
function updateSolutionElements(numbersArray) {
    if(numbersArray==null) {
        numbersArray = [-2, -1, 0, 1, 0, -1, -2]
    }
    const solutionElements = document.querySelectorAll('.solution');
    if (solutionElements.length !== numbersArray.length) {
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
            document.getElementById("movesContainer").innerHTML = "<div class='offline'>The server is offline</div>";
        }
        alreadyPlayed[converted1] = solution1;
        console.log(updatedHOM1)
        if (checkString(updatedHOM1)) { //find out whether the string has a 5, 6, or 7 first (before 1, 2 or 3) in hom or not
        solution1 = [...solution1].reverse()
        }
    }
    
    updateSolutionElements(solution1);

}


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
                if(col==0 && row==5){
                    gridItem.innerHTML = '<div class="Col1">1</div><div class="Row5">A</div>'
                }else if (col===0){
                    gridItem.innerHTML = `<div class="Col1">${5-row+1}</div>`
                }else if (row===5){
                    gridItem.innerHTML = `<div class="Row5">${Numbers[col]}</div>`
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

document.getElementById('textContainer').addEventListener('contextmenu', function (event) {
    event.preventDefault();
});
function rightClick(event) {
    if (event.button==2)  {
        selecter = document.getElementById('right-click-menu');
        
    }
}


function isRightMove() {
    
}

async function updateGrid(ev){ //Based on board
    checkPuzzleSolution()
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
    isRightMove();
    removeSelections()
    inputField.value = HistoryOfMoves // Update the input field
    await updateGamePosition()
    updateText()
    displayMove(HistoryOfMoves.length)
    await solutionFunction();
    storage();
    

};

function storage() {
    sessionStorage.clear();
    sessionStorage.setItem("HistoryOfMoves", HistoryOfMoves);
    sessionStorage.setItem("oldHistoryOfMoves", oldHistoryOfMoves);
    sessionStorage.setItem("isSwitchOn", isSwitchOn);
    sessionStorage.setItem("oldLength", oldLength);
}

function clearStorage() {
    sessionStorage.clear();
    a +=1
    if (a!=0) {
    }
}


function checkFinished() {
    const win = checkWin(board, currentPlayer);
    if (win) {
        updateCanvas(String(win.start[0]), String(win.start[1]), String(win.end[0]), String(win.end[1]), true);
    }
    if (HistoryOfMoves.length === ROW_COUNT * COLUMN_COUNT || win) {
        isGameFinished = true;
        return true
    }else{
        isGameFinished = false; return false
    }
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
        let row = 5;
        while (newBoards[row][col] !== 0) {
            row -= 1;
        }
        newBoards[row][col] = i + 1;}catch(error){break}
    }
    if (oldLength !== 0) {
        for (let i = 0; i < oldLength; i++) {
        let col = HistoryOfMovess[i] - 1;
        let row = 5;
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
    console.log("runww")
    let clickedCol
    if(!evt.target.classList.contains("grid-item")) {
        clickedCol =  parseInt(evt.target.parentElement.getAttribute("data-col"), 10);
    } else {
        clickedCol = parseInt(evt.target.getAttribute("data-col"), 10);
    }
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
function eraseCanvas() {
    // Clear the lines array
    lines.length = 0;
    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
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
    const rowPart = 6-cell[letterIndex + 1];

    // Convert column letter to number
    const columnNumber = columnPart.charCodeAt(0) - 'a'.charCodeAt(0);

    document.querySelectorAll(".grid-item").forEach(el => {
        if (el.getAttribute("data-col") == columnNumber && el.getAttribute("data-row") == rowPart) {
            el.classList.add("selectedHover");
        }
    })
}

async function switchFunc(ev) {
    if (isSwitchOn==false && isSolutionFound){isSwitchOn = true
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
        updateText()
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
                document.getElementById("movesContainer").innerHTML = "<div class='offline'>The server is offline</div>";
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
            else if(nb_moves > 1) message = "[1] lose with disc [2]".replace("[2]", nb_moves);
            else message = "[1] lose with disc 1";
        }
        if (currentPlayer == 1){ text.innerHTML = message.replace("[1]", "Player 1")}else {text.innerHTML = message.replace("[1]", "Player 2")}
        
    } else{
        await updateTextNoComputer()
    }
}
async function updateTextNoComputer() {
    let text = document.getElementById("computerTopText")
    var message;
    let moves = oldHistoryOfMoves.split("")
    let solution2
    let updatedHOM2 = null
    let converted2 = null
    let i = oldHistoryOfMoves.length - 1
    updatedHOM2 = oldHistoryOfMoves.slice(0, i+1); //updated based on the current move in "for" loop. Not removed letter.
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
            document.getElementById("movesContainer").innerHTML = "<div class='offline'>The server is offline</div>";
        }
        alreadyPlayed[converted2] = solution2;
        if (checkString(updatedHOM2)) { //find out whether the string has a 5, 6, or 7 first (before 1, 2 or 3) in hom or not
        solution2 = [...solution2].reverse()
        }
    }
    let bestMove = findBestMoves(solution2)
    let best = Math.max(...solution2.filter(num => num !== -1000 && !isNaN(num)));
    if (bestMove.length == 1) message = `[1] to play and [2] move [3]`.replace("[2]", bestMove.length); else message = `[1] to play and [2] moves [3]`.replace("[2]", bestMove.length);
    if (best == 0) message =message.replace("[3]", "draws")
    if (best > 0) message = message.replace("[3]", "wins")
    if (best < 0) message = "[1] loses"
    if (Number.isInteger(oldHistoryOfMoves)){ text.innerHTML = message.replace("[1]", "Player 1")}else {text.innerHTML = message.replace("[1]", "Player 2")}
    
}
const findBestMoves = (solution2) => {
    // Replace positive numbers with 1, negative numbers (except -1000) with -1, and leave -1000 as is.
    const updatedSolution = solution2.map(num => {
        if (num === -1000) return -1000;  // Keep empty columns as is.
        if (num > 0) return 1;            // Replace positive numbers (wins) with 1.
        if (num < 0) return -1;           // Replace negative numbers (losses) with -1.
        return 0;                         // Neutral values or draws get replaced with 0.
    });
    
    // Filter out empty columns (-1000) and NaN if present.
    const validMoves = updatedSolution.filter(num => num !== -1000 && !isNaN(num));
    
    // Find the maximum move (1 for win, 0 for draw, -1 for loss).
    const bestMove = Math.max(...validMoves);
    
    // Map through the updatedSolution to find indices of the best move, then filter.
    return updatedSolution
        .map((num, index) => (num === bestMove ? index : -1))
        .filter(index => index !== -1);
};
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
    let width = height * 7 / 6
    
    /*if (docHeight/docWidth > 1 && oldLength != ROW_COUNT * COLUMN_COUNT) {
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
        
    }*/

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
        oldLength = ROW_COUNT * COLUMN_COUNT
        updateGrid();
    }
    
}



document.getElementById('buttons').addEventListener('contextmenu', function (event) {
    event.preventDefault();
})

observer2.observe(document, { childList: true, subtree: true });
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


container.addEventListener('wheel', function (event) {
    if (event.deltaY > 0) {
        forward()
    } else {
        removePiece()
    }
}, {passive: true})

async function forwardPlus(ev) {
    HistoryOfMoves = oldHistoryOfMoves
    currentPlayer = 1
    await updateGridBasedOnHistoryOfMoves()
}
async function forward(ev) {
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
    /*if(!(oldHistoryOfMoves.slice(0, HistoryOfMoves.length) === HistoryOfMoves)){ //have to check if they have similarities
        oldHistoryOfMoves = HistoryOfMoves
    }*/
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

async function resetGame(evt) /*button*/{
    board = [[0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]]
    isRunning = false;
    isPaused = false;
    currentPlayer = 1;
    isGameFinished = false
    HistoryOfMoves = ""
    inputField.value = ""
    await updateGridBasedOnHistoryOfMoves()
}

async function flipOn() {
    if (isSwitchOn) {
        const computerTop = document.getElementsByClassName("computerTop")[0];
        const switchs = document.getElementById('switch')
        computerTop.classList.add("active");
        switchs.querySelectorAll("img")[0].classList.add("active")
        switchs.querySelectorAll("img")[0].src = "svg/on.svg"
        updateText()
    }
}

resizeCanvas();
