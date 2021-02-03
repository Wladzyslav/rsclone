
document.addEventListener('DOMContentLoaded', function () {

    ///document.getElementById(this.id).style.backgroundImage = "url('img/0.png'");
    //alert('ttt');

    var el, s, result, divs, t, id, sss = 0;

    function doc_keyUp(e) {

        console.log(e.keyCode);


        if (e.keyCode == 37) {
            result = cards.filter(cards => cards.status == 1);


            for (let i = sss; i < result.length; i--) {

                el = document.getElementById(result[i].id);

                if (el.classList.contains("selected-card")) {

                    console.log('111');

                    el.classList.remove("selected-card");
                    if (sss < result.length - 1) t = i - 1;
                    el = document.getElementById(result[t].id);
                    s = cards.map(e => e.id).indexOf(result[t].id);
                    if (sss < result.length - 1) sss = i - 1;
                    else sss = 0;

                }

                else {

                    console.log('222');

                    console.log(result[i].id);

                    el = document.getElementById(result[i].id);
                    el.classList.add("selected-card");
                    s = cards.map(e => e.id).indexOf(result[i].id);
                    return false;
                }


            }

        }

        // this would test for whichever key is 40 and the ctrl key at the same time
        if (e.keyCode == 38) { //e.ctrlKey &&
            // call your function to do the thing
            //pauseSound();
            var isOK = centerStack.length % 2 === 0;
            for (let i = 0; i < cards.length; i++) {
                if (cards[i].status === 3) {
                    cards[i].status = isOK ? 4 : currentPlayer;
                    cards[i].hide();
                }
            }

            if (isGameOver()) {
                var winner = getWinner();
                //   alert("winner is " + winner);
                pop(winner);
                return;
            }

            changePlayer();
            renderTrash();
            refillFirstHand();
            renderFirstHand();
            refillSecondHand();
            renderSecondHand();
            centerStack = [];
            computerMove();/**/
        }

        //sss=0;

        if (e.keyCode == 39) {

            // console.log(sss);

            result = cards.filter(cards => cards.status == 1);


            for (let i = sss; i < result.length; i++) {

                el = document.getElementById(result[i].id);

                if (el.classList.contains("selected-card")) {

                    el.classList.remove("selected-card");


                    if (sss < result.length - 1) t = i + 1;


                    el = document.getElementById(result[t].id);

                    s = cards.map(e => e.id).indexOf(result[t].id);

                    if (sss < result.length - 1) sss = i + 1;
                    else sss = 0;

                }

                else {

                    el = document.getElementById(result[i].id);
                    el.classList.add("selected-card");
                    s = cards.map(e => e.id).indexOf(result[i].id);
                    return false;
                }


            }


        }




        if (e.keyCode == 13) {
            // console.log(s);
            el.classList.remove("selected-card");
            moveToCenter(s);
        }

    }
    document.addEventListener('keyup', doc_keyUp, false);
});


var modal = null
function pop(x) {
    if (modal === null) {
        console.log('111');
        document.getElementById("box").style.display = "block";
        var name = localStorage.getItem('name');
        if (name) {
            document.getElementById("start").style.display = "none";
            if (x == 1) document.getElementById("congratulate").innerHTML = 'Good job, ' + name + '!';
        }

        modal = true
    } else {
        document.getElementById("box").style.display = "none";
        modal = null
    }
}

//Card status description:
// 0 - stack,
// 1 - first hand,
// 2 - second hand,
// 3 - on field
// 4 - out

function Card(id) {
    this.id = id;
    this.status = 0;

    this.hide = function () {
        document.getElementById(this.id).style
            .backgroundImage = "url('img/0.png'";
    }

    this.show = function () {
        document.getElementById(this.id).style
            .backgroundImage = "url('img/" + id + ".png')";
    }

}

const FIRST_HAND_OFFSET_X = 100;
const FIRST_HAND_OFFSET_Y = 300;
const SECOND_HAND_OFFSET_X = 100;
const SECOND_HAND_OFFSET_Y = 0;
const CENTER_OFFSET_Y = 120;
const CENTER_OFFSET_Y2 = 170;
const TRASH_OFFSET_X = 600;
const CARD_HAND_WIDTH = 85;

