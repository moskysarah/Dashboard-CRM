declare module 'react-phone-input-2' {
  export interface CountryData {
    name: string;
    dialCode: string;
    countryCode: string;
    format: string;
  }

  export interface PhoneInputProps {
    country?: string;
    value?: string;
    onChange?: (value: string, country: CountryData, e: React.ChangeEvent<HTMLInputElement>, formattedValue: string) => void;
    inputClass?: string;
    containerClass?: string;
    buttonClass?: string;
    onlyCountries?: string[];
    enableSearch?: boolean;
    disableDropdown?: boolean;
    // Add other props as needed
  }

  const PhoneInput: React.ComponentType<PhoneInputProps>;
  export default PhoneInput;
}
