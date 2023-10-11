import './App.css';
import Console from "./Console";
import {useState} from "react";

function App() {
	const [isApplicationRunning, setIsApplicationRunning] = useState(false);
	
	return (
		<div className="App">
			<div className="App-header">Tic Tac Toe Coding Challenge</div>
			{isApplicationRunning ?
				<Console
					applicationQuit={() => {setIsApplicationRunning(false)}}
					application={({init: () => [], process: () => []})}/>
				:
				<p>Application closed. <button onClick={() => setIsApplicationRunning(true)}>Reopen?</button></p>
			}
			
		</div>
	);
}

export default App;
