import { IconCircleCheck } from "@tabler/icons-react";
interface FormSuccessMessageProps {
  message?: string;
}

export function FormSuccessMessage({ message }: FormSuccessMessageProps) {
  if (!message) return null;
  return (
    <div className="flex items-center justify-start rounded-md bg-emerald-500/15 p-3 text-sm text-emerald-500">
      <div className="w-1/12">
        <IconCircleCheck className="h-[1.1rem] w-[1.1rem]" />
      </div>
      <p className="w-11/12">{message}</p>
    </div>
  );
}
