export const formatError = (error) =>
  error?.response?.data?.message || "Something went wrong. Please try again.";
