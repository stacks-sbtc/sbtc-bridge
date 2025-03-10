export const FormButton = ({
  children,
  disabled,
  onClick,
  className,
  variant = "primary",
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary";
}) => {
  return (
    <button
      className={`flex items-center justify-center h-16 rounded-lg text-black text-xl uppercase disabled:cursor-not-allowed transition-all ${
        className || ""
      } ${
        variant === "primary"
          ? "bg-orange dark:bg-dark-reskin-orange disabled:bg-darkGray disabled:dark:bg-white disabled:opacity-20"
          : "bg-transparent"
      }`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
