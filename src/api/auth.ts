import axios from "axios";

// OTP Login
export const otpLogin = async (data: any) =>
  (await axios.post("/api/v1/accounts/otp/login/", data)).data;

// OTP Request
export const requestOtp = async (data: any) =>
  (await axios.post("/api/v1/accounts/otp/request/", data)).data;

// Password Reset
export const passwordReset = async (data: any) =>
  (await axios.post("/api/v1/accounts/password-reset/", data)).data;

export const passwordResetConfirm = async (data: any) =>
  (await axios.post("/api/v1/accounts/password-reset/confirm/", data)).data;

// Security Questions
export const securityQuestion = async (data: any) =>
  (await axios.post("/api/v1/accounts/security-question/", data)).data;

export const securityQuestionConfirm = async (data: any) =>
  (await axios.post("/api/v1/accounts/security-question/confirm/", data)).data;

// Token by phone
export const tokenByPhone = async (data: any) =>
  (await axios.post("/api/v1/accounts/token/phone/", data)).data;

// Account verification
export const initiateEmailVerification = async (data: any) =>
  (await axios.post("/api/v1/accounts/initiate-email-verification/", data)).data;

export const initiatePhoneVerification = async (data: any) =>
  (await axios.post("/api/v1/accounts/initiate-phone-verification/", data)).data;

export const verifyEmailOtp = async (data: any) =>
  (await axios.post("/api/v1/accounts/verify-email-otp/", data)).data;

export const verifyPhoneOtp = async (data: any) =>
  (await axios.post("/api/v1/accounts/verify-phone-otp/", data)).data;
