import React from "react";
import { render, screen } from "@testing-library/react";
import Login from "./Login";

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

it('should have a email and password field, alsog a sumbit button', () => {
  render(<Login />);
  const emailField = screen.getByText(/email/i);
  const passwordField = screen.getByText(/password/i);
  const submitButton = screen.getByRole('button', { name: /Login/i });

  expect(emailField).toBeInTheDocument();
  expect(passwordField).toBeInTheDocument();
  expect(submitButton).toBeInTheDocument();
});