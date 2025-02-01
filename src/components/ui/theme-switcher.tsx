"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import {
  IconMoon,
  IconSun,
  IconCheck,
  IconDeviceDesktop,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {theme === "system" ? (
            <IconDeviceDesktop className="rotate-360 h-[1.2rem] w-[1.2rem] transition-all" />
          ) : (
            <>
              <IconSun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <IconMoon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </>
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="flex items-center justify-between"
          onClick={() => setTheme("light")}
        >
          Light
          {theme === "light" && <IconCheck className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center justify-between"
          onClick={() => setTheme("dark")}
        >
          Dark
          {theme === "dark" && <IconCheck className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center justify-between"
          onClick={() => setTheme("system")}
        >
          System
          {theme === "system" && <IconCheck className="h-4 w-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
