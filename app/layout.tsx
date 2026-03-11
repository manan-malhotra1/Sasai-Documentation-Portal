import { MessageCircleIcon } from 'lucide-react';
import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Poppins } from 'next/font/google';
import { AISearch, AISearchPanel, AISearchTrigger } from '@/components/search';
import { AuthProvider } from '@/components/auth-provider';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/cn';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={poppins.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
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
