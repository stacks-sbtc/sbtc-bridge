export function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export const elide = (value: string, length = 20) => {
  if (!value) return "";
  return value.length > length
    ? `${value.slice(0, 10)}...${value.slice(-10)}`
    : value;
};
