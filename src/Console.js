import './Console.css';
import {useState} from "react";

const Console = (props) => {
	const [consoleText, setConsoleText] = useState('');
	const [inputText, setInputText] = useState('');
	const [userStr, setUserStr] = useState('');
	
	const addConsoleText = (text) => {
		setConsoleText(consoleText + (consoleText && '\n') + userStr + text);
	}
	
	const processInput = (input) => {
		setInputText('');
		addConsoleText(input);
		processActions(props.application.process(input));
	}
	
	const processActions = (actions) => {
		actions.forEach((action) => {
			switch (action.type) {
				case ConsoleActions.CLEAR:
					setInputText('');
					break;
				case ConsoleActions.QUIT:
					props.applicationQuit();
					break;
				case ConsoleActions.SET_USER_STR:
					setUserStr(action.payload);
					break;
				case ConsoleActions.WRITE:
					addConsoleText(action.payload);
					break;
				default:
			}
		});
	}
	
	processActions(props.application.init());
	
	const playerId = 8;
	
	//const userStr = `Player { playerId }@TicTacToe ~ % `;
	
	return (
		<div className="console">
			<div className="console-header">
				<div className="console-controls">
					<div className="console-controls-control" onClick={() => {
						props.applicationQuit()}}/>
					<div className="console-controls-control"/>
					<div className="console-controls-control"/>
				</div>
				<p>Tic Tac Toe</p>
			</div>
			<div className="console-content">
				<div className="console-content-text">{ consoleText }</div>
				<div className="console-content-prompt">
					<p>{userStr}</p>
					<input value={inputText}
					       type="text"
					       onChange={(e) => setInputText(e.target.value)}
					       onKeyPress={(e) => {(e.key === 'Enter' && processInput(e.target.value))}} />
				</div>
			
			</div>
		</div>
	);
}

export default Console;

export const ConsoleActions = {
	CLEAR: 'CLEAR',
	SET_USER_STR: 'SET_USER_STR',
	WRITE: 'WRITE',
	QUIT: 'QUIT'
}
