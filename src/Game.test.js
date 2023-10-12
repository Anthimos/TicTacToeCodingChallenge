import Game from "./Game";
import {ConsoleActions} from "./Console";

describe('Game', () => {
	describe('init', () => {
		it('should init with player 1 (X) and print grid properly', () => {
			const game = new Game();
			
			const res = game.init();
			
			expect(res).toContainEqual({
				type: ConsoleActions.CLEAR,
			});
			
			expect(res).toContainEqual({
				type: ConsoleActions.WRITE,
				payload: `       |       |       \n` +
					`       |       |       \n` +
					`                       \n` +
					` --------------------- \n` +
					`                       \n` +
					`       |       |       \n` +
					`                       \n` +
					` --------------------- \n` +
					`                       \n` +
					`       |       |       \n` +
					`       |       |       \n `
			});
			
			expect(res).toContainEqual({
				type: ConsoleActions.SET_USER_STR,
				payload: `Player 1 (X)@TicTacToe ~ % `
			});
		});
	});
	
	describe('turn', () => {
		it('should render player 1 (X) mark correctly and switch player', () => {
			const game = new Game();
			
			game.grid = [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']];
			game.player = 1;
			
			const res = game.process('1:2');
			
			expect(res).toContainEqual({
				type: ConsoleActions.WRITE,
				payload: `       |       |       \n` +
					`       |   X   |       \n` +
					`                       \n` +
					` --------------------- \n` +
					`                       \n` +
					`       |       |       \n` +
					`                       \n` +
					` --------------------- \n` +
					`                       \n` +
					`       |       |       \n` +
					`       |       |       \n `
			});
			
			expect(res).toContainEqual({
				type: ConsoleActions.SET_USER_STR,
				payload: `Player 2 (O)@TicTacToe ~ % `
			});
		});
		
		it('should render player 2 (O) mark correctly and switch player', () => {
			const game = new Game();
			
			game.grid = [[' ', 'X', 'X'], [' ', ' ', ' '], [' ', ' ', ' ']];
			game.player = 2;
			
			const res = game.process('2:2');
			
			expect(res).toContainEqual({
				type: ConsoleActions.WRITE,
				payload: `       |       |       \n` +
					`       |   X   |   X   \n` +
					`                       \n` +
					` --------------------- \n` +
					`                       \n` +
					`       |   O   |       \n` +
					`                       \n` +
					` --------------------- \n` +
					`                       \n` +
					`       |       |       \n` +
					`       |       |       \n `
			});
			
			expect(res).toContainEqual({
				type: ConsoleActions.SET_USER_STR,
				payload: `Player 1 (X)@TicTacToe ~ % `
			});
		});
		
		it('should display current grid on enter', () => {
			const game = new Game();
			
			game.grid = [[' ', 'X', 'X'], [' ', ' ', ' '], [' ', ' ', ' ']];
			game.player = 2;
			
			const res = game.process('');
			
			expect(res).toContainEqual({
				type: ConsoleActions.WRITE,
				payload: `       |       |       \n` +
					`       |   X   |   X   \n` +
					`                       \n` +
					` --------------------- \n` +
					`                       \n` +
					`       |       |       \n` +
					`                       \n` +
					` --------------------- \n` +
					`                       \n` +
					`       |       |       \n` +
					`       |       |       \n `
			});
		});
		
		it('should report error on already selected tile', () => {
			const game = new Game();
			
			game.grid = [[' ', 'X', 'X'], [' ', ' ', ' '], [' ', ' ', ' ']];
			game.player = 2;
			
			const res = game.process('1:2');
			
			expect(res).toContainEqual({
				type: ConsoleActions.WRITE,
				payload: `Wrong input: The tile at row 1 and column 2 is already marked.`
			});
		});
		
		it('should print stats on p command', () => {
			const game = new Game();
			
			game.grid = [[' ', 'X', 'X'], [' ', ' ', ' '], [' ', ' ', ' ']];
			game.player = 2;
			game.winningStats = {X: 3, O: 100}
			
			const res = game.process('p');
			
			expect(res).toContainEqual({
				type: ConsoleActions.WRITE,
				payload: 'X wins: 3\n' +
					'O wins: 100\nPress enter to remain...'
			});
		});
		
		it('should quit game on e command', () => {
			const game = new Game();
			
			game.grid = [[' ', 'X', 'X'], [' ', ' ', ' '], [' ', ' ', ' ']];
			game.player = 2;
			
			const res = game.process('e');
			
			expect(res).toContainEqual({
				type: ConsoleActions.QUIT,
			});
		});
		
		test.each(['0:0', '4:4', 'x'])('should report error on out of bounds tile or unsupported command', (input) => {
			const game = new Game();
			
			game.grid = [[' ', 'X', 'X'], [' ', ' ', ' '], [' ', ' ', ' ']];
			game.player = 2;
			
			const res = game.process(input);
			
			expect(res).toContainEqual({
				type: ConsoleActions.WRITE,
				payload: `Wrong input: Enter "Row:Column" with row and column between 1 and 3, or type "p" to print stats or "e" to end the game.`
			});
		});
	});
	
	describe('game evaluation', () => {
		test.each([
			[[['X', 'O', ' '], [' ', 'X', ' '], [' ', ' ', 'X']], 1],
			[[[' ', 'O', 'X'], [' ', 'X', ' '], ['X', ' ', ' ']], 1],
			[[[' ', 'O', ' '], [' ', 'O', ' '], [' ', 'O', ' ']], 2],
			[[['X', 'X', 'X'], [' ', 'O', ' '], [' ', ' ', ' ']], 1],
			[[['X', ' ', 'O'], ['X', 'O', ' '], ['X', ' ', ' ']], 1],
			[[[' ', ' ', ' '], [' ', 'X', ' '], ['O', 'O', 'O']], 2],
			[[[' ', ' ', ' '], [' ', 'X', ' '], ['O', 'X', 'O']], undefined]
			])('should determine winner correctly', (data, expected) => {
				const game = new Game();
				game.grid = data;
				
				const res = game.determineWinner(game.grid);
				
				expect(res).toEqual(expected);
		});
		
		it('should detect draw and start next game with player 1 (X)', () => {
			const game = new Game();
			
			game.grid = [['O', 'X', 'O'], ['X', 'X', 'O'], ['O', 'O', ' ']];
			game.player = 1;
			
			const res = game.process('3:3');
			
			expect(res).toContainEqual({
				type: ConsoleActions.WRITE,
				payload: `       |       |       \n` +
					`   O   |   X   |   O   \n` +
					`                       \n` +
					` --------------------- \n` +
					`                       \n` +
					`   X   |   X   |   O   \n` +
					`                       \n` +
					` --------------------- \n` +
					`                       \n` +
					`   O   |   O   |   X   \n` +
					`       |       |       \n ` + `\nIt's a draw!\nX wins: 0\nO wins: 0\nPress enter to start a new round.`
			});
			
			expect(res).toContainEqual({
				type: ConsoleActions.SET_USER_STR,
				payload: `Player 1 (X)@TicTacToe ~ % `
			});
			
			expect(game.player).toEqual(1);
		});
		
		it('should detect player 1 win, increase win count and start next game with player 2 (O)', () => {
			const game = new Game();
			
			game.grid = [['X', 'X', ' '], [' ', ' ', ' '], [' ', ' ', ' ']];
			game.player = 1;
			
			const res = game.process('1:3');
			
			expect(res).toContainEqual({
				type: ConsoleActions.WRITE,
				payload: `       |       |       \n` +
					`   X   |   X   |   X   \n` +
					`                       \n` +
					` --------------------- \n` +
					`                       \n` +
					`       |       |       \n` +
					`                       \n` +
					` --------------------- \n` +
					`                       \n` +
					`       |       |       \n` +
					`       |       |       \n ` + `\nPlayer 1 (X) won!\nX wins: 1\nO wins: 0\nPress enter to start a new round.`
			});
			
			expect(res).toContainEqual({
				type: ConsoleActions.SET_USER_STR,
				payload: `Player 2 (O)@TicTacToe ~ % `
			});
			
			expect(game.player).toEqual(2);
		});
		
		it('should detect player 2 win, increase win count and start next game with player 1 (X)', () => {
			const game = new Game();
			
			game.grid = [['O', ' ', ' '], ['O', ' ', ' '], [' ', ' ', ' ']];
			game.player = 2;
			
			const res = game.process('3:1');
			
			expect(res).toContainEqual({
				type: ConsoleActions.WRITE,
				payload: `       |       |       \n` +
					`   O   |       |       \n` +
					`                       \n` +
					` --------------------- \n` +
					`                       \n` +
					`   O   |       |       \n` +
					`                       \n` +
					` --------------------- \n` +
					`                       \n` +
					`   O   |       |       \n` +
					`       |       |       \n ` + `\nPlayer 2 (O) won!\nX wins: 0\nO wins: 1\nPress enter to start a new round.`
			});
			
			expect(res).toContainEqual({
				type: ConsoleActions.SET_USER_STR,
				payload: `Player 1 (X)@TicTacToe ~ % `
			});
			
			expect(game.player).toEqual(1);
		});
	});
});
