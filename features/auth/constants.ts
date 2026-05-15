export type Country = {
  name: string;
  code: string;
  dial: string;
  flag: string;
};

export const AUTH_GREEN = "#0DFF85";

export const COUNTRIES: Country[] = [
  { name: "Nigeria", code: "NG", dial: "+234", flag: "🇳🇬" },
  { name: "Ghana", code: "GH", dial: "+233", flag: "🇬🇭" },
  { name: "Kenya", code: "KE", dial: "+254", flag: "🇰🇪" },
  { name: "South Africa", code: "ZA", dial: "+27", flag: "🇿🇦" },
  { name: "United Kingdom", code: "GB", dial: "+44", flag: "🇬🇧" },
  { name: "United States", code: "US", dial: "+1", flag: "🇺🇸" },
];

export const OTP_LENGTH = 6;
export const OTP_RESEND_SECONDS = 60;
