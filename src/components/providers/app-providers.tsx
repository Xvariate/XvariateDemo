"use client";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import React from "react";

// Define the props for the `AppProviders` component
interface AppProvidersProps {
  children: React.ReactNode; // The child components that this provider wraps
  session: Session | null; // The session data, which can be null if unauthenticated
}

export function AppProviders({ children, session }: AppProvidersProps) {
  return (
    // Wrap the application with the SessionProvider to handle user authentication state
    <SessionProvider session={session}>
      {/* Wrap the application with the NextThemesProvider to handle theming */}
      <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
        {children}
      </NextThemesProvider>
    </SessionProvider>
  );
}
