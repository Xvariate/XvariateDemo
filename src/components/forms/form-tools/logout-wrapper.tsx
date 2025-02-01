"use client";
import { logoutAction } from "@/actions/auth-actions/logout-action";

interface SignOutButtonProps {
  children?: React.ReactNode;
  asChild?: boolean;
}

export default function LogoutWrapper({ children }: SignOutButtonProps) {
  const onClick = () => {
    logoutAction();
  };

  return (
    <span className="cursor-pointer" onClick={onClick}>
      {children}
    </span>
  );
}