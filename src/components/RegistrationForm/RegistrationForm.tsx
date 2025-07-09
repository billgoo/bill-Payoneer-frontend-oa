import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { PrimaryButton, DefaultButton, Spinner, Icon } from "@fluentui/react";
import { FormData, StepProps } from "../../utils/types";
import { simulateApiCall } from "../../apis/mockApi";
import { validateStep } from "../../utils/validationSchemas";
import BasicInfoStep from "./steps/BasicInfoStep";
import DetailsStep from "./steps/DetailsStep";
import AccountStep from "./steps/AccountStep";
import ConfirmationStep from "./steps/ConfirmationStep";
import "./RegistrationForm.css";

export const STEPS = [
  { id: 1, name: "Basic Info", title: "Basic Information", description: "Please provide your basic information to get started.", component: BasicInfoStep },
  { id: 2, name: "Details", title: "Additional Details", description: "Please provide additional details about yourself.", component: DetailsStep },
  { id: 3, name: "Account", title: "Account Information", description: "Please provide your account information.", component: AccountStep },
  { id: 4, name: "Confirmation", title: "Confirm Your Details", description: "Please confirm your details.", component: ConfirmationStep },
];

const RegistrationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [stepInfo, setStepInfo] = useState<StepProps>({id: -1, title: "", description: "", errors: {}});

  const methods = useForm<FormData>({
    mode: "onChange",
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

  const { handleSubmit, getValues } = methods;

  const validateCurrentStep = async (): Promise<boolean> => {
    const currentData = getValues();
    const validation = await validateStep(currentStep, currentData);

    if (!validation.isValid) {
      setStepInfo((prev) => ({ ...prev, errors: validation.errors }));
      return false;
    }

    setStepInfo((prev) => ({ ...prev, errors: {} }));
    return true;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const result = await simulateApiCall(data);
      if (result.success) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      handleSubmit(onSubmit)();
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setCurrentStep(1);
    setStepInfo({id: 1, title: STEPS[0].title, description: STEPS[0].description, errors: {}});
    methods.reset();
  };

  if (isSubmitted) {
    return (
      <div className="registration-form-container">
        <div className="success-message">
          <Icon iconName="CheckMark" className="success-icon" />
          <h2 className="success-title">Registration Successful!</h2>
          <p className="success-description">
            Your account has been created successfully. You can now start using
            our services.
          </p>
          <PrimaryButton onClick={resetForm}>
            Register Another Account
          </PrimaryButton>
        </div>
      </div>
    );
  }

  const CurrentStepComponent = STEPS[currentStep - 1].component;

  return (
    <div className="registration-form-container">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Step Indicator */}
          <div className="step-indicator">
            {STEPS.map((step) => (
              <div key={step.id} className="step-item">
                <div
                  className={`step-number ${
                    step.id === currentStep
                      ? "active"
                      : step.id < currentStep
                      ? "completed"
                      : "inactive"
                  }`}
                >
                  {step.id < currentStep ? (
                    <Icon iconName="CheckMark" />
                  ) : (
                    step.id
                  )}
                </div>
                <h4
                  className={`step-title ${
                    step.id === currentStep
                      ? "active"
                      : step.id < currentStep
                      ? "completed"
                      : "inactive"
                  }`}
                >
                  {step.name}
                </h4>
              </div>
            ))}
          </div>

          {/* Current Step Content */}
          <CurrentStepComponent {...stepInfo} />

          {/* Loading Spinner */}
          {isSubmitting && (
            <div className="loading-spinner">
              <Spinner label="Submitting your registration..." />
            </div>
          )}

          {/* Form Actions */}
          <div className="form-actions">
            <div>
              {currentStep > 1 && (
                <DefaultButton
                  onClick={handlePrevious}
                  disabled={isSubmitting}
                  data-testid="previous-button"
                >
                  Previous
                </DefaultButton>
              )}
            </div>

            <div>
              {currentStep < STEPS.length ? (
                <PrimaryButton
                  onClick={handleNext}
                  disabled={isSubmitting}
                  data-testid="next-button"
                >
                  Next
                </PrimaryButton>
              ) : (
                <PrimaryButton
                  onClick={handleFormSubmit}
                  disabled={isSubmitting}
                  data-testid="submit-button"
                >
                  {isSubmitting ? "Submitting..." : "Submit Registration"}
                </PrimaryButton>
              )}
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default RegistrationForm;
