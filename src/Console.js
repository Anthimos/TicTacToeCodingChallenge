import './Console.css';
import {useEffect, useState} from "react";

const Console = (props) => {
	const [consoleText, setConsoleText] = useState('');
	const [inputText, setInputText] = useState('');
	const [userStr, setUserStr] = useState('');
	
	const addConsoleText = (text) => {
		setConsoleText((consoleText) => consoleText + (consoleText && '\n') + text);
	}
	
	const processInput = (input) => {
		setInputText('');
		addConsoleText(userStr + input);
		processActions(props.application.process(input));
	}
	
	const processActions = (actions) => {
		console.log('processing batch of ' + actions.length + ' actions:');
		actions.forEach((action) => {
			console.log('process', action.type);
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
	
	useEffect(() => processActions(props.application.init()), []);
	
	return (
		<div className="console" onClick={() => document.getElementById('console-input').focus()}>
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
					<input
						id='console-input'
						value={inputText}
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
