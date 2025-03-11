import { PencilIcon } from "@heroicons/react/24/solid";
import { CheckIcon } from "@heroicons/react/24/outline";

export function InputContainer({
  children,
  isReadonly,
  value,
  title,
  onClickEdit,
}: {
  children: React.ReactNode;
  isReadonly: boolean;
  value: string;
  title: string;
  onClickEdit?: () => void;
}) {
  return isReadonly ? (
    <div className="flex items-center justify-center">
      <div className="flex flex-col w-full gap-2">
        <div className="text-sm -tracking-tight ml-8">{title}</div>
        <div className="flex items-center w-full gap-2">
          <CheckIcon className="h-6 text-orange dark:text-dark-reskin-orange" />
          <div className="bg-orange bg-opacity-10 dark:dark-reskin-orange pl-5 rounded-3xl flex justify-between items-center flex-1">
            <div>{value}</div>
            <div
              className="h-8 flex justify-center items-center cursor-pointer w-10"
              onClick={onClickEdit}
            >
              <PencilIcon className="h-4 text-orange dark:text-dark-reskin-orange" />
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    children
  );
}
