import {ConsoleActions} from "./Console";

class Game {
	grid;
	player;
	
	winningStats = {
		X: 0,
		O: 0
	}
	
	playerSymbols = {
		1: 'X',
		2: 'O'
	}
	
	renderGrid() {
		const grid = this.grid;
		return '' +
			`       |       |       \n` +
			`   ${grid[0][0]}   |   ${grid[0][1]}   |   ${grid[0][2]}   \n` +
			`                       \n` +
			` --------------------- \n` +
			`                       \n` +
			`   ${grid[1][0]}   |   ${grid[1][1]}   |   ${grid[1][2]}   \n` +
			`                       \n` +
			` --------------------- \n` +
			`                       \n` +
			`   ${grid[2][0]}   |   ${grid[2][1]}   |   ${grid[2][2]}   \n` +
			`       |       |       \n `
	}
	
	printStats() {
		return '' +
			'X wins: ' + this.winningStats.X + '\n' +
			'O wins: ' + this.winningStats.O;
	}
	
	init() {
		this.grid = [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']];
		this.player = 1;
		return [{
			type: ConsoleActions.CLEAR,
		}, {
			type: ConsoleActions.WRITE,
			payload: 'X: Please enter the position of your mark (Row:Column):\n\nExample: "2:2" places the X in the middle center field\n '
		}, {
			type: ConsoleActions.WRITE,
			payload: this.renderGrid(this.grid)
		}, {
			type: ConsoleActions.SET_USER_STR,
			payload: `Player ${this.player} (${this.playerSymbols[this.player]})@TicTacToe ~ % `
		}];
	}
	
	static parseCoordinate = (coordinate) => coordinate === '1' || coordinate === '2' || coordinate === '3' ? parseInt(coordinate) : false
	
	determineWinner(grid) {
		const diagonalsMatch = (symbol) => [grid[0][0], grid[1][1], grid[2][2]].every(val => val === symbol) ||
			[grid[2][0], grid[1][1], grid[0][2]].every(val => val === symbol);
		const rowsMatch = (symbol) => [0, 1, 2].some(index =>
			[grid[index][0], grid[index][1], grid[index][2]].every(val => val === symbol)
		);
		const columnsMatch = (symbol) => [0, 1, 2].some(index =>
			[grid[0][index], grid[1][index], grid[2][index]].every(val => val === symbol)
		);
		
		return [1, 2].find(player => {
			const symbol = this.playerSymbols[player];
			
			return diagonalsMatch(symbol) || rowsMatch(symbol) || columnsMatch(symbol);
		})
	}
	
	process(input) {
		console.log('processing: ' + input);
		if (input === '') {
			return [{
				type: ConsoleActions.CLEAR,
			}, {
				type: ConsoleActions.WRITE,
				payload: this.renderGrid()
			}];
		}
		
		if (input === 'e') {
			return [{
				type: ConsoleActions.QUIT
			}]
		}
		
		if (input === 'p') {
			return [{
				type: ConsoleActions.WRITE,
				payload: this.printStats() + '\nPress enter to remain...'
			}]
		}
		
		const tileInput = input.split(':');
		if (tileInput.length === 2 && Game.parseCoordinate(tileInput[0]) && Game.parseCoordinate(tileInput[1])) {
			const coordinates = [Game.parseCoordinate(tileInput[0]), Game.parseCoordinate(tileInput[1])];
			if (this.grid[coordinates[0] - 1][coordinates[1] - 1] !== ' ') {
				return [{
					type: ConsoleActions.WRITE,
					payload: `Wrong input: The tile at row ${coordinates[0]} and column ${coordinates[1]} is already marked.`
				}]
			}
			
			this.grid[coordinates[0] - 1][coordinates[1] - 1] = this.playerSymbols[this.player];

			const winner = this.determineWinner(this.grid);
			
			if (winner) {
				const oldGrid = this.renderGrid();
				this.winningStats[this.playerSymbols[winner]]++;
				this.player = winner === 1 ? 2 : 1;
				this.grid = [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']];
				return [{
					type: ConsoleActions.CLEAR,
				}, {
					type: ConsoleActions.WRITE,
					payload: `${oldGrid}\nPlayer ${winner} (${this.playerSymbols[winner]}) won!\n${this.printStats()}\nPress enter to start a new round.`
				}, {
					type: ConsoleActions.SET_USER_STR,
					payload: `Player ${this.player} (${this.playerSymbols[this.player]})@TicTacToe ~ % `
				}]
			}
			
			if (!this.grid.some(row => row.some(tile => tile === ' '))) {
				const oldGrid = this.renderGrid(this.grid);
				this.player = 1;
				this.grid = [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']];
				return [{
					type: ConsoleActions.CLEAR,
				}, {
					type: ConsoleActions.WRITE,
					payload: `${oldGrid}\nIt's a draw!\n${this.printStats()}\nPress enter to start a new round.`
				}, {
					type: ConsoleActions.SET_USER_STR,
					payload: `Player ${this.player} (${this.playerSymbols[this.player]})@TicTacToe ~ % `
				}]
			}
			
			this.player = this.player === 1 ? 2 : 1;
			
			return [{
				type: ConsoleActions.CLEAR,
			}, {
				type: ConsoleActions.WRITE,
				payload: this.renderGrid()
			}, {
				type: ConsoleActions.SET_USER_STR,
				payload: `Player ${this.player} (${this.playerSymbols[this.player]})@TicTacToe ~ % `
			}]
		}
		
		return [{
			type: ConsoleActions.WRITE,
			payload: 'Wrong input: Enter "Row:Column" with row and column between 1 and 3, or type "p" to print stats or "e" to end the game.'
		}]
	};
}

export default Game;
