import { cn } from "@/lib/utils";

interface DividerWithTextProps {
  className?: string;
  children?: React.ReactNode;
}

// The DividerWithText component (part of the FormWrapper. Can be used elsewhere)
export const DividerWithText = ({
  className,
  children,
}: DividerWithTextProps) => {
  return (
    <div className={cn("flex w-full items-center gap-x-2", className)}>
      <span className="h-[0.8px] w-1/2 bg-border" />
      {children}
      <span className="h-[0.8px] w-1/2 bg-border" />
    </div>
  );
};
