import './App.css';

function App() {
	return (
		<div className="App">
			<div className="App-header">TicTacToe Coding Challenge</div>
			<div className="console">
				<div className="console-header">
					<div className="console-controls">
						<div className="console-controls-control"/>
						<div className="console-controls-control"/>
						<div className="console-controls-control"/>
					</div>
					<p>TicTacToe</p>
				</div>
				<div className="console-content">
					<div className="console-content-text">This is some text here</div>
					<div className="console-content-prompt">
						<p>Player 1@TicTacToe ~ %</p>
						<input type="text"/>
					</div>
					
				</div>
			</div>
		</div>
	);
}

export default App;
