var guesswords = [
  "harrier",
  "rafael",
  "leonardo",
  "hobart",
  "alvaro",
  "nimitz",
  "chester",
  "raptor",
  "leopard",
  "ascod"
];

var WORD_CHOICE_INDEX = 0,     //Randomly generated guesswords array index
    mask = "",                 //Masked guessword
    MAX_UNMASKED_CHARS,        //Max characters to be visible to user
    unmaskedChars = 0,         //Number of currently unmasked characters
    fullWord = "",             //Entire guessed word
    userWinCount = 0,          //Number of times a user has guessed the word correctly
    gameResult = false;        //Whether the user won or not


//Generate a random index for a guessword
function randomWordIndex(){
  WORD_CHOICE_INDEX = Math.floor(Math.random() * 10);
}
/*******************/

//Generate Masked string
function generateMask(){
  for(i=0; i < guesswords[WORD_CHOICE_INDEX].length; i++)
  {
    mask = mask + "_";
  }
}
/******************/

//Replace '_' for correctly guessed characters
function replaceAt(str, indexes, replacement) {
  var newStrArr = [];

  if(unmaskedChars === MAX_UNMASKED_CHARS){   //Check if maximum number of visible characters has been reached
    return str;   //Return string as is
  }

  for(i=0, j=0; i < str.length; i++){   //Make matching characters visible
    if(i === indexes[j]){           //Character Found, Is my [i] the same as the 'matched user keystroke index value' on the indexes array?
      newStrArr[i] = replacement;   //Index values match so swap for replacement(actual user keystroked character)
      unmaskedChars++;              //Increase visible character count
      if(j < indexes.length){
        j++;  //Indexes array counter
      }
    }else if(i != indexes[j]){        //If character not found, fill with the content of the original string, that will be the '_' character
      newStrArr[i] = str.charAt(i);
    }
  }

  return newStrArr.join('');    //Join the string array into a regular string with no delimiters
}
/*****************/

//Remove masked characters that have been guessed correctly
function removeMask(indexes, keystroke){
    mask = replaceAt(mask, indexes, keystroke);    //Generate a new string with correctly guessed characters being unmasked
}
/****************/

// Find the index(es) for correctly guessed character
function findChars(keystroke){
  var indexes = [];   //Array of indexes
  var guessword = guesswords[WORD_CHOICE_INDEX];  //Our guess game word

  for(i=0; i<guessword.length; i++){
    if( guessword[i] === keystroke ){
      indexes.push(i);  //Add found index
    }
  }

  return indexes;   //Return array of found indexes or empty array
}
/******************/

//Unmask hidden characters
function revealWordChars(keystroke){
  var indexes = findChars(keystroke);   //Obtain index(es) for correctly guessed character
  removeMask(indexes, keystroke);       //Remove mask on correctly guessed character(s)
  $(".guess-word").html("<p>" + mask + "</p>");   //Refresh the masked word's content in the DOM
}
/*****************/

//Check user's full guess against CPU chosen word
function checkGuess(guess){
  if( guess === guesswords[WORD_CHOICE_INDEX] ){
    return true;
  }
  else
    return false;
}
/*****************/

// Initialize game
function initialize(){
  unmaskedChars = 0,         //Number of currently unmasked characters
  fullWord = "",             //Entire guessed word
  mask = "",
  gameResult = false;        //Whether the user won or not

  randomWordIndex();    //Choose a word randomly
  generateMask();       //Generate a mask for the chosen word

  console.log(guesswords[WORD_CHOICE_INDEX]);

  MAX_UNMASKED_CHARS = Math.floor(guesswords[WORD_CHOICE_INDEX].length / 2);    //Maximum visible characters to user

  $(".guess-word").html("<p>" + mask + "</p>");   //Adding the masked word to the DOM
  $(".word-input input").val('');
  // $('#fullGuess').val('');
}
/*****************/

//Submit user's guess
function submitGuess(){
  //fullWord = $('#fullGuess').val();   //User's best guess
  gameResult = checkGuess(fullWord);  //Validate if user's guess was correct or not

  switch (gameResult) {
      case true:
          // closeModal("input");    //Close Input Modal
          $("#modal-container[title='winner-modal']").removeAttr('class').addClass("two");    //Open Winner Modal
          $('body').addClass('modal-active');
          userWinCount++;                   //Increase user's win count
          $(".score").html(userWinCount);   //Update user's score on the DOM
          initialize();                     //Clear out all values in order to start a new game
          break;
      case false:
          // closeModal("input");    //Close Input Modal
          $("#modal-container[title='loser-modal']").removeAttr('class').addClass("seven");   //Open loser Modal
          $('body').addClass('modal-active');
          initialize();           //Clear out all values in order to start a new game
          break;
    }
}
/*****************/

//Close modals
function closeModal(type){
  $("#modal-container[title='" + type + "-modal']").addClass('out');    //Close a certain 'type' of Modal
  $('body').removeClass('modal-active');
  setTimeout(function()
    {	
	  $(".content").css("background-image", "url(assets/hangman.jpg)");
      $(".main-container").css("display","block");    //Make the main container visible
    },
  1500);
}
/******************/

/* DOM Manipulation on document load */
$( document ).ready(function() {

  initialize();   //Clear out all values in order to start a new game
  $("#modal-container[title='intro-modal']").removeAttr('class').addClass("one");   //Open Intro Modal
  $('body').addClass('modal-active');

  // On-click event listeners for all Modals close buttons
  $("#modal-container[title='intro-modal']").find(".close-btn").click(function(){
    closeModal('intro');
  });
  $("#modal-container[title='winner-modal']").find(".close-btn").click(function(){
    closeModal('winner');
  });
  /*************************/

  //On-click event listener for loser Modal (Whole thing)
  $("#modal-container[title='loser-modal']").click(function(){
    closeModal('loser');
  });
  /************************/

  // Main Container's input textbox keypress event listener
  $(".word-input input").keypress(function(obj){  //On keypress at the text box input
    var keystroke = obj.key;    //Store textbox's value
    if( unmaskedChars < MAX_UNMASKED_CHARS )  //If you haven't reached the maximum amount of visible characters
      revealWordChars(keystroke);   //unmask characters if guessed correctly
    else{   //If you have reached the maximum amount of visible characters
      fullWord = prompt("Maximum guessed characters reached, Do you know the full word?:", "");
      submitGuess();
      // $("#modal-container[title='input-modal']").removeAttr('class').addClass("five");    // Make Input Modal visible to user
      // $('body').addClass('modal-active');
      // $('#fullGuess').focus();
    }
  });
  /*********************/

  new WOW().init(); //Init Jarallax video header

});
/*******************/
