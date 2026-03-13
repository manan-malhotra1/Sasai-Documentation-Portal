import { MessageCircleIcon } from 'lucide-react';
import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { AISearch, AISearchPanel, AISearchTrigger } from '@/components/search';
import { AuthProvider } from '@/components/auth-provider';
import { SasaiThemeInit } from '@/components/sasai-theme-init';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { SASAI_BRANDING_THEME_CSS_URL } from '@/lib/sasai-branding';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href={SASAI_BRANDING_THEME_CSS_URL} />
      </head>
      <body className="flex flex-col min-h-screen">
        <SasaiThemeInit />
        <AuthProvider>
          <AISearch>
            <AISearchPanel />
            <AISearchTrigger
              position="float"
              className={cn(
                buttonVariants({
                  color: 'secondary',
                  className:
                    'w-auto rounded-2xl border border-fd-border/70 px-4 py-3 text-fd-muted-foreground shadow-lg',
                }),
              )}
            >
              <MessageCircleIcon className="size-4" />
              Ask Sasai
            </AISearchTrigger>
            <RootProvider>{children}</RootProvider>
          </AISearch>
        </AuthProvider>
      </body>
    </html>
  );
}
