import { IconEye, IconEyeOff } from "@tabler/icons-react";

interface ShowHidePasswordProps {
    showPassword: boolean;
    setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ShowHidePassword({ showPassword, setShowPassword }: ShowHidePasswordProps) {
  return (
    <div
      className={`absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer`}
    >
      <IconEye
        className={`${showPassword ? "hidden" : ""} h-6 w-6 text-muted-foreground`}
        onClick={() => setShowPassword(!showPassword)}
      />
      <IconEyeOff
        className={`${showPassword ? "" : "hidden"} h-6 w-6 text-muted-foreground`}
        onClick={() => setShowPassword(!showPassword)}
      />
    </div>
  );
}
