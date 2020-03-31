const Board =  require("./Board.js");
const GameWord = require("./GameWord.js");
const word_state = require("./WordStates.js");

var gameState = {
	BLUE_WON: "Blue won",
	RED_WON: "Red won",
	RED_SPY: "Red Spy's turn",
	RED_FIELD: "Red Field Operator's turn",
	BLUE_SPY: "Blue Spy's turn",
	BLUE_FIELD: "Blue Field's turn"
}

class Game {

	constructor() {
		this.state = gameState.RED_SPY;
		this.board = new Board();
		this.redLeft = 9;
		this.blueLeft = 8;
		this.numGuessesLeft = 0;
		this.spyHint = "";
	}

	getBoardInfo() {
		var words = this.board.get_words();
		var boardValues = new Array(25);
		for (var i = 0;i<25;i++)
		{
			var gWord = words[i];
			if (gWord.get_chosen()) {
				var person = gWord.get_person();
				if (person = word_state.ASSASSIN) {
					boardValues[i] = "_ASSASSIN";
				} else if (person = word_state.BLUE) {
					boardValues[i] = "_BLUE";
				} else if (person = word_state.RED) {
					boardValues[i] = "_RED";
				} else {
					boardValues[i] = "_CIVILIAN";
				}
			} else {
				boardValues[i] = gWord.get_val();
			}
		}
		return boardValues;
	}

	getState() {
		return this.state;
	}

	getRedLeft() {
		return this.redLeft;
	}

	getBlueLeft() {
		return this.blueLeft;
	}

	getSpyHint() {
		return this.spyHint;
	}

	getGuessesLeft() {
		return this.guesses;
	}

	nextTurn() {
		this.checkIfWon();
		if (this.isGameOver()) return;
		switch(this.state) {
			case gameState.RED_SPY:
				console.log("Red Field Agent next")
				this.state = gameState.RED_FIELD;
				break;
			case gameState.RED_FIELD:
				console.log("Blue SpyMaster next")
				this.spyHint = "";
				this.guesses = 0;
				this.state = gameState.BLUE_SPY;
				break;
			case gameState.BLUE_SPY:
				console.log("Blue Field Agent next");
				this.state = gameState.BLUE_FIELD;
				break;
			case gameState.BLUE_FIELD:
				console.log("Red SpyMaster next");
				this.spyHint = "";
				this.guesses = 0;
				this.state = gameState.RED_SPY;
				break;
		}
		return gameState;
	}

	nextWordGuess(wordNum) {
		var word = this.board.get_words()[wordNum];
		if (this.isGameOver()) return;
		if (this.state == gameState.RED_SPY || this.state == gameState.BLUE_SPY) {
			console.log("It is the field operators turn.");
			return;
		}
		var person = this.board.chooseWord(word);
		if (!person) {
			console.log("The word "+word+" has already been chosen");
			return;
		}
		if (person == word_state.ASSASSIN) {
			console.log("Assassin Hit");
			if (gameState == turn.RED_FIELD) {
				this.state = gameState.BLUE;
				console.log("Blue wins");
			} else {
				this.state = gameState.RED;
				console.log("Red wins");
			}
		} else if (person == word_state.BLUE) {
			this.blueLeft--;
			console.log("Blue Agent hit");
			if (this.state == gameState.RED_FIELD) {
				this.nextTurn();
			} else if (this.state == gameState.BLUE_FIELD) {
				this.numGuessesLeft--;
				console.log(this.numGuessesLeft + " guesses left");
				if (this.numGuessesLeft==0) this.nextTurn();
				else this.checkIfWon();
			}
		} else if (person == word_state.RED) {
			this.redLeft--;
			console.log("Red Agent hit");
			if (this.state == gameState.BLUE_FIELD) {
				this.nextTurn();
			} else if (this.state == gameState.RED_FIELD) {
				this.numGuessesLeft--;
				console.log(this.numGuessesLeft + " guesses left");
				if (this.numGuessesLeft==0) this.nextTurn();
				else this.checkIfWon();
			}
		} else {
			console.log("Civilian hit");
			this.nextTurn();
		}
	}

	nextSpyHint(guesses, word) {
		if (this.isGameOver()) return;
		if (this.state == gameState.RED_FIELD || this.state == gameState.BLUE_FIELD) {
			console.log("It is the spy masters turn.");
			return;
		}
		console.log("New Spy Hint is "+word+ " for "+guesses);
		this.spyHint = word;
		this.numGuessesLeft = guesses;
		this.nextTurn();
	}

	checkIfWon() {
		if (this.redLeft == 0)
		{
			console.log("Red Won");
			this.state = gameState.RED_WON;
		} 
		else if (this.blueLeft == 0) 
		{
			console.log("Blue Won");
			this.state = gameState.BLUE_WON;
		}
	}

	isGameOver() {
		if (this.state == gameState.RED_WON || this.state == gameState.BLUE_WON) {
			console.log("The game has ended");
			return true;
		}
		return false;
	}
}

module.exports = Game;