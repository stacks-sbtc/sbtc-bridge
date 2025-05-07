export function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export const elide = (value: string, length = 20) => {
  if (!value) return "";
  return value.length > length
    ? `${value.slice(0, length / 2)}...${value.slice(-length / 2)}`
    : value;
};

export const getErrorMessage = (error: unknown): string => {
  // Handle the case where error object is wrapped in another object
  if (error != null && typeof error === "object" && "error" in error) {
    error = error.error;
  }

  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  if (error != null && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  return "Unknown error.";
};
