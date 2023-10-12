import { render, screen } from '@testing-library/react';
import Console, {ConsoleActions} from "./Console";

describe('Console', () => {
	
	let applicationMock;
	let applicationQuitMock;
	
	beforeEach(() => {
		applicationMock = {
			init: jest.fn().mockReturnValue([]),
			process: jest.fn().mockReturnValue([])
		}
		applicationQuitMock = jest.fn();
	});
	
	test('should render', () => {
		render(<Console application={applicationMock} applicationQuit={applicationQuitMock} />);
		const headerElement = screen.getByText('Tic Tac Toe');
		expect(headerElement).toBeInTheDocument();
	});
	
	test('should handle quit action', () => {
		applicationMock.init.mockReturnValue([{ type: ConsoleActions.QUIT }]);
		render(<Console application={applicationMock} applicationQuit={applicationQuitMock} />);
		
		expect(applicationQuitMock).toHaveBeenCalledTimes(1);
	});
	//@TODO further test react state on action processing
	
});
