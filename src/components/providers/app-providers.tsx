"use client";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import React from "react";

interface AppProvidersProps {
  children: React.ReactNode;
  session: Session | null;
}

export function AppProviders({ children, session }: AppProvidersProps) {
  return (
    <SessionProvider session={session}>
      <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </NextThemesProvider>
    </SessionProvider>
  );
}
