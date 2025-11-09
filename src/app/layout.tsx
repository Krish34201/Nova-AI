import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from '@/components/ui/sidebar';
import { UsernameProvider } from '@/components/username-provider';
import { AccessProvider } from '@/components/access-provider';
import AnimatedBackground from '@/components/animated-background';
import { ThemeProvider } from 'next-themes';
import Script from 'next/script';


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
        <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js" />
        <Script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.waves.min.js" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark">
            <AnimatedBackground />
            <UsernameProvider>
              <AccessProvider>
                <SidebarProvider>
                  {children}
                </SidebarProvider>
              </AccessProvider>
            </UsernameProvider>
            <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
