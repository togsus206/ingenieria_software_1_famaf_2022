import React from "react";
import Upload from "./upload";
import { fireEvent, render, screen } from "@testing-library/react";

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

describe("Upload Robot", () => {

  test("form fields exists", () => {
    render(<Upload />);

    const robot_name = screen.getByPlaceholderText("robot_name");
    const robot_avatar = screen.getByPlaceholderText("robot_avatar");
    const robot_file = screen.getByPlaceholderText("robot_file");
    const submit_button = screen.getByRole("button", {name:"Upload"});
    
    expect(robot_name).toBeInTheDocument();
    expect(robot_avatar).toBeInTheDocument();
    expect(robot_file).toBeInTheDocument();
    expect(submit_button).toBeInTheDocument();
  })

  test("name not specified", async () => {
    render(<Upload />);

    let avatar_example = new File(["(⌐□_□)"], "chucknorris.png", { type: "image/png" });
    let file_example = new File(["(⌐□_□)"], "chucknorris.py", { type: ".py" });

    const robot_avatar = screen.getByPlaceholderText("robot_avatar");
    const robot_file = screen.getByPlaceholderText("robot_file");
    const submit_button = screen.getByRole("button", {name:"Upload"});

    await fireEvent.change(robot_avatar, {target: {files: [avatar_example]}});
    await fireEvent.change(robot_file, {target: {files: [file_example]}});
    fireEvent.click(submit_button);

    const response = await screen.findByText('A name is required');
    expect(response).toBeInTheDocument();

  })

  test("file not specified", async () => {
    render(<Upload />);

    let avatar_example = new File(["(⌐□_□)"], "chucknorris.png", { type: "image/png" });

    const robot_name = screen.getByPlaceholderText("robot_name");
    const robot_avatar = screen.getByPlaceholderText("robot_avatar");
    const submit_button = screen.getByRole("button", {name:"Upload"});

    await fireEvent.change(robot_name, {target: {value:"example robot"}});
    await fireEvent.change(robot_avatar, {target: {files: [avatar_example]}});
    fireEvent.click(submit_button);

    const response = await screen.findByText('A script is required');
    expect(response).toBeInTheDocument();

  })
});