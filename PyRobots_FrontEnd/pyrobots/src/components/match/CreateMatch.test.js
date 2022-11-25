import '@testing-library/jest-dom/extend-expect';
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import CreateMatch from './CreateMatch.js';

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate,
}));

afterEach(() => {
    cleanup();
});

it('should have all expected fields, along with a sumbit button', () => {
    render(<CreateMatch />);

    const nameField = screen.getByTestId('name-input');
    const minPlayersField = screen.getByTestId('min_players-input');
    const maxPlayersField = screen.getByTestId('max_players-input');
    const numberRoundsField = screen.getByTestId('number_rounds-input');
    const numberGamesField = screen.getByTestId('number_games-input');
    const idRobotField = screen.getByTestId('robot-select');
    const submitButton = screen.getByRole('button', { name: /Create Match/i });

    expect(nameField).toBeInTheDocument();
    expect(minPlayersField).toBeInTheDocument();
    expect(maxPlayersField).toBeInTheDocument();
    expect(numberRoundsField).toBeInTheDocument();
    expect(numberGamesField).toBeInTheDocument();
    expect(idRobotField).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
});

test("empty name", async () => {
    render(<CreateMatch />);

    const nameField = screen.getByTestId('name-input');
    const minPlayersField = screen.getByTestId('min_players-input');
    const maxPlayersField = screen.getByTestId('max_players-input');
    const numberRoundsField = screen.getByTestId('number_rounds-input');
    const numberGamesField = screen.getByTestId('number_games-input');
    const idRobotField = screen.getByTestId('robot-select');
    const submitButton = screen.getByRole('button', { name: /Create Match/i });

    await fireEvent.change(nameField, { target: { value: '' } });
    await fireEvent.change(minPlayersField, { target: { value: '2' } });
    await fireEvent.change(maxPlayersField, { target: { value: '4' } });
    await fireEvent.change(numberRoundsField, { target: { value: '10' } });
    await fireEvent.change(numberGamesField, { target: { value: '50' } });
    await fireEvent.change(idRobotField, { target: { value: '1' } });

    fireEvent.click(submitButton);

    expect(nameField).toBeInvalid();
});

test("empty robot", async () => {
    render(<CreateMatch />);

    const nameField = screen.getByTestId('name-input');
    const minPlayersField = screen.getByTestId('min_players-input');
    const maxPlayersField = screen.getByTestId('max_players-input');
    const numberRoundsField = screen.getByTestId('number_rounds-input');
    const numberGamesField = screen.getByTestId('number_games-input');
    const idRobotField = screen.getByTestId('robot-select');
    const submitButton = screen.getByRole('button', { name: /Create Match/i });

    await fireEvent.change(nameField, { target: { value: 'name-input' } });
    await fireEvent.change(minPlayersField, { target: { value: '2' } });
    await fireEvent.change(maxPlayersField, { target: { value: '4' } });
    await fireEvent.change(numberRoundsField, { target: { value: '10' } });
    await fireEvent.change(numberGamesField, { target: { value: '50' } });
    await fireEvent.change(idRobotField, { target: { value: '' } });

    fireEvent.click(submitButton);

    expect(idRobotField).toBeInvalid();
});