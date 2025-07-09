import React from "react";
import { useFormContext } from "react-hook-form";
import { Stack, Icon } from "@fluentui/react";
import { FormData, StepProps } from "../../../utils/types";
import { COUNTRIES as countries } from "../../../constants/countries";
import { GENDER_OPTIONS as genderOptions } from "../../../constants/gender";

const ConfirmationStep: React.FC<StepProps> = (stepInfo) => {
  const { watch } = useFormContext<FormData>();
  const [avatarUrl, setAvatarUrl] = React.useState<string | undefined>(undefined);

  const formData = watch();

  const getCountryName = (countryKey: string) => {
    return countries.find((c) => c.key === countryKey)?.text || countryKey;
  };

  const getGenderName = (genderKey: string) => {
    return genderOptions.find((g) => g.key === genderKey)?.text || genderKey;
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Not provided";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  React.useEffect(() => {
    if (formData.avatar) {
      const objectUrl = URL.createObjectURL(formData.avatar);
      setAvatarUrl(objectUrl);
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else {
      setAvatarUrl(undefined);
    }
  }, [formData.avatar]);

  return (
    <div className="form-step">
      <Stack tokens={{ childrenGap: 30 }}>
        <div className="confirmation-header">
          <Icon iconName="SkypeCheck" className="confirmation-check-icon" />
          <h2>{stepInfo.title}</h2>
          <p className="confirmation-subtitle">{stepInfo.description}</p>
        </div>

        {/* Profile Summary Card */}
        <div className="profile-summary-card">
          <div className="profile-avatar-section">
            {formData.avatar ? (
              <img
                src={avatarUrl}
                alt="Profile"
                className="profile-avatar"
              />
            ) : (
              <div className="profile-avatar-placeholder">
                <Icon iconName="Contact" className="avatar-placeholder-icon" />
              </div>
            )}
          </div>
          <div className="profile-info">
            <h3 className="profile-name">
              {formData.firstName} {formData.lastName}
            </h3>
            <p className="profile-details">
              {getGenderName(formData.gender)} •{" "}
              {getCountryName(formData.country)}
            </p>
            <p className="profile-birth">
              Born {formatDate(formData.dateOfBirth)}
            </p>
          </div>
        </div>

        {/* Confirmation Sections */}
        <div className="confirmation-grid">
          <div className="confirmation-card">
            <div className="card-header">
              <Icon iconName="Contact" className="card-icon" />
              <h3>Personal Information</h3>
            </div>
            <div className="card-content">
              <div className="info-row">
                <span className="info-label">Full Name</span>
                <span className="info-value">
                  {formData.firstName} {formData.lastName}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Date of Birth</span>
                <span className="info-value">
                  {formatDate(formData.dateOfBirth)}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Gender</span>
                <span className="info-value">
                  {getGenderName(formData.gender)}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Country</span>
                <span className="info-value">
                  {getCountryName(formData.country)}
                </span>
              </div>
            </div>
          </div>

          <div className="confirmation-card">
            <div className="card-header">
              <Icon iconName="Mail" className="card-icon" />
              <h3>Account Details</h3>
            </div>
            <div className="card-content">
              <div className="info-row">
                <span className="info-label">Email Address</span>
                <span className="info-value">{formData.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Password</span>
                <span className="info-value password-mask">••••••••</span>
              </div>
              {formData.avatar && (
                <div className="info-row">
                  <span className="info-label">Profile Photo</span>
                  <span className="info-value status-success">
                    <Icon iconName="CheckMark" className="success-indicator" />
                    Uploaded
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="confirmation-notice">
          <Icon iconName="Info" className="notice-icon" />
          <p>
            Please review your information carefully. You can go back to make
            changes or proceed to complete your registration.
          </p>
        </div>
      </Stack>
    </div>
  );
};

export default ConfirmationStep;
