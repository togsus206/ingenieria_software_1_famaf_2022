import { render, screen, cleanup, fireEvent, act } from "@testing-library/react";
import Simulation from './Simulation'
import 'jest-canvas-mock'
import axios from "axios"

jest.mock('axios');

const robotsTest = {
    'robots': [
        { 'id': 1, 'name': 'robot1' },
        { 'id': 2, 'name': 'robot2' },
        { 'id': 3, 'name': 'robot3' }
    ]
}

const roundsTest = {
    rounds: [

        {
            robots: [
                { id: 1, x: 10, y: 20 },
                { id: 2, x: 20, y: 20 }
            ],

            missiles: []
        },
        {
            robots: [
                { id: 1, x: 20, y: 20 },
                { id: 2, x: 300, y: 320 }
            ],

            missiles: []
        },
        {
            robots: [
                { id: 1, x: 30, y: 30 },
                { id: 2, x: 500, y: 520 }
            ],

            missiles: []
        },
        {
            robots: [
                { id: 1, x: 740, y: 20 },
                { id: 2, x: 40, y: 20 }
            ],

            missiles: []
        }
    ]
}

const mockRequests = () => {
    axios.get.mockImplementation((url) => {
        switch (url) {
            case `${process.env.REACT_APP_BACKEND_URL}/robots`:
                return Promise.resolve({ status: 200, data: robotsTest })
            default:
                return Promise.reject(new Error('not found'))
        }
    })
    axios.post.mockImplementation(() => Promise.resolve({ status: 200, data: roundsTest }));
}

beforeEach(async () => {
    mockRequests();
})

afterEach(() => {
    cleanup();
});

describe('Test of Simulation', () => {
    test('Form fields exist', async () => {
        await act( async () => {
            render(<Simulation />)
        });

        let input = screen.getByRole('spinbutton', { name: '' })
        expect(input).toBeInTheDocument();

        input = screen.getByRole('button', { name: 'Start simulation' })
        expect(input).toBeInTheDocument();

        let inputRounds = screen.getByTestId('rounds')
        expect(inputRounds).toBeInTheDocument();

        let label = screen.getByTestId('robots')
        expect(label).toBeInTheDocument();

    });

    it("Should recive and show all user robots", async () => {
        render(<Simulation />)
        expect(axios.get).toHaveBeenCalledTimes(1);

        for (let i = 0; i < robotsTest.robots.length; i++) {
            expect(await screen.findByText(robotsTest.robots[i].name)).toBeInTheDocument();
        }
    })
    
    it("Should ask for number of round if field incomplete", async () => {
        render(<Simulation />)
        expect(axios.get).toHaveBeenCalledTimes(1);
        const startbtn = screen.getByTestId('btnStartSimulation');

        fireEvent.click(startbtn);
        
        expect(await screen.findByText("please enter a number between 1 and 200")).toBeInTheDocument();        
    })

    it("Should ask for robots if there are no robots selected", async () => {
        render(<Simulation />)
        expect(axios.get).toHaveBeenCalledTimes(1);
        const inputRounds = screen.getByTestId('rounds');
        const startbtn = screen.getByTestId('btnStartSimulation');

        fireEvent.change(inputRounds, {target: {value: roundsTest.rounds.length }});
        fireEvent.click(startbtn);
        
        expect(await screen.findByText("you must select at least one robot")).toBeInTheDocument();

    })

    it("Should send a request with robots to simulate an nuber of rounds", async () => {
        render(<Simulation />)
        expect(axios.get).toHaveBeenCalledTimes(1);
        const inputRounds = await screen.findByTestId('rounds');
        const startbtn = await screen.findByTestId('btnStartSimulation');
        const checkboxRobot1 = await screen.findByTestId(`checkbox_${robotsTest.robots[0].name}`)
        const checkboxRobot2 = await screen.findByTestId(`checkbox_${robotsTest.robots[2].name}`)

        fireEvent.change(inputRounds, {target: {value: roundsTest.rounds.length }});
        fireEvent.click(checkboxRobot1);
        fireEvent.click(checkboxRobot2);
        await act( async () => {
            fireEvent.click(startbtn);
        });

        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(axios.post).toHaveBeenCalledWith(`${process.env.REACT_APP_BACKEND_URL}/simulation`, {
            robots: [robotsTest.robots[0].id, robotsTest.robots[2].id],
            rounds: `${roundsTest.rounds.length}`,
        });
    })
});