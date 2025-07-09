import React, { useRef, useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
  TextField,
  Dropdown,
  Stack,
  PrimaryButton,
  Icon,
  Callout,
  List,
  DirectionalHint,
} from "@fluentui/react";
import { FormData, StepProps } from "../../../utils/types";
import {
  COUNTRIES as countries,
  searchCountries,
} from "../../../constants/countries";
import { GENDER_OPTIONS as genderOptions } from "../../../constants/gender";
import {
  validateFileType,
  validateFileSize,
  formatFileSize,
} from "../../../utils/fileUtils";

const FormFieldProps = {
  country: {
    label: "Country",
    placeholder: "Select your country",
    required: true,
    dataTestId: "country-dropdown",
  },
  gender: {
    label: "Gender",
    placeholder: "Select your gender",
    required: true,
    dataTestId: "gender-dropdown",
  },
  avatar: {
    label: "Avatar Picture (Optional)",
    required: false,
  },
};

const DetailsStep: React.FC<StepProps> = (stepInfo) => {
  const { watch, setValue } = useFormContext<FormData>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const countryInputRef = useRef<HTMLDivElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string>("");
  const [filteredCountries, setFilteredCountries] = useState(countries);
  const [inputValue, setInputValue] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const country = watch("country");
  const gender = watch("gender");
  const avatar = watch("avatar");

  // Get the display text for the selected country
  const selectedCountryText = React.useMemo(() => {
    if (country && !isSearching) {
      const foundCountry = countries.find((c) => c.key === country);
      return foundCountry?.text || "";
    }
    return "";
  }, [country, isSearching]);

  // Initialize input value when country changes
  useEffect(() => {
    if (country && !isSearching) {
      const foundCountry = countries.find((c) => c.key === country);
      if (foundCountry) {
        setInputValue(foundCountry.text);
      }
    }
  }, [country, isSearching]);

  const onSelectCountry = (countryKey: string, countryText: string) => {
    setValue("country", countryKey);
    setInputValue(countryText);
    setIsSearching(false);
    setShowDropdown(false);
    setFilteredCountries(countries);
  };

  const handleInputCountryChange = (value: string) => {
    setInputValue(value || "");
    setIsSearching(true);
    setShowDropdown(true);

    // Filter countries based on search input
    if (value && value.trim()) {
      const filtered = searchCountries(value.trim());
      setFilteredCountries(filtered);

      // Check if the input exactly matches a country name
      const exactMatch = countries.find(
        (c) => c.text.toLowerCase() === value.toLowerCase()
      );
      if (exactMatch) {
        setValue("country", exactMatch.key);
      } else {
        // Clear selection if no exact match while typing
        setValue("country", "");
      }
    } else {
      // Input is empty, clear everything
      setValue("country", "");
      setFilteredCountries(countries);
      setIsSearching(false);
    }
  };

  const handleCountryFocus = () => {
    setIsSearching(true);
    setShowDropdown(true);
    setFilteredCountries(countries);
  };

  const handleCountryBlur = () => {
    // Delay hiding dropdown to allow for selection
    setTimeout(() => {
      setShowDropdown(false);
      setIsSearching(false);

      // If there's a selected country, show its text
      if (country) {
        const foundCountry = countries.find((c) => c.key === country);
        if (foundCountry) {
          setInputValue(foundCountry.text);
        }
      } else {
        setInputValue("");
      }
    }, 200);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFileError("");

    if (file) {
      // Validate file type
      if (!validateFileType(file)) {
        setFileError("Please select a valid image file (JPEG, PNG, GIF)");
        return;
      }

      // Validate file size
      if (!validateFileSize(file)) {
        setFileError("File size must be less than 2MB");
        return;
      }

      setValue("avatar", file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="form-step">
      <Stack tokens={{ childrenGap: 20 }}>
        <h2>{stepInfo.title}</h2>
        <p>{stepInfo.description}</p>

        <div ref={countryInputRef} className="country-input-container">
          <TextField
            label={FormFieldProps.country.label}
            placeholder={FormFieldProps.country.placeholder}
            value={isSearching ? inputValue : selectedCountryText}
            onChange={(_, newValue) => handleInputCountryChange(newValue || "")}
            onFocus={handleCountryFocus}
            onBlur={handleCountryBlur}
            autoComplete="country"
            required
            errorMessage={stepInfo.errors.country}
            data-testid={FormFieldProps.country.dataTestId}
          />

          {showDropdown && filteredCountries.length > 0 && (
            <Callout
              target={countryInputRef.current}
              directionalHint={DirectionalHint.bottomLeftEdge}
              onDismiss={() => setShowDropdown(false)}
              isBeakVisible={false}
              className="country-dropdown"
            >
              <List
                items={filteredCountries}
                onRenderCell={(item) => (
                  <div
                    key={item?.key}
                    className={`country-option ${
                      item?.key === country ? "selected" : ""
                    }`}
                    onClick={() =>
                      onSelectCountry(item?.key || "", item?.text || "")
                    }
                    onMouseDown={(e) => e.preventDefault()} // Prevent blur from firing
                  >
                    {item?.text}
                  </div>
                )}
              />
            </Callout>
          )}
        </div>

        <Dropdown
          label={FormFieldProps.gender.label}
          placeholder={FormFieldProps.gender.placeholder}
          options={genderOptions}
          selectedKey={gender}
          onChange={(_, option) =>
            setValue("gender", (option?.key as string) || "")
          }
          required
          errorMessage={stepInfo.errors.gender}
          data-testid={FormFieldProps.gender.dataTestId}
          onRenderTitle={(options) => {
            return (
              <div className="dropdown-title-container">
                <span>
                  {options && options.length > 0
                    ? options[0].text
                    : FormFieldProps.gender.placeholder}
                </span>
              </div>
            );
          }}
        />

        {/* Avatar Upload */}
        <div className="avatar-upload-container">
          <label className="avatar-label">{FormFieldProps.avatar.label}</label>
          <div onClick={handleAvatarClick} className="avatar-clickable">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar preview"
                className="avatar-preview"
              />
            ) : (
              <div className="avatar-placeholder">
                <Icon iconName="Contact" className="avatar-icon" />
              </div>
            )}
          </div>
          <div>
            <PrimaryButton onClick={handleAvatarClick}>
              {avatar ? "Change Photo" : "Upload Photo"}
            </PrimaryButton>
            {avatar && (
              <p className="file-info">
                {avatar.name} ({formatFileSize(avatar.size)})
              </p>
            )}
            {fileError && <p className="file-error">{fileError}</p>}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="file-input-hidden"
              aria-label="Upload avatar image"
              title="Upload avatar image"
            />
          </div>
        </div>
      </Stack>
    </div>
  );
};

export default DetailsStep;
