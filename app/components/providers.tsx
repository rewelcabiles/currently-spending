'use client'

import { SidebarProvider } from '@/components/ui/sidebar'
import { ThemeProvider } from 'next-themes'

import { ReactNode } from 'react';

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
        <SidebarProvider className="flex flex-col flex-1">
                {children}
        </SidebarProvider>
    </ThemeProvider>
  )
}