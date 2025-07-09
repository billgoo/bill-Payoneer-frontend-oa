import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm, FormProvider } from "react-hook-form";
import BasicInfoStep from "./BasicInfoStep";
import { FormData, StepProps } from "../../../utils/types";

// Mock DatePicker component
jest.mock("@fluentui/react", () => ({
  ...jest.requireActual("@fluentui/react"),
  DatePicker: ({ label, onSelectDate, value, ...props }: any) => (
    <div>
      <label>{label}</label>
      <input
        type="date"
        data-testid={props["data-testid"] || "dateOfBirth-input"}
        onChange={(e) => onSelectDate && onSelectDate(new Date(e.target.value))}
        value={value ? value.toISOString().split("T")[0] : ""}
        aria-label={label}
        title={label}
      />
    </div>
  ),
}));

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

describe("BasicInfoStep", () => {
  const defaultStepProps: StepProps = {
    id: 1,
    title: "Basic Information",
    description: "Please provide your basic information to get started.",
    errors: {},
  };

  test("renders all form fields correctly", () => {
    render(
      <TestWrapper stepProps={defaultStepProps}>
        <BasicInfoStep {...defaultStepProps} />
      </TestWrapper>
    );

    expect(screen.getByText("Basic Information")).toBeInTheDocument();
    expect(
      screen.getByText("Please provide your basic information to get started.")
    ).toBeInTheDocument();
    expect(screen.getByTestId("firstName-input")).toBeInTheDocument();
    expect(screen.getByTestId("lastName-input")).toBeInTheDocument();
    expect(screen.getByTestId("dateOfBirth-input")).toBeInTheDocument();
  });

  test("displays validation errors", () => {
    const stepPropsWithErrors: StepProps = {
      ...defaultStepProps,
      errors: {
        firstName: "First name is required",
        lastName: "Last name is required",
        dateOfBirth: "Date of birth is required",
      },
    };

    render(
      <TestWrapper stepProps={stepPropsWithErrors}>
        <BasicInfoStep {...stepPropsWithErrors} />
      </TestWrapper>
    );

    // Check that inputs have error state (aria-invalid="true")
    const firstNameInput = screen.getByTestId("firstName-input");
    const lastNameInput = screen.getByTestId("lastName-input");

    expect(firstNameInput).toHaveAttribute("aria-invalid", "true");
    expect(lastNameInput).toHaveAttribute("aria-invalid", "true");

    // Check for date error message which is rendered differently
    expect(screen.getByText("Date of birth is required")).toBeInTheDocument();
  });

  test("allows user input in text fields", async () => {
    render(
      <TestWrapper stepProps={defaultStepProps}>
        <BasicInfoStep {...defaultStepProps} />
      </TestWrapper>
    );

    const firstNameInput = screen.getByTestId("firstName-input");
    const lastNameInput = screen.getByTestId("lastName-input");

    await userEvent.type(firstNameInput, "John");
    await userEvent.type(lastNameInput, "Doe");

    expect(firstNameInput).toHaveValue("John");
    expect(lastNameInput).toHaveValue("Doe");
  });

  test("handles date selection", async () => {
    render(
      <TestWrapper stepProps={defaultStepProps}>
        <BasicInfoStep {...defaultStepProps} />
      </TestWrapper>
    );

    const dateInput = screen.getByTestId("dateOfBirth-input");
    await userEvent.type(dateInput, "1990-01-01");

    expect(dateInput).toHaveValue("1990-01-01");
  });

  test("has required attributes on required fields", () => {
    render(
      <TestWrapper stepProps={defaultStepProps}>
        <BasicInfoStep {...defaultStepProps} />
      </TestWrapper>
    );

    const firstNameInput = screen.getByTestId("firstName-input");
    const lastNameInput = screen.getByTestId("lastName-input");
    const dateInput = screen.getByTestId("dateOfBirth-input");

    expect(firstNameInput).toBeRequired();
    expect(lastNameInput).toBeRequired();
    expect(dateInput).toHaveAttribute("type", "date");
  });
});
