import './App.css';
import Console from "./Console";
import {useEffect, useState} from "react";
import Game from "./Game";

const App = () => {
	const [isApplicationRunning, setIsApplicationRunning] = useState(false);
	const [game, setGame] = useState(null);
	
	const start = () => {
		setGame(Game());
		setIsApplicationRunning(true);
	}
	useEffect(() => start(), []);
	
	return (
		<div className="App">
			<div className="App-header">Tic Tac Toe Coding Challenge</div>
			{isApplicationRunning ?
				<Console
					applicationQuit={() => {setIsApplicationRunning(false)}}
					application={game}/>
				:
				<p>Application closed. <button onClick={() => start()}>Reopen?</button></p>
			}
			
		</div>
	);
}

export default App;
