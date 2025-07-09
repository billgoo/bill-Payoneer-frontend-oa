import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { TextField, Stack } from "@fluentui/react";
import { FormData, StepProps } from "../../../utils/types";

const FormFieldProps = {
  email: {
    label: "Email Address",
    placeholder: "Enter your email address",
    required: true,
    dataTestId: "email-input",
  },
  password: {
    label: "Password",
    placeholder: "Create a password (at least 8 characters)",
    required: true,
    dataTestId: "password-input",
  },
};

const AccountStep: React.FC<StepProps> = (stepInfo) => {
  const { control } = useFormContext<FormData>();

  return (
    <div className="form-step">
      <Stack tokens={{ childrenGap: 20 }}>
        <h2>{stepInfo.title}</h2>
        <p>{stepInfo.description}</p>

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              label={FormFieldProps.email.label}
              type="email"
              placeholder={FormFieldProps.email.placeholder}
              required
              value={field.value || ""}
              onChange={(_, newValue) => field.onChange(newValue)}
              onBlur={field.onBlur}
              errorMessage={stepInfo.errors.email}
              data-testid={FormFieldProps.email.dataTestId}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              label={FormFieldProps.password.label}
              type="password"
              placeholder={FormFieldProps.password.placeholder}
              required
              value={field.value || ""}
              onChange={(_, newValue) => field.onChange(newValue)}
              onBlur={field.onBlur}
              errorMessage={stepInfo.errors.password}
              data-testid={FormFieldProps.password.dataTestId}
              canRevealPassword
              revealPasswordAriaLabel="Show password"
              description="Password must be at least 8 characters long"
            />
          )}
        />
      </Stack>
    </div>
  );
};

export default AccountStep;
