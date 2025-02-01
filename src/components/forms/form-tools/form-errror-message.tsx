import { IconAlertTriangle } from "@tabler/icons-react";
interface FormErrorMessageProps {
  message?: string;
}

export function FormErrorMessage({ message }: FormErrorMessageProps) {
  if (!message) return null;
  return (
    <div className="flex items-center justify-start rounded-md bg-destructive/15 p-3 text-sm text-destructive">
      <div className="w-1/12">
        <IconAlertTriangle className="h-[1.1rem] w-[1.1rem]" />
      </div>
      <p className="w-11/12">{message}</p>
    </div>
  );
}
