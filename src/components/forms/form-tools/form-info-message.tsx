import { IconInfoCircle } from "@tabler/icons-react";
interface FormInfoMessageProps {
  message?: string;
}

export function FormInfoMessage({ message }: FormInfoMessageProps) {
  if (!message) return null;
  return (
    <div className="flex animate-pulse items-center justify-start rounded-md bg-blue-500/15 p-3 text-sm text-blue-500">
      <div className="w-1/12">
        <IconInfoCircle className="h-[1.2rem] w-[1.2rem]" />
      </div>
      <p className="w-11/12">{message}</p>
    </div>
  );
}
