import { render, screen, within, cleanup, fireEvent } from "@testing-library/react";
import ListMatches from "./ListMatches"
import axios from "axios"

jest.mock('axios');

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate,
}));


const matchesTest = {
  "User_Games": [
    { 'id': 1, 'name': 'match1' },
    { 'id': 2, 'name': 'match2' },
    { 'id': 3, 'name': 'match3' }
  ],
  "Games_already_join": [
    { 'id': 4, 'name': 'match4' },
    { 'id': 5, 'name': 'match5' },
    { 'id': 6, 'name': 'match6' }
  ],
  "Games_To_Join": [
    { 'id': 7, 'name': 'match7' },
    { 'id': 8, 'name': 'match8' },
    { 'id': 9, 'name': 'match9' }
  ]
}

const robotsTest = {
  'robots': [
    { 'id': 1, 'name': 'robot1' },
    { 'id': 2, 'name': 'robot2' },
    { 'id': 3, 'name': 'robot3' }
  ]
}

const mockRequests = () => {
  axios.get.mockImplementation((url) => {
    switch (url) {
      case `${process.env.REACT_APP_BACKEND_URL}/matches`:
        return Promise.resolve({ status: 200, data: matchesTest });
      case `${process.env.REACT_APP_BACKEND_URL}/robots`:
        return Promise.resolve({ status: 200, data: robotsTest })
      default:
        return Promise.reject(new Error('not found'))
    }
  })
  axios.post.mockImplementation(() => Promise.resolve({ status: 200, data: { detail: "Joined to match" } }));
}

beforeEach(async () => {
  mockRequests();
})

afterEach(() => {
  cleanup();
});

describe("List matches tests", () => {
  it("should recive and show all created matches", async () => {
    render(<ListMatches />);

    const { findByText } = within(screen.getByTestId('created_matches'));
    for (let i = 0; i < matchesTest.User_Games.length; i++) {
      expect(await findByText(matchesTest.User_Games[i].name)).toBeInTheDocument();
    }
  })

  it("should recive and show all joined matches", async () => {
    render(<ListMatches />);

    const { findByText } = within(screen.getByTestId('joined_matches'));
    for (let i = 0; i < matchesTest.Games_already_join.length; i++) {
      expect(await findByText(matchesTest.Games_already_join[i].name)).toBeInTheDocument();
    }
  })

  it("should recive and show all joinable matches", async () => {
    render(<ListMatches />);

    const { findByText } = within(screen.getByTestId('joinable_matches'));
    for (let i = 0; i < matchesTest.Games_To_Join.length; i++) {
      expect(await findByText(matchesTest.Games_To_Join[i].name)).toBeInTheDocument();
    }
  })
})

describe("Join match tests", () => {
  it("should ask for a robot if is not selected", async () => {
    render(<ListMatches />);
    const joinButton = await screen.findByTestId(`button_${matchesTest.Games_To_Join[0].name}`);
    fireEvent.click(joinButton);
    expect(await screen.findByText('A robot must be selected')).toBeInTheDocument();
  })

  it("should send a request with match.id, robot.id and match password", async () => {
    render(<ListMatches />);
    expect(axios.get).toHaveBeenCalledTimes(2);
    const selectRobot = await screen.findByTestId("select_robot");
    const joinButton = await screen.findByTestId(`button_${matchesTest.Games_To_Join[0].name}`);

    fireEvent.change(selectRobot, { target: { value: robotsTest.robots[0].id } })
    expect(screen.getByText(robotsTest.robots[0].name).selected).toBe(true);

    fireEvent.click(joinButton);
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(`${process.env.REACT_APP_BACKEND_URL}/join_match`, {
      id_match: matchesTest.Games_To_Join[0].id,
      id_robot: `${robotsTest.robots[0].id}`,
      password_match: ""
    });
  })
})