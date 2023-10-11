import {ConsoleActions} from "./Console";

const Game = () => {
	let grid;
	
	const renderGrid = (grid) => {
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
	
	const init = () => {
		grid = [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']];
		return [{
			type: ConsoleActions.CLEAR,
		}, {
			type: ConsoleActions.WRITE,
			payload: renderGrid(grid)
		}, {
			type: ConsoleActions.SET_USER_STR,
			payload: `Player 1@TicTacToe ~ % `
		}];
	}
	
	const parseCoordinate = (coordinate) => coordinate === '1' || coordinate === '2' || coordinate === '3' ? parseInt(coordinate) : false
	
	
	const process = (input) => {
		console.log('processing: ' + input);
		if (input === '') {
			return [];
		}
		
		if (input === 'e') {
			return [{
				type: ConsoleActions.QUIT
			}]
		}
		
		if (input === 'p') {
			return [{
				type: ConsoleActions.WRITE,
				payload: '<<stats>>'
			}]
		}
		
		const coordinates = input.split(':');
		if (coordinates.length === 2 && parseCoordinate(coordinates[0]) && parseCoordinate(coordinates[1])) {
			return [{
				type: ConsoleActions.WRITE,
				payload: '<<valid>>'
			}]
		}
		
		return [{
			type: ConsoleActions.WRITE,
			payload: 'Wrong input: Enter "Row:Column" with row and column between 1 and 3, or type "p" to print stats or "e" to end the game.'
		}]
	};
	
	
	return { init, process };
}

export default Game;
