export const isValidEmail = (email: string): boolean => {
  // Regex kiểm tra định dạng email tiêu chuẩn
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const validateEmail = (email: string): string => {
  if (!email || email.trim() === "") {
    return "Email is required";
  }
  if (!isValidEmail(email)) {
    return "Please enter a valid email address";
  }
  return "";
};

export const validatePassword = (password: string, isRegister = false): string => {
  if (!password) {
    return "Password is required";
  }
  if (isRegister && password.length < 6) {
    return "Password must be at least 6 characters";
  }
  return "";
};

export const validateConfirmPassword = (
  confirmPassword: string,
  password: string
): string => {
  if (!confirmPassword) {
    return "Confirm password is required";
  }
  if (confirmPassword !== password) {
    return "Passwords do not match";
  }
  return "";
};

