export const FormButton = ({
  children,
  disabled,
  onClick,
  className,
  variant = "primary",
  type = "button",
  ref,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary";
  type?: "button" | "submit" | "reset";
  ref?: React.RefObject<HTMLButtonElement>;
}) => {
  return (
    <button
      className={`flex items-center justify-center h-16 rounded-lg text-black text-xl uppercase disabled:cursor-not-allowed transition-all ${
        className || ""
      } ${
        variant === "primary"
          ? "bg-orange dark:bg-dark-reskin-orange disabled:bg-darkGray disabled:dark:bg-white disabled:opacity-20"
          : "bg-transparent text-button-secondary-text-light dark:text-midGray border border-button-secondary-text-light rounded-lg"
      }`}
      disabled={disabled}
      onClick={onClick}
      type={type}
      ref={ref}
    >
      {children}
    </button>
  );
};
