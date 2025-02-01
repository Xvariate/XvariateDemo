import { ThemeSwitcher } from "@/components/ui/theme-switcher";

const AuthHeader = () => {
  return (
    <div className="fixed right-5 top-5">
      <ThemeSwitcher />
    </div>
  );
};

export default AuthHeader;
