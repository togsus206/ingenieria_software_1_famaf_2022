import { render, screen, cleanup } from "@testing-library/react";
import Router from "react-router-dom";
import axios from "axios";
import { act } from "react-dom/test-utils";
import ButtonLobby from "./ButtonLobby";

jest.mock('axios');
const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate,
    useParams: jest.fn()
}));

const mockRequests = () => {
    axios.get.mockImplementation((url) => {
        switch (url) {
            case `${process.env.REACT_APP_BACKEND_URL}/profile`:
                return Promise.resolve({ status: 200, data: { username: "pepe1" } })
            default:
                return Promise.reject(new Error('not found'))
        }
    })
}

beforeEach(async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ id: '123' });
    mockRequests();
});

afterEach(() => {
    cleanup();
});


describe("Button dependig on user", () => {
    it("should show start match", async () => {
        await act(async () => {
            render(<ButtonLobby owner={"pepe1"} />);
          })
        const startButton = screen.getByRole('button', { name: "Start Match" });
        expect(startButton).toBeInTheDocument();
    });

    it("should show Leave match", async () => {
        await act(async () => {
            render(<ButtonLobby owner={"pepe5"} />);
          })
        const LeaveButton = screen.getByRole('button', { name: "Leave Match" });
        expect(LeaveButton).toBeInTheDocument();
    });
})