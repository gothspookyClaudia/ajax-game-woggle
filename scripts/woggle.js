/**
 * Created by BillieJoe on 2016/5/8.
 */
window.onload = initPage;

var frequencyTable = new Array(
    "a", "a", "a", "a", "a", "a", "a", "a", "b", "c", "c", "c", "d", "d", "d",
    "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "f", "f", "g",
    "g", "h", "h", "h", "h", "h", "h", "i", "i", "i", "i", "i", "i", "i", "j",
    "k", "l", "l", "l", "l", "m", "m", "n", "n", "n", "n", "n", "n", "o", "o",
    "o", "o", "o", "o", "o", "o", "p", "p", "q", "q", "q", "q", "q", "q", "r",
    "r", "r", "r", "r", "r", "s", "s", "s", "s", "s", "s", "s", "s", "t", "t",
    "t", "u", "u", "v", "v", "w", "x", "y", "z");

function initPage(){
    randomizeTiles();
}

function randomizeTiles(){
    var tiles = $('letterbox').getElementsByTagName('a');
    for(var i = 0; i<tiles.length; i++){
        var index = Math.floor(Math.random()*100);
        var letter = frequencyTable[index];
        tiles[i].className = tiles[i].className+' l'+ letter;
        tiles[i].onclick = addLetter;
    }
}

function addLetter(){
    var currentWordDiv = $('currentWord');
    var tileLetter = this.className.substr(10,1);
    if(currentWordDiv.childNodes.length === 0){
        var element = document.createElement("p");
        var text = document.createTextNode(tileLetter);
        element.appendChild(text);
        currentWordDiv.appendChild(element);

        var submitDiv = $("submit");
        var a = submitDiv.firstChild;
        while(a.nodeName == '#text'){
            a= a.nextSibling;
        }
        a.onclick = submitWord;
    }
    else{
        var p = currentWordDiv.firstChild;
        var letterText = p.firstChild;
        letterText.nodeValue += tileLetter;
    }
    this.className += ' disabled';
    this.onclick = '';

}

function submitWord(){
    var request = createRequest();
    if(request === null){
        alert("unable to create a request");
        return;
    }
    var currentWordDiv = $('currentWord');
    var userWord = currentWordDiv.firstChild.firstChild.nodeValue;
    var url="lookup-word.php?word="+escape(userWord);

    request.open('GET',url,false);
    request.send(null);
    if(request.status === 200){
        alert(request.responseText);
    if(request.responseText == -1){
        alert("you have entered an invalid word, Try again.");
    }
    else {
        var wordListDiv = $('wordList');
        var p= document.createElement('p');
        var newWord = document.createTextNode(userWord);
         p.appendChild(newWord);
        wordListDiv.appendChild(p);

        var scoreDiv = $('score');
        var scoreNode = scoreDiv.firstChild;
        var scoreText = scoreNode.nodeValue;
        var pieces = scoreText.split(' ');
        var currentScore = parseInt(pieces[1]);
        currentScore += parseInt(request.responseText);
        scoreNode.nodeValue ='Score: '+currentScore;
    }
    var currentWordP = currentWordDiv.firstChild;
    currentWordDiv.removeChild(currentWordP);
    enableAllTiles();     //启用所有贴块

    var submitDiv = document.getElementById('submit');
    var a = submitDiv.firstChild;
    while (a.nodeName == '#text'){
        a = a.nextSibling;
    }
    a.onclick = function(){
        alert("click tiles to add letters and create a new word");
        }
    }
}

function enableAllTiles(){
   var tiles = $("letterbox").getElementsByTagName("a");
    for (var i=0; i<tiles.length; i++) {
        var tileClasses = tiles[i].className.split(" ");
        if (tileClasses.length == 4) {
            var newClass =
                tileClasses[0] + " " + tileClasses[1] + " " + tileClasses[2];
            tiles[i].className = newClass;
            tiles[i].onclick = addLetter;
        }
    }
}
