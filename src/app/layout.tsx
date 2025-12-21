import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from '@/components/ui/sidebar';
import { UsernameProvider } from '@/components/username-provider';
import { AccessProvider } from '@/components/access-provider';
import AnimatedBackground from '@/components/animated-background';
import { ThemeProvider } from 'next-themes';
import Script from 'next/script';
import { ShieldAlert } from 'lucide-react';

const IS_UNDER_MAINTENANCE = true;

export const metadata: Metadata = {
  title: IS_UNDER_MAINTENANCE ? 'Under Maintenance - Nova AI' : 'Nova AI',
  description: IS_UNDER_MAINTENANCE ? 'The site is currently under maintenance.' : 'The all-in-one AI system with premium capabilities.',
};

const MaintenancePage = () => (
  <div className="flex flex-col items-center justify-center h-screen w-screen bg-background text-foreground text-center p-4">
    <ShieldAlert className="h-16 w-16 text-primary mb-6" />
    <h1 className="text-4xl md:text-5xl font-bold mb-4">Under Maintenance</h1>
    <p className="text-lg text-muted-foreground mb-8">
      We are currently performing scheduled maintenance. Please check back soon.
    </p>
    <p className="text-sm text-foreground">@eternal_krish</p>
  </div>
);


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
        {IS_UNDER_MAINTENANCE ? (
          <>
            <AnimatedBackground />
            <MaintenancePage />
          </>
        ) : (
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
        )}
      </body>
    </html>
  );
}
