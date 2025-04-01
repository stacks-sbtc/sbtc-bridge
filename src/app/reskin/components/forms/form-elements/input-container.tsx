import { PencilIcon } from "@heroicons/react/24/solid";
import { CheckIcon } from "@heroicons/react/24/outline";

export function InputContainer({
  children,
  isReadonly,
  value,
  title,
  onClickEdit,
  isEditable,
}: {
  children: React.ReactNode;
  isReadonly: boolean;
  value: string;
  title: string;
  onClickEdit?: () => void;
  isEditable?: boolean;
}) {
  return isReadonly ? (
    <div className="flex items-center justify-center">
      <div className="flex flex-col md:flex-row md:items-center md:gap-7 w-full gap-2">
        <div className="md:hidden text-sm -tracking-tight ml-8">{title}</div>
        <CheckIcon className="hidden md:block h-6 md:h-8 text-orange dark:text-dark-reskin-orange" />
        <div className="flex items-center w-full gap-2 rounded-2xl md:h-20 md:border md:border-orange md:dark:border-dark-reskin-orange">
          <CheckIcon className="md:hidden h-6 text-orange dark:text-dark-reskin-orange" />
          <div className="md:bg-transparent bg-orange bg-opacity-10 dark:dark-reskin-orange pl-5 md:px-6 rounded-3xl flex justify-between items-center flex-1">
            <div className="hidden md:block text-sm -tracking-tight ml-8 md:ml-0">
              {title}
            </div>
            <div
              onClick={onClickEdit}
              className="flex gap-2 font-matter-mono items-center rounded-3xl md:h-10 md:px-5 md:bg-lightOrange md:cursor-pointer md:dark:bg-input-label-dark"
            >
              <div>{value}</div>
              {isEditable && (
                <PencilIcon className="hidden md:block h-4 text-orange dark:text-dark-reskin-orange" />
              )}
            </div>
            <div
              className="md:hidden h-8 flex justify-center items-center cursor-pointer w-10"
              onClick={onClickEdit}
            >
              {isEditable && (
                <PencilIcon className="h-4 text-orange dark:text-dark-reskin-orange" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    children
  );
}