var allCards = [];
var cards = [];
var allCardsString = [];
var centerStack = [];
var compHand = [];
var isGameOver = false;
var currentPlayer = 1;
var mainKind = 0;

var stackSetup = function () {
    console.log("stack setup");
    var canvas = document.getElementById("canvas");
    for (var i = 1; i < 5; i++) {
        for (var j = 6; j < 15; j++) {
            allCards.push(i * 100 + j);
            allCardsString.push(i * 100 + j + "");
            var el = document.createElement('div');
            el.id = i * 100 + j;
            el.classList.add("card-back");
            canvas.appendChild(el);
            cards.push(new Card(i * 100 + j));
        }
    }
    for (var i = 0; i < cards.length; i++) {
        cards[i].status = 0;
    }
}

var shuffle = function (array) {
    let counter = array.length;
    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);
        // Decrease counter by 1
        counter--;
        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;
}

var relayoutStack = function () {
    console.log("stack relayout");
    for (var i = 0; i < cards.length; i++) {
        if (cards[i].status === 0) {
            var el = document.getElementById(cards[i].id);
            el.style.top = (i * 2) + "px";
            el.style.left = (i * 2) + "px";
            el.style.zIndex = i + "";
            cards[i].hide();
        }
    }
    mainKind = getKind(cards[0].id);
    var mainEl = document.getElementById(cards[0].id);
    mainEl.style.top = (150) + "px";
    cards[0].show();
}

var refillFirstHand = function () {
    console.log("move to first hand");
    var currentSize = getSize(1);
    for (var i = currentSize; i < 6; i++) {
        var stackSize = getSize(0);
        if (stackSize > 0) {
            cards[stackSize - 1].status = 1;
        }
    }
}

var refillSecondHand = function () {
    console.log("move to second hand");
    var currentSize = getSize(2);
    for (var i = currentSize; i < 6; i++) {
        var stackSize = getSize(0);
        if (stackSize > 0) {
            cards[stackSize - 1].status = 2;
        }
    }
}

function computerMove() {
    if (currentPlayer === 1) return;
    compHand = [];
    for (let i = 0; i < cards.length; i++) {
        if (cards[i].status === 2) {
            compHand.push(i);
        }
    }
    var secondHandSize = getSize(2);
    for (let i = 0; i < 10; i++) {
        let index = Math.floor(Math.random() * secondHandSize);
        console.log("random index: " + index);
        if (isValidMove(compHand[index])) {
            //MAKE MOVE
            console.log("VALID MOVE: " + index);
            moveToCenter(compHand[index]);
            return;
        } else {
            console.log("invalid move: " + index + " " + cards[index]);
        }
    }

}

function moveToCenter(index) {
    if (isGameOver()) {
        var winner = getWinner();
        // alert("winner is " + winner);
        pop(winner);

        return;
    }
    console.log('click on index # ' + index);
    if (cards[index].status === currentPlayer) {
        if (isValidMove(index)) {
            cards[index].status = 3;
            centerStack.push(index);
            renderSecondHand();
            renderFirstHand();
            renderCenter();
            changePlayer();
            computerMove();
        } else {
            //TODO: show hint "invalid card"
        }
    } else {
        //TODO: show hind "wrong player, it's not your turn"
    }
}

function getKind(id) {
    return (id - (id % 100)) / 100;
}

function getValue(id) {
    return id % 100;
}

function isValidValue(id) {
    var values = [];
    for (let i = 0; i < centerStack.length; i++) {
        values.push(cards[centerStack[i]].id % 100);
    }
    return values.includes(id % 100);
}

function isValidMove(index) {
    var currentCardId = cards[index].id;
    if (centerStack.length === 0) return true;
    if (centerStack.length % 2 === 1) {
        var prevCardId = cards[centerStack[centerStack.length - 1]].id;
        if (getKind(currentCardId) === getKind(prevCardId)) {
            return (currentCardId > prevCardId);
        } else {
            //TODO: need to check main kind
            return getKind(currentCardId) === mainKind;
        }
    } else {
        //TODO: check same kind and main kind
        return isValidValue(currentCardId); //for test only, remove later
    }
}

function changePlayer() {
    currentPlayer === 2 ? currentPlayer = 1 : currentPlayer = 2;
}

