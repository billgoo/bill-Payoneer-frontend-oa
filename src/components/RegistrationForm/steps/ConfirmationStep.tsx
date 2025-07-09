import React from "react";
import { useFormContext } from "react-hook-form";
import { Stack, Icon } from "@fluentui/react";
import { FormData, StepProps } from "../../../utils/types";
import { COUNTRIES as countries } from "../../../constants/countries";
import { GENDER_OPTIONS as genderOptions } from "../../../constants/gender";
import { STEPS } from "../RegistrationForm";

const ConfirmationStep: React.FC<StepProps> = (stepInfo) => {
  const { watch } = useFormContext<FormData>();

  const formData = watch();

  const getCountryName = (countryKey: string) => {
    return countries.find((c) => c.key === countryKey)?.text || countryKey;
  };

  const getGenderName = (genderKey: string) => {
    return genderOptions.find((g) => g.key === genderKey)?.text || genderKey;
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString();
  };

  return (
    <div className="form-step">
      <Stack tokens={{ childrenGap: 20 }}>
        <h2>{stepInfo.title}</h2>
        <p>{stepInfo.description}</p>

        <div className="confirmation-section">
          <h3>{STEPS[0].title}</h3>
          <div className="confirmation-item">
            <span className="confirmation-label">Name:</span>
            <span className="confirmation-value">
              {formData.firstName} {formData.lastName}
            </span>
          </div>
          <div className="confirmation-item">
            <span className="confirmation-label">Date of Birth:</span>
            <span className="confirmation-value">
              {formatDate(formData.dateOfBirth)}
            </span>
          </div>
        </div>

        <div className="confirmation-section">
          <h3>{STEPS[1].title}</h3>
          <div className="confirmation-item">
            <span className="confirmation-label">Country:</span>
            <span className="confirmation-value">
              {getCountryName(formData.country)}
            </span>
          </div>
          <div className="confirmation-item">
            <span className="confirmation-label">Gender:</span>
            <span className="confirmation-value">
              {getGenderName(formData.gender)}
            </span>
          </div>
          {formData.avatar && (
            <div className="confirmation-item">
              <span className="confirmation-label">Profile Photo:</span>
              <span className="confirmation-value">
                <Icon iconName="CheckMark" className="success-icon-small" />
                Uploaded
              </span>
            </div>
          )}
        </div>

        <div className="confirmation-section">
          <h3>{STEPS[2].title}</h3>
          <div className="confirmation-item">
            <span className="confirmation-label">Email:</span>
            <span className="confirmation-value">{formData.email}</span>
          </div>
          <div className="confirmation-item">
            <span className="confirmation-label">Password:</span>
            <span className="confirmation-value">••••••••</span>
          </div>
        </div>
      </Stack>
    </div>
  );
};

export default ConfirmationStep;
