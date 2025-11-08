import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from '@/components/ui/sidebar';
import { UsernameProvider } from '@/components/username-provider';
import AnimatedBackground from '@/components/animated-background';
import { ThemeProvider } from 'next-themes';


export const metadata: Metadata = {
  title: 'Nova AI',
  description: 'The all-in-one AI system with premium capabilities.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark">
            <AnimatedBackground />
            <UsernameProvider>
              <SidebarProvider>
                {children}
              </SidebarProvider>
            </UsernameProvider>
            <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
