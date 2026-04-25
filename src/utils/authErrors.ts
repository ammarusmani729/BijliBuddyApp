type AuthLikeError = {
  code?: string;
  message?: string;
};

export const getFriendlyAuthErrorMessage = (error: AuthLikeError, fallback = "Authentication failed. Please try again.") => {
  const code = error?.code || "";

  const messages: Record<string, string> = {
    "auth/invalid-credential": "Invalid email or password.",
    "auth/wrong-password": "Invalid email or password.",
    "auth/user-not-found": "No account found for this email.",
    "auth/email-already-in-use": "This email is already registered.",
    "auth/weak-password": "Password must be at least 8 characters long.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/network-request-failed": "Network error. Please check your connection and try again.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",
    "auth/popup-closed-by-user": "Google sign-in was cancelled.",
    "auth/cancelled-popup-request": "Google sign-in was cancelled.",
    "auth/popup-blocked": "Google sign-in could not open. Please allow pop-ups and try again.",
    "auth/operation-not-allowed": "This sign-in method is currently disabled.",
    "auth/account-exists-with-different-credential": "An account already exists with a different sign-in method.",
    "auth/invalid-verification-code": "Invalid verification code.",
    "auth/invalid-verification-id": "Invalid verification details. Please try again.",
  };

  return messages[code] || fallback;
};