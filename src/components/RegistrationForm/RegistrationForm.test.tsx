import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegistrationForm, { STEPS } from "./RegistrationForm";
import { simulateApiCall } from "../../apis/mockApi";
import { validateStep } from "../../utils/validationSchemas";

// Mock step components to avoid rendering their internals
jest.mock("./steps/BasicInfoStep", () => (props: any) => <div data-testid="basic-info-step" {...props} />);
jest.mock("./steps/DetailsStep", () => (props: any) => <div data-testid="details-step" {...props} />);
jest.mock("./steps/AccountStep", () => (props: any) => <div data-testid="account-step" {...props} />);
jest.mock("./steps/ConfirmationStep", () => (props: any) => <div data-testid="confirmation-step" {...props} />);

// Mock validation and API
jest.mock("../../utils/validationSchemas", () => ({
    validateStep: jest.fn(),
}));
jest.mock("../../apis/mockApi", () => ({
    simulateApiCall: jest.fn(),
}));

describe("RegistrationForm", () => {
    beforeEach(() => {
        (validateStep as jest.Mock).mockResolvedValue({ isValid: true, errors: {} });
        (simulateApiCall as jest.Mock).mockResolvedValue({ success: true });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders the first step by default", () => {
        render(<RegistrationForm />);
        expect(screen.getByTestId("basic-info-step")).toBeInTheDocument();
        expect(screen.getByText(STEPS[0].name)).toBeInTheDocument();
        expect(screen.getByTestId("next-button")).toBeInTheDocument();
    });

    it("navigates to the next step when Next is clicked and validation passes", async () => {
        render(<RegistrationForm />);
        fireEvent.click(screen.getByTestId("next-button"));
        await waitFor(() => {
            expect(screen.getByTestId("details-step")).toBeInTheDocument();
        });
    });

    it("navigates to the previous step when Previous is clicked", async () => {
        render(<RegistrationForm />);
        // Go to step 2
        fireEvent.click(screen.getByTestId("next-button"));
        await waitFor(() => {
            expect(screen.getByTestId("details-step")).toBeInTheDocument();
        });
        // Go back to step 1
        fireEvent.click(screen.getByTestId("previous-button"));
        await waitFor(() => {
            expect(screen.getByTestId("basic-info-step")).toBeInTheDocument();
        });
    });

    it("shows validation errors and does not proceed if validation fails", async () => {
        (validateStep as jest.Mock).mockResolvedValueOnce({
            isValid: false,
            errors: { firstName: "Required" },
        });
        render(<RegistrationForm />);
        fireEvent.click(screen.getByTestId("next-button"));
        await waitFor(() => {
            // Should still be on the first step
            expect(screen.getByTestId("basic-info-step")).toBeInTheDocument();
        });
    });

    it("shows the confirmation step on the last step", async () => {
        render(<RegistrationForm />);
        // Go through all steps
        for (let i = 1; i < STEPS.length; i++) {
            fireEvent.click(screen.getByTestId("next-button"));
            // Wait for the next step to render
            await waitFor(() => {
                expect(
                    screen.getByTestId(
                        [ "basic-info-step", "details-step", "account-step", "confirmation-step" ][i]
                    )
                ).toBeInTheDocument();
            });
        }
        expect(screen.getByTestId("confirmation-step")).toBeInTheDocument();
        expect(screen.getByTestId("submit-button")).toBeInTheDocument();
    });

    it("submits the form and shows success message", async () => {
        render(<RegistrationForm />);
        // Go to last step
        for (let i = 1; i < STEPS.length; i++) {
            fireEvent.click(screen.getByTestId("next-button"));
            await waitFor(() => {
                expect(
                    screen.getByTestId(
                        [ "basic-info-step", "details-step", "account-step", "confirmation-step" ][i]
                    )
                ).toBeInTheDocument();
            });
        }
        fireEvent.click(screen.getByTestId("submit-button"));
        await waitFor(() => {
            expect(screen.getByText(/Registration Successful/i)).toBeInTheDocument();
            expect(screen.getByText(/Register Another Account/i)).toBeInTheDocument();
        });
    });

    it("resets the form when 'Register Another Account' is clicked", async () => {
        render(<RegistrationForm />);
        // Go to last step and submit
        for (let i = 1; i < STEPS.length; i++) {
            fireEvent.click(screen.getByTestId("next-button"));
            await waitFor(() => {
                expect(
                    screen.getByTestId(
                        [ "basic-info-step", "details-step", "account-step", "confirmation-step" ][i]
                    )
                ).toBeInTheDocument();
            });
        }
        fireEvent.click(screen.getByTestId("submit-button"));
        await waitFor(() => {
            expect(screen.getByText(/Registration Successful/i)).toBeInTheDocument();
        });
        fireEvent.click(screen.getByText(/Register Another Account/i));
        await waitFor(() => {
            expect(screen.getByTestId("basic-info-step")).toBeInTheDocument();
        });
    });

    it("shows loading spinner when submitting", async () => {
        let resolveApi: any;
        (simulateApiCall as jest.Mock).mockImplementation(
            () =>
                new Promise((resolve) => {
                    resolveApi = resolve;
                })
        );
        render(<RegistrationForm />);
        // Go to last step
        for (let i = 1; i < STEPS.length; i++) {
            fireEvent.click(screen.getByTestId("next-button"));
            await waitFor(() => {
                expect(
                    screen.getByTestId(
                        [ "basic-info-step", "details-step", "account-step", "confirmation-step" ][i]
                    )
                ).toBeInTheDocument();
            });
        }
        fireEvent.click(screen.getByTestId("submit-button"));
        expect(screen.getByText(/Submit Registration/i)).toBeInTheDocument();
        // Wait for the mock implementation to assign resolveApi
        await waitFor(() => expect(typeof resolveApi).toBe("function"));
        // Finish API call
        resolveApi({ success: true });
        await waitFor(() => {
            expect(screen.getByText(/Registration Successful/i)).toBeInTheDocument();
        });
    });

    it("allows clicking previous steps in confirmation step", async () => {
        render(<RegistrationForm />);
        // Go to confirmation step
        for (let i = 1; i < STEPS.length; i++) {
            fireEvent.click(screen.getByTestId("next-button"));
            await waitFor(() => {
                expect(
                    screen.getByTestId(
                        [ "basic-info-step", "details-step", "account-step", "confirmation-step" ][i]
                    )
                ).toBeInTheDocument();
            });
        }
        // Click on step 2 indicator
        const step2Indicator = screen.getAllByText(STEPS[1].name)[0];
        fireEvent.click(step2Indicator);
        await waitFor(() => {
            expect(screen.getByTestId("details-step")).toBeInTheDocument();
        });
    });
});