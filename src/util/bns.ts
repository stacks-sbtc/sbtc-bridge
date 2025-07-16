export function isValidBNSName(name: string): boolean {
  if (name) {
    const dotIndex = name.indexOf(".");
    return dotIndex > 0 && dotIndex < name.length - 1; // dot comes in between
  }
  return false;
}
