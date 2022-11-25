/* eslint-disable react/jsx-pascal-case */
import { fireEvent, render, screen } from "@testing-library/react";
import Create_user from "./create_user";
import axios from "axios"

jest.mock('axios');
const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));
window.alert = jest.fn();

describe("Tests of create_users", () => {
    test("form fields exist", () => {

        render(<Create_user />);

        const inputName = screen.getByPlaceholderText("enter your name");
        const inputEmail = screen.getByPlaceholderText("enter your email");
        const inputPassword = screen.getByPlaceholderText("enter your password");
        const submitButton = screen.getByRole('button', { name: /Register/i });

        expect(inputName).toBeInTheDocument();
        expect(inputEmail).toBeInTheDocument();
        expect(inputPassword).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();

    });

    test("successful sending of user registration form data", async () => {
        render(<Create_user />);
        axios.post.mockImplementation(() => Promise.resolve({ status: 200, data: { message: "User created successfully" } }));

        const inputName = screen.getByPlaceholderText(/enter your name/i);
        await fireEvent.change(inputName, { target: { value: 'Jhon' } });

        const inputEmail = screen.getByPlaceholderText(/enter your email/i);
        await fireEvent.change(inputEmail, { target: { value: 'Jhon@gmail.com' } });

        const inputPassword = screen.getByPlaceholderText(/enter your password/i);
        await fireEvent.change(inputPassword, { target: { value: 'abcd-1234' } });

        const button = screen.getByRole('button', { name: /Register/i });
        fireEvent.click(button);

        expect(await window.alert).toBeCalledTimes(1);
        expect(window.alert).toBeCalledWith("User created successfully");
        expect(mockedUsedNavigate).toBeCalledTimes(1);
        expect(mockedUsedNavigate).toBeCalledWith("/verify_user")
    });

    test("error in sending data from the user registration form", async () => {
        render(<Create_user />);

        axios.post.mockImplementation(() => Promise.reject({}));

        const inputName = screen.getByPlaceholderText(/enter your name/i);
        await fireEvent.change(inputName, { target: { value: 'Fede' } });

        const inputEmail = screen.getByPlaceholderText(/enter your email/i);
        await fireEvent.change(inputEmail, { target: { value: 'fede@gmail.com' } });

        const inputPassword = screen.getByPlaceholderText(/enter your password/i);
        await fireEvent.change(inputPassword, { target: { value: 'abcd-12345' } });

        const button = screen.getByRole('button', { name: /Register/i });
        fireEvent.click(button);

        const response = await screen.findByText('Server error');

        expect(response).toBeInTheDocument();
    });
})