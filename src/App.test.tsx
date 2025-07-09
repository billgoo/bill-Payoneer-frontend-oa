import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders registration form title", () => {
  render(<App />);
  const titleElement = screen.getByText(/Account Registration Form/i);
  expect(titleElement).toBeInTheDocument();
});
