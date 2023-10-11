import { render, screen } from '@testing-library/react';
import Console from "./Console";

test('renders app header', () => {
	render(<Console />);
	const headerElement = screen.getByText('Tic Tac Toe Coding Challenge');
	expect(headerElement).toBeInTheDocument();
});
