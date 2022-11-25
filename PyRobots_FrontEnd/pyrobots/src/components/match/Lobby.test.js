import { render, screen, within, cleanup } from "@testing-library/react";
import Router from "react-router-dom";
import axios from "axios";
import WS from "jest-websocket-mock";
import Lobby from "./Lobby";

jest.mock('axios');
const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate,
    useParams: jest.fn()
}));

const jsonWebsocketMock = {
    room: {
        Creator: { Owner: "pepe1", Robot_name: "robot1" },
        Players: [
            { Player: "pepe2", Robot_name: "robot2" },
            { Player: "pepe3", Robot_name: "robot3" }
        ]
    }
}

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
    WS.clean();
});

describe("Lobby test", () => {
    it("Should print all usernames and robots", async () => {
        const server = new WS("ws://" + process.env.REACT_APP_BACKEND_URL.split("//")[1] + "/lobby/" + 123, { jsonProtocol: true });
        render(<Lobby />);
        await server.connected;
        server.send(jsonWebsocketMock);

        for (let i = 0; i < jsonWebsocketMock.room.Players.length; i++) {
            const { findByText } = within(screen.getByTestId(`player_${jsonWebsocketMock.room.Players[i].Player}`));
            expect(await findByText(jsonWebsocketMock.room.Players[i].Player)).toBeInTheDocument();
        }
        for (let i = 0; i < jsonWebsocketMock.room.Players.length; i++) {
            const { findByText } = within(screen.getByTestId(`robot_${jsonWebsocketMock.room.Players[i].Robot_name}`));
            expect(await findByText(jsonWebsocketMock.room.Players[i].Robot_name)).toBeInTheDocument();
        }
    });
})