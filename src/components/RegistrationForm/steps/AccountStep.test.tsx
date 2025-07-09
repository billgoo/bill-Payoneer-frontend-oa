import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm, FormProvider } from "react-hook-form";
import AccountStep from "./AccountStep";
import { FormData, StepProps } from "../../../utils/types";

const TestWrapper: React.FC<{
  children: React.ReactNode;
  stepProps: StepProps;
}> = ({ children, stepProps }) => {
  const methods = useForm<FormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: null,
      country: "",
      gender: "",
      avatar: null,
      email: "",
      password: "",
    },
  });

  return (
    <FormProvider {...methods}>
      {React.cloneElement(children as React.ReactElement, stepProps)}
    </FormProvider>
  );
};

describe("AccountStep", () => {
  const defaultStepProps: StepProps = {
    id: 3,
    title: "Account Information",
    description: "Please provide your account information.",
    errors: {},
  };

  test("renders all form fields correctly", () => {
    render(
      <TestWrapper stepProps={defaultStepProps}>
        <AccountStep {...defaultStepProps} />
      </TestWrapper>
    );

    expect(screen.getByText("Account Information")).toBeInTheDocument();
    expect(
      screen.getByText("Please provide your account information.")
    ).toBeInTheDocument();
    expect(screen.getByTestId("email-input")).toBeInTheDocument();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
  });

  test("displays validation errors", () => {
    const stepPropsWithErrors: StepProps = {
      ...defaultStepProps,
      errors: {
        email: "Email is required",
        password: "Password must be at least 8 characters",
      },
    };

    render(
      <TestWrapper stepProps={stepPropsWithErrors}>
        <AccountStep {...stepPropsWithErrors} />
      </TestWrapper>
    );

    // Check that inputs have error state (aria-invalid="true")
    const emailInput = screen.getByTestId("email-input");
    const passwordInput = screen.getByTestId("password-input");

    expect(emailInput).toHaveAttribute("aria-invalid", "true");
    expect(passwordInput).toHaveAttribute("aria-invalid", "true");
  });

  test("allows user input in email and password fields", async () => {
    render(
      <TestWrapper stepProps={defaultStepProps}>
        <AccountStep {...defaultStepProps} />
      </TestWrapper>
    );

    const emailInput = screen.getByTestId("email-input");
    const passwordInput = screen.getByTestId("password-input");

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  test("has required attributes on required fields", () => {
    render(
      <TestWrapper stepProps={defaultStepProps}>
        <AccountStep {...defaultStepProps} />
      </TestWrapper>
    );

    const emailInput = screen.getByTestId("email-input");
    const passwordInput = screen.getByTestId("password-input");

    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
    expect(emailInput).toHaveAttribute("type", "email");
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("password field can be revealed", () => {
    render(
      <TestWrapper stepProps={defaultStepProps}>
        <AccountStep {...defaultStepProps} />
      </TestWrapper>
    );

    const revealButton = screen.getByLabelText("Show password");
    expect(revealButton).toBeInTheDocument();
  });
});
