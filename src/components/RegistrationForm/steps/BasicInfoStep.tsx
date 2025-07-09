import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { TextField, Stack, DatePicker } from "@fluentui/react";
import { FormData, StepProps } from "../../../utils/types";

const FormFieldProps = {
  firstName: {
    label: "First Name",
    placeholder: "Enter your first name",
    required: true,
    dataTestId: "firstName-input",
  },
  lastName: {
    label: "Last Name",
    placeholder: "Enter your last name",
    required: true,
    dataTestId: "lastName-input",
  },
  dateOfBirth: {
    label: "Date of Birth",
    placeholder: "Select your date of birth",
    required: true,
    dataTestId: "dateOfBirth-input",
  },
};

const BasicInfoStep: React.FC<StepProps> = (stepInfo) => {
  const { control } = useFormContext<FormData>();

  const today = new Date();
  const minDate = new Date(today.getFullYear() - 200, today.getMonth(), today.getDate()); // 200 years ago

  return (
    <div className="form-step">
      <Stack tokens={{ childrenGap: 20 }}>
        <h2>{stepInfo.title}</h2>
        <p>{stepInfo.description}</p>

        <div className="form-field-group">
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <TextField
                label={FormFieldProps.firstName.label}
                placeholder={FormFieldProps.firstName.placeholder}
                required={FormFieldProps.firstName.required}
                value={field.value || ""}
                onChange={(_, newValue) => field.onChange(newValue || "")}
                errorMessage={stepInfo.errors.firstName}
                data-testid={FormFieldProps.firstName.dataTestId}
              />
            )}
          />

          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <TextField
                label={FormFieldProps.lastName.label}
                placeholder={FormFieldProps.lastName.placeholder}
                required={FormFieldProps.lastName.required}
                value={field.value || ""}
                onChange={(_, newValue) => field.onChange(newValue || "")}
                errorMessage={stepInfo.errors.lastName}
                data-testid={FormFieldProps.lastName.dataTestId}
              />
            )}
          />
        </div>

        <Controller
          name="dateOfBirth"
          control={control}
          render={({ field }) => {
            return (
              <DatePicker
                label={FormFieldProps.dateOfBirth.label}
                placeholder={FormFieldProps.dateOfBirth.placeholder}
                value={field.value || undefined}
                onSelectDate={(date) => field.onChange(date || null)}
                formatDate={(date) => (date ? date.toLocaleDateString() : "")}
                minDate={minDate}
                maxDate={today}
                isRequired
                className="form-field-date"
                data-testid={FormFieldProps.dateOfBirth.dataTestId}
              />
            );
          }}
        />
        {stepInfo.errors.dateOfBirth && (
          <div className="field-error">{stepInfo.errors.dateOfBirth}</div>
        )}
      </Stack>
    </div>
  );
};

export default BasicInfoStep;
