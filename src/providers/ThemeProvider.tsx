'use client';
import React, { useEffect, useState } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export default function Provider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent hydration mismatch

  return (
  <NextThemesProvider 
      attribute="class"
      defaultTheme="light" 
      enableSystem={false}
      disableTransitionOnChange={true}
    >
      {children}
    </NextThemesProvider>
  );
}