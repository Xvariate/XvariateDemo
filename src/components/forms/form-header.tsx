import { cn } from "@/lib/utils";

interface FormHeaderProps {
  headerHeading: string;
  headerDescription: string;
  className?: string;
}

// The FormHeader component (part of the FormWrapper)
export const FormHeader = ({
  headerHeading,
  headerDescription,
  className,
}: FormHeaderProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-start justify-center gap-y-2",
        className,
      )}
    >
      <h2 className="font-bold">{headerHeading}</h2>
      <p className="text-sm text-muted-foreground">{headerDescription}</p>
    </div>
  );
};
