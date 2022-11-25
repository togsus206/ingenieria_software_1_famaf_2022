import { render, screen, within, cleanup, fireEvent } from "@testing-library/react";
import ListRobots from "./ListRobots";
import axios from "axios"
import { act } from "react-dom/test-utils";

jest.mock('axios');
const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));


const robotsTest = {
  'robots': [
    {
      'id': 1,
      'name': 'robot1',
      'avatar': 'https://picsum.photos/200',
      'game_won': 1,
      'game_draw': 2,
      'game_played': 5,
    },
    {
      'id': 2,
      'name': 'robot2',
      'avatar': 'https://picsum.photos/201',
      'game_won': 0,
      'game_draw': 5,
      'game_played': 8,
    },
    {
      'id': 3,
      'name': 'robot3',
      'avatar': 'https://picsum.photos/199',
      'game_won': 3,
      'game_draw': 5,
      'game_played': 10,
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
}

beforeEach(async () => {
  mockRequests();
})

afterEach(() => {
  cleanup();
});

describe("List robots tests", () => {
  it("Should print all names of robots", async () => {
    await act(async () => {
      render(<ListRobots />);
    })
    expect(axios.get).toHaveBeenCalledTimes(1);
    for (let i = 0; i < robotsTest.robots.length; i++) {
      const { findByText } = within(screen.getByTestId(`robot_${robotsTest.robots[i].name}`));
      expect(await findByText(robotsTest.robots[i].name)).toBeInTheDocument();
    }
  });

  it("Should show the avatar of each robot", async () => {
    await act(async () => {
      render(<ListRobots />);
    })
    expect(axios.get).toHaveBeenCalledTimes(1);
    for (let i = 0; i < robotsTest.robots.length; i++) {
      const robot_div = screen.getByTestId(`robot_${robotsTest.robots[i].name}`);
      const testImage = robot_div.querySelector("img");
      expect(testImage.src).toContain(robotsTest.robots[i].avatar);
    }
  });

  it("Should show statistics of each robot", async () => {
    await act(async () => {
      render(<ListRobots />);
    })
    expect(axios.get).toHaveBeenCalledTimes(1);
    for (let i = 0; i < robotsTest.robots.length; i++) {
      const { findByText } = within(screen.getByTestId(`robot_${robotsTest.robots[i].name}`));
      expect(await findByText(`Played matches:`)).toBeInTheDocument();
    }
  });

  it("Should navigate to /upload_robot when button is clicked", async () => {
    await act(async () => {
      render(<ListRobots />);
    })
    expect(axios.get).toHaveBeenCalledTimes(1);
    const upload_button = screen.getByRole('button', { name: /Add a new robot/i });
    expect(upload_button).toBeInTheDocument();
    fireEvent.click(upload_button);
    expect(mockedUsedNavigate).toBeCalledTimes(1);
    expect(mockedUsedNavigate).toBeCalledWith("/upload_robot");
  });
})