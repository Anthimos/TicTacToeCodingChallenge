import {ConsoleActions} from "./Console";

const Game = () => {
	let grid, player;
	const winningStats = {
		X: 0,
		O: 0
	}
	
	const playerSymbols = {
		1: 'X',
		2: 'O'
	}
	
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
	
	const printStats = () => '' +
		'X wins: ' + winningStats.X + '\n' +
		'O wins: ' + winningStats.O;
	
	
	const init = () => {
		grid = [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']];
		player = 1;
		return [{
			type: ConsoleActions.CLEAR,
		}, {
			type: ConsoleActions.WRITE,
			payload: 'X: Please enter the position of your mark (Row:Column):\n\nExample: "2:2" places the X in the middle center field\n '
		}, {
			type: ConsoleActions.WRITE,
			payload: renderGrid(grid)
		}, {
			type: ConsoleActions.SET_USER_STR,
			payload: `Player ${player} (${playerSymbols[player]})@TicTacToe ~ % `
		}];
	}
	
	const parseCoordinate = (coordinate) => coordinate === '1' || coordinate === '2' || coordinate === '3' ? parseInt(coordinate) : false
	
	const determineWinner = (grid) => {
		const diagonalsMatch = (symbol) => [grid[0][0], grid[1][1], grid[2][2]].every(val => val === symbol) ||
			[grid[2][0], grid[1][1], grid[0][2]].every(val => val === symbol);
		const rowsMatch = (symbol) => [0, 1, 2].some(index =>
			[grid[index][0], grid[index][1], grid[index][2]].every(val => val === symbol)
		);
		const columnsMatch = (symbol) => [0, 1, 2].some(index =>
			[grid[0][index], grid[1][index], grid[2][index]].every(val => val === symbol)
		);
		
		return [1, 2].find(player => {
			const symbol = playerSymbols[player];
			
			return diagonalsMatch(symbol) || rowsMatch(symbol) || columnsMatch(symbol);
		})
	}
	
	const process = (input) => {
		console.log('processing: ' + input);
		if (input === '') {
			return [{
				type: ConsoleActions.CLEAR,
			}, {
				type: ConsoleActions.WRITE,
				payload: renderGrid(grid)
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
				payload: printStats() + '\nPress enter to remain...'
			}]
		}
		
		const tileInput = input.split(':');
		if (tileInput.length === 2 && parseCoordinate(tileInput[0]) && parseCoordinate(tileInput[1])) {
			const coordinates = [parseCoordinate(tileInput[0]), parseCoordinate(tileInput[1])];
			if (grid[coordinates[0] - 1][coordinates[1] - 1] !== ' ') {
				return [{
					type: ConsoleActions.WRITE,
					payload: `Wrong input: The tile at row ${coordinates[0]} and column ${coordinates[1]} is already marked.`
				}]
			}
			
			grid[coordinates[0] - 1][coordinates[1] - 1] = playerSymbols[player];

			const winner = determineWinner(grid);
			
			if (winner) {
				const oldGrid = renderGrid(grid);
				winningStats[playerSymbols[winner]]++;
				player = winner === 1 ? 2 : 1;
				grid = [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']];
				return [{
					type: ConsoleActions.CLEAR,
				}, {
					type: ConsoleActions.WRITE,
					payload: `${oldGrid}\nPlayer ${winner} (${playerSymbols[winner]}) won!\n${printStats()}\nPress enter to start a new round.`
				}, {
					type: ConsoleActions.SET_USER_STR,
					payload: `Player ${player} (${playerSymbols[player]})@TicTacToe ~ % `
				}]
			}
			
			if (!grid.some(row => row.some(tile => tile === ' '))) {
				const oldGrid = renderGrid(grid);
				player = 1;
				grid = [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']];
				return [{
					type: ConsoleActions.CLEAR,
				}, {
					type: ConsoleActions.WRITE,
					payload: `${oldGrid}\nIt's a draw!\n${printStats()}\nPress enter to start a new round.`
				}, {
					type: ConsoleActions.SET_USER_STR,
					payload: `Player ${player} (${playerSymbols[player]})@TicTacToe ~ % `
				}]
			}
			
			player = player === 1 ? 2 : 1;
			
			return [{
				type: ConsoleActions.CLEAR,
			}, {
				type: ConsoleActions.WRITE,
				payload: renderGrid(grid)
			}, {
				type: ConsoleActions.SET_USER_STR,
				payload: `Player ${player} (${playerSymbols[player]})@TicTacToe ~ % `
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