var isGameOver = function () {
    var firstHandSize = getSize(1);
    var secondHandSize = getSize(2);
    var stackSize = getSize(0);
    return stackSize === 0
        && (firstHandSize === 0 || secondHandSize === 0);
}

var getWinner = function () {
    var firstHandSize = getSize(1);
    var secondHandSize = getSize(2);
    var fieldSize = getSize(3);
    if (firstHandSize === 0 && secondHandSize === 0 && (fieldSize % 2 === 0)) return 0;
    //TODO: check if valid move for last card
    if (firstHandSize === 0) return 1;
    //TODO: check if valid move for last card
    if (secondHandSize === 0) return 2;
    return 0;
}

var renderFirstHand = function () {
    console.log("render first hand");
    var localCounter = 0;
    for (let i = 0; i < cards.length; i++) {
        if (cards[i].status === 1) {
            localCounter++;
            var el = document.getElementById(cards[i].id);
            el.style.left = FIRST_HAND_OFFSET_X + localCounter * CARD_HAND_WIDTH + "px";
            el.style.top = FIRST_HAND_OFFSET_Y + "px";
            el.style.backgroundImage = "url('img/" + cards[i].id + ".png')";
        }
    }
}

var renderSecondHand = function () {
    console.log("render second hand");
    var localCounter = 0;
    for (let i = 0; i < cards.length; i++) {
        if (cards[i].status === 2) {
            localCounter++;
            var el = document.getElementById(cards[i].id);
            el.style.left = SECOND_HAND_OFFSET_X + localCounter * CARD_HAND_WIDTH + "px";
            el.style.top = SECOND_HAND_OFFSET_Y + "px";
        }
    }
}

var renderCenter = function () {
    console.log("render center battle field");
    var localCounter = 0;
    for (let i = 0; i < centerStack.length; i++) {
        var el = document.getElementById(cards[centerStack[i]].id);
        el.style.left = SECOND_HAND_OFFSET_X
            + Math.floor((localCounter + 2) / 2) * CARD_HAND_WIDTH + "px";
        el.style.top = localCounter % 2 == 0 ?
            CENTER_OFFSET_Y + "px" :
            CENTER_OFFSET_Y2 + "px";
        el.style.backgroundImage = "url('img/" + cards[centerStack[i]].id + ".png')";
        el.style.zIndex = localCounter + "";
        localCounter++;
    }
}

var renderTrash = function () {
    console.log("render trash");
    var localCounter = 0;
    for (let i = 0; i < cards.length; i++) {
        if (cards[i].status === 4) {
            localCounter++;
            var el = document.getElementById(cards[i].id);
            el.style.left = TRASH_OFFSET_X + localCounter * 2 + "px";
            el.style.top = CENTER_OFFSET_Y + "px";
        }
    }
}

var getSize = function (status) {
    var counter = 0;
    for (let i = 0; i < cards.length; i++) {
        if (cards[i].status === status) {
            counter++;
        }
    }
    return counter;
}

function setupClickHandlers() {
    for (let i = 0; i < cards.length; i++) {
        document.getElementById(cards[i].id).onclick = function () {
            moveToCenter(i);
        }
    }
    document.getElementById("next_move").onclick = function () {

        console.log("handle next move");
        var isOK = centerStack.length % 2 === 0;
        for (let i = 0; i < cards.length; i++) {
            if (cards[i].status === 3) {
                cards[i].status = isOK ? 4 : currentPlayer;
                cards[i].hide();
            }
        }

        if (isGameOver()) {
            var winner = getWinner();
            // alert("winner is " + winner);
            pop(winner);
            return;
        }

        changePlayer();
        renderTrash();
        refillFirstHand();
        renderFirstHand();
        refillSecondHand();
        renderSecondHand();
        centerStack = [];
        computerMove();
    };


}



function StoreData() {
    var inputEmail = document.getElementById("name");
    if(inputEmail!='') {
    localStorage.setItem("name", inputEmail.value);
    pop();
    stackSetup();
    shuffle(cards);
    relayoutStack();
    refillFirstHand();
    refillSecondHand();
    renderFirstHand();
    renderSecondHand();
    renderCenter();
    renderTrash();
    setupClickHandlers();
    }
}
//Initial game setup
localStorage.removeItem("name");
pop();

